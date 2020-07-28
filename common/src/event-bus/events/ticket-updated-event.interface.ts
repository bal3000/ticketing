import { Subjects } from '../subjects/subjects.enum';
import { Event } from './event.interface';

export interface TicketUpdatedEvent extends Event {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
