import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  selectAuthState,
  sessionCleared,
  sessionEstablished,
  userProfileUpdated,
} from '@/entities/auth/model/authSlice';
import { login } from '@/entities/auth/api/login';
import { logout } from '@/entities/auth/api/logout';
import { refresh } from '@/entities/auth/api/refresh';
import { signup } from '@/entities/auth/api/signup';
import type { AuthExposedApi, SignInPayload, SignUpPayload } from '@/entities/auth/types';
import { updateProfile as requestProfileUpdate } from '@/entities/User/api/updateProfile';
import { toUserView } from '@/entities/User/utilities';
import type { UpdateProfilePayload } from '@/entities/User/types';
import { accessToken } from '@/shared/api/accessToken';
import { BackendResponseError } from '@/shared/api/backendResponseError';

export function useAuth(): AuthExposedApi {
  const authState = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();

  async function signIn(signInPayload: SignInPayload) {
    const loginResponsePayload = await login(signInPayload);

    accessToken.set(loginResponsePayload.token);
    dispatch(sessionEstablished(loginResponsePayload.user));
  }

  async function signUp(signUpPayload: SignUpPayload) {
    const signUpResponsePayload = await signup(signUpPayload);

    await signIn({
      email: signUpPayload.email,
      password: signUpPayload.password,
    });

    return signUpResponsePayload;
  }

  async function signOut() {
    try {
      const logoutResponsePayload = await logout();

      return logoutResponsePayload;
    } finally {
      dispatch(sessionCleared());
    }
  }

  async function requestProfileUpdateOnce(updatedFields: UpdateProfilePayload) {
    const updatedUser = await requestProfileUpdate(updatedFields);

    dispatch(userProfileUpdated(updatedUser));
  }

  async function refreshExpiredAccessToken(providedAccessToken: string) {
    const currentAccessToken = accessToken.get();

    if (currentAccessToken !== providedAccessToken) {
      return;
    }

    try {
      const refreshResponsePayload = await refresh();
      accessToken.set(refreshResponsePayload.token);
    } catch (error) {
      if (
        error instanceof BackendResponseError
        && (error.status === 400 || error.status === 401)
      ) {
        dispatch(sessionCleared());
      }

      throw error;
    }
  }

  async function retryProfileUpdate(updatedFields: UpdateProfilePayload) {
    try {
      await requestProfileUpdateOnce(updatedFields);
    } catch (error) {
      if (error instanceof BackendResponseError && error.status === 401) {
        dispatch(sessionCleared());
      }

      throw error;
    }
  }

  async function updateProfile(updatedFields: UpdateProfilePayload) {
    const providedAccessToken = accessToken.get();

    if (providedAccessToken === null) {
      dispatch(sessionCleared());

      throw new Error('Access token is missing');
    }

    try {
      await requestProfileUpdateOnce(updatedFields);
    } catch (error) {
      if (!(error instanceof BackendResponseError) || error.status !== 401) {
        throw error;
      }

      if (error.code !== 'TOKEN_EXPIRED') {
        dispatch(sessionCleared());

        throw error;
      }

      await refreshExpiredAccessToken(providedAccessToken);
      await retryProfileUpdate(updatedFields);
    }
  }

  const currentUser = authState.status === 'authenticated' && authState.currentUser !== null ?
    toUserView(authState.currentUser) : null;

  return {
    authStatus: authState.status,
    currentUser,
    isUserAuthenticated: authState.status === 'authenticated',
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
}
