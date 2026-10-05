import { z } from 'zod';

export const backendErrorCodeSchema = z.enum([
  'AUTH_BACKEND_UNAVAILABLE',
  'EMAIL_TAKEN',
  'FORBIDDEN',
  'INVALID_CREDENTIALS',
  'INVALID_CURRENT_PASSWORD',
  'INVALID_PAGINATION',
  'NOT_FOUND',
  'REFRESH_TOKEN_EXPIRED',
  'REFRESH_TOKEN_INVALID',
  'REFRESH_TOKEN_REQUIRED',
  'REFRESH_TOKEN_REUSED',
  'TOKEN_EXPIRED',
  'UNAUTHENTICATED',
  'USER_NOT_FOUND',
  'VALIDATION_FAILED',
]);

export type BackendErrorCode = z.infer<typeof backendErrorCodeSchema>;

export function isRefreshTokenErrorCode(code?: BackendErrorCode): boolean {
  return (
    code === 'REFRESH_TOKEN_EXPIRED' ||
    code === 'REFRESH_TOKEN_INVALID' ||
    code === 'REFRESH_TOKEN_REQUIRED' ||
    code === 'REFRESH_TOKEN_REUSED'
  );
}
