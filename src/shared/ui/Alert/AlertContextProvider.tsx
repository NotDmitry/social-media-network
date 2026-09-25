import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertContext } from './context';
import AlertStack from './AlertStack';
import type { AlertModel, AlertSeverityLevel } from './types';

const ALERT_DURATION_MS = 5000;
const VISIBLE_ALERTS_DESKTOP_LIMIT = 5;
const VISIBLE_ALERTS_MOBILE_LIMIT = 3;
const RESIZE_TO_MOBILE_MEDIA_QUERY = 'screen and (width < 480px)';

interface AlertContextProviderProps {
  children: React.ReactNode;
}

function AlertContextProvider({ children }: AlertContextProviderProps) {
  const [alerts, setAlerts] = useState<AlertModel[]>([]);
  const [visibleAlertsLimit, setVisibleAlertsLimit] = useState<number>(() => {
    return window.matchMedia(RESIZE_TO_MOBILE_MEDIA_QUERY).matches ?
      VISIBLE_ALERTS_MOBILE_LIMIT : VISIBLE_ALERTS_DESKTOP_LIMIT;
  });

  const visibleAlerts = alerts.slice(0, visibleAlertsLimit);

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

  useEffect(() => {
    const windowResizeMediaQuery = window.matchMedia(RESIZE_TO_MOBILE_MEDIA_QUERY);

    const handleToMobileBreakpointChange = () => {
      if (windowResizeMediaQuery.matches) {
        setVisibleAlertsLimit(VISIBLE_ALERTS_MOBILE_LIMIT);
      } else {
        setVisibleAlertsLimit(VISIBLE_ALERTS_DESKTOP_LIMIT);
      }
    }

    windowResizeMediaQuery.addEventListener('change', handleToMobileBreakpointChange);

    return () => {
      windowResizeMediaQuery.removeEventListener('change', handleToMobileBreakpointChange);
    };
  }, []);

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
