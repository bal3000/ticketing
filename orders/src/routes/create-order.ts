import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@tripb3000/common';

import { Order, Ticket } from '../models';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the db
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    // Run query to look at all orders. Find an order where the ticket
    // is the ticket we just found AND the orders status is NOT cancelled
    // If we find an order from this, it means its reserved
    const existingOrder = await ticket.isReserved();
    if (existingOrder) {
      throw new BadRequestError('The ticket is already reserved');
    }

    // Calculate an expiration date for the order
    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() +
        parseInt(process.env.EXPIRATION_WINDOW_MINUTES!) * 60
    );

    // Build the order and save it to db
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt,
      ticket,
    });
    await order.save();

    // Publish an event saying that an order was created
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: { id: ticket.id, price: ticket.price },
      userId: order.userId,
      status: order.status,
      expiresAt: expiresAt.toISOString(),
      version: order.version,
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
