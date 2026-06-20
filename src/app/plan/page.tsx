'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import {
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  FileCheck,
  Calendar,
  User,
  Activity,
  Layers,
  ArrowRight,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

interface SlideContent {
  id: string;
  tabTitle: string;
  slideTitle: string;
  timeline: string;
  owner: string;
  expectedOutcome: string;
  highlights: string[];
  tasks: string[];
}

export default function StoreSetupPlan() {
  const [activeSlideId, setActiveSlideId] = useState('overview');
  const [taskStatus, setTaskStatus] = useState<{ [key: string]: boolean }>({});

  const slides: SlideContent[] = [
    {
      id: 'overview',
      tabTitle: 'Executive Overview',
      slideTitle: 'Current Challenges & Proposed Solution',
      timeline: 'Continuous',
      owner: 'Store Founder / Ops Manager',
      expectedOutcome: 'Modernize back-office operations, plug stock count shrinkages, and improve store accuracy.',
      highlights: [
        '**Challenge 1: Manual Stock Auditing**: Count mismatches frequently go undetected during shift EOD, leading to ledger discrepancies.',
        '**Challenge 2: Safety Stock Depletion**: Lack of safety limits results in stockouts of high-velocity puja items.',
        '**Challenge 3: Untracked Return Losses**: Damaged inventory and expired wellness oils are not cataloged, leaking capital.',
        '**Solution Architecture**: A unified digital ledger linking receiving shipments, sales registering, and daily stock take audits.'
      ],
      tasks: [
        'Setup live database state trackers',
        'Map SKU master catalog variables',
        'Implement automated safety limit triggers',
        'Roll out simplified staff back-office forms'
      ]
    },
    {
      id: 'phase1',
      tabTitle: 'Phase 1: Store Setup',
      slideTitle: 'Phase 1: Initial Store Physical Alignment',
      timeline: 'Week 1',
      owner: 'Store Manager',
      expectedOutcome: 'Warehouse shelves are structured with barcode categories and bin locations.',
      highlights: [
        'Organize products into 6 distinct categories.',
        'Apply label stickers on shelves and storage bins.',
        'Establish physical Quarantine Area for returned/damaged items.',
        'Verify vendor contacts and safety stock margins.'
      ],
      tasks: [
        'Sort inventory bins by category',
        'Sticker safety minimum stock tags on shelves',
        'Establish designated Quarantine Area',
        'Define primary supplier contacts'
      ]
    },
    {
      id: 'phase2',
      tabTitle: 'Phase 2: Digitization',
      slideTitle: 'Phase 2: Master SKU Catalog Digitization',
      timeline: 'Week 2',
      owner: 'Data Clerk / Ops Staff',
      expectedOutcome: '100+ unique Divine Hindu product SKUs verified in the digital database.',
      highlights: [
        'Input SKU codes, names, cost prices, selling prices, and vendors.',
        'Execute initial stock intakes to establish the system baseline.',
        'Audit database numbers against physical box counts.',
        'Initiate the master data catalog verification.'
      ],
      tasks: [
        'Upload all product SKUs into system catalog',
        'Input wholesale cost prices and retail selling prices',
        'Audit initial stock entries against physical records',
        'Sign-off on baseline inventory assets valuation'
      ]
    },
    {
      id: 'phase3',
      tabTitle: 'Phase 3: Operations',
      slideTitle: 'Phase 3: Launch Daily Operations',
      timeline: 'Week 3',
      owner: 'Store Sales Staff',
      expectedOutcome: 'Shift staff execute receiving and sales logging forms with zero compliance gaps.',
      highlights: [
        'Train cash register staff on "Log Customer Sale" checkout billing.',
        'Train receiving staff on "Receive Shipment" vendor check-ins.',
        'Establish step-by-step SOP compliance checks.',
        'Ensure all inventory movements log reference numbers.'
      ],
      tasks: [
        'Conduct staff training on Inbound Receiving screen',
        'Train cashier team on POS checkout cart register',
        'Post laminated SOP guides at shipping bay and register',
        'Ensure all movements are logged with invoice/challan references'
      ]
    },
    {
      id: 'phase4',
      tabTitle: 'Phase 4: Audits',
      slideTitle: 'Phase 4: Reporting & Stock Reconciliation',
      timeline: 'Week 4',
      owner: 'Operations Manager',
      expectedOutcome: 'Complete shift closing audits daily. Maintain database accuracy index >99%.',
      highlights: [
        'Initiate Stock Take count audits during daily shift closing.',
        'Review variance metrics and investigate count mismatches.',
        'Log EOD remarks and get manager approval to adjust system stock.',
        'Download Weekly/Monthly reports to evaluate performance.'
      ],
      tasks: [
        'Establish EOD daily stock take auditing schedule',
        'Review and investigate active mismatch warnings',
        'Approve and adjust system counts via stocktake module',
        'Audit weekly store margin report spreadsheets'
      ]
    },
    {
      id: 'phase5',
      tabTitle: 'Phase 5: Automation',
      slideTitle: 'Phase 5: Future Scalability & Automation',
      timeline: 'Month 2+',
      owner: 'Founders / Tech Consultant',
      expectedOutcome: 'Integrate automated procurement triggers and barcode scanner APIs.',
      highlights: [
        'Establish automated purchase order triggers to suppliers when stock falls below safety limits.',
        'Integrate USB/Bluetooth barcode scanning for receiving and POS cash registers.',
        'Deploy RFID bin sensors to automate stocktake counts.',
        'Integrate retail store sales ledger with standard ERP backend APIs.'
      ],
      tasks: [
        'Define automated PO triggers threshold settings',
        'Configure barcode scanner API compatibility',
        'Evaluate warehouse RFID bin tags costs',
        'Draft software spec requirements for ERP API sync'
      ]
    }
  ];

  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];

  const toggleTask = (slideId: string, index: number) => {
    const key = `${slideId}_${index}`;
    setTaskStatus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getSlideProgress = (slide: SlideContent) => {
    const total = slide.tasks.length;
    const completed = slide.tasks.filter((_, idx) => taskStatus[`${slide.id}_${idx}`]).length;
    return Math.round((completed / total) * 100);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-text-primary">Implementation Setup Plan</h1>
          <p className="text-xs text-text-secondary">Operations Rollout Plan. McKinsey-style consulting presentation detailing timelines, owners, and workflows.</p>
        </div>

        {/* Consulting Slide Deck layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Left menu (Deck slides outline) */}
          <div className="lg:col-span-1 rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm space-y-1.5">
            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block mb-2 px-1">Presentation Slides</span>
            {slides.map(slide => {
              const progress = getSlideProgress(slide);
              const isSelected = slide.id === activeSlideId;

              return (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlideId(slide.id)}
                  className={`w-full px-3 py-2.5 rounded-lg border text-left flex justify-between items-center transition-all ${
                    isSelected
                      ? 'border-saffron-400 bg-saffron-50 dark:bg-saffron-100/10 text-saffron-600 dark:text-saffron-400 font-bold shadow-saffron shadow-xs'
                      : 'border-border-primary bg-bg-primary text-text-secondary hover:bg-bg-secondary hover:text-text-primary font-semibold'
                  }`}
                >
                  <span className="text-[11px] truncate">{slide.tabTitle}</span>
                  {progress > 0 && (
                    <span className="text-[9px] font-mono font-bold text-saffron-500 bg-saffron-50 dark:bg-saffron-900/20 px-1.5 py-0.5 rounded-full">
                      {progress}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right menu (Active slide presentation deck) */}
          <div className="lg:col-span-3 rounded-xl border border-border-primary bg-bg-primary p-6 shadow-sm space-y-6">
            
            {/* Slide Header: Consulting Deck title with owner metadata */}
            <div className="pb-4 border-b border-border-primary/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] text-saffron-500 font-bold uppercase tracking-wider">Divine Hindu Setup Roadmap</span>
                <h2 className="text-base font-bold text-text-primary mt-1">{activeSlide.slideTitle}</h2>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] font-bold text-text-secondary">
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-bg-secondary border border-border-primary/50">
                  <Calendar className="h-3.5 w-3.5 text-saffron-400" />
                  <span>Timeline: {activeSlide.timeline}</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-bg-secondary border border-border-primary/50">
                  <User className="h-3.5 w-3.5 text-saffron-400" />
                  <span>Owner: {activeSlide.owner}</span>
                </span>
              </div>
            </div>

            {/* Slide Body: Three sections (Overview highlights, Task checklist, Outcome) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Highlights & Bullet points */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-wider flex items-center space-x-1">
                  <Layers className="h-4 w-4 text-saffron-500" />
                  <span>Phase Highlights</span>
                </h4>
                <ul className="space-y-3.5 text-xs text-text-secondary leading-relaxed list-none">
                  {activeSlide.highlights.map((hl, idx) => {
                    const cleanHl = hl.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return (
                      <li key={idx} className="flex items-start space-x-2">
                        <ChevronRight className="h-4 w-4 text-saffron-400 shrink-0 mt-0.5" />
                        <span dangerouslySetInnerHTML={{ __html: cleanHl }} />
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Tasks checklist with interactive progress updates */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-wider flex items-center space-x-1">
                  <ClipboardList className="h-4 w-4 text-saffron-500" />
                  <span>Phase Checklist Tasks</span>
                </h4>

                <div className="space-y-2.5">
                  {activeSlide.tasks.map((task, idx) => {
                    const isChecked = !!taskStatus[`${activeSlide.id}_${idx}`];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleTask(activeSlide.id, idx)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs font-semibold flex items-center space-x-2.5 transition-all ${
                          isChecked
                            ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                            : 'border-border-primary bg-bg-secondary text-text-secondary hover:border-saffron-300 hover:text-saffron-500'
                        }`}
                      >
                        <FileCheck className={`h-4 w-4 shrink-0 ${isChecked ? 'text-emerald-500' : 'text-text-secondary'}`} />
                        <span className={isChecked ? 'line-through opacity-80' : ''}>{task}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Slide Footer: Expected Outcome Banner */}
            <div className="rounded-xl border border-border-primary bg-bg-secondary/40 p-4 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Expected Outcome Milestone</span>
              <p className="text-text-primary leading-relaxed">{activeSlide.expectedOutcome}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
