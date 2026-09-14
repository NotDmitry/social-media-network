import { refreshResponseSchema } from '@/entities/auth/schema';
import type { RefreshResponsePayload } from '@/entities/auth/types';

const REFRESH_ERROR_MESSAGE = 'Session refresh unavailable';

let activeRefreshSession: Promise<RefreshResponsePayload> | null = null;

async function requestRefresh(): Promise<RefreshResponsePayload> {
  let response: Response;

  try {
    response = await fetch('/api/refresh', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    throw new Error(`Cannot connect to the server`, {
      cause: error,
    });
  }

  if (response.status === 401) {
    throw new Error('Session expired');
  }

  if (!response.ok) {
    throw new Error(REFRESH_ERROR_MESSAGE);
  }

  let responseBody: unknown;

  try {
    responseBody = await response.json();
  } catch {
    throw new Error('Unable to parse the response body');
  }

  const parsedRefreshResponseBody = refreshResponseSchema.safeParse(responseBody);

  if (!parsedRefreshResponseBody.success) {
    throw new Error('Response body is malformed');
  }

  return parsedRefreshResponseBody.data;
}

export function refresh(): Promise<RefreshResponsePayload> {
  if (activeRefreshSession !== null) {
    return activeRefreshSession;
  }

  activeRefreshSession = requestRefresh().finally(() => {
    activeRefreshSession = null;
  })

  return activeRefreshSession;
}

