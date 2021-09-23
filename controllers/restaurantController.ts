/* eslint-disable newline-per-chained-call */
// For adding restaurant validation

import {
  Request, Response, NextFunction,
} from 'express';
import { body, validationResult } from 'express-validator';

import Restaurant from '../models/restaurantModel';
import { CustomRequest } from '../utils/types';

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

export const addRestaurant = async (req: Request, res: Response): Promise<void> => {
  console.log(req.body);
  try {
    const restaurant = new Restaurant({
      ...req.body,
      // @ts-ignore
      user: req.user._id,
    });
    await restaurant.save();
  } catch (e) {
    console.log('ERROR', e);
  }

  req.flash('success', 'Restaurant added!');
  res.redirect('/');
};

export const showRestaurants = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const restaurants = await Restaurant.find({ user: req.user!._id });
    res.render('restaurants', { restaurants });
  } catch (e) {
    console.log(e);
  }
};

export const findSingleRestaurant = async (
  req: CustomRequest, res: Response, next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params;
    // @ts-ignore
    const restaurant = await Restaurant.findOne({ user: req.user!._id, slug });
    console.log(restaurant);
    if (!restaurant) throw new Error();

    req.restaurant = restaurant;
    next();
  } catch (e) {
    req.flash('error', '404 - Restaurant not found');
    res.redirect('back');
  }
};

export const showSingleRestaurant = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    res.render('singleRestaurant', { restaurant: req.restaurant });
  } catch (e) {
    console.log(e);
  }
};
