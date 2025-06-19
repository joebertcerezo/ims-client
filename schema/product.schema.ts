import { z } from 'zod'
import { ApiResponseSchema } from './apiResponse.schema'
import { CategoryDataSchema } from './category.schema'

export const ProductDataSchema = z.object({
  id: z.string().uuid(),
  productName: z.string(),
  quantity: z.number(),
  category: CategoryDataSchema,
  createdAt: z.string()
})

export const ProductResponseSchema = ApiResponseSchema(z.string())

export const ProductListSchema = ApiResponseSchema(z.array(ProductDataSchema))


