import mongoose from 'mongoose';
import stringSimilarity from 'string-similarity';
import User, { UserDoc } from '../models/User';
import ErrorResponse from './ErrorResponse';
import { Request, Response, NextFunction } from 'express';
import { userInfo } from 'os';

const sanitize = (text: string) => {
  text = text.toLowerCase();
  text = text.replace(/[^a-z0-9]+/g, '');
  return text;
};

export const compareAnswers = (input: string, answer: string) => {
  const ratio = stringSimilarity.compareTwoStrings(
    sanitize(input),
    sanitize(answer)
  );
  console.log(ratio);
  return ratio;
};

export const unlockRegion = async (req: Request) => {
  const user = req.currentUser;

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  } else {
    if (user.lastUnlockedIndex < 5) user.lastUnlockedIndex++;
    else {
      let flag = true;
      for (let i = 0; i < user.regions.length; i++) {
        if (!user.regions[i].isCompleted) flag = false;
      }
      if (flag) user.hawksNest = true;
    }
    await user.save();
  }
};

export const unlockRegionsByUser = async (user: UserDoc) => {
  try {
    if (!user) {
      throw new ErrorResponse('User not found', 404);
    } else {
      if (user.lastUnlockedIndex < 5) user.lastUnlockedIndex++;
      else {
        let flag = true;
        for (let i = 0; i < user.regions.length; i++) {
          if (!user.regions[i].isCompleted) flag = false;
        }
        if (flag) user.hawksNest = true;
      }
      await user.save();
    }
  } catch (err) {
    console.log('Error for ' + user.name + '----> ' + err);
  }
};
