import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).send('hello world');
});

export { router as indexRouter };
