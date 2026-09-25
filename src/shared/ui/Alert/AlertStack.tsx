import { createPortal } from 'react-dom';
import Alert from './index';
import type { AlertModel } from './types';

interface AlertStackProps {
  alerts: AlertModel[];
  duration?: number;
  onClose: (alertId: string) => void;
}

function AlertStack({ alerts, duration, onClose }: AlertStackProps) {
  if (alerts.length === 0) {
    return null;
  }

  return createPortal(
    <div className='alert-stack'>
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          {...alert}
          duration={duration}
          onClose={onClose}
        />
      ))}
    </div>,
    document.body
  );
}

export default AlertStack;
