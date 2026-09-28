import { useEffect, useEffectEvent, useState } from 'react';
import { login } from '@/entities/auth/api/login';
import { logout } from '@/entities/auth/api/logout';
import { refresh } from '@/entities/auth/api/refresh';
import { signup } from '@/entities/auth/api/signup';
import { getCurrentUser } from '@/entities/User/api/getCurrentUser';
import { toUserView } from '@/entities/User/types';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import { accessToken } from '@/shared/api/accessToken';
import { BackendResponseError } from '@/shared/api/backendResponseError';
import { AuthContext } from './context';
import type { AuthState, SignInPayload, SignUpPayload, UpdateProfilePayload } from './types';

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

          accessToken.clear();
          setAuthState({
            status: 'guest',
            currentUser: null,
          });

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
  }, []);

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
      accessToken.clear();
      setAuthState({
        status: 'guest',
        currentUser: null,
      });
    }
  }

  function updateProfile(updatedFields: UpdateProfilePayload) {
    setAuthState((currentState) => {
      if (currentState.status !== 'authenticated') {
        return currentState;
      }

      return {
        status: currentState.status,
        currentUser: {
          ...currentState.currentUser,
          ...updatedFields,
        },
      };
    });
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
