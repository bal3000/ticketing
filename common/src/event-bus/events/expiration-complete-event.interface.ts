import { Subjects } from '../subjects/subjects.enum';
import { Event } from './event.interface';

export interface ExpirationCompleteEvent extends Event {
  subject: Subjects.ExpirationComplete;
  data: {
    orderId: string;
  };
}
