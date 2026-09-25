import { useCallback, useEffect } from 'react';
import { CrossIcon } from '@/shared/icons';
import './style.css';

export type AlertSeverityLevel = 'success' | 'warning' | 'error';

export interface AlertProps {
  id: string;
  message: string;
  severity?: AlertSeverityLevel;
  duration?: number;
  onClose?: (alertId: string) => void;
}

function Alert({ id, message, severity = 'success', duration, onClose }: AlertProps) {
  const handleAlertClose = useCallback(() => {
    onClose?.(id);
  }, [id, onClose]);

  useEffect(() => {
    if (duration === undefined) {
      return;
    }

    const alertTimerId = setTimeout(handleAlertClose, duration);

    return () => {
      clearTimeout(alertTimerId);
    };
  }, [duration, handleAlertClose]);

  return (
    <div className={`alert alert_${severity}`}>
      <p className='alert-message'>{message}</p>
      <button
        className='alert-button'
        type='button'
        onClick={handleAlertClose}
        aria-label='Close notification'
      >
        <CrossIcon />
      </button>
    </div>
  );
}

export default Alert;
