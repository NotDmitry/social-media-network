import { z } from 'zod';
import { signInSchema, signUpSchema, updateProfileSchema } from './schema';

export type SignInPayload = z.output<typeof signInSchema>;
export type SignUpPayload = z.output<typeof signUpSchema>;
export type UpdateProfilePayload = z.output<typeof updateProfileSchema>;
