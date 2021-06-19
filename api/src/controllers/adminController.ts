import Region from '../models/Region';
import Question from '../models/Question';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../utils/ErrorResponse';
import Hint, { HintAttrs } from '../models/Hint';
import { Types } from 'mongoose';
import unlockedHint from '../models/unlockedHint';
import { unlockRegionsByUser } from '../utils/helperFunctions';
import HawksNestQuestion from '../models/HawksNestQuestion';

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
      .select(
        'name score lastUnlockedIndex nestLevel isBanned hawksNest phone email'
      )
      .sort({ score: -1 })
      .lean();
    res.status(200).send(leaderBoard);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

// adds hint to the hint Collection
export const addHint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // "+hints" is used to access hints where select: false in schema
    const question = await Question.findById(req.params.questionid);

    if (!question)
      return next(new ErrorResponse('Question does not exist', 400));

    // creates new hint
    const hint = new Hint({
      hintText: req.body.hintText,
      level: req.body.level,
      question: question._id,
    });
    await hint.save();

    return res.status(201).send(hint);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

// edits existing hint
export const editHint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hint = await Hint.findByIdAndUpdate(req.params.hintId, {
    hintText: req.body.hintText,
    level: req.body.level,
  });
  if (!hint) {
    return next(new ErrorResponse('hint couldnt be updated', 400));
  }
  return res.status(200).send({ success: true });
};

// deletes existing hint
export const deleteHint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hint = await Hint.findByIdAndDelete(req.params.hintId);
  if (!hint) {
    return next(new ErrorResponse('hint couldnt be deleted', 400));
  }

  return res.status(200).send({ success: true });
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

export const unlockHints = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question, regionIndex, hintLevel } = req.body;

    const hints = await unlockedHint.find({
      regionIndex,
      question,
      hintLevel,
    });
    if (hints.length > 0) {
      return next(new ErrorResponse('Already unlocked', 400));
    }
    const newHint = new unlockedHint({
      regionIndex,
      question,
      hintLevel,
    });

    await newHint.save();

    res.status(201).send({
      success: true,
      message: 'Hints unlocked succesfully',
    });
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const getRegionQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const questions = await Question.find({ region: req.params.regionid });
    res.status(200).send(questions);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const getQuestionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return next(new ErrorResponse('Question not found', 404));

    let hints = await Hint.find({ question: question._id }).sort({ level: 1 });

    res.status(200).send({
      success: true,
      question,
      hints,
    });
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const unlockRegionForAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userList = await User.find();
    for (let i = 0; i < userList.length; i++) {
      await unlockRegionsByUser(userList[i]);
      console.log('Done for ' + userList[i]._id);
    }
    res.status(200).send({ success: true });
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const getBannedUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bannedusers = await User.find({ isBanned: true });
    res.status(200).send({ success: true, data: bannedusers });
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const unlockHintByQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Hint.findByIdAndUpdate(req.params.hintid, { isUnlocked: true });
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const getHawksNestQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const questions = await HawksNestQuestion.find().sort({ level: 1 });
    res.status(200).send(questions);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};
