import request from 'supertest';

import app from '../../app';
import { Ticket, Order, OrderStatus } from '../../models';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it('cancels the order', async () => {
  // Create ticket
  const ticket = await buildTicket();

  // Create order
  const user = global.signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request as user
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const cancelledOrder = await Order.findById(order.id);

  expect(cancelledOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('returns error if the order is deleted by the wrong user', async () => {
  // Create ticket
  const ticket = await buildTicket();

  // Create order
  const user = global.signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request as user
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});

it.todo('emits a order cancelled event');
