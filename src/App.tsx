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
import { motion, AnimatePresence } from 'motion/react';

// Sub App content receiver that utilizes state context
function AppContent() {
  const { theme, currentUser } = useAppState();
  
  // Custom SPA Routing State
  const [route, setRoute] = useState<string>('/Home');

  // Monitor path modifications from browser address bar or buttons
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (['/Home', '/Dashboard', '/Admin', '/Partner', '/Employee'].includes(path)) {
        setRoute(path);
      } else {
        // Fallback to Home if unknown or blank
        setRoute('/Home');
      }
    };

    // Initialize routing on load
    handleLocationChange();

    // Monitor back/forward actions
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Update real URL path dynamically to reflect active panels
  const navigateTo = (newRoute: string) => {
    setRoute(newRoute);
    window.history.pushState(null, '', newRoute);
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
          </motion.div>
        </AnimatePresence>
      </main>

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
