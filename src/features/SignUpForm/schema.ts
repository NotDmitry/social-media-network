import { z } from 'zod';
import { emailSchema, nameSchema } from '@/shared/schemas';

const signUpPasswordSchema = z.string()
  .nonempty('Password is required')
  .min(8, 'Password minimum length: 8');

const repeatPasswordSchema = z.string().nonempty('Password confirmation is required');

export const signUpFormSchema = z.object({
  email: emailSchema,
  password: signUpPasswordSchema,
  firstName: nameSchema,
  secondName: nameSchema,
  repeatPassword: repeatPasswordSchema,
}).refine(({ password, repeatPassword }) => password === repeatPassword, {
  error: 'Passwords do not match',
  path: ['repeatPassword'],
});

export type SignUpFormFields = z.input<typeof signUpFormSchema>;
