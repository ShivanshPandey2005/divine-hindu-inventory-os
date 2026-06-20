'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useApp } from '@/context/AppContext';
import { Product } from '@/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  TrendingUp,
  X,
  History,
  Info,
  Layers,
  ArrowUpDown
} from 'lucide-react';

export default function ProductMaster() {
  const { products, addProduct, updateProduct, deleteProduct, transactions } = useApp();
  
  // Page states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'sku' | 'name' | 'currentStock' | 'sellingPrice'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Selected product detail drawer
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Incense Sticks');
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);
  const [minimumStock, setMinimumStock] = useState(0);
  const [vendor, setVendor] = useState('');

  // Categories list
  const categories = ['Incense Sticks', 'Puja Kits', 'Rudraksha', 'Idols', 'Camphor', 'Diyas', 'Wellness & Organic'];

  // Handle Add Product submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !name || !vendor || costPrice <= 0 || sellingPrice <= 0) {
      alert('Please fill out all fields correctly.');
      return;
    }
    
    // Check if SKU is unique
    if (products.some(p => p.sku.toLowerCase() === sku.toLowerCase())) {
      alert('SKU must be unique!');
      return;
    }

    addProduct({
      sku,
      name,
      category,
      costPrice,
      sellingPrice,
      currentStock,
      minimumStock,
      vendor
    });

    setIsAddOpen(false);
    resetForm();
  };

  // Handle Edit Product submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productToEdit) return;

    if (!name || !vendor || costPrice <= 0 || sellingPrice <= 0) {
      alert('Please fill out all fields correctly.');
      return;
    }

    updateProduct(productToEdit.id, {
      name,
      category,
      costPrice,
      sellingPrice,
      currentStock,
      minimumStock,
      vendor
    });

    setIsEditOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setSku('');
    setCategory('Incense Sticks');
    setCostPrice(0);
    setSellingPrice(0);
    setCurrentStock(0);
    setMinimumStock(0);
    setVendor('');
    setProductToEdit(null);
  };

  const openEditModal = (p: Product) => {
    setProductToEdit(p);
    setName(p.name);
    setSku(p.sku);
    setCategory(p.category);
    setCostPrice(p.costPrice);
    setSellingPrice(p.sellingPrice);
    setCurrentStock(p.currentStock);
    setMinimumStock(p.minimumStock);
    setVendor(p.vendor);
    setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product from the master catalog?')) {
      deleteProduct(id);
      if (selectedProduct?.id === id) {
        setSelectedProduct(null);
      }
    }
  };

  // Sort and Filter Logic
  const filteredProducts = products
    .filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.vendor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === 'string') {
        valA = (valA as string).toLowerCase();
        valB = (valB as string).toLowerCase();
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, sortBy, sortOrder]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Helper metrics for details
  const getProductStockHistory = (prodId: string) => {
    return transactions.filter(t => t.productId === prodId).slice(0, 10);
  };

  return (
    <MainLayout>
      <div className="space-y-6 relative">
        {/* Header Actions row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Product Master Catalog</h1>
            <p className="text-xs text-text-secondary">View and configure entire SKU range, margins, vendors, and thresholds.</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsAddOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 rounded-lg bg-saffron-400 px-4 py-2 text-sm font-semibold text-white shadow-saffron shadow-sm hover:bg-saffron-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-border-primary bg-bg-primary shadow-sm">
          {/* Search */}
          <div className="relative">
            <Search className="absolute top-2.5 left-3.5 h-4.5 w-4.5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by SKU, Name, or Vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-bg-secondary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 text-text-primary placeholder:text-text-secondary font-medium"
            />
          </div>

          {/* Category Filter */}
          <div className="relative flex items-center">
            <Filter className="absolute left-3.5 h-4 w-4 text-text-secondary" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-bg-secondary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 text-text-primary font-medium appearance-none"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Catalog stats summary */}
          <div className="flex items-center justify-end text-xs text-text-secondary font-medium pr-2">
            Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} SKUs
          </div>
        </div>

        {/* Product Table Container */}
        <div className="overflow-x-auto rounded-xl border border-border-primary bg-bg-primary shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-primary bg-bg-secondary/60 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                <th className="py-3.5 px-4">
                  <button onClick={() => toggleSort('sku')} className="flex items-center space-x-1 hover:text-text-primary">
                    <span>SKU</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4">
                  <button onClick={() => toggleSort('name')} className="flex items-center space-x-1 hover:text-text-primary">
                    <span>Product Name</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-right">Cost</th>
                <th className="py-3.5 px-4 text-right">
                  <button onClick={() => toggleSort('sellingPrice')} className="flex items-center space-x-1 hover:text-text-primary ml-auto">
                    <span>Selling</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4 text-center">
                  <button onClick={() => toggleSort('currentStock')} className="flex items-center space-x-1 hover:text-text-primary mx-auto">
                    <span>Stock</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/50 text-xs">
              {paginatedProducts.map(p => {
                const isLowStock = p.currentStock < p.minimumStock;
                const isOutOfStock = p.currentStock === 0;
                
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`hover:bg-bg-secondary/40 cursor-pointer transition-colors ${
                      selectedProduct?.id === p.id ? 'bg-saffron-50/20 dark:bg-saffron-100/5' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-text-primary">{p.sku}</td>
                    <td className="py-3 px-4 font-semibold text-text-primary max-w-xs truncate">{p.name}</td>
                    <td className="py-3 px-4 text-text-secondary font-medium">{p.category}</td>
                    <td className="py-3 px-4 text-right text-text-secondary font-mono">₹{p.costPrice}</td>
                    <td className="py-3 px-4 text-right text-text-primary font-mono font-semibold">₹{p.sellingPrice}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold ${
                        isLowStock ? 'text-red-500 font-extrabold' : 'text-text-primary'
                      }`}>
                        {p.currentStock}
                      </span>
                      <span className="text-[10px] text-text-secondary block">min: {p.minimumStock}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isOutOfStock
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                          : isLowStock
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {isOutOfStock ? 'Stockout' : isLowStock ? 'Low Stock' : 'Healthy'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end items-center space-x-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg border border-border-primary bg-bg-primary text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg border border-border-primary bg-bg-primary text-red-500 hover:text-red-700 hover:bg-red-500/5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-text-secondary">No products matching the filters were found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
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

        {/* Selected Product Detail Drawer Panel */}
        {selectedProduct && (
          <>
            <div
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs"
            />
            <div className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-md border-l border-border-primary bg-bg-primary p-6 shadow-2xl overflow-y-auto slide-right">
              <div className="flex items-center justify-between border-b border-border-primary pb-4">
                <div>
                  <span className="text-[10px] text-text-secondary font-mono font-bold uppercase tracking-wider">{selectedProduct.sku}</span>
                  <h2 className="text-base font-bold text-text-primary">{selectedProduct.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Stats Cards inside Drawer */}
              <div className="mt-5 space-y-5">
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="rounded-lg border border-border-primary bg-bg-secondary p-3">
                    <span className="text-[10px] font-semibold text-text-secondary uppercase">Markup Margin</span>
                    <span className="block text-base font-bold text-text-primary mt-1 font-mono">
                      {(((selectedProduct.sellingPrice - selectedProduct.costPrice) / selectedProduct.costPrice) * 100).toFixed(0)}%
                    </span>
                    <span className="text-[9px] text-text-secondary">Margin: ₹{selectedProduct.sellingPrice - selectedProduct.costPrice}</span>
                  </div>
                  <div className="rounded-lg border border-border-primary bg-bg-secondary p-3">
                    <span className="text-[10px] font-semibold text-text-secondary uppercase">Inventory Value</span>
                    <span className="block text-base font-bold text-text-primary mt-1 font-mono">
                      ₹{(selectedProduct.currentStock * selectedProduct.sellingPrice).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-text-secondary">Cost: ₹{selectedProduct.currentStock * selectedProduct.costPrice}</span>
                  </div>
                </div>

                {/* Logistics Info list */}
                <div className="rounded-lg border border-border-primary bg-bg-primary p-4 space-y-2.5">
                  <h3 className="text-xs font-bold text-text-primary border-b border-border-primary pb-1.5 flex items-center space-x-1.5">
                    <Info className="h-3.5 w-3.5 text-saffron-500" />
                    <span>Catalog Specifications</span>
                  </h3>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Product Collection:</span>
                    <span className="text-text-primary font-semibold">{selectedProduct.category}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Supplier Vendor:</span>
                    <span className="text-text-primary font-semibold">{selectedProduct.vendor}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Purchase Price (Cost):</span>
                    <span className="text-text-primary font-mono font-semibold">₹{selectedProduct.costPrice}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Selling Price (Retail):</span>
                    <span className="text-text-primary font-mono font-semibold">₹{selectedProduct.sellingPrice}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Current Safety Threshold:</span>
                    <span className="text-text-primary font-mono font-semibold">{selectedProduct.minimumStock} units</span>
                  </div>
                </div>

                {/* Stock Audit trail */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-text-primary flex items-center space-x-1.5">
                    <History className="h-4 w-4 text-saffron-500" />
                    <span>Recent Product Ledgers</span>
                  </h3>
                  <div className="space-y-2">
                    {getProductStockHistory(selectedProduct.id).map((t) => (
                      <div key={t.id} className="rounded-lg border border-border-primary/50 bg-bg-secondary/40 p-2.5 text-[11px] flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-text-primary block">{t.type}</span>
                          <span className="text-[9px] text-text-secondary mt-0.5 block">{t.remarks}</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold block ${
                            ['Purchase', 'Customer Return'].includes(t.type) ? 'text-emerald-500' : 'text-red-500'
                          }`}>
                            {['Purchase', 'Customer Return'].includes(t.type) ? `+${t.quantity}` : `-${t.quantity}`}
                          </span>
                          <span className="text-[9px] text-text-secondary font-mono mt-0.5 block">
                            {new Date(t.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {getProductStockHistory(selectedProduct.id).length === 0 && (
                      <p className="text-xs text-text-secondary text-center py-4">No recent transactions recorded for this product.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Modal: Add Product */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-xl border border-border-primary bg-bg-primary p-6 shadow-2xl slide-right">
              <div className="flex items-center justify-between border-b border-border-primary pb-4">
                <h2 className="text-base font-bold text-text-primary">Add SKU to Master</h2>
                <button onClick={() => setIsAddOpen(false)} className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary hover:text-text-primary">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">SKU Code</label>
                    <input
                      type="text"
                      placeholder="e.g. INC-SAN-250"
                      value={sku}
                      onChange={(e) => setSku(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Product Collection</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Product Display Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Premium Sandalwood Agarbatti Big Pack"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Cost Price (₹)</label>
                    <input
                      type="number"
                      value={costPrice || ''}
                      onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Selling Price (₹)</label>
                    <input
                      type="number"
                      value={sellingPrice || ''}
                      onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Starting Stock</label>
                    <input
                      type="number"
                      value={currentStock || ''}
                      onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Min Stock Safety Threshold</label>
                    <input
                      type="number"
                      value={minimumStock || ''}
                      onChange={(e) => setMinimumStock(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Vendor Supplier</label>
                  <input
                    type="text"
                    placeholder="e.g. Mysore Fragrances Ltd."
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-text-secondary border border-border-primary rounded-lg hover:bg-bg-secondary hover:text-text-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-saffron-400 hover:bg-saffron-500 rounded-lg shadow-saffron shadow-sm"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Product */}
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-xl border border-border-primary bg-bg-primary p-6 shadow-2xl slide-right">
              <div className="flex items-center justify-between border-b border-border-primary pb-4">
                <h2 className="text-base font-bold text-text-primary">Edit Product: {productToEdit?.sku}</h2>
                <button onClick={() => setIsEditOpen(false)} className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary hover:text-text-primary">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">SKU Code (Disabled)</label>
                  <input
                    type="text"
                    value={sku}
                    className="w-full px-3 py-2 text-xs bg-bg-tertiary/50 border border-transparent rounded-lg text-text-secondary font-mono"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Product Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Cost Price (₹)</label>
                    <input
                      type="number"
                      value={costPrice || ''}
                      onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Selling Price (₹)</label>
                    <input
                      type="number"
                      value={sellingPrice || ''}
                      onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Current Stock Level</label>
                    <input
                      type="number"
                      value={currentStock || 0}
                      onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Min Stock Safety Threshold</label>
                    <input
                      type="number"
                      value={minimumStock || ''}
                      onChange={(e) => setMinimumStock(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Product Collection</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Vendor Supplier</label>
                    <input
                      type="text"
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-saffron-300"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-text-secondary border border-border-primary rounded-lg hover:bg-bg-secondary hover:text-text-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-saffron-400 hover:bg-saffron-500 rounded-lg shadow-saffron shadow-sm"
                  >
                    Save Changes
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
