import express from 'express';
import { uploadMultiple } from '../../../config/multer';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PostController } from './post.controller';
import { PostValidation } from './post.validation';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  uploadMultiple,
  validateRequest(PostValidation.createPostValidation),
  PostController.createPost,
);

router.get('/', PostController.getAllPosts);

router.get('/:id', PostController.getSinglePost);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  uploadMultiple,
  validateRequest(PostValidation.updatePostValidation),
  PostController.updatePost,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PostController.deletePost,
);

router.delete(
  '/photo/:photoId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PostController.deletePostPhoto,
);

export const PostRoutes = router;
