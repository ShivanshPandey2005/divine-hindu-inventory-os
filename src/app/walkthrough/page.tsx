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
  ChevronRight
} from 'lucide-react';

interface SlideContent {
  id: string;
  tabTitle: string;
  slideTitle: string;
  subtitle: string;
  content: React.ReactNode;
}

export default function ProjectWalkthrough() {
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
            <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4 space-y-2">
              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">Leakage Pillar 1</span>
              <h4 className="text-xs font-bold text-text-primary">Stock Count Discrepancies</h4>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Differences between paper logs and actual shelf stocks go unchecked, causing audit errors at the end of the day.
              </p>
            </div>
            <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4 space-y-2">
              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">Leakage Pillar 2</span>
              <h4 className="text-xs font-bold text-text-primary">Out-of-Stock Lost Sales</h4>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Fast-moving items deplete below safety thresholds without warnings, causing store out-of-stocks during high-demand festival hours.
              </p>
            </div>
            <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4 space-y-2">
              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">Leakage Pillar 3</span>
              <h4 className="text-xs font-bold text-text-primary">Untracked Waste & Return Values</h4>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Returned orders sit in boxes without inspections. Damaged and expired items are not cataloged, causing unaccounted loss.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 text-xs leading-relaxed text-text-secondary font-medium">
            <strong>Executive Summary:</strong> The newly launched store requires a centralized digital back-office system to connect Receiving cargo, checkout Sales billing, EOD Stock Take, and QA returns into one live ledger.
          </div>
        </div>
      )
    },
    {
      id: 'challenges',
      tabTitle: '2. Operations Challenges',
      slideTitle: 'Operational Obstacles on the Shop Floor',
      subtitle: 'Understanding real-world constraints when deploying systems for non-technical retail workers.',
      content: (
        <div className="space-y-4">
          <div className="space-y-3.5">
            <div className="flex items-start space-x-3 text-xs">
              <div className="h-6.5 w-6.5 rounded bg-bg-secondary text-saffron-500 flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <strong className="text-text-primary block">Staff Compliance Hurdles</strong>
                <p className="text-text-secondary mt-0.5 leading-relaxed">
                  Store employees struggle with complex ERP systems. The back-office needs simple visual forms, not SaaS telemetry panels.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-xs">
              <div className="h-6.5 w-6.5 rounded bg-bg-secondary text-saffron-500 flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <strong className="text-text-primary block">Reconciliation Workflows Bottlenecks</strong>
                <p className="text-text-secondary mt-0.5 leading-relaxed">
                  Adjusting stock is typically manual, prone to errors, and lacks audits. A simple, structured "Stock Take sheet" is required.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-xs">
              <div className="h-6.5 w-6.5 rounded bg-bg-secondary text-saffron-500 flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <strong className="text-text-primary block">Action Tracking Lag</strong>
                <p className="text-text-secondary mt-0.5 leading-relaxed">
                  Managers cannot instantly see which actions require approval (such as write-offs or count mismatches) without looking through piles of papers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'architecture',
      tabTitle: '3. Solution Architecture',
      slideTitle: 'Solution Architecture: Modular Local Engine',
      subtitle: 'The frontend block structure and client-side database layer designed for zero-config deployment.',
      content: (
        <div className="space-y-4">
          {/* Architecture diagram cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 space-y-1 text-center">
              <span className="text-[10px] text-saffron-500 uppercase block font-bold">1. UI Layout Layer</span>
              <p className="text-text-primary mt-1">Next.js App Router</p>
              <span className="text-[10px] text-text-secondary block mt-1">Responsive pages and dialog modal forms styled with Tailwind v4.</span>
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 space-y-1 text-center">
              <span className="text-[10px] text-saffron-500 uppercase block font-bold">2. State Logic Engine</span>
              <p className="text-text-primary mt-1">React Context Hook</p>
              <span className="text-[10px] text-text-secondary block mt-1">Central state machine handling stock adjustments and workflows.</span>
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 space-y-1 text-center">
              <span className="text-[10px] text-saffron-500 uppercase block font-bold">3. Database Simulation</span>
              <p className="text-text-primary mt-1">Browser LocalStorage</p>
              <span className="text-[10px] text-text-secondary block mt-1">Zero-config, client-side persistence for seamless demos.</span>
            </div>
          </div>
          
          <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>Design Outcome: Fast load times, offline capability, and 100% test-ready local build validation.</span>
          </div>
        </div>
      )
    },
    {
      id: 'workflow',
      tabTitle: '4. Inventory Workflow',
      slideTitle: 'D2C Inventory Lifecycle Flow',
      subtitle: 'The operational process mapping connecting suppliers to end customers and closing audits.',
      content: (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs font-bold text-text-primary py-2 overflow-x-auto">
            <div className="rounded-lg border border-border-primary bg-bg-secondary/40 px-3 py-2 text-center flex-1">
              Supplier Sourcing
            </div>
            <ArrowRight className="h-4.5 w-4.5 text-saffron-500 rotate-90 md:rotate-0" />
            <div className="rounded-lg border border-border-primary bg-bg-secondary/40 px-3 py-2 text-center flex-1">
              Receiving Check-in
            </div>
            <ArrowRight className="h-4.5 w-4.5 text-saffron-500 rotate-90 md:rotate-0" />
            <div className="rounded-lg border border-border-primary bg-bg-secondary/40 px-3 py-2 text-center flex-1">
              POS checkout Sale
            </div>
            <ArrowRight className="h-4.5 w-4.5 text-saffron-500 rotate-90 md:rotate-0" />
            <div className="rounded-lg border border-border-primary bg-bg-secondary/40 px-3 py-2 text-center flex-1">
              Returns & QA
            </div>
            <ArrowRight className="h-4.5 w-4.5 text-saffron-500 rotate-90 md:rotate-0" />
            <div className="rounded-lg border border-border-primary bg-bg-secondary/40 px-3 py-2 text-center flex-1">
              Stock Take Audit
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed max-w-2xl font-medium">
            This flow ensures a clean audit trail. Stock is incremented upon receiving from vendors, decremented at register sales, binned to quarantine if returned/damaged, and reconciled at shift close.
          </p>
        </div>
      )
    },
    {
      id: 'reporting',
      tabTitle: '5. Reporting Framework',
      slideTitle: 'Daily Store Closing Reporting Matrix',
      subtitle: 'The calculation structures compiling shift performance logs and assets values.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
            <div className="rounded-xl border border-border-primary p-4 space-y-2">
              <span className="text-[10px] text-saffron-500 uppercase font-bold">Ledger Balance Formula</span>
              <div className="bg-bg-secondary p-3 rounded-lg font-mono text-[11px] text-text-primary text-center">
                Closing Stock = Opening + Inbound - Outbound - Waste
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed pt-1">
                Ensures all discrepancies are accounted for as adjustments during EOD Stock Take.
              </p>
            </div>
            <div className="rounded-xl border border-border-primary p-4 space-y-2">
              <span className="text-[10px] text-saffron-500 uppercase font-bold">Asset Valuation Matrix</span>
              <div className="bg-bg-secondary p-3 rounded-lg font-mono text-[11px] text-text-primary text-center">
                Cost Basis vs Retail Assets Value
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed pt-1">
                Displays both purchase cost and retail price value, highlighting store gross margins.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'alerts',
      tabTitle: '6. Alert Mechanism',
      slideTitle: 'Automated Threshold Alert System',
      subtitle: 'Safety limit notifications designed to avoid store out-of-stocks.',
      content: (
        <div className="space-y-4">
          <ul className="space-y-3.5 text-xs text-text-secondary leading-relaxed font-medium">
            <li className="flex items-start space-x-2">
              <span className="h-5 w-5 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">!</span>
              <div>
                <strong className="text-text-primary block">Safety Limit Alerts</strong>
                <p className="mt-0.5">Triggers warnings when active quantities drop below minimum safety stock levels.</p>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="h-5 w-5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">!</span>
              <div>
                <strong className="text-text-primary block">Stock Take Discrepancy Warnings</strong>
                <p className="mt-0.5">Highlights discrepancies on the Stock Take page in green, amber, or red to guide quick manager verification.</p>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">!</span>
              <div>
                <strong className="text-text-primary block">Urgent Action Board</strong>
                <p className="mt-0.5">Displays critical warnings directly on the founder dashboard as actionable blocks.</p>
              </div>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'roadmap',
      tabTitle: '7. Scalability Roadmap',
      slideTitle: 'Technical Integration & Scalability Roadmap',
      subtitle: 'Future phases to scale this store tool to multi-warehouse enterprise scales.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold text-center">
            <div className="rounded-xl border border-border-primary bg-bg-secondary p-3 space-y-1.5">
              <span className="text-[10px] text-text-secondary uppercase">Step 1: DB Sync</span>
              <p className="text-text-primary">Postgres Database</p>
              <span className="text-[9px] text-text-secondary block">Replace localStorage with a persistent SQL server.</span>
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-secondary p-3 space-y-1.5">
              <span className="text-[10px] text-text-secondary uppercase">Step 2: Scanners</span>
              <p className="text-text-primary">Barcode APIs</p>
              <span className="text-[9px] text-text-secondary block">Integrate physical scanners for POS checkouts and receiving.</span>
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-secondary p-3 space-y-1.5">
              <span className="text-[10px] text-text-secondary uppercase">Step 3: Sensors</span>
              <p className="text-text-primary">RFID Bin Counts</p>
              <span className="text-[9px] text-text-secondary block">Deploy smart shelf sensors to automate stocktake counts.</span>
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-secondary p-3 space-y-1.5">
              <span className="text-[10px] text-text-secondary uppercase">Step 4: Enterprise</span>
              <p className="text-text-primary">ERP integrations</p>
              <span className="text-[9px] text-text-secondary block">Sync sales numbers and reorders with global ERP systems.</span>
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
          <h1 className="text-xl font-bold text-text-primary">Project Technical Walkthrough</h1>
          <p className="text-xs text-text-secondary">Consulting-style presentation of system design architecture, workflows, and future scaling plans.</p>
        </div>

        {/* Presentation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Slide list outline */}
          <div className="lg:col-span-1 rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm space-y-1.5">
            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block mb-2 px-1">Presentation Outline</span>
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
                <span className="text-[11px]">{slide.tabTitle}</span>
              </button>
            ))}
          </div>

          {/* Active slide card presentation */}
          <div className="lg:col-span-3 rounded-xl border border-border-primary bg-bg-primary p-6 shadow-sm space-y-5 h-[375px] flex flex-col justify-between">
            <div className="space-y-4">
              {/* Slide header */}
              <div className="pb-3 border-b border-border-primary/80">
                <span className="text-[9px] text-saffron-500 font-bold uppercase tracking-wider">System Design & Core Architecture</span>
                <h2 className="text-base font-bold text-text-primary mt-1">{activeSlide.slideTitle}</h2>
                <p className="text-xs text-text-secondary mt-1 leading-snug">{activeSlide.subtitle}</p>
              </div>

              {/* Slide dynamic content */}
              <div className="py-1">
                {activeSlide.content}
              </div>
            </div>

            {/* Slide footer summary */}
            <div className="flex items-center justify-between text-[10px] text-text-secondary border-t border-border-primary pt-3">
              <span>Divine Hindu Retail Ops • Interview Presentation deck</span>
              <span>Slide {slides.indexOf(activeSlide) + 1} of {slides.length}</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
