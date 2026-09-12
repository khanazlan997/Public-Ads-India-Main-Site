import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building, Landmark, Wallet, Smartphone, ShoppingBag, 
  CreditCard, ChevronRight, CheckCircle2, TrendingUp, BarChart2,
  ArrowRight, ShieldCheck, Target
} from 'lucide-react';

interface IndustryVertical {
  id: string;
  name: string;
  tagline: string;
  icon: any;
  share: string;
  payoutRange: string;
  conversionFunnel: string[];
  audienceProfile: string;
  topBrands: string[];
  description: string;
  keyMetrics: { label: string; value: string }[];
}

const VERTICALS: IndustryVertical[] = [
  {
    id: 'demat',
    name: 'Stock Broking & Demat Accounts',
    tagline: 'High-intent retail trading & equity investment acquisition',
    icon: Landmark,
    share: '42% Network Volume',
    payoutRange: '₹200 – ₹600+ per active client',
    description: 'Empowering leading SEBI-registered brokers and discount houses to acquire verified Indian traders with seamless Aadhaar/PAN eKYC and first-trade execution.',
    audienceProfile: 'Ages 21–40, Tier 1/2/3 cities, looking for zero-brokerage trading, IPO access, and equity investments.',
    topBrands: ['AngelOne', 'Jainam Broking', '5Paisa', 'mStock', 'Aetram Trade', 'Pocketfull Demat'],
    conversionFunnel: [
      'Lead clicks customized referral link',
      'Completes mobile OTP & DigiLocker Aadhaar KYC',
      'Receives Client Code & Brokerage credentials',
      'Executes mandatory initial stock trade (e.g. ₹20 Idea share)',
      'Payout instantly approved upon transaction confirmation'
    ],
    keyMetrics: [
      { label: 'Avg. KYC Completion Rate', value: '78%' },
      { label: 'First-Trade Turnaround', value: '< 24 Hours' },
      { label: 'Repeat Retention Rate', value: '64%' }
    ]
  },
  {
    id: 'mutual-funds',
    name: 'Mutual Funds & Systematic Investment Plans (SIP)',
    tagline: 'Long-term wealth creation with low-ticket document onboarding',
    icon: Wallet,
    share: '33% Network Volume',
    payoutRange: '₹250 – ₹600 per funded SIP',
    description: 'Driving disciplined monthly recurring investments for top Asset Management Companies (AMCs) across equity, index, and tax-saving funds.',
    audienceProfile: 'Salaried individuals and first-time investors looking for automated ₹100–₹1000 monthly SIP compounding.',
    topBrands: ['ICICI Mutual Fund', 'Axis Mutual Fund', 'Kotak MF', 'HDFC Mutual Fund', 'mStock MF'],
    conversionFunnel: [
      'Client shares verified investor details via WhatsApp/Portal',
      'Mandatory PAN & bank account verification completed',
      'Initial SIP instalment of ₹100–₹250 processed',
      'AMC folio generated with verified transaction ID',
      'Full CPA bounty settled directly to publisher'
    ],
    keyMetrics: [
      { label: 'Lead-to-SIP Ratio', value: '86%' },
      { label: 'Approval Speed', value: 'Same Day' },
      { label: 'Avg. Initial Deposit', value: '₹100 - ₹500' }
    ]
  },
  {
    id: 'calling-apps',
    name: 'Social, Audio & Calling Applications',
    tagline: 'Rapid micro-task onboarding for digital creators and youth',
    icon: Smartphone,
    share: '15% Network Volume',
    payoutRange: '₹500 – ₹1000+ weekly incentives',
    description: 'High-velocity mobile application installations and voice chat engagement targeting remote digital creators.',
    audienceProfile: 'Female creators, college students, and flexible gig workers seeking verified daily audio engagement income.',
    topBrands: ['YAPO Calling Work', 'Social Stream Apps', 'Voice Community Platforms'],
    conversionFunnel: [
      'User installs app from Google Play Store',
      'Enters publisher referral/invite code upon registration',
      'Completes initial voice profile setup',
      'Achieves first active calling milestone',
      'Weekly recurring rewards credited to publisher'
    ],
    keyMetrics: [
      { label: 'App Install Velocity', value: '15,000+/mo' },
      { label: 'Install-to-Active Ratio', value: '72%' },
      { label: 'Weekly Creator Retention', value: '58%' }
    ]
  },
  {
    id: 'banking-credit',
    name: 'Banking, Credit & Instant Personal Loans',
    tagline: 'Digitized zero-balance savings and credit line disbursements',
    icon: CreditCard,
    share: '10% Network Volume',
    payoutRange: '₹300 – ₹800 per approved lead',
    description: 'Delivering pre-qualified applicants for instant digital bank accounts, credit cards, and instant personal credit lines.',
    audienceProfile: 'Credit-conscious consumers and salaried professionals seeking credit line upgrades.',
    topBrands: ['Top Scheduled Commercial Banks', 'NBFC Credit Providers', 'Instant Card Programs'],
    conversionFunnel: [
      'Applicant submits basic credit pre-qualification',
      'Automated CIBIL & video KYC verification',
      'Account active or credit card issued',
      'Direct CPA bounty cleared to publisher balance'
    ],
    keyMetrics: [
      { label: 'Instant Eligibility Check', value: '< 60 Sec' },
      { label: 'Disbursement Success', value: '62%' },
      { label: 'Zero Paperwork Mandate', value: '100% Digital' }
    ]
  }
];

