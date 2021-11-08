import express from 'express';
import * as userController from '../controllers/userController';
import * as restaurantController from '../controllers/restaurantController';
import * as photoController from '../controllers/photoController';
import * as mealController from '../controllers/mealController';
import * as validation from '../validators';

const router = express.Router();

router.get('/register',
  userController.checkNotAuth,
  userController.displayRegisterForm);

router.post('/register',
  userController.checkNotAuth,
  validation.validateRegister,
  validation.checkValidation,
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
  photoController.upload,
  validation.validateRestaurant,
  validation.checkValidation,
  restaurantController.parseTags,
  photoController.resize,
  restaurantController.addRestaurant);

router.get('/', userController.checkAuth, restaurantController.showRestaurants);
router.get('/restaurants', userController.checkAuth, restaurantController.showRestaurants);

router.get('/add-meal/:id', userController.checkAuth, mealController.displayMealForm);
router.post('/add-meal/:id',
  userController.checkAuth,
  restaurantController.checkIfRestaurantExists,
  photoController.upload,
  validation.validateMeal,
  validation.checkValidation,
  photoController.resize,
  mealController.addMeal);

router.get('/delete-meal/:id',
  userController.checkAuth,
  mealController.checkIfMealExists,
  mealController.deleteMeal);

router.get('/restaurant/:slug',
  userController.checkAuth,
  restaurantController.findSingleRestaurant,
  photoController.getStaticMap,
  restaurantController.showSingleRestaurant);

router.get('/edit/:id',
  userController.checkAuth,
  restaurantController.checkIfRestaurantExists,
  restaurantController.displayRestaurantEditForm);

router.post('/edit/:id',
  userController.checkAuth,
  restaurantController.checkIfRestaurantExists,
  photoController.upload,
  validation.validateRestaurant,
  validation.checkValidation,
  photoController.resize,
  restaurantController.parseTags,
  restaurantController.editRestaurant);

router.get('*', (_req, res): void => {
  res.status(404).render('index');
});

export default router;
