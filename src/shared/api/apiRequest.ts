import { z } from 'zod';
import { BackendResponseError } from '@/shared/api/backendResponseError';

interface ApiRequestOptions<ResponseSchema extends z.ZodType> {
  responseValidationSchema: ResponseSchema;
  fallbackErrorMessage: string;
}

export async function apiRequest<ResponseSchema extends z.ZodType>(
  fetchInput: RequestInfo | URL,
  fetchInitOptions: RequestInit,
  apiRequestOptions: ApiRequestOptions<ResponseSchema>
): Promise<z.output<ResponseSchema>> {
  let response: Response;

  try {
    response = await fetch(fetchInput, fetchInitOptions);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    throw new Error('Cannot connect to the server', {
      cause: error,
    });
  }

  if (!response.ok) {
    throw await BackendResponseError.parse(response, apiRequestOptions.fallbackErrorMessage);
  }

  let responseBody: unknown;

  try {
    responseBody = await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    throw new Error('Unable to parse the response body', {
      cause: error,
    });
  }

  const parsedResponseBody = apiRequestOptions.responseValidationSchema.safeParse(responseBody);

  if (!parsedResponseBody.success) {
    throw new Error('Response body is malformed', {
      cause: parsedResponseBody.error,
    });
  }

  return parsedResponseBody.data;
}