export default function IndustrySolutions({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [activeVertical, setActiveVertical] = useState<string>('demat');
  const selected = VERTICALS.find(v => v.id === activeVertical) || VERTICALS[0];

  return (
    <div className="min-h-screen py-8 md:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
        <button onClick={() => onNavigate('/Home')} className="hover:text-brand-primary dark:hover:text-amber-400 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Industry Verticals</span>
      </nav>

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-bold mb-4">
          <Building className="w-3.5 h-3.5" />
          <span>Fintech & Consumer Verticals</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
          Specialized Acquisition for <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">High-Growth Sectors</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Explore our vertical-specific acquisition funnels, target audience benchmarks, and high-converting CPA payout structures across India’s booming digital economy.
        </p>
      </div>

      {/* Vertical Selection Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {VERTICALS.map(v => {
          const Icon = v.icon;
          const isSelected = activeVertical === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setActiveVertical(v.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-brand-primary text-brand-primary dark:text-sky-400 shadow-md ring-2 ring-brand-primary/20'
                  : 'bg-white dark:bg-[#0c1424] border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-brand-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                  {v.share}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-extrabold line-clamp-1">{v.name}</span>
            </button>
          );
        })}
      </div>

      {/* Detailed Vertical Showcase */}
      <motion.div
        key={selected.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-[#0c1424] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-sm mb-16 space-y-8"
      >
        {/* Top Summary */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-brand-primary dark:text-sky-400 text-[11px] font-black uppercase tracking-wider mb-2">
              {selected.share}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">{selected.name}</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">{selected.description}</p>
          </div>

          <div className="bg-slate-50 dark:bg-[#081020] p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shrink-0 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average CPA Payout</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{selected.payoutRange}</div>
            <span className="text-[10px] text-slate-500">Same-Day / Weekly Settlements</span>
          </div>
        </div>

        {/* 3 Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {selected.keyMetrics.map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#081020] border border-slate-200/60 dark:border-slate-800/80 text-center">
              <div className="text-lg sm:text-xl font-black text-brand-primary dark:text-sky-400 mb-0.5">{m.value}</div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">{m.label}</div>
            </div>
          ))}
        </div>

        {/* 2 Column Details: Funnel vs Audience & Brands */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
          {/* Funnel */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-primary" />
              Verified Conversion Funnel Stages
            </h3>
            <div className="space-y-3">
              {selected.conversionFunnel.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#081020] border border-slate-200/50 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-brand-primary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audience & Featured Brands */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-2">
                Ideal Target Demographics
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#081020] p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 leading-relaxed">
                {selected.audienceProfile}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-2">
                Featured Brand Campaigns
              </h3>
              <div className="flex flex-wrap gap-2">
                {selected.topBrands.map((brand, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 text-xs font-bold text-brand-primary dark:text-sky-400">
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/Dashboard')}
                className="w-full py-3 bg-brand-primary hover:bg-blue-600 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Promote {selected.name} Campaigns</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
