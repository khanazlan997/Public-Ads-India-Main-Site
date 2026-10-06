import React from 'react';
import { 
  ChevronRight, PhoneCall, Calendar, ShieldCheck, 
  Receipt, CheckCircle2, TrendingUp, Banknote, Building2,
  IndianRupee
} from 'lucide-react';

export default function RecruitmentTender({ onNavigate }: { onNavigate: (route: string) => void }) {
  
  const handleWhatsAppRedirect = () => {
    const text = `Hello Public Ads India, I am interested in the Angelone Traded Campaign (Target: 100 Accounts, Payout: ₹47,000). Please share details on how to start submission!`;
    window.open(`https://wa.me/918934932418?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen py-6 sm:py-10 md:py-14 px-3.5 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      
      {/* Top Section / Breadcrumb */}
      <div>
        <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6 sm:mb-8">
          <button 
            onClick={() => onNavigate('/Home')} 
            className="hover:text-brand-primary dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="text-slate-900 dark:text-white font-bold">Recruitment Tender</span>
        </nav>

        {/* Corporate Trust Badge */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 text-[11px] sm:text-xs font-black mb-3.5 sm:mb-4 shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>Public Ads India Official Recruitment & Tenders</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2 sm:mb-3">
            Angelone Traded <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">Campaign Details</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Official publisher terms, target details, and accurate payout slab breakdown for October Demat Drive.
          </p>
        </div>

        {/* Target Details 2-Column Grid (Fully Responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
          
          {/* Left Card: Campaign Specifications */}
          <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Campaign Specs</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-sky-400 text-[9px] font-extrabold uppercase">
                Active October Drive
              </span>
            </div>
            
            <div className="space-y-3.5">
              <div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Campaign Name</div>
                <div className="text-lg sm:text-xl font-black text-blue-600 dark:text-sky-400 mt-0.5">Angelone Traded</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Target October Month</div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>100 Account Submission With Trade | Add Fund ₹20</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Submission Last Date</div>
                <div className="text-sm sm:text-base font-black text-red-600 dark:text-red-400 flex items-center gap-1.5 mt-0.5 bg-red-50 dark:bg-red-950/40 p-2 sm:p-2.5 rounded-xl border border-red-200/60 dark:border-red-900/40">
                  <Calendar className="w-4 h-4 shrink-0 text-red-500" />
                  <span>25 October (All Account Submited)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Payout Specs */}
          <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Background Graphic */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-100 flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-sky-300" />
                <span>Target Payout</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[9px] font-extrabold uppercase backdrop-blur-sm">
                Guaranteed Disbursal
              </span>
            </div>

            <div className="py-4 sm:py-5">
              <div className="text-xs text-blue-100/90 font-bold uppercase tracking-wider">Total Net Earnings</div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mt-1 drop-shadow-sm">
                ₹47,000
              </div>
              <p className="text-[11px] sm:text-xs text-blue-100/90 mt-2 font-medium leading-relaxed">
                Full milestone payout released directly into your registered bank account or UPI upon 100% completed verification.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-blue-100 font-bold pt-2 border-t border-white/10">
              <ShieldCheck className="w-4 h-4 text-sky-300 shrink-0" />
              <span>Verified CPA Slab Rate (₹470 / Demat)</span>
            </div>
          </div>

        </div>

        {/* Section Header for Bill Table */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Accurate Calculation & Payout Chart (Bill Style)</span>
          </h3>
          <span className="text-[10px] font-bold text-slate-400 sm:hidden">
            Scroll table →
          </span>
        </div>

        {/* Bill Styled HTML Border Table (Highly Responsive & Accurate) */}
        <div className="overflow-x-auto bg-white dark:bg-[#0c1424] rounded-2xl sm:rounded-3xl border-2 border-slate-900/10 dark:border-slate-800 shadow-sm p-1.5 sm:p-2 mb-8 sm:mb-12">
          <table className="w-full border-collapse text-left text-[11px] sm:text-sm text-slate-800 dark:text-slate-200 min-w-[520px]">
            <thead>
              <tr className="border-b-2 border-slate-900/10 dark:border-slate-800 bg-slate-50 dark:bg-[#070e1c] text-slate-500 uppercase text-[9px] sm:text-[10px] font-black tracking-wider">
                <th className="p-2.5 sm:p-3.5 border-r border-slate-900/10 dark:border-slate-800 w-10 text-center">S.No</th>
                <th className="p-2.5 sm:p-3.5 border-r border-slate-900/10 dark:border-slate-800">Item / Campaign Description</th>
                <th className="p-2.5 sm:p-3.5 border-r border-slate-900/10 dark:border-slate-800 text-center w-24">Accounts Target</th>
                <th className="p-2.5 sm:p-3.5 border-r border-slate-900/10 dark:border-slate-800 text-right w-28 sm:w-32">Rate per Demat (CPA)</th>
                <th className="p-2.5 sm:p-3.5 text-right w-32 sm:w-36">Total Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-900/10 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                <td className="p-2.5 sm:p-3.5 border-r border-slate-900/10 dark:border-slate-800 text-center font-bold text-slate-400">1</td>
                <td className="p-2.5 sm:p-3.5 border-r border-slate-900/10 dark:border-slate-800">
                  <div className="font-extrabold text-slate-900 dark:text-white">Angelone Demat Account Opening</div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                    (Includes Account opening, Aadhaar eKYC, and mandatory initial trade setup)
                  </div>
                </td>
                <td className="p-2.5 sm:p-3.5 border-r border-slate-900/10 dark:border-slate-800 text-center font-black text-slate-900 dark:text-white">100</td>
                <td className="p-2.5 sm:p-3.5 border-r border-slate-900/10 dark:border-slate-800 text-right font-extrabold text-slate-700 dark:text-slate-300">₹470.00</td>
                <td className="p-2.5 sm:p-3.5 text-right font-black text-slate-900 dark:text-white">₹47,000.00</td>
              </tr>
              
              {/* Extra Calculation Breakdown / Subtotal Row */}
              <tr className="border-b border-slate-900/10 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/20 font-bold text-[10px] sm:text-xs">
                <td colSpan={2} className="p-2.5 sm:p-3 border-r border-slate-900/10 dark:border-slate-800 text-right text-slate-400">Subtotal:</td>
                <td className="p-2.5 sm:p-3 border-r border-slate-900/10 dark:border-slate-800 text-center text-slate-600 dark:text-slate-400">100 Accounts</td>
                <td className="p-2.5 sm:p-3 border-r border-slate-900/10 dark:border-slate-800 text-right text-slate-600 dark:text-slate-400">CPA Fixed</td>
                <td className="p-2.5 sm:p-3 text-right text-slate-700 dark:text-slate-300">₹47,000.00</td>
              </tr>

              {/* Verified Taxes / Deductions Row (Always zero) */}
              <tr className="border-b border-slate-900/10 dark:border-slate-800 font-bold text-[10px] sm:text-xs">
                <td colSpan={2} className="p-2.5 sm:p-3 border-r border-slate-900/10 dark:border-slate-800 text-right text-slate-400">Platform & Joining Fees:</td>
                <td className="p-2.5 sm:p-3 border-r border-slate-900/10 dark:border-slate-800 text-center text-slate-500">-</td>
                <td className="p-2.5 sm:p-3 border-r border-slate-900/10 dark:border-slate-800 text-right text-emerald-600 dark:text-emerald-400">₹0 (Free Forever)</td>
                <td className="p-2.5 sm:p-3 text-right text-emerald-600 dark:text-emerald-400">₹0.00</td>
              </tr>

              {/* Grand Total Row */}
              <tr className="bg-slate-50 dark:bg-[#070e1c] font-black text-xs sm:text-base border-t-2 border-slate-900/20 dark:border-slate-800">
                <td colSpan={3} className="p-3 sm:p-4 border-r border-slate-900/10 dark:border-slate-800 text-right text-slate-600 dark:text-slate-400">NET GRAND TOTAL:</td>
                <td colSpan={2} className="p-3 sm:p-4 text-right text-emerald-600 dark:text-emerald-400 text-sm sm:text-lg tracking-tight border-double border-b-4 border-emerald-600">
                  ₹47,000.00
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Highly Stylish WhatsApp Contact Box at Bottom */}
        <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#0c1a30] via-[#091124] to-[#040814] border border-blue-500/25 dark:border-blue-900/50 text-center space-y-4 sm:space-y-5 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25d366]/10 text-[#25d366] flex items-center justify-center mx-auto border border-[#25d366]/25 shadow-[0_0_20px_rgba(37,211,102,0.2)]">
            <PhoneCall className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">Join the October Demat Drive</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              Want to book this Angelone Traded campaign slot? Message our Kanpur Corporate Hiring desk on WhatsApp and get started instantly with zero investment.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleWhatsAppRedirect}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 rounded-2xl bg-[#25d366] hover:bg-[#20ba5a] text-white font-black text-xs sm:text-sm tracking-wider transition-all shadow-[0_4px_20px_rgba(37,211,102,0.35)] transform hover:scale-105 active:scale-95 cursor-pointer uppercase"
            >
              <span>Connect on Whatsapp</span>
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
            </button>
          </div>

          <div className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-wide pt-1">
            Official Helpline: <span className="text-slate-200">+91 8934932418</span> (Available 24/7 on WhatsApp)
          </div>
        </div>

      </div>

      {/* Corporate Page Footer exactly as requested */}
      <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-200/60 dark:border-slate-800/80 text-center">
        <p className="text-xs sm:text-sm font-black tracking-widest text-slate-400 uppercase select-none">
          The Trusted Partner Public Ads India
        </p>
      </footer>

    </div>
  );
}
