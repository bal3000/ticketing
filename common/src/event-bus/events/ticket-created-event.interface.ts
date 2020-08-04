import { Subjects } from '../subjects/subjects.enum';
import { Event } from './event.interface';

export interface TicketCreatedEvent extends Event {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
  };
}
