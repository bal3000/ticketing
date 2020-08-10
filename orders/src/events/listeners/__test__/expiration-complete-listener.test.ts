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

it('updates the order status to cancelled', async () => {
  const { listener, data, message } = await setup();

  // call the onmessage function with the data object + msg obj
  await listener.onMessage(data, message);

  const updatedOrder = await Order.findById(data.orderId);

  expect(updatedOrder).toBeDefined();
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
  const { listener, data, message, order } = await setup();

  // call the onmessage function with the data object + msg obj
  await listener.onMessage(data, message);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eveData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eveData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();

  // call the onmessage function with the data object + msg obj
  await listener.onMessage(data, message);

  // write assertions to make sure a ack function was created
  expect(message.ack).toHaveBeenCalled();
});
