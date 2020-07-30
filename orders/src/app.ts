import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@tripb3000/common';

import { getAllOrdersRouter } from './routes/get-all-orders';
import { createOrdersRouter } from './routes/create-order';
import { deleteOrdersRouter } from './routes/delete-order';
import { getOrderRouter } from './routes/get-order';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(getAllOrdersRouter);
app.use(getOrderRouter);
app.use(createOrdersRouter);
app.use(deleteOrdersRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
