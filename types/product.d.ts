import { z } from 'zod'
import type { ProductDataSchema, ProductListSchema } from '~/schema/product.schema'

declare global {
  export type ProductData = z.infer<typeof ProductDataSchema>
  export type ProductListResponse = z.infer<typeof ProductListSchema>
}
