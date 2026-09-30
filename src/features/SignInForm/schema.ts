import i18next from 'i18next';
import { z } from 'zod';
import { emailSchema } from '@/shared/schemas';

const signInPasswordSchema = z.string()
  .nonempty({
    error: () => i18next.t(($) => $.signIn.input.password.validation.required, { ns: 'authentication' }),
  });

export const signInFormSchema = z.object({
  email: emailSchema,
  password: signInPasswordSchema,
});
