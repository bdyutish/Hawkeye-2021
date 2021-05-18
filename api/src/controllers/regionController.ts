import Region from '../models/Region';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../utils/ErrorResponse';

export const addRegion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = new Region({
      name: req.body.name,
      description: req.body.description,
    });

    await region.save();

    res.status(201).send(region);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const getAllRegions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const regions = await Region.find();
    res.status(201).send(regions);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};
