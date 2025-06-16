import { z } from 'zod'

export const CategoryDataSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullish(),
  products: z.array(z.any()),
  createdAt: z.string()
})
