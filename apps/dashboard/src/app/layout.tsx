import type { Metadata } from 'next';
import type React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sparkset Dashboard',
  description: 'AI Operations Assistant',
};

// Root layout for next-intl: HTML and body are rendered in [locale]/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
