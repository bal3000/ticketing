import { Publisher, OrderCancelledEvent, Subjects } from '@tripb3000/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
