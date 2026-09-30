import i18next from 'i18next';
import { z } from 'zod';

export const createPostFormSchema = z.object({
  title: z.string()
    .trim()
    .nonempty({
      error: () => i18next.t(($) => $.createPost.input.title.validation.required, { ns: 'posts' }),
    })
    .max(80, {
      error: () => i18next.t(($) => $.createPost.input.title.validation.maxLength, { ns: 'posts' }),
    }),
  description: z.string()
    .trim()
    .nonempty({
      error: () => i18next.t(($) => $.createPost.input.description.validation.required, { ns: 'posts' }),
    })
    .max(500, {
      error: () => i18next.t(($) => $.createPost.input.description.validation.maxLength, { ns: 'posts' }),
    }),
});

export type CreatePostFormFields = z.input<typeof createPostFormSchema>;
