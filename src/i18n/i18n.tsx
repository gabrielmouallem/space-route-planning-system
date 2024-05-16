"use client";
import React, { createContext, useContext, useState } from "react";
import translations from "./translations";

const EN = "en" as const;
const PT = "pt" as const;

const languages = [EN, PT];

type Language = (typeof languages)[number];

type Key = keyof (typeof translations)["en"];

function getNavigatorLanguage() {
  const navigatorRawLanguage = navigator.language.split("-")[0];

  return (languages as string[]).includes(navigatorRawLanguage)
    ? (navigatorRawLanguage as "en" | "pt")
    : ("en" as const);
}

const LanguageContext = createContext({
  language: "en",
  translate: (_key: Key) => "" as string,
  switchLanguage: (_lang: Language) => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState(getNavigatorLanguage());

  const switchLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  function translate(key: Key): string {
    return translations[language][key] || key;
  }

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}
