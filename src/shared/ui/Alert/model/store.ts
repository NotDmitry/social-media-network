import { create } from 'zustand';
import type { AlertModel, AlertStore } from './types';

export const useAlertStore = create<AlertStore>()((set) => ({
  alerts: [],

  showAlert: (message, severity) => {
    const id = crypto.randomUUID();
    const newAlert: AlertModel = { id, message, severity };

    set((state) => ({
      alerts: [...state.alerts, newAlert],
    }));
  },

  closeAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== alertId),
    }));
  },
}));
