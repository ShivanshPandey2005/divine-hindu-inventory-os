'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useApp } from '@/context/AppContext';
import { X, Search } from 'lucide-react';
import { TransactionType } from '@/types';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  
  const { products, addTransaction } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionType>('Purchase');
  const [quantity, setQuantity] = useState(1);
  const [remarks, setRemarks] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleCloseQuickLog = () => {
    setQuickLogOpen(false);
    setSearchTerm('');
    setSelectedProductId('');
    setTransactionType('Purchase');
    setQuantity(1);
    setRemarks('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmitTransaction = (e: React.FormEvent) => {
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

    // Safety checks for sales and stockouts
    if (
      ['Sale', 'Damage', 'Expiry', 'Warehouse Transfer'].includes(transactionType) &&
      selectedProduct.currentStock < quantity
    ) {
      setErrorMessage(
        `Insufficient stock! ${selectedProduct.name} only has ${selectedProduct.currentStock} units available.`
      );
      return;
    }

    const success = addTransaction({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productSku: selectedProduct.sku,
      type: transactionType,
      quantity,
      remarks: remarks || `Quick Log: ${transactionType} transaction.`
    });

    if (success) {
      setSuccessMessage('Transaction logged successfully! Inventory updated.');
      setTimeout(() => {
        handleCloseQuickLog();
      }, 1200);
    } else {
      setErrorMessage('Failed to record transaction. Please check inputs.');
    }
  };

  if (!isClient) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg-secondary text-text-secondary">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-saffron-400 border-t-transparent" />
          <span className="text-sm font-semibold tracking-wide">Initializing Divine Hindu Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-secondary">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onMenuOpen={() => setSidebarOpen(true)}
          onQuickLogOpen={() => setQuickLogOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">
          <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col justify-between">
            <div className="flex-1 pb-8">
              {children}
            </div>
            <footer className="mt-auto border-t border-border-primary/80 pt-6 pb-2 text-xs text-text-secondary">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <p className="font-semibold text-text-primary text-sm tracking-wide">
                    Inventory Operating System Proposal for Divine Hindu Bangalore Store
                  </p>
                  <p className="text-text-secondary text-xs mt-1">
                    Prepared as part of the AI Executive Assignment
                  </p>
                </div>
                
                <div className="flex flex-col items-center md:items-end text-xs font-mono text-text-secondary/80">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron-500"></span>
                    </span>
                    <span>Build Version: <strong className="text-text-primary">v1.2.0-beta</strong></span>
                  </div>
                  <p className="mt-1">
                    Last Updated: <span className="text-text-primary font-semibold">2026-06-20 16:51:04 (IST)</span>
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* Quick Action Modal */}
      {quickLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-border-primary bg-bg-primary p-6 shadow-2xl slide-right">
            <div className="flex items-center justify-between border-b border-border-primary pb-4">
              <div>
                <h2 className="text-base font-bold text-text-primary">Quick Transaction Log</h2>
                <p className="text-xs text-text-secondary">Instantly record incoming or outgoing inventory movements.</p>
              </div>
              <button
                onClick={handleCloseQuickLog}
                className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTransaction} className="mt-4 space-y-4">
              {/* Transaction Type */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Transaction Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Purchase', 'Sale', 'Adjustment', 'Warehouse Transfer', 'Damage', 'Expiry'] as TransactionType[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setTransactionType(type);
                        setErrorMessage('');
                      }}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                        transactionType === type
                          ? 'border-saffron-400 bg-saffron-50 text-saffron-600 dark:bg-saffron-100/10 dark:text-saffron-400'
                          : 'border-border-primary bg-bg-primary text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Autocomplete Search */}
              <div className="relative">
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Select Product
                </label>
                {!selectedProductId ? (
                  <div className="relative">
                    <Search className="absolute top-2.5 left-3 h-4.5 w-4.5 text-text-secondary" />
                    <input
                      type="text"
                      placeholder="Type product name or SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 text-text-primary placeholder:text-text-secondary"
                    />
                    {searchTerm && (
                      <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto z-50 rounded-lg border border-border-primary bg-bg-primary shadow-lg divide-y divide-border-primary/50">
                        {filteredProducts.slice(0, 5).map(prod => (
                          <button
                            key={prod.id}
                            type="button"
                            onClick={() => {
                              setSelectedProductId(prod.id);
                              setSearchTerm('');
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs hover:bg-bg-secondary flex justify-between items-center"
                          >
                            <div>
                              <span className="font-semibold text-text-primary block">{prod.name}</span>
                              <span className="text-[10px] text-text-secondary font-mono">{prod.sku}</span>
                            </div>
                            <span className="text-[11px] text-text-secondary font-medium bg-bg-tertiary px-2 py-0.5 rounded-full">
                              Stock: {prod.currentStock}
                            </span>
                          </button>
                        ))}
                        {filteredProducts.length === 0 && (
                          <div className="p-3 text-xs text-text-secondary text-center">No products found</div>
                        )}
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

              {/* Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Current Stock Status
                  </label>
                  <div className="w-full px-3 py-2 text-sm bg-bg-tertiary/50 border border-transparent rounded-lg text-text-secondary font-medium">
                    {selectedProduct ? `${selectedProduct.currentStock} available` : 'Select a product first'}
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Remarks / Operator Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Received batch #203A, standard customer order..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 text-text-primary placeholder:text-text-secondary"
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
                  onClick={handleCloseQuickLog}
                  className="px-4 py-2 text-xs font-semibold text-text-secondary border border-border-primary rounded-lg hover:bg-bg-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!successMessage}
                  className="px-4 py-2 text-xs font-semibold text-white bg-saffron-400 hover:bg-saffron-500 rounded-lg shadow-saffron shadow-sm disabled:opacity-50"
                >
                  Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
