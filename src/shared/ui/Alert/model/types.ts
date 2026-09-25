export type AlertSeverityLevel = 'success' | 'warning' | 'error';

export interface AlertModel {
  id: string;
  message: string;
  severity: AlertSeverityLevel;
}

export interface AlertStore {
  alerts: AlertModel[];
  showAlert: (message: string, severity: AlertSeverityLevel) => void;
  closeAlert: (alertId: string) => void;
}
