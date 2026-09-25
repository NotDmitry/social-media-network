import { createContext } from 'react';
import type { AlertSeverityLevel } from './index';

interface AlertContextData {
  showAlert: (message: string, severity?: AlertSeverityLevel) => void;
}

export const AlertContext = createContext<AlertContextData | null>(null);
