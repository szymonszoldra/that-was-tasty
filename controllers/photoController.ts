import {
  Request, Response, NextFunction, Express,
} from 'express';
import multer from 'multer';
import Jimp from 'jimp';
import { v4 as uuidv4 } from 'uuid';

// node-fetch seems to have some issues
// @ts-ignore
import fetch from 'node-fetch';

import Restaurant, { RestaurantDocument } from '../models/restaurantModel';
import { CustomRequest } from '../utils/types';
import { staticMap } from '../utils/utils';

const multerOptions: multer.Options = {
  storage: multer.memoryStorage(),
  fileFilter(_req: any, file: Express.Multer.File, cb: any) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb({ message: 'That filetype is not allowed!' }, false);
    }
  },
};

export const upload = multer(multerOptions).single('photo');

export const resize = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  if (!req.file) {
    return next();
  }

  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuidv4()}.${extension}`;
  const photo = await Jimp.read(req.file.buffer);
  photo.resize(800, Jimp.AUTO);
  photo.write(`./static/photos/${req.body.photo}`);
  next();
};

export const getStaticMap = async (
  req: CustomRequest, _res: Response, next: NextFunction,
): Promise<void> => {
  if (req.restaurant?.map) {
    return next();
  }

  const [lng, lat] = req.restaurant?.location.coordinates!;
  const PATH = staticMap(lng, lat);
  const response = await fetch(PATH);
  const buffer = await response.buffer();
  const map = await Jimp.read(buffer);

  const mapPath = `${uuidv4()}.png`;
  map.write(`./static/maps/${mapPath}`);

  // It's not null because previous controller checked this
  const restaurant = await Restaurant.findById(req.restaurant?._id) as RestaurantDocument;

  // Save path to the DB but also pass it to the next controller
  restaurant.map = mapPath;
  req.restaurant!.map = mapPath;
  await restaurant.save();
  next();
};
