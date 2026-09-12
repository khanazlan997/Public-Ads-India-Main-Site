import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderOpen, HelpCircle, ChevronDown, 
  ChevronRight, Share2, Copy, Check,
  ArrowRight
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Publisher Onboarding',
    question: 'How do I generate my unique promotional links?',
    answer: 'Navigate to your Publisher Dashboard. Under the "Active Brand Campaigns" tab, click on any campaign card (e.g. AngelOne, ICICI MF, Jainam Broking) to copy the promotional link or send it directly to WhatsApp.'
  },
  {
    category: 'Submissions & Verification',
    question: 'What details are required when submitting lead proof?',
    answer: 'You must provide the Client Name, Client Mobile Number, assigned Client Code (if applicable), and an uncropped screenshot showing the account activation or successful trade execution.'
  },
  {
    category: 'Payouts & Banking',
    question: 'How fast are daily and weekly payouts credited?',
    answer: 'Once your submission status updates to "Payment Done" or "Active", earnings are added to your ledger. Payouts are settled directly to your registered UPI ID or Bank Account on regular settlement cycles.'
  },
  {
    category: 'Campaign Rules',
    question: 'What happens if a client does not complete the initial trade?',
    answer: 'For Demat offers requiring an initial trade (e.g., buying 1 Idea share), the conversion will remain pending or marked "Ready To Trade" until the mandatory trade requirement is met.'
  },
  {
    category: 'Referral Program',
    question: 'Can I earn commissions by referring other publishers?',
    answer: 'Yes! Share your unique Invite Code with fellow media buyers and creators. When they register and start submitting verified leads, you earn referral commission bonuses.'
  }
];

export default function ResourceHub({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const sampleTemplate = `🔥 *LIMITED TIME EARNING OPPORTUNITY* 🔥
Open your Free Demat & Investment Account in 5 minutes!
✅ Zero Account Opening Fees
✅ Zero AMC for First Year
✅ Start SIP with just ₹100

Contact me directly or click the link below to get started:
👉 [Your Public Ads India Campaign Link]`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate('template-1');
    setTimeout(() => setCopiedTemplate(null), 2500);
  };

  return (
    <div className="min-h-screen py-8 md:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
        <button onClick={() => onNavigate('/Home')} className="hover:text-brand-primary dark:hover:text-amber-400 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Resource Center</span>
      </nav>

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-bold mb-4">
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Knowledge Base & Marketing Collaterals</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
          Publisher Resources & <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">Conversion Toolkits</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Access high-converting promotional copies, KYC guidance, and frequently asked questions to maximize your daily performance.
        </p>
      </div>

      {/* Copyable WhatsApp & Telegram Promotion Templates */}
      <div className="mb-16 bg-white dark:bg-[#0c1424] p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
              <Share2 className="w-3.5 h-3.5" />
              <span>Ready-to-Use Creatives</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">High-Converting Message Templates</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Copy and paste these verified message formats into your groups or direct messages.</p>
          </div>

          <button
            onClick={() => handleCopy(sampleTemplate)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
          >
            {copiedTemplate ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedTemplate ? 'Copied to Clipboard!' : 'Copy Template'}</span>
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-[#060d1f] p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
          {sampleTemplate}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Everything you need to know about campaigns, tracking, and settlements.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#0c1424] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm text-slate-900 dark:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-brand-primary dark:text-sky-400 shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-primary' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Support CTA */}
      <div className="bg-slate-50 dark:bg-[#0c1424] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 text-center flex flex-col items-center justify-center">
        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">Still need assistance with a specific campaign?</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mb-4">Our dedicated team leaders are available on WhatsApp for live campaign guidance.</p>
        <a
          href="https://wa.me/918934932418?text=Hello%20Public%20Ads%20India%20Support!%20I%20need%20help%20with%20campaign%20resources."
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <span>Chat with Team Leader on WhatsApp</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
