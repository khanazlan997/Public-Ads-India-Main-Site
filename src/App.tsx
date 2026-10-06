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
import NotFoundView from './components/NotFoundView';
import BlogPage from './components/BlogPage';
import AboutUs from './components/AboutUs';
import Overview from './components/Overview';
import TermsAndConditions from './components/TermsAndConditions';
import ResourceHub from './components/ResourceHub';
import IndustrySolutions from './components/IndustrySolutions';
import BecomeAPartner from './components/BecomeAPartner';
import BusinessSitemap from './components/BusinessSitemap';
import ZeroInvestmentLanding from './components/ZeroInvestmentLanding';
import CongratsModal from './components/CongratsModal';
import OfflineIndicator from './components/OfflineIndicator';
import { motion, AnimatePresence } from 'motion/react';

import { getHourlyHeadline } from './data/seoHeadlines';

// Helper to normalize route paths
function normalizeRoute(rawPath: string): string {
  const lower = rawPath.toLowerCase().trim();
  if (lower === '/home' || lower === '/' || lower === '') return '/Home';
  if (lower === '/dashboard' || lower.startsWith('/dashboard/') || lower.startsWith('/dashboard?') || lower === '/signin' || lower === '/login' || lower === '/publisher-login') return '/Dashboard';
  if (lower === '/admin') return '/Admin';
  if (lower === '/partner') return '/Partner';
  if (lower === '/employee') return '/Employee';
  if (lower === '/ads-earning') return '/ads-earning';
  if (lower === '/blogpage' || lower === '/blog' || lower.startsWith('/blog/')) return lower;
  if (lower === '/zero-investment-work' || lower === '/zero-investment' || lower === '/zero-investment-company') return '/zero-investment-work';
  if (lower === '/aboutus' || lower === '/about') return '/aboutus';
  if (lower === '/overview') return '/overview';
  if (lower === '/termandcondition' || lower === '/terms' || lower === '/termsandconditions' || lower === '/terms-and-conditions') return '/termandcondition';
  if (lower === '/resource' || lower === '/resources' || lower === '/resourcehub') return '/resource';
  if (lower === '/industry' || lower === '/industries' || lower === '/industrysolutions' || lower === '/advertiser' || lower === '/advertiser-apply' || lower === '/advertise') return '/industry';
  if (lower === '/becomeapartner' || lower === '/become-a-partner' || lower === '/partnerships' || lower === '/partner-signup' || lower === '/partnersignup') return '/becomeapartner';
  if (lower === '/sitemap' || lower === '/business-sitemap') return '/sitemap';
  return '/404';
}

