import express, { Request, Response } from 'express';
import {
  addHint,
  getLeaderboard,
  banUser,
  UnbanUser,
} from '../controllers/adminController';
import { addQuestion, editQuestion } from '../controllers/adminController';
import { body } from 'express-validator';
import { protect, isAdmin } from '../middlewares/auth';
import { validateRequest } from './../middlewares/requestValidator';

const router = express.Router();
router.get('/leaderboard', protect, isAdmin, getLeaderboard);

router.post('/hints/:questionid', protect, isAdmin, addHint);

router.post(
  '/questions/add',
  [
    body('text', 'text not entered').notEmpty(),
    body('answer', 'answer not enetered').notEmpty(),
    body('level', 'level not entered').notEmpty(),
  ],
  protect,
  isAdmin,
  validateRequest,
  addQuestion
);

router.put(
  '/questions/edit/:questionid',
  [
    body('text', 'text not entered').notEmpty(),
    body('answer', 'answer not enetered').notEmpty(),
  ],
  protect,
  isAdmin,
  validateRequest,
  editQuestion
);

// ban and unban user
router.post('/user/ban/:userId', protect, isAdmin, banUser);
router.post('/user/unban/:userId', protect, isAdmin, UnbanUser);

export { router as adminRouter };
