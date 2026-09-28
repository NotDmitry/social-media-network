import { useCallback, useEffect, useEffectEvent, useState } from 'react';
import { login } from '@/entities/auth/api/login';
import { logout } from '@/entities/auth/api/logout';
import { refresh } from '@/entities/auth/api/refresh';
import { signup } from '@/entities/auth/api/signup';
import { getCurrentUser } from '@/entities/User/api/getCurrentUser';
import { updateProfile as requestProfileUpdate } from '@/entities/User/api/updateProfile';
import { toUserView } from '@/entities/User/utilities';
import type { UpdateProfilePayload } from '@/entities/User/types';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import { accessToken } from '@/shared/api/accessToken';
import { BackendResponseError } from '@/shared/api/backendResponseError';
import { AuthContext } from './context';
import type { AuthState, SignInPayload, SignUpPayload } from './types';

interface AuthContextProviderProps {
  children: React.ReactNode;
}

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    status: 'pending',
    currentUser: null,
  });

  const { showAlert } = useAlert();

  const showAlertWithError = useEffectEvent((message: string) => {
    showAlert(message, 'error');
  });

  const clearSession = useCallback(() => {
    accessToken.clear();
    setAuthState({
      status: 'guest',
      currentUser: null,
    });
  }, []);

  useEffect(() => {
    const sessionAbortController = new AbortController();

    async function restoreSession() {
      try {
        const refreshResponsePayload = await refresh();

        if (sessionAbortController.signal.aborted) {
          return;
        }

        accessToken.set(refreshResponsePayload.token);

        const currentUser = await getCurrentUser(sessionAbortController.signal);

        setAuthState({
          status: 'authenticated',
          currentUser,
        });
      } catch (error) {
        if (sessionAbortController.signal.aborted) {
          return;
        }

        if (error instanceof BackendResponseError && (error.status === 400 || error.status === 401)) {
          if (error.code !== 'REFRESH_TOKEN_REQUIRED') {
            showAlertWithError(error.message);
          }

          clearSession();

          return;
        }

        showAlertWithError(error instanceof Error ? error.message : 'Service unavailable');
        console.error(error);
        setAuthState({
          status: 'unavailable',
          currentUser: null,
        });
      }
    }

    void restoreSession();

    return () => {
      sessionAbortController.abort();
    };
  }, [clearSession]);

  async function signIn(signInPayload: SignInPayload) {
    const loginResponsePayload = await login(signInPayload);

    accessToken.set(loginResponsePayload.token);
    setAuthState({
      status: 'authenticated',
      currentUser: loginResponsePayload.user,
    });
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
      clearSession();
    }
  }

  async function requestProfileUpdateOnce(updatedFields: UpdateProfilePayload) {
    const updatedUser = await requestProfileUpdate(updatedFields);

    setAuthState((currentState) => {
      if (currentState.status !== 'authenticated') {
        return currentState;
      }

      return {
        status: 'authenticated',
        currentUser: updatedUser,
      };
    });
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
        clearSession();
      }

      throw error;
    }
  }

  async function retryProfileUpdate(updatedFields: UpdateProfilePayload) {
    try {
      await requestProfileUpdateOnce(updatedFields);
    } catch (error) {
      if (error instanceof BackendResponseError && error.status === 401) {
        clearSession();
      }

      throw error;
    }
  }

  async function updateProfile(updatedFields: UpdateProfilePayload) {
    const providedAccessToken = accessToken.get();

    if (providedAccessToken === null) {
      clearSession();

      throw new Error('Access token is missing');
    }

    try {
      await requestProfileUpdateOnce(updatedFields);
    } catch (error) {
      if (!(error instanceof BackendResponseError) || error.status !== 401) {
        throw error;
      }

      if (error.code !== 'TOKEN_EXPIRED') {
        clearSession();

        throw error;
      }

      await refreshExpiredAccessToken(providedAccessToken);
      await retryProfileUpdate(updatedFields);
    }
  }

  return (
    <AuthContext value={{
      authStatus: authState.status,
      currentUser: authState.status === 'authenticated' ? toUserView(authState.currentUser) : null,
      isUserAuthenticated: authState.status === 'authenticated',
      signIn,
      signUp,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext>
  );
}

export default AuthContextProvider;
