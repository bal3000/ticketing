import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  OrderCreatedEvent,
  NotFoundError,
} from '@tripb3000/common';

import { Ticket } from '../../models/ticket';
import { queueGroupName } from './constants';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    // Get the ticket
    const ticket = await Ticket.findById(data.ticket.id);

    // Throw error if null
    if (!ticket) {
      throw new NotFoundError();
    }

    // Set the ticket as reserved
    ticket.set({ orderId: data.id });

    // Save ticket
    await ticket.save();

    // Ack the message
    msg.ack();
  }
}