// Sub App content receiver that utilizes state context
function AppContent() {
  const { theme, currentUser, quotaError, congratsPopupInfo, setCongratsPopupInfo } = useAppState();
  
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
      
      const hash = window.location.hash;
      let path = '/Home';

      if (hash && hash !== '#') {
        const cleanHash = `/${hash.slice(1).replace(/^\/+/, '')}`;
        path = hash.toLowerCase().includes('dashboard') ? '/Dashboard' : normalizeRoute(cleanHash);
      } else {
        const pathname = window.location.pathname;
        if (pathname && pathname !== '/') {
          path = normalizeRoute(pathname);
          window.location.hash = `#${path}`;
          window.history.replaceState(null, '', '/');
        } else {
          path = '/Home';
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
    const normalized = normalizeRoute(newRoute);
    setIsPageNavigating(true);
    setRoute(normalized);
    window.location.hash = `#${normalized}`;
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

  // Dynamic Hourly SEO & Sitelink Title Sync
  useEffect(() => {
    const updateSeo = () => {
      const lowerRoute = route.toLowerCase();
      let title = '';
      let description = '';

      if (lowerRoute === '/zero-investment-work') {
        title = "Zero Investment Work | Public Ads India | India's #1 Zero Investment Platform";
        description = "Start 100% Zero Investment Work with Public Ads India. Demat account opening tasks, telecalling projects, and daily UPI bank payouts. Free registration!";
      } else if (lowerRoute === '/dashboard' || lowerRoute === '/signin' || lowerRoute === '/login') {
        title = "Publisher Sign In | Public Ads India | Access Live Earnings & Campaigns";
        description = "Sign in to your Public Ads India publisher portal. Track live lead verification, view active Demat campaigns, and disburse daily wallet payouts.";
      } else if (lowerRoute === '/becomeapartner' || lowerRoute === '/partner') {
        title = "Partner Sign Up | Public Ads India | #1 Zero Investment Agency Franchise";
        description = "Become an authorized partner or team leader with Public Ads India. Lead telecalling teams, access bulk CPA offers, and earn master tier commissions.";
      } else if (lowerRoute === '/industry') {
        title = "Advertiser Apply | Public Ads India | High Conversion Financial Leads";
        description = "Promote your stockbroking, banking, and Demat apps with Public Ads India's verified network of active calling agents across India.";
      } else if (lowerRoute === '/overview') {
        title = "Work Overview | Public Ads India | Demat Opening & Telecalling Rates";
        description = "Learn how Demat account opening and telecalling work operates at Public Ads India. Check commission rates, daily payout cycles, and guidelines.";
      } else if (lowerRoute === '/resource') {
        title = "Resource Hub | Public Ads India | Publisher Tutorials & Lead Guides";
        description = "Access complete step-by-step guides, stockbroking CPA tutorials, and payment rules for zero investment work on Public Ads India.";
      } else if (lowerRoute === '/blogpage' || lowerRoute.startsWith('/blog')) {
        title = "Fintech & Work Blog | Public Ads India | Earning Strategies 2026";
        description = "Read insightful articles on zero investment work, work from home opportunities, Demat account KYC procedures, and daily UPI earning methods.";
      } else if (lowerRoute === '/aboutus') {
        title = "About Us | Public Ads India | 5-Star Rated Fintech Company in Kanpur";
        description = "Learn about Public Ads India's mission, leadership, ISO certification, Kanpur headquarters, and legal compliance as India's #1 Zero Investment Company.";
      } else if (lowerRoute === '/sitemap') {
        title = "Business Sitemap Directory | Public Ads India Official Links";
        description = "Complete directory of all pages, publisher portals, franchise applications, and resource hubs on Public Ads India.";
      } else if (lowerRoute === '/admin') {
        title = "Admin Console | Public Ads India Management Panel";
        description = "Secure administrator control panel for campaign status, MIS approvals, and publisher settlements.";
      } else {
        const hourly = getHourlyHeadline();
        title = hourly.title;
        description = hourly.description;
      }

      if (title) document.title = title;
      if (description) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', description);
      }
    };

    updateSeo();
    const interval = setInterval(updateSeo, 60000);
    return () => clearInterval(interval);
  }, [route]);

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
      {!isAdminActive && <OfferPopup />}

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
            {route.toLowerCase() === '/zero-investment-work' && <ZeroInvestmentLanding onNavigate={navigateTo} />}
            {(route.toLowerCase() === '/blogpage' || route.toLowerCase() === '/blog' || route.toLowerCase().startsWith('/blog/')) && <BlogPage onNavigate={navigateTo} currentRoute={route} />}
            {route.toLowerCase() === '/aboutus' && <AboutUs onNavigate={navigateTo} />}
            {route.toLowerCase() === '/overview' && <Overview onNavigate={navigateTo} />}
            {route.toLowerCase() === '/termandcondition' && <TermsAndConditions onNavigate={navigateTo} />}
            {route.toLowerCase() === '/resource' && <ResourceHub onNavigate={navigateTo} />}
            {route.toLowerCase() === '/industry' && <IndustrySolutions onNavigate={navigateTo} />}
            {route.toLowerCase() === '/becomeapartner' && <BecomeAPartner onNavigate={navigateTo} />}
            {route.toLowerCase() === '/sitemap' && <BusinessSitemap onNavigate={navigateTo} />}
            {!['/home', '/dashboard', '/admin', '/partner', '/employee', '/ads-earning', '/zero-investment-work', '/blogpage', '/blog', '/aboutus', '/overview', '/termandcondition', '/resource', '/industry', '/becomeapartner', '/sitemap'].includes(route.toLowerCase()) && !route.toLowerCase().startsWith('/blog/') && (
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

      <CongratsModal 
        publisherInfo={congratsPopupInfo} 
        onClose={() => setCongratsPopupInfo(null)} 
      />

      <OfflineIndicator />

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
