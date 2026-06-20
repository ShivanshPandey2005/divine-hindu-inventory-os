'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useApp } from '@/context/AppContext';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  IndianRupee,
  Scale,
  ShieldCheck,
  Ban,
  ArrowRight,
  ClipboardList,
  CheckCircle,
  RefreshCw,
  BellRing
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { products, transactions, returns, reconciliation } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // 1. Core Executive KPIs Calculations
  const totalProducts = products.length;
  const inventoryValueRetail = products.reduce((acc, p) => acc + p.currentStock * p.sellingPrice, 0);
  
  // Low stock
  const lowStockProducts = products.filter(p => p.currentStock < p.minimumStock);
  const lowStockCount = lowStockProducts.length;

  // Inventory Health Score (percent of products with healthy stocks)
  const healthyCount = totalProducts - lowStockCount;
  const healthScore = totalProducts > 0 ? Math.round((healthyCount / totalProducts) * 100) : 100;

  // Today's Sales
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySalesTransactions = transactions.filter(t => 
    t.type === 'Sale' && t.date.startsWith(todayStr)
  );
  const todaySalesValue = todaySalesTransactions.reduce((acc, t) => {
    const prod = products.find(p => p.id === t.productId);
    return acc + t.quantity * (prod?.sellingPrice || 0);
  }, 0);

  // Mismatch Count (from active reconciliation session)
  const mismatchCount = reconciliation 
    ? reconciliation.items.filter(item => item.variance !== 0).length 
    : 0;

  // Damaged Inventory Value (cost basis of damaged items)
  const damagedItems = returns.filter(r => r.type === 'Damaged' || r.status === 'written_off');
  const damagedValue = damagedItems.reduce((acc, r) => {
    const prod = products.find(p => p.id === r.productId);
    return acc + r.quantity * (prod?.costPrice || 0);
  }, 0);

  // Accuracy % (derived dynamically based on historical adjustments logs)
  const totalAdjustments = transactions.filter(t => t.type === 'Adjustment').length;
  const accuracyPercent = Math.max(95, 99.8 - (totalAdjustments * 0.1)).toFixed(1);

  // 2. Urgent Actions derivation
  const urgentActions = [];
  if (lowStockCount > 0) {
    urgentActions.push({
      id: 'act_low_stock',
      title: 'Restock safety threshold shortages',
      description: `${lowStockCount} items have fallen below safety stock limits. Placements needed.`,
      link: '/ai-insights',
      severity: 'high'
    });
  }
  if (reconciliation) {
    urgentActions.push({
      id: 'act_reconcile',
      title: 'Resolve pending stocktake discrepancy',
      description: `Active Stock Take session has ${mismatchCount} item counts mismatched. Review audit.`,
      link: '/reconciliation',
      severity: 'high'
    });
  }
  const pendingReturnInspectionCount = returns.filter(r => r.status === 'pending').length;
  if (pendingReturnInspectionCount > 0) {
    urgentActions.push({
      id: 'act_returns',
      title: 'Inspect customer return packages',
      description: `${pendingReturnInspectionCount} return boxes are waiting in receiving bay for quality check.`,
      link: '/returns',
      severity: 'medium'
    });
  }
  if (urgentActions.length === 0) {
    urgentActions.push({
      id: 'act_clean',
      title: 'All store indicators normal',
      description: 'Zero critical actions pending. Re-check shelf counts during shift end closing.',
      link: '/reconciliation',
      severity: 'low'
    });
  }

  // 3. Reorder Recommendations (top items needing reorder)
  const reorderRecommendations = products
    .filter(p => p.currentStock < p.minimumStock)
    .map(p => {
      const suggestedQty = Math.max(20, p.minimumStock * 2.5 - p.currentStock);
      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        stock: p.currentStock,
        min: p.minimumStock,
        suggested: Math.round(suggestedQty),
        vendor: p.vendor,
        cost: Math.round(suggestedQty * p.costPrice)
      };
    })
    .slice(0, 5);

  // 4. Pending Audits Schedule (simulated checklist matching daily store activities)
  const pendingAudits = [
    { id: 'aud_1', title: 'Daily Cash & Stock Sync', category: 'General', time: 'Before EOD Closing', status: 'pending' },
    { id: 'aud_2', title: 'Incense & Dhoop Category Spot-check', category: 'Incense Sticks', time: 'Weekly audit due today', status: 'pending' },
    { id: 'aud_3', title: 'Damaged Items Shelf Count', category: 'Returns/Damages', time: 'Weekly Friday audit', status: 'completed' },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg-secondary text-text-secondary">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-saffron-400 border-t-transparent" />
          <span className="text-xs font-semibold tracking-wide">Synchronizing Operational Metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header Action row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Divine Hindu Store Dashboard</h1>
            <p className="text-xs text-text-secondary">Operations Control Center • Divine Hindu Bangalore Store</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href="/receive"
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-border-primary bg-bg-primary text-text-primary shadow-sm hover:bg-bg-secondary transition-colors"
            >
              <span>Receive Inventory</span>
            </Link>
            <Link
              href="/sales-register"
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-saffron-400 text-white shadow-saffron shadow-sm hover:bg-saffron-500 transition-colors"
            >
              <span>Register Sale</span>
            </Link>
          </div>
        </div>

        {/* Founder Overview Section */}
        <div className="rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border-primary pb-3">
            <div>
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Founder Overview</h3>
              <p className="text-[10px] text-text-secondary">Consolidated Bangalore Store Summary</p>
            </div>
            <span className="text-[9px] bg-saffron-50 text-saffron-600 dark:bg-saffron-500/10 dark:text-saffron-400 font-bold px-2.5 py-1 rounded">Executive Summary</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 divide-y md:divide-y-0 md:divide-x divide-border-primary/60">
            {/* Accuracy */}
            <div>
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Inventory Accuracy</span>
              <span className="text-base font-mono font-extrabold text-emerald-600 dark:text-emerald-400 block mt-1">{accuracyPercent}%</span>
              <span className="text-[9px] text-text-secondary block mt-0.5">Matched shelf counts</span>
            </div>
            {/* Total Asset Value */}
            <div className="pt-2 md:pt-0 md:pl-4">
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Total Inventory Value</span>
              <span className="text-base font-mono font-extrabold text-text-primary block mt-1">₹{inventoryValueRetail.toLocaleString('en-IN')}</span>
              <span className="text-[9px] text-text-secondary block mt-0.5">Retail asset valuation</span>
            </div>
            {/* Today's Sales */}
            <div className="pt-2 md:pt-0 md:pl-4">
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Today's Sales</span>
              <span className="text-base font-mono font-extrabold text-text-primary block mt-1">₹{todaySalesValue.toLocaleString('en-IN')}</span>
              <span className="text-[9px] text-text-secondary block mt-0.5">From checkout logs</span>
            </div>
            {/* Reorders needed */}
            <div className="pt-2 md:pt-0 md:pl-4">
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">SKUs Requiring Reorder</span>
              <span className={`text-base font-mono font-extrabold block mt-1 ${lowStockCount > 0 ? 'text-amber-500 font-extrabold' : 'text-text-primary'}`}>{lowStockCount} SKUs</span>
              <span className="text-[9px] text-text-secondary block mt-0.5">Below safety safety limit</span>
            </div>
            {/* Pending returns */}
            <div className="pt-2 md:pt-0 md:pl-4">
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Pending Returns</span>
              <span className="text-base font-mono font-extrabold text-indigo-600 dark:text-indigo-400 block mt-1">{pendingReturnInspectionCount} cases</span>
              <span className="text-[9px] text-text-secondary block mt-0.5">Awaiting QA inspect</span>
            </div>
            {/* Damaged Value */}
            <div className="pt-2 md:pt-0 md:pl-4">
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Damaged Stock Value</span>
              <span className="text-base font-mono font-extrabold text-red-500 block mt-1">₹{damagedValue.toLocaleString('en-IN')}</span>
              <span className="text-[9px] text-text-secondary block mt-0.5">Write-off cost basis</span>
            </div>
          </div>
        </div>

        {/* Founder KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Card 1: Inventory Health */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm">
            <div className="flex items-center justify-between text-text-secondary">
              <span className="text-[10px] font-bold uppercase tracking-wider">Health Score</span>
              <ShieldCheck className="h-4 w-4 text-saffron-500" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-text-primary font-mono">{healthScore}%</span>
              <span className="block text-[9px] text-text-secondary mt-1 font-semibold">SKUs in safety limits</span>
            </div>
          </div>

          {/* Card 2: Accuracy Index */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm">
            <div className="flex items-center justify-between text-text-secondary">
              <span className="text-[10px] font-bold uppercase tracking-wider">Stock Accuracy</span>
              <Scale className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-text-primary font-mono">{accuracyPercent}%</span>
              <span className="block text-[9px] text-text-secondary mt-1 font-semibold">Audit matching rating</span>
            </div>
          </div>

          {/* Card 3: Low Stock Warning count */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm">
            <div className="flex items-center justify-between text-text-secondary">
              <span className="text-[10px] font-bold uppercase tracking-wider">Low Stock SKUs</span>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-3">
              <span className={`text-2xl font-bold tracking-tight font-mono ${
                lowStockCount > 0 ? 'text-amber-500 font-extrabold' : 'text-text-primary'
              }`}>
                {lowStockCount}
              </span>
              <span className="block text-[9px] text-text-secondary mt-1 font-semibold">Safety threshold warnings</span>
            </div>
          </div>

          {/* Card 4: Reconciliation Mismatch */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm">
            <div className="flex items-center justify-between text-text-secondary">
              <span className="text-[10px] font-bold uppercase tracking-wider">Stock Mismatches</span>
              <ClipboardList className="h-4 w-4 text-red-500" />
            </div>
            <div className="mt-3">
              <span className={`text-2xl font-bold tracking-tight font-mono ${
                mismatchCount > 0 ? 'text-red-500 font-extrabold animate-pulse' : 'text-text-primary'
              }`}>
                {mismatchCount}
              </span>
              <span className="block text-[9px] text-text-secondary mt-1 font-semibold">Audit discrepancies</span>
            </div>
          </div>

          {/* Card 5: Damaged Stock */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm">
            <div className="flex items-center justify-between text-text-secondary">
              <span className="text-[10px] font-bold uppercase tracking-wider">Damaged Value</span>
              <Ban className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-3">
              <span className="text-xl font-bold tracking-tight text-text-primary font-mono truncate block">
                ₹{damagedValue.toLocaleString('en-IN')}
              </span>
              <span className="block text-[9px] text-text-secondary mt-1 font-semibold">Write-off cost basis</span>
            </div>
          </div>

          {/* Card 6: Today's Revenue */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm">
            <div className="flex items-center justify-between text-text-secondary">
              <span className="text-[10px] font-bold uppercase tracking-wider">Today's Sales</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-3">
              <span className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono truncate block">
                ₹{todaySalesValue.toLocaleString('en-IN')}
              </span>
              <span className="block text-[9px] text-text-secondary mt-1 font-semibold">From {todaySalesTransactions.length} ticket items</span>
            </div>
          </div>
        </div>

        {/* Urgent Actions alert box */}
        <div className="rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm space-y-3.5">
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center space-x-1.5">
            <BellRing className="h-4 w-4 text-saffron-500 animate-bounce" />
            <span>Urgent Store Tasks</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {urgentActions.map((action, idx) => (
              <Link
                key={action.id || idx}
                href={action.link}
                className={`p-3 rounded-lg border flex flex-col justify-between hover:scale-[1.01] transition-transform ${
                  action.severity === 'high'
                    ? 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10'
                    : action.severity === 'medium'
                    ? 'border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10'
                    : 'border-border-primary bg-bg-secondary hover:bg-bg-tertiary/50'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-bold uppercase ${
                    action.severity === 'high'
                      ? 'text-red-600 dark:text-red-400'
                      : action.severity === 'medium'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-text-secondary'
                  }`}>
                    {action.severity} Priority
                  </span>
                  <h4 className="text-xs font-bold text-text-primary mt-1">{action.title}</h4>
                  <p className="text-[11px] text-text-secondary mt-1 leading-snug">{action.description}</p>
                </div>
                <div className="flex items-center space-x-1 mt-3.5 text-[10px] font-bold text-saffron-500 select-none">
                  <span>Take Action</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Dual Column Layout (Reorders & Audits) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reorder Recommendations */}
          <div className="lg:col-span-2 rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm flex flex-col h-[350px]">
            <div className="flex items-center justify-between pb-3 border-b border-border-primary mb-4">
              <div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Purchase Replenishment suggestions</h3>
                <p className="text-[11px] text-text-secondary">Trigger reorders from primary vendor contacts for critical SKUs</p>
              </div>
              <Link href="/ai-insights" className="text-[11px] font-bold text-saffron-500 hover:underline">Full Analysis</Link>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              {reorderRecommendations.length > 0 ? (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border-primary text-[10px] font-bold text-text-secondary uppercase">
                      <th className="py-2">SKU</th>
                      <th className="py-2">Item Name</th>
                      <th className="py-2 text-center">Stock</th>
                      <th className="py-2 text-center">Min Safety</th>
                      <th className="py-2 text-center">Reorder Qty</th>
                      <th className="py-2">Vendor Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-primary/40 font-medium">
                    {reorderRecommendations.map((rec) => (
                      <tr key={rec.id} className="text-text-primary">
                        <td className="py-2.5 font-mono font-bold">{rec.sku}</td>
                        <td className="py-2.5 max-w-xs truncate">{rec.name}</td>
                        <td className="py-2.5 text-center font-mono font-bold text-red-500">{rec.stock}</td>
                        <td className="py-2.5 text-center font-mono text-text-secondary">{rec.min}</td>
                        <td className="py-2.5 text-center font-mono font-bold text-saffron-500">+{rec.suggested}</td>
                        <td className="py-2.5 text-text-secondary truncate max-w-[120px]">{rec.vendor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-text-secondary font-medium">
                  ✓ Perfect Stock Health! No items are currently below minimum thresholds.
                </div>
              )}
            </div>
          </div>

          {/* Pending Audits */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm flex flex-col h-[350px]">
            <div className="pb-3 border-b border-border-primary mb-4">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Pending Audit Checklist</h3>
              <p className="text-[11px] text-text-secondary">Physical checks scheduled for store closing</p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3.5">
              {pendingAudits.map((audit) => (
                <div key={audit.id} className="flex items-start justify-between text-xs pb-3 border-b border-border-primary/50 last:border-0 last:pb-0">
                  <div>
                    <span className="text-[10px] text-text-secondary bg-bg-secondary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {audit.category}
                    </span>
                    <h4 className="font-bold text-text-primary mt-1.5">{audit.title}</h4>
                    <span className="text-[10px] text-text-secondary block mt-0.5">{audit.time}</span>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    audit.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/20'
                      : 'bg-amber-50 text-amber-600 border border-amber-200/20'
                  }`}>
                    {audit.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
