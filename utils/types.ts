import { Request } from 'express';
import { RestaurantDocument } from '../models/restaurantModel';

export interface CustomRequest extends Request {
  restaurant?: RestaurantDocument | null
}
