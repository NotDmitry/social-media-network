import { z } from 'zod';

export const createCommentFormSchema = z.object({
  comment: z.string()
    .trim()
    .nonempty('The comment can\'t be empty')
    .max(200, 'Reached 200 characters limit'),
});

export type CreateCommentFormFields = z.input<typeof createCommentFormSchema>;
