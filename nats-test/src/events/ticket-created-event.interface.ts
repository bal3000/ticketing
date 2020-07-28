import { Subjects } from './subjects.enum';
import { Event } from './event.interface';

export interface TicketCreatedEvent extends Event {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
