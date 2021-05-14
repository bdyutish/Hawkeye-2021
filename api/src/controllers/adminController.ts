import Region from '../models/Region';
import Question from '../models/Question';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../utils/ErrorResponse';

export const getLeaderboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const leaderBoard = await User.find()
      .select('username score lastUnlockedIndex')
      .sort({ score: -1 })
      .lean();
    res.status(200).send(leaderBoard);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const addHint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = await Question.findById(req.params.questionid).select(
      '+hints'
    );
    if (!question) return next(new ErrorResponse('Question not found', 404));

    console.log(question.hints);

    for (let i = 0; i < req.body.hints.length; i++) {
      question.hints.push(req.body.hints[i]);
    }
    await question.save();
    res.status(200).send(question);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};
