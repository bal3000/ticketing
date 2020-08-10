import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, OrderStatus } from '@tripb3000/common';

import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Order, Ticket } from '../../../models';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // create order and ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asdas',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // create a fake data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message, order };
};

it('creates and cancels a order', async () => {
  const { listener, data, message } = await setup();

  // call the onmessage function with the data object + msg obj
  await listener.onMessage(data, message);

  // write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();

  // call the onmessage function with the data object + msg obj
  await listener.onMessage(data, message);

  // write assertions to make sure a ack function was created
  expect(message.ack).toHaveBeenCalled();
});
