"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import ru from "@/locales/ru/translation.json";
import kz from "@/locales/kz/translation.json";
import en from "@/locales/en/translation.json";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        translation: ru,
      },
      kz: {
        translation: kz,
      },
      en: {
        translation: en,
      },
    },
    lng: "ru",
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false, // React сам экранирует
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false, // важно!
    },
  });

export default i18n;
