// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importar archivos de traducción directamente
import esTranslations from '../locales/en.json';
import enTranslations from '../locales/en.json';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    lng: 'es',
    debug: true,
    resources: {
      en: enTranslations,
      es: esTranslations,
    },
    interpolation: {
      escapeValue: false, // No es necesario en React
    },
    backend: {
      loadPath: './locales/{{lng}}.json',  // Ruta de archivos de traducción
    },
    saveMissing: true,
    saveMissingTo: 'current',
    asyncStorage: AsyncStorage,
    compatibilityJSON: 'v3',
  });

export default i18n;
