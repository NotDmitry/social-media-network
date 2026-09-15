import { useCallback, useMemo, useState } from 'react';
import { AlertContext } from './context';
import Alert from './index';
import type { AlertProps, AlertSeverityLevel } from './index';

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
