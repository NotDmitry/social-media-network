import { z } from 'zod';
import { userModelSchema } from '@/entities/User/schema';

const singleTokenSchema = z.string().nonempty();

const tokensSchema = z.object({
  token: singleTokenSchema,
  refreshToken: singleTokenSchema,
  expiresIn: z.int().nonnegative(),
  refreshTokenExpiresAt: z.iso.datetime(),
});

export const loginResponseSchema = tokensSchema.extend({
  user: userModelSchema,
});

export const logoutResponseSchema = z.object({
  message: z.string(),
});

export const signUpResponseSchema = z.object({
  message: z.string(),
  user: userModelSchema,
});

export const refreshResponseSchema = tokensSchema;
