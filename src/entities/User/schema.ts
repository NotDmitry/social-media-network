import { z } from 'zod';
import {
  dateTimeSchema,
  descriptionSchema,
  emailSchema,
  idSchema,
  imageUrlSchema,
  nameSchema,
  usernameSchema,
} from '@/shared/schemas';

export const publicUserModelSchema = z.object({
  id: idSchema,
  username: usernameSchema,
  firstName: nameSchema.nullable(),
  secondName: nameSchema.nullable(),
  description: descriptionSchema.nullable(),
  bio: descriptionSchema.nullable(),
  profileImage: imageUrlSchema.nullable(),
  creationDate: dateTimeSchema.nullable(),
});

export const userModelSchema = publicUserModelSchema.extend({
  email: emailSchema.nullable(),
  lastLogin: dateTimeSchema.nullable(),
  modifiedDate: dateTimeSchema.nullable(),
});

export const suggestedUserModelSchema = z.object({
  id: idSchema,
  username: usernameSchema,
  firstName: nameSchema.nullable(),
  secondName: nameSchema.nullable(),
  description: descriptionSchema.nullable(),
  photo: imageUrlSchema.nullable(),
});

export const suggestedUsersSchema = z.array(suggestedUserModelSchema);
