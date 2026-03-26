export type IUser = {
  role: 'USER' | 'WORKER' | 'INVESTOR' | 'AGENT' | 'ADMIN';
  fullName: string;
  phone: string;
  email: string;
  password: string;
};
export type IUserLogin = {
  phone: string;
  password: string;
  isRemember: boolean;
};
export type IRefreshTokenResponse = {
  accessToken: string;
};
export type IPasswordChange = {
  oldPassword: string;
  newPassword: string;
};
export type IForgotPassword = {
  email: string;
};
export type IResetPassword = {
  email: string;
  otp: string;
  newPassword: string;
};
