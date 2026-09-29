import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommonTranslations from './locales/en/common.json';
import enErrorPageTranslations from './locales/en/errorPage.json';
import ruCommonTranslations from './locales/ru/common.json';
import ruErrorPageTranslations from './locales/ru/errorPage.json';

export const defaultNS = 'common';

const namespaces = [
  'common',
  'errorPage',
] as const;

export const resources = {
  en: {
    common: enCommonTranslations,
    errorPage: enErrorPageTranslations,
  },
  ru: {
    common: ruCommonTranslations,
    errorPage: ruErrorPageTranslations,
  },
} as const;

void i18n
  .use(initReactI18next)
  .init({
    resources,
    ns: namespaces,
    defaultNS,
    lng: 'ru',
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
