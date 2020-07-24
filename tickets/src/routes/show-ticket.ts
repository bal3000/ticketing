import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { NotFoundError, validateRequest } from '@tripb3000/common';

import { Ticket } from '../models/ticket';

const router = express.Router();

router.get(
  '/api/tickets/:id',
  [param('id').isInt({ gt: 0 }).withMessage('Id is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return new NotFoundError();
    }

    res.send(ticket);
  }
);

export { router as showTicketRouter };
