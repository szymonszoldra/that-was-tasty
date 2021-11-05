/* eslint-disable newline-per-chained-call */
// For adding restaurant validation

import { check, body } from 'express-validator';

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
