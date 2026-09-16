import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, TrendingUp, IndianRupee, Zap, ArrowRight, CheckCircle2, Award, Star, Users, PhoneCall, Building2 } from 'lucide-react';

export default function ZeroInvestmentLanding({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-[#060d1f] text-slate-900 dark:text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Hero Section optimized for #1 Google Rank on Zero Investment Work */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> 100% Verified Zero Investment Work • Kanpur, India
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            India&apos;s #1 Trusted <span className="text-emerald-600 dark:text-emerald-400">Zero Investment Work</span> Platform with Daily UPI Payouts
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Looking for genuine work from home without any security deposit or registration fee? Public Ads India (PAI) offers verified Demat account opening tasks, telecalling projects, and fintech CPA affiliate programs with same-day guaranteed payouts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('/Partner')}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              Start Working For Free <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('/blogpage')}
              className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-extrabold rounded-2xl shadow-md hover:bg-slate-50 transition-all text-sm uppercase tracking-wider cursor-pointer"
            >
              Read Success Guides
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 max-w-4xl mx-auto">
            <div className="p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 text-center">
              <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">₹0</span>
              <span className="text-xs font-bold text-slate-500 uppercase">Investment Fee</span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 text-center">
              <span className="block text-2xl font-black text-blue-600 dark:text-blue-400">Daily</span>
              <span className="text-xs font-bold text-slate-500 uppercase">UPI Payouts</span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 text-center">
              <span className="block text-2xl font-black text-amber-500">4.9 / 5</span>
              <span className="text-xs font-bold text-slate-500 uppercase">1,850+ Reviews</span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 text-center">
              <span className="block text-2xl font-black text-purple-600 dark:text-purple-400">100%</span>
              <span className="text-xs font-bold text-slate-500 uppercase">Verified Tasks</span>
            </div>
          </div>
        </div>

        {/* Core Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-black">
              01
            </div>
            <h3 className="text-lg font-black">Demat Account Opening Work</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Help clients open free demat accounts with AngelOne, Kotak, and Jainam. Earn up to ₹600 per verified conversion instantly.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center font-black">
              02
            </div>
            <h3 className="text-lg font-black">Telecalling & BPO Projects</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Part-time or full-time calling projects with flexible hours. Connect with verified leads and earn steady weekly payouts.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center font-black">
              03
            </div>
            <h3 className="text-lg font-black">Instant UPI Payouts</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              No waiting for month-end cycles. Request your earned commission anytime and receive funds directly in your UPI or bank account.
            </p>
          </div>
        </div>

        {/* Detailed FAQ for SEO Ranking */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-2xl font-black">Frequently Asked Questions on Zero Investment Work</h2>
          
          <div className="space-y-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <h4 className="font-bold text-sm mb-1">Is Public Ads India really 100% free with zero investment?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes! We never charge any registration fee, security deposit, or training fee. You can start working and earning immediately without spending a single rupee.
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <h4 className="font-bold text-sm mb-1">How do I get my earnings?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                All approved earnings are disbursed instantly through UPI (Google Pay, PhonePe, Paytm) or direct bank transfer upon request in your Partner Dashboard.
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <h4 className="font-bold text-sm mb-1">Where is Public Ads India located?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Public Ads India is headquartered in Kanpur, Uttar Pradesh, serving thousands of digital publishers and partners across India with 5-star verified ratings.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
