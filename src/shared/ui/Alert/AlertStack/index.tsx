import { useEffect, useState } from 'react';
import { animated, config, useTransition } from '@react-spring/web';
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

  const transitions = useTransition(visibleAlerts, {
    from: {
      opacity: 0,
      transform: 'translateX(100%)',
    },
    enter: {
      opacity: 1,
      transform: 'translateX(0%)',
    },
    leave: {
      opacity: 0,
      transform: 'translateX(-100%)',
    },
    config: config.gentle,
    exitBeforeEnter: true,
  });

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

  return createPortal(
    <div className='alert-stack'>
      {transitions((style, alert) => (
        <animated.div style={style}>
          <Alert
            {...alert}
            duration={duration}
            onClose={closeAlert}
          />
        </animated.div>
      ))}
    </div>,
    document.body
  );
}

export default AlertStack;
