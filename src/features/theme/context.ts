import { createContext } from 'react';
import type { ThemeVariant } from './types';

interface ThemeContextData {
  theme: ThemeVariant;
  setTheme: (newTheme: ThemeVariant) => void;
}

export const ThemeContext = createContext<ThemeContextData | null>(null);
