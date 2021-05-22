import Region from '../models/Region';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../utils/ErrorResponse';

const costs = {
  regionMult: 500,
};

export const purchase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const user = req.currentUser;
    if (!user) return next(new ErrorResponse('User not found', 404));
    if (id == '1') {
      //RegionMultipler

      if (user.powerupsHistory[0].available == 0)
        return next(new ErrorResponse('Out of stock', 400));

      if (user!.score < costs.regionMult)
        return next(new ErrorResponse('Not enough Credits', 400));

      user!.score -= costs.regionMult;

      user?.inventory.push({
        id: 1,
        purchasedAt: new Date(Date.now()),
        usedAt: null,
        powerupName: 'Region Multiplier',
        active: false,
        region: undefined,
        question: undefined,
      });

      user.powerupsHistory[0].available--;
      user.powerupsHistory[0].owned++;

      await user.save();

      res.status(200).send({
        success: true,
        updatedScore: user.score,
      });
    }
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const apply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const user = req.currentUser;
    if (!user) return next(new ErrorResponse('User not found', 404));
    if (id == '1') {
      for (let i = 0; i < user.inventory.length; i++) {
        if (user.inventory[i].id == 1 && user.inventory[i].usedAt == null) {
          user.inventory[i].usedAt = new Date(Date.now());
          user.inventory[i].region = req.body.regionid;
          user.inventory[i].question = req.body.questionid;
          user.inventory[i].active = true;
          break;
        }
      }

      for (let i = 0; i < user.regions.length; i++) {
        if (user.regions[i].regionid.toString() == req.body.regionid) {
          user.regions[i].multiplier *= 1.5;
        }
      }

      user.powerupsHistory[0].owned--;

      await user!.save();

      res.status(200).send({
        success: true,
      });
    }
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const getInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.currentUser;
    if (!user) return next(new ErrorResponse('User not found', 404));

    res.send(user.powerupsHistory);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};
