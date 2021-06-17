import Region, { RegionDoc } from '../models/Region';
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
      colorData: req.body.colorData,
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
    if (!req.currentUser)
      return next(new ErrorResponse('user not logged in', 403));
    const userRegions = req.currentUser?.regions;

    let regions: RegionDoc[] = [];

    for (let i = 0; i < userRegions?.length; i++) {
      const region = await Region.findById(userRegions[i].regionid);
      if (region) regions.push(region);
    }

    res.status(201).send(regions);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};
