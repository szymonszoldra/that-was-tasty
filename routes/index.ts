import express from 'express';
import * as userController from '../controllers/userController';

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

router.get('/', (_req, res): void => {
  res.render('index');
});

router.get('*', (_req, res): void => {
  res.render('index');
});

export default router;
