import type { Metadata } from 'next';
import type React from 'react';
import './globals.css';
import SidebarNav from '../components/sidebar-nav';

export const metadata: Metadata = {
  title: 'Sparkline Dashboard',
  description: 'AI 运营助手管理台',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="zh-Hans">
    <body className="bg-slate-950 text-slate-50">
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/60">
        <SidebarNav />
        <main className="lg:pl-72">
          <div className="px-5 pt-14 pb-10 sm:px-10 lg:pt-10 space-y-6">{children}</div>
        </main>
      </div>
    </body>
  </html>
);

export default RootLayout;
