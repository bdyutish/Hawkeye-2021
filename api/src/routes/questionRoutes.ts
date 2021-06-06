import express, { Request, Response } from 'express';
import {
  getQuestionByRegionId,
  submitQuestion,
} from '../controllers/questionController';
import { addQuestion, editQuestion } from './../controllers/adminController';
import { protect, isBanned, isAdmin, logIP } from '../middlewares/auth';
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
  protect,
  isAdmin,
  addQuestion
);

router.put(
  '/questions/edit/:questionid',
  [
    body('text', 'text not entered').notEmpty(),
    body('answer', 'answer not enetered').notEmpty(),
  ],
  validateRequest,
  protect,
  isAdmin,
  editQuestion
);

router.post(
  '/questions/submit/:questionid',
  [body('attempt', 'attempt not enetered').notEmpty()],
  validateRequest,
  protect,
  logIP,
  submitQuestion
);

export { router as questionRouter };
