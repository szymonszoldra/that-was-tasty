/* eslint-disable newline-per-chained-call */
// For adding restaurant validation

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export { validateRegister } from './userValidator';
export { validateRestaurant } from './restaurantValidator';
export { validateMeal } from './mealValidator';

export const checkValidation = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((err) => {
      req.flash('error', err.msg);
    });
    res.redirect('back');
    return;
  }
  next();
};
