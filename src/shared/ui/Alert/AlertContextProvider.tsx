import { useCallback, useMemo, useState } from 'react';
import { AlertContext } from './context';
import AlertStack from './AlertStack';
import type { AlertModel, AlertSeverityLevel } from './types';

const ALERT_DURATION_MS = 5000;
const VISIBLE_ALERTS_LIMIT = 5;

interface AlertContextProviderProps {
  children: React.ReactNode;
}

function AlertContextProvider({ children }: AlertContextProviderProps) {
  const [alerts, setAlerts] = useState<AlertModel[]>([]);

  const visibleAlerts = alerts.slice(0, VISIBLE_ALERTS_LIMIT);

  const showAlert = useCallback((message: string, severity: AlertSeverityLevel) => {
    const id = crypto.randomUUID();
    const newAlert: AlertModel = { id, message, severity };

    setAlerts((stackedAlerts) => [...stackedAlerts, newAlert]);
  }, []);

  const closeAlert = useCallback((alertId: string) => {
    setAlerts((stackedAlerts) => stackedAlerts.filter((alert) => alert.id !== alertId));
  }, []);

  const contextValue = useMemo(() => {
    return {
      showAlert,
    }
  }, [showAlert]);

  return (
    <AlertContext value={contextValue}>
      {children}
      <AlertStack
        alerts={visibleAlerts}
        duration={ALERT_DURATION_MS}
        onClose={closeAlert}
      />
    </AlertContext>
  );
}

export default AlertContextProvider;
