import { refreshResponseSchema } from '@/entities/auth/schema';
import type { RefreshResponsePayload } from '@/entities/auth/types';
import { apiRequest } from '@/shared/api/apiRequest';

const REFRESH_ERROR_MESSAGE = 'Session refresh unavailable';

let activeRefreshSessionRequest: Promise<RefreshResponsePayload> | null = null;

async function requestRefresh(): Promise<RefreshResponsePayload> {
  return apiRequest(
    '/api/refresh',
    {
      method: 'POST',
      credentials: 'include',
    },
    {
      responseValidationSchema: refreshResponseSchema,
      fallbackErrorMessage: REFRESH_ERROR_MESSAGE,
    }
  );

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
