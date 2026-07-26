import React, { useState } from 'react';
import { Sun, Moon, Database, ChevronDown, KeyRound, ExternalLink, ShieldCheck, Mail, LogOut, LayoutDashboard, Menu, X, Landmark, Users } from 'lucide-react';
import { useAppState } from '../context/AppContext';

interface NavbarProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export default function Navbar({ onNavigate, currentRoute }: NavbarProps) {
  const { theme, setTheme, currentUser, logout } = useAppState();
  const [certDropdownOpen, setCertDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const certificates = [
    { name: "MSME Certificate", slug: "MEMS", url: "https://drive.google.com/file/d/1K8hSQXDodA03uSR0Jyn4gJ0q8IIdjeyp/view" },
    { name: "Central Vigilance Commission (CVC)", slug: "CVC", url: "https://drive.google.com/file/d/1xfMkIg2X9lJXSLe_vSJ7C4aVq-3F2jTX/view" },
    { name: "Girls Safety Pledge", slug: "Girls Safety", url: "https://drive.google.com/file/d/1DDtQwwdA6CNEg1O5q7sQSkHm9Brhuheq/view" },
    { name: "ISO Certified 9001:2015", slug: "ISO Certificate", url: "https://drive.google.com/file/d/1U4QMzB6kM6UeaS4DidUnhaFexE9qbyqy/view" },
    { name: "Cyber Security Registered", slug: "Cyber Security", url: "https://drive.google.com/file/d/1RKj5aQsf3vc8YqUj5HV0XeBssRa2hJ0Q/view" }
  ];

  const handleCertClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setCertDropdownOpen(false);
  };

