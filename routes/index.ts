import express from 'express';
import * as userController from '../controllers/userController';
import * as restaurantController from '../controllers/restaurantController';
import * as photoController from '../controllers/photoController';

const router = express.Router();

router.get('/register',
  userController.checkNotAuth,
  userController.displayRegisterForm);

router.post('/register',
  userController.checkNotAuth,
  userController.validateRegister,
  userController.checkValidation,
  userController.registerUser,
  userController.loginUser);

router.get('/login',
  userController.checkNotAuth,
  userController.displayLoginForm);

router.post('/login',
  userController.checkNotAuth,
  userController.loginUser);

router.get('/logout', userController.logout);

router.get('/add',
  userController.checkAuth,
  restaurantController.displayRestaurantForm);

router.post('/add',
  userController.checkAuth,
  restaurantController.validateRestaurant,
  restaurantController.checkValidation,
  photoController.upload,
  photoController.resize,
  restaurantController.addRestaurant);

router.get('/', userController.checkAuth, restaurantController.showRestaurants);
router.get('/restaurants', userController.checkAuth, restaurantController.showRestaurants);

router.get('*', (_req, res): void => {
  res.status(404).render('index');
});

export default router;
