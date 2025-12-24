import 'server-only';

import { type Locale, locales } from './config';

const dictionaries = {
  en: () => import('../../messages/en.json').then((module) => module.default),
  'zh-CN': () => import('../../messages/zh-CN.json').then((module) => module.default),
} as const;

export const hasLocale = (locale: string): locale is Locale => locale in dictionaries;

export const getDictionary = async (locale: Locale): Promise<Record<string, string>> => {
  if (!hasLocale(locale)) {
    throw new Error(`Locale "${locale}" is not supported`);
  }
  return dictionaries[locale]();
};
