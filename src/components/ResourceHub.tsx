import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderOpen, HelpCircle, ChevronDown, 
  ChevronRight, Share2, Copy, Check,
  ArrowRight, Download, MessageCircle
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

      {/* WhatsApp Status Creatives Section (Status 1 to 5) */}
      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest mb-3">
            <MessageCircle className="w-4 h-4 text-[#25D366]" /> Official Marketing & WhatsApp Creatives
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            WhatsApp Status Creatives
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Download or share high-resolution promotional status banners directly to your WhatsApp status, groups, and clients with 1 click.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: 1,
              title: "Status 1: Zero Investment Work & Daily Payouts",
              url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjMqY8BLPzRQEHv5EWUF0QZwA9x8MkBAlyMJ_BLrg4KV03122aQ37uX3rx7LPHxZH8fADZZajcWaweJFiFzxV3aZ32NomfOY8WnZqrfqeHLnHhN9DzUGT-aQbNH2xDg21k_8ZZRroam8yWYed_NT0lMjGPRSvsRRhBpbw-F7B6C_94oN1-xhFgJ_373LLVW/s1403/1000229992.png",
              caption: "🚀 Public Ads India - 100% Zero Investment Work from Home with Daily UPI Payouts! Join now: https://www.publicadsindia.com/"
            },
            {
              id: 2,
              title: "Status 2: Demat & SIP Earning Playbook",
              url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg84xyPfBIx6zmsfhEWqUd5FJWWwJ_YN5LuOSaOM8Loe5H_qyS430e6KXuxEX0dUHIU9-EwrILVnglGfdN8sZaMLCRtp0aH9JbX1XpaOUebCd2njSPR-Rt2qRdKgDrPdRIh0cuo-x6AGyc5wQSlolRSmuP5jZi79Je51bm9cO_mTPbus9dE8UF0N4tlMNwB/s1403/1000229979.png",
              caption: "💰 Earn ₹50,000+ Monthly with Demat & SIP Campaigns in India. 100% Verified & Trusted! Check details: https://www.publicadsindia.com/"
            },
            {
              id: 3,
              title: "Status 3: Telecalling & BPO Projects",
              url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj4YbBYbvvHNkCn_j26V-L1WilXuYKZPJ74ZXRoxjniKLIoNX2Dodex-7uu-4qQrjSWqiTImBe99A8b9EWMxsUMIgPayuUyGXWd74SgevBFNjiKzmOqLC0FftyuhPZCSq9TX2HQBl_q_WXTe4BJ3Qd5MfkgVegxqfBT5JdfVE5QH1Q19V5BrLvxXZ0C2dAX/s1354/1000229977.png",
              caption: "💼 Telecalling & BPO Work from Home with Flexible Hours. Direct UPI Transfers! Start today: https://www.publicadsindia.com/"
            },
            {
              id: 4,
              title: "Status 4: Student & Homemaker Opportunities",
              url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLILJ-of2Ln7tR-RTBwyHllyrV3PP6utlJiNumZwvP414YlAZzep8JprAoKRkSkbDIB49wgec9_X7lj-0iDV39GVKvXRLloVJe7kgjj8iuLNbNDuztW687rm27ObNOesnOsOC5Tp0xxdJXVdoYgSQ4s2jfLeMZWJVfUYrTxyn6GJyg8UOFzHUi04ePRxdB/s1403/1000229976.png",
              caption: "⭐ Perfect for Students, Homemakers & Job Seekers! Zero Investment Work with 5-Star Rating. Register free: https://www.publicadsindia.com/"
            },
            {
              id: 5,
              title: "Status 5: Official VIP Partner Network Banner",
              url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiemDqzNvAhstCPeVjmKfguoDMKXEmQyJ1RBk9LjgpIdnaVQ2_c67gTZcAoZ-w3wcPj1bm7cfmOx0Pk1pcS5pgtJB9Lc63x4R-_0JqXp894blhAwIwIdc94xuKovOuFW6w_5h3sorJw_24PfmIyT7SGuDxWWnEuR6IJM0BsapYACy4GuF2dIjcl6swCQ1e6/s1403/1000229975.png",
              caption: "🏆 India's #1 Fintech & Affiliate Partner Network. Secure your financial future with zero investment! Visit: https://www.publicadsindia.com/"
            }
          ].map((creative) => (
            <div key={creative.id} className="bg-white dark:bg-[#0c1424] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full uppercase tracking-wider">
                    Status {creative.id}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">High Res 1403px</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[9/16] mb-4 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center p-2">
                  <img 
                    src={creative.url} 
                    alt={creative.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    crossOrigin="anonymous"
                    loading="lazy"
                  />
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2 leading-snug">
                  {creative.title}
                </h3>
              </div>

              {/* Action Buttons: Download & WhatsApp SVG Share */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                {/* Download Button */}
                <a
                  href={creative.url}
                  download={`Public_Ads_India_Status_${creative.id}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-brand-primary" />
                  <span>Download</span>
                </a>

                {/* WhatsApp Share Button with official SVG */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(creative.caption + '\n\n📥 Download Image: ' + creative.url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#25D366]/20 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Share WA</span>
                </a>
              </div>
            </div>
          ))}
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
