import { z } from 'zod';
import { postModelSchema, postsPageSchema } from './schema';

export type PostModel = z.output<typeof postModelSchema>;
export type PostsPage = z.output<typeof postsPageSchema>;
