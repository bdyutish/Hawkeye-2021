import express, { Request, Response } from 'express';
import { addRegion, getAllRegions } from '../controllers/regionController';
import { protect, isBanned, isAdmin } from '../middlewares/auth';
import { validateRequest } from '../middlewares/requestValidator';
import { body } from 'express-validator';

const router = express.Router();
router.post(
  '/regions/add',
  [
    body('name', 'name not entered').notEmpty(),
    body('description', 'description not enetered').notEmpty(),
    body('colorData', 'colorData cant be empty').notEmpty(),
  ],
  validateRequest,
  protect,
  isAdmin,
  addRegion
);

router.get('/regions/', protect, getAllRegions);
export { router as regionRouter };
