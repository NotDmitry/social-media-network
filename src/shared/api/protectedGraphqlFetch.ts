import { getSavedAccessToken, invalidateAuthSession, refreshExpiredAccessToken } from './authSession';

type FetchType = typeof fetch;

type FetchWithAccessTokenFunction = (
  providedAccessToken: string,
  ...fetchParameters: Parameters<FetchType>
) => ReturnType<FetchType>;

const fetchWithAccessToken: FetchWithAccessTokenFunction = (
  providedAccessToken,
  fetchInput,
  fetchInitOptions
) => {
  const requestHeaders = new Headers(fetchInitOptions?.headers);
  requestHeaders.set('Authorization', `Bearer ${providedAccessToken}`);

  return fetch(fetchInput, { ...fetchInitOptions, headers: requestHeaders });
}

const retryRequest: FetchType = async (fetchInput, fetchInitOptions) => {
  const savedAccessToken = getSavedAccessToken();
  const response = await fetchWithAccessToken(savedAccessToken, fetchInput, fetchInitOptions);

  if (response.status === 401) {
    invalidateAuthSession();
  }

  return response;
}

export const protectedGraphqlFetch: FetchType = async (fetchInput, fetchInitOptions) => {
  const savedAccessToken = getSavedAccessToken();
  const response = await fetchWithAccessToken(savedAccessToken, fetchInput, fetchInitOptions);

  if (response.status !== 401) {
    return response;
  }

  await refreshExpiredAccessToken(savedAccessToken);

  return await retryRequest(fetchInput, fetchInitOptions);
}
