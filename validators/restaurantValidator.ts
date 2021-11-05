import { check, CustomValidator } from 'express-validator';

export function coordinatesValidation(value: any): [string, string] {
  if (value.length !== 2) throw new Error();

  let [lng, lat] = value;
  lng = Number(lng);
  lat = Number(lat);

  if (Number.isNaN(lng) || Number.isNaN(lat)) {
    throw new Error();
  }

  if (Math.abs(lng) > 180 || Math.abs(lat) > 90) {
    throw new Error();
  }

  return value as [string, string];
}

export const validateRestaurant = [
  check('name').trim().notEmpty().withMessage('Name required'),
  check('location.address').trim().notEmpty().withMessage('Restaurant address required'),
  check('location.coordinates').isArray().withMessage('Restaurant coordinates malformed'),
  check('location.coordinates').custom(coordinatesValidation as unknown as CustomValidator).withMessage('Lng Lat wrong format!'),
];
