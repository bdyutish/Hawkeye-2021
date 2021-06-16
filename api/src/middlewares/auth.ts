import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import IP from '../models/IP';
import { ForbiddenError } from '../errors/httpErrors/forbiddenError';
import ErrorResponse from '../utils/ErrorResponse';

/**
 * OUTPUT OF req.currentUser
 {
  role: 0,
  isBanned: false,
  _id: 606ec3790f6fe9f725ac65df,
  name: 'sarthak jha',
  username: 'jhasar1',
  email: '1@1.com',
  createdAt: 2021-04-08T08:48:57.243Z,
  __v: 0
}
 */

//Protect Routes
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //@ts-ignore
  let username = req.session!.user;
  if (!username) {
    // throw new ForbiddenError();   // NOT WORKING?
    return next(new ForbiddenError());
  } else {
    let user = await User.findOne({ username: username });
    if (!user || user.isBanned) {
      // throw new ForbiddenError(); // NOT WORKING?
      return next(new ForbiddenError());
    }
    req.currentUser = user;
    console.log('access granted');
    return next();
  }
};

// checks if the logged in user has admin clearance
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.currentUser!.role == 1) return next();
  return next(new ForbiddenError());
};

// checks if user is banned
export const isBanned = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.currentUser) {
    console.log('currentUser found');
    if (req.currentUser.isBanned) return next(new ForbiddenError());
    return next();
  }
  console.log('currentUser not found');
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (user.isBanned) return next(new ForbiddenError());
  }
  return next();
};

export const logIP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.currentUser;
    const ip = req.ip;
    const logs = await IP.findOne({ user: user!._id, ip: ip }).lean();

    if (!logs) {
      const log = new IP({
        user: user!._id,
        ip: ip,
        time: Date.now(),
      });
      console.log('Ip logged for ' + user!.name + '--->> ' + ip);
      await log.save();
    }
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
  return next();
};
