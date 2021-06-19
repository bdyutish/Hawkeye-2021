import HawksNestQuestion from '../models/HawksNestQuestion';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../utils/ErrorResponse';
import { compareAnswers, unlockRegion } from '../utils/helperFunctions';
import UnlockedHawksNestHint from '../models/HawksNestHintUnlocked';
import HawksNestHint from '../models/HawksNestHint';
import AttemptTime from '../models/AttemptTime';

export const addHawksNestQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = new HawksNestQuestion({
      text: req.body.text,
      answer: req.body.answer,
      hints: req.body.hints,
      keywords: req.body.keywords,
      level: req.body.level,
    });

    await question.save();

    res.status(201).send(question);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};
export const editHawksNestQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = await HawksNestQuestion.findByIdAndUpdate(
      req.params.questionid,
      {
        text: req.body.text,
        answer: req.body.answer,
        hints: req.body.hints,
        keywords: req.body.keywords,
        level: req.body.level,
      },
      { new: true, upsert: true, useFindAndModify: false }
    );

    res.status(201).send(question);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const getHawksNestQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.currentUser;
    if (!user) {
      return next(new ErrorResponse('User does not exist', 404));
    }

    if (!user.hawksNest)
      return next(new ErrorResponse('Nest not unlocked', 403));

    let level = user.nestLevel;

    const question = await HawksNestQuestion.findOne({
      level,
    });

    if (!question) return next(new ErrorResponse('Question not found', 404));

    let nestAttempts: string[] = [];

    for (let i = 0; i < user.nestAttempts.length; i++) {
      if (user.nestAttempts[i].question.toString() == question._id) {
        nestAttempts = user.nestAttempts[i].userAttempts;
        break;
      }
    }
    nestAttempts = nestAttempts.reverse();

    let atPar = await User.aggregate([
      {
        $match: {
          score: user.score,
        },
      },
      {
        $group: {
          _id: null,
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    let leading = await User.aggregate([
      {
        $match: {
          score: { $gt: user.score },
        },
      },
      {
        $group: {
          _id: null,
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    let lagging = await User.aggregate([
      {
        $match: {
          score: { $lt: user.score },
        },
      },
      {
        $group: {
          _id: null,
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // console.log(atPar[0].atPar);

    let eq = atPar[0] != undefined ? atPar[0].count : 0;
    let lead = leading[0] != undefined ? leading[0].count : 0;
    let lag = lagging[0] != undefined ? lagging[0].count : 0;

    let stats = {
      atPar: eq,
      leading: lead,
      lagging: lag,
    };

    let qhints = [];

    let hints = await UnlockedHawksNestHint.find({
      question: level,
    });

    for (let i = 0; i < hints.length; i++) {
      const hint = await HawksNestHint.findOne({
        question: question._id,
        level: hints[i].hintLevel,
      });
      qhints.push(hint);
    }

    res.status(201).send({
      question,
      nestAttempts,
      qhints,
      stats,
    });
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const submitHawksNestQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = await HawksNestQuestion.findById(
      req.params.questionid
    ).select('+answer');
    const user = req.currentUser;
    // console.log(question);

    if (!question) {
      return next(new ErrorResponse('Question does not exist', 404));
    }

    if (!user) {
      return next(new ErrorResponse('User does not exist', 404));
    }

    if (!user.hawksNest)
      return next(new ErrorResponse('Nest not unlocked', 403));

    // console.log(req.currentUser!._id);
    // console.log(question.attempts);

    let index = -1;
    for (let i = 0; i < user.nestAttempts.length; i++) {
      if (user.nestAttempts[i].question.toString() == question._id.toString()) {
        index = i;
        break;
      }
    }

    let timest = await AttemptTime.findOneAndUpdate(
      { user: user._id, question: question._id },
      { attempt: req.body.attempt, time: new Date(Date.now()) },
      { new: true, upsert: true }
    );

    if (index == -1) {
      user.nestAttempts.push({
        question: question._id,
        userAttempts: [req.body.attempt],
      });
    } else {
      user.nestAttempts[index].userAttempts.push(req.body.attempt);
    }

    console.log(index);

    await user.save();

    let ratio = compareAnswers(req.body.attempt, question.answer);

    let multiplier = 1;

    if (ratio == 1.0) {
      user.nestLevel += 1;
      user.score += 100;
      await user.save();
      return res.status(200).send({
        success: true,
        score: user.score,
        message: 'Answer is correct',
      });
    }
    if (ratio >= 0.6) {
      return res.status(200).send({
        success: false,
        message: "Hawk thinks you're close",
        close: true,
      });
    }
    return res
      .status(200)
      .send({ success: false, message: 'Incorrect answer' });
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const unlockNestHints = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question, hintLevel } = req.body;

    const newHint = new UnlockedHawksNestHint({
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

export const addNestHint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // "+hints" is used to access hints where select: false in schema
    const question = await HawksNestQuestion.findById(req.params.questionid);

    if (!question)
      return next(new ErrorResponse('Question does not exist', 400));

    // creates new hint
    const hint = new HawksNestHint({
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
