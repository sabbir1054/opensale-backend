import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();
router.post(
  '/register',
  validateRequest(AuthValidation.userRegistrationValidation),
  auth(
    ENUM_USER_ROLE.AGENT,
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.INVESTOR,
    ENUM_USER_ROLE.WORKER,
  ),
  AuthController.userRegistration,
);

router.post(
  '/register-s-admin',
  validateRequest(AuthValidation.userRegistrationValidation),
  AuthController.userRegistration,
);
router.post(
  '/register-admin',
  validateRequest(AuthValidation.userRegistrationValidation),
  auth(ENUM_USER_ROLE.ADMIN),
  AuthController.userRegistration,
);

router.post(
  '/login',
  validateRequest(AuthValidation.userLoginValidation),
  AuthController.userLogin,
);
router.get('/refresh-token', AuthController.refreshToken);

router.patch(
  '/change-password',
  validateRequest(AuthValidation.changePasswordValidation),
  auth(
    ENUM_USER_ROLE.WORKER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.AGENT,
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.INVESTOR,
  ),
  AuthController.changeUserPassword,
);

export const AuthRoutes = router;
