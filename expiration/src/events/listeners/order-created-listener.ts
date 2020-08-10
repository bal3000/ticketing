import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@tripb3000/common';

import { queueGroupName } from './constants';
import expirationQueue from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Order ${data.id}, waiting ${delay} ms before process`);

    await expirationQueue.add({ orderId: data.id }, { delay });
    // Ack the message
    msg.ack();
  }
}
