import { useContext } from 'react';
import { ThemeContext } from './context'

export function useTheme() {
  const themeContextData = useContext(ThemeContext);

  if (!themeContextData) {
    throw new Error('useTheme hook must be used inside ThemeContext provider');
  }

  return themeContextData;
}
