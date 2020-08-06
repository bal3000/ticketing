import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@tripb3000/common';

import { OrderCreatedListener } from '../order-created-listener';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: 'asd',
  });
  await ticket.save();

  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'qqwe',
    status: OrderStatus.Created,
    ticket: { ...ticket, id: ticket.id },
  };

  // create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, message };
};

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, message } = await setup();

  // call the onmessage function with the data object + msg obj
  await listener.onMessage(data, message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket?.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();

  // call the onmessage function with the data object + msg obj
  await listener.onMessage(data, message);

  // write assertions to make sure a ack function was created
  expect(message.ack).toHaveBeenCalled();
});
