import { Subjects } from '../subjects/subjects.enum';
import { Event } from './event.interface';

export interface OrderCancelledEvent extends Event {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    };
  };
}
