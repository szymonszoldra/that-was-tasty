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
  req: Request, _res: Response, next: NextFunction,
): Promise<void> => {
  const { email, name, password } = req.body;
  const user = new User({ email, name });
  // @ts-ignore
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
