import { useEffect, useState } from 'react';
import { ThemeContext } from './context';
import type { ThemeVariant } from './types';

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

interface ThemeContextProviderProps {
  children: React.ReactNode;
}

function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeVariant>(() => getCurrentThemeVariantFromStorage());

  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme;
  }, [currentTheme])

  function setTheme(newTheme: ThemeVariant) {
    try {
      localStorage.setItem(CURRENT_THEME_STORAGE_KEY, newTheme);
      setCurrentTheme(newTheme);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ThemeContext value={{
      theme: currentTheme,
      setTheme,
    }}>
      {children}
    </ThemeContext>
  );
}

export default ThemeContextProvider;
