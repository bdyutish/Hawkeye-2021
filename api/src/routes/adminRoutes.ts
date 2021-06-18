import express, { Request, Response } from 'express';
import {
  addHint,
  getLeaderboard,
  banUser,
  UnbanUser,
  unlockHints,
  getRegionQuestions,
  getQuestionById,
  editHint,
  deleteHint,
  unlockRegionForAll,
  getBannedUsers,
  unlockHintByQuestion,
  getHawksNestQuestions,
} from '../controllers/adminController';
import { addQuestion, editQuestion } from '../controllers/adminController';
import { body } from 'express-validator';
import { protect, isAdmin } from '../middlewares/auth';
import { validateRequest } from './../middlewares/requestValidator';
import { addNestHint } from '../controllers/hawksNestController';

const router = express.Router();
router.get('/leaderboard', protect, isAdmin, getLeaderboard);

router.post(
  '/hints/add/:questionid',
  [
    body('hintText', 'text not entered').notEmpty(),
    body('level', 'level not entered').notEmpty(),
  ],
  validateRequest,
  protect,
  isAdmin,
  addHint
);

router.put(
  '/hints/edit/:hintId',
  [
    body('hintText', 'text not entered').notEmpty(),
    body('level', 'level not entered').notEmpty(),
  ],
  validateRequest,
  protect,
  isAdmin,
  editHint
);

router.delete('hints/delete/:hintId', protect, isAdmin, deleteHint);

router.post(
  '/hints/unlock',
  [
    body('regionIndex', 'regionIndex not entered').notEmpty(),
    body('question', 'question not entered').notEmpty(),
    body('hintLevel', 'hintLevel not entered').notEmpty(),
  ],
  validateRequest,
  protect,
  isAdmin,
  unlockHints
);

router.post('/unlock/:hintid', protect, isAdmin, unlockHintByQuestion);

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

router.get('/region/questions/:regionid', protect, isAdmin, getRegionQuestions);
router.get('/question/:id', protect, isAdmin, getQuestionById);

// ban and unban user
router.post('/user/ban/:userId', protect, isAdmin, banUser);
router.post('/user/unban/:userId', protect, isAdmin, UnbanUser);

router.post('/regions/unlock', protect, isAdmin, unlockRegionForAll);

router.get('/users/banned', protect, isAdmin, getBannedUsers);

router.get('/nest/questions/all', protect, isAdmin, getHawksNestQuestions);

router.post(
  '/nest/hints/add/:questionid',
  [
    body('hintText', 'text not entered').notEmpty(),
    body('level', 'level not entered').notEmpty(),
  ],
  validateRequest,
  protect,
  isAdmin,
  addNestHint
);

export { router as adminRouter };
