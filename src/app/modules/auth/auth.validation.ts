import { z } from 'zod';
import { ROLE } from '../users/users.constant';
const userRegistrationValidation = z.object({
  body: z.object({
    fullname: z.string({ required_error: 'Name is required' }),
    phone: z.string({ required_error: 'Phone number is required' }),
    email: z.string().optional(),
    password: z.string({ required_error: 'Password is required' }),
    role: z.enum([...ROLE] as [string, ...string[]], {
      required_error: 'Role is required',
    }),
  }),
});
const userLoginValidation = z.object({
  body: z.object({
    password: z.string({ required_error: 'Password is required' }),
    // isRemember: z.boolean({ required_error: 'Remember me option is required' }),
    phone: z.string({ required_error: 'Phone is required' }),
  }),
});
const changePasswordValidation = z.object({
  body: z.object({
    newPassword: z.string({ required_error: 'New Password is required' }),
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
  }),
});

export const AuthValidation = {
  changePasswordValidation,
  userRegistrationValidation,
  userLoginValidation,
};
