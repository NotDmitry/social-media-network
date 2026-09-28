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

export const userModelSchema = z.object({
  id: idSchema,
  username: usernameSchema,
  email: emailSchema.nullable(),
  firstName: nameSchema.nullable(),
  profileImage: imageUrlSchema.nullable(),
  description: descriptionSchema.nullable(),
  bio: descriptionSchema.nullable(),
  secondName: nameSchema.nullable(),
  lastLogin: dateTimeSchema.nullable(),
  creationDate: dateTimeSchema.nullable(),
  modifiedDate: dateTimeSchema.nullable(),
});
