'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useApp } from '@/context/AppContext';
import { Search, Truck, Clipboard, Plus, CheckCircle, Clock } from 'lucide-react';

export default function ReceiveShipment() {
  const { products, addTransaction, transactions } = useApp();

  // Form states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [invoiceRef, setInvoiceRef] = useState('');
  const [remarks, setRemarks] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const autocompleteProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedProductId) {
      setErrorMessage('Please select an item from the catalog.');
      return;
    }
    if (quantity <= 0) {
      setErrorMessage('Quantity must be 1 or greater.');
      return;
    }
    if (!invoiceRef.trim()) {
      setErrorMessage('Invoice / Delivery Challan reference is required.');
      return;
    }
    if (!selectedProduct) return;

    const success = addTransaction({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productSku: selectedProduct.sku,
      type: 'Purchase',
      quantity,
      remarks: `Inbound Receiving. Challan Ref: ${invoiceRef}. ${remarks ? `Note: ${remarks}` : ''}`
    });

    if (success) {
      setSuccessMessage(`Successfully received ${quantity} units of ${selectedProduct.name}. Inventory count increased.`);
      // Reset form
      setSearchTerm('');
      setSelectedProductId('');
      setQuantity(1);
      setInvoiceRef('');
      setRemarks('');
    } else {
      setErrorMessage('Failed to log shipment entry.');
    }
  };

  // Recent inbounds (Purchases) logged
  const recentInbounds = transactions
    .filter(t => t.type === 'Purchase')
    .slice(0, 5);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-text-primary">Receive Shipment (Inbound Cargo)</h1>
          <p className="text-xs text-text-secondary">Register new vendor stock arrivals and update catalog quantities.</p>
        </div>

        {/* Dual column: form & logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Receiving form */}
          <div className="lg:col-span-2 rounded-xl border border-border-primary bg-bg-primary p-6 shadow-sm">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <Truck className="h-4.5 w-4.5 text-saffron-500" />
              <span>Register Incoming Stock</span>
            </h3>

            <form onSubmit={handleIntakeSubmit} className="space-y-4">
              {/* Product Lookup */}
              <div className="relative">
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Search Item SKU or Name</label>
                {!selectedProductId ? (
                  <div className="relative">
                    <Search className="absolute top-2.5 left-3.5 h-4.5 w-4.5 text-text-secondary" />
                    <input
                      type="text"
                      placeholder="Type SKU or item name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-bg-secondary border border-border-primary rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 font-medium"
                    />
                    {searchTerm && (
                      <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto z-50 rounded-lg border border-border-primary bg-bg-primary shadow-lg divide-y divide-border-primary/50">
                        {autocompleteProducts.slice(0, 5).map(prod => (
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
                              <span className="text-[10px] text-text-secondary font-mono block">{prod.sku}</span>
                            </div>
                            <span className="text-[10px] text-text-secondary bg-bg-tertiary px-2 py-0.5 rounded-full font-semibold">
                              Stock: {prod.currentStock}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between border border-saffron-200 bg-saffron-50/50 dark:bg-saffron-500/5 px-4 py-3 rounded-lg">
                    <div>
                      <span className="text-xs font-semibold text-text-primary block">{selectedProduct?.name}</span>
                      <span className="text-[10px] text-text-secondary font-mono block mt-0.5">{selectedProduct?.sku} • Vendor: {selectedProduct?.vendor}</span>
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

              {/* Quantity and Invoice reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Quantity Received</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Delivery Challan / Invoice Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. DC-2026-904"
                    value={invoiceRef}
                    onChange={(e) => setInvoiceRef(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400"
                    required
                  />
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Challan Notes / Remarks (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Batch #4 verified, cardboard wrapper seal intact..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400"
                />
              </div>

              {errorMessage && (
                <div className="p-3 text-xs font-semibold rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/15">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="p-3 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 animate-pulse">
                  {successMessage}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-saffron-400 hover:bg-saffron-500 rounded-lg shadow-saffron shadow-sm"
                >
                  Confirm Inbound Receipt
                </button>
              </div>
            </form>
          </div>

          {/* Recent shipments logs */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm h-[395px] flex flex-col">
            <div className="pb-3 border-b border-border-primary mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Shift Receipts Log</h3>
                <p className="text-[10px] text-text-secondary">Recent check-ins performed today</p>
              </div>
              <Clock className="h-4.5 w-4.5 text-text-secondary" />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {recentInbounds.map((t) => (
                <div key={t.id} className="text-xs pb-3 border-b border-border-primary/45 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-text-primary block truncate max-w-44">{t.productName}</span>
                      <span className="text-[9px] text-text-secondary font-mono block mt-0.5">SKU: {t.productSku}</span>
                    </div>
                    <span className="font-bold text-emerald-500 font-mono">+{t.quantity}</span>
                  </div>
                  <p className="text-[10px] text-text-secondary italic mt-1 font-medium">{t.remarks}</p>
                </div>
              ))}
              {recentInbounds.length === 0 && (
                <div className="h-full flex items-center justify-center text-xs text-text-secondary">No stock arrivals recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
