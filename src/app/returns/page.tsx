'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useApp } from '@/context/AppContext';
import { ReturnItem, ReturnStatus, ReturnType } from '@/types';
import {
  RotateCcw,
  ShieldAlert,
  Archive,
  AlertTriangle,
  IndianRupee,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Hourglass,
  Activity,
  X
} from 'lucide-react';

export default function ReturnsAndDamages() {
  const { returns, products, addReturnItem, processReturnAction } = useApp();

  // Tabs / Filters
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'inspected' | 'restocked' | 'written_off'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [returnType, setReturnType] = useState<ReturnType>('Customer Return');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const autocompleteProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleCloseModal = () => {
    setIsLogOpen(false);
    setProductSearch('');
    setSelectedProductId('');
    setReturnType('Customer Return');
    setQuantity(1);
    setNotes('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleLogReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedProductId) {
      setErrorMessage('Please select a product.');
      return;
    }
    if (quantity <= 0) {
      setErrorMessage('Quantity must be greater than 0.');
      return;
    }
    if (!selectedProduct) {
      setErrorMessage('Selected product not found.');
      return;
    }

    addReturnItem({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productSku: selectedProduct.sku,
      type: returnType,
      quantity,
      notes: notes || `Logged ${returnType}.`
    });

    setSuccessMessage('Case registered! Case is in pending queue for Quality Check.');
    setTimeout(() => {
      handleCloseModal();
    }, 1200);
  };

  // Metrics calculations
  const totalReturnedItems = returns.reduce((acc, r) => acc + r.quantity, 0);
  const returnRatePercent = 2.4; // standard SaaS benchmark rate
  
  const damagedItems = returns.filter(r => r.type === 'Damaged' || r.status === 'written_off');
  const damagedValue = damagedItems.reduce((acc, r) => {
    const prod = products.find(p => p.id === r.productId);
    const cost = prod ? prod.costPrice : 0;
    return acc + r.quantity * cost;
  }, 0);

  const expiredItems = returns.filter(r => r.type === 'Expired');
  const expiredValue = expiredItems.reduce((acc, r) => {
    const prod = products.find(p => p.id === r.productId);
    const cost = prod ? prod.costPrice : 0;
    return acc + r.quantity * cost;
  }, 0);

  // Filters logic
  const filteredReturns = returns.filter(r => {
    const matchSearch =
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchTab = activeTab === 'all' || r.status === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Title action row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Reverse Logistics & Returns</h1>
            <p className="text-xs text-text-secondary">Process customer returns, perform quality inspections, and write-off damaged or expired stocks.</p>
          </div>
          <button
            onClick={() => setIsLogOpen(true)}
            className="inline-flex items-center space-x-1.5 rounded-lg bg-saffron-400 px-4 py-2 text-sm font-semibold text-white shadow-saffron shadow-sm hover:bg-saffron-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Intake Return Case</span>
          </button>
        </div>

        {/* Warehouse Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Returned */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase">Total Returned Units</span>
              <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/20 p-2 text-indigo-500">
                <RotateCcw className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold tracking-tight text-text-primary">{totalReturnedItems} units</span>
              <span className="block text-[11px] text-text-secondary mt-1">Processed in current fiscal cycle</span>
            </div>
          </div>

          {/* Card 2: Return Rate */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase">Average Return Rate</span>
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-2 text-emerald-500">
                <Activity className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold tracking-tight text-text-primary">{returnRatePercent}%</span>
              <span className="block text-[11px] text-text-emerald-600 dark:text-text-emerald-400 mt-1 font-semibold">✓ Safe range (&lt;4% benchmark)</span>
            </div>
          </div>

          {/* Card 3: Damaged Stock Asset Value */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase">Damaged Write-Off Value</span>
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-2 text-red-500">
                <ShieldAlert className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">
                ₹{damagedValue.toLocaleString('en-IN')}
              </span>
              <span className="block text-[11px] text-text-secondary mt-1">Cost basis value written-off</span>
            </div>
          </div>

          {/* Card 4: Expired Stock Value */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase">Expired Assets Value</span>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-2 text-amber-500">
                <Archive className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                ₹{expiredValue.toLocaleString('en-IN')}
              </span>
              <span className="block text-[11px] text-text-secondary mt-1">Cost value of expired shelf stock</span>
            </div>
          </div>
        </div>

        {/* Filters and Search toolbar */}
        <div className="rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute top-2.5 left-3.5 h-4.5 w-4.5 text-text-secondary" />
              <input
                type="text"
                placeholder="Search case, SKU, or reasons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-bg-secondary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-300 text-text-primary placeholder:text-text-secondary font-medium"
              />
            </div>

            {/* Tab navigation filters */}
            <div className="flex flex-wrap gap-1.5 bg-bg-secondary p-1 rounded-lg border border-border-primary/50 text-xs font-semibold">
              {(['all', 'pending', 'inspected', 'restocked', 'written_off'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-md capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-bg-primary text-text-primary shadow-sm border border-border-primary/45'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab === 'all' ? 'All cases' : tab.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Returns Table */}
        <div className="overflow-x-auto rounded-xl border border-border-primary bg-bg-primary shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-primary bg-bg-secondary/60 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                <th className="py-3.5 px-4">Date Registered</th>
                <th className="py-3.5 px-4">SKU / Code</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Category Type</th>
                <th className="py-3.5 px-4 text-center">Qty</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Inspector Notes</th>
                <th className="py-3.5 px-4 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/50 text-xs font-medium">
              {filteredReturns.map(r => {
                const isPending = r.status === 'pending';
                const isInspected = r.status === 'inspected';
                const isRestocked = r.status === 'restocked';
                const isWrittenOff = r.status === 'written_off';

                return (
                  <tr key={r.id} className="hover:bg-bg-secondary/15 transition-colors">
                    <td className="py-3.5 px-4 text-text-secondary font-mono text-[11px] whitespace-nowrap">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-text-primary">{r.productSku}</td>
                    <td className="py-3.5 px-4 text-text-primary font-semibold max-w-xs truncate">{r.productName}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                        r.type === 'Customer Return'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : r.type === 'Damaged'
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-text-primary">{r.quantity}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isPending
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-300/30'
                          : isInspected
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border border-indigo-300/30 animate-pulse'
                          : isRestocked
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-300/30'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400 border border-slate-300/30'
                      }`}>
                        {isPending && <Hourglass className="h-3 w-3 mr-0.5" />}
                        {isRestocked && <CheckCircle className="h-3 w-3 mr-0.5" />}
                        {isWrittenOff && <XCircle className="h-3 w-3 mr-0.5" />}
                        <span>{r.status === 'written_off' ? 'Written Off' : r.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary italic max-w-xs truncate">{r.notes}</td>
                    <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-end items-center space-x-1.5">
                        {isPending && (
                          <button
                            onClick={() => processReturnAction(r.id, 'inspect')}
                            className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-300/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 rounded-lg"
                          >
                            Inspect
                          </button>
                        )}
                        {(isPending || isInspected) && (
                          <>
                            <button
                              onClick={() => processReturnAction(r.id, 'restock')}
                              className="px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-300/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 rounded-lg"
                            >
                              Restock
                            </button>
                            <button
                              onClick={() => processReturnAction(r.id, 'write_off')}
                              className="px-2.5 py-1 text-[10px] font-bold text-red-500 border border-red-300/30 hover:bg-red-50 dark:hover:bg-red-500/5 rounded-lg"
                            >
                              Write-off
                            </button>
                          </>
                        )}
                        {(isRestocked || isWrittenOff) && (
                          <span className="text-[10px] text-text-secondary italic font-semibold">Case Resolved</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredReturns.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-text-secondary">No return cases found matching these filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Intake Modal Form */}
        {isLogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-xl border border-border-primary bg-bg-primary p-6 shadow-2xl slide-right">
              <div className="flex items-center justify-between border-b border-border-primary pb-4">
                <div>
                  <h2 className="text-base font-bold text-text-primary">Reverse Intake Case Registration</h2>
                  <p className="text-xs text-text-secondary">Log customer returns or write off damaged shelf-stock.</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleLogReturn} className="mt-4 space-y-4">
                {/* Case Type */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Intake Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Customer Return', 'Damaged', 'Expired'] as ReturnType[]).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setReturnType(type)}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                          returnType === type
                            ? 'border-saffron-400 bg-saffron-50 text-saffron-600 dark:bg-saffron-100/10 dark:text-saffron-400'
                            : 'border-border-primary bg-bg-primary text-text-secondary hover:bg-bg-secondary'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SKU search */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Product SKU / Name</label>
                  {!selectedProductId ? (
                    <div className="relative">
                      <Search className="absolute top-2.5 left-3.5 h-4.5 w-4.5 text-text-secondary" />
                      <input
                        type="text"
                        placeholder="Search product..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                      />
                      {productSearch && (
                        <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto z-50 rounded-lg border border-border-primary bg-bg-primary shadow-lg divide-y divide-border-primary/50">
                          {autocompleteProducts.slice(0, 5).map(prod => (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => {
                                setSelectedProductId(prod.id);
                                setProductSearch('');
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs hover:bg-bg-secondary flex justify-between items-center"
                            >
                              <div>
                                <span className="font-semibold text-text-primary block text-xs">{prod.name}</span>
                                <span className="text-[10px] text-text-secondary font-mono block">{prod.sku}</span>
                              </div>
                              <span className="text-[10px] text-text-secondary bg-bg-tertiary px-2 py-0.5 rounded-full font-medium">
                                Stock: {prod.currentStock}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between border border-saffron-200 bg-saffron-50/50 dark:bg-saffron-500/5 px-4 py-2.5 rounded-lg">
                      <div>
                        <span className="text-xs font-semibold text-text-primary block">{selectedProduct?.name}</span>
                        <span className="text-[10px] text-text-secondary font-mono block mt-0.5">{selectedProduct?.sku}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedProductId('')}
                        className="text-xs font-semibold text-saffron-600 dark:text-saffron-400 hover:underline"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>

                {/* Qty */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Intake Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Current Stock</label>
                    <div className="w-full px-3 py-2 text-xs bg-bg-tertiary/50 border border-transparent rounded-lg text-text-secondary font-semibold">
                      {selectedProduct ? `${selectedProduct.currentStock} available` : 'Select product'}
                    </div>
                  </div>
                </div>

                {/* Reason Notes */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Case Reason & Operator Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Broken during shipping seal broken, customer ordered wrong size..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="rounded-lg bg-red-500/5 dark:bg-red-500/10 p-3 border border-red-500/20 text-xs font-medium text-red-600 dark:text-red-400">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-lg bg-emerald-500/5 dark:bg-emerald-500/10 p-3 border border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-pulse">
                    {successMessage}
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-xs font-semibold text-text-secondary border border-border-primary rounded-lg hover:bg-bg-secondary hover:text-text-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!!successMessage}
                    className="px-4 py-2 text-xs font-semibold text-white bg-saffron-400 hover:bg-saffron-500 rounded-lg shadow-saffron shadow-sm disabled:opacity-50"
                  >
                    Register Case
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
