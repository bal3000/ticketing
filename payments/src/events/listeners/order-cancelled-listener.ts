import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  OrderCancelledEvent,
  NotFoundError,
  OrderStatus,
} from '@tripb3000/common';

import { Order } from '../../models';
import { queueGroupName } from './constants';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCancelledEvent['data'],
    msg: Message
  ): Promise<void> {
    // Get the order
    const order = await Order.findByEvent({ ...data });

    // Throw error if null
    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Cancelled });

    // Save order
    await order.save();

    // Ack the message
    msg.ack();
  }
}
