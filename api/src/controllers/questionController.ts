import Question from '../models/Question';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../utils/ErrorResponse';
import { compareAnswers, unlockRegion } from '../utils/helperFunctions';

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

export const getQuestionByRegionId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.currentUser;
    if (!user) {
      return next(new ErrorResponse('User does not exist', 404));
    }

    let level;
    for (let i = 0; i <= user.lastUnlockedIndex; i++) {
      if (
        user.regions[i].regionid.toString() == req.params.regionId.toString()
      ) {
        level = user.regions[i].level;
        break;
      }
    }

    const question = await Question.findOne({
      //@ts-ignore
      region: req.params.regionId,
      level,
    });

    if (!question) return next(new ErrorResponse('Question not found', 404));

    let attempts;

    for (let i = 0; i < user.attempts.length; i++) {
      if (user.attempts[i].question.toString() == question._id) {
        attempts = user.attempts[i].userAttempts;
        break;
      }
    }
    let response: Object;
    // response.question = question;
    // response.attempts = attempts;
    res.status(201).send({
      question,
      attempts,
    });
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const submitQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = await Question.findById(req.params.questionid).select(
      '+answer'
    );
    const user = req.currentUser;
    // console.log(question);

    if (!question) {
      return next(new ErrorResponse('Question does not exist', 404));
    }

    if (!user) {
      return next(new ErrorResponse('User does not exist', 404));
    }

    // console.log(req.currentUser!._id);
    // console.log(question.attempts);

    let index = -1;
    for (let i = 0; i < user.attempts.length; i++) {
      if (user.attempts[i].question.toString() == question._id.toString()) {
        index = i;
        break;
      }
    }

    if (index == -1) {
      user.attempts.push({
        question: question._id,
        userAttempts: [req.body.attempt],
      });
    } else {
      user.attempts[index].userAttempts.push(req.body.attempt);
    }

    console.log(index);

    await user.save();

    let ratio = compareAnswers(req.body.attempt, question.answer);

    if (ratio == 1.0) {
      for (let i = 0; i <= user?.lastUnlockedIndex; i++) {
        if (user.regions[i].regionid.toString() == question.region.toString()) {
          if (
            user.regions[i].level.toString() ==
            process.env.MAX_LEVEL?.toString()
          ) {
            unlockRegion(req);
          } else {
            user.regions[i].level++;
            await user.save();
          }
        }
      }
      return res
        .status(200)
        .send({ success: true, message: 'Answer is correct' });
    }
    if (ratio >= 0.6) {
      return res
        .status(200)
        .send({ success: false, message: "Hawk thinks you're close" });
    }
    for (let i = 0; i < question.keywords.length; i++) {
      ratio = compareAnswers(req.body.attempt, question.keywords[i]);
      if (ratio >= 0.9)
        return res
          .status(200)
          .send({ success: false, message: "Hawk thinks you're close" });
    }
    return res
      .status(200)
      .send({ success: false, message: 'Incorrect answer' });
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};
