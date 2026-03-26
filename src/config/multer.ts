/* eslint-disable no-undef */
import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

const storage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb) {
    cb(null, 'uploads/');
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '--' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, .webp files are allowed'));
  }
};

export const uploadSingle = multer({ storage, fileFilter }).single('image');
export const uploadMultiple = multer({ storage, fileFilter }).array(
  'photos',
  10,
);
