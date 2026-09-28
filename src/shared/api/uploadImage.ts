import { z } from 'zod';
import { imageUrlSchema } from '@/shared/schemas';
import { BackendResponseError } from '@/shared/api/backendResponseError';

const UPLOAD_IMAGE_ERROR_MESSAGE = 'Image upload unavailable';

const uploadImageResponseSchema = z.object({
  url: imageUrlSchema,
});

type UploadImageResponsePayload = z.output<typeof uploadImageResponseSchema>;

export async function uploadImage(image: File): Promise<UploadImageResponsePayload> {
  const formData = new FormData();
  formData.append('image', image);

  let response: Response;

  try {
    response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    throw new Error('Cannot connect to the server', {
      cause: error,
    });
  }

  if (!response.ok) {
    throw await BackendResponseError.parse(response, UPLOAD_IMAGE_ERROR_MESSAGE);
  }

  let responseBody: unknown;

  try {
    responseBody = await response.json();
  } catch (error) {
    throw new Error('Unable to parse the response body', {
      cause: error,
    });
  }

  const parsedUploadImageResponseBody = uploadImageResponseSchema.safeParse(responseBody);

  if (!parsedUploadImageResponseBody.success) {
    throw new Error('Response body is malformed');
  }

  return parsedUploadImageResponseBody.data;
}
