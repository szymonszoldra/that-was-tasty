import { Request } from 'express';
import { MealDocument } from '../models/mealModel';
import { RestaurantDocument } from '../models/restaurantModel';

export interface CustomRequest extends Request {
  restaurant?: RestaurantDocument | null
  meal?: MealDocument | null
}
