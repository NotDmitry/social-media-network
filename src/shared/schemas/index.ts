import { z } from 'zod';

export const idSchema = z.int().nonnegative();

export const emailSchema = z.string()
  .trim()
  .toLowerCase()
  .pipe(z.email('Invalid email address'));

export const imageUrlSchema = z.string();

export const dateTimeSchema = z.string();
