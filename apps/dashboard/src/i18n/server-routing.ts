import { redirect as nextRedirect } from 'next/navigation';

import { defaultLocale, locales } from './config';

function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  if (locales.includes(firstSegment as (typeof locales)[number])) {
    return '/' + segments.slice(1).join('/');
  }
  return pathname;
}

export function redirect(pathname: string) {
  const pathWithoutLocale = removeLocaleFromPathname(pathname);
  return nextRedirect(`/${defaultLocale}${pathWithoutLocale}`);
}
