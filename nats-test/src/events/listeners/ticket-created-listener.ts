import { Listener } from './base-listener.abstract';
import { Message } from 'node-nats-streaming';
import { Subjects } from '../subjects.enum';
import { TicketCreatedEvent } from '../ticket-created-event.interface';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('Event data:', data);

    console.log(data.id);

    msg.ack();
  }
}
