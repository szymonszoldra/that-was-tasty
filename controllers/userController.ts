/* eslint-disable newline-per-chained-call */
// For register validation

import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { check, validationResult, sanitizeBody } from 'express-validator';

// const User = mongoose.model('User');
import User from '../models/userModel';

export const displayRegisterForm = (_req: Request, res: Response): void => {
  res.render('register');
};

export const displayLoginForm = (_req: Request, res: Response): void => {
  res.render('login');
};

export const validateRegister = [
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
  sanitizeBody('*').escape(),
];

export const checkValidation = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.mapped());
    res.status(422).json({
      success: false,
      data: req.body,
      errors: errors.mapped(),
    });
    return;
  }
  next();
};

export const registerUser = async (
  req: Request, res: Response, next: NextFunction,
): Promise<void> => {
  const { email, name, password } = req.body;

  const emailTaken = await User.checkIfEmailInUse(email);

  if (emailTaken) {
    res.redirect('back');
    return;
  }
  const user = new User({ email, name });
  await User.register(user, password);
  next();
};

export const loginUser = passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/',
});

export const logout = (req: Request, res: Response): void => {
  req.logout();
  res.redirect('/');
};
