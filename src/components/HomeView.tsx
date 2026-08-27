import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Newspaper, Megaphone, Users, Award, Flame, HeartHandshake, CheckCircle2,
  ShieldAlert, ShieldCheck, IndianRupee, ArrowRight, Eye, Mail, Phone, ExternalLink, Search,
  ChevronLeft, ChevronRight, Star, Quote, MessageSquare, ChevronDown, ChevronUp, AlertTriangle, QrCode, X, Download
} from 'lucide-react';
import { useAppState } from '../context/AppContext';
import GeometricBackground from './GeometricBackground';
import { motion, AnimatePresence } from 'motion/react';
import heroPersonImg from '../assets/images/hero_publisher_person_1785087912325.jpg';
import studentBoyImg from '../assets/images/publisher_student_boy_1785088634433.jpg';
import hijabGirlImg from '../assets/images/publisher_niqab_female_1785089088_1785089935267.jpg';
import housewifeImg from '../assets/images/publisher_housewife_1785088658120.jpg';
import agencyFounderImg from '../assets/images/publisher_agency_founder_1785089070901.jpg';

const heroSlides = [
  {
    id: 1,
    img: heroPersonImg,
    alt: "College Student Girl with Laptop",
    role: "College Student",
    earning: "Earned ₹18,400/mo"
  },
  {
    id: 2,
    img: studentBoyImg,
    alt: "Young College Student Boy",
    role: "Youth & Student",
    earning: "Earned ₹14,200/mo"
  },
  {
    id: 3,
    img: hijabGirlImg,
    alt: "Muslim Digital Creator working on Tablet",
    role: "Digital Creator",
    earning: "Earned ₹26,500/mo"
  },
  {
    id: 4,
    img: housewifeImg,
    alt: "Housewife in Saree with Smartphone",
    role: "Homemaker",
    earning: "Earned ₹16,500/mo"
  },
  {
    id: 5,
    img: agencyFounderImg,
    alt: "Official Ad Agency Founder & Executive",
    role: "Agency Founder / CEO",
    earning: "Earned ₹3,00,000/mo"
  }
];

interface HomeViewProps {
  onNavigate: (route: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const { supportPhone, supportEmail, partnerHiringActive, publishers, testimonials, submitAdvertiserInquiry } = useAppState();

  // Testimonials compact toggling state
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);

  // Gama Investor 2.0 states
  const [gamaAccordionOpen, setGamaAccordionOpen] = useState(false);
  const [gamaModalOpen, setGamaModalOpen] = useState(false);
  const [gamaStep, setGamaStep] = useState<'select_amount' | 'show_qr' | 'fill_form'>('select_amount');
  const [gamaAmount, setGamaAmount] = useState<number>(1000);
  const [gamaName, setGamaName] = useState('');
  const [gamaPhone, setGamaPhone] = useState('');
  const [gamaUtr, setGamaUtr] = useState('');

