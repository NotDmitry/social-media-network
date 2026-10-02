export type SupportedLanguage = 'en' | 'ru';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'ru'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

const CURRENT_LANGUAGE_STORAGE_KEY = 'currentLanguage';

export function isSupportedLanguage(language: unknown): language is SupportedLanguage {
  return SUPPORTED_LANGUAGES.some((supportedLanguage) => supportedLanguage === language);
}

export function getSavedLanguageFromStorage(): SupportedLanguage {
  try {
    const storedLanguage = localStorage.getItem(CURRENT_LANGUAGE_STORAGE_KEY);

    return isSupportedLanguage(storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE;
  } catch (error) {
    console.error(error);

    return DEFAULT_LANGUAGE;
  }
}

export function saveLanguage(language: SupportedLanguage) {
  try {
    localStorage.setItem(CURRENT_LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.error(error);
  }
}
