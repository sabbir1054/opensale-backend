import express from 'express';
import { uploadSingle } from '../../../config/multer';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PostCategoryController } from './postCategory.controller';
import { PostCategoryValidation } from './postCategory.validation';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN),
  uploadSingle,
  validateRequest(PostCategoryValidation.createPostCategoryValidation),
  PostCategoryController.createPostCategory,
);

router.get('/', PostCategoryController.getAllPostCategories);

router.get('/:id', PostCategoryController.getSinglePostCategory);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  uploadSingle,
  validateRequest(PostCategoryValidation.updatePostCategoryValidation),
  PostCategoryController.updatePostCategory,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  PostCategoryController.deletePostCategory,
);

export const PostCategoryRoutes = router;
