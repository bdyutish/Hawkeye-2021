import Region from '../models/Region';
import Question, { Hint } from '../models/Question';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../utils/ErrorResponse';

export const addQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // checks if region exists
    const region = await Region.findById(req.body.region);
    if (!region) {
      return res.status(400).send({
        err: 'region doesnt exist',
      });
    }
    const question = new Question({
      text: req.body.text,
      answer: req.body.answer,
      hints: req.body.hints,
      level: req.body.level,
      region: req.body.region,
    });

    await question.save();

    return res.status(201).send(question);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};
export const editQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.questionid,
      {
        text: req.body.text,
        answer: req.body.answer,
        hints: req.body.hints,
        keywords: req.body.keywords,
        level: req.body.level,
        region: req.body.region,
      },
      { new: true, upsert: true, useFindAndModify: false }
    );

    res.status(201).send(question);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};
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
    // "+hints" is used to access hints where select: false in schema
    const question = await Question.findById(req.params.questionid).select(
      '+hints'
    );
    if (!question) return next(new ErrorResponse('Question not found', 404));

    console.log(question.hints);

    for (let i = 0; i < req.body.hints.length; i++) {
      const hint: Hint = {
        hint: req.body.hints[i].hint,
        level: req.body.hints[i].level,
      };
      question.hints.push(hint);
    }
    await question.save();
    return res.status(200).send(question);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

// controller for BANNING the user
export const banUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById(req.params.userId);
  if (!user) return next(new ErrorResponse('User cant be found', 400));
  user.isBanned = true;
  await user.save();
  return res.status(200).send({
    success: true,
  });
};

// controller for UNBANNING the user
export const UnbanUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById(req.params.userId);
  if (!user) return next(new ErrorResponse('User cant be found', 400));
  user.isBanned = false;
  await user.save();
  return res.status(200).send({
    success: true,
  });
};
