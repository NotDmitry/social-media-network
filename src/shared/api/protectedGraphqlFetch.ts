import { z } from 'zod';
import { getSavedAccessToken, invalidateAuthSession, refreshExpiredAccessToken } from './authSession';
import { backendErrorCodeSchema } from './backendErrorCode';

const graphqlErrorResponseSchema = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
      extensions: z.object({
        code: backendErrorCodeSchema,
      }),
    })
  ),
});

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

  let responseBody: unknown;

  try {
    responseBody = await response.clone().json();
  } catch {
    invalidateAuthSession();

    return response;
  }

  const parsedResponseBody = graphqlErrorResponseSchema.safeParse(responseBody);

  const errorCode = parsedResponseBody.success ? parsedResponseBody.data.errors[0]?.extensions.code : undefined;

  if (errorCode !== 'TOKEN_EXPIRED') {
    invalidateAuthSession();

    return response;
  }

  await refreshExpiredAccessToken(savedAccessToken);

  return await retryRequest(fetchInput, fetchInitOptions);
}
