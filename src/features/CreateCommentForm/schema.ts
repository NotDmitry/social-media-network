import i18next from 'i18next';
import { z } from 'zod';

export const createCommentFormSchema = z.object({
  comment: z.string()
    .trim()
    .nonempty({
      error: () => i18next.t(($) => $.comment.create.input.comment.validation.required, { ns: 'posts' }),
    })
    .max(200, {
      error: () => i18next.t(($) => $.comment.create.input.comment.validation.maxLength, { ns: 'posts' }),
    }),
});

export type CreateCommentFormFields = z.input<typeof createCommentFormSchema>;
