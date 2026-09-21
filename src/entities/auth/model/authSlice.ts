import { createSlice } from '@reduxjs/toolkit';
import type { AuthState } from '@/entities/auth/types';

const initialState: AuthState = {
  status: 'pending',
  currentUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {}
});

export const authReducer = authSlice.reducer;
