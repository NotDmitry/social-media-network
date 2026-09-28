export type ThemeVariant = 'light' | 'dark';

export interface ThemeStore {
  theme: ThemeVariant;
  setTheme: (newTheme: ThemeVariant) => void;
}
