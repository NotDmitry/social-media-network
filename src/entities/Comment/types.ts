import { z } from 'zod';
import { commentModelSchema } from './schema';

export type CommentModel = z.output<typeof commentModelSchema>;
