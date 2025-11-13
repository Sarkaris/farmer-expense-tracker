"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import mr from "@/locales/mr.json";

const dictionaries = { en, hi, mr };
const SUPPORTED = ["en", "hi", "mr"];

const I18nContext = createContext({
  language: "en",
  t: (key, fallback) => fallback ?? key,
  setLanguage: () => {},
  mounted: false,
});

export function I18nProvider({ children, defaultLanguage = "en" }) {
  const [language, setLanguage] = useState(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("qq-lang") : null;
    if (stored && SUPPORTED.includes(stored)) {
      setLanguage(stored);
    } else {
      setLanguage(defaultLanguage);
    }
    setMounted(true);
  }, [defaultLanguage]);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem("qq-lang", language);
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("lang", language);
      }
    } catch {}
  }, [language, mounted]);

  const t = useCallback((key, fallback) => {
    const dict = dictionaries[language] || dictionaries.en;
    const value = key.split(".").reduce((obj, k) => (obj && obj[k] != null ? obj[k] : undefined), dict);
    return value ?? fallback ?? key;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t, mounted }), [language, t, mounted]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}


