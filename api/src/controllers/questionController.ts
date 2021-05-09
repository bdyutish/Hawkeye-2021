import Question from '../models/Question';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../utils/ErrorResponse';

export const addQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = new Question({
      text: req.body.text,
      answer: req.body.answer,
      hints: req.body.hints,
      keywords: req.body.keywords,
      level: req.body.level,
      region: req.body.region,
    });

    await question.save();

    res.status(201).send(question);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};
