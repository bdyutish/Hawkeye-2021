import mongoose from 'mongoose';
import stringSimilarity from 'string-similarity';
import User from '../models/User';
import ErrorResponse from './ErrorResponse';
import { Request, Response, NextFunction } from 'express';

export const compareAnswers = (input: string, answer: string) => {
  const ratio = stringSimilarity.compareTwoStrings(input, answer);
  console.log(ratio);
  return ratio;
};

export const unlockRegion = async (req: Request) => {
  const user = req.currentUser;

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  } else {
    if (user.lastUnlockedIndex != 6) user.lastUnlockedIndex++;
    await user.save();
  }
};

export const checkUserRegionUnlocked = async (
  userid: mongoose.Schema.Types.ObjectId,
  regionId: mongoose.Schema.Types.ObjectId
) => {
  const user = await User.findById(userid);

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  } else {
    for (let i = 0; i < user.lastUnlockedIndex; i++) {
      if (user.regions[i].regionid == regionId) return true;
    }
  }
  return false;
};

export const hangman = (answer: string) => {
  let splitted = answer.split('');
  let count = 0;

  while (count < answer.length / 2) {
    let index = Math.floor(Math.random() * answer.length); //generate new index
    if (splitted[index] !== '_' && splitted[index] !== ' ') {
      splitted[index] = '_';
      count++;
    }
  }

  let newstring = splitted.join('');

  return newstring;
};

export const multiplyRegion = async (
  userid: mongoose.Schema.Types.ObjectId,
  regionId: mongoose.Schema.Types.ObjectId
) => {};
