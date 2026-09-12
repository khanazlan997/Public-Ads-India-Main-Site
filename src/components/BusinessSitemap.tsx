import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, Building2, Target, Users2, ShieldCheck, Wallet, 
  ArrowRight, ArrowDown, ChevronRight, CheckCircle2, TrendingUp,
  Layers, RefreshCw, Zap, Landmark, Smartphone, Share2, Award,
  Cpu, FileCheck, Check
} from 'lucide-react';

interface EcosystemNode {
  id: string;
  stageNumber: string;
  title: string;
  subtitle: string;
  category: string;
  icon: any;
  color: string;
  badge: string;
  description: string;
  operations: string[];
  keyOutputs: string[];
}

const ECOSYSTEM_NODES: EcosystemNode[] = [
  {
    id: 'stage-1',
    stageNumber: '01',
    title: 'Brand & Advertiser Sourcing',
    subtitle: 'Institutional Campaign Aggregation',
    category: 'Upstream Ingestion',
    icon: Building2,
    color: 'from-blue-600 to-indigo-600',
    badge: 'Demand Phase',
    description: 'Securing direct, high-value acquisition mandates with premier Indian financial institutions, broking platforms, and mobile consumer apps.',
    operations: [
      'Bespoke CPA / CPL contract structuring',
      'Target demographic & geo-targeting criteria allocation',
      'Verification milestone parameter definition (KYC, trade, deposit)',
      'High-payout yield optimization for publisher tiering'
    ],
    keyOutputs: ['Institutional Campaign Catalog', 'Payout Master Matrix', 'Verified Direct Links']
  },
  {
    id: 'stage-2',
    stageNumber: '02',
    title: 'Campaign Quality Architecture',
    subtitle: 'Terms, KPIs & Verification Rule Setup',
    category: 'Core Operations',
    icon: Target,
    color: 'from-sky-500 to-blue-600',
    badge: 'Compliance & KPIs',
    description: 'Configuring clear conversion conditions, trade instructions, screenshot proof guidelines, and dynamic tracking links.',
    operations: [
      'Conversion trigger benchmarking (First Trade vs Account Opening)',
      'Step-by-step publisher cheat sheets and WhatsApp templates',
      'Anti-fraud and proxy shielding configuration',
      'Direct link and referral routing dispatch'
    ],
    keyOutputs: ['Standard Operating Procedures', 'Campaign Playbooks', 'Approved Marketing Copy']
  },
  {
    id: 'stage-3',
    stageNumber: '03',
    title: 'Publisher Network Distribution',
    subtitle: 'Multi-Channel Traffic Activation',
    category: 'Traffic Ingestion',
    icon: Users2,
    color: 'from-indigo-600 to-purple-600',
    badge: 'Distribution',
    description: 'Distributing live campaigns to 10,000+ verified publishers, financial influencers, Telegram community leaders, and agency teams.',
    operations: [
      'Unique 4-digit publisher ID assignment and tracking',
      'Real-time dashboard campaign access',
      'Telegram, WhatsApp, and social media audience matching',
      'Agency and sub-affiliate link distribution'
    ],
    keyOutputs: ['Active Referral Links', 'Live Promotion Streams', 'Targeted Audience Touchpoints']
  },
  {
    id: 'stage-4',
    stageNumber: '04',
    title: 'End-User Conversion Execution',
    subtitle: 'KYC, Account Activation & Trades',
    category: 'Conversion Event',
    icon: Smartphone,
    color: 'from-amber-500 to-orange-600',
    badge: 'User Action',
    description: 'Referred retail clients navigate seamless digital KYC, account opening, and mandatory initial transactions.',
    operations: [
      'Instant mobile OTP & DigiLocker Aadhaar verification',
      'Client Code generation by the partner broking house',
      'Initial stock trade (e.g. ₹20 Idea share) or ₹100 SIP deposit',
      'Digital receipt and activation confirmation generation'
    ],
    keyOutputs: ['Verified Active Client Account', 'Execution Timestamp', 'Proof Screenshot']
  },
  {
    id: 'stage-5',
    stageNumber: '05',
    title: 'MIS Quality Auditing & Review',
    subtitle: 'Human & Automated Proof Verification',
    category: 'Audit & Quality',
    icon: FileCheck,
    color: 'from-emerald-600 to-teal-600',
    badge: 'Verification Desk',
    description: 'Our dedicated MIS auditing team reviews submitted client details, screenshots, and broker confirmation logs.',
    operations: [
      'Client Code and registered phone number cross-referencing',
      'Uncropped screenshot validation and timestamp inspection',
      'Status tagging (Process → Ready To Trade → Active → Payment Done)',
      'Rejection resolution and clear feedback communication'
    ],
    keyOutputs: ['Verified Submission Ledger', 'Approval Timestamps', 'Zero-Fraud Validation']
  },
  {
    id: 'stage-6',
    stageNumber: '06',
    title: 'Liquidity & Payout Settlement',
    subtitle: 'Direct UPI & Bank Account Disbursements',
    category: 'Settlement Desk',
    icon: Wallet,
    color: 'from-emerald-500 to-green-600',
    badge: 'Disbursement',
    description: 'Executing rapid, frictionless payouts directly to the publisher’s registered UPI ID or verified Bank Account.',
    operations: [
      'Automated commission balance computation',
      'Same-day and scheduled weekly disbursement processing',
      'Zero arbitrary deduction guarantee',
      'Direct transaction receipts and ledger synchronization'
    ],
    keyOutputs: ['Instant UPI Transfer Receipts', 'Settlement Confirmations', 'Earned Balance Credit']
  },
  {
    id: 'stage-7',
    stageNumber: '07',
    title: 'Growth, Scaling & VIP Loops',
    subtitle: 'Tier Progression & Institutional Expansion',
    category: 'Ecosystem Expansion',
    icon: TrendingUp,
    color: 'from-blue-600 to-rose-600',
    badge: 'Scaling Loop',
    description: 'High-performing publishers unlock exclusive private campaigns, custom payout rates, and direct co-branded assets.',
    operations: [
      'Performance milestone bonus allocations',
      'Agency tier upgrades and dedicated manager assignments',
      'Advertiser volume scale agreements',
      'Network-wide knowledge sharing webinars and summits'
    ],
    keyOutputs: ['Higher Revenue Run-rates', 'Long-term Brand Retention', 'Continuous Ecosystem Compounding']
  }
];

