import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from '@tripb3000/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
