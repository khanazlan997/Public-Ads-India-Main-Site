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
import NotFoundView from './components/NotFoundView';
import { motion, AnimatePresence } from 'motion/react';

// Sub App content receiver that utilizes state context
function AppContent() {
  const { theme, currentUser, quotaError } = useAppState();
  
  // Custom SPA Routing State
  const [route, setRoute] = useState<string>('/Home');

  // Monitor path modifications from browser address bar or buttons
  useEffect(() => {
    const handleLocationChange = () => {
      // Prioritize hash routing to prevent 404 on refresh in any cloud runtime
      const hash = window.location.hash;
      let path = '/Home';

      if (hash && hash !== '#') {
        // Support both '#/Dashboard' and '#Dashboard' styles
        const cleanHash = hash.replace(/^#\/?/, '/');
        if (['/Home', '/Dashboard', '/Admin', '/Partner', '/Employee'].includes(cleanHash)) {
          path = cleanHash;
        } else {
          path = '/404';
        }
      } else {
        // Fallback or migration: if user is on a clean pathname, translate it to hash so refresh is saved
        const pathname = window.location.pathname;
        if (['/Home', '/Dashboard', '/Admin', '/Partner', '/Employee'].includes(pathname)) {
          path = pathname;
          window.location.hash = `#${pathname}`;
          window.history.replaceState(null, '', '/');
        } else if (pathname !== '/' && pathname !== '') {
          path = '/404';
        }
      }
      setRoute(path);
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
    setRoute(newRoute);
    window.location.hash = `#${newRoute}`;
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

      {/* Quota limit exceeded / Server Busy notification banner */}
      {quotaError && (
        <div className="max-w-7xl mx-auto px-4 pt-4 select-none">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 sm:p-5 flex gap-3.5 items-start shadow-xs">
            <span className="text-xl shrink-0">⚠️</span>
            <div className="space-y-1 text-left">
              <h5 className="text-xs font-black text-amber-850 dark:text-amber-300 uppercase tracking-wider">
                System Status: Firebase Daily Limits Exceeded (फायरबेस डेली लिमिट समाप्त)
              </h5>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium leading-relaxed font-sans">
                Since you have 50+ active clients, the Firebase free-tier limit of 50,000 read requests per day has been exceeded. 
                <strong> All your campaigns and data are 100% safe inside the database</strong>, but Firestore has paused loading new updates temporarily until the limit resets tomorrow or you upgrade your plan.
              </p>
              <p className="text-[10px] text-amber-700 dark:text-amber-450 font-medium leading-relaxed font-sans mt-1">
                <strong>How to Solve (समाधान):</strong> Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-bold text-amber-900 dark:text-amber-200">Firebase Console</a>, select your project <strong>ai-studio-1d3c5653-93f4-411f-bd71-32fe9be35e38</strong>, and click <strong>Upgrade</strong> at the bottom left to change from Spark to <strong>Blaze Plan (Pay as you go)</strong>. This will instantly activate the site for all 50+ users and cost almost nothing (only $0.06 per 100,000 extra reads).
              </p>
            </div>
          </div>
        </div>
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
            {!['/Home', '/Dashboard', '/Admin', '/Partner', '/Employee'].includes(route) && (
              <NotFoundView onNavigate={navigateTo} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

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
