import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  NotFoundError,
  OrderStatus,
} from '@tripb3000/common';
import { Message } from 'node-nats-streaming';

import { queueGroupName } from './constants';
import { Order } from '../../models';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;
  async onMessage({ orderId }: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: orderId,
      version: order.version,
      ticket: { id: order.ticket.id },
    });

    msg.ack();
  }
}
