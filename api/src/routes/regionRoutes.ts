import express, { Request, Response } from 'express';
import { addRegion } from '../controllers/regionController';
import { protect, isBanned } from '../middlewares/auth';
import { validateRequest } from '../middlewares/requestValidator';
import { body } from 'express-validator';

const router = express.Router();
router.post(
  '/regions/add',
  [
    body('name', 'name not entered').notEmpty(),
    body('description', 'description not enetered').notEmpty(),
  ],
  validateRequest,
  addRegion
);

export { router as regionRouter };
