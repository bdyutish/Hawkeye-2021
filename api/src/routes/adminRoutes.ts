import express, { Request, Response } from 'express';
import { addHint, getLeaderboard } from '../controllers/adminController';
import { protect, isBanned, isAdmin } from '../middlewares/auth';
import { validateRequest } from '../middlewares/requestValidator';
import { body } from 'express-validator';

const router = express.Router();
router.get('/leaderboard', protect, isAdmin, getLeaderboard);

router.post('/hints/:questionid', addHint);

export { router as adminRouter };