  const handleGamaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gamaName.trim() || !gamaPhone.trim() || !gamaUtr.trim()) return;

    const message = `*GAMA INVESTOR 2.0 PAYMENT SUBMISSION*\n\n` +
      `*Name:* ${gamaName.trim()}\n` +
      `*Number:* ${gamaPhone.trim()}\n` +
      `*Investment Amount:* ₹${gamaAmount}\n` +
      `*UTR / Transaction ID:* ${gamaUtr.trim()}\n\n` +
      `_Submitted via Public Ads India_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919196344494?text=${encodedMessage}`;
    
    // Redirect securely
    window.location.href = whatsappUrl;
    
    // Reset and close modal
    setGamaModalOpen(false);
    setGamaStep('select_amount');
    setGamaName('');
    setGamaPhone('');
    setGamaUtr('');
  };

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

  // Hero 5-person slider auto-play state (7s stay duration)
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  // Preload all hero slide images immediately on mount for zero delay display
  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.img;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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

  const handleAdvertiserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.company) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitAdvertiserInquiry(
        formData.name,
        formData.phone,
        formData.email,
        formData.company,
        formData.campaign
      );
      if (res.success) {
        setAdvFormSubmitted(true);
        // Reset form data for subsequent uses
        setFormData({ name: '', phone: '', email: '', company: '', campaign: '' });
      } else {
        setSubmitError(res.message);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const certificates = [
    { name: "MSME Certificate", slug: "MEMS", url: "https://drive.google.com/file/d/1K8hSQXDodA03uSR0Jyn4gJ0q8IIdjeyp/view", desc: "Govt of India MSME verified enterprise" },
    { name: "Central Vigilance", slug: "CVC", url: "https://drive.google.com/file/d/1xfMkIg2X9lJXSLe_vSJ7C4aVq-3F2jTX/view", desc: "CVC certified anti-corruption pledge" },
    { name: "Girls Safety Pledge", slug: "Girls Safety", url: "https://drive.google.com/file/d/1DDtQwwdA6CNEg1O5q7sQSkHm9Brhuheq/view", desc: "Equal opportunity, safe remote environment" },
    { name: "ISO Certified 9001", slug: "ISO Certificate", url: "https://drive.google.com/file/d/1U4QMzB6kM6UeaS4DidUnhaFexE9qbyqy/view", desc: "International standardization for quality" },
    { name: "Cyber Security Registered", slug: "Cyber Security", url: "https://drive.google.com/file/d/1RKj5aQsf3vc8YqUj5HV0XeBssRa2hJ0Q/view", desc: "Data encryption and secure storage layers" }
  ];

  return (
    <div id="home-view" className="bg-[#f8faff] dark:bg-[#060d1f] text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-4 pb-14 md:pt-8 md:pb-20 px-4 max-w-7xl mx-auto">
        {/* Dynamic Geometric background animation */}
        <GeometricBackground />

        {/* Glow decorative orbs */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-1/5 right-1/10 w-80 h-80 bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none z-0" />
        
        {/* Responsive Grid Layout: Left Content, Right Hero Ring Graphic (PC) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 max-w-7xl mx-auto">
          
          {/* Left Column: Headline, subtext & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left animate-fade-up">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full font-bold text-xs uppercase tracking-wider mb-6 border border-blue-200/50 dark:border-blue-900/40">
              <TrendingUp className="w-4 h-4 text-brand-accent animate-bounce" />
              India's #1 Fintech Publishers Network
            </div>

            {/* Shimmer/Gradient Hero Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-tight select-none">
              <span className="block text-slate-800 dark:text-white">Earn Money.</span>
              <span className="block bg-gradient-to-r from-blue-700 via-blue-500 to-amber-500 bg-clip-text text-transparent shimmer-text my-2">
                Zero Investment.
              </span>
              <span className="block text-slate-900 dark:text-slate-100">100% Real Work.</span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
              Public Ads India connects publishers and advertisers to build powerful campaigns. 
              No investment needed — just your network, dedication, and a smartphone.
            </p>

            {/* Green Pill Badge */}
            <div className="mt-8 inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold text-xs sm:text-sm border border-emerald-200/50 dark:border-emerald-900/30 whitespace-nowrap max-w-full shadow-sm">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
              <span className="truncate">₹0 Investment Required — Start Earning Today</span>
            </div>

            {/* Two CTA Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 max-w-lg mx-auto lg:mx-0">
              <button 
                id="hero-btn-publisher"
                onClick={() => onNavigate('/Dashboard')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_25px_-5px_rgba(59,130,246,0.4)] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] text-sm md:text-base tracking-wide cursor-pointer font-sans"
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
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-[#0d1628] hover:bg-amber-500/10 text-slate-800 dark:text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-lg border-2 border-amber-500 hover:border-amber-600 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] text-sm md:text-base tracking-wide cursor-pointer font-sans"
              >
                <Megaphone className="w-5 h-5 text-amber-500 shrink-0 animate-pulse" />
                Advertiser Inquiry
              </button>
            </div>
          </div>

          {/* Right Column: Hero Ring Graphic with 3D Pop-Out Image (PC / Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center min-h-[420px] lg:min-h-[460px] mt-2 lg:mt-0">
            {/* Hidden preloader cache container to keep all slide images warm in GPU memory */}
            <div className="hidden pointer-events-none opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true">
              {heroSlides.map((slide) => (
                <img key={slide.id} src={slide.img} alt="" loading="eager" />
              ))}
            </div>

            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-70 rounded-3xl pointer-events-none" />

            {/* Floating Colorful Accent Dots */}
            <span className="absolute top-4 right-10 w-3.5 h-3.5 rounded-full bg-blue-500 animate-ping pointer-events-none" />
            <span className="absolute top-16 left-6 w-3 h-3 rounded-full bg-rose-500 pointer-events-none" />
            <span className="absolute bottom-12 left-4 w-3.5 h-3.5 rounded-full bg-amber-400 pointer-events-none" />
            <span className="absolute bottom-8 right-12 w-3 h-3 rounded-full bg-emerald-400 pointer-events-none" />

            {/* MAIN RING & 3D POP-OUT IMAGE CONTAINER WITH 5-PERSON SLIDER */}
            <div className="relative w-[340px] h-[410px] flex items-end justify-center">
              
              {/* Current Featured Role Pill at top of Ring */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 text-white dark:bg-white/95 dark:text-slate-900 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-black tracking-wide shadow-xl border border-white/20 flex items-center gap-2 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shrink-0" />
                <span>{heroSlides[heroSlideIndex].role}</span>
                <span className="text-emerald-400 dark:text-emerald-600 font-extrabold font-mono text-[10px]">{heroSlides[heroSlideIndex].earning}</span>
              </div>

              {/* Big Solid Bright Pink Ring Background */}
              <div className="absolute bottom-0 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-[#ec4899] via-[#f43f5e] to-[#fb7185] dark:from-[#db2777] dark:to-[#e11d48] shadow-[0_20px_60px_rgba(244,63,94,0.35)] flex items-center justify-center overflow-hidden">
                <div className="w-[280px] h-[280px] rounded-full border-2 border-white/20" />
              </div>

              {/* SLIDING 3D POP-OUT IMAGE CONTAINER (Instant cross-fade slide, 7s stay) */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={heroSlideIndex}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute bottom-0 w-[340px] h-[410px] flex items-end justify-center pointer-events-none"
                >
                  {/* LAYER A: Image base clipped inside the circle at bottom */}
                  <div className="absolute bottom-0 w-[300px] h-[300px] rounded-full overflow-hidden z-10 flex items-end justify-center">
                    <img 
                      src={heroSlides[heroSlideIndex].img} 
                      alt={heroSlides[heroSlideIndex].alt}
                      loading="eager"
                      className="w-[320px] h-[380px] object-cover max-w-none transform translate-y-2 rounded-b-[150px]"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* LAYER B: Upper half of Image (Head) popping OUT of the top ring edge */}
                  <div className="relative z-20 w-[320px] h-[380px] flex items-end justify-center overflow-visible">
                    <img 
                      src={heroSlides[heroSlideIndex].img} 
                      alt={heroSlides[heroSlideIndex].alt}
                      loading="eager"
                      className="w-[320px] h-[380px] object-cover max-w-none transform translate-y-2 filter drop-shadow-2xl"
                      style={{
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)'
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Dots & Manual Arrow Controls */}
              <div className="absolute -bottom-9 left-0 right-0 flex items-center justify-center gap-2 z-30">
                <button 
                  onClick={() => setHeroSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-pink-500 hover:text-white flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all cursor-pointer text-xs font-black select-none"
                  title="Previous slide"
                >
                  ‹
                </button>
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setHeroSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                      idx === heroSlideIndex ? 'w-8 bg-pink-500' : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                    }`}
                    title={`${slide.role} (${slide.earning})`}
                  />
                ))}
                <button 
                  onClick={() => setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length)}
                  className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-pink-500 hover:text-white flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all cursor-pointer text-xs font-black select-none"
                  title="Next slide"
                >
                  ›
                </button>
              </div>

              {/* FLOATING BADGE 1: Left Card (2,000+ Active Publishers) */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="absolute top-36 -left-16 xl:-left-20 z-30 bg-white/95 dark:bg-[#0d1628]/95 backdrop-blur-md p-2.5 px-3 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.12)] border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 animate-float-slow"
              >
                <div className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center shadow-md shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-black text-slate-900 dark:text-white leading-none">2,000+</span>
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mt-0.5">Active Publishers</span>
                </div>
              </motion.div>

              {/* FLOATING BADGE 2: Right Card (Our Online Community) */}
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute bottom-2 -right-6 xl:-right-10 z-30 bg-white/95 dark:bg-[#0d1628]/95 backdrop-blur-md p-2.5 px-3.5 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.12)] border border-slate-200/80 dark:border-slate-800 flex flex-col items-center text-center gap-1 min-w-[145px] sm:min-w-[160px]"
              >
                <div className="-mt-5 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Award className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className="text-[11px] font-black text-slate-900 dark:text-white leading-tight">Our Online Community</span>
                <div className="flex -space-x-1.5 my-0.5 items-center">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-[8px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900">A</div>
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-white text-[8px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900">R</div>
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[8px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900">P</div>
                  <div className="px-1.5 h-5 rounded-full bg-indigo-600 text-white text-[8px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm">2000+</div>
                </div>
                <span className="text-[8.5px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">₹5Cr+ Disbursed</span>
              </motion.div>

            </div>
          </div>

        </div>

        {/* Stats Row with count-ups */}
        <div className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-slate-200/60 dark:border-slate-800/60 pt-10 relative z-10 max-w-7xl mx-auto">
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

      </section>

      {/* Gama Investor 2.0 Premium Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden">
          {/* Subtle warning glow indicator */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 rounded-full font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 border border-amber-200/40 dark:border-amber-900/40">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Risk Disclosure
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                GAMA INVESTOR 2.0
              </h2>
              <p className="text-sm font-black text-blue-600 dark:text-brand-accent">
                Public Ads India Partnership
              </p>
              
              <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                Gama Investor is a trading platform which is not SEBI registered. Kindly make your investments at your own risk. Following proper risk management protocols before investing is highly recommended.
              </p>

              {/* Collapsible Dropdown for Terms */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setGamaAccordionOpen(!gamaAccordionOpen)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors focus:outline-none"
                >
                  <span>{gamaAccordionOpen ? 'Hide' : 'Show'} detailed investment and profit terms</span>
                  {gamaAccordionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                  {gamaAccordionOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed font-medium">
                        <p>
                          Invest here at your own risk. We do not provide any guaranteed profits. Our trade accuracy is 80% profit and 20% loss.
                        </p>
                        <p>
                          The minimum investment required is between ₹1,000 and ₹5,000. We strongly advise that you invest only 10% of your total income here.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setGamaStep('select_amount');
                  setGamaModalOpen(true);
                }}
                className="w-full md:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_12px_25px_rgba(245,158,11,0.3)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm md:text-base tracking-wide cursor-pointer uppercase font-sans"
              >
                Invest Now
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Two small green buttons side by side */}
              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <a
                  href="https://docs.google.com/spreadsheets/d/1QJgDaIqXnGFajYty3RQfasRQAt60mNqOQQ00WAzqrJk/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-initial px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Track Trade
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.google.android.apps.docs.editors.sheets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-initial px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download App
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Steps Modal */}
        <AnimatePresence>
          {gamaModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setGamaModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="bg-white dark:bg-[#0d1628] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative z-10 max-h-[90vh] flex flex-col"
              >
                {/* Header */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">GAMA INVESTOR 2.0</h3>
                    <p className="text-[10px] font-bold text-slate-400">Public Ads India Partnership</p>
                  </div>
                  <button
                    onClick={() => setGamaModalOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all focus:outline-none"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-5">
                  {/* Step Progress indicators */}
                  <div className="flex items-center justify-between px-6 text-[10px] font-bold text-slate-400">
                    <span className={gamaStep === 'select_amount' ? 'text-amber-500' : 'text-emerald-500'}>1. Amount</span>
                    <span className="h-px bg-slate-100 dark:bg-slate-800 flex-1 mx-3" />
                    <span className={gamaStep === 'show_qr' ? 'text-amber-500' : gamaStep === 'fill_form' ? 'text-emerald-500' : ''}>2. Scan QR</span>
                    <span className="h-px bg-slate-100 dark:bg-slate-800 flex-1 mx-3" />
                    <span className={gamaStep === 'fill_form' ? 'text-amber-500' : ''}>3. UTR Proof</span>
                  </div>

                  {/* STEP 1: Select Amount */}
                  {gamaStep === 'select_amount' && (
                    <div className="space-y-4 animate-fade-up">
                      <div className="text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                          Choose an investment tier to continue. Ensure proper risk management is followed.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                        {[1000, 2500, 4000, 5000].map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => {
                              setGamaAmount(amount);
                              setGamaStep('show_qr');
                            }}
                            className="relative p-2.5 xs:p-3 sm:p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f192e] dark:to-[#081020] hover:from-emerald-50/30 hover:to-emerald-100/10 dark:hover:from-emerald-950/20 dark:hover:to-emerald-900/10 border border-slate-200/60 dark:border-slate-800/80 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 rounded-2xl text-left flex items-center gap-2 sm:gap-3.5 transition-all duration-300 group active:scale-95 shadow-sm hover:shadow-md cursor-pointer min-w-0 overflow-hidden"
                          >
                            {/* Glowing Graphic Container with Rupee Icon */}
                            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 overflow-hidden transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white shadow-xs">
                              {/* Soft Sweep animation on hover */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" style={{ animationDuration: '1.5s' }} />
                              <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            
                            <div className="min-w-0 flex-1">
                              <span className="block text-[8px] xs:text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider group-hover:text-emerald-500 transition-colors truncate">
                                Investment
                              </span>
                              <span className="block text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white mt-0.5 leading-none truncate">
                                ₹{amount.toLocaleString('en-IN')}
                              </span>
                            </div>

                            {/* Accent Right Arrow on Hover (Only for desktop to avoid squeezing on mobile) */}
                            <div className="hidden md:block absolute right-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                              <ArrowRight className="w-4 h-4 text-emerald-500" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Show QR Code */}
                  {gamaStep === 'show_qr' && (
                    <div className="space-y-5 animate-fade-up text-center">
                      <div>
                        <span className="inline-block text-[10px] font-black bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-200/40 dark:border-amber-900/40">
                          Amount selected: ₹{gamaAmount.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Custom mapped premium QR code */}
                      <div className="bg-white p-3 rounded-3xl border border-slate-100 shadow-sm inline-block mx-auto overflow-hidden">
                        <img
                          src={
                            gamaAmount === 1000
                              ? "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh6yi5sf9oCeQyKjzCEXIs9yvNa4-o9u8yHPmzd9v2W30tMYTwVNYX2IdSKw8BeGJMyfBgbkFj-TcrfY_I1krbeHYAvA11rbhP5yZXBFCl4pCfZd_44cbTtIQPHzKe1c-R2dvdAKx5fDQe7_XVjPC-mGNKu9A3jjzsnA4JdRpvTM63lqrDJaHCasEFfuYvs/s733/1000214029.jpg"
                              : gamaAmount === 2500
                              ? "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhMR7un6Coh-p4Y6GvvUpe7JlX5OUIY0_hd8Y9mBV4JgO-rNo4rRajSPckbYmdNpLbH7gYKZj8kOXzlYk8j-RHJk8zB6cshvbHq1KRJSZTSTieoATDXqGgHpCSlsC6TC_rAXTIG5ie2sBSndx-cRU0xzxOnfgnsYLraLYhDpHesA2xDFIHnLgtme1KC-SVu/s727/1000214030.jpg"
                              : gamaAmount === 4000
                              ? "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhXDonTP6yfvDh4sB2GZ5AxZWNXHHr4258bjOOjcTpGi25j1Mu_4OdY0XpT8WaL5C-C5GmwoIH9TQlCu6qI6q0Q_MlXQXKzR4IZkf59wU_wwYA6dt8t1TTarmK3srauoCfO_vmu0_y5vVeD3E0c5q-nAQWdbbegTsdjklooaxsReZZTUXCwz2TFZd7w4iy7/s730/1000214035.jpg"
                              : "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhkhqUWNhPVTOepcacCZOfDTQqy7SUfIV7EAnIByGOiUdERGdhJljxnWZ3GNXVcK8YpV1NAlekmoKtzXde_Sv8khOUKr6ZSyejtTgMfnNDOgy0bJ8qHnhmx3W6HrpnfyK2kYedZzItmFkOulMDXPZpSNZpg8Md3AMDwLgL0jAtVa46yGzTTPizh12IrTRCP/s726/1000214040.jpg"
                          }
                          alt={`Payment QR Code for ₹${gamaAmount}`}
                          className="w-[200px] h-[200px] object-contain rounded-2xl"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex flex-col items-center justify-center pt-1">
                        <div className="flex items-center gap-2 px-4.5 py-2.5 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/10 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <span className="text-xs font-extrabold tracking-wide uppercase">All UPI Payments Securely Accepted</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setGamaStep('fill_form')}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer text-xs sm:text-sm uppercase tracking-wider"
                      >
                        Paid Amount
                      </button>
                    </div>
                  )}

                  {/* STEP 3: Fill Form */}
                  {gamaStep === 'fill_form' && (
                    <form onSubmit={handleGamaSubmit} className="space-y-4 animate-fade-up">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Investor Name</label>
                        <input
                          type="text"
                          required
                          value={gamaName}
                          onChange={(e) => setGamaName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-amber-500 outline-none text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Mobile Number</label>
                        <input
                          type="tel"
                          required
                          value={gamaPhone}
                          onChange={(e) => setGamaPhone(e.target.value)}
                          placeholder="Enter your mobile number"
                          className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-amber-500 outline-none text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">UTR / Transaction ID</label>
                        <input
                          type="text"
                          required
                          value={gamaUtr}
                          onChange={(e) => setGamaUtr(e.target.value)}
                          placeholder="Enter 12-digit transaction ID"
                          className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-amber-500 outline-none text-slate-900 dark:text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer text-xs sm:text-sm uppercase tracking-wider"
                      >
                        Submit
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
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
                      {submitError && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-400 font-bold text-xs rounded-xl">
                          {submitError}
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          name="name"
                          placeholder="Your Name" 
                          required
                          disabled={isSubmitting}
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full text-xs p-2.5 bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-slate-800 rounded-xl focus:border-amber-500 outline-none text-slate-900 dark:text-white disabled:opacity-50"
                        />
                        <input 
                          type="tel" 
                          name="phone"
                          placeholder="Contact Phone" 
                          required
                          disabled={isSubmitting}
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full text-xs p-2.5 bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-slate-800 rounded-xl focus:border-amber-500 outline-none text-slate-900 dark:text-white disabled:opacity-50"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input 
                          type="email" 
                          name="email"
                          placeholder="Email Address" 
                          required
                          disabled={isSubmitting}
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full text-xs p-2.5 bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-slate-800 rounded-xl focus:border-amber-500 outline-none text-slate-900 dark:text-white disabled:opacity-50"
                        />
                        <input 
                          type="text" 
                          name="company"
                          placeholder="Company Name" 
                          required
                          disabled={isSubmitting}
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full text-xs p-2.5 bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-slate-800 rounded-xl focus:border-amber-500 outline-none text-slate-900 dark:text-white disabled:opacity-50"
                        />
                      </div>
                      <input 
                        type="text" 
                        name="campaign"
                        placeholder="Proposed Campaign Name (e.g. Free Demat Account)" 
                        disabled={isSubmitting}
                        value={formData.campaign}
                        onChange={handleInputChange}
                        className="w-full text-xs p-2.5 bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-slate-800 rounded-xl focus:border-amber-500 outline-none text-slate-900 dark:text-white disabled:opacity-50"
                      />
                      
                      <button
                        type="submit"
                        id="advertiser-submit-btn"
                        disabled={isSubmitting}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[11px] sm:text-xs rounded-xl transition-colors uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            Submitting Inquiry...
                          </>
                        ) : (
                          'Inquiry Now & Apply Rules'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-stretch">
            
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-brand-accent uppercase tracking-widest leading-none">Support Desk</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2.5">
                  Have Any Queries? Talk With Us Directly
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-350 font-medium leading-relaxed mt-4">
                  Our support division and chat team answers account set up requirements, bulk commission triggers, and employer queries programmatically.
                </p>
              </div>
              
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
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">24/7 Active Support Desk</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1 max-w-xs leading-relaxed">
                Our customer success and technical teams remain fully active 24/7. Any doubts or inquiries will receive a professional resolution within 15 minutes.
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

      {/* Public Testimonials Section with Light Lavender and White Background */}
      {testimonials.length > 0 && (
        <section id="public-registry-desk" className="py-16 bg-gradient-to-b from-[#f6f4ff] via-white to-white dark:from-[#0d091e] dark:via-[#090515] dark:to-[#020108] border-t border-purple-100/50 dark:border-slate-800/80 relative overflow-hidden select-none">
          
          {/* Subtle decorative glowing background light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-80 bg-purple-200/15 dark:bg-purple-950/15 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 text-center space-y-3 mb-10 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-amber-400 bg-purple-50 dark:bg-purple-950/30 border border-purple-200/30 dark:border-amber-400/20 shadow-sm">
              <MessageSquare className="w-3.5 h-3.5" />
              Verified Feedback
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              Loved By Over <span className="text-purple-600 dark:text-amber-400">2,000+ Publishers</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg mx-auto">
              Real success stories from our elite remote publishers and campaign performance partners earning consistently with zero investment.
            </p>
          </div>

          {/* INFINITE SMOOTH SLIDING MARQUEE TRACK */}
          <div className="w-full relative py-4 overflow-hidden z-10">
            
            {/* Subtle light/dark fading mask layers */}
            <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-56 bg-gradient-to-r from-[#f6f4ff] via-[#f6f4ff]/50 to-transparent dark:from-[#0d091e] dark:via-[#0d091e]/50 dark:to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-56 bg-gradient-to-l from-white via-white/50 to-transparent dark:from-[#020108] dark:via-[#020108]/50 dark:to-transparent z-20 pointer-events-none" />

            {/* Sliding container with 3 repetitions of the testimonials list to prevent gaps */}
            <div className="flex gap-4 animate-carousel-slide w-max px-4">
              {[...testimonials, ...testimonials, ...testimonials].map((testimonial, idx) => (
                <div
                  key={`${testimonial.id}-${idx}`}
                  className="group relative w-[280px] sm:w-[325px] shrink-0 p-[1px] rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 dark:from-purple-500/10 dark:via-transparent dark:to-amber-500/10 hover:from-purple-500/35 hover:to-blue-500/35 dark:hover:from-purple-500/25 dark:hover:to-amber-500/25 transition-all duration-300"
                >
                  {/* Glassmorphic main panel background */}
                  <div className="bg-white/90 dark:bg-[#0c0a1e]/90 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between h-full shadow-[0_4px_16px_-4px_rgba(150,130,250,0.05)]">
                    <div>
                      {/* Top Quote & Star Rating */}
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                        <Quote className="w-5 h-5 text-purple-200/50 dark:text-slate-800/40" />
                      </div>

                      <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold italic mb-4">
                        "{testimonial.message}"
                      </p>
                    </div>

                    {/* Profile & Verified Info */}
                    <div className="flex items-center gap-2.5 pt-3 border-t border-purple-50/50 dark:border-slate-800/40">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-9 h-9 rounded-full object-cover border border-purple-100/60 dark:border-slate-800/60 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-white leading-tight">
                          {testimonial.name}
                        </h4>
                        <span className="text-[9px] text-purple-600 dark:text-amber-400 font-bold uppercase tracking-wider block">
                          {testimonial.profession}
                        </span>
                      </div>
                      <div className="ml-auto bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* FEEDBACK SUBMISSION LINK */}
          <div className="text-center relative z-10 mt-8 max-w-md mx-auto space-y-2 px-4">
            <a
              href="https://form.svhrt.com/6689209124bae747d62ea087"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:rotate-12" />
              <span>Add Your Feedback</span>
            </a>
          </div>
        </section>
      )}





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
      <footer className="py-10 text-center bg-slate-905 border-t border-slate-200/50 dark:border-slate-800/50 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-7">
          
          {/* Modern ISO 9001:2015 Certification Badge */}
          <div
            id="footer-iso-badge"
            className="inline-flex items-center bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 max-w-full text-left"
          >
            {/* Left Section: CERTIFIED ISO 9001:2015 */}
            <div className="flex flex-col justify-center shrink-0 pr-1">
              <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase select-none">
                CERTIFIED
              </span>
              <span className="text-base sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mt-1 whitespace-nowrap">
                ISO 9001:2015
              </span>
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-8 sm:h-10 md:h-11 bg-slate-200 dark:bg-slate-800 mx-3.5 sm:mx-5 shrink-0" />

            {/* Right Section: Certified quality management system */}
            <div className="flex flex-col justify-center min-w-0 pl-0.5">
              <span className="text-xs sm:text-sm md:text-[14.5px] font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                Certified quality<br className="hidden xs:inline" /> management system
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 tracking-tight truncate">
                Public Ads India Fintech
              </span>
            </div>
          </div>

          {/* Bottom Row: Copyright and Agency Credits */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400 border-t border-slate-200/30 dark:border-slate-800/30 pt-6">
            <div className="flex flex-col items-center sm:items-start gap-0.5">
              <span>&copy; {new Date().getFullYear()} Public Ads India | Fintech Lead Acquirement</span>
              <span className="text-[11px] text-slate-500 font-medium">Established in 2023</span>
            </div>
            <a href="https://bharatx-website-agency.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors font-bold">
              Design by. BharatX Web Agency
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}
