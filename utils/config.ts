require('dotenv').config();

export const { PORT } = process.env;

export const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.MONGO_TEST_URI
  : process.env.MONGO_DEV_URI;
