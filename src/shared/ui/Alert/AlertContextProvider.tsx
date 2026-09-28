import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertContext } from './context';
import Alert from './index';
import type { AlertProps, AlertSeverityLevel } from './index';

const ALERT_DURATION_MS = 5000;

interface AlertContextProviderProps {
  children: React.ReactNode;
}

function AlertContextProvider({ children }: AlertContextProviderProps) {
  const [activeAlert, setActiveAlert] = useState<AlertProps | null>(null);

  const showAlert = useCallback((message: string, severity: AlertSeverityLevel = 'success') => {
    setActiveAlert({ message, severity });
  }, []);

  const closeAlert = useCallback(() => {
    setActiveAlert(null);
  }, []);

  const contextValue = useMemo(() => {
    return {
      showAlert,
      closeAlert,
    }
  }, [showAlert, closeAlert]);

  useEffect(() => {
    if (activeAlert === null) {
      return;
    }

    const timer = setTimeout(() => {
      setActiveAlert((currentAlert) => currentAlert === activeAlert ? null : currentAlert);
    }, ALERT_DURATION_MS);

    return () => {
      clearTimeout(timer);
    }
  }, [activeAlert])

  return (
    <AlertContext value={contextValue}>
      {children}
      {activeAlert && (
        <Alert
          message={activeAlert.message}
          severity={activeAlert.severity}
          onClose={closeAlert}
        />
      )}
    </AlertContext>
  );
}

export default AlertContextProvider;
