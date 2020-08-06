import { Subjects } from '../subjects/subjects.enum';
import { Event } from './event.interface';

export interface TicketUpdatedEvent extends Event {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
    orderId?: string;
  };
}
