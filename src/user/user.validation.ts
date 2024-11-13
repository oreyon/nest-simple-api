import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z
    .object({
      name: z.string().min(3).max(100),
      email: z.string().email().max(100),
      username: z.string().min(3).max(100),
      password: z.string().min(8).max(150),
      confirmPassword: z.string().min(8).max(150),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });
}