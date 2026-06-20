'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import {
  Layers,
  HelpCircle,
  AlertTriangle,
  GitMerge,
  ArrowRight,
  TrendingUp,
  Sliders,
  ShieldCheck,
  Calendar,
  Layers3,
  ChevronRight,
  IndianRupee,
  Activity,
  Bot
} from 'lucide-react';

interface SlideContent {
  id: string;
  tabTitle: string;
  slideTitle: string;
  subtitle: string;
  content: React.ReactNode;
}

export default function AssignmentPresentation() {
  const [activeSlideId, setActiveSlideId] = useState('problem');

  const slides: SlideContent[] = [
    {
      id: 'problem',
      tabTitle: '1. Problem Statement',
      slideTitle: 'Problem Statement: Retail Leakages & Shrinkage',
      subtitle: 'The primary operational gaps that lead to inventory value leakage in traditional D2C setups.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4 space-y-2 text-xs">
              <span className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">Leakage Pillar 1</span>
              <h4 className="text-xs font-bold text-text-primary">Stock Count Discrepancies</h4>
              <p className="text-text-secondary leading-relaxed">
                Differences between paper logs and actual shelf stocks go unchecked, causing audit errors at the end of the day.
              </p>
            </div>
            <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4 space-y-2 text-xs">
              <span className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">Leakage Pillar 2</span>
              <h4 className="text-xs font-bold text-text-primary">Out-of-Stock Lost Sales</h4>
              <p className="text-text-secondary leading-relaxed">
                Fast-moving items deplete below safety thresholds without warnings, causing store out-of-stocks during high-demand festival hours.
              </p>
            </div>
            <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4 space-y-2 text-xs">
              <span className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">Leakage Pillar 3</span>
              <h4 className="text-xs font-bold text-text-primary">Untracked Waste & Return Values</h4>
              <p className="text-text-secondary leading-relaxed">
                Returned orders sit in boxes without inspections. Damaged and expired items are not cataloged, causing unaccounted loss.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 text-xs leading-relaxed text-text-secondary font-semibold">
            <strong>Summary:</strong> Traditional D2C backend architectures overlook shop-floor operational realities. We need to digitize physical transactions to block leakages.
          </div>
        </div>
      )
    },
    {
      id: 'challenges',
      tabTitle: '2. Current Challenges',
      slideTitle: 'Operational Obstacles on the Shop Floor',
      subtitle: 'Understanding real-world constraints when deploying systems for non-technical retail workers.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-border-primary bg-bg-secondary/40 p-4 space-y-2">
              <span className="h-6 w-6 rounded-full bg-saffron-50 dark:bg-saffron-900/20 text-saffron-500 flex items-center justify-center font-bold">1</span>
              <strong className="text-text-primary block mt-1">Staff Compliance Gaps</strong>
              <p className="text-text-secondary leading-relaxed">
                Shop staff struggle with complex ERP systems. They need visual checklists and automated inputs.
              </p>
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-secondary/40 p-4 space-y-2">
              <span className="h-6 w-6 rounded-full bg-saffron-50 dark:bg-saffron-900/20 text-saffron-500 flex items-center justify-center font-bold">2</span>
              <strong className="text-text-primary block mt-1">Manual Audit Bottlenecks</strong>
              <p className="text-text-secondary leading-relaxed">
                Auditing shelf stock with paper lists is slow and prone to errors. Discrepancies are rarely investigated.
              </p>
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-secondary/40 p-4 space-y-2">
              <span className="h-6 w-6 rounded-full bg-saffron-50 dark:bg-saffron-900/20 text-saffron-500 flex items-center justify-center font-bold">3</span>
              <strong className="text-text-primary block mt-1">Lagging Discrepancy Audits</strong>
              <p className="text-text-secondary leading-relaxed">
                Managers cannot identify which discrepancies require reconciliation without sorting through files.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'solution',
      tabTitle: '3. Proposed Solution',
      slideTitle: 'Proposed Solution: Divine Hindu Back-Office Platform',
      subtitle: 'A simplified, fully integrated store operations dashboard that maps daily retail workflows.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-border-primary p-4 space-y-2">
              <span className="text-[10px] text-saffron-500 uppercase font-bold block">For Floor Staff</span>
              <ul className="space-y-1.5 list-disc pl-4 text-text-secondary font-semibold">
                <li>Simple Receiving form to log shipments.</li>
                <li>Quick checkout billing register.</li>
                <li>EOD stocktake sheet with variance alerts.</li>
                <li>Step-by-step interactive SOP check cards.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-border-primary p-4 space-y-2">
              <span className="text-[10px] text-saffron-500 uppercase font-bold block">For Founders & Ops managers</span>
              <ul className="space-y-1.5 list-disc pl-4 text-text-secondary font-semibold">
                <li>Central executive operations dashboard.</li>
                <li>Real-time inventory asset valuation counts.</li>
                <li>Safety stock replenishment suggestions.</li>
                <li>Reconciliation logs with status workflows.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'workflow',
      tabTitle: '4. Inventory Workflow',
      slideTitle: 'Operational Process Flow Diagrams',
      subtitle: 'The 9-stage inventory lifecycle mapping connecting suppliers to end reports.',
      content: (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 text-[10px] font-bold text-text-primary py-2 max-w-2xl">
            <span className="rounded bg-bg-secondary border border-border-primary px-2.5 py-1">Supplier</span>
            <ArrowRight className="h-4 w-4 text-saffron-500" />
            <span className="rounded bg-bg-secondary border border-border-primary px-2.5 py-1">Receiving</span>
            <ArrowRight className="h-4 w-4 text-saffron-500" />
            <span className="rounded bg-bg-secondary border border-border-primary px-2.5 py-1">Warehouse</span>
            <ArrowRight className="h-4 w-4 text-saffron-500" />
            <span className="rounded bg-bg-secondary border border-border-primary px-2.5 py-1">Store Shelf</span>
            <ArrowRight className="h-4 w-4 text-saffron-500" />
            <span className="rounded bg-bg-secondary border border-border-primary px-2.5 py-1">POS Sales</span>
            <ArrowRight className="h-4 w-4 text-saffron-500" />
            <span className="rounded bg-bg-secondary border border-border-primary px-2.5 py-1">Returns</span>
            <ArrowRight className="h-4 w-4 text-saffron-500" />
            <span className="rounded bg-bg-secondary border border-border-primary px-2.5 py-1">Inspect</span>
            <ArrowRight className="h-4 w-4 text-saffron-500" />
            <span className="rounded bg-bg-secondary border border-border-primary px-2.5 py-1">Audit take</span>
            <ArrowRight className="h-4 w-4 text-saffron-500" />
            <span className="rounded bg-bg-secondary border border-border-primary px-2.5 py-1">EOD Reports</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed font-semibold">
            Every operational transition is recorded in a centralized transaction ledger. Quantity shifts propagate instantly to update safety alerts, stocktake count checklists, and reports.
          </p>
        </div>
      )
    },
    {
      id: 'formula',
      tabTitle: '5. Inventory Formula',
      slideTitle: 'Inventory Tracking Formula & Ledger Math',
      subtitle: 'The calculation structures that govern the transaction balance log.',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl border border-saffron-500/10 bg-saffron-500/5 p-4 space-y-3">
            <span className="text-[10px] text-saffron-500 uppercase font-bold block">Central Ledger Equation</span>
            <div className="bg-bg-secondary p-3.5 rounded-lg border border-border-primary/60 font-mono text-xs text-text-primary text-center font-bold">
              Closing Stock = Opening Stock + Inbound Cargo - Customer Sales - Written-off Waste
            </div>
            <p className="text-xs text-text-secondary leading-relaxed font-semibold">
              This mathematical constraint guarantees that every single item transaction (Sale, Purchase, Return, Damage, Expiry, or Manual Adjustments) balances perfectly. Any deviation highlights physical shrinkage.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'reporting',
      tabTitle: '6. Reports & Dashboards',
      slideTitle: 'Operational & Financial Reports Matrix',
      subtitle: 'Standard spreadsheet summaries designed to evaluate daily store margins.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-center font-bold">
            <div className="rounded-xl border border-border-primary bg-bg-secondary/40 p-3.5 space-y-1">
              <span className="text-[9px] text-text-secondary uppercase">Valuation Ledger</span>
              <p className="text-text-primary text-[11px]">Retail vs Cost Asset Value</p>
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-secondary/40 p-3.5 space-y-1">
              <span className="text-[9px] text-text-secondary uppercase">Sales Ledger</span>
              <p className="text-text-primary text-[11px]">Shift Ticket Invoiced Qty</p>
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-secondary/40 p-3.5 space-y-1">
              <span className="text-[9px] text-text-secondary uppercase">Reconciliation Ledger</span>
              <p className="text-text-primary text-[11px]">Variance Adjustment Audit</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary font-medium leading-relaxed">
            Report spreadsheets compile opening stock, closing stock, sales count, returned count, and damages value. Management can download CSVs or print PDFs instantly.
          </p>
        </div>
      )
    },
    {
      id: 'alerts',
      tabTitle: '7. Low Stock Alerts',
      slideTitle: 'Automated Threshold Warning System',
      subtitle: 'Safety alerts to ensure adequate stock levels during high-demand festival hours.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="rounded-xl border border-border-primary p-4 space-y-2">
              <span className="text-[10px] text-red-500 uppercase font-bold block">Safety limits Alerts</span>
              <p className="text-text-secondary leading-relaxed">
                Highlights products whose stocks fall below minimum limits, suggesting reorder quantities and estimated stockout days.
              </p>
            </div>
            <div className="rounded-xl border border-border-primary p-4 space-y-2">
              <span className="text-[10px] text-amber-500 uppercase font-bold block">Variance Audit alerts</span>
              <p className="text-text-secondary leading-relaxed">
                Displays discrepancy status directly on the stock reconciliation sheet, preventing shift closing if adjustments are unapproved.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'reconciliation',
      tabTitle: '8. Stock Reconciliation',
      slideTitle: 'Reconciliation Workflow: Investigate, Approve, Adjust',
      subtitle: 'An auditing control loop designed for daily shop EOD closing.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center font-bold">
            <div className="rounded-xl border border-border-primary p-3.5 bg-red-500/5 border-red-500/20 text-red-600 dark:text-red-400">
              <span className="block text-[9px] uppercase">Stage 1</span>
              <p className="text-[11px] mt-1">1. Investigate Mismatch</p>
            </div>
            <div className="rounded-xl border border-border-primary p-3.5 bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400">
              <span className="block text-[9px] uppercase">Stage 2</span>
              <p className="text-[11px] mt-1">2. Approve Audit</p>
            </div>
            <div className="rounded-xl border border-border-primary p-3.5 bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <span className="block text-[9px] uppercase">Stage 3</span>
              <p className="text-[11px] mt-1">3. Adjust Stock Ledger</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary font-medium leading-relaxed">
            Staff enter actual physical counts, and the system highlights variances. Mismatches are flagged to **Investigate** (check bins), marked **Approved** by the manager, and **Adjusted** to update the database counts.
          </p>
        </div>
      )
    },
    {
      id: 'roadmap',
      tabTitle: '9. Setup Roadmap',
      slideTitle: 'Implementation Rollout Presentation Plan',
      subtitle: 'A phased weekly timeline for digitizing Bangalore central shop floor operations.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center font-bold">
            <div className="rounded-xl border border-border-primary bg-bg-secondary p-3 space-y-1">
              <span className="text-[9px] text-text-secondary uppercase">Week 1: Physical Setup</span>
              <p className="text-text-primary text-[11px]">Storage Bins Layout</p>
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-secondary p-3 space-y-1">
              <span className="text-[9px] text-text-secondary uppercase">Week 2: Digitization</span>
              <p className="text-text-primary text-[11px]">Upload SKUs & Baseline</p>
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-secondary p-3 space-y-1">
              <span className="text-[9px] text-text-secondary uppercase">Week 3-4: Go-Live</span>
              <p className="text-text-primary text-[11px]">Staff Training & Auditing</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'impact',
      tabTitle: '10. Business Impact',
      slideTitle: 'Expected Business Outcomes & Value',
      subtitle: 'The projected growth and waste-reduction margins for Bangalore central store Hub.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Accuracy Card */}
            <div className="rounded-xl border border-border-primary bg-bg-secondary/30 p-3 space-y-2 text-center font-medium">
              <span className="text-[9px] text-text-secondary uppercase tracking-wider font-bold block">Inventory Accuracy</span>
              <div className="flex justify-center items-center space-x-1.5 py-1">
                <span className="text-xs font-mono line-through text-red-500 font-semibold">70%</span>
                <span className="text-xs text-text-secondary">➔</span>
                <span className="text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400">99%</span>
              </div>
              <span className="inline-flex items-center rounded bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                +29% Boost
              </span>
            </div>

            {/* Mismatches Card */}
            <div className="rounded-xl border border-border-primary bg-bg-secondary/30 p-3 space-y-2 text-center font-medium">
              <span className="text-[9px] text-text-secondary uppercase tracking-wider font-bold block">Stock Mismatches</span>
              <div className="flex justify-center items-center space-x-1.5 py-1">
                <span className="text-xs line-through text-red-500 font-semibold">High</span>
                <span className="text-xs text-text-secondary">➔</span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-semibold">Near Zero</span>
              </div>
              <span className="inline-flex items-center rounded bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                System Audited
              </span>
            </div>

            {/* Manual Errors Card */}
            <div className="rounded-xl border border-border-primary bg-bg-secondary/30 p-3 space-y-2 text-center font-medium">
              <span className="text-[9px] text-text-secondary uppercase tracking-wider font-bold block">Manual Errors</span>
              <div className="flex justify-center items-center space-x-1.5 py-1">
                <span className="text-xs line-through text-text-secondary font-semibold">Baseline</span>
                <span className="text-xs text-text-secondary">➔</span>
                <span className="text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400">-80%</span>
              </div>
              <span className="inline-flex items-center rounded bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                80% Drop
              </span>
            </div>

            {/* Stock-out Risk Card */}
            <div className="rounded-xl border border-border-primary bg-bg-secondary/30 p-3 space-y-2 text-center font-medium">
              <span className="text-[9px] text-text-secondary uppercase tracking-wider font-bold block">Stock-out Risk</span>
              <div className="flex justify-center items-center space-x-1.5 py-1">
                <span className="text-xs line-through text-text-secondary font-semibold">High Risk</span>
                <span className="text-xs text-text-secondary">➔</span>
                <span className="text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400">-60%</span>
              </div>
              <span className="inline-flex items-center rounded bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                60% Safe
              </span>
            </div>

            {/* Reporting Time Card */}
            <div className="rounded-xl border border-border-primary bg-bg-secondary/30 p-3 space-y-2 text-center font-medium">
              <span className="text-[9px] text-text-secondary uppercase tracking-wider font-bold block">Reporting Time</span>
              <div className="flex justify-center items-center space-x-1.5 py-1">
                <span className="text-xs font-mono line-through text-red-500 font-semibold">30 Min</span>
                <span className="text-xs text-text-secondary">➔</span>
                <span className="text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400">5 Min</span>
              </div>
              <span className="inline-flex items-center rounded bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                -25 Mins EOD
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-border-primary bg-bg-secondary/50 p-4 text-xs text-text-secondary font-semibold leading-relaxed">
            <strong>Measurable Business Outcomes:</strong> Deploying the central inventory register replaces manual shop workflows with digital validation trails, significantly mitigating loss values and improving staff efficiency.
          </div>
        </div>
      )
    },
    {
      id: 'automation',
      tabTitle: '11. Future AI Automation',
      slideTitle: 'Future AI Automation & Enterprise Scales',
      subtitle: 'Scaling inventory operations using automated models and sensor integrations.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-border-primary p-4 space-y-2">
              <span className="text-[10px] text-saffron-500 uppercase font-bold block flex items-center space-x-1">
                <Bot className="h-4 w-4" />
                <span>Predictive Procurement</span>
              </span>
              <p className="text-text-secondary leading-relaxed">
                Analyze weekly purchase velocities to automate vendor PO dispatch when stock levels reach minimum limits.
              </p>
            </div>
            <div className="rounded-xl border border-border-primary p-4 space-y-2">
              <span className="text-[10px] text-saffron-500 uppercase font-bold block flex items-center space-x-1">
                <Layers className="h-4 w-4" />
                <span>Sensor Bin Auditing</span>
              </span>
              <p className="text-text-secondary leading-relaxed">
                Deploy smart bin sensor modules using weight or camera checks to automate stock counts.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-text-primary">Assignment Presentation</h1>
          <p className="text-xs text-text-secondary">Project Overview Slide Deck. Structured for interview presentations and executive design pitches.</p>
        </div>

        {/* Slide Deck presentation layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Outline slide tabs */}
          <div className="lg:col-span-1 rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm space-y-1">
            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block mb-2 px-1">Slide Outline</span>
            {slides.map(slide => (
              <button
                key={slide.id}
                onClick={() => setActiveSlideId(slide.id)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-left flex justify-between items-center transition-all ${
                  slide.id === activeSlideId
                    ? 'border-saffron-400 bg-saffron-50 dark:bg-saffron-100/10 text-saffron-600 dark:text-saffron-400 font-bold shadow-saffron shadow-xs'
                    : 'border-border-primary bg-bg-primary text-text-secondary hover:bg-bg-secondary hover:text-text-primary font-semibold'
                }`}
              >
                <span className="text-[11px] truncate">{slide.tabTitle}</span>
              </button>
            ))}
          </div>

          {/* Active slide card panel */}
          <div className="lg:col-span-3 rounded-xl border border-border-primary bg-bg-primary p-6 shadow-sm space-y-5 h-[410px] flex flex-col justify-between">
            <div className="space-y-4">
              {/* Slide Header */}
              <div className="pb-3 border-b border-border-primary/80">
                <span className="text-[9px] text-saffron-500 font-bold uppercase tracking-wider">Executive Presentation Slide</span>
                <h2 className="text-base font-bold text-text-primary mt-1">{activeSlide.slideTitle}</h2>
                <p className="text-xs text-text-secondary mt-1 leading-snug">{activeSlide.subtitle}</p>
              </div>

              {/* Dynamic content rendering */}
              <div className="py-1">
                {activeSlide.content}
              </div>
            </div>

            {/* Slide Footer */}
            <div className="flex items-center justify-between text-[10px] text-text-secondary border-t border-border-primary pt-3">
              <span>Divine Hindu Retail Operations • Case Study Pitch</span>
              <span>Slide {slides.indexOf(activeSlide) + 1} of {slides.length}</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
