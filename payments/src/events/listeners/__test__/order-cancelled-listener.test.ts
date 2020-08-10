import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@tripb3000/common';

import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: orderId,
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    version: 0,
  });
  await order.save();

  // create a fake data event
  const data: OrderCancelledEvent['data'] = {
    version: 1,
    id: orderId,
    ticket: { id: new mongoose.Types.ObjectId().toHexString() },
  };

  // create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it('updates the the status of the order', async () => {
  const { listener, data, message } = await setup();

  // call the onmessage function with the data object + msg obj
  await listener.onMessage(data, message);

  const updatedOrder = await Order.findById(data.id);

  expect(updatedOrder).toBeDefined();
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();

  // call the onmessage function with the data object + msg obj
  await listener.onMessage(data, message);

  // write assertions to make sure a ack function was created
  expect(message.ack).toHaveBeenCalled();
});
