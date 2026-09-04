import { useState } from 'react';
import { AuthContext } from './context';
import type { SignInPayload, SignUpPayload } from './types';
import { isUserModel, type UserModel } from '@entities/User/types';
import { getAuthUserMock } from '@entities/User/mocks';

const CURRENT_USER_STORAGE_KEY = 'currentUser';

interface AuthContextProviderProps {
  children: React.ReactNode;
}

function getCurrentUserFromStorage(): UserModel | null {
  try {
    const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);

    if (storedUser === null) {
      return null;
    }

    const parsedUser: unknown = JSON.parse(storedUser);
    const currentUser = isUserModel(parsedUser) ? parsedUser : null;

    return currentUser;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [currentUser, setCurrentUser] = useState<UserModel | null>(() => getCurrentUserFromStorage());

  function updateCurrentUser(user: UserModel | null) {
    try {
      if (user === null) {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      } else {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      }

      setCurrentUser(user);
    } catch (error) {
      console.error(error);
    }
  }

  function signIn({ email }: SignInPayload) {
    updateCurrentUser({
      ...getAuthUserMock(),
      email
    });
  }

  function signUp({ email, fullName }: SignUpPayload) {
    updateCurrentUser({
      ...getAuthUserMock(),
      email,
      fullName
    });
  }

  function signOut() {
    updateCurrentUser(null);
  }

  return (
    <AuthContext value={{
      currentUser,
      isUserAuthenticated: currentUser !== null,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext>
  );
}

export default AuthContextProvider;
