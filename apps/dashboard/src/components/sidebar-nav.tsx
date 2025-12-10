'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const nav = [
  { href: '/', label: '数据源', badge: 'DS' },
  { href: '/query', label: '查询工作台', badge: 'QL' },
  { href: '/templates', label: '模板', badge: 'TP' },
  { href: '/conversations', label: '对话记录', badge: 'CV' },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const SidebarBody = (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold tracking-tight">Sparkline</div>
            <p className="text-xs text-slate-400 mt-1">AI 运营助手</p>
          </div>
          <span className="rounded-full bg-brand-500/10 text-brand-200 text-[10px] px-2 py-1">
            beta
          </span>
        </div>
        <nav className="space-y-1 text-sm text-slate-200/80">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/5',
                  active && 'bg-white/8 text-white shadow-inner',
                )}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-[11px] uppercase tracking-tight">
                  {item.badge}
                </span>
                <span className="flex-1">{item.label}</span>
                {active && <span className="text-xs text-brand-300">●</span>}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-300 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-200 font-medium text-sm">工作区</span>
          <span className="text-slate-400">默认</span>
        </div>
        <p className="text-slate-400 leading-relaxed">将常用查询保存为模板，团队共享复用。</p>
        <Link
          href="/templates"
          className="inline-flex h-8 items-center justify-center rounded-md bg-brand-500 text-white px-3 text-[12px] font-medium hover:bg-brand-400"
        >
          查看模板
        </Link>
      </div>
      <div className="text-xs text-slate-500">v0.1.0 · 实验版</div>
    </>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-3 left-3 z-40 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        {open ? '×' : '≡'}
      </button>

      <aside
        className={clsx(
          'sidebar fixed inset-y-0 left-0 z-30 w-72 p-6 flex flex-col justify-between transition-transform duration-200',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {SidebarBody}
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
    </>
  );
}
