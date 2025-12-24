'use client';

import { usePathname } from 'next/navigation';
import { locales } from './config';

export function useLocale(): (typeof locales)[number] {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  return locales.includes(firstSegment as (typeof locales)[number]) ? firstSegment : 'en';
}
