import express, { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/ErrorResponse';

export const errorhandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  //   console.log(err);
  error.message = err.message;

  //Log to console for dev
  console.log(error);

  //   Mongoose bad object id
  if (err.message === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  //Mongoose duplicate key
  if (err.statusCode === 11000) {
    const message = 'Duplicate field entered';
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  if (err.message === 'ValidationError') {
    error = new ErrorResponse(err.message, 400);
  }

  res
    .status(400)
    .json({ success: false, message: error.message || 'Server error' });
};
