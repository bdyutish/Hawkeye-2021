import express, { Request, Response, NextFunction } from 'express';
import { CustomErrors } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomErrors) {
    res.status(err.statusCode).send({
      errors: err.serializeError(),
    });
  } else {
    res.status(500).send({
      errors: [
        {
          message: 'Excpetion Faced',
          err: err,
        },
      ],
    });
  }
};
