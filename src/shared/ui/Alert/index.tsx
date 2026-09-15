import { createPortal } from 'react-dom';
import { CrossIcon } from '@/shared/icons';
import './style.css';

export type AlertSeverityLevel = 'success' | 'warning' | 'error';

export interface AlertProps {
  message: string;
  severity?: AlertSeverityLevel;
  onClose?: () => void;
}

function Alert({ message, severity = 'success', onClose }: AlertProps) {
  return createPortal(
    <div className={`alert alert_${severity}`}>
      <p className='alert-message'>{message}</p>
      <button
        className='alert-button'
        type='button'
        onClick={onClose}
        aria-label='Close notification'
      >
        <CrossIcon />
      </button>
    </div>,
    document.body
  );
}

export default Alert;
