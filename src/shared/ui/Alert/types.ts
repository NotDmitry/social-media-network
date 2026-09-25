export type AlertSeverityLevel = 'success' | 'warning' | 'error';

export interface AlertModel {
  id: string;
  message: string;
  severity: AlertSeverityLevel;
}
