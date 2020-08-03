import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@tripb3000/common';

import { Ticket } from '../../models/ticket';
import { queueGroupName } from './constants';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: TicketCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const { title, price } = data;
    const ticket = Ticket.build({
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
