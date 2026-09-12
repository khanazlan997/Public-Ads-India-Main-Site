import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, Users, Award, ShieldCheck, Target, Zap, Globe, 
  ChevronRight, TrendingUp, CheckCircle2, HeartHandshake, MapPin, 
  Mail, Phone, Clock, ArrowRight
} from 'lucide-react';

export default function AboutUs({ onNavigate }: { onNavigate: (route: string) => void }) {
  const milestones = [
    { label: 'Active Publishers', value: '10,000+', desc: 'Across 28 Indian states & UTs' },
    { label: 'Verified Conversions', value: '100,000+', desc: 'In Demat, SIP & Fintech offers' },
    { label: 'Total Payouts Disbursed', value: '₹1.5+ Cr', desc: 'Direct UPI & Bank settlements' },
    { label: 'Active Brand Offers', value: '45+', desc: 'Leading Indian banks & brokers' },
  ];

  const values = [
    {
      icon: Zap,
      title: 'Fast Settlement Guarantee',
      desc: 'We prioritize swift daily and weekly payout clearances so publishers maintain healthy cashflow.'
    },
    {
      icon: ShieldCheck,
      title: 'Zero Rejection Transparency',
      desc: 'Our MIS quality audit provides clear lead status timestamps and reasons for ultimate peace of mind.'
    },
    {
      icon: Target,
      title: 'High-Converting Offers',
      desc: 'We curate exclusive, top-payout campaigns in Demat, Mutual Funds, Calling Apps, and Banking.'
    },
    {
      icon: HeartHandshake,
      title: 'Dedicated Account Managers',
      desc: 'Every active affiliate receives one-on-one campaign strategy and WhatsApp support.'
    }
  ];

  const team = [
    {
      name: 'Operations & MIS Lead',
      role: 'Campaign Strategy & Verification',
      bio: 'Oversees advertiser quality benchmarks, tracking link integrity, and high-payout brand allocations.'
    },
    {
      name: 'Affiliate Desk Desk Manager',
      role: 'Publisher Onboarding & Support',
      bio: 'Guides thousands of new creators, Telegram channel leaders, and agency partners daily.'
    },
    {
      name: 'Disbursement & Finance Cell',
      role: 'Instant UPI & NEFT Settlements',
      bio: 'Ensures accurate calculations, bonus disbursements, and transparent invoice accounting.'
    }
  ];

  return (
    <div className="min-h-screen py-8 md:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
        <button onClick={() => onNavigate('/Home')} className="hover:text-brand-primary dark:hover:text-amber-400 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">About Us</span>
      </nav>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-bold mb-4">
          <Building2 className="w-3.5 h-3.5" />
          <span>India’s Leading Performance Ad Network</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
          Empowering Financial Growth for <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">Publishers & Brands</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Established in 2023, Public Ads India (PAI) is a premier performance marketing network connecting top-tier financial institutions, stock broking giants, and consumer apps with verified high-intent Indian audiences.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
        {milestones.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center"
          >
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-primary dark:text-sky-400 mb-1">
              {m.value}
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mb-0.5">
              {m.label}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {m.desc}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Our Story & Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>ISO 9001:2015 Certified Operations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Bridging the Gap Between Quality Traffic and Brand ROI
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Public Ads India was founded to solve two major friction points in digital affiliate marketing: slow publisher payouts and opaque lead auditing. By deploying strict automated quality standards and daily settlement cycles, we ensure every genuine conversion is rewarded without delay.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Whether you are an individual content creator with a finance channel, a regional media buying agency, or a consumer brand scaling pan-India customer acquisition, our network delivers measurable results.
          </p>
          
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('/Dashboard')}
              className="px-5 py-2.5 bg-brand-primary hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20"
            >
              Join as Publisher
            </button>
            <button
              onClick={() => onNavigate('/becomeapartner')}
              className="px-5 py-2.5 bg-white dark:bg-[#0c1424] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
            >
              Partner with Us
            </button>
          </div>
        </div>

        {/* Visual Box with Highlights */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-400" />
            Our Core Operating Pillars
          </h3>
          <ul className="space-y-4 text-xs sm:text-sm text-slate-200">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Pure Performance Marketing:</strong> Zero upfront risk for advertisers; pay strictly on verified CPA results.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Guaranteed Payout Security:</strong> Clear minimum settlement criteria with zero hidden fee deductions.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Comprehensive Vertical Coverage:</strong> Stocks, Demat, SIP, Loan lead generation, and social app monetization.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Values Grid */}
      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">What Sets Us Apart</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">Built on trust, speed, and real-time accountability.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-brand-primary/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-brand-primary dark:text-sky-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">{v.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team / Leadership */}
      <div className="mb-16 bg-slate-50 dark:bg-[#081020] rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Our Dedicated Team</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Real human support behind every conversion and settlement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, idx) => (
            <div key={idx} className="bg-white dark:bg-[#0c1424] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 text-brand-primary dark:text-sky-400 mx-auto flex items-center justify-center font-black text-xl mb-4">
                PAI
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">{member.name}</h4>
              <div className="text-[11px] font-bold text-brand-primary dark:text-sky-400 mb-3">{member.role}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Location Card */}
      <div className="bg-white dark:bg-[#0c1424] rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Want to discuss custom brand campaigns?</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Our enterprise solutions team is ready to structure bespoke CPA and CPL acquisition programs tailored to your quarterly KPIs.
          </p>
          <div className="flex flex-wrap gap-4 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-brand-primary" /> publicadsnetwork@gmail.com</span>
            <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-emerald-500" /> +91 9196344494</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-rose-500" /> India (PAN-India Network)</span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('/becomeapartner')}
          className="px-6 py-3 bg-brand-primary hover:bg-blue-600 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shrink-0 flex items-center gap-2"
        >
          <span>Connect with Partnerships Desk</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
