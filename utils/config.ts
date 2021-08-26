require('dotenv').config();

export const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.MONGO_TEST_URI
  : process.env.MONGO_DEV_URI;

export const PORT = process.env.PORT as string;
export const SESSION_SECRET = process.env.SESSION_SECRET as string;
