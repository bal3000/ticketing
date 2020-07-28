import { Publisher, Subjects, TicketCreatedEvent } from '@tripb3000/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
