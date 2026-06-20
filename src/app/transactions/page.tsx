'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useApp } from '@/context/AppContext';
import { TransactionType } from '@/types';
import {
  Search,
  Plus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  X
} from 'lucide-react';

export default function StockTransactions() {
  const { transactions, products, addTransaction } = useApp();

  // Filter and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Manual Transaction Form state (direct log)
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [transType, setTransType] = useState<TransactionType>('Purchase');
  const [quantity, setQuantity] = useState(1);
  const [remarks, setRemarks] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-complete filtered products
  const autocompleteProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleCloseModal = () => {
    setIsLogOpen(false);
    setProductSearch('');
    setSelectedProductId('');
    setTransType('Purchase');
    setQuantity(1);
    setRemarks('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedProductId) {
      setErrorMsg('Please select a product.');
      return;
    }
    if (quantity <= 0) {
      setErrorMsg('Quantity must be greater than 0.');
      return;
    }
    if (!selectedProduct) {
      setErrorMsg('Selected product not found.');
      return;
    }

    // Safety checks for sales and stockouts
    if (
      ['Sale', 'Damage', 'Expiry', 'Warehouse Transfer'].includes(transType) &&
      selectedProduct.currentStock < quantity
    ) {
      setErrorMsg(
        `Insufficient stock! Only ${selectedProduct.currentStock} units available for ${selectedProduct.name}.`
      );
      return;
    }

    const success = addTransaction({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productSku: selectedProduct.sku,
      type: transType,
      quantity,
      remarks: remarks || `Logged via Transactions Ledger.`
    });

    if (success) {
      setSuccessMsg('Movement recorded successfully! Stock levels updated.');
      setTimeout(() => {
        handleCloseModal();
      }, 1200);
    } else {
      setErrorMsg('Failed to record transaction.');
    }
  };

  // Filter logic
  const filteredTransactions = transactions.filter(t => {
    const matchSearch =
      t.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.remarks && t.remarks.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchType = typeFilter === 'All' || t.type === typeFilter;
    return matchSearch && matchType;
  });

  // Pagination calculations
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter]);

  const transactionTypesList: TransactionType[] = [
    'Purchase',
    'Sale',
    'Customer Return',
    'Warehouse Transfer',
    'Damage',
    'Expiry',
    'Adjustment'
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page title & action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Stock Transactions Ledger</h1>
            <p className="text-xs text-text-secondary">Historical ledger of all inventory inbound, outbound, adjustments, and transfers.</p>
          </div>
          <button
            onClick={() => setIsLogOpen(true)}
            className="inline-flex items-center space-x-1.5 rounded-lg bg-saffron-400 px-4 py-2 text-sm font-semibold text-white shadow-saffron shadow-sm hover:bg-saffron-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Record Transaction</span>
          </button>
        </div>

        {/* Toolbar Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-border-primary bg-bg-primary shadow-sm">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute top-2.5 left-3.5 h-4.5 w-4.5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by SKU, Product Name, or Remarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-bg-secondary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 text-text-primary placeholder:text-text-secondary font-medium"
            />
          </div>

          {/* Type Filter */}
          <div className="relative flex items-center">
            <Filter className="absolute left-3.5 h-4 w-4 text-text-secondary" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-bg-secondary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 text-text-primary font-medium appearance-none"
            >
              <option value="All">All Movements</option>
              {transactionTypesList.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Counts */}
          <div className="flex items-center justify-end text-xs text-text-secondary font-medium pr-2">
            Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} logs
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-xl border border-border-primary bg-bg-primary shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-primary bg-bg-secondary/60 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 text-center">Qty</th>
                <th className="py-3.5 px-4 text-center">Previous Stock</th>
                <th className="py-3.5 px-4 text-center">Updated Stock</th>
                <th className="py-3.5 px-4">Operator Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/50 text-xs font-medium">
              {paginatedTransactions.map((t) => {
                const isAddition = ['Purchase', 'Customer Return'].includes(t.type);
                const isReduction = ['Sale', 'Damage', 'Expiry', 'Warehouse Transfer'].includes(t.type);
                
                return (
                  <tr key={t.id} className="hover:bg-bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-text-secondary whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="h-3.5 w-3.5 text-text-secondary" />
                        <span>{new Date(t.date).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-text-primary">{t.productSku}</td>
                    <td className="py-3 px-4 text-text-primary font-semibold max-w-xs truncate">{t.productName}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center space-x-1 rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                        isAddition
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : isReduction && t.type === 'Sale'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}>
                        {isAddition ? (
                          <ArrowDownLeft className="h-3 w-3 mr-0.5" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        )}
                        <span>{t.type}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold ${
                        isAddition ? 'text-emerald-500 font-extrabold' : 'text-text-primary'
                      }`}>
                        {isAddition ? `+${t.quantity}` : `-${t.quantity}`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-text-secondary">{t.previousStock}</td>
                    <td className="py-3 px-4 text-center font-mono text-text-primary font-semibold">{t.updatedStock}</td>
                    <td className="py-3 px-4 text-text-secondary max-w-xs truncate italic">{t.remarks}</td>
                  </tr>
                );
              })}
              {paginatedTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-text-secondary">No ledger logs match search filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-text-secondary font-medium">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 rounded-lg border border-border-primary bg-bg-primary text-text-secondary hover:bg-bg-secondary hover:text-text-primary disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1.5 rounded-lg border border-border-primary bg-bg-primary text-text-secondary hover:bg-bg-secondary hover:text-text-primary disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Recording Modal Form */}
        {isLogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-xl border border-border-primary bg-bg-primary p-6 shadow-2xl slide-right">
              <div className="flex items-center justify-between border-b border-border-primary pb-4">
                <div>
                  <h2 className="text-base font-bold text-text-primary">Record Inventory Movement</h2>
                  <p className="text-xs text-text-secondary">Log purchase, sale, damage, transfers, or write-offs.</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleRecordSubmit} className="mt-4 space-y-4">
                {/* Type Selection */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Movement Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {transactionTypesList.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setTransType(type);
                          setErrorMsg('');
                        }}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                          transType === type
                            ? 'border-saffron-400 bg-saffron-50 text-saffron-600 dark:bg-saffron-100/10 dark:text-saffron-400'
                            : 'border-border-primary bg-bg-primary text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Search */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Select SKU / Product
                  </label>
                  {!selectedProductId ? (
                    <div className="relative">
                      <Search className="absolute top-2.5 left-3.5 h-4.5 w-4.5 text-text-secondary" />
                      <input
                        type="text"
                        placeholder="Search product name or SKU..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 text-text-primary placeholder:text-text-secondary font-medium"
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
                          {autocompleteProducts.length === 0 && (
                            <div className="p-3 text-xs text-text-secondary text-center">No products match search term</div>
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

                {/* Qty */}
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
                      className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      In-Stock Availability
                    </label>
                    <div className="w-full px-3 py-2 text-xs bg-bg-tertiary/50 border border-transparent rounded-lg text-text-secondary font-semibold">
                      {selectedProduct ? `${selectedProduct.currentStock} units` : 'Select product'}
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Operator Remarks
                  </label>
                  <input
                    type="text"
                    placeholder="Reference notes, batch number, order ID, or audit info..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                  />
                </div>

                {errorMsg && (
                  <div className="rounded-lg bg-red-500/5 dark:bg-red-500/10 p-3 border border-red-500/20 text-xs font-medium text-red-600 dark:text-red-400">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="rounded-lg bg-emerald-500/5 dark:bg-emerald-500/10 p-3 border border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-pulse">
                    {successMsg}
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
                    disabled={!!successMsg}
                    className="px-4 py-2 text-xs font-semibold text-white bg-saffron-400 hover:bg-saffron-500 rounded-lg shadow-saffron shadow-sm disabled:opacity-50"
                  >
                    Record Transaction
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
