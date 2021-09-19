/* eslint-disable newline-per-chained-call */
// For register validation

import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { body, check, validationResult } from 'express-validator';

// const User = mongoose.model('User');
import User from '../models/userModel';

export const displayRegisterForm = (_req: Request, res: Response): void => {
  res.render('register');
};

export const displayLoginForm = (_req: Request, res: Response): void => {
  res.render('login');
};

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

export const registerUser = async (
  req: Request, res: Response, next: NextFunction,
): Promise<void> => {
  const { email, name, password } = req.body;

  const emailTaken = await User.checkIfEmailInUse(email);

  if (emailTaken) {
    req.flash('error', 'Email taken!');
    res.redirect('back');
    return;
  }
  const user = new User({ email, name });
  await User.register(user, password);
  next();
};

export const loginUser = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Could not log in! Check credentials!',
  successRedirect: '/',
  successFlash: 'Successfully logged in!',
});

export const logout = (req: Request, res: Response): void => {
  req.logout();
  req.flash('success', 'Logged out!');
  res.redirect('/login');
};

export const checkNotAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    next();
    return;
  }
  req.flash('error', 'Can\'t perform this action while logged in');
  res.redirect('back');
};

export const checkAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user) {
    next();
    return;
  }

  if (req.path === '/') {
    req.flash('info', 'This application is based on user accounts. You must log in or create an account.');
  } else {
    req.flash('error', 'You have to be logged in to perform this action!');
  }
  res.redirect('/login');
};
