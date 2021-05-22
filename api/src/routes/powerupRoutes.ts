import express, { Request, Response } from 'express';
import {
  apply,
  getInventory,
  purchase,
} from '../controllers/powerupController';
import { protect, isBanned, isAdmin, logIP } from '../middlewares/auth';
import { validateRequest } from '../middlewares/requestValidator';
import { body } from 'express-validator';
import { checkUserRegionUnlocked } from '../middlewares/region';

const router = express.Router();

router.get('/shop/inventory', protect, getInventory);

router.post('/shop/buy/:id', protect, logIP, purchase);

router.post(
  '/shop/apply/:id',
  [
    body('regionid', 'regionid not enetered').notEmpty(),
    body('questionid', 'questionid not enetered').notEmpty(),
  ],
  validateRequest,
  protect,
  logIP,
  apply
);

export { router as shopRouter };
