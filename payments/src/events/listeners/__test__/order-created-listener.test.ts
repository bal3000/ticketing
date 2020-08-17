import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@tripb3000/common';

import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models';

jest.setTimeout(30000);

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'qqwe',
    status: OrderStatus.Created,
    ticket: { id: new mongoose.Types.ObjectId().toHexString(), price: 10 },
  };

  // create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it('replicates the order info', async () => {
  const { listener, data, message } = await setup();

  // call the onmessage function with the data object + msg obj
  await listener.onMessage(data, message);

  const order = await Order.findById(data.id);

  expect(order).toBeDefined();
  expect(order?.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();

  // call the onmessage function with the data object + msg obj
  await listener.onMessage(data, message);

  // write assertions to make sure a ack function was created
  expect(message.ack).toHaveBeenCalled();
});
