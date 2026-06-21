import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Newspaper, Megaphone, Users, Award, Flame, HeartHandshake, CheckCircle2,
  ShieldAlert, ShieldCheck, IndianRupee, ArrowRight, Eye, Mail, Phone, ExternalLink, Search 
} from 'lucide-react';
import { useAppState } from '../context/AppContext';
import GeometricBackground from './GeometricBackground';
import { motion, AnimatePresence } from 'motion/react';

interface HomeViewProps {
  onNavigate: (route: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const { supportPhone, supportEmail, partnerHiringActive, publishers } = useAppState();
  
  // Public registry search states
  const [registrySearchId, setRegistrySearchId] = useState('');
  const [registrySearchResult, setRegistrySearchResult] = useState<any>(null);
  const [hasRegistrySearched, setHasRegistrySearched] = useState(false);

  const handleRegistryVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrySearchId.trim()) return;
    
    // Check match
    const found = publishers.find(p => 
      p.id.toLowerCase() === registrySearchId.trim().toLowerCase()
    );
    setRegistrySearchResult(found || null);
    setHasRegistrySearched(true);
  };
  
  // Stats counters simulation
  const [activePubs, setActivePubs] = useState(0);
  const [totalPaidOut, setTotalPaidOut] = useState(0);
  const [liveCamps, setLiveCamps] = useState(0);

  // Dynamic calculation for Fintech Trusted Years — increments every year on June 5th (Started June 5, 2023)
  const getFintechYears = () => {
    const startYear = 2023;
    const today = new Date();
    const currentYear = today.getFullYear();
    const june5th = new Date(currentYear, 5, 5); // Month index 5 is June (0-indexed)
    let years = currentYear - startYear;
    if (today < june5th) {
      years--;
    }
    return Math.max(3, years); // Minimum of 3 years
  };

  useEffect(() => {
    // Elegant incremental counters
    const interval = setInterval(() => {
      setActivePubs(prev => (prev < 2000 ? prev + 67 : 2000));
      setTotalPaidOut(prev => (prev < 50000000 ? prev + 1550000 : 50000000));
      setLiveCamps(prev => (prev < 50 ? prev + 2 : 50));
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Advertiser Form
  const [advFormOpen, setAdvFormOpen] = useState(false);
  const [advFormSubmitted, setAdvFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    campaign: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdvertiserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.company) return;
    setAdvFormSubmitted(true);
  };

  const certificates = [
    { name: "MSME Certificate", slug: "MEMS", url: "https://drive.google.com/file/d/1msme-registration-verification/view", desc: "Govt of India MSME verified enterprise" },
    { name: "Central Vigilance", slug: "CVC", url: "https://drive.google.com/file/d/1cvc-honesty-pledge-verified/view", desc: "CVC certified anti-corruption pledge" },
    { name: "Girls Safety Pledge", slug: "Girls Safety", url: "https://drive.google.com/file/d/1girls-safety-compliancy/view", desc: "Equal opportunity, safe remote environment" },
    { name: "ISO Certified 9001", slug: "ISO Certificate", url: "https://drive.google.com/file/d/1iso-certified-quality-assurance/view", desc: "International standardization for quality" },
    { name: "Cyber Security Registered", slug: "Cyber Security", url: "https://drive.google.com/file/d/1cyber-security-framework-compliance/view", desc: "Data encryption and secure storage layers" }
  ];

  return (
    <div id="home-view" className="bg-[#f8faff] dark:bg-[#060d1f] text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-36 px-4 max-w-7xl mx-auto">
        {/* Dynamic Geometric background animation */}
        <GeometricBackground />

        {/* Glow decorative orbs */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-1/5 right-1/10 w-80 h-80 bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none z-0" />
        
        <div className="text-center max-w-4xl mx-auto animate-fade-up relative z-10">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full font-bold text-xs uppercase tracking-wider mb-6 border border-blue-200/50 dark:border-blue-900/40">
            <TrendingUp className="w-4 h-4 text-brand-accent animate-bounce" />
            India's #1 Fintech Ad Network
          </div>

          {/* Shimmer/Gradient Hero Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight select-none">
            <span className="block text-slate-800 dark:text-white">Earn Money.</span>
            <span className="block bg-gradient-to-r from-blue-700 via-blue-500 to-amber-500 bg-clip-text text-transparent shimmer-text my-2">
              Zero Investment.
            </span>
            <span className="block text-slate-900 dark:text-slate-100">100% Real Work.</span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-2xl mx-auto">
            Public Ads India connects publishers and advertisers to build powerful campaigns. 
            No investment needed — just your network, dedication, and a smartphone.
          </p>

          {/* Green Pill Badge */}
          <div className="mt-8 inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold text-xs sm:text-sm border border-emerald-200/50 dark:border-emerald-900/30 whitespace-nowrap max-w-full shadow-sm">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
            <span className="truncate">₹0 Investment Required — Start Earning Today</span>
          </div>

          {/* Two CTA Buttons - Floating Anim */}
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button 
              id="hero-btn-publisher"
              onClick={() => onNavigate('/Dashboard')}
              className="w-full sm:w-auto px-8 py-4 bg-brand-primary hover:bg-blue-700 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2.5 shadow-md border border-blue-400/20 transition-all hover:-translate-y-1 active:translate-y-0 text-sm tracking-wide animate-float-btn cursor-pointer"
            >
              <Newspaper className="w-5 h-5 shrink-0" />
              Publisher Login
            </button>
            <button 
              id="hero-btn-advertiser"
              onClick={() => {
                setAdvFormOpen(true);
                setTimeout(() => {
                  const formElement = document.getElementById('advertiser-inquiry-box');
                  if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-[#0d1628] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-extrabold rounded-2xl flex items-center justify-center gap-2.5 shadow-sm border-2 border-amber-400 hover:border-amber-500 transition-all hover:-translate-y-1 active:translate-y-0 text-sm tracking-wide animate-float-btn cursor-pointer"
            >
              <Megaphone className="w-5 h-5 text-amber-500 shrink-0" />
              Advertiser Inquiry
            </button>
          </div>

          {/* Stats Row with count-ups */}
          <div className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-slate-200/60 dark:border-slate-800/60 pt-10">
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                {activePubs >= 2000 ? "2000+" : `${activePubs}+`}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5 font-sans">
                Active Publishers
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                ₹{totalPaidOut >= 50000000 ? "5Cr+" : `${(totalPaidOut / 10000000).toFixed(1)}Cr+`}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5 font-sans">
                Total Paid Out
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-500">
                {liveCamps >= 50 ? "50+" : `${liveCamps}`}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5 font-sans">
                Live Campaigns
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#10b981]">
                {getFintechYears()}+ Years
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5 font-sans">
                Trusted in Fintech
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Feature Cards Row (3 Cards with translateY hover effect) */}
      <section className="py-16 bg-slate-550/20 dark:bg-[#0a1122]/40 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
              Why Partner With Public Ads India?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              We provide the tools, credentials, of genuine ad programs to let you establish a remote income standard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white dark:bg-[#0d1628] rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800/80 transition-all hover:-translate-y-2 duration-300 hover:shadow-xl group hover:border-blue-400/50">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-brand-primary dark:text-brand-accent mb-6 group-hover:scale-110 transition-transform">
                <IndianRupee className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Zero Capital Investment</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Start earning without spending a single rupee. No onboarding fees, deposit charges, or premium lock-ins. Safe, clean, zero cost.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-[#0d1628] rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800/80 transition-all hover:-translate-y-2 duration-300 hover:shadow-xl group hover:border-[#10b981]/50">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center text-[#10b981] mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Real-Time MIS Tracking</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Monitor your campaign performance and submissions via state-of-the-art dashboards. Automated ledger logs trigger payment changes immediately.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-[#0d1628] rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800/80 transition-all hover:-translate-y-2 duration-300 hover:shadow-xl group hover:border-[#f59e0b]/50">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/30 rounded-xl flex items-center justify-center text-[#f59e0b] mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Accredited Compliance</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                ISO 9001:2015 certified, legally registered, CVC cyber compliant. Every single lead is checked directly against premium backend verifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Choose Your Role Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest font-mono">Bilateral Integration</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">
            Select Your Business Stream
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold mt-2.5">
            Whether you want to generate leads with zero capital or wish to reach millions of prospective Indian customers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card: Publisher */}
          <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-200/85 dark:border-slate-800/85 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-350 border-l-4 border-l-brand-primary">
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100/80 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-brand-primary dark:text-brand-accent mb-5 sm:mb-6">
                <Newspaper className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2.5 sm:mb-3">Become a Publisher</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-5 sm:mb-6">
                Gain direct access to 30+ live financial campaigns (Banks, Demat accounts Opening, Credit cards reference). Promote campaign trackers, collect customer details, write lead proofs, and command premium commission disburse into your Bank UPI/Account on verified trade logs.
              </p>
              
              <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-start gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
                  <span>Free Lifetime Access to Active Campaigns</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
                  <span>Direct payout into Bank UPI with QR upload support</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
                  <span>Video verifications with standard sponsor logs</span>
                </li>
              </ul>
            </div>

            <button
              id="publisher-cta-route"
              onClick={() => onNavigate('/Dashboard')}
              className="w-full py-3 sm:py-4 bg-brand-primary hover:bg-blue-700 text-white font-extrabold rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-md border border-blue-400/20 text-xs sm:text-sm"
            >
              Start Earning - Publisher Portal
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card: Advertiser */}
          <div id="advertiser-inquiry-box" className="bg-white dark:bg-[#0d1628] rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-200/85 dark:border-slate-800/85 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-350 border-l-4 border-l-amber-500">
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100/80 dark:bg-amber-950/40 rounded-2xl flex items-center justify-center text-amber-500 mb-5 sm:mb-6">
                <Megaphone className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2.5 sm:mb-3">Become an Advertiser</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-5 sm:mb-6">
                Connect your business apps or APIs to our massive, audited network of remote publishers. Accelerate customer activation, drive validated lead submission with KYC proofs, and pay exclusively for active acquisitions under CPA/CPL models.
              </p>
              
              {!advFormOpen ? (
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center border border-slate-100 dark:border-slate-800 mb-6 sm:mb-8">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-4 leading-relaxed">
                    Submit verified product criteria, target target markets, and access 500+ active field agencies instantly.
                  </p>
                  <button
                    id="advertiser-trigger-form"
                    onClick={() => setAdvFormOpen(true)}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 bg-amber-500 text-slate-950 font-extrabold text-[11px] sm:text-xs rounded-xl hover:bg-amber-600 transition-colors uppercase tracking-wider"
                  >
                    Open Advertiser Inquiry Form
                  </button>
                </div>
              ) : (
                <div className="mb-6 sm:mb-8">
                  {advFormSubmitted ? (
                    <div id="advertiser-sucess-alert" className="p-4 sm:p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl sm:rounded-2xl text-center animate-fade-up">
                      <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500 mx-auto mb-3" />
                      <h4 className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-400">Inquiry Received Successfully!</h4>
                      <p className="text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-300 font-medium mt-1.5 leading-relaxed">
                        Thank you! Our campaign staff is active Monday-Friday from 11 AM to 4 PM. We will contact you or your company within 48 hours for campaign terms drafting.
                      </p>
                      <button
                        onClick={() => {
                          setAdvFormSubmitted(false);
                          setFormData({ name: '', phone: '', email: '', company: '', campaign: '' });
                        }}
                        className="mt-4 text-[11px] sm:text-xs text-brand-primary dark:text-brand-accent underline font-extrabold"
                      >
                        Submit another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleAdvertiserSubmit} className="space-y-3 bg-slate-50 dark:bg-slate-900/40 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 animate-fade-up">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          name="name"
                          placeholder="Your Name" 
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full text-xs p-2.5 bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-slate-800 rounded-xl focus:border-amber-500 outline-none text-slate-900 dark:text-white"
                        />
                        <input 
                          type="tel" 
                          name="phone"
                          placeholder="Contact Phone" 
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full text-xs p-2.5 bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-slate-800 rounded-xl focus:border-amber-500 outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input 
                          type="email" 
                          name="email"
                          placeholder="Email Address" 
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full text-xs p-2.5 bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-slate-800 rounded-xl focus:border-amber-500 outline-none text-slate-900 dark:text-white"
                        />
                        <input 
                          type="text" 
                          name="company"
                          placeholder="Company Name" 
                          required
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full text-xs p-2.5 bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-slate-800 rounded-xl focus:border-amber-500 outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                      <input 
                        type="text" 
                        name="campaign"
                        placeholder="Proposed Campaign Name (e.g. Free Demat Account)" 
                        value={formData.campaign}
                        onChange={handleInputChange}
                        className="w-full text-xs p-2.5 bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-slate-800 rounded-xl focus:border-amber-500 outline-none text-slate-900 dark:text-white"
                      />
                      
                      <button
                        type="submit"
                        id="advertiser-submit-btn"
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[11px] sm:text-xs rounded-xl transition-colors uppercase tracking-wider"
                      >
                        Inquiry Now & Apply Rules
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            <button
              id="advertiser-bottom-trigger"
              onClick={() => {
                setAdvFormOpen(true);
                const block = document.getElementById('advertiser-inquiry-box');
                if (block) block.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-3 sm:py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-extrabold rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all border border-slate-200/50 dark:border-slate-700 text-xs sm:text-sm"
            >
              Advertiser Action Stream
              <ArrowRight className="w-4 h-4 text-amber-500" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. Certificates Section (5 cards in a row with Google drive references) */}
      <section className="py-16 bg-slate-100/50 dark:bg-[#080e1a]/80 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest font-mono">Government & Trade Compliancy</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Public Advertisers Verifications
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-2">
              Every card below redirect into official PDF files secure on Google Drive cloud servers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {certificates.map((cert) => (
              <a
                key={cert.slug}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-[#0d1628] rounded-2xl p-4 sm:p-5 border border-slate-200/60 dark:border-slate-800/60 hover:shadow-lg transition-transform hover:-translate-y-1 block duration-250 cursor-pointer text-center group hover:border-brand-accent/40"
              >
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center mx-auto text-brand-primary dark:text-brand-accent mb-3 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5.5 h-5.5" />
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-850 dark:text-white truncate sm:whitespace-normal px-1">
                  {cert.name}
                </h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-normal mt-1 mb-3 h-7 overflow-hidden line-clamp-2 px-1">
                  {cert.desc}
                </p>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-accent uppercase tracking-wider group-hover:underline">
                  View Card <ExternalLink className="w-3 h-3 text-brand-accent" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section id="contact-us-section" className="py-16 max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-brand-primary/10 via-brand-accent/5 to-transparent dark:from-blue-950/20 dark:via-blue-900/10 dark:to-transparent rounded-3xl p-5 sm:p-8 md:p-14 border border-blue-100/60 dark:border-blue-900/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
            
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-accent uppercase tracking-widest leading-none">Support Desk Desk</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2.5">
                Have Any Queries? Talk With Us Directly
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-350 font-medium leading-relaxed mt-4">
                Our support division and chat team answers account set up requirements, bulk commission triggers, and employer queries programmatically.
              </p>
              
              <div className="mt-8 space-y-4">
                {/* Email Panel */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white dark:bg-[#0d1628] rounded-xl flex items-center justify-center text-brand-primary dark:text-brand-accent border border-slate-200/50 dark:border-slate-800/80">
                    <Mail className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support Email</span>
                    <a href={`mailto:${supportEmail}`} className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:underline break-all">
                      {supportEmail}
                    </a>
                  </div>
                </div>

                {/* Phone Panel */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white dark:bg-[#0d1628] rounded-xl flex items-center justify-center text-[#10b981] border border-slate-200/50 dark:border-slate-800/80">
                    <Phone className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Help Desk Phone</span>
                    <a href={`tel:${supportPhone}`} className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:underline">
                      {supportPhone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Support timing card & WhatsApp Trigger */}
            <div className="bg-white dark:bg-[#0d1628] rounded-2xl p-5 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 text-center flex flex-col justify-center items-center shadow-sm w-full">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Active Support Timings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1 max-w-xs leading-relaxed">
                Monday to Friday, 11:00 AM to 04:00 PM. All standard tickets resolution complete within 48 hours.
              </p>
              
              <a
                id="whatsapp-trigger-btn"
                href={`https://wa.me/${supportPhone.replace(/\s+/g, '').replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full py-3 sm:py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl sm:rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md text-xs sm:text-sm hover:-translate-y-0.5"
              >
                <svg className="w-5 sm:w-5.5 h-5 sm:h-5.5 fill-white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Instant Assistant
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Public Registry Verification Desk */}
      <section id="public-registry-desk" className="py-16 max-w-7xl mx-auto px-4 border-t border-slate-200/50 dark:border-slate-800/60">
        <div className="bg-slate-50 dark:bg-[#0a1122]/40 rounded-3xl p-6 sm:p-10 md:p-14 border border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest leading-none">Public Licensing Registry</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Official UID Registry Verification Desk
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg mx-auto">
              Verify any registered remote publisher ID across India here. Newly created publisher accounts are immediately saved in our dynamic system registry.
            </p>

            <form onSubmit={handleRegistryVerify} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-stretch mt-8">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter Publisher ID (e.g. PUB1001)"
                  value={registrySearchId}
                  onChange={(e) => {
                    setRegistrySearchId(e.target.value);
                    setHasRegistrySearched(false);
                  }}
                  className="w-full text-xs p-3.5 pl-10 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070d19] rounded-xl outline-none focus:border-brand-primary dark:focus:border-amber-400 font-mono font-bold text-slate-850 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-750 dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                Query Database
              </button>
            </form>

            <AnimatePresence mode="wait">
              {hasRegistrySearched && (
                <div className="mt-8 max-w-md mx-auto">
                  {registrySearchResult ? (
                    <div className="bg-white dark:bg-[#0d1628] rounded-2xl p-6 border-2 border-emerald-500/35 relative overflow-hidden text-left shadow-lg">
                      {/* Decorative stamp element */}
                      <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full border-4 border-dashed border-emerald-500/20 flex items-center justify-center rotate-12 select-none pointer-events-none">
                        <span className="text-[10px] font-black text-emerald-500/30 uppercase tracking-widest">VERIFIED</span>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 flex items-center justify-center text-emerald-500 text-xl font-bold shrink-0">
                          {registrySearchResult.blocked ? '⚠️' : (registrySearchResult.avatar || '👤')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-extrabold text-indigo-600 dark:text-amber-400">{registrySearchResult.id}</span>
                            {registrySearchResult.blocked ? (
                              <span className="text-[9px] px-2 py-0.5 bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-400 rounded-sm font-extrabold uppercase">LOCKED</span>
                            ) : (
                              <span className="text-[9px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 rounded-sm font-extrabold uppercase">ACTIVE REGISTERED</span>
                            )}
                          </div>
                          <h4 className="text-sm font-black text-slate-800 dark:text-white mt-1.5 truncate">{registrySearchResult.name}</h4>
                          <span className="text-[10px] text-slate-400 block font-semibold mt-1">Registry Date: {registrySearchResult.joinedDate}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-105 dark:border-slate-800 flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
                        <span>SECURITY CHECK: SECURED NODE</span>
                        <span className="text-emerald-500 flex items-center gap-0.5">
                          <ShieldCheck className="w-3.5 h-3.5" /> PASSED
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-[#0d1628] rounded-2xl p-6 border-2 border-rose-500/35 text-center shadow-lg">
                      <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 flex items-center justify-center text-rose-500 text-xl font-bold mx-auto mb-3">
                        ❌
                      </div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">ID Not Found</h4>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xs mx-auto">
                        No publisher account matches "<span className="font-mono font-bold text-rose-600">{registrySearchId}</span>" in our active database nodes.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('/Dashboard');
                        }}
                        className="mt-4 text-xs font-bold text-blue-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        Create a Free ID Now <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 6. Bottom 3 Action Links & Trigger Boxes */}
      <section className="py-12 bg-slate-100/40 dark:bg-[#070d19] border-t border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-extrabold leading-tight">Advanced Console Portals</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Action 1: Employees */}
            <button
              id="home-action-employees"
              onClick={() => onNavigate('/Employee')}
              className="bg-white dark:bg-[#0d1628] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/50 hover:-translate-y-1 transition-all text-left flex items-start gap-4 shadow-sm cursor-pointer group"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-emerald-650 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Employees Login
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1">
                  Secure dashboard access for dedicated staff (Payments desk, MIS leads checker).
                </p>
              </div>
            </button>

            {/* Action 2: Become a partner */}
            <button
              id="home-action-partner"
              onClick={() => onNavigate('/Partner')}
              className="bg-white dark:bg-[#0d1628] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-500/50 hover:-translate-y-1 transition-all text-left flex items-start gap-4 shadow-sm cursor-pointer group-middle group"
            >
              <div className="w-12 h-12 bg-amber-100/80 dark:bg-amber-950/40 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Become a Partner
                  {partnerHiringActive ? (
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded font-extrabold uppercase">Open</span>
                  ) : (
                    <span className="text-[9px] bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-400 px-2 py-0.5 rounded font-extrabold uppercase">Paused</span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1">
                  Apply to become an agency lead partner under verified state recruitment guidelines.
                </p>
              </div>
            </button>

            {/* Action 3: Admin panel */}
            <button
              id="home-action-admin"
              onClick={() => onNavigate('/Admin')}
              className="bg-white dark:bg-[#0d1628] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 hover:-translate-y-1 transition-all text-left flex items-start gap-4 shadow-sm cursor-pointer group"
            >
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center text-indigo-500 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Admin Panel
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1">
                  Exclusive portal access reserved for system administrators and founders.
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="py-8 text-center bg-slate-905 border-t border-slate-200/50 dark:border-slate-800/50 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
          <span>&copy; 2025 Public Ads India | Fintech Lead Acquirement Corporation</span>
          <a href="https://bharatx-website-agency.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors font-bold">
            Design by. BharatX Web Agency
          </a>
        </div>
      </footer>

    </div>
  );
}
