import { check } from 'express-validator';

export const validateRestaurant = [
  check('name').escape(),
  check('restaurant').escape(),
  check('location.address').escape(),
  check('location.coordinates[0]').escape(),
  check('location.coordinates[1]').escape(),
  check('name').trim().notEmpty().withMessage('Name required'),
  check('location.address').trim().notEmpty().withMessage('Restaurant address required'),
  check('location.coordinates').isArray().withMessage('Restaurant coordinates malformed'),
  check('location.coordinates[0]').isFloat({ min: -180, max: 180 }).withMessage('Lng malformed'),
  check('location.coordinates[0]').toFloat(),
  check('location.coordinates[1]').isFloat({ min: -90, max: 90 }).withMessage('Lat malformed'),
  check('location.coordinates[1]').toFloat(),
];
