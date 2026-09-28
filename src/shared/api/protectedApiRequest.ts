import { z } from 'zod';
import { apiRequest } from './apiRequest';
import { getSavedAccessToken, invalidateAuthSession, refreshExpiredAccessToken } from './authSession';
import { BackendResponseError } from './backendResponseError';
import type { ApiRequestFunction, ApiRequestParameters } from './apiRequest';

type SingleApiRequestFunction = <ResponseSchema extends z.ZodType>(
  providedAccessToken: string,
  ...apiRequestParameters: ApiRequestParameters<ResponseSchema>
) => Promise<z.output<ResponseSchema>>;

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

const retryRequest: ApiRequestFunction = async (fetchInput, fetchInitOptions, apiRequestOptions) => {
  const savedAccessToken = getSavedAccessToken();

  try {
    return await singleApiRequest(savedAccessToken, fetchInput, fetchInitOptions, apiRequestOptions);
  } catch (error) {
    if (error instanceof BackendResponseError && error.status === 401) {
      invalidateAuthSession();
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
      invalidateAuthSession();

      throw error;
    }

    await refreshExpiredAccessToken(savedAccessToken);

    return await retryRequest(fetchInput, fetchInitOptions, apiRequestOptions);
  }
}
