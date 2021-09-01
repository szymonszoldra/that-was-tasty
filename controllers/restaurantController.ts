/* eslint-disable newline-per-chained-call */
// For adding restaurant validation

import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const displayRestaurantForm = (_req: Request, res: Response): void => {
  res.render('restaurantForm');
};

export const validateRestaurant = [
  body('*').escape(),
];

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

export const addRestaurant = (req: Request, res: Response): void => {
  console.log(req.body);
  req.flash('success', 'Restaurant added!');
  res.redirect('/');
};
