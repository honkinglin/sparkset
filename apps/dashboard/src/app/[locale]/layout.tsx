import { RiNotification3Line } from '@remixicon/react';
import { notFound } from 'next/navigation';
import type React from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import { routing } from '@/i18n/routing-config';
import { TranslationsProvider } from '@/i18n/translations-context';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(locale)) {
    notFound();
  }

  // Load dictionary for the locale
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <TranslationsProvider translations={dictionary}>
          <ThemeProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="overflow-hidden px-4 md:px-6 lg:px-8">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                  <div className="flex flex-1 items-center gap-2 px-3">
                    <SidebarTrigger className="-ml-4" />
                    <Separator orientation="vertical" className="mr-2 !h-4" />
                    <div className="text-sm text-muted-foreground">Sparkset</div>
                  </div>
                  <div className="flex gap-3 ml-auto">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <Button variant="ghost" size="icon">
                      <RiNotification3Line className="h-4 w-4" />
                    </Button>
                  </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">{children}</div>
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </ThemeProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
}
