import { configureStore } from '@reduxjs/toolkit';
import { authListenerMiddleware } from '@/entities/auth/model/authListener';
import { authReducer } from '@/entities/auth/model/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(authListenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