  const scrollToContact = () => {
    onNavigate('/Home');
    setTimeout(() => {
      const contactSec = document.getElementById('contact-us-section');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#060d1f]/95 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md transition-colors duration-305">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-15 items-center">
          
          {/* Left Logo - Secured Image Logo from User */}
          <div 
            onClick={() => onNavigate('/Home')} 
            className="flex items-center gap-2.5 cursor-pointer select-none"
            id="nav-logo"
          >
            {!logoError ? (
              <div className="relative h-13 flex items-center select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                <img
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEijSD_VcoYPOVgBiucO3HXuvw0_ZSsIwHThGbE2YvolhBQnY40fTjFgz8gl9Zv-sbSqPQlhmxbtMkMY-98lS41zLsFbPFe5pioxQWN8Ux88eNw37D78fFvIYyNmHrWZfKot-6Y0icFWU4x9KQdqmW82UPHjHyM0LE3q0o3T1Et0UJ3oqPbAQ0HxIMaRBLcM/s2560/1000182948.png"
                  alt="Public Ads India Logo"
                  className="h-11 w-auto object-contain select-none pointer-events-none rounded"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onError={() => setLogoError(true)}
                  referrerPolicy="no-referrer"
                />
                {/* Overlapping guard transparent div blocker to completely shield from right-click downloads */}
                <div 
                  className="absolute inset-0 bg-transparent z-10" 
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ WebkitTouchCallout: 'none' }}
                />
              </div>
            ) : (
              <>
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-extrabold shadow-md border border-blue-400/20">
                  <Landmark className="w-5.5 h-5.5 text-white animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                    Public Ads <span className="text-brand-accent">India</span>
                  </span>
                  <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest mt-0.5 font-mono">
                    Fintech Network
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Center Links - Desktop */}
          <div className="hidden md:flex items-center gap-7">
            <button 
              id="nav-link-home"
              onClick={() => onNavigate('/Home')}
              className={`text-sm font-semibold tracking-wide transition-colors ${
                currentRoute === '/Home' 
                  ? 'text-brand-primary dark:text-amber-400' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-amber-400'
              }`}
            >
              Home
            </button>

            {/* Hidden temporarily as requested:
            <button 
              id="nav-link-ads-earning"
              onClick={() => onNavigate('/Ads-earning')}
              className={`text-sm font-semibold tracking-wide transition-colors ${
                currentRoute.toLowerCase() === '/ads-earning' 
                  ? 'text-brand-primary dark:text-amber-400' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-amber-400'
              }`}
            >
              Ads Earning
            </button> 
            */}

            {/* Certificates Dropdown */}
            <div className="relative">
              <button 
                id="nav-btn-certificates"
                onClick={() => setCertDropdownOpen(!certDropdownOpen)}
                onBlur={() => setTimeout(() => setCertDropdownOpen(false), 200)}
                className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-amber-400 transition-colors"
              >
                Certificates
                <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${certDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {certDropdownOpen && (
                <div 
                  id="certifications-dropdown"
                  className="absolute left-0 mt-3 w-76 rounded-2xl bg-white dark:bg-[#0c1325] shadow-2xl border border-slate-200/80 dark:border-slate-800 p-2 text-left animate-fade-up z-50 animate-duration-200"
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Official Credentials</span>
                  </div>
                  {certificates.map((cert) => (
                    <button
                      key={cert.slug}
                      onClick={() => handleCertClick(cert.url)}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex items-start gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200"
                    >
                      <ShieldCheck className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span>{cert.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal mt-0.5 flex items-center gap-0.5">
                          Verify on Google Drive <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 dark:border-slate-800/80 mt-1.5 pt-1.5 px-1">
                    <button
                      onClick={() => window.open('https://publicads-support.blogspot.com/', '_blank', 'noopener,noreferrer')}
                      className="w-full text-left px-2.5 py-2 rounded-xl bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 transition-colors flex items-center justify-between gap-2.5 text-xs font-bold text-blue-600 dark:text-blue-400"
                    >
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>Visit Old Website</span>
                      </div>
                      <span className="text-[8px] px-1 py-0.5 bg-blue-100 dark:bg-blue-900/60 rounded text-blue-600 dark:text-blue-300 font-mono tracking-wider font-extrabold uppercase animate-pulse">Legacy</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              id="nav-link-contact"
              onClick={scrollToContact}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-amber-400 transition-colors"
            >
              Contact Us
            </button>
          </div>

          {/* Right Controls - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-nav"
              onClick={toggleTheme}
              className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/40 rounded-xl transition-all"
              aria-label="Toggle Theme Mode"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Router Link based on role */}
                {currentUser.type === 'publisher' && (
                  <button 
                    id="nav-dashboard-shortcut"
                    onClick={() => onNavigate('/Dashboard')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-brand-primary hover:bg-blue-700 rounded-xl transition-all shadow-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    My Dashboard
                  </button>
                )}
                {currentUser.type === 'admin' && (
                  <button 
                    id="nav-admin-shortcut"
                    onClick={() => onNavigate('/Admin')}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-black text-amber-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-sm"
                  >
                    <Database className="w-4 h-4" />
                    Admin Portal
                  </button>
                )}
                {currentUser.type === 'employee' && (
                  <button 
                    id="nav-emp-shortcut"
                    onClick={() => onNavigate('/Employee')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm"
                  >
                    <Users className="w-4 h-4" />
                    Staff Console
                  </button>
                )}
                
                {/* Logout Button */}
                <button
                  id="nav-logout-btn"
                  onClick={() => { logout(); onNavigate('/Home'); }}
                  className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors"
                  title="Logout Session"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  id="nav-login-signin"
                  onClick={() => onNavigate('/Dashboard')}
                  className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-brand-primary dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl transition-all"
                >
                  Sign In
                </button>
                <button
                  id="nav-register-signup"
                  onClick={() => {
                    onNavigate('/Dashboard');
                    setTimeout(() => {
                      const tab = document.getElementById('tab-signup');
                      if (tab) tab.click();
                    }, 100);
                  }}
                  className="px-4 py-2.5 text-sm font-extrabold text-white bg-brand-accent hover:bg-blue-600 rounded-xl transition-all shadow-inner border border-blue-400/20 hover:scale-[1.02]"
                >
                  Partner Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile responsive toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              id="theme-toggle-nav-mobile"
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/40 rounded-lg"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>
            <button
              id="mobile-menu-burger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/40 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden bg-white dark:bg-[#060d1f] border-t border-slate-200 dark:border-slate-800/80 p-4 flex flex-col gap-4 animate-fade-up">
          <button 
            onClick={() => { onNavigate('/Home'); setMobileMenuOpen(false); }}
            className="text-left py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-brand-accent transition-colors"
          >
            Home
          </button>

          {/* Hidden temporarily as requested:
          <button 
            onClick={() => { onNavigate('/Ads-earning'); setMobileMenuOpen(false); }}
            className="text-left py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-brand-accent transition-colors"
          >
            Ads Earning
          </button>
          */}
          
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-widest font-mono">Certificates</span>
            {certificates.map((cert) => (
              <button
                key={cert.slug}
                onClick={() => handleCertClick(cert.url)}
                className="text-left pl-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:text-brand-accent dark:hover:text-amber-400"
              >
                <ShieldCheck className="w-4 h-4 text-brand-accent" />
                {cert.name}
              </button>
            ))}
            <button
              onClick={() => { window.open('https://publicads-support.blogspot.com/', '_blank', 'noopener,noreferrer'); setMobileMenuOpen(false); }}
              className="text-left ml-3 mr-1 py-2 px-2.5 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-2 font-bold bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 rounded-xl border border-blue-100/40 dark:border-blue-900/30 transition-all font-sans"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Visit Old Website</span>
            </button>
          </div>

          <button 
            onClick={() => { scrollToContact(); setMobileMenuOpen(false); }}
            className="text-left py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-brand-accent transition-colors"
          >
            Contact Certification Team
          </button>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            {currentUser ? (
              <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold mb-1">Signed in as: {currentUser.name}</span>
                {currentUser.type === 'publisher' && (
                  <button 
                    onClick={() => { onNavigate('/Dashboard'); setMobileMenuOpen(false); }}
                    className="w-full text-center py-2 text-sm font-bold text-white bg-brand-primary rounded-xl"
                  >
                    Go to Dashboard
                  </button>
                )}
                {currentUser.type === 'admin' && (
                  <button 
                    onClick={() => { onNavigate('/Admin'); setMobileMenuOpen(false); }}
                    className="w-full text-center py-2 text-sm font-bold text-amber-950 bg-amber-400 rounded-xl"
                  >
                    Admin Console
                  </button>
                )}
                {currentUser.type === 'employee' && (
                  <button 
                    onClick={() => { onNavigate('/Employee'); setMobileMenuOpen(false); }}
                    className="w-full text-center py-2 text-sm font-bold text-white bg-emerald-600 rounded-xl"
                  >
                    Employee Portal
                  </button>
                )}
                <button
                  onClick={() => { logout(); onNavigate('/Home'); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { onNavigate('/Dashboard'); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2 text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/30"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { 
                    onNavigate('/Dashboard'); 
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      const tab = document.getElementById('tab-signup');
                      if (tab) tab.click();
                    }, 100);
                  }}
                  className="w-full text-center py-2 text-sm font-bold text-white bg-brand-accent rounded-xl"
                >
                  Partner Registration
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
