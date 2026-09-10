import { z } from 'zod';
import { nameSchema, userDescriptionSchema, usernameSchema } from '@/entities/User/schema';
import { emailSchema, imageUrlSchema } from '@/shared/schemas';

export const passwordSchema = z.string()
  .nonempty('Password is required')
  .min(8, 'Password minimum length: 8');

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema.optional(),
  secondName: nameSchema.optional(),
});

export const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
  firstName: nameSchema.optional(),
  secondName: nameSchema.optional(),
  profileImage: imageUrlSchema.optional(),
  description: userDescriptionSchema.optional(),
});
