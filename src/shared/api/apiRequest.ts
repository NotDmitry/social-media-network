import { z } from 'zod';
import { BackendResponseError } from '@/shared/api/backendResponseError';

interface ApiRequestOptions<ResponseSchema extends z.ZodType> {
  responseValidationSchema: ResponseSchema;
  fallbackErrorMessage: string;
}

export type ApiRequestParameters<ResponseSchema extends z.ZodType> = [
  fetchInput: RequestInfo | URL,
  fetchInitOptions: RequestInit,
  apiRequestOptions: ApiRequestOptions<ResponseSchema>
];

export type ApiRequestFunction = <ResponseSchema extends z.ZodType>(
  ...apiRequestParameters: ApiRequestParameters<ResponseSchema>
) => Promise<z.output<ResponseSchema>>;

export const apiRequest: ApiRequestFunction = async (fetchInput, fetchInitOptions, apiRequestOptions) => {
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

  if (response.status === 204) {
    responseBody = undefined;
  } else {
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
  }

  const parsedResponseBody = apiRequestOptions.responseValidationSchema.safeParse(responseBody);

  if (!parsedResponseBody.success) {
    throw new Error('Response body is malformed', {
      cause: parsedResponseBody.error,
    });
  }

  return parsedResponseBody.data;
};
