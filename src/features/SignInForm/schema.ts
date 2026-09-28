import { z } from 'zod';
import { emailSchema } from '@/shared/schemas';

const signInPasswordSchema = z.string().nonempty('Password is required');

export const signInFormSchema = z.object({
  email: emailSchema,
  password: signInPasswordSchema,
});
