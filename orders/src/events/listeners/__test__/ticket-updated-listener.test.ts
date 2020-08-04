import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@tripb3000/common';

import { TicketUpdatedListener } from '../ticket-updated-listener';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'concert update',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, message };
};

it('finds and updates a ticket', async () => {
  const { listener, data, message, ticket } = await setup();

  // call the onmessage function with the data object + msg obj
  await listener.onMessage(data, message);

  // write assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.version).toBeGreaterThan(ticket.version);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();
  // call the onmessage function with the data object + msg obj
  await listener.onMessage(data, message);
  // write assertions to make sure a ack function was created
  expect(message.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async (done) => {
  const { listener, data, message } = await setup();
  data.version = 10;

  try {
    await listener.onMessage(data, message);
  } catch (error) {
    return done();
  }
  expect(message.ack).not.toHaveBeenCalled();
});
