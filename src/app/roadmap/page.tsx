'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import {
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  User,
  CheckCircle2,
  Clock,
  ClipboardList
} from 'lucide-react';

interface Phase {
  phaseNum: number;
  title: string;
  timeline: string;
  owner: string;
  objective: string;
  tasks: string[];
  expectedOutcome: string;
}

export default function ImplementationRoadmap() {
  const [activePhaseNum, setActivePhaseNum] = useState(1);

  const phases: Phase[] = [
    {
      phaseNum: 1,
      title: 'Store Setup & Storage Bins Layout',
      timeline: 'Week 1',
      owner: 'Store Manager',
      objective: 'Clean physical storage organization and label tags allocation on warehouse rows.',
      tasks: [
        'Organize warehouse rows by product collection category',
        'Sticker safety stock minimum limit tags on storage racks',
        'Establish physical Quarantine Zone for customer returns cargo',
        'Verify vendor primary contact directories'
      ],
      expectedOutcome: 'A clean physical warehouse floor layout where item categories are binned and easily counted.'
    },
    {
      phaseNum: 2,
      title: 'SKU Code Creation & Standard Classification',
      timeline: 'Week 1-2',
      owner: 'Inventory Auditor',
      objective: 'Set up standardized naming variables, SKU identifiers, and cost price databases.',
      tasks: [
        'Standardize SKU codes formatting (e.g. INC-SAN-100)',
        'Classify all catalog items into 6 primary Hindu spiritual collections',
        'Audit vendor cost price sheets against retail selling markup prices',
        'Upload base inventory spreadsheets into digitized format'
      ],
      expectedOutcome: 'A verified master data list containing correct SKU cost margins, vendor directories, and safety levels.'
    },
    {
      phaseNum: 3,
      title: 'Baseline Inventory Digitization',
      timeline: 'Week 2',
      owner: 'Data Operations Clerk',
      objective: 'Check-in physical baseline quantities into the digital back-office database.',
      tasks: [
        'Conduct baseline count of active storage items',
        'Intake baseline counts into App Catalog database',
        'Register initial Purchase logs to verify ledger transactions logic',
        'Cross-reference physical counts against system initial numbers'
      ],
      expectedOutcome: 'System Expected Stock counts match physical shelf quantities with zero mismatch discrepancies.'
    },
    {
      phaseNum: 4,
      title: 'SOP Guidelines & Staff Training',
      timeline: 'Week 3',
      owner: 'Senior Operations Lead',
      objective: 'Train cashiers and inbound workers on simplified operational forms and process guidelines.',
      tasks: [
        'Train cashier cashiers on "Log Customer Sale" billing register',
        'Train receiving staff on "Receive Shipment" cargo check-ins',
        'Publish laminated visual SOP checklists at register and receiving bay',
        'Validate compliance steps on test checkout order transactions'
      ],
      expectedOutcome: 'Retail floor staff operate simplified forms with zero error rates during checkouts and check-ins.'
    },
    {
      phaseNum: 5,
      title: 'Go-Live Launch Operations',
      timeline: 'Week 4',
      owner: 'Store Manager',
      objective: 'Deploy central digital registry live for all check-in and checkout operations.',
      tasks: [
        'Deduct stock instantly upon customer walk-in checkout checkouts',
        'Increment stock instantly upon vendor shipment cargo receiving',
        'Quarantine return items directly in Returns log pending quality checks',
        'Trigger automatic alerts when stocks drop below safety thresholds'
      ],
      expectedOutcome: 'System central ledger reflects live stock quantities with transaction logs generated in real-time.'
    },
    {
      phaseNum: 6,
      title: 'Daily Closing Reconciliation & Reports',
      timeline: 'Week 4+',
      owner: 'Founder / Operations Lead',
      objective: 'Audit daily closing logs and publish EOD spreadsheet reports for founders.',
      tasks: [
        'Initiate daily closing reconciliation audits during EOD closing',
        'Flag variance discrepancies and move items through Investigate -> Adjust flow',
        'Verify EOD stock accuracy % and review damaged write-off metrics',
        'Download weekly/monthly spreadsheet performance analytics'
      ],
      expectedOutcome: 'Founders have direct visibility of capital locked in inventory, weekly revenues, and system accuracy indexes.'
    }
  ];

  const activePhase = phases.find(p => p.phaseNum === activePhaseNum) || phases[0];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-text-primary">Inventory Implementation Roadmap</h1>
          <p className="text-xs text-text-secondary">Consulting Rollout Plan. Step-by-step 6-phase deployment timeline for the Bangalore Store launch.</p>
        </div>

        {/* Presentation Slides grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Phase index timeline cards */}
          <div className="lg:col-span-1 rounded-xl border border-border-primary bg-bg-primary p-4 shadow-sm space-y-2">
            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block mb-2 px-1">Rollout Timeline</span>
            {phases.map(phase => {
              const isActive = phase.phaseNum === activePhaseNum;
              return (
                <button
                  key={phase.phaseNum}
                  onClick={() => setActivePhaseNum(phase.phaseNum)}
                  className={`w-full px-3.5 py-3 rounded-lg border text-left flex justify-between items-center transition-all ${
                    isActive
                      ? 'border-saffron-400 bg-saffron-50 dark:bg-saffron-100/10 text-saffron-600 dark:text-saffron-400 font-bold shadow-saffron shadow-xs'
                      : 'border-border-primary bg-bg-primary text-text-secondary hover:bg-bg-secondary hover:text-text-primary font-semibold'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-text-secondary block">Phase 0{phase.phaseNum}</span>
                    <span className="text-[11px] truncate block">{phase.title.split(' ')[0] + ' ' + (phase.title.split(' ')[1] || '')}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-bg-secondary px-2 py-0.5 rounded border border-border-primary/45 shrink-0">
                    {phase.timeline}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Phase Consulting Slide */}
          <div className="lg:col-span-3 rounded-xl border border-border-primary bg-bg-primary p-6 shadow-sm space-y-6 h-[440px] flex flex-col justify-between">
            <div className="space-y-4">
              {/* Slide Header */}
              <div className="pb-3 border-b border-border-primary flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[9px] text-saffron-500 font-bold uppercase tracking-wider">Strategic Rollout Roadmap</span>
                  <h2 className="text-base font-bold text-text-primary mt-1">Phase 0{activePhase.phaseNum}: {activePhase.title}</h2>
                </div>
                <div className="flex gap-2 text-[10px] font-bold text-text-secondary">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-bg-secondary border border-border-primary/50">
                    <Clock className="h-3.5 w-3.5 text-saffron-400" />
                    <span>Duration: {activePhase.timeline}</span>
                  </span>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-bg-secondary border border-border-primary/50">
                    <User className="h-3.5 w-3.5 text-saffron-400" />
                    <span>Owner: {activePhase.owner}</span>
                  </span>
                </div>
              </div>

              {/* Objectives details */}
              <div className="rounded-lg border border-saffron-200/50 bg-saffron-50/20 dark:bg-saffron-500/5 p-3.5 text-xs">
                <span className="text-[10px] font-bold text-saffron-700 dark:text-saffron-400 uppercase tracking-wider block mb-1">Phase Objective</span>
                <p className="text-text-primary leading-relaxed font-semibold">{activePhase.objective}</p>
              </div>

              {/* Tasks checklist grid */}
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Key Operational Tasks</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activePhase.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-text-secondary">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="font-semibold">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Slide Footer expected outcome */}
            <div className="rounded-xl border border-border-primary bg-bg-secondary/40 p-4 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Milestone Expected Outcome</span>
              <p className="text-text-primary leading-relaxed font-semibold">{activePhase.expectedOutcome}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
