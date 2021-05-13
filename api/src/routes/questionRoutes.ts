import express, { Request, Response } from 'express';
import {
  addQuestion,
  editQuestion,
  getQuestionByRegionId,
  submitQuestion,
} from '../controllers/questionController';
import { protect, isBanned, isAdmin } from '../middlewares/auth';
import { validateRequest } from '../middlewares/requestValidator';
import { body } from 'express-validator';
import { checkUserRegionUnlocked } from '../middlewares/region';

const router = express.Router();

router.get(
  '/questions/:regionId',
  protect,
  checkUserRegionUnlocked,
  getQuestionByRegionId
);

router.post(
  '/questions/add',
  [
    body('text', 'text not entered').notEmpty(),
    body('answer', 'answer not enetered').notEmpty(),
  ],
  validateRequest,
  addQuestion
);

router.put(
  '/questions/edit/:questionid',
  [
    body('text', 'text not entered').notEmpty(),
    body('answer', 'answer not enetered').notEmpty(),
  ],
  validateRequest,
  isAdmin,
  editQuestion
);

router.post(
  '/questions/submit/:questionid',
  [body('attempt', 'attempt not enetered').notEmpty()],
  validateRequest,
  protect,
  submitQuestion
);

export { router as questionRouter };
