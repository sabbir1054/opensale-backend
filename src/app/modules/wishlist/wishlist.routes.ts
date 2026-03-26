import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { WishlistController } from './wishlist.controller';
import { WishlistValidation } from './wishlist.validation';

const router = express.Router();

router.post(
  '/',
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.WORKER,
    ENUM_USER_ROLE.AGENT,
    ENUM_USER_ROLE.INVESTOR,
  ),
  validateRequest(WishlistValidation.addToWishlistValidation),
  WishlistController.addToWishlist,
);

router.get(
  '/',
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.WORKER,
    ENUM_USER_ROLE.AGENT,
    ENUM_USER_ROLE.INVESTOR,
  ),
  WishlistController.getMyWishlist,
);

router.delete(
  '/:postId',
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.WORKER,
    ENUM_USER_ROLE.AGENT,
    ENUM_USER_ROLE.INVESTOR,
  ),
  WishlistController.removeFromWishlist,
);

export const WishlistRoutes = router;
