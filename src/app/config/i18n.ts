import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  getSavedLanguageFromStorage,
  isSupportedLanguage,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  saveLanguage
} from '@/features/language/model';
import { defaultNS, namespaces, resources } from './i18nResources';

i18n.on('languageChanged', (language) => {
  if (!isSupportedLanguage(language)) {
    return;
  }

  document.documentElement.lang = language;
  saveLanguage(language);
});

void i18n
  .use(initReactI18next)
  .init({
    resources,
    ns: namespaces,
    defaultNS,
    lng: getSavedLanguageFromStorage(),
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
