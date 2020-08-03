import { Subjects } from '../subjects/subjects.enum';
import { Event } from './event.interface';
import { OrderStatus } from '../types/order-status';

export interface OrderCreatedEvent extends Event {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    ticket: {
      id: string;
      price: number;
    };
    userId: string;
    expiresAt: string;
  };
}
