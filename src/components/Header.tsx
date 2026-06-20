'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Menu,
  Bell,
  Search,
  Plus,
  TriangleAlert,
  CalendarDays,
  Store
} from 'lucide-react';

interface HeaderProps {
  onMenuOpen: () => void;
  onQuickLogOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuOpen, onQuickLogOpen }) => {
  const pathname = usePathname();
  const { products, returns } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive section title
  const getSectionTitle = () => {
    switch (pathname) {
      case '/':
        return 'Executive Dashboard';
      case '/products':
        return 'Product Master Catalog';
      case '/transactions':
        return 'Stock Transactions Ledger';
      case '/returns':
        return 'Reverse Logistics & Returns';
      case '/reports':
        return 'Reports & Operations Analytics';
      case '/ai-insights':
        return 'Divine Inventory Copilot';
      case '/workflow':
        return 'Enterprise Inventory Flow';
      default:
        return 'Divine Hindu Admin';
    }
  };

  const lowStock = products.filter(p => p.currentStock < p.minimumStock);
  const criticalCount = lowStock.filter(p => p.currentStock === 0).length;
  const warningCount = lowStock.length - criticalCount;
  const pendingCount = returns.filter(r => r.status === 'pending').length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border-primary bg-bg-primary/95 backdrop-blur-md px-6 shadow-sm">
      {/* Left section: Breadcrumb & Title */}
      <div className="flex items-center space-x-3 lg:space-x-0">
        <button
          onClick={onMenuOpen}
          className="rounded-lg p-2 text-text-secondary hover:bg-bg-secondary hover:text-text-primary lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider hidden sm:block">
            Divine Hindu Store Operations
          </span>
          <h1 className="text-lg font-bold text-text-primary leading-tight">
            {getSectionTitle()}
          </h1>
        </div>
      </div>

      {/* Right section: Global search, Quick action, Notifications, Profile */}
      <div className="flex items-center space-x-4">
        {/* Quick Log button */}
        <button
          onClick={onQuickLogOpen}
          className="inline-flex items-center space-x-1.5 rounded-lg bg-saffron-400 px-3 py-2 text-xs font-semibold text-white shadow-saffron shadow-sm hover:bg-saffron-500 transition-colors focus:outline-none focus:ring-2 focus:ring-saffron-300 active:scale-98"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Quick Action</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-text-secondary hover:bg-bg-secondary hover:text-text-primary border border-border-primary bg-bg-primary shadow-sm"
          >
            <Bell className="h-4.5 w-4.5" />
            {(lowStock.length > 0 || pendingCount > 0) && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full bg-saffron-400 animate-ping" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 z-40 bg-transparent"
              />
              <div className="absolute right-0 mt-2.5 w-80 z-50 rounded-xl border border-border-primary bg-bg-primary p-4 shadow-lg slide-right">
                <div className="flex items-center justify-between pb-3 border-b border-border-primary">
                  <h3 className="text-sm font-semibold text-text-primary">System Alerts</h3>
                  <span className="text-[10px] text-text-secondary bg-bg-secondary px-2 py-0.5 rounded-full font-medium">
                    {lowStock.length + pendingCount} notifications
                  </span>
                </div>
                <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto">
                  {criticalCount > 0 && (
                    <div className="flex items-start space-x-2.5 rounded-lg bg-red-500/5 dark:bg-red-500/10 p-2.5 border border-red-500/10">
                      <TriangleAlert className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-red-600 dark:text-red-400 block">Critical Stock Alert</span>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          {criticalCount} products are completely out of stock and require immediate orders.
                        </p>
                      </div>
                    </div>
                  )}
                  {warningCount > 0 && (
                    <div className="flex items-start space-x-2.5 rounded-lg bg-amber-500/5 dark:bg-amber-500/10 p-2.5 border border-amber-500/10">
                      <TriangleAlert className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 block">Low Stock Warning</span>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          {warningCount} items are below their minimum threshold and should be restocked soon.
                        </p>
                      </div>
                    </div>
                  )}
                  {pendingCount > 0 && (
                    <div className="flex items-start space-x-2.5 rounded-lg bg-saffron-500/5 dark:bg-saffron-500/10 p-2.5 border border-saffron-500/10">
                      <CalendarDays className="h-4.5 w-4.5 text-saffron-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-saffron-600 dark:text-saffron-400 block">Pending Returns</span>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          {pendingCount} customer returns are waiting for inspection.
                        </p>
                      </div>
                    </div>
                  )}
                  {lowStock.length === 0 && pendingCount === 0 && (
                    <p className="text-xs text-text-secondary text-center py-4">All inventory indicators are normal.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center space-x-2 border-l border-border-primary pl-4">
          <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-bg-secondary text-saffron-500 font-bold border border-border-primary">
            <Store className="h-4.5 w-4.5" />
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-semibold text-text-primary leading-none">
              Store Manager
            </span>
            <span className="text-[10px] text-text-secondary">
              Main Warehouse
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
