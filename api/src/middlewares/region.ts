import { ForbiddenError } from "../errors/httpErrors/forbiddenError";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import mongoose from "mongoose";
import { nextTick } from "process";
import ErrorResponse from "../utils/ErrorResponse";

export const checkUserRegionUnlocked = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.currentUser;
  const region = req.params.regionId;
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  } else {
    for (let i = 0; i <= user.lastUnlockedIndex; i++) {
      if (user.regions[i].regionid.toString() == region.toString())
        return next();
    }
  }
<<<<<<< HEAD
  return next(new ErrorResponse("Region not unlocked", 404));
=======
  return next(new ErrorResponse('Region Locked', 400));
>>>>>>> 998ac73991a04a0d7f84a23223f24b59a2af7023
};
