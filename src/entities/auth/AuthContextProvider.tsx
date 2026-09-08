import { useState } from 'react';

import { getAuthUserMock } from '@/entities/User/mocks';
import { isUserModel } from '@/entities/User/types';
import type { UserModel } from '@/entities/User/types';

import { AuthContext } from './context';
import type { SignInPayload, SignUpPayload, UpdateProfilePayload } from './types';

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

  function updateProfile(updatedFields: UpdateProfilePayload) {
    if (currentUser === null) {
      return;
    }

    updateCurrentUser({
      ...currentUser,
      ...updatedFields,
    });
  }

  return (
    <AuthContext value={{
      currentUser,
      isUserAuthenticated: currentUser !== null,
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
