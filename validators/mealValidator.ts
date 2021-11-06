/* eslint-disable newline-per-chained-call */
import { check } from 'express-validator';

export const validateMeal = [
  // can't do check('*'), doesn't work with photo
  check('description').escape(),
  check('name').escape(),
  check('ingredients').escape(),
  check('price').escape(),
  check('review').escape(),
  check('name').notEmpty().withMessage('Name must be provided!'),
  check('price').notEmpty().withMessage('Price must be provided!'),
  check('ingredients').notEmpty().withMessage('Ingredients must be provided!'),
  check('description').notEmpty().withMessage('Description must be provided!'),
  check('review').notEmpty().withMessage('Review must be provided!'),
  check('price').isDecimal().withMessage('Price must be decimal!'),
  check('price').toFloat(),
  check('review').toInt(),
  check('review').isInt({ min: 1, max: 5 }).withMessage('Review must be int between 1 and 5!'),
];
