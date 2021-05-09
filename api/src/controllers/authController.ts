import User from '../models/User';
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
  const { name, username, email, password, role } = req.body;

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
      role: role,
    });
    console.log('register');

    const regions = await Region.find();

    let regionArray: {
      regionid: mongoose.Schema.Types.ObjectId;
      multiplier: number;
    }[] = [];

    for (let i = 0; i < regions.length; i++) {
      regionArray.push({
        regionid: regions[i]._id,
        multiplier: 1,
      });
    }

    for (let i = regionArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [regionArray[i], regionArray[j]] = [regionArray[j], regionArray[i]];
    }

    // console.log(regionArray);

    user.regions = regionArray;

    await user.save();
    console.log('Register successful! ' + user);

    const token = user.getEmailToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/verify/${token}`;
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
    } catch (err) {
      return next(new ErrorResponse(err.name, err.code));
    }
    res.status(200).send(user);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('yeetsss');
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
      res.status(200).send('Logged in successfullyq');
    }
  } catch (err) {
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
  } catch (err) {
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
  } catch (err) {
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
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/resetpassword/${resetToken}`;
  const message = `Reset Your password at ${resetUrl}`;

  try {
    const resp = await fetch(
      'https://mail.iecsemanipal.com/hawk/resetpassword',
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
  } catch (err) {
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

    const resetUrl = `${req.protocol}://${req.get('host')}/verify/${token}`;
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
    } catch (err) {
      return next(new ErrorResponse(err.name, err.code));
    }

    res
      .status(200)
      .json({ success: true, data: 'Email sent with message: ' + message });
  } catch (err) {
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
  } catch (err) {
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
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};
