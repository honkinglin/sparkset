import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { defaultLocale, locales } from './i18n/config';

function getLocale(request: NextRequest): string {
  // Get locale from Accept-Language header
  const headers = { 'accept-language': request.headers.get('accept-language') ?? '' };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // If pathname already has a locale, continue
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect if there is no locale
  const locale = getLocale(request);
  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(newUrl);
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Next.js internals (_next)
  // - Static files (favicon, images, etc.)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
