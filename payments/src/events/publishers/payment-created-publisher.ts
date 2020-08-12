import { Publisher, Subjects, PaymentCreatedEvent } from '@tripb3000/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
