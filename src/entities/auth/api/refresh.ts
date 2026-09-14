import { refreshResponseSchema } from '@/entities/auth/schema';
import type { RefreshResponsePayload } from '@/entities/auth/types';
import { BackendResponseError } from '@/shared/api/backendResponseError';

const REFRESH_ERROR_MESSAGE = 'Session refresh unavailable';

let activeRefreshSessionRequest: Promise<RefreshResponsePayload> | null = null;

async function requestRefresh(): Promise<RefreshResponsePayload> {
  let response: Response;

  try {
    response = await fetch('/api/refresh', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    throw new Error('Cannot connect to the server', {
      cause: error,
    });
  }

  if (!response.ok) {
    throw await BackendResponseError.parse(response, REFRESH_ERROR_MESSAGE);
  }

  let responseBody: unknown;

  try {
    responseBody = await response.json();
  } catch (error) {
    throw new Error('Unable to parse the response body', {
      cause: error,
    });
  }

  const parsedRefreshResponseBody = refreshResponseSchema.safeParse(responseBody);

  if (!parsedRefreshResponseBody.success) {
    throw new Error('Response body is malformed');
  }

  return parsedRefreshResponseBody.data;
}

export function refresh(): Promise<RefreshResponsePayload> {
  if (activeRefreshSessionRequest !== null) {
    return activeRefreshSessionRequest;
  }

  activeRefreshSessionRequest = requestRefresh().finally(() => {
    activeRefreshSessionRequest = null;
  });

  return activeRefreshSessionRequest;
}
