import { Subjects } from '../subjects/subjects.enum';
import { Event } from './event.interface';

export interface PaymentCreatedEvent extends Event {
  subject: Subjects.PaymentCreated;
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}
