import { z } from 'zod';
import { ApiResponseSchema } from './apiResponse.schema';

export const ProfileCreateSchema = z.object({
    firstName: z.string(),
    middleName: z.string().nullish(),
    lastName: z.string()
})

export const ProfileResponseSchema = ApiResponseSchema(z.object({
    firstName: z.string(),
    middleName: z.string().nullish(),
    lastName: z.string()
}))

export const ProfileSavedResponseSchema = ApiResponseSchema(z.object({}))