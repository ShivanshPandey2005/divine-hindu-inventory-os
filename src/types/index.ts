export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  minimumStock: number;
  vendor: string;
}

export type TransactionType =
  | 'Purchase'
  | 'Sale'
  | 'Customer Return'
  | 'Warehouse Transfer'
  | 'Damage'
  | 'Expiry'
  | 'Adjustment';

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  type: TransactionType;
  quantity: number;
  previousStock: number;
  updatedStock: number;
  date: string;
  remarks: string;
}

export type ReturnStatus = 'pending' | 'inspected' | 'restocked' | 'written_off';
export type ReturnType = 'Customer Return' | 'Damaged' | 'Expired';

export interface ReturnItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  type: ReturnType;
  quantity: number;
  date: string;
  status: ReturnStatus;
  notes: string;
}

export type ReconcileItemStatus = 'investigating' | 'approved' | 'adjusted' | 'matched';

export interface ReconcileItem {
  productId: string;
  productName: string;
  productSku: string;
  expectedStock: number;
  physicalStock: number;
  variance: number;
  status: ReconcileItemStatus;
}

export type ReconcileSessionStatus = 'OPEN' | 'INVESTIGATING' | 'APPROVED' | 'CLOSED';

export interface ReconciliationSession {
  id: string;
  date: string;
  status: ReconcileSessionStatus;
  items: ReconcileItem[];
  remarks?: string;
}
