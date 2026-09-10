import { z } from 'zod';
import { signUpSchema } from '@/entities/auth/schema.ts';

const repeatPasswordSchema = z.string().nonempty('Password confirmation is required');

export const signUpFormSchema = signUpSchema.extend({
  repeatPassword: repeatPasswordSchema,
}).refine(({ password, repeatPassword }) => password === repeatPassword, {
  error: 'Passwords do not match',
  path: ['repeatPassword'],
});

export type SignUpFormFields = z.input<typeof signUpFormSchema>;
