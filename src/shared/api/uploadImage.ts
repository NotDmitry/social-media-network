import { z } from 'zod';
import { imageUrlSchema } from '@/shared/schemas';
import { apiRequest } from '@/shared/api/apiRequest';

const UPLOAD_IMAGE_ERROR_MESSAGE = 'Image upload unavailable';

const uploadImageResponseSchema = z.object({
  url: imageUrlSchema,
});

type UploadImageResponsePayload = z.output<typeof uploadImageResponseSchema>;

export async function uploadImage(image: File): Promise<UploadImageResponsePayload> {
  const formData = new FormData();
  formData.append('image', image);

  return apiRequest(
    '/api/upload-image',
    {
      method: 'POST',
      body: formData,
    },
    {
      responseValidationSchema: uploadImageResponseSchema,
      fallbackErrorMessage: UPLOAD_IMAGE_ERROR_MESSAGE,
    }
  );
}
