import { z } from 'zod';
import { store } from '@/app/store';
import { sessionCleared } from '@/entities/auth/model/authSlice';
import { refresh } from '@/entities/auth/api/refresh';
import { accessToken } from './accessToken';
import { apiRequest } from './apiRequest';
import { BackendResponseError } from './backendResponseError';
import type { ApiRequestFunction, ApiRequestParameters } from './apiRequest';

type SingleApiRequestFunction = <ResponseSchema extends z.ZodType>(
  providedAccessToken: string,
  ...apiRequestParameters: ApiRequestParameters<ResponseSchema>
) => Promise<z.output<ResponseSchema>>;

function getSavedAccessToken(): string {
  const savedAccessToken = accessToken.get();

  if (savedAccessToken === null) {
    store.dispatch(sessionCleared());

    throw new Error('Access token is missing');
  }

  return savedAccessToken;
}

const singleApiRequest: SingleApiRequestFunction = async (
  providedAccessToken,
  fetchInput,
  fetchInitOptions,
  apiRequestOptions
) => {
  const requestHeaders = new Headers(fetchInitOptions.headers);
  requestHeaders.set('Authorization', `Bearer ${providedAccessToken}`);

  return apiRequest(
    fetchInput,
    { ...fetchInitOptions, headers: requestHeaders, },
    apiRequestOptions
  );
}

async function refreshExpiredAccessToken(providedAccessToken: string) {
  if (accessToken.get() !== providedAccessToken) {
    return;
  }

  try {
    const refreshResponsePayload = await refresh();

    if (accessToken.get() === providedAccessToken) {
      accessToken.set(refreshResponsePayload.token);
    }
  } catch (error) {
    if (
      error instanceof BackendResponseError
      && (error.status === 400 || error.status === 401)
    ) {
      store.dispatch(sessionCleared());
    }

    throw error;
  }
}

const retryRequest: ApiRequestFunction = async (fetchInput, fetchInitOptions, apiRequestOptions) => {
  const savedAccessToken = getSavedAccessToken();

  try {
    return await singleApiRequest(savedAccessToken, fetchInput, fetchInitOptions, apiRequestOptions);
  } catch (error) {
    if (error instanceof BackendResponseError && error.status === 401) {
      store.dispatch(sessionCleared());
    }

    throw error;
  }
}

export const protectedApiRequest: ApiRequestFunction = async (fetchInput, fetchInitOptions, apiRequestOptions) => {
  const savedAccessToken = getSavedAccessToken();

  try {
    return await singleApiRequest(savedAccessToken, fetchInput, fetchInitOptions, apiRequestOptions);
  } catch (error) {
    if (!(error instanceof BackendResponseError) || error.status !== 401) {
      throw error;
    }

    if (error.code !== 'TOKEN_EXPIRED') {
      store.dispatch(sessionCleared());

      throw error;
    }

    await refreshExpiredAccessToken(savedAccessToken);

    return await retryRequest(fetchInput, fetchInitOptions, apiRequestOptions);
  }
}
