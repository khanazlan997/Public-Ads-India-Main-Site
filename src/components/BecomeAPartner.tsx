import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HeartHandshake, Building2, Users2, ShieldCheck, Zap, ArrowRight, 
  CheckCircle2, Send, Check, ChevronRight, Award, Briefcase, MessageCircle
} from 'lucide-react';
import { useAppState } from '../context/AppContext';

export default function BecomeAPartner({ onNavigate }: { onNavigate: (route: string) => void }) {
  const { submitPartnerApplication, partnerHiringActive } = useAppState();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    age: '',
    qualification: 'Graduation / Degree',
    partnerType: 'Agency Partner (Bulk Submissions)',
    monthlyLeads: '500 - 2,000 Verified Leads'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedWaUrl, setSubmittedWaUrl] = useState('');
  const [submittedPartnerData, setSubmittedPartnerData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const partnerTiers = [
    {
      title: 'Digital Agency / Media House',
      desc: 'For advertising agencies and media teams managing high-spend PPC and social acquisition funnels.',
      perks: [
        'Dedicated API & webhook integrations',
        'Custom private CPA rates & volume escalations',
        'Priority same-day batch settlement queue',
        'Dedicated senior affiliate manager'
      ],
      badge: 'High Volume'
    },
    {
      title: 'Finance Creator & Community Leader',
      desc: 'For YouTube creators, Instagram fin-influencers, and large Telegram stock market channels.',
      perks: [
        'Custom co-branded landing pages',
        'Direct WhatsApp support assistance for your followers',
        'Monthly performance milestone bonuses',
        'Early access to new broking campaign launches'
      ],
      badge: 'Creators'
    },
    {
      title: 'Regional Team Leader & Master Affiliate',
      desc: 'For team builders managing offline student or agent networks across Tier 2 and Tier 3 cities.',
      perks: [
        'Sub-publisher tracking & referral overrides',
        'Physical promotional kits & marketing banners',
        'Weekly consolidated ledger reports',
        'Local training workshop support'
      ],
      badge: 'Team Leaders'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!formData.name || !formData.phone || !formData.city) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitPartnerApplication({
        name: `${formData.name} [${formData.partnerType}]`,
        phone: formData.phone,
        email: formData.email || `${formData.phone}@partner.pai`,
        city: `${formData.city} (Est: ${formData.monthlyLeads})`,
        age: parseInt(formData.age) || 25,
        qualification: formData.qualification,
        partnerType: formData.partnerType,
        monthlyLeads: formData.monthlyLeads
      });

      if (res.success) {
        setSubmittedPartnerData({ ...formData });
        const waUrl = res.whatsappUrl || `https://wa.me/918934932418`;
        setSubmittedWaUrl(waUrl);
        setSuccess(true);
        // Auto open WhatsApp with the formatted application
        try {
          window.open(waUrl, '_blank', 'noopener,noreferrer');
        } catch (openErr) {
          console.warn("Auto-open blocked by browser pop-up setting:", openErr);
        }
      } else {
        setErrorMessage(res.message || 'Application submission failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error processing application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
        <button onClick={() => onNavigate('/Home')} className="hover:text-brand-primary dark:hover:text-amber-400 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Become a Partner</span>
      </nav>

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 text-xs font-bold mb-4">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Strategic Partnership Program</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
          Scale Your Revenue with <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 bg-clip-text text-transparent">Institutional Partnership</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Join forces with Public Ads India as an Agency Partner, Master Affiliate, or Community Leader. Enjoy exclusive custom payouts, dedicated account management, and priority settlement queues.
        </p>
      </div>

      {/* Partnership Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {partnerTiers.map((tier, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-amber-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                  {tier.badge}
                </span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>

              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{tier.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{tier.desc}</p>

              <div className="space-y-2.5 mb-6">
                {tier.perks.map((perk, pidx) => (
                  <div key={pidx} className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, partnerType: tier.title }));
                const el = document.getElementById('partner-application-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-amber-500 hover:text-white dark:bg-slate-800 dark:hover:bg-amber-500 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
            >
              Select {tier.badge} Tier
            </button>
          </motion.div>
        ))}
      </div>

      {/* Application Form Section */}
      <div id="partner-application-form" className="bg-white dark:bg-[#0c1424] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-xl max-w-4xl mx-auto mb-16">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center mb-3">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Partner Application Desk</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Submit your credentials to initiate direct partnership evaluation.
          </p>
        </div>

        {success ? (
          <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4 animate-fade-up">
            <div className="w-14 h-14 bg-emerald-500/15 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
              <Check className="w-8 h-8" />
            </div>
            
            <div>
              <h3 className="text-xl font-black text-emerald-950 dark:text-emerald-200">Application Dispatched to WhatsApp!</h3>
              <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 max-w-md mx-auto mt-1">
                Your partner application details have been forwarded directly to the official admin WhatsApp number <span className="font-extrabold text-slate-900 dark:text-white underline">+91 8934932418</span>.
              </p>
              <div className="mt-2 inline-block text-[10px] font-extrabold px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 rounded-full">
                ✓ Direct WhatsApp Routing • Zero Firebase / Database Load
              </div>
            </div>

            {submittedPartnerData && (
              <div className="p-4 bg-white dark:bg-[#0b1322] border border-emerald-100 dark:border-emerald-900/60 rounded-xl text-left text-xs space-y-2 text-slate-700 dark:text-slate-300 max-w-lg mx-auto">
                <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  Forwarded Application Details:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs">
                  <div><span className="font-semibold text-slate-500 dark:text-slate-400">Name:</span> <span className="font-bold text-slate-900 dark:text-white">{submittedPartnerData.name}</span></div>
                  <div><span className="font-semibold text-slate-500 dark:text-slate-400">Phone:</span> <span className="font-bold text-slate-900 dark:text-white">{submittedPartnerData.phone}</span></div>
                  <div><span className="font-semibold text-slate-500 dark:text-slate-400">City:</span> <span className="font-bold text-slate-900 dark:text-white">{submittedPartnerData.city}</span></div>
                  <div><span className="font-semibold text-slate-500 dark:text-slate-400">Category:</span> <span className="font-bold text-slate-900 dark:text-white">{submittedPartnerData.partnerType}</span></div>
                </div>
                {submittedPartnerData.monthlyLeads && (
                  <div className="pt-1 text-[11px] border-t border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Estimated Volume:</span> <span className="font-bold text-slate-900 dark:text-white">{submittedPartnerData.monthlyLeads}</span>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={submittedWaUrl || "https://wa.me/918934932418"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs sm:text-sm rounded-xl inline-flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Chat on WhatsApp (+91 8934932418)
              </a>
              <button
                onClick={() => {
                  setSuccess(false);
                  setSubmittedPartnerData(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-bold">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Full Name / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AdVantage Media Group"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#081020] border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Primary WhatsApp / Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10 to 15-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#081020] border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  placeholder="partner@yourdomain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#081020] border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Operating City / State *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#081020] border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Partnership Category
                </label>
                <select
                  value={formData.partnerType}
                  onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#081020] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Digital Agency / Media House">Digital Agency / Media House</option>
                  <option value="Finance Creator & Community Leader">Finance Creator & Community Leader</option>
                  <option value="Regional Team Leader & Master Affiliate">Regional Team Leader & Master Affiliate</option>
                  <option value="Brand Advertiser (Running Campaigns)">Brand Advertiser (Running Campaigns)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Estimated Monthly Lead Potential
                </label>
                <select
                  value={formData.monthlyLeads}
                  onChange={(e) => setFormData({ ...formData, monthlyLeads: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#081020] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="100 - 500 Verified Leads">100 - 500 Verified Leads / month</option>
                  <option value="500 - 2,000 Verified Leads">500 - 2,000 Verified Leads / month</option>
                  <option value="2,000 - 10,000+ High Volume">2,000 - 10,000+ High Volume / month</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting Application...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Strategic Partnership Application</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
