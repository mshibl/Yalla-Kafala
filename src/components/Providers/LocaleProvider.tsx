"use client";
import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";

// Only allow 'ar' or 'en' as locale values
export type Locale = "ar" | "en";

interface LocaleContextValue {
  locale: Locale;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

interface LocaleProviderProps {
  locale: Locale;
  children: ReactNode;
}

export const LocaleProvider = ({ locale, children }: LocaleProviderProps) => {
  return (
    <LocaleContext.Provider value={{ locale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context.locale;
}
