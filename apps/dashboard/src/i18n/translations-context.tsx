'use client';

import * as React from 'react';

export type Translations = Record<string, string>;

const TranslationsContext = React.createContext<Translations | null>(null);

interface TranslationsProviderProps {
  translations: Translations;
  children: React.ReactNode;
}

export function TranslationsProvider({ translations, children }: TranslationsProviderProps) {
  return (
    <TranslationsContext.Provider value={translations}>{children}</TranslationsContext.Provider>
  );
}

export function useTranslationsContext() {
  const context = React.useContext(TranslationsContext);
  if (!context) {
    throw new Error('useTranslationsContext must be used within TranslationsProvider');
  }
  return context;
}
