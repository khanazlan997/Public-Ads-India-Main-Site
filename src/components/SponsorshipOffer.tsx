import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/AppContext';
import { 
  Gift, 
  Trophy, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowLeft, 
  Calendar,
  Award,
  AlertCircle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SponsorshipOfferProps {
  onNavigate: (route: string) => void;
}

const PRODUCT_SLIDES = [
  {
    id: 1,
    title: 'Blender Mixer Juicer',
    subtitle: 'Smoothies & Juices',
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjCcPe5csNFU9jcnZXAfZWPc0E6YgavhOuXgUPOfcbXrsZ-g7KvgfWLxGP4F6jMw5i_hv9RItWyGFEt15bjf2fzDthsdMJGbxB1JqKKGWqBGwxJ1f_9fFiYfynvLNrbV49MZArULNJpZT1gxLjlNlSNYbKjmBbnxDXU6lvSHo0S9EwFd_Z_WGp1ouB_4yQ/s300/419K1bit7qL._SY300_SX300_QL70_FMwebp_.webp',
    tag: 'Sponsor Reward'
  },
  {
    id: 2,
    title: 'Blender Mixer Juicer',
    subtitle: 'Portable & High Speed Motor',
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi2wL32A286Y5HSTShpLBTQ6y-AYdVu3Gnl-7gr6CDxIqxvAbncK6vhwMcnS_e3udLKjvpUW8YJhbkhQ5TzBUH9V3SJyNXEaNKsthHMCP7m-aPwZ6LPaVaRj429Fq5nmOHI7m3TqlqYJn6Gt8Lk2x7ejHMwNutsXeFhX2pzmBC0ycz_NdyKUXVkByhV4vQ/s425/61kPxtXdarL._SX425_.jpg',
    tag: 'Premium Quality'
  },
  {
    id: 3,
    title: 'Blender Mixer Juicer',
    subtitle: 'Stainless Steel Blades',
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg1oHFlYeQ560DDawVE0sUrpkhg_7pHg2O8UQz11CJqwvJuy0c6B8J1iu0QaJN2gGNcgqTFPmq-jQc4LjFgybFMBtHV3fP86T0YxpBPeEyn9IIu1jNQg6x3lakfWo_FNTYIB-GlkzEu_etxeDJBz7XdCDIIfOP1DysK3w_Ok8OZBXjP8iOmHmOGLNnhH14/s1024/61+yvP0bHRL._SL1024_.jpg',
    tag: 'Top Pick'
  },
  {
    id: 4,
    title: 'Blender Mixer Juicer',
    subtitle: 'Smoothies & Fresh Juices',
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgbLx__G7y4iuH946DBmstK0xIcZMpMGi_gZ2mJY7JZK9s0Z01gR5pptv4TGp5949U-BAkKGuR4gkTpZIwtITtXuQ2ECK7SDjP-IJl3ds3Q8LeSKfpMWNoMd9RUjYbbgExZ6ePGUrIwxV0mlh9_qgwgJjM5JlVp7xYIJB7D12kM0z1Q5QjgKKjd9I6W7Ac/s1024/61jhV2d9lCL._SL1024_.jpg',
    tag: 'Fresh Juices'
  }
];

interface ReferralDetail {
  clientId: string;
  clientName: string;
  firstAngelOneDate: string;
  monthKey: string;
}

export default function SponsorshipOffer({ onNavigate }: SponsorshipOfferProps) {
  const { currentUser, publishers, submissions, earnings } = useAppState();

  const [activeSlide, setActiveSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // Scroll to top immediately on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Automatic slideshow timer every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % PRODUCT_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Security Check: Page only accessible to logged-in publishers
  if (!currentUser || currentUser.type !== 'publisher') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#0d1628] rounded-3xl p-8 sm:p-10 border-2 border-rose-500/30 dark:border-rose-900/40 shadow-2xl text-center space-y-6 animate-fade-up">
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-rose-200 dark:border-rose-800/40">
            <Lock className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight uppercase">
              Access Restricted
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              This Sponsorship Offer is strictly accessible to logged-in Publishers. Please authenticate into your Publisher Dashboard to view and participate in this campaign.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-left space-y-1 text-xs">
            <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>Authentication Error</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              No active publisher session detected. Direct URL access without login is blocked.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/Dashboard')}
            className="w-full py-4 bg-brand-primary hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer"
          >
            Log In To Publisher Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Calculate Referral AngelOne First Earnings logic
  const mySponsorId = currentUser.id.toUpperCase();

  // Find all clients who registered with my Invite Code
  const myReferredClients = publishers.filter(
    (p) => p.inviteCode && p.inviteCode.trim().toUpperCase() === mySponsorId
  );

  const isAngelOneCampaign = (name: string) => {
    const lower = (name || '').toLowerCase();
    return lower.includes('angel');
  };

  const approvedStatuses = ['approved', 'Approved', 'Payment Done', 'Trade Done', 'Active', 'Process'];

  const allReferralRecords: ReferralDetail[] = [];

  myReferredClients.forEach((client) => {
    // Gather ALL earnings and approved submissions for this client across ALL campaigns
    const clientEarnings = earnings.filter((e) => e.publisherId === client.id && e.campaignName);
    const clientSubs = submissions.filter(
      (s) => s.publisherId === client.id && s.campaignName && approvedStatuses.includes(s.status)
    );

    type ClientActivity = { dateStr: string; campaignName: string };
    const activities: ClientActivity[] = [];

    clientEarnings.forEach((e) => {
      if (e.date) activities.push({ dateStr: e.date, campaignName: e.campaignName });
    });
    clientSubs.forEach((s) => {
      if (s.submitDate) activities.push({ dateStr: s.submitDate, campaignName: s.campaignName });
    });

    if (activities.length > 0) {
      // Sort activities ascending by date to find the client's EARLIEST (VERY FIRST) earning/submission
      activities.sort((a, b) => a.dateStr.localeCompare(b.dateStr));
      const firstActivity = activities[0];

      // STRICT RULE: The client's VERY FIRST earning/lead MUST be on AngelOne
      // If the client's first earning was on another campaign (e.g., ICICI, Axis), they do NOT qualify for the offer
      if (isAngelOneCampaign(firstActivity.campaignName)) {
        const firstDateStr = firstActivity.dateStr.substring(0, 10);

        // Parse month string (e.g. "July 2026")
        const d = new Date(firstDateStr);
        let monthKey = `${d.toLocaleString('en-US', { month: 'long' })} ${d.getFullYear()}`;
        if (isNaN(d.getTime())) {
          const now = new Date();
          monthKey = `${now.toLocaleString('en-US', { month: 'long' })} ${now.getFullYear()}`;
        }

        allReferralRecords.push({
          clientId: client.id,
          clientName: client.name,
          firstAngelOneDate: firstDateStr,
          monthKey
        });
      }
    }
  });

  // Get current active month string (e.g. "July 2026")
  const currentMonthDate = new Date();
  const currentMonthKey = `${currentMonthDate.toLocaleString('en-US', { month: 'long' })} ${currentMonthDate.getFullYear()}`;

  // Current month completed AngelOne referrals (1 point per unique referred client)
  const currentMonthReferrals = allReferralRecords.filter(
    (r) => r.monthKey === currentMonthKey
  );

  // Total completed tasks this month (capped at 20)
  const completedCount = Math.min(currentMonthReferrals.length, 20);

  // Generate monthly history list (last 3 months only: current month and past 2 months)
  const monthsMap = new Map<string, number>();
  // Initialize last 3 months
  for (let i = 0; i < 3; i++) {
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - i);
    const mKey = `${pastDate.toLocaleString('en-US', { month: 'long' })} ${pastDate.getFullYear()}`;
    monthsMap.set(mKey, 0);
  }

  // Populate actual counts from referral records
  allReferralRecords.forEach((rec) => {
    if (monthsMap.has(rec.monthKey)) {
      const existing = monthsMap.get(rec.monthKey) || 0;
      monthsMap.set(rec.monthKey, existing + 1);
    }
  });

  const monthlyHistory = Array.from(monthsMap.entries()).map(([mKey, count]) => ({
    monthName: mKey,
    taskCount: Math.min(count, 20),
    isEligible: count >= 20,
    isCurrentMonth: mKey === currentMonthKey
  }));

  const copyInviteCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUser.id);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div id="sponsorship-offer-page" className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-up">
      
      {/* Top Header Row with Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/80 pb-5">
        <button
          onClick={() => onNavigate('/Dashboard')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0d1628] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-xs uppercase tracking-wider rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-brand-primary group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-indigo-500/10 p-2.5 px-4 rounded-2xl border border-blue-500/20">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
            Sponsor ID: <span className="text-sky-500 font-mono">{currentUser.id}</span>
          </span>
          <button
            onClick={copyInviteCode}
            className="ml-2 p-1 text-slate-400 hover:text-sky-500 transition-colors"
            title="Copy Invite Code"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Campaign Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0a1224] to-slate-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Side: Animated Product Slideshow */}
          <div className="md:col-span-6 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[340px] bg-slate-950/80 rounded-3xl border border-slate-800/80 p-4 overflow-hidden shadow-2xl group">
              
              {/* Animated Image Slide */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={PRODUCT_SLIDES[activeSlide].id}
                  src={PRODUCT_SLIDES[activeSlide].image}
                  alt={PRODUCT_SLIDES[activeSlide].title}
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="w-full h-full object-cover rounded-2xl filter drop-shadow-xl"
                />
              </AnimatePresence>

              {/* Manual Nav Controls */}
              <button
                onClick={() => setActiveSlide((prev) => (prev === 0 ? PRODUCT_SLIDES.length - 1 : prev - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/80 text-white hover:bg-sky-500 transition-colors flex items-center justify-center border border-slate-700/60 z-20 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % PRODUCT_SLIDES.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/80 text-white hover:bg-sky-500 transition-colors flex items-center justify-center border border-slate-700/60 z-20 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center items-center gap-1.5">
                {PRODUCT_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${activeSlide === idx ? 'w-6 bg-sky-400' : 'w-1.5 bg-slate-700'}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center mt-3 space-y-0.5">
              <h4 className="text-sm font-bold text-white tracking-wide">
                {PRODUCT_SLIDES[activeSlide].title}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium">
                {PRODUCT_SLIDES[activeSlide].subtitle}
              </p>
            </div>
          </div>

          {/* Right Side: Campaign Details & Title */}
          <div className="md:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-400 font-extrabold text-[10px] uppercase tracking-widest">
              <Trophy className="w-3.5 h-3.5" />
              <span>Special Sponsor Reward Campaign</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                Blender Mixer Juicer | Smoothies & Juices
              </h1>

              {/* Price Row */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-lg font-bold text-slate-400 line-through">₹1,299</span>
                <span className="bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest px-3 py-1 rounded-full shadow-lg animate-pulse">
                  FREE REWARD
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60">
              Complete 20 AngelOne client referrals to get this Blender Mixer Juicer for FREE!
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Ask clients to enter your Sponsor ID <strong className="text-sky-400 font-mono">{currentUser.id}</strong> during registration.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>When your client completes their <strong>first AngelOne earning</strong>, 1 Task Point unlocks automatically.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Subsequent AngelOne earnings by the same client do not add extra points. Only 1 point per referred client.</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Progress Grid Section: 20 Boxes (4/4/4/4/4 Layout) */}
      <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-sky-500" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {currentMonthKey} Target Progress
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track your 20 AngelOne client referrals. Joined clients display their Name and User ID in green.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500">Progress:</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {completedCount} / 20 Completed
            </span>
          </div>
        </div>

        {/* 20 Boxes Grid - Ultra Compact (4 per row on mobile, 5 per row on desktop) */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-2.5">
          {Array.from({ length: 20 }).map((_, index) => {
            const boxNum = index + 1;
            const isCompleted = index < completedCount;
            const clientDetail = isCompleted ? currentMonthReferrals[index] : undefined;

            return (
              <div
                key={boxNum}
                className={`relative p-2 py-2.5 rounded-xl border transition-all duration-200 flex flex-col items-center justify-between gap-1 min-h-[74px] ${
                  isCompleted
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400 text-white shadow-sm'
                    : 'bg-rose-50/80 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400'
                }`}
              >
                <div className="flex items-center justify-between w-full text-[9px] font-black uppercase tracking-tight opacity-90">
                  <span>#{boxNum}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  )}
                </div>

                <div className="w-full text-center my-auto px-0.5">
                  {isCompleted ? (
                    <span className="text-[10px] font-black block truncate text-white leading-tight" title={clientDetail?.clientName}>
                      {clientDetail?.clientName || 'Joined Client'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold block text-rose-600/90 dark:text-rose-400/90 leading-tight">
                      Locked
                    </span>
                  )}
                </div>

                <div className="text-[8px] font-black uppercase tracking-wider px-1 py-0.5 rounded-md bg-black/10 dark:bg-white/10 w-full text-center truncate font-mono">
                  {isCompleted ? (clientDetail?.clientId || 'User ID') : 'Pending'}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Monthly History Records Section */}
      <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <Calendar className="w-5 h-5 text-brand-primary" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Monthly Referral Records
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monthlyHistory.map((item) => (
            <div
              key={item.monthName}
              className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all ${
                item.isCurrentMonth
                  ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-400 dark:border-blue-700/60'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {item.monthName}
                  </span>
                  {item.isCurrentMonth && (
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-500 text-white">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Task {String(item.taskCount).padStart(2, '0')}/20 Completed
                </div>
              </div>

              <div>
                {item.isEligible ? (
                  <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60">
                    <Award className="w-4 h-4" />
                    <span>Eligible</span>
                  </span>
                ) : item.isCurrentMonth ? (
                  <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800/60">
                    <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>In Progress</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800/60">
                    <XCircle className="w-4 h-4" />
                    <span>Not Eligible</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
