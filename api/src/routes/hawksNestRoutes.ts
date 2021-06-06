import express, { Request, Response } from 'express';
import {
  addHawksNestQuestion,
  editHawksNestQuestion,
  getHawksNestQuestion,
  submitHawksNestQuestion,
  unlockNestHints,
} from '../controllers/hawksNestController';
import { protect, isBanned, isAdmin, logIP } from '../middlewares/auth';
import { validateRequest } from '../middlewares/requestValidator';
import { body } from 'express-validator';
import { checkUserRegionUnlocked } from '../middlewares/region';

const router = express.Router();

router.get('/nest/', protect, getHawksNestQuestion);

router.post(
  '/nest/add',
  [
    body('text', 'text not entered').notEmpty(),
    body('answer', 'answer not enetered').notEmpty(),
  ],
  validateRequest,
  addHawksNestQuestion
);

router.put(
  '/nest/edit/:questionid',
  [
    body('text', 'text not entered').notEmpty(),
    body('answer', 'answer not enetered').notEmpty(),
  ],
  validateRequest,
  isAdmin,
  editHawksNestQuestion
);

router.post(
  '/nest/submit/:questionid',
  [body('attempt', 'attempt not enetered').notEmpty()],
  validateRequest,
  protect,
  logIP,
  submitHawksNestQuestion
);

router.post(
  '/nest/hints/unlock',
  [
    body('question', 'question not entered').notEmpty(),
    body('hintLevel', 'hintLevel not entered').notEmpty(),
  ],
  validateRequest,
  protect,
  isAdmin,
  unlockNestHints
);

export { router as nestRouter };
