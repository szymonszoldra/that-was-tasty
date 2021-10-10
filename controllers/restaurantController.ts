import {
  Request, Response, NextFunction,
} from 'express';
import * as fs from 'fs';

import Restaurant, { RestaurantDocument } from '../models/restaurantModel';
import { CustomRequest } from '../utils/types';
import { tags as restaurantTags } from '../utils/utils';

export const displayRestaurantForm = (_req: Request, res: Response): void => {
  res.render('restaurantForm');
};

/**
 * When only one tag was checked html form treats it as a string instead of an array with the length
 * of 1. So i have to make sure that req.body.tags is of the array type so the .every() method
 * works fine. Also when no tag was checked or the tags are malformed by messing with the devtools
 * default and only tag will be 'Other'.
 */
export const parseTags = (req: Request, res: Response, next: NextFunction): void => {
  if (typeof req.body.tags === 'string') req.body.tags = [req.body.tags];
  if (!req.body.tags
    || req.body.tags[0] === 'Other'
    || !req.body.tags.every((tag: string) => restaurantTags.includes(tag))) {
    req.body.tags = ['Other'];
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

export const checkIfRestaurantExists = async (
  req: CustomRequest, res: Response, next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      req.flash('error', 'No such restaurant');
      res.redirect('back');
    }

    req.restaurant = restaurant;
    next();
  } catch (error) {
    console.error(error);
  }
};

export const displayRestaurantEditForm = (req: CustomRequest, res: Response): void => {
  res.render('restaurantForm', { restaurant: req.restaurant });
};

export const editRestaurant = async (req: CustomRequest, res: Response): Promise<void> => {
  req.body.location.type = 'Point';
  console.log(req.body);

  if (req.body.photo) {
    try {
      fs.unlinkSync(`./static/photos/${req.restaurant!.photo}`);
    } catch (error) {
      console.error(`Error while deleting the file ${req.restaurant!.photo}`);
    }
  }

  try {
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: req.restaurant!.id },
      req.body, {
        new: true,
        runValidators: true,
      },
    ) as RestaurantDocument;
    res.redirect(`/restaurant/${updatedRestaurant.slug}`);
  } catch (error) {
    console.log(error);
    req.flash('error', 'Error while updating restaurant');
    res.redirect('back');
  }
};
