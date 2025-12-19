import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'

import enCommon from '@/locales/en/common.json'
import enHome from '@/locales/en/home.json'
import enNav from '@/locales/en/nav.json'
import enAuth from '@/locales/en/auth.json'
import enLegal from '@/locales/en/legal.json'
import enForum from '@/locales/en/forum.json'
import enProfile from '@/locales/en/profile.json'
import enMedical from '@/locales/en/medical.json'
import enTransport from '@/locales/en/transport.json'
import enPayment from '@/locales/en/payment.json'
import enEducation from '@/locales/en/education.json'
import enCulture from '@/locales/en/culture.json'
import enFooter from '@/locales/en/footer.json'
import enAbout from '@/locales/en/about.json'
import zhCommon from '@/locales/zh/common.json'
import zhHome from '@/locales/zh/home.json'
import zhNav from '@/locales/zh/nav.json'
import zhAuth from '@/locales/zh/auth.json'
import zhLegal from '@/locales/zh/legal.json'
import zhForum from '@/locales/zh/forum.json'
import zhProfile from '@/locales/zh/profile.json'
import zhMedical from '@/locales/zh/medical.json'
import zhTransport from '@/locales/zh/transport.json'
import zhPayment from '@/locales/zh/payment.json'
import zhEducation from '@/locales/zh/education.json'
import zhCulture from '@/locales/zh/culture.json'
import zhFooter from '@/locales/zh/footer.json'
import zhAbout from '@/locales/zh/about.json'

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
        forum: enForum,
        profile: enProfile,
        medical: enMedical,
        transport: enTransport,
        payment: enPayment,
        education: enEducation,
        culture: enCulture,
        footer: enFooter,
        about: enAbout,
      },
      zh: {
        common: zhCommon,
        nav: zhNav,
        home: zhHome,
        auth: zhAuth,
        legal: zhLegal,
        forum: zhForum,
        profile: zhProfile,
        medical: zhMedical,
        transport: zhTransport,
        payment: zhPayment,
        education: zhEducation,
        culture: zhCulture,
        footer: zhFooter,
        about: zhAbout,
      },
    },
    fallbackLng: 'zh',
    supportedLngs: ['zh', 'en'],
    ns: ['common', 'nav', 'home', 'auth', 'legal', 'forum', 'profile', 'medical', 'transport', 'payment', 'education', 'culture', 'footer', 'about'],
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

