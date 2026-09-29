import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getSavedLanguageFromStorage, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/features/language/model';
import enCommonTranslations from './locales/en/common.json';
import enErrorPageTranslations from './locales/en/errorPage.json';
import enAuthenticationTranslations from './locales/en/authentication.json';
import enHomePageTranslations from './locales/en/homePage.json';
import enPostsTranslations from './locales/en/posts.json';
import enProfileTranslations from './locales/en/profile.json';
import ruCommonTranslations from './locales/ru/common.json';
import ruErrorPageTranslations from './locales/ru/errorPage.json';
import ruAuthenticationTranslations from './locales/ru/authentication.json';
import ruHomePageTranslations from './locales/ru/homePage.json';
import ruPostsTranslations from './locales/ru/posts.json';
import ruProfileTranslations from './locales/ru/profile.json';

export const defaultNS = 'common';

const namespaces = [
  'common',
  'errorPage',
  'authentication',
  'homePage',
  'posts',
  'profile',
] as const;

export const resources = {
  en: {
    common: enCommonTranslations,
    errorPage: enErrorPageTranslations,
    authentication: enAuthenticationTranslations,
    homePage: enHomePageTranslations,
    posts: enPostsTranslations,
    profile: enProfileTranslations,
  },
  ru: {
    common: ruCommonTranslations,
    errorPage: ruErrorPageTranslations,
    authentication: ruAuthenticationTranslations,
    homePage: ruHomePageTranslations,
    posts: ruPostsTranslations,
    profile: ruProfileTranslations,
  },
} as const;

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
