'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useApp } from '@/context/AppContext';
import {
  Truck,
  ClipboardCheck,
  Warehouse,
  Boxes,
  ShoppingBag,
  RotateCcw,
  Scale,
  BarChart3,
  ArrowRight,
  Info,
  Layers,
  Activity
} from 'lucide-react';

interface FlowNode {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  fullDetails: string;
  liveMetricKey: string;
  liveMetricValue: string | number;
  status: 'active' | 'warning' | 'info';
}

export default function OperationsFlow() {
  const { products, transactions, returns } = useApp();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('supplier');

  // Compute live data for visual nodes
  const lowStockCount = products.filter(p => p.currentStock < p.minimumStock).length;
  const pendingReturns = returns.filter(r => r.status === 'pending').length;
  const todaySalesCount = transactions.filter(t => t.type === 'Sale').length;
  const activeSKUsCount = products.length;
  
  // Total Asset Value
  const totalAssetVal = products.reduce((acc, p) => acc + p.currentStock * p.sellingPrice, 0);

  const nodes: FlowNode[] = [
    {
      id: 'supplier',
      name: 'Supplier Sourcing',
      icon: Truck,
      description: 'Procuring high-quality spiritual crafts and wellness organic materials from specialized domestic vendors.',
      fullDetails: 'We procure idols from Ayodhya Brass Works, wellness resins from Himalayan Farms, and organic paste from Mysore Fragrances. Lead times range from 4-9 days depending on seasonal festival volume.',
      liveMetricKey: 'Active Vendors',
      liveMetricValue: '6 verified suppliers',
      status: 'info'
    },
    {
      id: 'receiving',
      name: 'Store Receiving',
      icon: ClipboardCheck,
      description: 'Inbound inspection, cargo gate logs, packaging checks, and batch code registrations.',
      fullDetails: 'All incoming packages are verified against Purchase Orders. Batch numbers are logged to ensure tracking validity. Damaged receiving items are flagged directly to the vendor for credit replacement.',
      liveMetricKey: 'Inbound Quality Pass',
      liveMetricValue: '99.2% rate',
      status: 'info'
    },
    {
      id: 'warehouse',
      name: 'Warehouse Binning',
      icon: Warehouse,
      description: 'Dynamic shelf bin allocation, labeling, and climate-controlled storage for organic ingredients.',
      fullDetails: 'Goods are binned with barcode references. High-velocity items (camphor, incense) are positioned in primary access aisles, while heavy idols are allocated to lower shelving units for safety.',
      liveMetricKey: 'Storage Load Index',
      liveMetricValue: '48% capacity',
      status: 'info'
    },
    {
      id: 'inventory',
      name: 'Safety Inventory',
      icon: Boxes,
      description: 'Safety stock buffers, reorder thresholds, and automated low-stock warnings.',
      fullDetails: 'Safety stock triggers warning logs when quantities drop below minimum limits. Inventory status is cross-referenced in real-time to prevent out-of-stocks during festive purchase seasons.',
      liveMetricKey: 'Deficit Risk Alerts',
      liveMetricValue: `${lowStockCount} items below min`,
      status: lowStockCount > 0 ? 'warning' : 'active'
    },
    {
      id: 'sales',
      name: 'D2C Retail Channels',
      icon: ShoppingBag,
      description: 'E-commerce sales flow, retail orders, multi-channel order dispatch, and inventory deductions.',
      fullDetails: 'Every D2C order logged automatically decrements warehouse quantities. Real-time channel integration ensures catalog stock synchronizes instantly to avoid overselling.',
      liveMetricKey: 'Transactions Logged',
      liveMetricValue: `${todaySalesCount} active sales logs`,
      status: 'active'
    },
    {
      id: 'returns',
      name: 'Reverse Returns',
      icon: RotateCcw,
      description: 'Reverse shipping receipt, QA status inspections, restock, or damaged write-offs.',
      fullDetails: 'Returned products go through an inspection workflow: items with intact seals are returned to warehouse inventory; damaged items are written off as administrative loss.',
      liveMetricKey: 'Awaiting QA Inspect',
      liveMetricValue: `${pendingReturns} cases pending`,
      status: pendingReturns > 0 ? 'warning' : 'info'
    },
    {
      id: 'reconciliation',
      name: 'Stock Reconciliation',
      icon: Scale,
      description: 'Cycle counts, shelf count audits, and manual adjustment ledger entries.',
      fullDetails: 'Physical counts are reconciled weekly. Variances are logged as Adjustments in the ledger. A low adjustment history ensures an accurate inventory ledger database.',
      liveMetricKey: 'Ledger Audit Index',
      liveMetricValue: '99.6% Match accuracy',
      status: 'info'
    },
    {
      id: 'reports',
      name: 'Executive Reports',
      icon: BarChart3,
      description: 'Asset valuation reports, inventory turnover statistics, and PDF summaries.',
      fullDetails: 'Operations performance reports are generated on demand. Metrics track FIFO asset cost estimations, return rate thresholds, and gross markup values.',
      liveMetricKey: 'Active Asset Value',
      liveMetricValue: `₹${totalAssetVal.toLocaleString('en-IN')}`,
      status: 'info'
    }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const SelectedIcon = selectedNode.icon;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Enterprise Inventory Flow</h1>
          <p className="text-xs text-text-secondary">Interactive lifecycle mapping. Select any node to trace the retail flow parameters and view live metrics.</p>
        </div>

        {/* Dynamic Animated Flow Layout */}
        <div className="rounded-xl border border-border-primary bg-bg-primary p-6 shadow-sm overflow-hidden relative">
          <div className="absolute top-4 right-4 flex items-center space-x-2 text-[10px] text-text-secondary font-semibold">
            <span className="h-2 w-2 rounded-full bg-saffron-400 animate-ping" />
            <span>Interactive Process Flow Map</span>
          </div>

          {/* Diagram grid nodes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 items-center justify-center relative">
            
            {/* SVG Connecting paths (Animated Flow Lines) - Hidden on small screen sizes */}
            <div className="absolute inset-0 z-0 pointer-events-none hidden md:block px-6">
              <svg className="w-full h-full" fill="none">
                {/* Arrow lines mapping nodes */}
                <path d="M 120 70 L 320 70" stroke="#FF9933" strokeWidth="2.5" strokeDasharray="6, 6" className="animate-[dash_8s_linear_infinite]" style={{ strokeDashoffset: -20 }} />
                <path d="M 400 70 L 600 70" stroke="#FF9933" strokeWidth="2.5" strokeDasharray="6, 6" className="animate-[dash_8s_linear_infinite]" />
                <path d="M 680 70 L 880 70" stroke="#FF9933" strokeWidth="2.5" strokeDasharray="6, 6" className="animate-[dash_8s_linear_infinite]" />
                
                {/* Diagonal drop from Node 4 to Node 5 */}
                <path d="M 920 110 L 920 180 L 120 180 L 120 250" stroke="#FF9933" strokeWidth="2.5" strokeDasharray="6, 6" className="animate-[dash_8s_linear_infinite]" />
                
                {/* Row 2 */}
                <path d="M 160 290 L 360 290" stroke="#FF9933" strokeWidth="2.5" strokeDasharray="6, 6" className="animate-[dash_8s_linear_infinite]" />
                <path d="M 440 290 L 640 290" stroke="#FF9933" strokeWidth="2.5" strokeDasharray="6, 6" className="animate-[dash_8s_linear_infinite]" />
                <path d="M 720 290 L 920 290" stroke="#FF9933" strokeWidth="2.5" strokeDasharray="6, 6" className="animate-[dash_8s_linear_infinite]" />
              </svg>
              
              <style>{`
                @keyframes dash {
                  to {
                    stroke-dashoffset: -40;
                  }
                }
              `}</style>
            </div>

            {/* Individual Nodes */}
            {nodes.map((node, index) => {
              const Icon = node.icon;
              const isSelected = node.id === selectedNodeId;
              const hasAlert = node.status === 'warning';

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`relative z-10 flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center group ${
                    isSelected
                      ? 'border-saffron-400 bg-saffron-50 dark:bg-saffron-100/10 shadow-saffron shadow-sm scale-102'
                      : 'border-border-primary bg-bg-primary hover:border-saffron-300 hover:bg-bg-secondary/40'
                  }`}
                >
                  {/* Step label index */}
                  <span className="absolute top-2 left-2.5 text-[9px] font-bold text-text-secondary">0{index + 1}</span>
                  
                  {/* Node icon */}
                  <div className={`p-3 rounded-lg ${
                    isSelected
                      ? 'bg-saffron-400 text-white shadow-saffron shadow-xs'
                      : hasAlert
                      ? 'bg-red-500/10 text-red-500 animate-pulse'
                      : 'bg-bg-secondary text-text-secondary group-hover:text-saffron-500'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Name */}
                  <span className="mt-3 text-xs font-bold text-text-primary">{node.name}</span>
                  
                  {/* Status Indicator dot */}
                  <div className="absolute top-2 right-2.5 flex h-1.5 w-1.5 items-center justify-center">
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      hasAlert ? 'bg-red-500 animate-ping' : isSelected ? 'bg-saffron-400' : 'bg-slate-300'
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Node detail explainer block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detail card */}
          <div className="lg:col-span-2 rounded-xl border border-border-primary bg-bg-primary p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-border-primary">
              <div className="p-2.5 rounded-lg bg-saffron-50 dark:bg-saffron-900/20 text-saffron-500">
                <SelectedIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-text-secondary uppercase font-semibold">Stage Parameter Specification</span>
                <h2 className="text-base font-bold text-text-primary">{selectedNode.name}</h2>
              </div>
            </div>
            
            <div className="space-y-3.5 text-xs text-text-secondary leading-relaxed">
              <p className="font-semibold text-text-primary">{selectedNode.description}</p>
              <p>{selectedNode.fullDetails}</p>
            </div>
          </div>

          {/* Live parameters checklist card */}
          <div className="rounded-xl border border-border-primary bg-bg-primary p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="h-4.5 w-4.5 text-saffron-500" />
                <span>Live State Parameters</span>
              </h3>
              
              <div className="rounded-lg bg-bg-secondary p-4 space-y-2 border border-border-primary/50 text-xs">
                <span className="text-text-secondary font-medium block uppercase text-[10px] tracking-wider">
                  {selectedNode.liveMetricKey}
                </span>
                <span className="text-lg font-mono font-extrabold text-text-primary block">
                  {selectedNode.liveMetricValue}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border-primary/60 text-xs text-text-secondary flex items-start space-x-2">
              <Info className="h-4.5 w-4.5 text-saffron-400 shrink-0 mt-0.5" />
              <p className="leading-snug">
                Data metrics are calculated dynamically from active stock records. Any logged transaction shifts these figures in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
