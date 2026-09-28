import { createListenerMiddleware } from '@reduxjs/toolkit';
import { accessToken } from '@/shared/api/accessToken';
import { sessionCleared } from './authSlice';

export const authListenerMiddleware = createListenerMiddleware();

authListenerMiddleware.startListening({
  actionCreator: sessionCleared,
  effect: () => {
    accessToken.clear();
  },
});
