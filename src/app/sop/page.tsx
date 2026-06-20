'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import {
  Truck,
  ShoppingBag,
  RotateCcw,
  Ban,
  ArrowLeftRight,
  FileCheck,
  Scale,
  Printer,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

interface SOPStep {
  stepNum: number;
  title: string;
  instruction: string;
}

interface SOPItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  objective: string;
  role: string;
  steps: SOPStep[];
}

export default function StoreSOPCenter() {
  const [activeSopId, setActiveSopId] = useState('receiving');
  const [checkedSteps, setCheckedSteps] = useState<{ [key: string]: boolean }>({});

  const sops: SOPItem[] = [
    {
      id: 'receiving',
      name: 'Receiving Inventory',
      icon: Truck,
      objective: 'Verify inbound shipments against original POs, verify physical damage, and log stock arrival.',
      role: 'Inbound Receiving Team',
      steps: [
        { stepNum: 1, title: 'Verify PO & Delivery Challan', instruction: 'Match vendor invoice codes against the original Purchase Order. Do not unload cargo if mismatch exists.' },
        { stepNum: 2, title: 'Physical Quality Check', icon: Truck, instruction: 'Unpack box boxes. Check clay items (diyas), marble dust structures, and liquid jars for breakage.' } as any,
        { stepNum: 3, title: 'SKU Quantity Count', instruction: 'Physically count every item. Write physical counts on invoice paper, highlighting discrepancies.' },
        { stepNum: 4, title: 'Log Inward Registry', instruction: 'Go to "Receive Shipment" in the app, select product, enter count received, challan ID, and submit.' }
      ]
    },
    {
      id: 'sales',
      name: 'Customer Sales',
      icon: ShoppingBag,
      objective: 'Log sales checkouts in real-time, deduct stock counts, and verify cashier registers EOD.',
      role: 'Cashier / POS Operator',
      steps: [
        { stepNum: 1, title: 'Scan / Select Item', instruction: 'Select the SKU in the "Log Customer Sale" screen as items are placed on the checkout counter.' },
        { stepNum: 2, title: 'Check Stock Alerts', instruction: 'Verify there are no low stock warnings. Inform manager if item stock limit is critical.' },
        { stepNum: 3, title: 'Compile Cart', instruction: 'Confirm checkout quantities. Add products to cashier cart in app, calculating totals.' },
        { stepNum: 4, title: 'Deduct Stock Checkout', instruction: 'Click "Complete Sale & Deduct Stock". Issue invoice receipt print out to the customer.' }
      ]
    },
    {
      id: 'returns',
      name: 'Returns Processing',
      icon: RotateCcw,
      objective: 'Intake returned products, isolate in quarantine, and inspect seals to resolve cases.',
      role: 'Returns Desk Staff',
      steps: [
        { stepNum: 1, title: 'Intake Case Log', instruction: 'Go to "Returns & Damages", select product SKU, input returned quantities, and note return reason.' },
        { stepNum: 2, title: 'Isolate in Quarantine', instruction: 'Physically move returned box items to the warehouse Quarantine Area. Do not mix with primary shelf stock.' },
        { stepNum: 3, title: 'QC Seal Inspection', instruction: 'Manager verifies package seal. If seal is intact, mark return case status as restocked.' },
        { stepNum: 4, title: 'Auto Inventory Adjustment', instruction: 'Restocking returned items triggers stock increment transaction logs. Discarded returns move to write-off.' }
      ]
    },
    {
      id: 'damages',
      name: 'Damaged Inventory Handling',
      icon: Ban,
      objective: 'Isolate expired wellness items or cracked idols, execute write-offs, and post margins losses.',
      role: 'Warehouse / Floor Manager',
      steps: [
        { stepNum: 1, title: 'Identify Damage Shelf', instruction: 'Identify damaged wellness honey jars, expired oils, or broken brass sculptures during daily checks.' },
        { stepNum: 2, title: 'Register Damage Case', instruction: 'Log the damaged item count in the Returns list under type "Damaged" or "Expired".' },
        { stepNum: 3, title: 'Move to Waste Quarantine', instruction: 'Remove physical items from retail shelves. Move to designated scrap area in Bangalore Store.' },
        { stepNum: 4, title: 'Execute Write-Off', instruction: 'Click "Write-off" in app. This decrements active catalog counts and logs financial cost basis loss.' }
      ]
    },
    {
      id: 'transfers',
      name: 'Warehouse Transfers',
      icon: ArrowLeftRight,
      objective: 'Transfer items between Bangalore central warehouse and secondary retail outlet channels.',
      role: 'Logistics Supervisor',
      steps: [
        { stepNum: 1, title: 'Verify Transfer Request', instruction: 'Check Bangalore retail outlet request PO. Confirm product stock availability.' },
        { stepNum: 2, title: 'Pack & Barcode Label', instruction: 'Pack items in transit bins. Attach barcode label sheet showing SKU details and quantities.' },
        { stepNum: 3, title: 'Log Outbound Transfer', instruction: 'Log a transaction of type "Warehouse Transfer" in the app, entering outbound quantities.' },
        { stepNum: 4, title: 'Confirm Gate Exit', instruction: 'Verify truck exit dispatch. Check that Bangalore inventory counts reflect outbound deductions.' }
      ]
    },
    {
      id: 'adjustments',
      name: 'Stock Adjustments',
      icon: FileCheck,
      objective: 'Authorize manual stock overrides in the ledger following counting corrections or shrinkage audits.',
      role: 'Operations Lead / Founder',
      steps: [
        { stepNum: 1, title: 'Verify Count Variance', instruction: 'Identify SKU counts differences during Stock Take counts audit. Verify audit history logs.' },
        { stepNum: 2, title: 'Verify Adjustment Reason', instruction: 'Verify adjustment reason: spot check variance, transit damage, or store shrinkage.' },
        { stepNum: 3, title: 'Reconciliation Approval', instruction: 'Select "Approve Audit" on the Reconciliation grid list to authorize system changes.' },
        { stepNum: 4, title: 'Ledger Audit Entry', instruction: 'Click EOD adjust stock. This updates catalog inventory counts and records Adjustment transactions.' }
      ]
    },
    {
      id: 'audits',
      name: 'Physical Audits',
      icon: Scale,
      objective: 'Conduct regular cycle counts and EOD stock take counts checks.',
      role: 'Operations Audit Lead',
      steps: [
        { stepNum: 1, title: 'Start Count Session', instruction: 'Open "Stock Take (Audit)" page during EOD closing. Click "Start Daily Stock Take" to lock expected stock.' },
        { stepNum: 2, title: 'Conduct Bins Spot-check', instruction: 'Staff physically counts shelf items. Enter counts into the Reconciliation physical count field.' },
        { stepNum: 3, title: 'Analyze Variance Alert', instruction: 'Verify discrepancies highlighted in red (deficit) or amber (surplus) to flag shelf checks.' },
        { stepNum: 4, title: 'Complete Closing Audit', instruction: 'Type shift EOD remarks and get manager approval to adjust system stock.' }
      ]
    }
  ];

  const activeSop = sops.find(s => s.id === activeSopId) || sops[0];
  const ActiveIcon = activeSop.icon;

  const handleToggleCheck = (sopId: string, stepNum: number) => {
    const key = `${sopId}_${stepNum}`;
    setCheckedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Title action row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Store Standard Operating Procedures (SOP)</h1>
            <p className="text-xs text-text-secondary">Operations Manual. Compliance checklists and printable step-by-step workflow procedures for store employees.</p>
          </div>
          <button
            onClick={triggerPrint}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-saffron-400 text-white shadow-saffron shadow-sm hover:bg-saffron-500 transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Print Active SOP Card</span>
          </button>
        </div>

        {/* Tab selection print:hidden */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-bg-primary border border-border-primary rounded-xl shadow-sm print:hidden">
          {sops.map(sop => {
            const SopIcon = sop.icon;
            const isActive = sop.id === activeSopId;
            return (
              <button
                key={sop.id}
                onClick={() => setActiveSopId(sop.id)}
                className={`flex-1 min-w-[130px] px-3 py-2.5 rounded-lg border text-left flex items-center space-x-2 transition-all ${
                  isActive
                    ? 'border-saffron-400 bg-saffron-50 dark:bg-saffron-100/10 text-saffron-600 dark:text-saffron-400 font-bold shadow-saffron shadow-xs'
                    : 'border-border-primary bg-bg-primary text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                }`}
              >
                <SopIcon className="h-4 w-4 shrink-0" />
                <span className="text-[11px] font-bold truncate">{sop.name}</span>
              </button>
            );
          })}
        </div>

        {/* Printable SOP Card block */}
        <div className="rounded-xl border border-border-primary bg-bg-primary p-6 shadow-sm space-y-6 print:border-0 print:shadow-none print:p-0">
          
          {/* SOP Header */}
          <div className="pb-4 border-b border-border-primary/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-saffron-50 dark:bg-saffron-900/20 text-saffron-500">
                <ActiveIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] text-saffron-500 font-bold uppercase tracking-wider">Divine Hindu Operations SOP Card</span>
                <h2 className="text-base font-bold text-text-primary mt-1">SOP: {activeSop.name}</h2>
              </div>
            </div>
            <div className="text-xs font-semibold text-text-secondary">
              <span>Responsible: </span>
              <span className="text-text-primary font-bold">{activeSop.role}</span>
            </div>
          </div>

          {/* SOP Objective block */}
          <div className="rounded-lg border border-border-primary bg-bg-secondary/40 p-4 space-y-1.5">
            <span className="text-[9px] font-bold text-text-secondary uppercase">Operational Objective</span>
            <p className="text-xs text-text-primary font-semibold leading-relaxed">{activeSop.objective}</p>
          </div>

          {/* Steps Diagram Flow */}
          <div className="space-y-4">
            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Step-by-Step Instructions Flow</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSop.steps.map((step) => {
                const isChecked = !!checkedSteps[`${activeSop.id}_${step.stepNum}`];
                return (
                  <div
                    key={step.stepNum}
                    onClick={() => handleToggleCheck(activeSop.id, step.stepNum)}
                    className={`p-4 rounded-lg border cursor-pointer select-none flex items-start space-x-3 transition-all ${
                      isChecked
                        ? 'border-emerald-500/25 bg-emerald-500/5'
                        : 'border-border-primary bg-bg-primary hover:border-saffron-200'
                    }`}
                  >
                    <div className={`h-6 w-6 rounded-full border flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5 ${
                      isChecked
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-bg-secondary text-text-secondary border-border-primary'
                    }`}>
                      {step.stepNum}
                    </div>
                    <div className="space-y-1">
                      <h4 className={`text-xs font-bold ${isChecked ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-text-secondary leading-relaxed">{step.instruction}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Notes print:hidden */}
          <div className="rounded-lg border border-border-primary bg-bg-secondary/40 p-4 flex items-start space-x-3 text-xs text-text-secondary leading-relaxed font-semibold print:hidden">
            <Info className="h-5 w-5 text-saffron-500 shrink-0 mt-0.5" />
            <p>
              <strong>Print Guidelines:</strong> Hang this laminated SOP card at the corresponding workstation (Receiving dock, cashier register desk, or reconciliation bay) for daily shop floor guidance. Press the Print button above to print.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
