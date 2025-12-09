import type { Metadata } from 'next';
import type React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sparkline Dashboard',
  description: 'AI 运营助手管理台',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="zh-Hans">
    <body className="bg-slate-950 text-slate-50">
      <div className="min-h-screen flex">
        <aside className="sidebar w-60 p-6 hidden sm:flex flex-col gap-4">
          <div className="text-xl font-semibold">Sparkline</div>
          <nav className="space-y-2 text-sm text-slate-200/80">
            <a className="block px-3 py-2 rounded-lg hover:bg-white/5" href="#">
              数据源
            </a>
            <a className="block px-3 py-2 rounded-lg hover:bg-white/5" href="#">
              查询工作台
            </a>
            <a className="block px-3 py-2 rounded-lg hover:bg-white/5" href="#">
              对话记录
            </a>
            <a className="block px-3 py-2 rounded-lg hover:bg-white/5" href="#">
              模板
            </a>
          </nav>
        </aside>
        <main className="flex-1 p-6 sm:p-10 space-y-6">{children}</main>
      </div>
    </body>
  </html>
);

export default RootLayout;
