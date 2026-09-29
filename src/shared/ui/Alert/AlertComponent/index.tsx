import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CrossIcon } from '@/shared/icons';
import type { AlertModel } from '@/shared/ui/Alert/model/types';
import './style.css';

interface AlertProps extends AlertModel {
  duration?: number;
  onClose: (alertId: string) => void;
}

function Alert({ id, message, severity, duration, onClose }: AlertProps) {
  const { t } = useTranslation('common');
  const handleAlertClose = useCallback(() => {
    onClose(id);
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
        aria-label={t(($) => $.a11y.closeNotification)}
      >
        <CrossIcon />
      </button>
    </div>
  );
}

export default Alert;
