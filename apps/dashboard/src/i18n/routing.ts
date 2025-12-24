import { defaultLocale, locales } from './config';

function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  return locales.includes(firstSegment as (typeof locales)[number]) ? firstSegment : defaultLocale;
}

function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  if (locales.includes(firstSegment as (typeof locales)[number])) {
    return '/' + segments.slice(1).join('/');
  }
  return pathname;
}

function addLocaleToPathname(pathname: string, locale: string): string {
  const pathWithoutLocale = removeLocaleFromPathname(pathname);
  if (pathWithoutLocale === '/') {
    return `/${locale}`;
  }
  return `/${locale}${pathWithoutLocale}`;
}

export function getPathname(pathname: string, locale?: string): string {
  const currentLocale = locale || getLocaleFromPathname(pathname);
  return addLocaleToPathname(pathname, currentLocale);
}

// Re-export client hooks for convenience
export { usePathname, useRouter, Link } from './client-routing';
