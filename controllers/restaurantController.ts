import {
  Request, Response, NextFunction,
} from 'express';
import slugify from 'slugify';
import * as fs from 'fs';
import Meal, { MealDocument } from '../models/mealModel';
import Restaurant, { RestaurantDocument } from '../models/restaurantModel';

import { CustomRequest } from '../utils/types';
import { tags as restaurantTags } from '../utils/utils';

import * as logger from '../utils/logger';

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
  logger.info(req.body);
  try {
    const restaurant = new Restaurant({
      ...req.body,
      // @ts-ignore
      user: req.user._id,
    });
    await restaurant.save();
  } catch (e) {
    logger.error('ERROR', e);
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
    logger.error(e);
  }
};

export const findSingleRestaurant = async (
  req: CustomRequest, res: Response, next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params;
    // @ts-ignore
    const restaurant = await Restaurant.findOne({ user: req.user!._id, slug }).populate('meals');
    logger.info(restaurant);
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
    logger.error(e);
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
    logger.error(error);
  }
};

export const displayRestaurantEditForm = (req: CustomRequest, res: Response): void => {
  res.render('restaurantForm', { restaurant: req.restaurant });
};

export const editRestaurant = async (req: CustomRequest, res: Response): Promise<void> => {
  req.body.location.type = 'Point';
  logger.info(req.body);

  if (req.body.photo) {
    try {
      fs.unlinkSync(`./static/photos/${req.restaurant!.photo}`);
    } catch (error) {
      logger.error(`Error while deleting the file ${req.restaurant!.photo}`);
    }
  }

  try {
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: req.restaurant!.id },
      {
        ...req.body,
        slug: slugify(req.body.name),
      }, {
        new: true,
        runValidators: true,
      },
    ) as RestaurantDocument;
    res.redirect(`/restaurant/${updatedRestaurant.slug}`);
  } catch (error) {
    logger.error(error);
    req.flash('error', 'Error while updating restaurant');
    res.redirect('back');
  }
};

export const deleteRestaurant = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const restaurant = await req.restaurant!.populate('meals').execPopulate();

    const promises: any = [];
    restaurant.meals!.forEach((meal) => {
      promises.push(Meal.findByIdAndDelete(meal));
      fs.unlinkSync(`./static/photos/${(meal as unknown as MealDocument).photo}`);
    });

    await Promise.all(promises);

    fs.unlinkSync(`./static/photos/${restaurant.photo}`);
    await restaurant.delete();

    req.flash('success', 'Restaurant and all meals deleted!');
    res.redirect('/restaurants');
  } catch (error) {
    logger.error(error);
  }
};

export const getTags = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const tagsPromise = Restaurant.getTags(req.user!._id);
    const restaurantsPromise = Restaurant.find({
      // @ts-ignore
      user: req.user!._id,
      tags: req.params.tag || { $exists: true },
    });

    const [tags, restaurants] = await Promise.all([tagsPromise, restaurantsPromise]);

    res.render('tags', {
      tags,
      restaurants,
      tagPath: req.params.tag,
    });
  } catch (e) {
    logger.error(e);
    req.flash('error', 'Something went wrong!');
    res.redirect('/');
  }
};

export const checkIfMapShouldBeUpdated = async (
  req: CustomRequest, res: Response, next: NextFunction,
) => {
  const [lng, lat] = req.restaurant?.location?.coordinates as [number, number];

  if (req.body.location.coordinates[0] !== lng || req.body.location.coordinates[1] !== lat) {
    logger.info('Changing static map!');
    try {
      fs.unlinkSync(`./static/maps/${req.restaurant?.map}`);
      req.restaurant!.location!.coordinates = req.body.location.coordinates;
    } catch (e) {
      logger.error(e);
    }
    req.restaurant!.map = undefined;
  }
  next();
};

export const getTop = async (req: CustomRequest, res: Response) => {
  try {
    // @ts-ignore
    const restaurants = await Restaurant.getTop(req.user._id);
    res.render('top', { restaurants });
  } catch (e) {
    logger.error(e);
  }
};
