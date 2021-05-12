import express, { Request, Response } from "express";
import {
  addQuestion,
  editQuestion,
  getQuestionByRegionId,
} from "../controllers/questionController";
import { protect, isBanned, isAdmin } from "../middlewares/auth";
import { validateRequest } from "../middlewares/requestValidator";
import { body } from "express-validator";

const router = express.Router();

router.get(
  "/questions/:regionId",
  [
    body("text", "text not entered").notEmpty(),
    body("answer", "answer not enetered").notEmpty(),
  ],
  validateRequest,
  isAdmin,
  getQuestionByRegionId
);

router.post(
  "/questions/add",
  [
    body("text", "text not entered").notEmpty(),
    body("answer", "answer not enetered").notEmpty(),
  ],
  validateRequest,
  addQuestion
);

router.put(
  "/questions/edit/:questionid",
  [
    body("text", "text not entered").notEmpty(),
    body("answer", "answer not enetered").notEmpty(),
  ],
  validateRequest,
  isAdmin,
  editQuestion
);

export { router as questionRouter };
