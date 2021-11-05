import {
  NextFunction,
  Request, Response,
} from 'express';
import { CustomRequest } from '../utils/types';

import Meal from '../models/mealModel';

export const displayMealForm = (req: Request, res: Response): void => {
  res.render('mealForm', { restaurantId: req.params.id });
};

export const parsePrice = (req: Request, res: Response, next: NextFunction): void => {
  const price = Number(req.body.price);

  if (Number.isNaN(price)) {
    req.flash('error', 'Price malformated');
    res.redirect('/back');
  } else {
    req.body.price = price;
  }

  next();
};

export const parseReview = (req: Request, res: Response, next: NextFunction): void => {
  const review = Number(req.body.review);

  if (Number.isNaN(review)) {
    // Just checking if user messed something up with the devtools
    // If so, then the default value will be set to 5
    req.body.review = 5;
  } else {
    // Make sure the review is between 1 and 5
    req.body.review = Math.max(1, Math.min(review, 5));
  }

  next();
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
    res.redirect(`${req.restaurant!.slug}`);
  } catch (error) {
    console.error(error);
  }
};
