import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@tripb3000/common';

import { createChargeRouter } from './routes/create-charge';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(currentUser);

app.use(createChargeRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
