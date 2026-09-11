import { z } from 'zod';
import { userModelSchema } from '@/entities/User/schema';

const tokenSchema = z.string().nonempty();

export const loginResponseSchema = z.object({
  token: tokenSchema,
  refreshToken: tokenSchema,
  expiresIn: z.int().nonnegative(),
  refreshTokenExpiresAt: z.iso.datetime(),
  user: userModelSchema,
});
