import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAlertStore } from '@/shared/ui/Alert/model/store';
import Alert from '@/shared/ui/Alert/AlertComponent';
import './style.css';

const VISIBLE_ALERTS_DESKTOP_LIMIT = 5;
const VISIBLE_ALERTS_MOBILE_LIMIT = 3;
const RESIZE_TO_MOBILE_MEDIA_QUERY = 'screen and (width < 480px)';

interface AlertStackProps {
  duration?: number;
}

function AlertStack({ duration }: AlertStackProps) {
  const alerts = useAlertStore((state) => state.alerts);
  const closeAlert = useAlertStore((state) => state.closeAlert);
  const [visibleAlertsLimit, setVisibleAlertsLimit] = useState<number>(() => {
    return window.matchMedia(RESIZE_TO_MOBILE_MEDIA_QUERY).matches ?
      VISIBLE_ALERTS_MOBILE_LIMIT : VISIBLE_ALERTS_DESKTOP_LIMIT;
  });

  const visibleAlerts = alerts.slice(0, visibleAlertsLimit);

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

  if (visibleAlerts.length === 0) {
    return null;
  }

  return createPortal(
    <div className='alert-stack'>
      {visibleAlerts.map((alert) => (
        <Alert
          key={alert.id}
          {...alert}
          duration={duration}
          onClose={closeAlert}
        />
      ))}
    </div>,
    document.body
  );
}

export default AlertStack;
