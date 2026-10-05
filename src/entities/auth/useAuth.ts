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
import { updateEmail as requestEmailUpdate } from '@/entities/auth/api/updateEmail';
import type { AuthExposedApi, SignInPayload, SignUpPayload, UpdateEmailPayload } from '@/entities/auth/types';
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
    await signup(signUpPayload);

    await signIn({
      email: signUpPayload.email,
      password: signUpPayload.password,
    });
  }

  async function signOut() {
    try {
      await logout();
    } finally {
      dispatch(sessionCleared());
    }
  }

  async function updateProfile(updatedFields: UpdateProfilePayload) {
    const updatedUser = await requestProfileUpdate(updatedFields);

    dispatch(userProfileUpdated(updatedUser));
  }

  async function updateEmail(updateEmailPayload: UpdateEmailPayload) {
    const updateEmailResponsePayload = await requestEmailUpdate(updateEmailPayload);

    dispatch(userProfileUpdated(updateEmailResponsePayload.user));
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
    updateEmail,
  };
}
