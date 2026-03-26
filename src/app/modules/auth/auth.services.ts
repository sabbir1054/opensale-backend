/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';

import { validateEmail } from '../../../helpers/checkEmailFormateValidity';
import { checkPhoneNumberFormate } from '../../../helpers/checkPhoneValidity';
import {
  encryptPassword,
  isPasswordMatched,
} from '../../../helpers/encryption';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { generateOTP } from '../../../helpers/otpHelpers';
import { sendEmail } from '../../../helpers/sendEmail';
import prisma from '../../../shared/prisma';
import {
  IForgotPassword,
  IPasswordChange,
  IRefreshTokenResponse,
  IResetPassword,
  IUser,
  IUserLogin,
} from './auth.interface';

const userRegistration = async (payload: IUser, role: string) => {
  const { password, ...othersData } = payload;

  if (othersData.role === 'ADMIN' && role === 'ADMIN') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin create not allow ');
  }

  const isUserExist = await prisma.user.findFirst({
    where: {
      OR: [{ phone: payload.phone }],
    },
  });
  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }
  // check phone number validity
  if (payload?.phone) {
    const isPhoneValid = checkPhoneNumberFormate(payload?.phone ?? '');
    if (!isPhoneValid) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Please provide valid phone number',
      );
    }
  }

  if (payload?.email) {
    //check email validity
    const isValidEmail = validateEmail(payload?.email ?? '');

    if (isValidEmail === false) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Please provide valid email address',
      );
    }
  }

  // encrypt password
  const encryptedPassword = await encryptPassword(password);
  //user save
  const result = await prisma.user.create({
    data: { ...othersData, password: encryptedPassword },
    select: {
      id: true,
      role: true,
      fullName: true,
      phone: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const userLogin = async (payload: IUserLogin) => {
  const { phone, password } = payload;

  // check user exist
  const isUserExist = await prisma.user.findUnique({
    where: { phone },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const checkPassword = await isPasswordMatched(password, isUserExist.password);
  if (!checkPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const { id, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { id, role, phone },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { id, role, phone },
    config.jwt.refresh_secret as Secret,
    payload.isRemember ? '7d' : (config.jwt.refresh_expires_in as string),
  );

  return { accessToken, refreshToken };
};
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { id } = verifiedToken;
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  // generate user access token
  const newAccessToken = jwtHelpers.createToken(
    { id: isUserExist.id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const changeUserPassword = async (userId: string, payload: IPasswordChange) => {
  // check if user exists
  const isUserExist = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      password: true,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // check old password
  const checkPassword = await isPasswordMatched(
    payload.oldPassword,
    isUserExist.password,
  );
  if (!checkPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect');
  }
  // encrypt new password
  const encryptedNewPassword = await encryptPassword(payload.newPassword);
  // update password
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: encryptedNewPassword },
    select: {
      id: true,
      role: true,
      fullName: true,
      phone: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return updatedUser;
};

const forgotPassword = async (payload: IForgotPassword) => {
  const { email } = payload;

  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this email');
  }

  // invalidate any existing unused OTPs for this user
  await prisma.passwordReset.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  // generate OTP and save to DB
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.passwordReset.create({
    data: {
      otp,
      expiresAt,
      userId: user.id,
    },
  });

  // send OTP via email
  await sendEmail({
    to: email,
    subject: 'OpenSale - Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>Hi ${user.fullName},</p>
        <p>Your OTP for password reset is:</p>
        <h1 style="letter-spacing: 8px; text-align: center; background: #f4f4f4; padding: 16px; border-radius: 8px;">${otp}</h1>
        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  });

  return { message: 'OTP sent to your email' };
};

const resetPassword = async (payload: IResetPassword) => {
  const { email, otp, newPassword } = payload;

  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this email');
  }

  // find valid OTP
  const passwordReset = await prisma.passwordReset.findFirst({
    where: {
      userId: user.id,
      otp,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!passwordReset) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
  }

  // mark OTP as used
  await prisma.passwordReset.update({
    where: { id: passwordReset.id },
    data: { used: true },
  });

  // update password
  const encryptedPassword = await encryptPassword(newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: encryptedPassword },
  });

  return { message: 'Password reset successfully' };
};

export const AuthServices = {
  userRegistration,
  userLogin,
  refreshToken,
  changeUserPassword,
  forgotPassword,
  resetPassword,
};
