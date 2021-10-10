/* eslint-disable newline-per-chained-call */
// For adding restaurant validation

import { Request, Response, NextFunction } from 'express';
import {
  check, CustomValidator, validationResult, body,
} from 'express-validator';

export function coordinatesValidation(value: any): [string, string] {
  if (value.length !== 2) throw new Error();

  let [lng, lat] = value;
  lng = Number(lng);
  lat = Number(lat);

  if (Number.isNaN(lng) || Number.isNaN(lat)) {
    throw new Error();
  }

  if (Math.abs(lng) > 180 || Math.abs(lat) > 90) {
    throw new Error();
  }

  return value as [string, string];
}

export const validateRestaurant = [
  check('name').trim().notEmpty().withMessage('Name required'),
  check('location.address').trim().notEmpty().withMessage('Restaurant address required'),
  check('location.coordinates').isArray().withMessage('Restaurant coordinates malformed'),
  check('location.coordinates').custom(coordinatesValidation as unknown as CustomValidator).withMessage('Lng Lat wrong format!'),
];

export const validateRegister = [
  body('*').escape(),
  check('email').trim().not().isEmpty().withMessage('Email is required'),
  check('email').trim().isEmail().withMessage('Invalid e-mail address!'),
  check('name').trim().not().isEmpty().withMessage('Name is required.'),
  check('password').trim().not().isEmpty().withMessage('Password is required.'),
  check('password').trim().isLength({ min: 3 }).withMessage('Password must be at least 3 characters long.'),
  check('password-confirm').trim().not().isEmpty().withMessage('Password corfirmation is required.'),
  check('password-confirm').trim().custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords don\'t match!');
    } else {
      return value;
    }
  }).withMessage('Passwords don\'t match!'),
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
