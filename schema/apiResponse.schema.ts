import { z } from 'zod'

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    code: z.string(),
    status: z.string(),
    data: dataSchema.nullish(),
  });
