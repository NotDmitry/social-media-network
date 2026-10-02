import i18next from 'i18next';
import { z } from 'zod';


export const confirmPasswordSchema = z.string()
  .nonempty({
    error: () => i18next.t(($) => $.signIn.input.password.validation.required, { ns: 'authentication' }),
  });

export type ConfirmPasswordField = z.input<typeof confirmPasswordSchema>;
