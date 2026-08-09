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
          
          {/* Left Logo - Subtle Professional Independence Day Tricolor Animation */}
          <div 
            onClick={() => onNavigate('/Home')} 
            className="flex items-center gap-3 cursor-pointer select-none group relative py-1"
            id="nav-logo"
          >
            {/* Subtle Tricolor Ambient Glow */}
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#FF671F]/15 via-white/5 to-[#046A38]/15 dark:from-[#FF671F]/20 dark:via-white/5 dark:to-[#046A38]/20 blur-sm pointer-events-none opacity-60 group-hover:opacity-90 transition-opacity animate-patriotic-aura" />

            {!logoError ? (
              <div className="relative flex items-center gap-2.5">
                {/* Logo Badge Container with 3-Step Continuous Loop (Flag 3s -> Falling Flowers 2s -> Loop) */}
                <div className="relative px-2.5 py-1 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-amber-400/50 group-hover:shadow-md">
                  
                  {/* STEP 1: FULL-COVERAGE SHINING INDIAN FLAG OVERLAY (3 Seconds Phase) */}
                  <div 
                    className="absolute inset-0 w-full h-full flex flex-col pointer-events-none z-10 select-none overflow-hidden animate-flag-loop-phase"
                  >
                    {/* Top Stripe: Saffron / Kesariya */}
                    <div className="h-1/3 w-full bg-[#FF671F]" />

                    {/* Middle Stripe: White with Centered Ashok Chakra */}
                    <div className="h-1/3 w-full bg-white relative flex items-center justify-center">
                      {/* 24-Spoke Rotating Ashok Chakra in Deep Navy Blue */}
                      <div className="absolute w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
                        <svg 
                          viewBox="0 0 24 24" 
                          className="w-full h-full animate-chakra-orbit text-[#000080] dark:text-[#000080] drop-shadow-[0_0_1.5px_rgba(0,0,128,0.6)]"
                        >
                          {/* Outer Wheel */}
                          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.3" />
                          {/* Central Hub */}
                          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
                          {/* 24 Exact Spokes */}
                          {Array.from({ length: 24 }).map((_, i) => {
                            const angle = (i * 15 * Math.PI) / 180;
                            const x2 = 12 + 10 * Math.cos(angle);
                            const y2 = 12 + 10 * Math.sin(angle);
                            return (
                              <line
                                key={i}
                                x1="12"
                                y1="12"
                                x2={x2}
                                y2={y2}
                                stroke="currentColor"
                                strokeWidth="0.85"
                              />
                            );
                          })}
                        </svg>
                      </div>
                    </div>

                    {/* Bottom Stripe: India Green */}
                    <div className="h-1/3 w-full bg-[#046A38]" />

                    {/* Continuous Glossy Light Shine / Sheen Sweep across entire Flag */}
                    <div 
                      className="absolute inset-0 w-full h-full pointer-events-none animate-flag-shine"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.7) 55%, transparent 100%)'
                      }}
                    />
                  </div>

                  {/* STEP 2: CELEBRATORY FALLING FLOWER PETALS OVERLAY (2 Seconds Phase) */}
                  <div 
                    className="absolute inset-0 w-full h-full pointer-events-none z-15 select-none overflow-hidden animate-flower-loop-phase"
                  >
                    {/* Petal 1: Saffron Marigold Petal (Left) */}
                    <div className="absolute top-0 left-[8%] animate-petal-1">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#FF671F] fill-current drop-shadow-xs">
                        <path d="M12 2C9 7 5 11 5 15a7 7 0 0014 0c0-4-4-8-7-13z" />
                      </svg>
                    </div>

                    {/* Petal 2: Pure White Jasmine Blossom (Center Left) */}
                    <div className="absolute top-0 left-[22%] animate-petal-2">
                      <svg viewBox="0 0 24 24" className="w-3 h-3 text-white fill-current stroke-amber-200/50 stroke-1 drop-shadow-xs">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 4c-1.5 2-2 4 0 5 2-1 1.5-3 0-5zM12 20c-1.5-2-2-4 0-5 2 1 1.5 3 0 5zM4 12c2-1.5 4-2 5 0-1 2-3 1.5-5 0zM20 12c-2-1.5-4-2-5 0 1 2 3 1.5 5 0z" />
                      </svg>
                    </div>

                    {/* Petal 3: India Green Festive Leaf (Center) */}
                    <div className="absolute top-0 left-[40%] animate-petal-3">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#046A38] fill-current drop-shadow-xs">
                        <path d="M12 2C7 6 6 12 8 18c3 2 9 2 12-2 1-5-3-11-8-14z" />
                      </svg>
                    </div>

                    {/* Petal 4: Golden Saffron Marigold Flower (Center Right) */}
                    <div className="absolute top-0 left-[58%] animate-petal-4">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#FF9933] fill-current drop-shadow-xs">
                        <path d="M12 2l2.5 5 5.5 1-4 4 1 5.5-5-2.5-5 2.5 1-5.5-4-4 5.5-1z" />
                      </svg>
                    </div>

                    {/* Petal 5: White Mogra Petal (Right) */}
                    <div className="absolute top-0 left-[75%] animate-petal-5">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white fill-current stroke-slate-300 stroke-1 drop-shadow-xs">
                        <path d="M12 2C9 7 5 11 5 15a7 7 0 0014 0c0-4-4-8-7-13z" />
                      </svg>
                    </div>

                    {/* Petal 6: Saffron Petal (Far Right) */}
                    <div className="absolute top-0 left-[88%] animate-petal-6">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#FF671F] fill-current drop-shadow-xs">
                        <path d="M12 2C7 6 6 12 8 18c3 2 9 2 12-2 1-5-3-11-8-14z" />
                      </svg>
                    </div>

                    {/* Petal 7: Green Petal (Far Left) */}
                    <div className="absolute top-0 left-[2%] animate-petal-7">
                      <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#10b981] fill-current drop-shadow-xs">
                        <path d="M12 2C9 7 5 11 5 15a7 7 0 0014 0c0-4-4-8-7-13z" />
                      </svg>
                    </div>
                  </div>

                  {/* Logo Image in Normal Proportions */}
                  <div className="relative h-10 sm:h-11 flex items-center justify-center z-0">
                    <img
                      src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEijSD_VcoYPOVgBiucO3HXuvw0_ZSsIwHThGbE2YvolhBQnY40fTjFgz8gl9Zv-sbSqPQlhmxbtMkMY-98lS41zLsFbPFe5pioxQWN8Ux88eNw37D78fFvIYyNmHrWZfKot-6Y0icFWU4x9KQdqmW82UPHjHyM0LE3q0o3T1Et0UJ3oqPbAQ0HxIMaRBLcM/s2560/1000182948.png"
                      alt="Public Ads India"
                      className="h-8.5 sm:h-10 w-auto object-contain select-none pointer-events-none transition-transform duration-300 group-hover:scale-[1.01]"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      onError={() => setLogoError(true)}
                      referrerPolicy="no-referrer"
                    />

                    {/* Shield blocker to guard logo against right clicks */}
                    <div 
                      className="absolute inset-0 bg-transparent z-20" 
                      onContextMenu={(e) => e.preventDefault()}
                      style={{ WebkitTouchCallout: 'none' }}
                    />
                  </div>
                </div>

                {/* Minimalist Executive Patriotic Label */}
                <div className="hidden md:flex flex-col justify-center border-l border-slate-200 dark:border-slate-800/80 pl-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF671F] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF671F]"></span>
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200">
                      Independence Day
                    </span>
                    <span className="text-[11px] leading-none">🇮🇳</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Special Edition
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-extrabold shadow-md border border-blue-400/20 relative overflow-hidden">
                  <Landmark className="w-5.5 h-5.5 text-white animate-pulse relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#FF671F]/40 via-white/20 to-[#046A38]/40 animate-tricolor-flow-smooth" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-none flex items-center gap-1.5">
                    Public Ads <span className="text-brand-accent">India</span> 🇮🇳
                  </span>
                  <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest mt-0.5 font-mono">
                    Independence Day Edition
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
            Contact Fintech Team
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
