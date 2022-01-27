/* eslint-disable newline-per-chained-call */
// For register validation

import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

// const User = mongoose.model('User');
import User from '../models/userModel';

export const displayRegisterForm = (_req: Request, res: Response): void => {
  res.render('register');
};

export const displayLoginForm = (_req: Request, res: Response): void => {
  res.render('login');
};

export const registerUser = async (
  req: Request, res: Response, next: NextFunction,
): Promise<void> => {
  const { email, name, password } = req.body;

  const emailTaken = await User.checkIfEmailInUse(email);

  if (emailTaken) {
    req.flash('error', 'Email taken!');
    res.redirect('/register');
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
