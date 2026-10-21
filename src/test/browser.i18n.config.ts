import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { defaultNS, namespaces, resources } from '@/app/config/i18nResources';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/features/language/model';

const initPromise = i18n
  .use(initReactI18next)
  .init({
    resources,
    ns: namespaces,
    defaultNS,
    lng: 'en',
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false
    }
  });

await initPromise;