export default function BusinessSitemap({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [activeNode, setActiveNode] = useState<EcosystemNode>(ECOSYSTEM_NODES[0]);

  return (
    <div className="min-h-screen py-8 md:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
        <button onClick={() => onNavigate('/Home')} className="hover:text-brand-primary dark:hover:text-amber-400 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Business Sitemap & Ecosystem Architecture</span>
      </nav>

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-bold mb-4">
          <Network className="w-3.5 h-3.5" />
          <span>Interactive Business Workflow & Architecture Map</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
          Public Ads India <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">Ecosystem Diagram</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          A visual, step-by-step structural blueprint illustrating how campaigns flow from institutional brand origination to publisher distribution, proof auditing, and instant payout settlement.
        </p>
      </div>

      {/* Visual Workflow Diagram Flow (Horizontal / Vertical Stepper) */}
      <div className="mb-14 bg-white dark:bg-[#0c1424] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Structural Flowchart</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">7-Stage Performance Cycle</h2>
          </div>
          <span className="text-xs font-bold text-brand-primary dark:text-sky-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full">
            Click any node to explore
          </span>
        </div>

        {/* Diagram Flow Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 relative">
          {ECOSYSTEM_NODES.map((node, idx) => {
            const Icon = node.icon;
            const isSelected = activeNode.id === node.id;
            return (
              <div key={node.id} className="relative flex flex-col items-center">
                <button
                  onClick={() => setActiveNode(node)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-full group ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/60 border-brand-primary shadow-md ring-2 ring-brand-primary/20 scale-[1.02]'
                      : 'bg-slate-50 dark:bg-[#081020] border-slate-200/60 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                        isSelected ? 'bg-brand-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {node.stageNumber}
                      </span>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-primary dark:text-sky-400' : 'text-slate-400'}`} />
                    </div>

                    <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight mb-1">
                      {node.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                      {node.subtitle}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-[9px] font-bold">
                    <span className="text-brand-primary dark:text-sky-400 uppercase tracking-wider">{node.badge}</span>
                    <ChevronRight className={`w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform ${isSelected ? 'rotate-90 text-brand-primary' : ''}`} />
                  </div>
                </button>

                {/* Arrow connector between stages for large screens */}
                {idx < ECOSYSTEM_NODES.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-slate-300 dark:text-slate-700">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Detail Inspector for Selected Node */}
      <motion.div
        key={activeNode.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-[#0c1424] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-xl mb-16 space-y-8"
      >
        {/* Detail Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeNode.color} text-white flex items-center justify-center font-black text-xl shadow-lg shrink-0`}>
              {activeNode.stageNumber}
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-brand-primary dark:text-sky-400 text-[10px] font-black uppercase tracking-wider mb-1">
                Stage {activeNode.stageNumber} • {activeNode.category}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {activeNode.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {activeNode.subtitle}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#081020] px-4 py-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classification</span>
            <div className="text-sm font-black text-slate-900 dark:text-white">{activeNode.badge}</div>
          </div>
        </div>

        {/* Narrative Description */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Operational Overview</h4>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {activeNode.description}
          </p>
        </div>

        {/* 2-Column Knowledge Grid: Sub-processes vs Deliverables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Operations */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#081020] border border-slate-200/60 dark:border-slate-800/80 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-primary" />
              Core Execution Operations
            </h4>
            <ul className="space-y-2.5">
              {activeNode.operations.map((op, oidx) => (
                <li key={oidx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{op}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Deliverables */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#081020] border border-slate-200/60 dark:border-slate-800/80 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Key Outputs & Quality Artefacts
            </h4>
            <ul className="space-y-2.5">
              {activeNode.keyOutputs.map((out, outidx) => (
                <li key={outidx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Navigation Step Controller */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              const currIdx = ECOSYSTEM_NODES.findIndex(n => n.id === activeNode.id);
              if (currIdx > 0) setActiveNode(ECOSYSTEM_NODES[currIdx - 1]);
            }}
            disabled={ECOSYSTEM_NODES[0].id === activeNode.id}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
          >
            ← Previous Stage
          </button>

          <button
            onClick={() => {
              const currIdx = ECOSYSTEM_NODES.findIndex(n => n.id === activeNode.id);
              if (currIdx < ECOSYSTEM_NODES.length - 1) setActiveNode(ECOSYSTEM_NODES[currIdx + 1]);
            }}
            disabled={ECOSYSTEM_NODES[ECOSYSTEM_NODES.length - 1].id === activeNode.id}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-primary text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Next Stage</span>
            <span>→</span>
          </button>
        </div>
      </motion.div>

      {/* Global Directory Map (Clean Site Directory Index) */}
      <div className="bg-slate-50 dark:bg-[#0c1424] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-10 mb-12">
        <div className="mb-6">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Complete Directory</span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Public Ads India Platform Navigation Index</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-primary mb-3">Core Platform</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <li><button onClick={() => onNavigate('/Home')} className="hover:text-brand-primary transition-colors">/Home – Landing & Campaign Ticker</button></li>
              <li><button onClick={() => onNavigate('/Dashboard')} className="hover:text-brand-primary transition-colors">/Dashboard – Publisher Portal & Sign In</button></li>
              <li><button onClick={() => onNavigate('/overview')} className="hover:text-brand-primary transition-colors">/overview – Ecosystem & Flow Overview</button></li>
              <li><button onClick={() => onNavigate('/sitemap')} className="hover:text-brand-primary transition-colors font-bold text-slate-900 dark:text-white">/sitemap – Business Architecture Map</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-primary mb-3">Knowledge & Insights</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <li><button onClick={() => onNavigate('/blogpage')} className="hover:text-brand-primary transition-colors">/blogpage – Playbooks & Guides</button></li>
              <li><button onClick={() => onNavigate('/resource')} className="hover:text-brand-primary transition-colors">/resource – Collaterals & Templates</button></li>
              <li><button onClick={() => onNavigate('/industry')} className="hover:text-brand-primary transition-colors">/industry – Verticals & Benchmark Funnels</button></li>
              <li><button onClick={() => onNavigate('/termandcondition')} className="hover:text-brand-primary transition-colors">/termandcondition – Quality Rules & Terms</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-primary mb-3">Institutional & Partners</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <li><button onClick={() => onNavigate('/aboutus')} className="hover:text-brand-primary transition-colors">/aboutus – Company Mission & Team</button></li>
              <li><button onClick={() => onNavigate('/becomeapartner')} className="hover:text-brand-primary transition-colors">/becomeapartner – Agency & Brand Partnerships</button></li>
              <li><button onClick={() => onNavigate('/Partner')} className="hover:text-brand-primary transition-colors">/Partner – Partner Portal Verification</button></li>
              <li><button onClick={() => onNavigate('/Employee')} className="hover:text-brand-primary transition-colors">/Employee – Staff Management Desk</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-primary mb-3">Policy & Operations</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <li><button onClick={() => onNavigate('/termandcondition')} className="hover:text-brand-primary transition-colors">/termandcondition – Publisher Compliance</button></li>
              <li><button onClick={() => onNavigate('/Admin')} className="hover:text-brand-primary transition-colors">/Admin – Portal Administration Desk</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
