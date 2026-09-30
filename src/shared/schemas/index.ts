import i18next from 'i18next';
import { z } from 'zod';

export const idSchema = z.int().nonnegative();

export const emailSchema = z.string()
  .trim()
  .toLowerCase()
  .pipe(z.email({
    error: () => i18next.t(($) => $.input.email.validation.invalid),
  }));

export const imageUrlSchema = z.string();

export const dateTimeSchema = z.string();

export const usernameSchema = z.string()
  .trim()
  .nonempty({
    error: () => i18next.t(($) => $.input.username.validation.required),
  });

export const nameSchema = z.string()
  .trim()
  .nonempty({
    error: () => i18next.t(($) => $.input.name.validation.required),
  });

export const descriptionSchema = z.string();

export const noContentResponseSchema = z.undefined();
