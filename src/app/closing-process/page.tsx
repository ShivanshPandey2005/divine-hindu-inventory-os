'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  History,
  Info,
  Calendar,
  FileText,
  ShieldCheck,
  ClipboardCheck,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';

interface ClosingStep {
  stepNum: number;
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
  checklistText: string;
}

export default function DailyClosingProcess() {
  const { products, transactions, returns } = useApp();
  const [completedSteps, setCompletedSteps] = useState<{ [key: number]: boolean }>({});
  const [remarks, setRemarks] = useState('');
  const [reportGenerated, setReportGenerated] = useState(false);

  const steps: ClosingStep[] = [
    {
      stepNum: 1,
      title: 'Verify Sales Entries',
      description: 'Audit the POS checkout register logs against physical cash drawer counts and credit slips.',
      actionText: 'Verify POS Registries',
      actionHref: '/sales-register',
      checklistText: 'I verified today\'s cash/POS drawer bills.'
    },
    {
      stepNum: 2,
      title: 'Count Physical Inventory',
      description: 'Perform physical count checks on warehouse shelves and quarantine zones.',
      actionText: 'Do Spot Safety Count',
      actionHref: '/reconciliation',
      checklistText: 'I counted active shelf quantities.'
    },
    {
      stepNum: 3,
      title: 'Compare with Expected Inventory',
      description: 'Audit physical stock count variables against system expected figures.',
      actionText: 'Compare expected limits',
      actionHref: '/reconciliation',
      checklistText: 'I reviewed expected vs physical lists.'
    },
    {
      stepNum: 4,
      title: 'Identify Stock Mismatches',
      description: 'Flag variance shortages or excess items, moving discrepancies into investigation status.',
      actionText: 'Identify Mismatches',
      actionHref: '/reconciliation',
      checklistText: 'I checked variance discrepancy alerts.'
    },
    {
      stepNum: 5,
      title: 'Approve Adjustments',
      description: 'Approve discrepancy corrections. Manager signs off on EOD adjustment values.',
      actionText: 'Approve Discrepancy Audits',
      actionHref: '/reconciliation',
      checklistText: 'I approved adjustment logs.'
    },
    {
      stepNum: 6,
      title: 'Generate Closing Stock Report',
      description: 'Publish Daily Closing reports and download spreadsheet archives.',
      actionText: 'Publish Closing Sheets',
      actionHref: '/reports',
      checklistText: 'I compiled EOD closing spreadsheets.'
    }
  ];

  const handleToggleStep = (stepNum: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  const totalStepsCount = steps.length;
  const completedCount = steps.filter(s => completedSteps[s.stepNum]).length;
  const progressPercent = Math.round((completedCount / totalStepsCount) * 100);

  const handleGenerateEODReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (progressPercent < 100) {
      alert('Please complete all 6 Daily Closing checklist steps first!');
      return;
    }
    setReportGenerated(true);
  };

  // Derive today's metrics
  const todaySalesCount = transactions.filter(t => t.type === 'Sale').length;
  const lowStockCount = products.filter(p => p.currentStock < p.minimumStock).length;
  const totalValue = products.reduce((acc, p) => acc + p.currentStock * p.sellingPrice, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Daily Closing Process (EOD Check)</h1>
            <p className="text-xs text-text-secondary">Manager checklist guide to lock registers and verify stock counts during store closing.</p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-text-secondary">
            <Calendar className="h-4 w-4 text-saffron-400" />
            <span>Shift Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Progress gauge card */}
        <div className="rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm space-y-3.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-text-primary uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="h-4.5 w-4.5 text-saffron-500" />
              <span>Daily Shift Close Compliance</span>
            </span>
            <span className="font-mono font-bold text-saffron-500">{completedCount} of {totalStepsCount} tasks completed ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-bg-secondary h-2.5 rounded-full overflow-hidden border border-border-primary/50">
            <div
              className="bg-saffron-400 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Closing process steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step) => {
            const isDone = !!completedSteps[step.stepNum];
            return (
              <div
                key={step.stepNum}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isDone
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : 'border-border-primary bg-bg-primary hover:border-saffron-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-bg-secondary text-text-primary text-[10px] font-bold">
                      0{step.stepNum}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      isDone
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/20'
                        : 'bg-amber-50 text-amber-600 border border-amber-200/20'
                    }`}>
                      {isDone ? 'Checked' : 'Action Pending'}
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold ${isDone ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-text-secondary mt-1 leading-snug">{step.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-primary/50 gap-2">
                  <Link
                    href={step.actionHref}
                    className="text-[10px] font-bold text-saffron-500 hover:underline inline-flex items-center space-x-1"
                  >
                    <span>{step.actionText}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleToggleStep(step.stepNum)}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-bg-secondary text-text-secondary border-border-primary hover:text-text-primary hover:bg-bg-tertiary'
                    }`}
                  >
                    {isDone ? 'Task Done ✓' : 'Mark Task Done'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Generate EOD report closing panel */}
        <div className="rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border-primary">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Publish Shift Closing Ledger</h3>
            <p className="text-[10px] text-text-secondary">Generate and lock store operations logs for today</p>
          </div>

          {!reportGenerated ? (
            <form onSubmit={handleGenerateEODReport} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Shift Audit Closing Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore Store Saturday EOD check complete. Registers verified."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-bg-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300 placeholder:text-text-secondary"
                  required
                  disabled={progressPercent < 100}
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={progressPercent < 100}
                  className="w-full py-2.5 inline-flex items-center justify-center space-x-1.5 rounded-lg bg-saffron-400 hover:bg-saffron-500 text-white font-bold text-xs shadow-saffron shadow-sm disabled:opacity-40 transition-colors"
                >
                  <FileCheck className="h-4.5 w-4.5" />
                  <span>Generate EOD Closing Report</span>
                </button>
              </div>
            </form>
          ) : (
            // Generated visual report document
            <div className="p-4 rounded-xl border border-emerald-500/15 bg-emerald-500/5 dark:bg-emerald-500/10 space-y-3 slide-right">
              <div className="flex items-center space-x-2 border-b border-emerald-500/20 pb-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Shift Closing Report Compiled</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-text-secondary uppercase">Sales Registered:</span>
                  <span className="block font-mono font-bold text-text-primary mt-0.5">{todaySalesCount} orders</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-secondary uppercase">Locked Assets:</span>
                  <span className="block font-mono font-bold text-text-primary mt-0.5">₹{totalValue.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-secondary uppercase">Low Stock Alerts:</span>
                  <span className="block font-mono font-bold text-text-primary mt-0.5">{lowStockCount} items</span>
                </div>
              </div>
              <div className="text-xs text-text-secondary font-medium border-t border-emerald-500/20 pt-2.5 italic">
                Closing Remarks: "{remarks || 'EOD closing check compiled.'}"
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
