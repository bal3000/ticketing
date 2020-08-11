import request from 'supertest';
import mongoose from 'mongoose';
import { OrderStatus } from '@tripb3000/common';

import app from '../../app';
import { Order } from '../../models';

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ token: 'asd', orderId: mongoose.Types.ObjectId().toHexString() })
    .expect(404);
});

it('returns a 401 when purchasing an order that belongs to another user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: 10,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ token: 'asd', orderId: order.id })
    .expect(401);
});

it('returns a 400 when purchasing an order that has been cancelled', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    status: OrderStatus.Cancelled,
    version: 0,
    price: 10,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ token: 'asd', orderId: order.id })
    .expect(400);
});
