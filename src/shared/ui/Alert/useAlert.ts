import { useContext } from 'react';
import { AlertContext } from './context'

export function useAlert() {
  const alertContextData = useContext(AlertContext);

  if (!alertContextData) {
    throw new Error('useAlert hook must be used inside AlertContext provider');
  }

  return alertContextData;
}
