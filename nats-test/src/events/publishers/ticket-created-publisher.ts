import { Publisher } from './base-publisher.abstract';
import { TicketCreatedEvent } from '../ticket-created-event.interface';
import { Subjects } from '../subjects.enum';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
