import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  OrderCancelledEvent,
  NotFoundError,
} from '@tripb3000/common';

import { Ticket } from '../../models/ticket';
import { queueGroupName } from './constants';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCancelledEvent['data'],
    msg: Message
  ): Promise<void> {
    // Get the ticket
    const ticket = await Ticket.findById(data.ticket.id);

    // Throw error if null
    if (!ticket) {
      throw new NotFoundError();
    }

    // Set the ticket as not reserved
    ticket.set({ orderId: undefined });

    // Save ticket
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // Ack the message
    msg.ack();
  }
}
