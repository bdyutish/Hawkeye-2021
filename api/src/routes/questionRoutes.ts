import express, { Request, Response } from 'express';
import { addQuestion } from '../controllers/questionController';
import { protect, isBanned } from '../middlewares/auth';
import { validateRequest } from '../middlewares/requestValidator';
import { body } from 'express-validator';

const router = express.Router();
router.post(
  '/questions/add',
  [
    body('text', 'text not entered').notEmpty(),
    body('answer', 'answer not enetered').notEmpty(),
  ],
  validateRequest,
  addQuestion
);

export { router as questionRouter };
