import { store } from '@/app/store';
import { refresh } from '@/entities/auth/api/refresh';
import { sessionCleared } from '@/entities/auth/model/authSlice';
import { accessToken } from './accessToken';
import { BackendResponseError } from './backendResponseError';
import { isRefreshTokenErrorCode } from './backendErrorCode';

export function invalidateAuthSession() {
  store.dispatch(sessionCleared());
}

export function getSavedAccessToken(): string {
  const savedAccessToken = accessToken.get();

  if (savedAccessToken === null) {
    invalidateAuthSession();

    throw new Error('Access token is missing');
  }

  return savedAccessToken;
}

export async function refreshExpiredAccessToken(providedAccessToken: string) {
  if (accessToken.get() !== providedAccessToken) {
    return;
  }

  try {
    const refreshResponsePayload = await refresh();

    if (accessToken.get() === providedAccessToken) {
      accessToken.set(refreshResponsePayload.token);
    }
  } catch (error) {
    if (error instanceof BackendResponseError && isRefreshTokenErrorCode(error.code)) {
      invalidateAuthSession();
    }

    throw error;
  }
}
