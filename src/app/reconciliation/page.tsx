'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useApp } from '@/context/AppContext';
import { ReconcileItem } from '@/types';
import {
  Scale,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  History,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown,
  X
} from 'lucide-react';

export default function StockReconciliation() {
  const {
    reconciliation,
    reconciliationHistory,
    startReconciliation,
    updatePhysicalQty,
    setItemReconcileStatus,
    executeReconcile,
    cancelReconciliation
  } = useApp();

  const [remarks, setRemarks] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleStartSession = () => {
    startReconciliation();
    setSuccessMessage('');
  };

  const handleCommitReconciliation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reconciliation) return;

    // Check if there are any unapproved mismatches (items with variance !== 0 that are NOT approved)
    const unapprovedMismatches = reconciliation.items.filter(
      item => item.variance !== 0 && item.status === 'investigating'
    );

    if (unapprovedMismatches.length > 0) {
      alert(
        `Cannot close stock take! There are ${unapprovedMismatches.length} unapproved stock mismatches. Please verify shelf count and mark them as Approved.`
      );
      return;
    }

    executeReconcile(remarks || 'End-of-day daily reconciliation adjustment.');
    setSuccessMessage('Daily reconciliation completed! System stocks adjusted, shift audit closed.');
    setRemarks('');
  };

  const activeMismatches = reconciliation
    ? reconciliation.items.filter(item => item.variance !== 0)
    : [];
  const unapprovedMismatches = activeMismatches.filter(item => item.status === 'investigating');

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Title action row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Stock Reconciliation (Stock Take)</h1>
            <p className="text-xs text-text-secondary">Perform physical audits of warehouse shelves. Match expected quantities with actual counts.</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-border-primary bg-bg-primary text-text-secondary shadow-sm hover:bg-bg-secondary hover:text-text-primary transition-colors"
            >
              <History className="h-3.5 w-3.5" />
              <span>{showHistory ? 'Active Session' : 'Audit Reports'}</span>
            </button>
            {!reconciliation && !showHistory && (
              <button
                onClick={handleStartSession}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-saffron-400 text-white shadow-saffron shadow-sm hover:bg-saffron-500 transition-colors"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Start Shift Stock Take</span>
              </button>
            )}
          </div>
        </div>

        {/* Success Alert Banners */}
        {successMessage && (
          <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 dark:bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {successMessage}
          </div>
        )}

        {/* Audit History Reports view */}
        {showHistory ? (
          <div className="rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm space-y-4">
            <div className="pb-3 border-b border-border-primary mb-2">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Reconciliation Audit Log</h3>
              <p className="text-[10px] text-text-secondary">Historical logs of past shift reconciliation and stocktake events</p>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {reconciliationHistory.map((sess) => {
                const discrepancies = sess.items.filter(i => i.variance !== 0);
                return (
                  <div key={sess.id} className="p-4 rounded-xl border border-border-primary bg-bg-secondary/40 space-y-2.5 text-xs font-medium">
                    <div className="flex justify-between items-center pb-2 border-b border-border-primary/50">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-text-secondary" />
                        <span className="font-bold text-text-primary">{new Date(sess.date).toLocaleString()}</span>
                      </div>
                      <span className="font-mono text-[10px] text-text-secondary bg-bg-tertiary px-2 py-0.5 rounded">ID: {sess.id}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-text-secondary uppercase">Discrepancy Items:</span>
                        <span className="block text-sm font-bold text-text-primary mt-0.5">{discrepancies.length} SKUs adjusted</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-secondary uppercase">Session Note:</span>
                        <span className="block text-sm text-text-primary italic mt-0.5">"{sess.remarks}"</span>
                      </div>
                    </div>

                    {discrepancies.length > 0 && (
                      <div className="mt-2 space-y-1.5 rounded-lg border border-border-primary bg-bg-primary p-3">
                        <span className="text-[9px] font-bold text-text-secondary uppercase block mb-1">Adjusted items detail:</span>
                        {discrepancies.map((d, idx) => (
                          <div key={idx} className="flex justify-between text-[11px] font-medium border-b border-border-primary/30 last:border-0 pb-1.5 last:pb-0">
                            <span className="text-text-primary">{d.productName} ({d.productSku})</span>
                            <span className="font-mono text-right text-text-secondary">
                              Expected: {d.expectedStock} • Physical: {d.physicalStock} • Variance: 
                              <span className={`font-bold ml-1 ${d.variance > 0 ? 'text-amber-600' : 'text-red-500'}`}>
                                {d.variance > 0 ? `+${d.variance}` : d.variance}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {reconciliationHistory.length === 0 && (
                <p className="text-center py-10 text-xs text-text-secondary font-medium">No past reconciliation sessions archived.</p>
              )}
            </div>
          </div>
        ) : reconciliation ? (
          // Active Reconciliation Sheet
          <div className="space-y-6">
            {/* Context Notice Box */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-saffron-500/10 bg-saffron-500/5 dark:bg-saffron-500/10">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-saffron-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-bold text-saffron-700 dark:text-saffron-400">Shift Reconciliation Active</span>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Physical inventory checking session in progress. Type in actual box counts. Confirm variance checks before EOD commit.
                  </p>
                </div>
              </div>
              <button
                onClick={cancelReconciliation}
                className="px-3.5 py-1.5 text-xs font-bold text-text-secondary hover:text-text-primary bg-bg-primary border border-border-primary rounded-lg transition-colors"
              >
                Reset Session
              </button>
            </div>

            {/* Reconciliation table */}
            <div className="overflow-x-auto rounded-xl border border-border-primary bg-bg-primary shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-primary bg-bg-secondary/60 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    <th className="py-3.5 px-4">SKU Code</th>
                    <th className="py-3.5 px-4">Product Name</th>
                    <th className="py-3.5 px-4 text-center">System Expected</th>
                    <th className="py-3.5 px-4 text-center w-36">Physical Count</th>
                    <th className="py-3.5 px-4 text-center">Variance (+/-)</th>
                    <th className="py-3.5 px-4">Audit Status</th>
                    <th className="py-3.5 px-4 text-right">Workflow Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary/50 text-xs font-medium">
                  {reconciliation.items.map((item) => {
                    const isMatched = item.variance === 0;
                    const isDeficit = item.variance < 0;
                    const isSurplus = item.variance > 0;
                    
                    return (
                      <tr key={item.productId} className="hover:bg-bg-secondary/15 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-text-primary">{item.productSku}</td>
                        <td className="py-3 px-4 text-text-primary font-semibold max-w-xs truncate">{item.productName}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-text-secondary">{item.expectedStock}</td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            value={item.physicalStock}
                            onChange={(e) => updatePhysicalQty(item.productId, parseInt(e.target.value) || 0)}
                            className="w-20 px-1.5 py-1 text-center font-mono border border-border-primary rounded bg-bg-primary text-text-primary focus:outline-none focus:ring-1 focus:ring-saffron-300"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isMatched ? (
                            <span className="font-mono text-emerald-500 font-bold">0</span>
                          ) : (
                            <span className={`font-mono font-extrabold ${isSurplus ? 'text-amber-500' : 'text-red-500'}`}>
                              {isSurplus ? `+${item.variance}` : item.variance}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                            isMatched
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/20'
                              : item.status === 'approved'
                              ? 'bg-indigo-50 text-indigo-600 border border-indigo-200/20'
                              : 'bg-red-50 text-red-600 border border-red-200/20 animate-pulse'
                          }`}>
                            {isMatched ? 'Matched' : item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {!isMatched && (
                            <div className="flex justify-end space-x-1">
                              {item.status === 'investigating' ? (
                                <>
                                  <button
                                    onClick={() => setItemReconcileStatus(item.productId, 'approved')}
                                    className="px-2 py-1 text-[9px] font-bold text-emerald-600 hover:bg-emerald-50 border border-emerald-300/30 rounded"
                                  >
                                    Approve Audit
                                  </button>
                                  <button
                                    onClick={() => {
                                      alert(`Discrepancy under investigation: checking warehouse bins for SKU ${item.productSku}`);
                                    }}
                                    className="px-2 py-1 text-[9px] font-bold text-indigo-600 hover:bg-indigo-50 border border-indigo-300/30 rounded"
                                  >
                                    Verify Shelf
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => setItemReconcileStatus(item.productId, 'investigating')}
                                  className="px-2 py-1 text-[9px] font-bold text-red-500 hover:bg-red-50 border border-red-300/30 rounded"
                                >
                                  Re-Investigate
                                </button>
                              )}
                            </div>
                          )}
                          {isMatched && (
                            <span className="text-[10px] text-text-secondary italic">Counts match shelf</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Commit Form Panel */}
            <form onSubmit={handleCommitReconciliation} className="rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm space-y-4">
              <div className="pb-3 border-b border-border-primary">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Close Audit Session</h3>
                <p className="text-[10px] text-text-secondary">Apply verified stock discrepancies to live inventory</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Shift Closing Notes / Remarks</label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore Store Saturday EOD closing count. Discrepancies approved."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-bg-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300 placeholder:text-text-secondary"
                    required
                  />
                </div>
                <div className="space-y-1.5 text-xs text-text-secondary font-medium">
                  <div className="flex justify-between">
                    <span>Mismatched Items Count:</span>
                    <span className="font-mono font-bold text-text-primary">{activeMismatches.length} SKUs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unapproved Discrepancies:</span>
                    <span className={`font-mono font-bold ${unapprovedMismatches.length > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                      {unapprovedMismatches.length} items
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-border-primary/50">
                <button
                  type="button"
                  onClick={cancelReconciliation}
                  className="px-4 py-2 text-xs font-semibold text-text-secondary border border-border-primary rounded-lg hover:bg-bg-secondary hover:text-text-primary"
                >
                  Discard Take
                </button>
                <button
                  type="submit"
                  disabled={unapprovedMismatches.length > 0}
                  className="px-4 py-2 text-xs font-bold text-white bg-saffron-400 hover:bg-saffron-500 rounded-lg shadow-saffron shadow-sm disabled:opacity-40 transition-colors"
                >
                  Commit Reconciliation & Adjust Stock
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Inactive reconciliation prompt card
          <div className="rounded-xl border border-border-primary bg-bg-primary p-10 shadow-sm flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-4">
            <div className="h-14 w-14 rounded-full bg-saffron-50 dark:bg-saffron-900/20 text-saffron-500 flex items-center justify-center">
              <Scale className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">Stock Audit Inactive</h2>
              <p className="text-xs text-text-secondary mt-1 max-w-sm">
                There is no active Stock Take session in progress. Press the button below to populate system quantities and initiate shift closing counts.
              </p>
            </div>
            <button
              onClick={handleStartSession}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 text-xs font-bold rounded-lg bg-saffron-400 text-white shadow-saffron shadow-sm hover:bg-saffron-500 transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>Start Daily Stock Take</span>
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
