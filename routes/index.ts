import express from 'express';
import * as userController from '../controllers/userController';
import * as restaurantController from '../controllers/restaurantController';

const router = express.Router();

router.get('/register', userController.displayRegisterForm);
router.post('/register',
  userController.validateRegister,
  userController.checkValidation,
  userController.registerUser,
  userController.loginUser);

router.get('/login', userController.displayLoginForm);
router.get('/logout', userController.logout);

router.post('/login', userController.loginUser);

router.get('/add', restaurantController.displayRestaurantForm);
router.post('/add',
  restaurantController.validateRestaurant,
  restaurantController.checkValidation,
  restaurantController.upload,
  restaurantController.resize,
  restaurantController.addRestaurant);

router.get('/', (_req, res): void => {
  res.status(200).render('index');
});

router.get('*', (_req, res): void => {
  res.status(404).render('index');
});

export default router;
