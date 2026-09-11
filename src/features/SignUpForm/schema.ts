import { z } from 'zod';
import type { SignUpPayload } from '@/entities/auth/types';
import { emailSchema, nameSchema } from '@/shared/schemas';

const signUpPasswordSchema = z.string()
  .nonempty('Password is required')
  .min(8, 'Password minimum length: 8');

const repeatPasswordSchema = z.string().nonempty('Password confirmation is required');

const fullNameSchema = nameSchema.refine(
  (fullName) => {
    const names = fullName.split(' ').filter((word) => word !== '');
    return names.length <= 2;
  },
  'Fullname must contain at most 2 words'
);

export const signUpFormSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  password: signUpPasswordSchema,
  repeatPassword: repeatPasswordSchema,
}).refine(({ password, repeatPassword }) => password === repeatPassword, {
  error: 'Passwords do not match',
  path: ['repeatPassword'],
}).transform(({ fullName, email, password }) => {
  const [firstName, secondName] = fullName.split(' ').filter((word) => word !== '');

  const signUpPayload: SignUpPayload = {
    email,
    password,
    firstName,
  }

  if (secondName) {
    signUpPayload.secondName = secondName;
  }

  return signUpPayload;
});

export type SignUpFormFields = z.input<typeof signUpFormSchema>;
