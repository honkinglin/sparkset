'use client';

import { RiTranslate2 } from '@remixicon/react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { localeNames, locales, type Locale } from '@/i18n/config';
import { useLocale } from '@/i18n/use-locale';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const fullPathname = usePathname(); // Get full pathname including locale

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname
    const segments = fullPathname.split('/').filter(Boolean);
    const pathWithoutLocale =
      segments.length > 0 && locales.includes(segments[0] as Locale)
        ? '/' + segments.slice(1).join('/')
        : fullPathname;

    // Build new path with new locale
    const newPath =
      pathWithoutLocale === '/' ? `/${newLocale}` : `/${newLocale}${pathWithoutLocale}`;

    // Use window.location for immediate navigation
    window.location.href = newPath;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <RiTranslate2 className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchLocale(loc)}
            className={locale === loc ? 'bg-accent' : ''}
          >
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
