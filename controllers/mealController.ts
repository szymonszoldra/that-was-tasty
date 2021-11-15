import {
  NextFunction,
  Request, Response,
} from 'express';
import fs from 'fs';
import { CustomRequest } from '../utils/types';

import Meal, { MealDocument } from '../models/mealModel';
import Restaurant from '../models/restaurantModel';

import * as logger from '../utils/logger';

export const displayMealForm = (req: Request, res: Response): void => {
  res.render('mealForm', { restaurantId: req.params.id });
};

export const displayMealEditForm = (req: CustomRequest, res: Response) => {
  res.render('mealForm', { restaurantId: req.params.id, meal: req.meal });
};

export const addMeal = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const meal = new Meal({
      ...req.body,
      restaurant: req.restaurant!._id,
    });

    req.restaurant!.meals?.push(meal._id);

    await Promise.all([meal.save(), req.restaurant!.save()]);
    req.flash('success', 'Meal added!');
    res.redirect(`/restaurant/${req.restaurant!.slug}`);
  } catch (error) {
    logger.error(error);
  }
};

export const checkIfMealExists = async (
  req: CustomRequest, res: Response, next: NextFunction,
): Promise<void> => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      req.flash('error', 'There is no such meal!');
      res.redirect('back');
      return;
    }

    // @ts-ignore
    const restaurant = await Restaurant.findOne({ _id: meal.restaurant, user: req.user!._id });

    if (!restaurant) {
      req.flash('error', 'Restaurant doesn\'t exist or you don\'t have permission to do that!');
      res.redirect('back');
      return;
    }

    req.meal = meal;
    req.restaurant = restaurant;
    next();
  } catch (e) {
    logger.error(e);
  }
};

export const deleteMeal = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    req.restaurant!.meals = req.restaurant!.meals!.filter((meal) => !meal.equals(req.meal!._id));
    await req.restaurant!.save();
    await Meal.findByIdAndDelete(req.meal!._id);

    fs.unlinkSync(`./static/photos/${req.meal!.photo}`);

    req.flash('success', 'Meal deleted!');
    res.redirect('back');
  } catch (error) {
    logger.info(error);
  }
};

export const editMeal = async (req: CustomRequest, res: Response): Promise<void> => {
  if (req.body.photo) {
    try {
      fs.unlinkSync(`./static/photos/${req.meal!.photo}`);
    } catch (error) {
      logger.error(`Error while deleting the file ${req.meal!.photo}`);
    }
  }
  try {
    await Meal.findOneAndUpdate({ _id: req.meal!.id }, req.body, { new: true, runValidators: true });
    res.redirect(`/restaurant/${req.restaurant!.slug}`);
  } catch (error) {
    logger.info(error);
    req.flash('error', 'Error while updating meal');
    res.redirect('back');
  }
};
