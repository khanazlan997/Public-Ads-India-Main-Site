import React, { useState, useEffect } from 'react';
import { AppProvider, useAppState } from './context/AppContext';
import Navbar from './components/Navbar';
import TickerBar from './components/TickerBar';
import OfferPopup from './components/OfferPopup';
import HomeView from './components/HomeView';
import DashboardView from './components/DashboardView';
import PartnerPanel from './components/PartnerPanel';
import EmployeePanel from './components/EmployeePanel';
import AdminPanel from './components/AdminPanel';
import AdsEarningView from './components/AdsEarningView';
import SponsorshipOffer from './components/SponsorshipOffer';
import NotFoundView from './components/NotFoundView';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, ChevronRight } from 'lucide-react';

// Sub App content receiver that utilizes state context
function AppContent() {
  const { theme, currentUser, quotaError } = useAppState();
  
  // Custom SPA Routing State
  const [route, setRoute] = useState<string>('/Home');
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isPageNavigating, setIsPageNavigating] = useState(false);

  // Initial App Mount Loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Monitor path modifications from browser address bar or buttons
  useEffect(() => {
    const handleLocationChange = () => {
      setIsPageNavigating(true);
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // Prioritize hash routing to prevent 404 on refresh in any cloud runtime
      const hash = window.location.hash;
      let path = '/Home';

      if (hash && hash !== '#') {
        // Support both '#/Dashboard' and '#Dashboard' styles
        const cleanHash = hash.replace(/^#\/?/, '/');
        const lowerHash = cleanHash.toLowerCase();
        if (['/home', '/dashboard', '/admin', '/partner', '/employee', '/ads-earning', '/sponsorship-offer'].includes(lowerHash)) {
          if (lowerHash === '/ads-earning' || lowerHash === '/sponsorship-offer') {
            path = cleanHash; // preserve exact case or allow /sponsorship-offer
          } else {
            path = cleanHash;
          }
        } else {
          path = '/404';
        }
      } else {
        // Fallback or migration: if user is on a clean pathname, translate it to hash so refresh is saved
        const pathname = window.location.pathname;
        const lowerPath = pathname.toLowerCase();
        if (['/home', '/dashboard', '/admin', '/partner', '/employee', '/ads-earning', '/sponsorship-offer'].includes(lowerPath)) {
          path = pathname;
          window.location.hash = `#${pathname}`;
          window.history.replaceState(null, '', '/');
        } else if (pathname !== '/' && pathname !== '') {
          path = '/404';
        }
      }
      setRoute(path);

      // Smooth page loading animation finish
      const navTimer = setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        setIsPageNavigating(false);
      }, 650);
      return () => clearTimeout(navTimer);
    };

    // Initialize routing on load
    handleLocationChange();

    // Monitor popstate and hashchange events
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Update URL via hash dynamically to reflect active panels across refreshes
  const navigateTo = (newRoute: string) => {
    setIsPageNavigating(true);
    setRoute(newRoute);
    window.location.hash = `#${newRoute}`;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setIsPageNavigating(false);
    }, 650);
  };

  // Bind site-wide HTML dark mode Class changes
  useEffect(() => {
    const root = document.documentElement;
    // Admin mode remains light white themed by default specifications,
    // otherwise obey selected site-wide dark preferences
    if (route === '/Admin') {
      root.classList.remove('dark');
    } else {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme, route]);

  // Is Admin workspace active
  const isAdminActive = route === '/Admin';

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${theme === 'dark' && !isAdminActive ? 'bg-[#060d1f] text-slate-100' : 'bg-[#f8faff] text-slate-900'}`}>
      
      {/* Full-Screen PAI Brand Loading Screen (Shown on initial mount & page navigation/signin) */}
      <AnimatePresence mode="wait">
        {(isAppLoading || isPageNavigating) && (
          <motion.div
            key="pai-loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#f8faff] dark:bg-[#060d1f] select-none pointer-events-auto"
          >
            <div className="text-center px-4 flex flex-col items-center justify-center">
              <motion.h1
                initial={{ opacity: 0, scale: 0.88, letterSpacing: "0.1em" }}
                animate={{ 
                  opacity: [0, 1, 1], 
                  scale: [0.88, 1, 0.98], 
                  letterSpacing: ["0.1em", "0.22em", "0.22em"] 
                }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-sky-500 to-indigo-600 bg-clip-text text-transparent filter drop-shadow-[0_4px_20px_rgba(56,189,248,0.25)] leading-none"
              >
                PAI
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-extrabold text-sky-500 mt-3"
              >
                Public Ads India
              </motion.p>
              
              <div className="w-28 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-5 overflow-hidden relative">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                  className="w-full h-full bg-gradient-to-r from-blue-400 via-sky-500 to-indigo-600 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.6)]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promo Alert Announcer Popup */}
      {currentUser?.type === 'publisher' && <OfferPopup />}

      {/* Main sticky glass navigation (Hide explicitly on Admin page for exclusive isolated workspace) */}
      {!isAdminActive && (
        <Navbar onNavigate={navigateTo} currentRoute={route} />
      )}

      {/* Dynamic horizontal continuous horizontal marquee highlight feed */}
      {!isAdminActive && route === '/Home' && (
        <TickerBar />
      )}

      {/* Dynamic transition layout pages wrapper */}
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {route === '/Home' && <HomeView onNavigate={navigateTo} />}
            {route === '/Dashboard' && <DashboardView onNavigate={navigateTo} />}
            {route === '/Admin' && <AdminPanel onNavigate={navigateTo} />}
            {route === '/Partner' && <PartnerPanel onNavigate={navigateTo} />}
            {route === '/Employee' && <EmployeePanel onNavigate={navigateTo} />}
            {route.toLowerCase() === '/ads-earning' && <AdsEarningView onNavigate={navigateTo} />}
            {route.toLowerCase() === '/sponsorship-offer' && <SponsorshipOffer onNavigate={navigateTo} />}
            {!['/home', '/dashboard', '/admin', '/partner', '/employee', '/ads-earning', '/sponsorship-offer'].includes(route.toLowerCase()) && (
              <NotFoundView onNavigate={navigateTo} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Sponsor Offer Overlay Widget (Bottom Left - Fixed to Viewport) */}
      {currentUser?.type === 'publisher' && route.toLowerCase() !== '/sponsorship-offer' && (
        <div className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 z-50">
          <button
            id="sponsor-offer-floating-trigger"
            onClick={() => navigateTo('/sponsorship-offer')}
            className="group relative flex items-center gap-2 sm:gap-2.5 bg-white/95 dark:bg-[#0c162c]/95 backdrop-blur-md text-slate-900 dark:text-white p-1.5 px-3 sm:p-2.5 sm:px-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-sky-500/80 dark:border-sky-400/80 hover:border-sky-500"
            title="Open Sponsor Reward Offer"
          >
            {/* Clean Compact Icon Container with Gift Icon */}
            <div className="relative w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              {/* Active Badge Dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-[#0c162c]" />
            </div>

            {/* Clean Compact Text Labels */}
            <div className="flex flex-col text-left">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-brand-primary dark:text-sky-400 leading-none">
                Special Offer
              </span>
              <span className="text-[10px] sm:text-xs font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-0.5 mt-0.5">
                <span>Sponsor Reward</span>
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Floating WhatsApp Widget */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2">
        <a
          id="whatsapp-floating-trigger"
          href="https://wa.me/918934932418?text=Hello%20Public%20Ads%20Network!%20I%20have%20an%20inquiry%20regarding%20campaigns%20and%20payouts."
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 sm:p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-white/10"
          title="Chat with us on WhatsApp"
        >
          {/* Pulsing outline animation */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:opacity-0 transition-opacity duration-300"></span>
          
          {/* Revealable Tooltip Tag on Hover */}
          <span className="absolute right-14 bg-slate-900 border border-slate-800 dark:border-slate-700/40 text-white text-xs font-black py-1.5 px-3.5 rounded-xl whitespace-nowrap shadow-xl opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none tracking-wide text-center uppercase md:block hidden font-sans">
            Need Help? Chat on WhatsApp
          </span>

          {/* Clean High-Contrast Vector WhatsApp Icon SVG */}
          <svg className="w-6.5 h-6.5 sm:w-7 sm:h-7 fill-white relative z-10 transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
