'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import {
  Truck,
  ClipboardCheck,
  Warehouse,
  FolderLock,
  ShoppingBag,
  RotateCcw,
  ShieldCheck,
  Scale,
  FileSpreadsheet,
  ArrowRight,
  Info,
  Calendar,
  Activity
} from 'lucide-react';

interface StageDetails {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  purpose: string;
  owner: string;
  inputs: string[];
  outputs: string[];
  description: string;
}

export default function InventoryLifecycle() {
  const [activeStageId, setActiveStageId] = useState('supplier');

  const stages: StageDetails[] = [
    {
      id: 'supplier',
      name: 'Supplier Sourcing',
      icon: Truck,
      purpose: 'Procure high-quality spiritual crafts, idols, and organic ingredients from trusted local artisans.',
      owner: 'Store Founder / Purchase Lead',
      inputs: ['Market Demand Forecasts', 'Minimum Safety Stock Alerts', 'Purchase Orders (PO)'],
      outputs: ['Supplier Invoice', 'Bill of Lading', 'Shipped Bulk Packages'],
      description: 'Sourcing deals are negotiated directly with artisans in Mysore (sandalwood), Ayodhya (brass idols), and Vrindavan (organic ghee) to ensure authenticity and markup margins.'
    },
    {
      id: 'receiving',
      name: 'Inventory Receiving',
      icon: ClipboardCheck,
      purpose: 'Unpack, verify cargo counts, and inspect incoming items for damages before stocking shelves.',
      owner: 'Warehouse Inbound Staff',
      inputs: ['Supplier Delivery Challan', 'Physical Shipment Cargo', 'Original PO Copy'],
      outputs: ['Verified Receiving Logs', 'QC Pass/Fail Tags', 'Barcoded Shelf Labels'],
      description: 'Items are counted, checked for shipping breakage (especially clay diyas and glass akhand wicks), and logged into the Receiving form in the back-office app.'
    },
    {
      id: 'storage',
      name: 'Warehouse Storage',
      icon: Warehouse,
      purpose: 'Organize and store products in designated climate-controlled bins for optimal preservation.',
      owner: 'Warehouse Keeper',
      inputs: ['QC Passed Cargo', 'Bin Allocation Map'],
      outputs: ['Binned Inventory', 'Shelf Stock Availability Data'],
      description: 'Heavy brass idols are allocated to lower steel shelving. Fragile items and wellness organic honeys/resins are placed in dry, climate-regulated rows.'
    },
    {
      id: 'shelf',
      name: 'Store Shelf Display',
      icon: FolderLock,
      purpose: 'Replenish retail store front shelves to capture immediate walk-in customer sales.',
      owner: 'Floor Retail Staff',
      inputs: ['Warehouse Binned Stock', 'Visual Merchandising Plan'],
      outputs: ['Customer-facing Displays', 'Minimum Stock Alert Flags'],
      description: 'Shelf levels are topped up daily. Laminated minimum stock tags are placed behind items on shelves to trigger physical reorder prompts.'
    },
    {
      id: 'sale',
      name: 'Customer Sale',
      icon: ShoppingBag,
      purpose: 'Check out customer carts, process retail invoices, and deduct active inventory counts.',
      owner: 'Cashier / POS Operator',
      inputs: ['Customer Shopping Carts', 'Retail Selling Prices list'],
      outputs: ['Invoiced Checkout Logs', 'Handed Customer Bill', 'Deducted System Stock'],
      description: 'Sales are logged instantly through the "Log Customer Sale" checkout billing register, ensuring the centralized ledger remains accurate in real-time.'
    },
    {
      id: 'returns',
      name: 'Returns Processing',
      icon: RotateCcw,
      purpose: 'Receive returned packages from e-commerce shipping or walk-in customer exchanges.',
      owner: 'Returns Intake Clerk',
      inputs: ['Customer Original Receipt', 'Returned Product Boxes'],
      outputs: ['Return Case Registration ID', 'Quarantined Items Log'],
      description: 'Returns are logged into the Returns list, starting in a "pending" quarantine state to prevent mixing unverified items with clean warehouse stock.'
    },
    {
      id: 'inspection',
      name: 'Quality Inspection',
      icon: ShieldCheck,
      purpose: 'Perform seal and structural checks on returned products to authorize restocking or write-off.',
      owner: 'QC Inspector / Store Manager',
      inputs: ['Quarantined Return Case', 'Standard Inspection Checklists'],
      outputs: ['Restocked Quantities (Resellable)', 'Damaged Write-off logs (Defectives)'],
      description: 'Items with intact packaging seals are restocked (system stock is incremented). Broken or expired items are written off as administrative loss.'
    },
    {
      id: 'reconciliation',
      name: 'Stock Reconciliation',
      icon: Scale,
      purpose: 'Compare physical store counts with system inventory values to identify discrepancies.',
      owner: 'Operations Audit Lead',
      inputs: ['Physical Box Count Sheet', 'System Expected Quantities list'],
      outputs: ['Approved Discrepancy Sheets', 'Stock Adjustments Ledger Entries'],
      description: 'A physical stocktake is conducted during store closing. Variances are moved through the workflow (Investigate -> Approve -> Adjust) to adjust system counts.'
    },
    {
      id: 'reporting',
      name: 'Daily Reporting',
      icon: FileSpreadsheet,
      purpose: 'Compile sales value, cost margins, and assets valuation reports for management decision-making.',
      owner: 'Operations Manager / Founder',
      inputs: ['Shift Inbound Logs', 'POS Invoice registries', 'Stock Adjustment logs'],
      outputs: ['Daily Closing Spreadsheet', 'Valuation Reports', 'PDF/CSV Export logs'],
      description: 'Operations managers analyze reports to track capital efficiency, safety stock deficits, and evaluate overall retail store health.'
    }
  ];

  const activeStage = stages.find(s => s.id === activeStageId) || stages[0];
  const ActiveIcon = activeStage.icon;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-text-primary">Inventory Operations Lifecycle</h1>
          <p className="text-xs text-text-secondary">Process Flow Presentation. Tracing the 9-stage inventory lifecycle from supplier sourcing to daily executive reports.</p>
        </div>

        {/* Consulting Style Presentation Block */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Navigation Outline */}
          <div className="lg:col-span-1 rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm space-y-1">
            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block mb-2 px-1">Lifecycle Stages</span>
            {stages.map((stage, idx) => (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-left flex items-center space-x-2 transition-all ${
                  stage.id === activeStageId
                    ? 'border-saffron-400 bg-saffron-50 dark:bg-saffron-100/10 text-saffron-600 dark:text-saffron-400 font-bold shadow-saffron shadow-xs'
                    : 'border-border-primary bg-bg-primary text-text-secondary hover:bg-bg-secondary hover:text-text-primary font-semibold'
                }`}
              >
                <stage.icon className="h-4 w-4 shrink-0" />
                <span className="text-[11px] truncate">0{idx + 1}. {stage.name}</span>
              </button>
            ))}
          </div>

          {/* Right Slide Panel Content */}
          <div className="lg:col-span-3 rounded-xl border border-border-primary bg-bg-primary p-6 shadow-sm space-y-6 h-[440px] flex flex-col justify-between">
            <div className="space-y-4">
              {/* Slide Header */}
              <div className="pb-3.5 border-b border-border-primary">
                <span className="text-[9px] text-saffron-500 font-bold uppercase tracking-wider">Process Parameter Mapping</span>
                <h2 className="text-base font-bold text-text-primary mt-1 flex items-center space-x-2">
                  <ActiveIcon className="h-5 w-5 text-saffron-500" />
                  <span>{activeStage.name}</span>
                </h2>
                <p className="text-xs text-text-secondary mt-1.5 leading-snug">{activeStage.purpose}</p>
              </div>

              {/* Slide Body details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Inputs card */}
                <div className="rounded-lg border border-border-primary bg-bg-secondary/40 p-3.5 space-y-1.5">
                  <span className="text-[9px] font-bold text-text-secondary uppercase">1. Inputs Received</span>
                  <ul className="space-y-1 text-[11px] text-text-secondary list-disc pl-4 font-semibold">
                    {activeStage.inputs.map((inp, idx) => (
                      <li key={idx}>{inp}</li>
                    ))}
                  </ul>
                </div>

                {/* Scope details */}
                <div className="rounded-lg border border-border-primary bg-bg-secondary/40 p-3.5 space-y-1.5">
                  <span className="text-[9px] font-bold text-text-secondary uppercase">2. Stage Operations</span>
                  <p className="text-[11px] text-text-secondary leading-relaxed font-semibold">
                    {activeStage.description}
                  </p>
                </div>

                {/* Outputs card */}
                <div className="rounded-lg border border-border-primary bg-bg-secondary/40 p-3.5 space-y-1.5">
                  <span className="text-[9px] font-bold text-text-secondary uppercase">3. Outputs Generated</span>
                  <ul className="space-y-1 text-[11px] text-text-secondary list-disc pl-4 font-semibold">
                    {activeStage.outputs.map((out, idx) => (
                      <li key={idx}>{out}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Slide Footer */}
            <div className="rounded-xl border border-border-primary bg-bg-secondary/40 p-4 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-text-secondary uppercase">Responsible Person:</span>
                <span className="text-text-primary font-bold">{activeStage.owner}</span>
              </div>
              <span className="text-[10px] text-text-secondary">Stage {stages.indexOf(activeStage) + 1} of {stages.length}</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
