import { create } from 'zustand';
import type { ThemeStore, ThemeVariant } from './types';

const CURRENT_THEME_STORAGE_KEY = 'currentTheme';

function getCurrentThemeVariantFromStorage(): ThemeVariant {
  try {
    const storedThemeVariant = localStorage.getItem(CURRENT_THEME_STORAGE_KEY);

    return storedThemeVariant === 'dark' ? 'dark' : 'light';
  } catch (error) {
    console.error(error);

    return 'light';
  }
}

export const useThemeStore = create<ThemeStore>()((set) => ({
  theme: getCurrentThemeVariantFromStorage(),

  setTheme: (newTheme) => {
    try {
      localStorage.setItem(CURRENT_THEME_STORAGE_KEY, newTheme);
      set({ theme: newTheme });
    } catch (error) {
      console.error(error);
    }
  },
}));
