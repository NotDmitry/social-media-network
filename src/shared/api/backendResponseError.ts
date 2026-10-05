import { z } from 'zod';
import { backendErrorCodeSchema } from './backendErrorCode';
import type { BackendErrorCode } from './backendErrorCode';

const backendResponseErrorSchema = z.object({
  message: z.string(),
  code: backendErrorCodeSchema,
});

interface BackendResponseErrorOptions {
  message: string;
  status: number;
  code?: BackendErrorCode;
  cause?: unknown;
}

export class BackendResponseError extends Error {
  public readonly status: number;
  public readonly code?: BackendErrorCode;

  constructor({ message, status, code, cause }: BackendResponseErrorOptions) {
    super(message, { cause });
    this.name = 'BackendResponseError';
    this.status = status;
    this.code = code;
  }

  public static async parse(response: Response, fallbackMessage: string): Promise<BackendResponseError> {
    let responseBody: unknown;

    try {
      responseBody = await response.json();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }

      return new BackendResponseError({
        message: fallbackMessage,
        status: response.status,
        cause: error,
      });
    }

    const parsedResponseBody = backendResponseErrorSchema.safeParse(responseBody);

    if (!parsedResponseBody.success) {
      return new BackendResponseError({
        message: fallbackMessage,
        status: response.status,
        cause: parsedResponseBody.error,
      });
    }

    return new BackendResponseError({
      message: parsedResponseBody.data.message,
      status: response.status,
      code: parsedResponseBody.data.code,
    });
  }
}
