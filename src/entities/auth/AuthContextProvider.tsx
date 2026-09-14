import { useState } from 'react';
import { login } from '@/entities/auth/api/login';
import { logout } from '@/entities/auth/api/logout';
import { signup } from '@/entities/auth/api/signup';
import { toUserView } from '@/entities/User/types';
import { accessToken } from '@/shared/api/accessToken';
import { AuthContext } from './context';
import type { AuthState, SignInPayload, SignUpPayload, UpdateProfilePayload } from './types';

interface AuthContextProviderProps {
  children: React.ReactNode;
}

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    status: 'guest',
    currentUser: null,
  });

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
    })

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
