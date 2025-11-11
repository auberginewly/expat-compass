import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'

import enCommon from '@/locales/en/common.json'
import enHome from '@/locales/en/home.json'
import enNav from '@/locales/en/nav.json'
import enAuth from '@/locales/en/auth.json'
import enLegal from '@/locales/en/legal.json'
import zhCommon from '@/locales/zh/common.json'
import zhHome from '@/locales/zh/home.json'
import zhNav from '@/locales/zh/nav.json'
import zhAuth from '@/locales/zh/auth.json'
import zhLegal from '@/locales/zh/legal.json'

void i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        nav: enNav,
        home: enHome,
        auth: enAuth,
        legal: enLegal,
      },
      zh: {
        common: zhCommon,
        nav: zhNav,
        home: zhHome,
        auth: zhAuth,
        legal: zhLegal,
      },
    },
    fallbackLng: 'zh',
    supportedLngs: ['zh', 'en'],
    ns: ['common', 'nav', 'home', 'auth', 'legal'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'expat-compass-lang',
    },
  })

export default i18n

