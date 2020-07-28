import { Publisher, Subjects, TicketUpdatedEvent } from '@tripb3000/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
