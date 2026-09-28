import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { AuthState } from '@/entities/auth/types';
import type { UserModel } from '@/entities/User/types';

const initialState: AuthState = {
  status: 'pending',
  currentUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionCleared(state) {
      state.status = 'guest';
      state.currentUser = null;
    },
    sessionEstablished(state, action: PayloadAction<UserModel>) {
      state.status = 'authenticated';
      state.currentUser = action.payload;
    },
    sessionUnavailable(state) {
      state.status = 'unavailable';
      state.currentUser = null;
    },
    userProfileUpdated(state, action: PayloadAction<UserModel>) {
      if (state.status !== 'authenticated') {
        return;
      }

      state.currentUser = action.payload;
    },
  },
});

export const selectAuthState = (state: RootState) => state.auth;

export const {
  sessionCleared,
  sessionEstablished,
  sessionUnavailable,
  userProfileUpdated,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
