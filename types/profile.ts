import { z } from 'zod';
import type { ProfileResponseSchema, ProfileCreateSchema } from '~/schema/profile.scema'

declare global {
  type ProfileCreate = z.infer<typeof ProfileCreateSchema>
  type ProfileResponse = z.infer<typeof ProfileResponseSchema>
}