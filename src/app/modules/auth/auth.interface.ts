export type IUser = {
  role: 'USER' | 'WORKER' | 'INVESTOR' | 'AGENT' | 'ADMIN';
  fullname: string;
  phone: string;
  email?: string;
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
