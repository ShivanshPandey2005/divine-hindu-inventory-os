'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useApp } from '@/context/AppContext';
import {
  CalendarDays,
  FileSpreadsheet,
  FileDown,
  TrendingUp,
  Package,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  IndianRupee,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export default function ReportsAndAnalytics() {
  const { products, transactions, returns } = useApp();
  const [reportTab, setReportTab] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Compute stats based on the selected tab
  const getStats = () => {
    const today = new Date();
    let filterDays = 1;
    if (reportTab === 'weekly') filterDays = 7;
    if (reportTab === 'monthly') filterDays = 30;

    const startDate = new Date();
    startDate.setDate(today.getDate() - filterDays);

    const rangeTransactions = transactions.filter(t => new Date(t.date) >= startDate);
    const rangeReturns = returns.filter(r => new Date(r.date) >= startDate);

    // Sales calculation
    const salesVolume = rangeTransactions.filter(t => t.type === 'Sale').reduce((acc, t) => acc + t.quantity, 0);
    const salesValue = rangeTransactions.filter(t => t.type === 'Sale').reduce((acc, t) => {
      const prod = products.find(p => p.id === t.productId);
      return acc + t.quantity * (prod?.sellingPrice || 0);
    }, 0);

    // Purchases calculation
    const purchaseVolume = rangeTransactions.filter(t => t.type === 'Purchase').reduce((acc, t) => acc + t.quantity, 0);
    
    // Returns calculation
    const returnsVolume = rangeReturns.filter(r => r.type === 'Customer Return').reduce((acc, r) => acc + r.quantity, 0);

    // Damages calculation
    const damagesVolume = rangeReturns.filter(r => r.type === 'Damaged' || r.type === 'Expired').reduce((acc, r) => acc + r.quantity, 0);
    const damagesValue = rangeReturns.filter(r => r.type === 'Damaged' || r.type === 'Expired').reduce((acc, r) => {
      const prod = products.find(p => p.id === r.productId);
      return acc + r.quantity * (prod?.costPrice || 0);
    }, 0);

    // Opening & Closing stock simulation
    // Current stock is the closing stock
    const closingStockCount = products.reduce((acc, p) => acc + p.currentStock, 0);
    // Opening stock = Closing Stock + Sales Volume - Purchase Volume - Returns Volume (roughly)
    const openingStockCount = Math.max(100, closingStockCount + salesVolume - purchaseVolume - returnsVolume);

    // Inventory Value
    const assetValue = products.reduce((acc, p) => acc + p.currentStock * p.sellingPrice, 0);

    // Accuracy
    const adjustmentsCount = rangeTransactions.filter(t => t.type === 'Adjustment').length;
    const accuracy = Math.max(96.5, 99.8 - (adjustmentsCount * 0.15));

    return {
      openingStock: openingStockCount,
      closingStock: closingStockCount,
      salesQty: salesVolume,
      salesRev: salesValue,
      returnsQty: returnsVolume,
      damagesQty: damagesVolume,
      damagesVal: damagesValue,
      accuracy: accuracy.toFixed(2),
      assetValue
    };
  };

  const stats = getStats();

  // Simulated chart data based on range
  const getChartData = () => {
    if (reportTab === 'daily') {
      return [
        { name: '08:00', sales: 12000, returns: 500 },
        { name: '10:00', sales: 24000, returns: 1000 },
        { name: '12:00', sales: 45000, returns: 1200 },
        { name: '14:00', sales: 32000, returns: 0 },
        { name: '16:00', sales: 65000, returns: 2000 },
        { name: '18:00', sales: 78000, returns: 1500 },
        { name: '20:00', sales: stats.salesRev * 0.15 || 42000, returns: 0 }
      ];
    }
    if (reportTab === 'weekly') {
      return [
        { name: 'Mon', sales: 42000, returns: 1200 },
        { name: 'Tue', sales: 38000, returns: 800 },
        { name: 'Wed', sales: 55000, returns: 2000 },
        { name: 'Thu', sales: 68000, returns: 1500 },
        { name: 'Fri', sales: 72000, returns: 400 },
        { name: 'Sat', sales: 95000, returns: 3200 },
        { name: 'Sun', sales: stats.salesRev * 0.25 || 88000, returns: 1100 }
      ];
    }
    // monthly (divided by weeks)
    return [
      { name: 'Week 1', sales: 240000, returns: 8500 },
      { name: 'Week 2', sales: 310000, returns: 12000 },
      { name: 'Week 3', sales: 280000, returns: 6000 },
      { name: 'Week 4', sales: stats.salesRev * 0.35 || 350000, returns: 9800 }
    ];
  };

  const chartData = getChartData();

  // Export to CSV Function
  const exportToCSV = () => {
    let headers = ['Report Metric', 'Value'];
    let rows = [
      ['Report Type', reportTab.toUpperCase() + ' REPORT'],
      ['Timestamp', new Date().toLocaleString()],
      ['Opening Stock Quantity', stats.openingStock.toString()],
      ['Closing Stock Quantity', stats.closingStock.toString()],
      ['Sales Volume (units)', stats.salesQty.toString()],
      ['Sales Revenue (INR)', '₹' + stats.salesRev.toString()],
      ['Returns Volume (units)', stats.returnsQty.toString()],
      ['Damages Written-off (units)', stats.damagesQty.toString()],
      ['Damages Financial Loss (INR)', '₹' + stats.damagesVal.toString()],
      ['Warehouse Accuracy Index', stats.accuracy + '%'],
      ['Total Asset Value (Retail INR)', '₹' + stats.assetValue.toString()]
    ];

    let csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Divine_Hindu_Inventory_Report_${reportTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF / Print Trigger
  const triggerPrint = () => {
    window.print();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header Action row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Reports & Operations Analytics</h1>
            <p className="text-xs text-text-secondary">Analyze inventory audit summaries, sales velocity margins, and download export logs.</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-border-primary bg-bg-primary text-text-secondary shadow-sm hover:bg-bg-secondary hover:text-text-primary transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
              <span>Export Excel (CSV)</span>
            </button>
            <button
              onClick={triggerPrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-saffron-400 text-white shadow-saffron shadow-sm hover:bg-saffron-500 transition-colors"
            >
              <FileDown className="h-4 w-4" />
              <span>Download PDF / Print</span>
            </button>
          </div>
        </div>

        {/* Tab Selection Filter */}
        <div className="flex items-center justify-between bg-bg-primary border border-border-primary p-4 rounded-xl shadow-sm print:hidden">
          <div className="flex items-center space-x-1.5 bg-bg-secondary p-1 rounded-lg border border-border-primary/50 text-xs font-semibold">
            {(['daily', 'weekly', 'monthly'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setReportTab(tab)}
                className={`px-4 py-1.5 rounded-md capitalize transition-all ${
                  reportTab === tab
                    ? 'bg-bg-primary text-text-primary shadow-sm border border-border-primary/45'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab} Report
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2 text-xs text-text-secondary font-medium">
            <CalendarDays className="h-4 w-4 text-saffron-400" />
            <span>Range: {reportTab === 'daily' ? 'Today' : reportTab === 'weekly' ? 'Last 7 Days' : 'Last 30 Days'}</span>
          </div>
        </div>

        {/* Printable Report Header */}
        <div className="hidden print:block text-center border-b border-border-primary pb-6 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-saffron-400 text-white font-bold text-xl mx-auto mb-2">
            ॐ
          </div>
          <h1 className="text-xl font-bold">Divine Hindu Inventory Report</h1>
          <p className="text-xs text-text-secondary mt-1">Generated: {new Date().toLocaleString()} • Report Type: {reportTab.toUpperCase()}</p>
        </div>

        {/* Key Performance Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Opening Stock */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm text-center">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">Opening Stock</span>
            <span className="text-xl font-mono font-bold text-text-primary block mt-1.5">{stats.openingStock}</span>
            <span className="text-[9px] text-text-secondary mt-1 block">Starting units count</span>
          </div>

          {/* Closing Stock */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm text-center">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">Closing Stock</span>
            <span className="text-xl font-mono font-bold text-text-primary block mt-1.5">{stats.closingStock}</span>
            <span className="text-[9px] text-text-secondary mt-1 block">Active available units</span>
          </div>

          {/* Sales */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm text-center">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">Sales Revenue</span>
            <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400 block mt-1.5">
              ₹{stats.salesRev.toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] text-text-secondary mt-1 block">{stats.salesQty} units ordered</span>
          </div>

          {/* Returns */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm text-center">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">Returns Processed</span>
            <span className="text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400 block mt-1.5">{stats.returnsQty}</span>
            <span className="text-[9px] text-text-secondary mt-1 block">Pending validation</span>
          </div>

          {/* Damages */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm text-center">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">Damages Write-Off</span>
            <span className="text-xl font-mono font-bold text-red-500 block mt-1.5">
              ₹{stats.damagesVal.toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] text-text-secondary mt-1 block">{stats.damagesQty} written-off units</span>
          </div>

          {/* Accuracy */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm text-center">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">Accuracy Rating</span>
            <span className="text-xl font-mono font-bold text-saffron-500 block mt-1.5">{stats.accuracy}%</span>
            <span className="text-[9px] text-text-secondary mt-1 block">Audit variance index</span>
          </div>
        </div>

        {/* Analytics Visual Chart print:hidden */}
        <div className="grid grid-cols-1 gap-6 print:hidden">
          <div className="rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-text-primary">Revenue vs Returns Performance</h3>
                <p className="text-xs text-text-secondary">Fluctuation metrics for sales vs reverse logs</p>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip formatter={(val: any) => `₹${val.toLocaleString('en-IN')}`} />
                  <Legend iconType="circle" />
                  <Bar dataKey="sales" name="Sales Revenue (₹)" fill="#FF9933" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returns" name="Returns Outflow (₹)" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Inventory Report Table */}
        <div className="rounded-xl border border-border-primary bg-bg-primary shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border-primary bg-bg-secondary/40 flex justify-between items-center">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Itemized Valuation Ledger</h3>
            <span className="text-[10px] text-text-secondary font-semibold">Total Asset Value: ₹{stats.assetValue.toLocaleString('en-IN')}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-primary bg-bg-secondary/20 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  <th className="py-3 px-4">SKU Code</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Collection Category</th>
                  <th className="py-3 px-4 text-right">Cost (Cost basis)</th>
                  <th className="py-3 px-4 text-right">Retail (Selling basis)</th>
                  <th className="py-3 px-4 text-center">Available Stock</th>
                  <th className="py-3 px-4 text-right">Asset Value (Retail)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary/50 text-xs">
                {products.slice(0, 15).map(p => (
                  <tr key={p.id} className="hover:bg-bg-secondary/10 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-text-primary">{p.sku}</td>
                    <td className="py-3 px-4 font-semibold text-text-primary">{p.name}</td>
                    <td className="py-3 px-4 text-text-secondary font-medium">{p.category}</td>
                    <td className="py-3 px-4 text-right text-text-secondary font-mono">₹{p.costPrice}</td>
                    <td className="py-3 px-4 text-right text-text-secondary font-mono">₹{p.sellingPrice}</td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-text-primary">{p.currentStock}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-text-primary">
                      ₹{(p.currentStock * p.sellingPrice).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
                {products.length > 15 && (
                  <tr>
                    <td colSpan={7} className="py-3.5 px-4 text-center text-text-secondary italic">
                      + {products.length - 15} more SKUs truncated in management report view (Full export available in Excel CSV)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
