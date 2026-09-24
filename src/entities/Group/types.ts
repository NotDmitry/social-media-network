import { z } from 'zod';
import { groupModelSchema } from './schema';

export type GroupModel = z.output<typeof groupModelSchema>;
