import User from '../models/User';
import IP from '../models/IP';
import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../utils/ErrorResponse';
import { MiscError } from '../errors/miscError';
import crypto from 'crypto';
import fetch from 'node-fetch';
import Region from '../models/Region';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    username,
    email,
    password,
    role,
    college,
    phone,
    regNo,
  } = req.body;

  let userTest = await User.findOne({ username });
  if (userTest)
    return next(new ErrorResponse('Username is already taken', 400));
  userTest = await User.findOne({ email });
  if (userTest) return next(new ErrorResponse('Email is already in use', 400));

  try {
    const user = new User({
      name: name,
      username: username,
      email: email,
      password: password,
      regNo: regNo,
      college: college,
      phone: phone,
      role: role,
    });
    console.log('register');

    const regions = await Region.find().sort({ name: 1 });

    let regionArray: {
      regionid: mongoose.Schema.Types.ObjectId;
      level: number;
      multiplier: number;
      isCompleted: boolean;
    }[] = [];

    for (let i = 0; i < regions.length; i++) {
      regionArray.push({
        regionid: regions[i]._id,
        level: 1,
        multiplier: 1,
        isCompleted: false,
      });
    }

    // for (let i = regionArray.length - 1; i > 0; i--) {
    //   const j = Math.floor(Math.random() * (i + 1));
    //   [regionArray[i], regionArray[j]] = [regionArray[j], regionArray[i]];
    // }

    // for (let i = 0; i < regionArray.length; i += 2) {
    //   const j = Math.random();
    //   if (j <= 0.5) {
    //     // console.log(j);
    //     const t = regionArray[i];
    //     regionArray[i] = regionArray[i + 1];
    //     regionArray[i + 1] = t;
    //   }
    // }

    // console.log(regionArray);

    user.regions = regionArray;

    user.lastUnlockedIndex = 0;

    user.powerupsHistory = [
      {
        id: 1,
        available: 2,
        owned: 0,
      },
      {
        id: 2,
        available: 1,
        owned: 0,
      },
      {
        id: 3,
        available: 2,
        owned: 0,
      },
      {
        id: 4,
        available: 2,
        owned: 0,
      },
    ];

    await user.save();
    console.log('Register successful! ' + user);

    const token = user.getEmailToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${process.env.HOST}/verify/${token}`;
    const message = `Click to verify ${resetUrl}`;

    try {
      const resp = await fetch(
        'https://mail.iecsemanipal.com/hawk/verifyaccount',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'hawkeyebestest145',
          },
          body: JSON.stringify({
            toEmail: user.email,
            name: user.name,
            link: resetUrl,
          }),
        }
      );
    } catch (err:any) {
      return next(new ErrorResponse(err.name, err.code));
    }
    const resp = user.toJSON();
    res.status(200).send({ ...resp, password: undefined });
  } catch (err:any) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const now = new Date(Date.now());
    const start = new Date('2021-06-19T06:30:00.000Z');
    console.log(now + ' ' + start);
    if (now < start)
      return next(new ErrorResponse('Hawkeye has not started yet', 404));

    const { email, password } = req.body;
    if (!email || !password) {
      console.log('email or password not provided'); //Replace later with middleware
    }
    const user = await User.findOne({ email }).select('+password');
    let isMatch: boolean;
    isMatch = false;
    if (!user) {
      isMatch = false;
      return next(new ErrorResponse('User does not exist', 404));
    } else {
      if (!user.isVerified)
        return next(new ErrorResponse('User not verified', 400));
      // await is ESSENTIAL
      isMatch = await user.matchPassword(password);
      console.log(isMatch);
    }
    // res.send(password + ' ' + isMatch);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    } else {
      req.session!.user = user.username;
      console.log(req.session!.user);

      const logs = await IP.findOne({ user: user!._id, ip: req.ip }).lean();

      console.log('Ip logged for ' + user!.name + '--->> ' + req.ip);

      if (!logs) {
        const log = new IP({
          user: user!._id,
          ip: req.ip,
          time: Date.now(),
        });
        await log.save();
      }

      res.status(200).send('Logged in successfullyq');
    }
  } catch (err:any) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.session!.destroy((err) => {
      console.log(req.sessionID);
      if (err) {
        return console.log(err);
      }
    });
    console.log(req.session);
    res.status(200).send('Logged Out');
  } catch (err:any) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const getme = async (req: Request, res: Response) => {
  res.status(200).send(req.currentUser);
};

export const getProfileById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.userid);
    if (!user) {
      return next(new ErrorResponse('User Not Found', 404));
    }
    res.status(200).send(user);
  } catch (err:any) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new ErrorResponse('User does not exist', 404));

  //Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //Create reset url
  const resetUrl = `${req.protocol}://${process.env.HOST}/resetpassword/${resetToken}`;
  const message = `Reset Your password at ${resetUrl}`;

  try {
    const resp = await fetch(
      'https://mail.iecsemanipal.com/hawk/forgotpassword',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'hawkeyebestest145',
        },
        body: JSON.stringify({
          toEmail: user.email,
          name: user.name,
          link: resetUrl,
        }),
      }
    );
  } catch (err:any) {
    return next(new ErrorResponse(err.name, err.code));
  }

  try {
    res
      .status(200)
      .json({ success: true, data: 'Email sent with message: ' + message });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = '';
    user.resetPasswordExpire = '';

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email not send', 500));
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    if (user.isVerified) {
      return next(new ErrorResponse('User already verified', 404));
    }
    const token = user.getEmailToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${process.env.HOST}/verify/${token}`;
    const message = `Click to verify ${resetUrl}`;

    try {
      const resp = await fetch(
        'https://mail.iecsemanipal.com/hawk/verifyaccount',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'hawkeyebestest145',
          },
          body: JSON.stringify({
            toEmail: user.email,
            name: user.name,
            link: resetUrl,
          }),
        }
      );
    } catch (err:any) {
      return next(new ErrorResponse(err.name, err.code));
    }

    res
      .status(200)
      .json({ success: true, data: 'Email sent with message: ' + message });
  } catch (err:any) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Get hashed token
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: new Date(Date.now()).toISOString() },
    });

    if (!user) {
      return next(new ErrorResponse('Invalid Token', 400));
    }

    //Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).send(user);
  } catch (err:any) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Get hashed token
  try {
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.emailtoken)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
    });

    if (!user) {
      return next(new ErrorResponse('Invalid Token', 400));
    }

    //Set new password
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.status(200).send(user);
  } catch (err:any) {
    return next(new ErrorResponse(err.name, err.code));
  }
};
