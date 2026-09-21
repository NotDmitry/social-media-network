import { useEffect, useEffectEvent } from 'react';
import { useAppDispatch } from '@/app/store/hooks';
import { sessionCleared, sessionEstablished, sessionUnavailable } from '@/entities/auth/model/authSlice';
import { refresh } from '@/entities/auth/api/refresh';
import { getCurrentUser } from '@/entities/User/api/getCurrentUser';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import { accessToken } from '@/shared/api/accessToken';
import { BackendResponseError } from '@/shared/api/backendResponseError';

function AppInitializer() {
  const dispatch = useAppDispatch();
  const { showAlert } = useAlert();

  const showAlertWithError = useEffectEvent((message: string) => {
    showAlert(message, 'error');
  });

  useEffect(() => {
    const sessionAbortController = new AbortController();

    async function restoreSession() {
      try {
        const refreshResponsePayload = await refresh();

        if (sessionAbortController.signal.aborted) {
          return;
        }

        accessToken.set(refreshResponsePayload.token);

        const currentUser = await getCurrentUser(sessionAbortController.signal);

        dispatch(sessionEstablished(currentUser));
      } catch (error) {
        if (sessionAbortController.signal.aborted) {
          return;
        }

        if (error instanceof BackendResponseError && (error.status === 400 || error.status === 401)) {
          if (error.code !== 'REFRESH_TOKEN_REQUIRED') {
            showAlertWithError(error.message);
          }

          dispatch(sessionCleared());

          return;
        }

        showAlertWithError(error instanceof Error ? error.message : 'Service unavailable');
        console.error(error);
        dispatch(sessionUnavailable());
      }
    }

    void restoreSession();

    return () => {
      sessionAbortController.abort();
    };
  }, [dispatch]);

  return null;
}

export default AppInitializer;
