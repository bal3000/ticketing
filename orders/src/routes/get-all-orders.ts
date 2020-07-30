import express, { Request, Response } from 'express';
import { NotFoundError } from '@tripb3000/common';

const router = express.Router();

router.get('/api/orders', async (req: Request, res: Response) => {
  res.send({});
});

export { router as getAllOrdersRouter };
