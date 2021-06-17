import Question from '../models/Question';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../utils/ErrorResponse';
import { compareAnswers, unlockRegion } from '../utils/helperFunctions';
import Region from '../models/Region';
import UnlockedHint from '../models/unlockedHint';
import Hint from '../models/Hint';

export const getQuestionByRegionId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.currentUser;
    let regionMult = false;
    if (!user) {
      return next(new ErrorResponse('User does not exist', 404));
    }

    let level;
    let index;
    for (let i = 0; i <= user.lastUnlockedIndex; i++) {
      if (
        user.regions[i].regionid.toString() == req.params.regionId.toString()
      ) {
        //check if region already completed
        if (user.regions[i].isCompleted == true) {
          return next(new ErrorResponse('Region already completed', 400));
        }
        level = user.regions[i].level;
        if (user.regions[i].multiplier > 1) regionMult = true;
        index = i;
        break;
      }
    }

    const question = await Question.findOne({
      //@ts-ignore
      region: req.params.regionId,
      level,
    }).populate('region');

    if (!question) return next(new ErrorResponse('Question not found', 404));

    let attempts: string[] = [];

    for (let i = 0; i < user.attempts.length; i++) {
      if (user.attempts[i].question.toString() == question._id) {
        attempts = user.attempts[i].userAttempts;
        break;
      }
    }

    attempts = attempts.reverse();

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

    let hints = await UnlockedHint.find({
      regionIndex: index,
      question: level,
    });

    for (let i = 0; i < hints.length; i++) {
      const hint = await Hint.findOne({
        question: question._id,
        level: hints[i].hintLevel,
      });
      qhints.push(hint);
    }

    res.status(201).send({
      regionMultiplier: regionMult,
      question,
      attempts,
      qhints,
      stats,
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

    let multiplier = 1;

    if (ratio == 1.0) {
      if (user.streakMultiplier > 1) {
        user.strikes = 3;
        await user.save();
      }
      for (let i = 0; i <= user?.lastUnlockedIndex; i++) {
        if (user.regions[i].regionid.toString() == question.region.toString()) {
          multiplier = user.regions[i].multiplier;
          user.score += 100 * multiplier * user.streakMultiplier;
          if (
            user.regions[i].level.toString() ==
            process.env.MAX_LEVEL?.toString()
          ) {
            user.regions[i].isCompleted = true;
            await user.save();
            await unlockRegion(req);
          } else {
            user.regions[i].level++;
            await user.save();
          }
        }
      }
      return res.status(200).send({
        success: true,
        score: user.score,
        regions: user.regions,
        nestUnlocked: user.hawksNest,
        strikes: user.strikes,
        message: 'Answer is correct',
      });
    }
    if (user.streakMultiplier > 1) {
      user.strikes--;
      if (user.strikes == 0) {
        user.streakMultiplier = 1;
        for (let i = 0; i < user.inventory.length; i++) {
          if (user.inventory[i].id == 3 && user.inventory[i].usedAt != null) {
            user.inventory[i].active = false;
            break;
          }
        }
      }
      await user.save();
    }
    if (ratio >= 0.6) {
      return res.status(200).send({
        success: false,
        message: "Hawk thinks you're close",
        strikes: user.strikes,
        close: true,
      });
    }
    return res.status(200).send({
      success: false,
      message: 'Incorrect answer',
      strikes: user.strikes,
    });
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};
