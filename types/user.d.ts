import { z } from 'zod';

declare global {
  type User = z.infer<typeof UserSchema>
  type UserCreate = z.infer<typeof UserCreateSchema>
  type UserLogin = z.infer<typeof UserLoginSchema>
}
