import { z } from 'zod';

export const createPostFormSchema = z.object({
  title: z.string()
    .trim()
    .nonempty('The post title can\'t be empty')
    .max(80, 'Reached 80 characters limit'),
  description: z.string()
    .trim()
    .nonempty('The post description can\'t be empty')
    .max(500, 'Reached 500 characters limit'),
});

export type CreatePostFormFields = z.input<typeof createPostFormSchema>;
