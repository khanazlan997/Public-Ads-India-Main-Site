import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, Database, ChevronDown, KeyRound, ExternalLink, ShieldCheck, 
  Mail, LogOut, LayoutDashboard, Menu, X, Landmark, Users, LogIn, 
  UserPlus, BookOpen, Network, Briefcase, Calendar, FileText, Layers, 
  HelpCircle, User
} from 'lucide-react';
import { useAppState } from '../context/AppContext';

interface NavbarProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export default function Navbar({ onNavigate, currentRoute }: NavbarProps) {
  const { theme, setTheme, currentUser, logout } = useAppState();
  const [activeDropdown, setActiveDropdown] = useState<'ecosystem' | 'resources' | 'certificates' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (menu: 'ecosystem' | 'resources' | 'certificates') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 220);
  };

  const toggleDropdown = (menu: 'ecosystem' | 'resources' | 'certificates', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(prev => (prev === menu ? null : menu));
  };

  // Close open desktop dropdown on outside click
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
    setActiveDropdown(null);
  };

  const scrollToContact = () => {
    setActiveDropdown(null);
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-15 items-center gap-2">
          
          {/* Left Logo */}
          <div 
            onClick={() => onNavigate('/Home')} 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group relative py-1 shrink-0"
            id="nav-logo"
          >
            {!logoError ? (
              <div className="relative flex items-center">
                {/* Logo Image with enhanced size fitting cleanly inside the header */}
                <div className="relative h-10 sm:h-11 flex items-center justify-center">
                  <img
                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEijSD_VcoYPOVgBiucO3HXuvw0_ZSsIwHThGbE2YvolhBQnY40fTjFgz8gl9Zv-sbSqPQlhmxbtMkMY-98lS41zLsFbPFe5pioxQWN8Ux88eNw37D78fFvIYyNmHrWZfKot-6Y0icFWU4x9KQdqmW82UPHjHyM0LE3q0o3T1Et0UJ3oqPbAQ0HxIMaRBLcM/s2560/1000182948.png"
                    alt="Public Ads India"
                    className="h-9 sm:h-10.5 max-h-11 w-auto object-contain select-none pointer-events-none transition-transform duration-300 group-hover:scale-[1.02]"
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
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-brand-primary rounded-xl flex items-center justify-center text-white font-extrabold shadow-md border border-blue-400/20">
                  <Landmark className="w-5 h-5 text-white" />
                </div>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                  Public Ads <span className="text-brand-accent">India</span>
                </span>
              </div>
            )}
          </div>

          {/* Center Links - Desktop */}
          <div ref={navContainerRef} className="hidden md:flex items-center gap-3 lg:gap-5 shrink-0">
            <button 
              id="nav-link-home"
              onClick={() => { setActiveDropdown(null); onNavigate('/Home'); }}
              className={`text-xs lg:text-sm font-semibold tracking-wide transition-colors ${
                currentRoute === '/Home' 
                  ? 'text-brand-primary dark:text-amber-400' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-amber-400'
              }`}
            >
              Home
            </button>

            {/* Platform / Solutions Dropdown */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('ecosystem')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                id="nav-btn-solutions"
                type="button"
                onClick={(e) => toggleDropdown('ecosystem', e)}
                className={`flex items-center gap-1 text-xs lg:text-sm font-semibold tracking-wide transition-colors cursor-pointer select-none ${
                  ['/overview', '/sitemap', '/industry', '/becomeapartner', '/aboutus'].includes(currentRoute.toLowerCase()) || activeDropdown === 'ecosystem'
                    ? 'text-brand-primary dark:text-amber-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-amber-400'
                }`}
              >
                <span>Ecosystem</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'ecosystem' ? 'rotate-180 text-brand-primary dark:text-amber-400' : ''}`} />
              </button>

              {activeDropdown === 'ecosystem' && (
                <div 
                  className="absolute left-0 top-full pt-1.5 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => handleMouseEnter('ecosystem')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-2xl bg-white dark:bg-[#0c1325] shadow-2xl border border-slate-200/80 dark:border-slate-800 p-2 text-left">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Platform & Network</span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => { setActiveDropdown(null); onNavigate('/overview'); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex flex-col text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 dark:text-white">Platform Overview</span>
                      <span className="text-[10px] text-slate-400">Architecture for publishers & brands</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveDropdown(null); onNavigate('/sitemap'); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex flex-col text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>Business Sitemap</span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-sky-400 rounded font-mono">Diagram</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Interactive 7-stage workflow diagram</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveDropdown(null); onNavigate('/industry'); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex flex-col text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 dark:text-white">Industry Solutions</span>
                      <span className="text-[10px] text-slate-400">Demat, SIP, Apps & Banking funnels</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveDropdown(null); onNavigate('/becomeapartner'); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex flex-col text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 dark:text-white">Become a Partner</span>
                      <span className="text-[10px] text-slate-400">Agency & Master Affiliate tiers</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveDropdown(null); onNavigate('/aboutus'); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex flex-col text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 dark:text-white">About Us</span>
                      <span className="text-[10px] text-slate-400">Mission, team & ISO 9001 standard</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Knowledge & Resources Dropdown */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('resources')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                id="nav-btn-resources"
                type="button"
                onClick={(e) => toggleDropdown('resources', e)}
                className={`flex items-center gap-1 text-xs lg:text-sm font-semibold tracking-wide transition-colors cursor-pointer select-none ${
                  ['/blogpage', '/resource', '/termandcondition'].includes(currentRoute.toLowerCase()) || activeDropdown === 'resources'
                    ? 'text-brand-primary dark:text-amber-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-amber-400'
                }`}
              >
                <span>Resources</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180 text-brand-primary dark:text-amber-400' : ''}`} />
              </button>

              {activeDropdown === 'resources' && (
                <div 
                  className="absolute left-0 top-full pt-1.5 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => handleMouseEnter('resources')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-2xl bg-white dark:bg-[#0c1325] shadow-2xl border border-slate-200/80 dark:border-slate-800 p-2 text-left">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Publisher Insights</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setActiveDropdown(null); onNavigate('/blogpage'); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex flex-col text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 dark:text-white">Blog & Playbooks</span>
                      <span className="text-[10px] text-slate-400">Earning strategies & Demat scaling</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveDropdown(null); onNavigate('/resource'); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex flex-col text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 dark:text-white">Resource Center</span>
                      <span className="text-[10px] text-slate-400">Templates, guides & FAQs</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveDropdown(null); onNavigate('/termandcondition'); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex flex-col text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 dark:text-white">Terms & Conditions</span>
                      <span className="text-[10px] text-slate-400">Publisher rules & quality policies</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Certificates Dropdown */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('certificates')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                id="nav-btn-certificates"
                type="button"
                onClick={(e) => toggleDropdown('certificates', e)}
                className={`flex items-center gap-1 text-xs lg:text-sm font-semibold tracking-wide transition-colors cursor-pointer select-none ${
                  activeDropdown === 'certificates'
                    ? 'text-brand-primary dark:text-amber-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-amber-400'
                }`}
              >
                <span>Certificates</span>
                <ChevronDown className={`w-3.5 h-3.5 lg:w-4 lg:h-4 transition-transform duration-250 ${activeDropdown === 'certificates' ? 'rotate-180 text-brand-primary dark:text-amber-400' : ''}`} />
              </button>

              {activeDropdown === 'certificates' && (
                <div 
                  id="certifications-dropdown"
                  className="absolute left-0 top-full pt-1.5 w-76 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => handleMouseEnter('certificates')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-2xl bg-white dark:bg-[#0c1325] shadow-2xl border border-slate-200/80 dark:border-slate-800 p-2 text-left">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Official Credentials</span>
                    </div>
                    {certificates.map((cert) => (
                      <button
                        key={cert.slug}
                        type="button"
                        onClick={() => handleCertClick(cert.url)}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors flex items-start gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
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
                        type="button"
                        onClick={() => {
                          setActiveDropdown(null);
                          window.open('https://publicads-support.blogspot.com/', '_blank', 'noopener,noreferrer');
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 transition-colors flex items-center justify-between gap-2.5 text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>Visit Old Website</span>
                        </div>
                        <span className="text-[8px] px-1 py-0.5 bg-blue-100 dark:bg-blue-900/60 rounded text-blue-600 dark:text-blue-300 font-mono tracking-wider font-extrabold uppercase animate-pulse">Legacy</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              id="nav-link-contact"
              onClick={scrollToContact}
              className="text-xs lg:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-amber-400 transition-colors"
            >
              Contact Us
            </button>
          </div>

          {/* Right Controls - Desktop */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3.5 shrink-0">
            
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-nav"
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/40 rounded-xl transition-all"
              aria-label="Toggle Theme Mode"
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5 lg:w-5 lg:h-5" /> : <Sun className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-amber-400" />}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 lg:gap-3">
                {/* Router Link based on role */}
                {currentUser.type === 'publisher' && (
                  <button 
                    id="nav-dashboard-shortcut"
                    onClick={() => onNavigate('/Dashboard')}
                    className="flex items-center gap-1.5 lg:gap-2 px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-bold text-white bg-brand-primary hover:bg-blue-700 rounded-xl transition-all shadow-sm"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    My Dashboard
                  </button>
                )}
                {currentUser.type === 'admin' && (
                  <button 
                    id="nav-admin-shortcut"
                    onClick={() => onNavigate('/Admin')}
                    className="flex items-center gap-1.5 lg:gap-2 px-3 py-1.5 lg:px-4 lg:py-2 text-[11px] lg:text-xs font-black text-amber-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-sm"
                  >
                    <Database className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    Admin Portal
                  </button>
                )}
                {currentUser.type === 'employee' && (
                  <button 
                    id="nav-emp-shortcut"
                    onClick={() => onNavigate('/Employee')}
                    className="flex items-center gap-1.5 lg:gap-2 px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm"
                  >
                    <Users className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    Staff Console
                  </button>
                )}
                
                {/* Logout Button */}
                <button
                  id="nav-logout-btn"
                  onClick={() => { logout(); onNavigate('/Home'); }}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors"
                  title="Logout Session"
                >
                  <LogOut className="w-4.5 h-4.5 lg:w-5 lg:h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 lg:gap-2.5">
                <button
                  id="nav-login-signin"
                  onClick={() => onNavigate('/Dashboard')}
                  className="px-2.5 py-1.5 lg:px-3.5 lg:py-2 text-xs lg:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-brand-primary dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl transition-all"
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
                  className="px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-extrabold text-white bg-brand-accent hover:bg-blue-600 rounded-xl transition-all shadow-inner border border-blue-400/20 hover:scale-[1.02] whitespace-nowrap"
                >
                  Partner Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile responsive toggle */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {!currentUser && (
              <button
                id="mobile-top-signin-btn"
                onClick={() => onNavigate('/Dashboard')}
                className="px-2.5 py-1.5 text-xs font-bold text-brand-primary dark:text-sky-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl border border-blue-200/60 dark:border-blue-800/60 active:scale-95 transition-all"
              >
                Sign In
              </button>
            )}
            <button
              id="theme-toggle-nav-mobile"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/40 rounded-xl"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-amber-400" />}
            </button>
            <button
              id="mobile-menu-burger"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Popup & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[60px] bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Popup Container */}
          <div
            id="mobile-menu-drawer"
            className="absolute top-full left-0 right-0 w-full max-h-[85vh] bg-white dark:bg-[#080f22] border-b border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col overflow-hidden md:hidden rounded-b-3xl"
          >
            {/* TOP AUTH & PRIMARY ACTION BLOCK */}
            <div className="p-3.5 sm:p-4 bg-gradient-to-b from-blue-50/70 via-slate-50/40 to-transparent dark:from-blue-950/40 dark:via-[#0c162e]/40 dark:to-transparent border-b border-slate-100 dark:border-slate-800/70 shrink-0">
              {currentUser ? (
                <div className="p-3 rounded-2xl bg-white dark:bg-[#0d1730] border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-brand-primary dark:text-sky-400 flex items-center justify-center font-black text-sm shrink-0">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900 dark:text-white truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-400 font-semibold capitalize">{currentUser.type} Account</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {currentUser.type === 'publisher' && (
                      <button
                        onClick={() => { onNavigate('/Dashboard'); setMobileMenuOpen(false); }}
                        className="px-3 py-1.5 bg-brand-primary text-white text-xs font-black rounded-xl shadow-xs"
                      >
                        Dashboard
                      </button>
                    )}
                    {currentUser.type === 'admin' && (
                      <button
                        onClick={() => { onNavigate('/Admin'); setMobileMenuOpen(false); }}
                        className="px-3 py-1.5 bg-amber-400 text-amber-950 text-xs font-black rounded-xl shadow-xs"
                      >
                        Admin
                      </button>
                    )}
                    {currentUser.type === 'employee' && (
                      <button
                        onClick={() => { onNavigate('/Employee'); setMobileMenuOpen(false); }}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-black rounded-xl shadow-xs"
                      >
                        Employee
                      </button>
                    )}
                    <button
                      onClick={() => { logout(); onNavigate('/Home'); setMobileMenuOpen(false); }}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    id="mobile-nav-signin-btn"
                    onClick={() => { onNavigate('/Dashboard'); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 py-3 px-3 bg-white dark:bg-[#0d1730] text-slate-800 dark:text-white rounded-2xl text-xs font-black border border-slate-200/90 dark:border-slate-700/90 shadow-sm active:scale-95 transition-all"
                  >
                    <LogIn className="w-4 h-4 text-brand-primary" />
                    <span>Sign In</span>
                  </button>

                  <button
                    id="mobile-nav-signup-btn"
                    onClick={() => {
                      onNavigate('/Dashboard');
                      setMobileMenuOpen(false);
                      setTimeout(() => {
                        const tab = document.getElementById('tab-signup');
                        if (tab) tab.click();
                      }, 100);
                    }}
                    className="flex items-center justify-center gap-2 py-3 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    <UserPlus className="w-4 h-4 text-white" />
                    <span>Partner Sign Up</span>
                  </button>
                </div>
              )}
            </div>

            {/* Scrollable Navigation Body */}
            <div className="overflow-y-auto px-4 py-3 space-y-4 pb-12 overscroll-contain">
              {/* Core Platform Sections */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2 px-1">
                  Ecosystem & Solutions
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { onNavigate('/Home'); setMobileMenuOpen(false); }}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1426] border border-slate-200/60 dark:border-slate-800/80 text-left hover:border-brand-primary/40 transition-all flex flex-col justify-between"
                  >
                    <span className="text-xs font-black text-slate-900 dark:text-white">Home</span>
                    <span className="text-[10px] text-slate-400 font-medium">Live Campaigns</span>
                  </button>

                  <button
                    onClick={() => { onNavigate('/overview'); setMobileMenuOpen(false); }}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1426] border border-slate-200/60 dark:border-slate-800/80 text-left hover:border-brand-primary/40 transition-all flex flex-col justify-between"
                  >
                    <span className="text-xs font-black text-slate-900 dark:text-white">Overview</span>
                    <span className="text-[10px] text-slate-400 font-medium">Platform Features</span>
                  </button>

                  <button
                    onClick={() => { onNavigate('/sitemap'); setMobileMenuOpen(false); }}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1426] border border-slate-200/60 dark:border-slate-800/80 text-left hover:border-brand-primary/40 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 dark:text-white">Sitemap</span>
                      <span className="text-[8px] font-black px-1.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-brand-primary rounded">Diagram</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">7-Stage Flow</span>
                  </button>

                  <button
                    onClick={() => { onNavigate('/industry'); setMobileMenuOpen(false); }}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1426] border border-slate-200/60 dark:border-slate-800/80 text-left hover:border-brand-primary/40 transition-all flex flex-col justify-between"
                  >
                    <span className="text-xs font-black text-slate-900 dark:text-white">Industry</span>
                    <span className="text-[10px] text-slate-400 font-medium">Demat, SIP & Cards</span>
                  </button>
                </div>
              </div>

              {/* Knowledge & Growth */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2 px-1">
                  Knowledge & Partners
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { onNavigate('/blogpage'); setMobileMenuOpen(false); }}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1426] border border-slate-200/60 dark:border-slate-800/80 text-left hover:border-brand-primary/40 transition-all flex flex-col justify-between"
                  >
                    <span className="text-xs font-black text-slate-900 dark:text-white">Playbooks</span>
                    <span className="text-[10px] text-slate-400 font-medium">Guides & Scaling</span>
                  </button>

                  <button
                    onClick={() => { onNavigate('/resource'); setMobileMenuOpen(false); }}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1426] border border-slate-200/60 dark:border-slate-800/80 text-left hover:border-brand-primary/40 transition-all flex flex-col justify-between"
                  >
                    <span className="text-xs font-black text-slate-900 dark:text-white">Resources</span>
                    <span className="text-[10px] text-slate-400 font-medium">Templates & Scripts</span>
                  </button>

                  <button
                    onClick={() => { onNavigate('/becomeapartner'); setMobileMenuOpen(false); }}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1426] border border-slate-200/60 dark:border-slate-800/80 text-left hover:border-brand-primary/40 transition-all flex flex-col justify-between"
                  >
                    <span className="text-xs font-black text-slate-900 dark:text-white">Join Partner</span>
                    <span className="text-[10px] text-slate-400 font-medium">Agencies & Creators</span>
                  </button>

                  <button
                    onClick={() => { onNavigate('/industry'); setMobileMenuOpen(false); }}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1426] border border-slate-200/60 dark:border-slate-800/80 text-left hover:border-brand-primary/40 transition-all flex flex-col justify-between"
                  >
                    <span className="text-xs font-black text-slate-900 dark:text-white">Industries</span>
                    <span className="text-[10px] text-slate-400 font-medium">Funnels & Demat</span>
                  </button>
                </div>
              </div>

              {/* Company & Compliance */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1426] border border-slate-200/60 dark:border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => { onNavigate('/aboutus'); setMobileMenuOpen(false); }}
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-brand-primary"
                  >
                    About Us
                  </button>
                  <button
                    onClick={() => { onNavigate('/termandcondition'); setMobileMenuOpen(false); }}
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-brand-primary"
                  >
                    Terms & Conditions
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap gap-2">
                  {certificates.map((cert) => (
                    <button
                      key={cert.slug}
                      onClick={() => handleCertClick(cert.url)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-brand-primary py-0.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                      <span>{cert.name}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => { scrollToContact(); setMobileMenuOpen(false); }}
                    className="text-xs font-bold text-brand-primary dark:text-sky-400 flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact Fintech Desk</span>
                  </button>

                  <button
                    onClick={() => { window.open('https://publicads-support.blogspot.com/', '_blank', 'noopener,noreferrer'); setMobileMenuOpen(false); }}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Old Website</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
