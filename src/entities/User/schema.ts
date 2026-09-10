import { z } from 'zod';
import { dateTimeSchema, emailSchema, idSchema, imageUrlSchema } from '@/shared/schemas';

export const usernameSchema = z.string().trim().nonempty('The username can\'t be empty');

export const nameSchema = z.string().trim().nonempty('The name can\'t be empty');

export const userDescriptionSchema = z.string();

export const userModelSchema = z.object({
  id: idSchema,
  username: usernameSchema,
  email: emailSchema.nullable(),
  firstName: nameSchema.nullable(),
  profileImage: imageUrlSchema.nullable(),
  description: userDescriptionSchema.nullable(),
  bio: userDescriptionSchema.nullable(),
  secondName: nameSchema.nullable(),
  lastLogin: dateTimeSchema.nullable(),
  creationDate: dateTimeSchema.nullable(),
  modifiedDate: dateTimeSchema.nullable(),
});
