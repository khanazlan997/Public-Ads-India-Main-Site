import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Layers, CheckCircle, TrendingUp, Users, ShieldCheck, Zap, 
  ArrowRight, ChevronRight, BarChart3, Globe, Smartphone, Landmark,
  Wallet, RefreshCw, Send, Award
} from 'lucide-react';

export default function Overview({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [activeTab, setActiveTab] = useState<'publishers' | 'advertisers'>('publishers');

  const publisherBenefits = [
    { title: 'Top-Tier Payouts (₹100 - ₹1000+)', desc: 'Direct access to institutional grade Demat, SIP, and App offers with zero middleman deductions.' },
    { title: 'Rapid Settlement Cycle', desc: 'Daily and weekly payment clearances straight to your registered UPI or Bank Account.' },
    { title: 'Real-Time Verification Engine', desc: 'Instant status feedback on submitted proofs with transparent approval codes.' },
    { title: 'Dedicated Promotion Kits', desc: 'Pre-approved marketing copies, WhatsApp quick-share formats, and deep referral links.' }
  ];

  const advertiserBenefits = [
    { title: 'Pay Only for Verified Conversions', desc: 'Zero upfront risk. Billings trigger strictly upon completed KYC, trade, or funded SIP.' },
    { title: 'Comprehensive Fraud Screening', desc: 'Multi-point verification safeguards against bots, proxies, and duplicate submissions.' },
    { title: 'Hyper-Targeted Demographics', desc: 'Reach Tier 1, 2 & 3 Indian retail investors looking for active stock broking and mutual funds.' },
    { title: 'Scalable Volume on Demand', desc: 'Seamlessly scale from 500 to 50,000+ monthly verified customers.' }
  ];

  const verticalSummary = [
    { name: 'Stock Broking & Demat', share: '42% Volume', icon: Landmark, avgPayout: '₹250 - ₹600', popular: 'AngelOne, Jainam, 5Paisa, mStock' },
    { name: 'Mutual Funds & SIP', share: '33% Volume', icon: Wallet, avgPayout: '₹250 - ₹600', popular: 'ICICI SIP, Axis MF, Kotak MF, HDFC MF' },
    { name: 'Calling & Social Apps', share: '15% Volume', icon: Smartphone, avgPayout: '₹500 - ₹1000+', popular: 'YAPO Calling Work & Creator Offers' },
    { name: 'Banking & Credit Products', share: '10% Volume', icon: Landmark, avgPayout: '₹300 - ₹800', popular: 'Instant Savings & Personal Credit' },
  ];

  return (
    <div className="min-h-screen py-8 md:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
        <button onClick={() => onNavigate('/Home')} className="hover:text-brand-primary dark:hover:text-amber-400 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Platform Overview</span>
      </nav>

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-bold mb-4">
          <Layers className="w-3.5 h-3.5" />
          <span>Ecosystem & Architecture Overview</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
          The Performance Engine Powering <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">Fintech Growth in India</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Discover how Public Ads India connects premier advertisers with verified publishers through transparent tracking, strict quality verification, and rapid settlement cycles.
        </p>
      </div>

      {/* Tab Switcher: For Publishers vs For Advertisers */}
      <div className="flex justify-center mb-10">
        <div className="bg-slate-100 dark:bg-[#0c1424] p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab('publishers')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'publishers'
                ? 'bg-brand-primary text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            For Publishers & Affiliates
          </button>
          <button
            onClick={() => setActiveTab('advertisers')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'advertisers'
                ? 'bg-brand-primary text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            For Advertisers & Brands
          </button>
        </div>
      </div>

      {/* Feature Value Grid based on Tab */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {(activeTab === 'publishers' ? publisherBenefits : advertiserBenefits).map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-brand-primary/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-brand-primary dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1.5">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Core Workflow Stages (Visual Flow) */}
      <div className="mb-16 bg-gradient-to-b from-slate-50 to-white dark:from-[#081020] dark:to-[#0c1424] p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">How the Network Works</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">End-to-end performance cycle from link generation to bank settlement.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-brand-primary mx-auto flex items-center justify-center font-black text-lg mb-4">
              01
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">Select Campaign</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Choose from top Demat, SIP, and App offers with pre-configured target KPIs.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 mx-auto flex items-center justify-center font-black text-lg mb-4">
              02
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">Promote & Acquire</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Share direct links with clients, guiding them through KYC and activation steps.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center font-black text-lg mb-4">
              03
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">Upload Proof</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Submit client details and activation screenshot in your dashboard for instant audit.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center font-black text-lg mb-4">
              04
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">Receive Payout</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Earnings are credited upon verification and cleared directly via UPI/Bank transfer.</p>
          </div>
        </div>
      </div>

      {/* Vertical Breakdown Overview */}
      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Active Industry Verticals</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">High demand sectors currently monetized across our network.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {verticalSummary.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-brand-primary dark:text-sky-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {v.share}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">{v.name}</h4>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-3">Avg. Payout: {v.avgPayout}</div>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Top Brands:</span> {v.popular}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black mb-2">Ready to scale your earning potential?</h3>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Join thousands of smart publishers earning daily with Public Ads India’s verified fintech offers.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('/Dashboard')}
            className="px-6 py-3 bg-white text-brand-primary rounded-xl text-xs font-black hover:bg-slate-100 transition-colors shadow-lg"
          >
            Launch Publisher Dashboard
          </button>
          <button
            onClick={() => onNavigate('/sitemap')}
            className="px-5 py-3 bg-blue-900/50 hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-colors border border-white/20"
          >
            View Business Sitemap
          </button>
        </div>
      </div>
    </div>
  );
}
