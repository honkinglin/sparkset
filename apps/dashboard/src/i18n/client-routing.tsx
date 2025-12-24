'use client';

import NextLink from 'next/link';
import { usePathname as useNextPathname, useRouter as useNextRouter } from 'next/navigation';
import type { ComponentProps } from 'react';

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

export function usePathname(): string {
  const pathname = useNextPathname();
  return removeLocaleFromPathname(pathname);
}

export function useRouter() {
  const router = useNextRouter();
  const pathname = useNextPathname();
  const currentLocale = getLocaleFromPathname(pathname);

  // Check if href already contains a locale
  const hrefHasLocale = (href: string): boolean => {
    if (!href.startsWith('/')) return false;
    const segments = href.split('/').filter(Boolean);
    return segments.length > 0 && locales.includes(segments[0] as (typeof locales)[number]);
  };

  return {
    ...router,
    push: (href: string) => {
      // If href already has a locale, use it directly
      if (hrefHasLocale(href)) {
        return router.push(href);
      }
      const hrefWithLocale = href.startsWith('/') ? addLocaleToPathname(href, currentLocale) : href;
      return router.push(hrefWithLocale);
    },
    replace: (href: string) => {
      // If href already has a locale, use it directly
      if (hrefHasLocale(href)) {
        return router.replace(href);
      }
      const hrefWithLocale = href.startsWith('/') ? addLocaleToPathname(href, currentLocale) : href;
      return router.replace(hrefWithLocale);
    },
    back: router.back,
    forward: router.forward,
    refresh: router.refresh,
  };
}

interface LinkProps extends ComponentProps<typeof NextLink> {
  href: string;
}

// Client component wrapper for Link
function LinkClient({ href, ...props }: LinkProps) {
  const pathname = useNextPathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const hrefWithLocale = href.startsWith('/') ? addLocaleToPathname(href, currentLocale) : href;

  return <NextLink {...props} href={hrefWithLocale} />;
}

export const Link = LinkClient;
