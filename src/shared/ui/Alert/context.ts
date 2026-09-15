import { createContext } from 'react';
import type { AlertSeverityLevel } from './index';

interface AlertContextData {
  showAlert: (message: string, severity?: AlertSeverityLevel) => void;
  closeAlert: () => void;
}

export const AlertContext = createContext<AlertContextData | null>(null);
