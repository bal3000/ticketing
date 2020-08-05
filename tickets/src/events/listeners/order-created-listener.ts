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
    const ticket = Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    msg.ack();
  }
}
