import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  OrderStatus,
  NotAuthorizedError,
} from '@tripb3000/common';

import { Order } from '../models';
import stripe from '../stripe';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty().withMessage('Token is required'),
    body('orderId').not().isEmpty().withMessage('OrderId is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order');
    }

    try {
      await stripe.charges.create({
        amount: order.price * 100,
        currency: 'GBP',
        source: token,
      });
    } catch (err) {
      throw new Error('Payment failed');
    }

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
