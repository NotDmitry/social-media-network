import { useAlertStore } from './store';

export function useAlert() {
  const showAlert = useAlertStore((state) => state.showAlert);

  return { showAlert };
}
