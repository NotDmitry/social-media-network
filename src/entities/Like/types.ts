import { z } from 'zod';
import { likeModelSchema, likeStatusSchema } from './schema';

export type LikeModel = z.output<typeof likeModelSchema>;
export type LikeStatus = z.output<typeof likeStatusSchema>;
