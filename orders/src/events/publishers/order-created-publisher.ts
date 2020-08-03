import { Publisher, OrderCreatedEvent, Subjects } from '@tripb3000/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
