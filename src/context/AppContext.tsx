'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Transaction, ReturnItem, TransactionType, ReturnStatus, ReturnType, ReconciliationSession, ReconcileItem, ReconcileItemStatus } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_TRANSACTIONS, INITIAL_RETURNS } from '@/data/sampleData';

interface AppContextProps {
  products: Product[];
  transactions: Transaction[];
  returns: ReturnItem[];
  reconciliation: ReconciliationSession | null;
  reconciliationHistory: ReconciliationSession[];
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'previousStock' | 'updatedStock'>) => boolean;
  addReturnItem: (returnItem: Omit<ReturnItem, 'id' | 'date' | 'status'>) => void;
  processReturnAction: (returnId: string, action: 'restock' | 'write_off' | 'inspect') => void;
  
  // Reconciliation Operations
  startReconciliation: () => void;
  updatePhysicalQty: (productId: string, qty: number) => void;
  setItemReconcileStatus: (productId: string, status: ReconcileItemStatus) => void;
  executeReconcile: (remarks: string) => void;
  cancelReconciliation: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const [reconciliation, setReconciliation] = useState<ReconciliationSession | null>(null);
  const [reconciliationHistory, setReconciliationHistory] = useState<ReconciliationSession[]>([]);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('dh_products');
    const savedTransactions = localStorage.getItem('dh_transactions');
    const savedReturns = localStorage.getItem('dh_returns');
    const savedReconcile = localStorage.getItem('dh_reconciliation');
    const savedReconcileHist = localStorage.getItem('dh_reconciliation_history');
    const savedTheme = localStorage.getItem('dh_theme') as 'light' | 'dark';

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('dh_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
      localStorage.setItem('dh_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    }

    if (savedReturns) {
      setReturns(JSON.parse(savedReturns));
    } else {
      setReturns(INITIAL_RETURNS);
      localStorage.setItem('dh_returns', JSON.stringify(INITIAL_RETURNS));
    }

    if (savedReconcile) {
      setReconciliation(JSON.parse(savedReconcile));
    }

    if (savedReconcileHist) {
      setReconciliationHistory(JSON.parse(savedReconcileHist));
    }

    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setIsInitialized(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('dh_products', JSON.stringify(products));
    }
  }, [products, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('dh_transactions', JSON.stringify(transactions));
    }
  }, [transactions, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('dh_returns', JSON.stringify(returns));
    }
  }, [returns, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      if (reconciliation) {
        localStorage.setItem('dh_reconciliation', JSON.stringify(reconciliation));
      } else {
        localStorage.removeItem('dh_reconciliation');
      }
    }
  }, [reconciliation, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('dh_reconciliation_history', JSON.stringify(reconciliationHistory));
    }
  }, [reconciliationHistory, isInitialized]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('dh_theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const productWithId: Product = {
      ...newProd,
      id: 'p_' + Date.now()
    };
    setProducts((prev) => [productWithId, ...prev]);

    if (productWithId.currentStock > 0) {
      const transaction: Transaction = {
        id: 't_' + Date.now(),
        productId: productWithId.id,
        productName: productWithId.name,
        productSku: productWithId.sku,
        type: 'Purchase',
        quantity: productWithId.currentStock,
        previousStock: 0,
        updatedStock: productWithId.currentStock,
        date: new Date().toISOString(),
        remarks: 'Initial stock recorded upon product creation.'
      };
      setTransactions((prev) => [transaction, ...prev]);
    }
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const finalProd = { ...p, ...updatedFields };
          if (updatedFields.currentStock !== undefined && updatedFields.currentStock !== p.currentStock) {
            const difference = updatedFields.currentStock - p.currentStock;
            const transaction: Transaction = {
              id: 't_' + Date.now() + Math.random().toString(36).substr(2, 4),
              productId: p.id,
              productName: p.name,
              productSku: p.sku,
              type: 'Adjustment',
              quantity: difference,
              previousStock: p.currentStock,
              updatedStock: finalProd.currentStock,
              date: new Date().toISOString(),
              remarks: `Manual product edit adjustment.`
            };
            setTransactions((tPrev) => [transaction, ...tPrev]);
          }
          return finalProd;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addTransaction = (tData: Omit<Transaction, 'id' | 'date' | 'previousStock' | 'updatedStock'>): boolean => {
    let success = false;
    setProducts((prevProducts) => {
      const updated = prevProducts.map((p) => {
        if (p.id === tData.productId) {
          let prevStock = p.currentStock;
          let change = tData.quantity;
          let updatedStock = prevStock;

          switch (tData.type) {
            case 'Purchase':
            case 'Adjustment':
            case 'Customer Return':
              updatedStock = prevStock + change;
              success = true;
              break;
            case 'Sale':
            case 'Damage':
            case 'Expiry':
            case 'Warehouse Transfer':
              updatedStock = Math.max(0, prevStock - change);
              success = true;
              break;
          }

          if (success) {
            const transaction: Transaction = {
              id: 't_' + Date.now() + Math.random().toString(36).substr(2, 4),
              productId: tData.productId,
              productName: tData.productName,
              productSku: tData.productSku,
              type: tData.type,
              quantity: tData.quantity,
              previousStock: prevStock,
              updatedStock: updatedStock,
              date: new Date().toISOString(),
              remarks: tData.remarks
            };
            setTransactions((prevT) => [transaction, ...prevT]);
            return { ...p, currentStock: updatedStock };
          }
        }
        return p;
      });
      return updated;
    });
    return success;
  };

  const addReturnItem = (rData: Omit<ReturnItem, 'id' | 'date' | 'status'>) => {
    const returnItem: ReturnItem = {
      ...rData,
      id: 'r_' + Date.now(),
      date: new Date().toISOString(),
      status: 'pending'
    };
    setReturns((prev) => [returnItem, ...prev]);
  };

  const processReturnAction = (returnId: string, action: 'restock' | 'write_off' | 'inspect') => {
    setReturns((prevReturns) => {
      return prevReturns.map((r) => {
        if (r.id === returnId) {
          let targetStatus: ReturnStatus = r.status;
          
          if (action === 'inspect') {
            targetStatus = 'inspected';
          } else if (action === 'restock') {
            targetStatus = 'restocked';
            addTransaction({
              productId: r.productId,
              productName: r.productName,
              productSku: r.productSku,
              type: 'Customer Return',
              quantity: r.quantity,
              remarks: `Restocked from customer return ID: ${r.id.substring(0, 8)}`
            });
          } else if (action === 'write_off') {
            targetStatus = 'written_off';
            const transaction: Transaction = {
              id: 't_wo_' + Date.now(),
              productId: r.productId,
              productName: r.productName,
              productSku: r.productSku,
              type: r.type === 'Expired' ? 'Expiry' : 'Damage',
              quantity: r.quantity,
              previousStock: 0,
              updatedStock: 0,
              date: new Date().toISOString(),
              remarks: `Administrative Write-off (${r.type}). Notes: ${r.notes}`
            };
            setTransactions((prevT) => [transaction, ...prevT]);
          }

          return { ...r, status: targetStatus };
        }
        return r;
      });
    });
  };

  // Reconciliation Module Operations
  const startReconciliation = () => {
    if (reconciliation && reconciliation.status !== 'CLOSED') {
      return; // Already has an open session
    }

    const items: ReconcileItem[] = products.map((p) => ({
      productId: p.id,
      productName: p.name,
      productSku: p.sku,
      expectedStock: p.currentStock,
      physicalStock: p.currentStock, // starts matching
      variance: 0,
      status: 'matched'
    }));

    const session: ReconciliationSession = {
      id: 'rec_' + Date.now(),
      date: new Date().toISOString(),
      status: 'OPEN',
      items
    };

    setReconciliation(session);
  };

  const updatePhysicalQty = (productId: string, qty: number) => {
    if (!reconciliation) return;

    const updatedItems = reconciliation.items.map((item) => {
      if (item.productId === productId) {
        const variance = qty - item.expectedStock;
        const status: ReconcileItemStatus = variance === 0 ? 'matched' : 'investigating';
        return {
          ...item,
          physicalStock: qty,
          variance,
          status
        };
      }
      return item;
    });

    // Check if session overall status should adjust
    const hasMismatches = updatedItems.some((item) => item.variance !== 0);
    const sessionStatus = hasMismatches ? 'INVESTIGATING' : 'OPEN';

    setReconciliation({
      ...reconciliation,
      status: sessionStatus,
      items: updatedItems
    });
  };

  const setItemReconcileStatus = (productId: string, status: ReconcileItemStatus) => {
    if (!reconciliation) return;

    const updatedItems = reconciliation.items.map((item) => {
      if (item.productId === productId) {
        return { ...item, status };
      }
      return item;
    });

    setReconciliation({
      ...reconciliation,
      items: updatedItems
    });
  };

  const executeReconcile = (remarks: string) => {
    if (!reconciliation) return;

    // Apply adjustments to active stocks and write transactions
    const now = new Date().toISOString();
    
    // We update product stock counts for items that are 'approved' and have a variance
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        const item = reconciliation.items.find((i) => i.productId === p.id);
        
        // Adjust if item has variance and status is approved
        if (item && item.variance !== 0 && item.status === 'approved') {
          // Log adjustment ledger entry
          const transaction: Transaction = {
            id: 't_rec_' + Date.now() + Math.random().toString(36).substr(2, 4),
            productId: p.id,
            productName: p.name,
            productSku: p.sku,
            type: 'Adjustment',
            quantity: item.variance, // e.g. -2 or +3
            previousStock: p.currentStock,
            updatedStock: item.physicalStock,
            date: now,
            remarks: `Audit Reconciliation: ${remarks}`
          };
          setTransactions((prevT) => [transaction, ...prevT]);

          return {
            ...p,
            currentStock: item.physicalStock
          };
        }
        return p;
      });
    });

    // Save session in history
    const closedSession: ReconciliationSession = {
      ...reconciliation,
      status: 'CLOSED',
      remarks,
      items: reconciliation.items.map(item => {
        if (item.variance !== 0 && item.status === 'approved') {
          return { ...item, status: 'adjusted' };
        }
        return item;
      })
    };

    setReconciliationHistory((prev) => [closedSession, ...prev]);
    setReconciliation(null); // Reset session
  };

  const cancelReconciliation = () => {
    setReconciliation(null);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        transactions,
        returns,
        reconciliation,
        reconciliationHistory,
        theme,
        setTheme,
        addProduct,
        updateProduct,
        deleteProduct,
        addTransaction,
        addReturnItem,
        processReturnAction,
        startReconciliation,
        updatePhysicalQty,
        setItemReconcileStatus,
        executeReconcile,
        cancelReconciliation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
