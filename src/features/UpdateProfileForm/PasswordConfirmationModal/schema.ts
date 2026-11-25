import i18next from 'i18next';
import { z } from 'zod';

export const passwordConfirmationFormSchema = z.object({
  currentPassword: z.string()
    .nonempty({
      error: () => i18next.t(($) => $.update.confirmation.input.password.validation.required, { ns: 'profile' }),
    }),
});

export type PasswordConfirmationFormFields = z.input<typeof passwordConfirmationFormSchema>;
