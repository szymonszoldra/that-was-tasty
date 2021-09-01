import {
  Request, Response, NextFunction, Express,
} from 'express';
import multer from 'multer';
import Jimp from 'jimp';
import { v4 as uuidv4 } from 'uuid';

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

export const resize = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.file) {
    next();
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuidv4()}.${extension}`;
  const photo = await Jimp.read(req.file.buffer);
  photo.resize(800, Jimp.AUTO);
  photo.write(`./static/photos/${req.body.photo}`);
  next();
};
