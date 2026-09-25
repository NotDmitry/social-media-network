import { useAlertStore } from '@/shared/ui/Alert/model/store';

export function useAlert() {
  const showAlert = useAlertStore((state) => state.showAlert);

  return { showAlert };
}
