import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';

const validTicketObj = { title: 'test', price: 10 };

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send(validTicketObj)
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).put(`/api/tickets/${id}`).send(validTicketObj).expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(validTicketObj);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send(validTicketObj)
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(validTicketObj);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      ...validTicketObj,
      title: '',
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      ...validTicketObj,
      price: -10,
    })
    .expect(400);
});

it('updates a ticket with valid inputs', async () => {
  const cookie = global.signin();
  const newTitle = 'new title';
  const newPrice = 20;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(validTicketObj);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(204);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(newTitle);
  expect(ticketResponse.body.price).toEqual(newPrice);
});
