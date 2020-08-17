import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@tripb3000/common';

import { createTicketRouter } from './routes/create-ticket';
import { showTicketRouter } from './routes/show-ticket';
import { getAllTicketsRouter } from './routes/get-all-tickets';
import { updateTicketRouter } from './routes/update-ticket';

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

app.use(createTicketRouter);
app.use(updateTicketRouter);
app.use(showTicketRouter);
app.use(getAllTicketsRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
