'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Package,
  Truck,
  ShoppingBag,
  RotateCcw,
  Scale,
  FileText,
  Clock,
  Activity,
  Calendar,
  History,
  BarChart3,
  Sparkles,
  Layers,
  Moon,
  Sun,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { products, returns, reconciliation, theme, setTheme } = useApp();

  const lowStockCount = products.filter(p => p.currentStock < p.minimumStock).length;
  const pendingReturnsCount = returns.filter(r => r.status === 'pending').length;
  const mismatchCount = reconciliation ? reconciliation.items.filter(i => i.variance !== 0).length : 0;

  const navigation = [
    { name: 'Store Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Assignment Presentation', href: '/presentation', icon: Layers },
    { name: 'Inventory Lifecycle', href: '/lifecycle', icon: Activity },
    { name: 'Implementation Roadmap', href: '/roadmap', icon: Calendar },
    { name: 'Store SOP Center', href: '/sop', icon: FileText },
    { name: 'Reconciliation Center', href: '/reconciliation', icon: Scale, badge: mismatchCount > 0 ? { count: mismatchCount, type: 'danger' } : undefined },
    { name: 'Daily Closing Process', href: '/closing-process', icon: Clock },
    { name: 'Store Reports', href: '/reports', icon: BarChart3 },
    { name: 'Operations Assistant', href: '/ai-insights', icon: Sparkles },
    { name: 'SKU Catalog', href: '/products', icon: Package },
    { name: 'Receive Shipment', href: '/receive', icon: Truck },
    { name: 'Log Customer Sale', href: '/sales-register', icon: ShoppingBag },
    { name: 'Returns & Damages', href: '/returns', icon: RotateCcw, badge: pendingReturnsCount > 0 ? { count: pendingReturnsCount, type: 'warning' } : undefined },
    { name: 'Movement History', href: '/transactions', icon: History },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-border-primary bg-bg-primary transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-border-primary">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-saffron-400 text-white font-bold shadow-saffron shadow-sm">
              ॐ
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-text-primary">
                Divine Hindu
              </span>
              <span className="block text-[10px] text-text-secondary uppercase tracking-widest font-semibold">
                Back-Office Ops
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary hover:text-text-primary lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 px-4 py-3 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onClose()}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-saffron-50 text-saffron-600 dark:bg-saffron-100/10 dark:text-saffron-400'
                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                      isActive
                        ? 'text-saffron-500'
                        : 'text-text-secondary group-hover:text-text-primary'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[9px] font-bold select-none ${
                      item.badge.type === 'danger'
                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200/20'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200/20'
                    }`}
                  >
                    {item.badge.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-primary bg-bg-secondary/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-text-secondary font-medium">System Online</span>
          </div>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="rounded-lg p-2 text-text-secondary hover:bg-bg-secondary hover:text-text-primary border border-border-primary bg-bg-primary shadow-sm transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
