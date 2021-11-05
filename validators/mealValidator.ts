/* eslint-disable newline-per-chained-call */
import { check } from 'express-validator';

export const validateMeal = [
  check('name').notEmpty().withMessage('Name must be provided!'),
];
