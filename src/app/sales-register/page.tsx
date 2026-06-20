'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useApp } from '@/context/AppContext';
import { Product } from '@/types';
import { Search, ShoppingBag, Plus, Trash2, CheckSquare, TriangleAlert } from 'lucide-react';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function SalesRegister() {
  const { products, addTransaction } = useApp();

  // Search and cart states
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(() => 'INV-' + Math.floor(100000 + Math.random() * 900000));

  const autocompleteProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add item to cart
  const addToCart = (product: Product) => {
    setErrorMessage('');
    setSuccessMessage('');

    // Check stock limit
    const existingCartItem = cart.find(item => item.product.id === product.id);
    const currentCartQty = existingCartItem ? existingCartItem.quantity : 0;
    
    if (product.currentStock <= currentCartQty) {
      setErrorMessage(`Insufficient stock! ${product.name} only has ${product.currentStock} units available.`);
      return;
    }

    if (existingCartItem) {
      setCart(
        cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    setSearchTerm('');
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  // Update quantity in cart
  const updateCartQuantity = (productId: string, qty: number) => {
    setErrorMessage('');
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = cart.find(c => c.product.id === productId);
    if (!item) return;

    if (item.product.currentStock < qty) {
      setErrorMessage(`Insufficient stock! Only ${item.product.currentStock} available for ${item.product.name}.`);
      return;
    }

    setCart(
      cart.map(c =>
        c.product.id === productId ? { ...c, quantity: qty } : c
      )
    );
  };

  // Calculate cart metrics
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalBillValue = cart.reduce((acc, item) => acc + item.quantity * item.product.sellingPrice, 0);

  // Checkout submit
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (cart.length === 0) {
      setErrorMessage('Shopping cart is empty.');
      return;
    }

    // Verify all cart items have enough stock
    let stockoutItem = cart.find(item => item.product.currentStock < item.quantity);
    if (stockoutItem) {
      setErrorMessage(
        `Failed to checkout. ${stockoutItem.product.name} only has ${stockoutItem.product.currentStock} units, but cart requires ${stockoutItem.quantity}.`
      );
      return;
    }

    // Execute deductions
    let checkoutSuccess = true;
    cart.forEach(item => {
      const success = addTransaction({
        productId: item.product.id,
        productName: item.product.name,
        productSku: item.product.sku,
        type: 'Sale',
        quantity: item.quantity,
        remarks: `Retail sale checkout. Invoice: ${invoiceNumber}`
      });
      if (!success) checkoutSuccess = false;
    });

    if (checkoutSuccess) {
      setSuccessMessage(`Checkout complete! Invoice ${invoiceNumber} logged. Retail stocks decremented.`);
      setCart([]);
      setInvoiceNumber('INV-' + Math.floor(100000 + Math.random() * 900000));
    } else {
      setErrorMessage('Error occurred during checkout. Please try again.');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Log Customer Sale (POS Register)</h1>
            <p className="text-xs text-text-secondary">Register daily shop checkouts. Deducts quantities from inventory instantly.</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-text-secondary">Invoice Reference:</span>
            <span className="block text-xs font-mono font-bold text-saffron-500">{invoiceNumber}</span>
          </div>
        </div>

        {/* Dual column: register & checkout summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Cart builder */}
          <div className="lg:col-span-2 rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center space-x-1.5">
              <ShoppingBag className="h-4.5 w-4.5 text-saffron-500" />
              <span>Checkout Register</span>
            </h3>

            {/* Product Search */}
            <div className="relative">
              <Search className="absolute top-2.5 left-3.5 h-4.5 w-4.5 text-text-secondary" />
              <input
                type="text"
                placeholder="Search item SKU or name to add to checkout cart..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-bg-secondary border border-border-primary rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 font-medium"
              />
              {searchTerm && (
                <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto z-50 rounded-lg border border-border-primary bg-bg-primary shadow-lg divide-y divide-border-primary/50">
                  {autocompleteProducts.slice(0, 6).map(prod => {
                    const isOutOfStock = prod.currentStock === 0;
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => addToCart(prod)}
                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-bg-secondary flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div>
                          <span className="font-semibold text-text-primary block">{prod.name}</span>
                          <span className="text-[10px] text-text-secondary font-mono block">SKU: {prod.sku} • Price: ₹{prod.sellingPrice}</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            isOutOfStock
                              ? 'bg-red-50 text-red-500'
                              : 'bg-bg-tertiary text-text-secondary'
                          }`}>
                            {isOutOfStock ? 'Out of stock' : `Stock: ${prod.currentStock}`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart items list */}
            <div className="border border-border-primary/50 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-primary bg-bg-secondary/40 text-[10px] font-bold text-text-secondary uppercase">
                    <th className="py-2.5 px-4">SKU / Item</th>
                    <th className="py-2.5 px-4 text-right">Price</th>
                    <th className="py-2.5 px-4 text-center w-28">Quantity</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                    <th className="py-2.5 px-4 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary/45 font-semibold">
                  {cart.map((item) => (
                    <tr key={item.product.id} className="text-text-primary hover:bg-bg-secondary/15 transition-colors">
                      <td className="py-2 px-4">
                        <span className="font-mono text-[10px] block text-text-secondary">{item.product.sku}</span>
                        <span className="truncate block max-w-xs">{item.product.name}</span>
                      </td>
                      <td className="py-2 px-4 text-right font-mono text-text-secondary">₹{item.product.sellingPrice}</td>
                      <td className="py-2 px-4 text-center">
                        <input
                          type="number"
                          min="1"
                          max={item.product.currentStock}
                          value={item.quantity}
                          onChange={(e) => updateCartQuantity(item.product.id, parseInt(e.target.value) || 0)}
                          className="w-16 px-1.5 py-1 text-center font-mono border border-border-primary rounded bg-bg-primary text-text-primary focus:outline-none focus:ring-1 focus:ring-saffron-300"
                        />
                      </td>
                      <td className="py-2 px-4 text-right font-mono">₹{(item.quantity * item.product.sellingPrice).toLocaleString('en-IN')}</td>
                      <td className="py-2 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 rounded-lg border border-border-primary bg-bg-primary text-red-500 hover:text-red-700 hover:bg-red-500/5 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cart.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-text-secondary italic font-medium">
                        Register cart is empty. Search and add items above to begin billing checkouts.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Checkout billing panel */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-5 shadow-sm space-y-4">
            <div className="pb-3 border-b border-border-primary">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Checkout Receipt</h3>
              <p className="text-[10px] text-text-secondary">Order settlement and invoice compilation</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-semibold text-text-secondary">
                <span>Unique SKU Items:</span>
                <span>{cart.length} lines</span>
              </div>
              <div className="flex justify-between font-semibold text-text-secondary">
                <span>Total Items Count:</span>
                <span>{totalItemsCount} units</span>
              </div>
              <div className="border-t border-border-primary pt-3 flex justify-between font-bold text-text-primary text-sm">
                <span>Subtotal Bill:</span>
                <span className="font-mono text-saffron-500">₹{totalBillValue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 text-xs font-semibold rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/15 flex items-start space-x-1.5">
                <TriangleAlert className="h-4 w-4 shrink-0 text-red-500" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 animate-pulse">
                {successMessage}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || !!successMessage}
              className="w-full py-3 inline-flex items-center justify-center space-x-1.5 rounded-lg bg-saffron-400 hover:bg-saffron-500 text-white font-bold text-xs shadow-saffron shadow-sm disabled:opacity-40 transition-colors"
            >
              <CheckSquare className="h-4.5 w-4.5" />
              <span>Complete Sale & Deduct Stock</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
