import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import * as config from './utils/config';
import * as logger from './utils/logger';
import * as utils from './utils/utils';
import routes from './routes';

mongoose.connect(config.MONGODB_URI!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(() => logger.info('Connected'))
  .catch(logger.error);

require('./models/mealModel');
require('./models/userModel');
require('./models/restaurantModel');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'dist')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongoUrl: config.MONGODB_URI }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next): void => {
  res.locals.utils = utils;
  res.locals.user = req.user || null;
  res.locals.path = req.path;
  next();
});

const User = mongoose.model('User');
passport.use(User.createStrategy());
// @ts-ignore
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', routes);

export default app;
