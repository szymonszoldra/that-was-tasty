import {
  NextFunction,
  Request, Response,
} from 'express';
import { CustomRequest } from '../utils/types';

import Meal from '../models/mealModel';

export const displayMealForm = (req: Request, res: Response): void => {
  res.render('mealForm', { restaurantId: req.params.id });
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
    console.error(error);
  }
};
