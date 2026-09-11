import { useState } from 'react';
import { login } from '@/entities/auth/api/login';
import { toUserView } from '@/entities/User/types';
import { accessToken } from '@/shared/api/accessToken';
import { getAuthUserMock } from '@/shared/mocks/UserMocks';
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

    accessToken.set(loginResponsePayload.accessToken);
    setAuthState({
      status: 'authenticated',
      currentUser: loginResponsePayload.user,
    });
  }

  function signUp({ email, firstName, secondName }: SignUpPayload) {
    setAuthState({
      status: 'authenticated',
      currentUser: {
        ...getAuthUserMock(),
        email,
        firstName,
        secondName: secondName ?? null,
      }
    });
  }

  function signOut() {
    accessToken.clear();
    setAuthState({
      status: 'guest',
      currentUser: null,
    })
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
