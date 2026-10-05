import i18next from 'i18next';
import { z } from 'zod';
import type { SignUpPayload } from '@/entities/auth/types';
import { emailSchema, nameSchema } from '@/shared/schemas';

const signUpPasswordSchema = z.string()
  .nonempty({
    error: () => i18next.t(($) => $.signUp.input.password.validation.required, { ns: 'authentication' }),
  })
  .min(8, {
    error: () => i18next.t(($) => $.signUp.input.password.validation.minLength, { ns: 'authentication' }),
  })
  .max(128, {
    error: () => i18next.t(($) => $.signUp.input.password.validation.maxLength, { ns: 'authentication' }),
  });

const repeatPasswordSchema = z.string()
  .nonempty({
    error: () => i18next.t(($) => $.signUp.input.repeatPassword.validation.required, { ns: 'authentication' }),
  });

const fullNameSchema = nameSchema.refine(
  (fullName) => {
    const names = fullName.split(' ').filter((word) => word !== '');
    return names.length <= 2;
  },
  {
    error: () => i18next.t(($) => $.signUp.input.fullName.validation.maxWords, { ns: 'authentication' }),
  }
);

export const signUpFormSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  password: signUpPasswordSchema,
  repeatPassword: repeatPasswordSchema,
}).refine(({ password, repeatPassword }) => password === repeatPassword, {
  error: () => i18next.t(($) => $.signUp.input.repeatPassword.validation.mismatch, { ns: 'authentication' }),
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
