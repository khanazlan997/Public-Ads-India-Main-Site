import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, ShieldCheck, AlertTriangle, CheckCircle, Scale, 
  HelpCircle, Clock, ChevronRight, Mail, Phone
} from 'lucide-react';

export default function TermsAndConditions({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <div className="min-h-screen py-8 md:py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
        <button onClick={() => onNavigate('/Home')} className="hover:text-brand-primary dark:hover:text-amber-400 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Terms & Conditions</span>
      </nav>

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-bold mb-4">
          <Scale className="w-3.5 h-3.5" />
          <span>Publisher & Network Operating Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Last Updated & Effective Date: September 2026 | ISO 9001:2015 Operational Standard
        </p>
      </div>

      {/* Main Legal Content Sections */}
      <div className="space-y-10 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
        
        {/* Section 1 */}
        <section className="bg-white dark:bg-[#0c1424] p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-brand-primary flex items-center justify-center text-xs font-black">1</span>
            Acceptance of Network Terms
          </h2>
          <p>
            By creating an account, accessing promotional tracking links, or submitting lead proofs on Public Ads India (the "Network" or "PAI"), you agree to abide strictly by these Terms & Conditions. If you do not accept these terms in their entirety, you must refrain from participating in any publisher or advertiser campaigns.
          </p>
          <p>
            Public Ads India operates as an independent performance marketing intermediary coordinating customer acquisition campaigns between advertisers (banks, stock brokers, fintech companies, app developers) and independent publishers/media buyers.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white dark:bg-[#0c1424] p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-brand-primary flex items-center justify-center text-xs font-black">2</span>
            Publisher Eligibility & Account Registration
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-2 text-slate-600 dark:text-slate-300">
            <li>Publishers must be at least 18 years of age and legally eligible to engage in contractual marketing activities in India.</li>
            <li>Each publisher is assigned a unique identifier (PUB ID) upon registration. Account credentials must remain confidential and are non-transferable.</li>
            <li>Publishers must supply valid contact details and accurate UPI / Bank account credentials for payment disbursement.</li>
            <li>Creation of duplicate accounts by the same individual to bypass limits or abuse bonuses is strictly prohibited.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-white dark:bg-[#0c1424] p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-brand-primary flex items-center justify-center text-xs font-black">3</span>
            Traffic Quality & Anti-Fraud Mandates
          </h2>
          <p>
            All referred users must be genuine human applicants with authentic intent. Public Ads India enforces zero-tolerance measures against dishonest lead generation practices:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
              <span className="font-extrabold text-rose-700 dark:text-rose-400 flex items-center gap-1.5 text-xs mb-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Strictly Prohibited Actions
              </span>
              <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Using bots, auto-clickers, VPNs, or device emulators</li>
                <li>• Fabricated or digitally altered proof screenshots</li>
                <li>• Opening accounts using unauthorized 3rd-party identity cards</li>
                <li>• Fake referrals without actual client awareness</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 text-xs mb-1">
                <CheckCircle className="w-3.5 h-3.5" /> Approved Promotion Channels
              </span>
              <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Telegram finance & market discussion groups</li>
                <li>• YouTube & Instagram financial tutorials</li>
                <li>• Direct 1-on-1 client advisory via WhatsApp</li>
                <li>• Paid social search and display ads with genuine landing pages</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-white dark:bg-[#0c1424] p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-brand-primary flex items-center justify-center text-xs font-black">4</span>
            Payout Terms, Verification & Settlements
          </h2>
          <p>
            Campaign payouts are denominated in Indian Rupees (INR ₹) and are credited according to campaign terms:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2 text-slate-600 dark:text-slate-300">
            <li><strong>Lead Verification SLA:</strong> Submitted proofs are inspected by our MIS auditing team within 24–48 business hours.</li>
            <li><strong>Minimum Settlement:</strong> Payouts are settled via direct bank transfer or instant UPI without arbitrary deduction fees.</li>
            <li><strong>Rejected Submissions:</strong> If a submission fails verification due to incomplete KYC, duplicate client numbers, or missing initial trade/funding criteria, the status will be marked as "Reject" with clear reasoning.</li>
            <li><strong>Audit Adjustments:</strong> The network reserves the right to withhold payments or reverse balances associated with confirmed fraudulent claims.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="bg-white dark:bg-[#0c1424] p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-brand-primary flex items-center justify-center text-xs font-black">5</span>
            Campaign Modifications & Pauses
          </h2>
          <p>
            Advertisers may update campaign payouts, required trade conditions, or cap limits periodically based on quarterly acquisition targets. Public Ads India will display updated campaign terms in real time inside the dashboard.
          </p>
        </section>

        {/* Section 6 */}
        <section className="bg-white dark:bg-[#0c1424] p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-brand-primary flex items-center justify-center text-xs font-black">6</span>
            Support & Dispute Resolution
          </h2>
          <p>
            If you have an inquiry regarding a submission or wish to dispute a status, contact the Public Ads India team leader desk. All disputes are reviewed transparently against the advertiser’s backend transaction logs.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-brand-primary" /> publicadsnetwork@gmail.com</span>
            <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-emerald-500" /> WhatsApp: +91 9196344494</span>
          </div>
        </section>

      </div>
    </div>
  );
}
