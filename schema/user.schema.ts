import { z } from 'zod';
import { ApiResponseSchema } from './apiResponse.schema';

export const UserSchema = ApiResponseSchema(z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['staff', 'admin']),
  createdAt: z.string().nullish()
}))

export const UserCreateSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['staff', 'admin']).nullish(),
})

export const UserLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
})

export const UserLogoutSchema = ApiResponseSchema(z.object({}).nullish())
