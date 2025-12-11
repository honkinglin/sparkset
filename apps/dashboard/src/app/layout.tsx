import type { Metadata } from 'next';
import type React from 'react';
import { AppSidebar } from '../components/app-sidebar';
import { Separator } from '../components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../components/ui/sidebar';
import { Toaster } from '../components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sparkline Dashboard',
  description: 'AI 运营助手管理台',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="zh-Hans" className="dark">
    <body>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="text-sm text-muted-foreground">Sparkline Dashboard</div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </body>
  </html>
);

export default RootLayout;
