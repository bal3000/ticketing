import express, { Request, Response } from 'express';
import { NotFoundError } from '@tripb3000/common';

const router = express.Router();

router.delete('/api/orders/:orderId', async (req: Request, res: Response) => {
  res.send({});
});

export { router as deleteOrdersRouter };
