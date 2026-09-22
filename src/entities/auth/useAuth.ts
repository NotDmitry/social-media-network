import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  selectAuthState,
  sessionCleared,
  sessionEstablished,
  userProfileUpdated,
} from '@/entities/auth/model/authSlice';
import { login } from '@/entities/auth/api/login';
import { logout } from '@/entities/auth/api/logout';
import { signup } from '@/entities/auth/api/signup';
import type { AuthExposedApi, SignInPayload, SignUpPayload } from '@/entities/auth/types';
import { updateProfile as requestProfileUpdate } from '@/entities/User/api/updateProfile';
import { toUserView } from '@/entities/User/utilities';
import type { UpdateProfilePayload } from '@/entities/User/types';
import { accessToken } from '@/shared/api/accessToken';

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

  async function updateProfile(updatedFields: UpdateProfilePayload) {
    const updatedUser = await requestProfileUpdate(updatedFields);

    dispatch(userProfileUpdated(updatedUser));
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
