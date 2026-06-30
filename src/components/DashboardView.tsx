import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '../context/AppContext';
import { 
  IndianRupee, Coins, Calendar, ArrowRight, User, Settings, CheckCircle2, 
  HelpCircle, Copy, AlertCircle, FileText, QrCode, Crown, Trophy, 
  Camera, UploadCloud, Edit3, Sparkles, LogOut, Check, ChevronDown, ChevronRight,
  Lock, X, Download, ExternalLink
} from 'lucide-react';
import { Publisher, BankDetails } from '../types';

// Constant for ₹99 Payment QR Code URL - Paste your image link inside the quotes below:
const PAYMENT_QR_IMAGE_URL = ""; 

// Custom Animated Premium Finance + Geometric canvas mesh for background
function PremiumFinanceGeometricCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isDarkMode = document.documentElement.classList.contains('dark');
    const observer = new MutationObserver(() => {
      isDarkMode = document.documentElement.classList.contains('dark');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    interface FloatingItem {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      type: 'circle' | 'hexagon' | 'rupee' | 'dollar' | 'euro' | 'pound' | 'yen' | 'won' | 'ruble' | 'baht' | 'dong' | 'shekel' | 'peso' | 'percent' | 'arrow' | 'line';
      angle: number;
      spinSpeed: number;
      opacity: number;
    }

    let items: FloatingItem[] = [];

    const initItems = (w: number, h: number) => {
      items = [];
      const types: FloatingItem['type'][] = [
        'circle', 'hexagon', 'rupee', 'dollar', 'euro', 'pound', 
        'yen', 'won', 'ruble', 'baht', 'dong', 'shekel', 'peso', 
        'percent', 'arrow', 'line'
      ];
      // Elegant minimalist count to remain perfectly responsive and non-distracting
      const count = Math.min(22, Math.floor((w * h) / 16000) + 6);
      for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const isCurrencyOrSymbol = type !== 'circle' && type !== 'hexagon' && type !== 'line';
        const size = isCurrencyOrSymbol
          ? Math.random() * 8 + 10 
          : Math.random() * 6 + 3;
        items.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 1.5, // Faster drift (was 0.3)
          vy: (Math.random() - 0.5) * 1.5,
          size,
          type,
          angle: Math.random() * Math.PI * 2,
          spinSpeed: (Math.random() - 0.5) * 0.03, // Faster spin (was 0.006)
          opacity: Math.random() * 0.25 + 0.08,
        });
      }
    };

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initItems(width, height);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
    handleResize();

    const drawItem = (item: FloatingItem) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.angle);
      
      const themeColor = isDarkMode 
        ? `rgba(99, 102, 241, ${item.opacity})` // indigo
        : `rgba(79, 70, 229, ${item.opacity * 0.75})`; // indigo light
      
      const financeColor = isDarkMode
        ? `rgba(52, 211, 153, ${item.opacity})` // emerald
        : `rgba(5, 150, 105, ${item.opacity * 0.75})`; // emerald light

      const isCurrencyType = [
        'rupee', 'dollar', 'euro', 'pound', 'yen', 'won', 
        'ruble', 'baht', 'dong', 'shekel', 'peso', 'percent', 'arrow'
      ].includes(item.type);

      ctx.fillStyle = isCurrencyType 
        ? financeColor 
        : themeColor;
      
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 1;

      if (item.type === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, item.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (item.type === 'hexagon') {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          ctx.lineTo(item.size * Math.cos(angle), item.size * Math.sin(angle));
        }
        ctx.closePath();
        ctx.stroke();
      } else if (item.type === 'rupee') {
        ctx.font = `900 ${Math.round(item.size)}px sans-serif`;
        ctx.fillText('₹', -item.size / 2, item.size / 3);
      } else if (item.type === 'dollar') {
        ctx.font = `900 ${Math.round(item.size)}px sans-serif`;
        ctx.fillText('$', -item.size / 2, item.size / 3);
      } else if (item.type === 'euro') {
        ctx.font = `900 ${Math.round(item.size)}px sans-serif`;
        ctx.fillText('€', -item.size / 2, item.size / 3);
      } else if (item.type === 'pound') {
        ctx.font = `900 ${Math.round(item.size)}px sans-serif`;
        ctx.fillText('£', -item.size / 2, item.size / 3);
      } else if (item.type === 'yen') {
        ctx.font = `900 ${Math.round(item.size)}px sans-serif`;
        ctx.fillText('¥', -item.size / 2, item.size / 3);
      } else if (item.type === 'won') {
        ctx.font = `900 ${Math.round(item.size)}px sans-serif`;
        ctx.fillText('₩', -item.size / 2, item.size / 3);
      } else if (item.type === 'ruble') {
        ctx.font = `900 ${Math.round(item.size)}px sans-serif`;
        ctx.fillText('₽', -item.size / 2, item.size / 3);
      } else if (item.type === 'baht') {
        ctx.font = `900 ${Math.round(item.size)}px sans-serif`;
        ctx.fillText('฿', -item.size / 2, item.size / 3);
      } else if (item.type === 'dong') {
        ctx.font = `900 ${Math.round(item.size)}px sans-serif`;
        ctx.fillText('₫', -item.size / 2, item.size / 3);
      } else if (item.type === 'shekel') {
        ctx.font = `900 ${Math.round(item.size)}px sans-serif`;
        ctx.fillText('₪', -item.size / 2, item.size / 3);
      } else if (item.type === 'peso') {
        ctx.font = `900 ${Math.round(item.size)}px sans-serif`;
        ctx.fillText('₱', -item.size / 2, item.size / 3);
      } else if (item.type === 'percent') {
        ctx.font = `900 ${Math.round(item.size)}px sans-serif`;
        ctx.fillText('%', -item.size / 2, item.size / 3);
      } else if (item.type === 'arrow') {
        ctx.font = `900 ${Math.round(item.size)}px sans-serif`;
        ctx.fillText('↗', -item.size / 2, item.size / 3);
      } else if (item.type === 'line') {
        ctx.beginPath();
        ctx.moveTo(-item.size, 0);
        ctx.lineTo(item.size, 0);
        ctx.stroke();
      }

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Delicate web connections
      ctx.strokeStyle = isDarkMode ? 'rgba(99, 102, 241, 0.04)' : 'rgba(79, 70, 229, 0.05)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const dx = items[i].x - items[j].x;
          const dy = items[i].y - items[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(items[i].x, items[i].y);
            ctx.lineTo(items[j].x, items[j].y);
            ctx.stroke();
          }
        }
      }

      items.forEach((item) => {
        item.x += item.vx;
        item.y += item.vy;
        item.angle += item.spinSpeed;

        if (item.x < -25) item.x = width + 25;
        if (item.x > width + 25) item.x = -25;
        if (item.y < -25) item.y = height + 25;
        if (item.y > height + 25) item.y = -25;

        drawItem(item);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none rounded-3xl">
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
}

interface DashboardViewProps {
  onNavigate: (route: string) => void;
}

type TabType = 'dashboard' | 'campaign' | 'datasubmit' | 'mistracking' | 'verification' | 'topearners' | 'bankupdate';

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const { 
    currentUser, 
    loginPublisher, 
    signupPublisher, 
    logout, 
    publishers, 
    earnings, 
    submissions, 
    campaigns, 
    submitLead, 
    bankDetailsMap, 
    submitBankDetails, 
    updatePublisherProfile,
    supportPhone,
    quotaError,
    hasMoreSubmissions,
    loadMoreSubmissions,
    hasMoreEarnings,
    loadMoreEarnings
  } = useAppState();

  // Active Tab representation
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  // Auth local inputs
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Password recovery flow
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [recoveryMsg, setRecoveryMsg] = useState('');

  // Profile editing state
  const [profileName, setProfileName] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('😎');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showLockPopup, setShowLockPopup] = useState(false);
  const [showPaymentImage, setShowPaymentImage] = useState(false);

  // File states (for screenshot uploads as base64)
  const [screenBase64, setScreenBase64] = useState('');
  const [screenFileName, setScreenFileName] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Bank Form States
  const [bankHolderName, setBankHolderName] = useState('');
  const [bankPhone, setBankPhone] = useState('');
  const [bankEmail, setBankEmail] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [bankUpi, setBankUpi] = useState('');
  const [bankQrCode, setBankQrCode] = useState('');
  const [bankFormMsg, setBankFormMsg] = useState('');

  // Leader submissions inputs
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [leadClientName, setLeadClientName] = useState('');
  const [leadClientPhone, setLeadClientPhone] = useState('');
  const [leadClientCode, setLeadClientCode] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState('');

  // Copied states trackers
  const [copiedCampId, setCopiedCampId] = useState<string | null>(null);

  // Load user profile details on login state change
  useEffect(() => {
    if (currentUser?.type === 'publisher') {
      const p = publishers.find(pub => pub.id === currentUser.id);
      if (p) {
        setProfileName(p.name);
        setProfileAvatar(p.avatar || '😎');

        // Load Bank Details too if present
        const bank = bankDetailsMap[p.id];
        if (bank) {
          setBankHolderName(bank.holderName || p.name);
          setBankPhone(bank.phone || p.phone);
          setBankEmail(bank.email || p.email);
          setBankAccount(bank.accountNumber || '');
          setBankIfsc(bank.ifsc || '');
          setBankUpi(bank.upi || '');
          setBankQrCode(bank.qrCode || '');
        } else {
          setBankHolderName(p.name);
          setBankPhone(p.phone);
          setBankEmail(p.email);
        }
      }
    }
  }, [currentUser, publishers, bankDetailsMap]);

  // Dynamically load and trigger Tally embed script
  useEffect(() => {
    if (activeTab === 'verification') {
      const scriptId = 'tally-js';
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://tally.so/widgets/embed.js';
        script.async = true;
        script.onload = () => {
          // @ts-ignore
          if (typeof Tally !== 'undefined') {
            // @ts-ignore
            Tally.loadEmbeds();
          }
        };
        document.head.appendChild(script);
      } else {
        // @ts-ignore
        if (typeof Tally !== 'undefined') {
          // @ts-ignore
          Tally.loadEmbeds();
        }
      }
    }
  }, [activeTab]);

  // Auth handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (isSignupMode) {
      if (!authName || !authEmail || !authPhone || !authPassword) {
        setAuthError('All registration fields are required.');
        return;
      }
      const res = await signupPublisher(authName, authEmail, authPhone, authPassword);
      if (!res.success) {
        setAuthError(res.message);
      }
    } else {
      if (!authEmail || !authPassword) {
        setAuthError('Email/Phone and Password criteria required.');
        return;
      }
      const res = await loginPublisher(authEmail, authPassword);
      if (!res.success) {
        setAuthError(res.message);
      }
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryMsg('');
    if (!forgotPhone || !forgotEmail) {
      setRecoveryMsg('Both phone and email match values required.');
      return;
    }
    const match = publishers.find(p => p.phone === forgotPhone && p.email === forgotEmail);
    if (match) {
      setRecoveryMsg('DETAILS MATCHED! Contact Administrator at ' + supportPhone + ' or ask to reset details. Admin will immediately allocate key credentials.');
    } else {
      setRecoveryMsg('No matching publisher profile found with these coordinates.');
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    updatePublisherProfile(profileName.trim(), profileAvatar);
    setIsEditingProfile(false);
  };

  // Convert files to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'lead' | 'bank') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1400 * 1024) {
      alert('File is too large! Maximum limit is 1.4 MB to accommodate Cloud Sync limits.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (target === 'lead') {
        setScreenBase64(base64String);
        setScreenFileName(file.name);
      } else {
        setBankQrCode(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Lead Lead code
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');
    setSubmissionSuccess('');

    if (!selectedCampaignId) {
      setSubmissionError('Please select an active campaign vertical.');
      return;
    }
    if (!leadClientName || !leadClientPhone) {
      setSubmissionError('Client name and active phone inputs are required.');
      return;
    }
    if (!screenBase64) {
      setSubmissionError('Screenshot verification of client creation is required.');
      return;
    }

    const res = await submitLead(selectedCampaignId, leadClientName, leadClientPhone, leadClientCode, screenBase64);
    if (res.success) {
      setSubmissionSuccess(res.message);
      // Reset
      setLeadClientName('');
      setLeadClientPhone('');
      setLeadClientCode('');
      setScreenBase64('');
      setScreenFileName('');
    } else {
      setSubmissionError(res.message);
    }
  };

  // Bank Save
  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBankFormMsg('');

    if (!bankAccount || !bankIfsc || !bankUpi) {
      setBankFormMsg('Account No, IFSC, and UPI ID are strictly mandatory.');
      return;
    }

    const details: BankDetails = {
      publisherId: currentUser!.id,
      holderName: bankHolderName,
      phone: bankPhone,
      email: bankEmail,
      accountNumber: bankAccount,
      ifsc: bankIfsc,
      upi: bankUpi,
      qrCode: bankQrCode
    };

    const res = await submitBankDetails(details);
    setBankFormMsg(res.message);
  };

  // Copy clip
  const copyCampLink = (link: string, id: string) => {
    const fallbackCopy = (text: string) => {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
          setCopiedCampId(id);
          setTimeout(() => setCopiedCampId(null), 2000);
        } else {
          console.error("Fallback execution copy failed");
        }
      } catch (err) {
        console.error("Fallback copy failed", err);
      }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link)
        .then(() => {
          setCopiedCampId(id);
          setTimeout(() => setCopiedCampId(null), 2000);
        })
        .catch(() => {
          fallbackCopy(link);
        });
    } else {
      fallbackCopy(link);
    }
  };

  // Helper calculation metrics
  const getPublisherEarnings = (pubId: string) => {
    const pubEarnings = earnings.filter(e => e.publisherId === pubId);
    
    // Sum total
    const total = pubEarnings.reduce((acc, curr) => acc + curr.amount, 0);

    // Sum last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7 = pubEarnings
      .filter(e => new Date(e.date) >= sevenDaysAgo)
      .reduce((acc, curr) => acc + curr.amount, 0);

    // Sum last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30 = pubEarnings
      .filter(e => new Date(e.date) >= thirtyDaysAgo)
      .reduce((acc, curr) => acc + curr.amount, 0);

    return { total, last7, last30 };
  };

  const getLeaderboard = () => {
    // Map with dynamic sums
    const leaders = publishers.map(p => {
      const sum = earnings
        .filter(e => e.publisherId === p.id)
        .reduce((acc, curr) => acc + curr.amount, 0);
      return {
        id: p.id,
        name: p.name,
        avatar: p.avatar || '😎',
        income: sum
      };
    });

    return leaders.sort((a, b) => b.income - a.income);
  };

  // 1. If not authenticated, show stateful login box
  if (!currentUser || currentUser.type !== 'publisher') {
    return (
      <div id="publisher-auth-wrapper" className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#0d1628] rounded-3xl overflow-hidden border border-slate-200/85 dark:border-slate-800/80 p-6 sm:p-10 shadow-2xl relative">
          
          {/* Logo element */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-brand-primary dark:text-brand-accent mx-auto mb-3">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {forgotPasswordMode ? 'Password Recovery' : isSignupMode ? 'Create Publisher Account' : 'Publisher Login'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {forgotPasswordMode ? 'Recover forgotten password via admin' : 'Earn commission payouts with zero portfolio investments.'}
            </p>
          </div>

          {forgotPasswordMode ? (
            // Password forgot card
            <form onSubmit={handleForgotPassword} className="space-y-4">
              {recoveryMsg && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/35 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 font-bold text-xs rounded-xl leading-relaxed">
                  {recoveryMsg}
                </div>
              )}
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered Phone No</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210"
                  value={forgotPhone}
                  onChange={(e) => setForgotPhone(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                />
              </div>

              <button
                type="submit"
                id="reset-req-submit-btn"
                className="w-full py-3.5 bg-brand-primary text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-blue-700 transition-colors"
              >
                Inquire Matching Credentials
              </button>

              <button
                type="button"
                onClick={() => { setForgotPasswordMode(false); setRecoveryMsg(''); }}
                className="w-full text-center text-xs text-brand-accent font-bold mt-2 hover:underline"
              >
                Return to Login form
              </button>
            </form>
          ) : (
            // Main Log/Sign Card
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {/* Tabs selector */}
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl mb-4">
                <button
                  type="button"
                  id="tab-login"
                  onClick={() => { setIsSignupMode(false); setAuthError(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isSignupMode ? 'bg-white dark:bg-[#0d1628] text-brand-primary dark:text-white shadow-sm' : 'text-slate-500'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  id="tab-signup"
                  onClick={() => { setIsSignupMode(true); setAuthError(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isSignupMode ? 'bg-white dark:bg-[#0d1628] text-brand-primary dark:text-white shadow-sm' : 'text-slate-500'}`}
                >
                  Register Account
                </button>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 font-bold text-xs rounded-xl">
                  {authError}
                </div>
              )}

              {isSignupMode && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-brand-accent text-slate-900 dark:text-white font-medium"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isSignupMode ? 'Email Address' : 'Phone or Email'}</label>
                <input
                  type="text"
                  required
                  placeholder={isSignupMode ? "e.g. name@gmail.com" : "Enter Email or Phone number"}
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-brand-accent text-slate-900 dark:text-white font-medium"
                />
              </div>

              {isSignupMode && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-brand-accent text-slate-900 dark:text-white font-medium"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Password</label>
                  {!isSignupMode && (
                    <button
                      type="button"
                      onClick={() => setForgotPasswordMode(true)}
                      className="text-[10px] text-brand-accent font-bold hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-brand-accent text-slate-900 dark:text-white font-medium"
                />
              </div>

              <button
                type="submit"
                id="publisher-auth-sub-btn"
                className="w-full py-4 bg-brand-primary hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md mt-6 cursor-pointer"
              >
                {isSignupMode ? 'Open Free Publisher Account' : 'Authenticate Credentials'}
              </button>

            </form>
          )}

        </div>
      </div>
    );
  }

  // Check if current logged-in publisher is blocked in the database
  const currentPublisherRecord = publishers.find(pub => pub.id === currentUser?.id);
  const isCurrentlyBlocked = currentUser?.type === 'publisher' && currentPublisherRecord?.blocked === true;

  if (isCurrentlyBlocked) {
    return (
      <div id="publisher-blocked-wrapper" className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#0d1628] rounded-3xl overflow-hidden border-2 border-rose-200 dark:border-rose-950/60 p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-455 mx-auto animate-bounce">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
              Account Suspended / Blocked
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-350 font-medium">
              Your publisher account has been temporarily locked or blocked by the Administrator. You cannot access the network panel at this moment.
            </p>
            <p className="text-xs text-slate-400">
              Please contact our dedicated support division to request credentials reinstatement or system clearance.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2">
            <div className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Support Helpline</div>
            <div className="text-sm font-black text-slate-800 dark:text-white font-mono">+91 8934932418</div>
          </div>

          <button
            onClick={() => {
              logout();
              onNavigate('/Home');
            }}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Publisher Dashboard (after login)
  const publisherEarningStats = getPublisherEarnings(currentUser.id);
  const matchedEarnings = earnings.filter(e => e.publisherId === currentUser.id).slice(0, 5);
  const activeAndAdminCamps = campaigns.filter(c => c.active === true);
  const pubSubmissions = submissions.filter(s => s.publisherId === currentUser.id);

  return (
    <div id="active-publisher-workspace" className="max-w-7xl mx-auto px-4 py-8">
      
      {/* 1. Segmented Navigation Bar Menu - Responsive Mobile Dropdown and Luxury Desktop List */}
      <div id="publisher-navbar" className="relative border-b border-slate-200/50 dark:border-slate-800/50 pb-6 mb-8 select-none">
        
        {/* Mobile View with Navigation Workspace Menu & Logout Button next to it */}
        <div className="lg:hidden flex items-end justify-between gap-3">
          <div className="flex-1 max-w-xs sm:max-w-md">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 font-mono">
              Navigation Workspace Menu
            </label>
            <div className="relative">
              {/* The main trigger button */}
              <button
                type="button"
                onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
                className="w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-white dark:bg-[#0d1628] hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs text-sm font-black text-slate-800 dark:text-slate-105 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                    {activeTab === 'dashboard' && <Coins className="w-5 h-5" />}
                    {activeTab === 'campaign' && <FileText className="w-5 h-5" />}
                    {activeTab === 'datasubmit' && <UploadCloud className="w-5 h-5" />}
                    {activeTab === 'mistracking' && <HelpCircle className="w-5 h-5" />}
                    {activeTab === 'verification' && <CheckCircle2 className="w-5 h-5" />}
                    {activeTab === 'topearners' && <Trophy className="w-5 h-5" />}
                    {activeTab === 'bankupdate' && <QrCode className="w-5 h-5" />}
                  </span>
                  <div>
                    <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-wider font-sans leading-none mb-1">Current Active Space</span>
                    <span className="text-sm font-black tracking-tight block text-slate-800 dark:text-slate-200">
                      {activeTab === 'dashboard' && 'Earning Dashboard'}
                      {activeTab === 'campaign' && 'Active Campaign'}
                      {activeTab === 'datasubmit' && 'Data Submission'}
                      {activeTab === 'mistracking' && 'MIS Tracking Feed'}
                      {activeTab === 'verification' && 'Verification Track'}
                      {activeTab === 'topearners' && 'Top Earners Board'}
                      {activeTab === 'bankupdate' && 'Bank Update'}
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-305 ${isNavMenuOpen ? 'rotate-180 text-blue-500' : ''}`} />
              </button>

              {/* Dropdown Menu List Options */}
              {isNavMenuOpen && (
                <>
                  {/* Overlay layer to close dropdown when clicked outside */}
                  <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={() => setIsNavMenuOpen(false)} 
                  />
                  
                  {/* Floating Option Cards container */}
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800/90 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[380px] overflow-y-auto animate-fade-up">
                    {[
                      { tabId: 'dashboard', label: 'Earning Dashboard', desc: 'Overview of earnings, payouts & graphs', icon: <Coins className="w-4 h-4" /> },
                      { tabId: 'campaign', label: 'Active Campaign', desc: 'Browse and apply for active campaign deals', icon: <FileText className="w-4 h-4" /> },
                      { tabId: 'datasubmit', label: 'Data Submission', desc: 'Submit leads & upload conversions work', icon: <UploadCloud className="w-4 h-4" /> },
                      { tabId: 'mistracking', label: 'MIS Tracking Feed', desc: 'Track dispute reports & mis-tracking logs', icon: <HelpCircle className="w-4 h-4" /> },
                      { tabId: 'verification', label: 'Verification Track', desc: 'Realtime approval status of submitted work', icon: <CheckCircle2 className="w-4 h-4" /> },
                      { tabId: 'topearners', label: 'Top Earners Board', desc: 'Our live public high-earning publishers list', icon: <Trophy className="w-4 h-4" /> },
                      { tabId: 'bankupdate', label: 'Bank Update', desc: 'Update details & UPI scan triggers', icon: <QrCode className="w-4 h-4" /> }
                    ].map((btn) => (
                      <button
                        key={btn.tabId}
                        id={`tab-publisher-${btn.tabId}`}
                        type="button"
                        onClick={() => {
                          setActiveTab(btn.tabId as TabType);
                          setIsNavMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 flex items-center justify-between gap-3 text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                          activeTab === btn.tabId 
                            ? 'bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-bold' 
                            : 'text-slate-700 dark:text-slate-350'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`p-2 rounded-xl transition-colors ${
                            activeTab === btn.tabId 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' 
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800/80 dark:text-slate-450'
                          }`}>
                            {btn.icon}
                          </span>
                          <div>
                            <span className="text-xs font-black block tracking-tight">{btn.label}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">{btn.desc}</span>
                          </div>
                        </div>
                        
                        {activeTab === btn.tabId && (
                          <Check className="w-4 h-4 text-blue-500 mr-1.5" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Logout Button (Mobile) - Icon only */}
          <button
            id="nav-logout-avatar-mobile"
            onClick={() => { logout(); onNavigate('/Home'); }}
            className="p-3.5 bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-200 dark:bg-[#0d1628]/30 dark:border-rose-950/40 rounded-2xl transition-all shadow-sm flex items-center justify-center shrink-0 mb-0.5"
            title="Sign out of Ad Network"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Horizontal Tabs Menu - Bento Style (visible on screen lengths >= 1024px) */}
        <div className="hidden lg:flex items-stretch justify-between gap-4">
          <div className="flex-1 flex flex-wrap items-stretch gap-2.5">
            {[
              { tabId: 'dashboard', label: 'Earning Dashboard', desc: 'Performance analytics', icon: <Coins className="w-4 h-4" /> },
              { tabId: 'campaign', label: 'Active Campaign', desc: 'Browse available deals', icon: <FileText className="w-4 h-4" /> },
              { tabId: 'datasubmit', label: 'Submit Leads', desc: 'Upload proof files', icon: <UploadCloud className="w-4 h-4" /> },
              { tabId: 'mistracking', label: 'MIS Tracking Feed', desc: 'Track dispute logs', icon: <HelpCircle className="w-4 h-4" /> },
              { tabId: 'verification', label: 'Verification Track', desc: 'Lead approval states', icon: <CheckCircle2 className="w-4 h-4" /> },
              { tabId: 'topearners', label: 'Top Earners Board', desc: 'High payout records', icon: <Trophy className="w-4 h-4" /> },
              { tabId: 'bankupdate', label: 'Bank Update', desc: 'Configure bank / UPI', icon: <QrCode className="w-4 h-4" /> }
            ].map((btn) => (
              <button
                key={btn.tabId}
                type="button"
                onClick={() => setActiveTab(btn.tabId as TabType)}
                className={`flex-1 min-w-[125px] max-w-[170px] p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                  activeTab === btn.tabId
                    ? 'bg-gradient-to-b from-indigo-50/50 to-indigo-100/10 dark:from-[#111c35] dark:to-[#0f172a]/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 shadow-xs ring-1 ring-indigo-200/20'
                    : 'bg-white dark:bg-[#0c1322]/30 hover:bg-slate-50 dark:hover:bg-[#0c1322]/80 text-slate-605 dark:text-slate-400 border-slate-205 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-705'
                }`}
              >
                <span className={`p-2 rounded-xl w-fit transition-transform self-start ${
                  activeTab === btn.tabId
                    ? 'bg-indigo-600 text-white shadow-sm scale-105'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800/90 dark:text-slate-450'
                }`}>
                  {btn.icon}
                </span>
                <div>
                  <span className={`text-[11px] font-extrabold tracking-tight block ${activeTab === btn.tabId ? 'text-indigo-700 dark:text-indigo-350' : 'text-slate-800 dark:text-slate-300'}`}>{btn.label}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-semibold leading-normal mt-0.5">{btn.desc}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Logout Button (Desktop) - Icon only */}
          <button
            id="nav-logout-avatar"
            onClick={() => { logout(); onNavigate('/Home'); }}
            className="p-3.5 bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-200 dark:bg-[#0d1628]/30 dark:border-rose-950/40 rounded-2xl transition-all shadow-sm flex items-center justify-center shrink-0"
            title="Sign out of Ad Network"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* 2. Top Profile Element bar - Redesigned to be ultra-premium */}
      <div className="relative mb-8 select-none">
        {/* Dynamic canvas animating in the background of the entire row block */}
        <div className="absolute inset-0 bg-slate-50/25 dark:bg-[#070b13]/40 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 pointer-events-none overflow-hidden h-full w-full">
          <PremiumFinanceGeometricCanvas />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: User Profile Glass card */}
          <div className="relative bg-white/70 dark:bg-[#0d1628]/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 flex flex-col justify-center transition-all duration-300 hover:shadow-md hover:border-indigo-500/35 min-h-[140px]">
            {/* Glowing backdrop ambient layers */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {!isEditingProfile ? (
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 text-center sm:text-left z-10 w-full h-full">
                {/* Avatar Ring */}
                <div className="relative group shrink-0 self-center">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-550 to-brand-accent rounded-full blur-xs opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse" style={{ animationDuration: '6s' }}></div>
                  <div className="relative w-20 h-20 bg-white dark:bg-[#090f1d] border border-slate-250 dark:border-slate-855 rounded-full flex items-center justify-center overflow-hidden select-none">
                    {profileAvatar && (profileAvatar.startsWith('data:image/') || profileAvatar.startsWith('http')) ? (
                      <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-4xl">{profileAvatar || '😎'}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      Hello, {profileName}!
                    </span>
                    <button
                      id="edit-profile-trigger"
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="p-1 px-2 text-slate-405 hover:text-indigo-550 hover:bg-slate-100 dark:hover:bg-slate-855 rounded-lg transition-all flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      title="Edit profile name & avatar"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  
                  <p className="text-xs text-slate-450 dark:text-slate-400 mt-1.5 font-bold flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-1">
                    <span className="bg-slate-100/90 dark:bg-slate-900/90 px-2 py-0.5 rounded text-[10px] text-slate-500 dark:text-slate-450 border border-slate-200 dark:border-slate-800 font-mono">
                      ID: <span className="text-indigo-505 dark:text-indigo-400 font-extrabold">{currentUser.id}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-450 bg-emerald-500/10 dark:bg-emerald-555/5 px-2 py-0.5 rounded text-[10px]" title="Account Verified">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-555 animate-ping"></span>
                      <span>Verified Publisher</span>
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              /* Inline Edit Profile Form inside the Card flow, so height is automatically adjusted and no button is hidden! */
              <form onSubmit={handleProfileSave} className="relative z-10 flex flex-col gap-3 animate-fade-up w-full">
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Select Avatar / Photo</span>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {['😎', '👩', '👨', '🦁', '🦊', '🐨', '🐼'].map(av => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setProfileAvatar(av)}
                        className={`text-lg p-1.5 rounded-lg hover:bg-slate-150 dark:hover:bg-slate-855 transition-all ${profileAvatar === av ? 'bg-indigo-100/80 dark:bg-indigo-950/60 border border-indigo-500' : 'border border-transparent'}`}
                      >
                        {av}
                      </button>
                    ))}
                    
                    <label className="cursor-pointer flex items-center justify-center p-1.5 px-2.5 rounded-lg border border-dashed border-indigo-555/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all" title="Upload custom image">
                      <span className="flex items-center gap-1 text-[10px]">
                        <Camera className="w-3 h-3" />
                        <span>Upload</span>
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 1.5 * 1024 * 1024) {
                               alert("Photo too large! (Limit 1.5MB)");
                               return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setProfileAvatar(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                
                <div className="w-full relative">
                  <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Display Name</span>
                  <div 
                    onClick={() => setShowLockPopup(true)}
                    className="relative cursor-pointer group"
                  >
                    <input
                      type="text"
                      required
                      readOnly
                      value={profileName}
                      className="w-full text-xs p-2 pr-8 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none cursor-pointer text-slate-505 dark:text-slate-400 font-semibold"
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center text-slate-405 group-hover:text-amber-500 transition-colors">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                     type="submit"
                     className="flex-1 py-1.5 bg-indigo-600 text-white font-extrabold text-[10px] uppercase rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                  >
                     Save
                  </button>
                  <button
                     type="button"
                     onClick={() => setIsEditingProfile(false)}
                     className="px-2.5 py-1.5 bg-slate-105 dark:bg-slate-805 text-slate-600 dark:text-slate-300 font-extrabold text-[10px] uppercase rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                     Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Card 2: Micro-Statistics Glass card */}
          <div className="relative bg-white/70 dark:bg-[#0d1628]/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-around gap-6 sm:gap-4 text-left transition-all duration-300 hover:shadow-md hover:border-indigo-500/35">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-505 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-455 dark:text-slate-500 uppercase font-bold tracking-widest leading-none">Total Work</span>
                <span className="text-base font-black text-slate-850 dark:text-slate-100 mt-1 font-mono">
                  {pubSubmissions.length} Leads
                </span>
                <span className="text-[8px] text-indigo-550 dark:text-indigo-455 font-bold uppercase tracking-wider mt-0.5">Submitted Logs</span>
              </div>
            </div>
          </div>

          {/* Card 3: Right Dynamic Income Desk Card */}
          <div className="relative bg-gradient-to-b from-white/75 to-emerald-50/20 dark:from-[#0d1628]/65 dark:to-emerald-950/5 backdrop-blur-md border border-slate-200/85 dark:border-emerald-500/15 p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-emerald-500/35 group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                <Coins className="w-4 h-4 text-emerald-555 animate-spin" style={{ animationDuration: '8s' }} />
                <span>My Income Desk</span>
              </div>
              <span className="text-[8px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 font-black rounded-full uppercase tracking-wider">
                Instant Disbursal
              </span>
            </div>

            <div className="my-3 flex items-baseline gap-1">
              <span className="text-sm font-black text-slate-400 dark:text-slate-500">₹</span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-450 font-mono tracking-tight">
                {publisherEarningStats.total}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-semibold leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Database synced & locked in</span>
            </div>
          </div>

        </div>

        {/* Locked Display Name Premium Modal */}
        {showLockPopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800/90 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center animate-fade-up">
              
              {/* Close Button "X" */}
              <button
                type="button"
                onClick={() => setShowLockPopup(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-405 hover:text-slate-600 dark:hover:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-800/65 transition-all"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-550 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>

              <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">Display Name Locked</h4>
              <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed mt-2 mb-6">
                To security-audit, prevent spam, and update your official display name, an activation and processing fee of <strong className="text-brand-success font-black text-xs">₹99/change</strong> is required.
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLockPopup(false);
                    setShowPaymentImage(true);
                  }}
                  className="w-full py-3 bg-brand-primary text-white font-bold text-xs rounded-xl hover:bg-blue-700 hover:scale-[1.01] active:scale-95 transition-all shadow-md shadow-blue-500/10 uppercase tracking-widest"
                >
                  Pay ₹99 To Unlock
                </button>
                <button
                  type="button"
                  onClick={() => setShowLockPopup(false)}
                  className="w-full py-2.5 bg-slate-100 dark:bg-slate-905 text-slate-600 dark:text-slate-400 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Payment QR Code Modal */}
        {showPaymentImage && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800/90 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center animate-fade-up">
              
              {/* Close Button "X" */}
              <button
                type="button"
                onClick={() => setShowPaymentImage(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/65 transition-all"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-550 flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 animate-pulse" />
              </div>

              <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">Scan To Pay ₹99</h4>
              <p className="text-xs text-slate-605 dark:text-slate-400 leading-relaxed mt-2 mb-5">
                Scan the QR code below using Google Pay, PhonePe, Paytm, or any UPI app to unlock your display name change interface.
              </p>

              {/* QR Code Container */}
              <div id="payment-qr-wrapper" className="w-full aspect-square max-w-[210px] mx-auto bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-850 flex flex-col justify-center items-center p-2.5 relative overflow-hidden">
                {PAYMENT_QR_IMAGE_URL ? (
                  <img 
                    src={PAYMENT_QR_IMAGE_URL} 
                    alt="Payment QR Code" 
                    className="w-full h-full object-contain rounded-xl select-none"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="p-3 text-center">
                    <QrCode className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <p className="text-[9px] font-mono text-amber-550 font-extrabold bg-amber-500/10 px-2 py-1 rounded inline-block mb-2">
                      QR IMAGE PLACEHOLDER
                    </p>
                    <p className="text-[10px] text-slate-455 dark:text-slate-500 font-medium leading-normal">
                      Please replace the empty string of <code className="text-blue-500 font-mono text-[9px]">PAYMENT_QR_IMAGE_URL</code> at line 12 of <code className="text-slate-500 dark:text-slate-400 font-mono text-[9px]">src/components/DashboardView.tsx</code> with your image link.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowPaymentImage(false)}
                className="w-full py-3 bg-brand-primary text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors uppercase tracking-widest mt-5"
              >
                Close Gateway
              </button>

            </div>
          </div>
        )}
      </div>



      {/* 4. Tab Context Router panels */}

      {/* TAB A: Dashboard */}
      {activeTab === 'dashboard' && (
        <div id="tabPanel-dashboard" className="space-y-8 animate-fade-up">
          
          {/* Main cards display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Card 1: All time total */}
            <div className="bg-gradient-to-br from-brand-primary to-blue-750 text-white rounded-3xl p-6 shadow-md border border-blue-400/20">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-blue-200">All-Time Earnings</span>
                <IndianRupee className="w-5 h-5 text-amber-300 fill-amber-300 animate-bounce" />
              </div>
              <h3 className="text-3xl font-black font-mono mt-4">₹{publisherEarningStats.total}</h3>
              <p className="text-[10px] text-blue-200 font-bold mt-2.5">Total payout successfully consolidated.</p>
            </div>

            {/* Card 2: Last 7 Days */}
            <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Last 7 Days</span>
                <Calendar className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-4">₹{publisherEarningStats.last7}</h3>
              <p className="text-[10px] text-[#10b981] font-bold mt-2.5">Recent payout logs checked.</p>
            </div>

            {/* Card 3: Last 30 Days */}
            <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Last 30 Days</span>
                <Coins className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-4">₹{publisherEarningStats.last30}</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-2.5">Evaluated active lead cycles.</p>
            </div>

          </div>

          {/* Last 5 Earnings Box table */}
          <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 border border-slate-205 dark:border-slate-800/85">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Last 5 Earnings Logs</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Disbursed rewards with automated system triggers</p>
              </div>
              <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded">Live Ledger Feed</span>
            </div>

            {matchedEarnings.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">
                No active reward disbursements on record yet. Complete campaigns and submit verification.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-450 uppercase font-extrabold tracking-widest bg-slate-50 dark:bg-slate-900/10">
                      <th className="p-3 rounded-l-xl">Campaign Name</th>
                      <th className="p-3">Disburse Date</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3 rounded-r-xl text-right">Consolidated Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchedEarnings.map((earning) => (
                      <tr key={earning.id} className="border-b border-slate-50 dark:border-slate-850/20">
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">
                          {earning.campaignName}
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-350 font-medium">
                          {earning.date}
                        </td>
                        <td className="p-3 text-slate-400 dark:text-slate-500 font-mono">
                          {earning.time}
                        </td>
                        <td className="p-3 text-right font-black text-brand-success font-mono">
                          +₹{earning.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB B: Campaigns Catalog */}
      {activeTab === 'campaign' && (
        <div id="tabPanel-campaign" className="animate-fade-up">
          <div className="bg-slate-100/50 dark:bg-[#090f1d] p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 mb-6 text-center max-w-2xl mx-auto">
            <h4 className="text-xs.5 font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest">Available Campaigns</h4>
            <p className="text-[10px] text-slate-450 mt-1">Only active, high-convert, verified programs are displayed. Take action links below to create leads.</p>
          </div>

          {activeAndAdminCamps.length === 0 ? (
            <div className="text-center py-8 text-slate-450 text-xs">
              No campaigns currently active. Check back shortly.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeAndAdminCamps.map((camp) => (
                <div key={camp.id} className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-xl transition-all duration-300 group hover:border-brand-accent/40 flex flex-col justify-between">
                  <div>
                    {/* Header with circular image */}
                    <div className="flex gap-4 items-center mb-4">
                      {camp.image ? (
                        <img 
                          src={camp.image} 
                          alt={camp.name} 
                          className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-slate-100 dark:border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                          <Coins className="w-6 h-6 text-brand-accent" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white capitalize group-hover:text-brand-accent">
                          {camp.name}
                        </h4>
                        <div className="flex gap-1.5 items-center mt-1">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-105 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded font-mono">
                            {camp.vertical}
                          </span>
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-955/20 text-brand-gold rounded font-mono">
                            {camp.model}
                          </span>
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded capitalize">
                            {camp.platform}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* KPI & Payout details */}
                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 dark:border-slate-800 mb-4 bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">KPI (Target)</span>
                        <span className="text-[10px] text-slate-700 dark:text-slate-350 block mt-0.5 font-semibold h-11 overflow-hidden font-sans">
                          {camp.kpi}
                        </span>
                      </div>
                      <div className="border-l border-slate-205 dark:border-slate-800 pl-4">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">GEO / Region</span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-350 block mt-0.5 font-semibold font-sans">
                          {camp.geo || 'India (PAN)'}
                        </span>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="mb-4 space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Terms & Rules</span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed font-sans block h-10 overflow-hidden line-clamp-2">
                        {camp.terms}
                      </p>
                    </div>

                    {/* Visible Campaign Link Box (100% Copy Fallback) */}
                    <div className="mb-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-2 border border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between gap-2 select-all">
                      <input
                        type="text"
                        readOnly
                        value={camp.link}
                        onClick={(e) => {
                          (e.target as HTMLInputElement).select();
                          copyCampLink(camp.link, camp.id);
                        }}
                        className="text-[9px] font-mono text-slate-500 dark:text-slate-400 bg-transparent border-none outline-none w-full cursor-pointer"
                        title="Click to select all and copy"
                      />
                      <button
                        onClick={() => copyCampLink(camp.link, camp.id)}
                        className="text-[9px] text-brand-primary dark:text-blue-400 font-black hover:underline shrink-0 px-1 uppercase tracking-wider"
                      >
                        {copiedCampId === camp.id ? "Copied" : "Copy"}
                      </button>
                    </div>

                  </div>

                  {/* Rate / Link bar */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto gap-2">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Commission Reward</span>
                      <span className="text-xl font-extrabold text-[#10b981] font-mono">₹{camp.payout}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {(camp.directOpen !== false && (camp.directOpen as any) !== 'false') && (
                        <a
                          href={camp.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 text-[10px] font-black uppercase rounded-lg flex items-center gap-1 border transition-all bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open
                        </a>
                      )}
                      
                      <button
                        id={`copy-btn-${camp.id}`}
                        onClick={() => copyCampLink(camp.link, camp.id)}
                        className={`px-2.5 py-1.5 text-[10px] font-black uppercase rounded-lg flex items-center gap-1 border transition-all ${
                          copiedCampId === camp.id 
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200' 
                            : 'bg-brand-primary text-white border-transparent hover:bg-blue-700'
                        }`}
                      >
                        {copiedCampId === camp.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB C: Data Submission */}
      {activeTab === 'datasubmit' && (
        <div id="tabPanel-dataSubmit" className="max-w-2xl mx-auto animate-fade-up">
          <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-md">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 text-center">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">Client Conversion Submission</h3>
              <p className="text-xs text-slate-405 mt-1">Submit client target screenshots and conversion proof details under correct campaigns.</p>
            </div>

            {submissionError && (
              <div className="p-3 mb-4 bg-rose-550/10 text-rose-700 dark:text-rose-400 border border-rose-200 font-bold text-xs rounded-xl">
                {submissionError}
              </div>
            )}

            {submissionSuccess && (
              <div className="p-3.5 mb-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 font-bold text-xs rounded-xl text-center">
                {submissionSuccess}
              </div>
            )}

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              
              {/* Campaign Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Campaign Vertical</label>
                <div className="relative">
                  <select
                    id="submit-lead-campaign-select"
                    required
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-xl outline-none text-slate-800 dark:text-white pr-10 appearance-none font-semibold cursor-pointer"
                  >
                    <option value="">-- Choose Campaign target matches --</option>
                    {activeAndAdminCamps.map((camp) => (
                      <option key={camp.id} value={camp.id}>
                        {camp.name} ({camp.vertical} - ₹{camp.payout})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Client Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter client's full name"
                    value={leadClientName}
                    onChange={(e) => setLeadClientName(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-855 rounded-xl outline-none text-slate-800 dark:text-white font-medium"
                  />
                </div>

                {/* Client Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Client Mobile No</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Enter client matched phone"
                    value={leadClientPhone}
                    onChange={(e) => setLeadClientPhone(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-855 rounded-xl outline-none text-slate-800 dark:text-white font-medium"
                  />
                </div>

              </div>

              {/* Client Code (optional) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Client Tracking Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. client code provided by tracking links"
                  value={leadClientCode}
                  onChange={(e) => setLeadClientCode(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-855 rounded-xl outline-none text-slate-850 dark:text-white font-medium"
                />
              </div>

              {/* Screenshot Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Client Target Screenshot upload</label>
                
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center flex flex-col justify-center items-center hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors relative">
                  <input
                    id="submit-screenshot-file"
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'lead')}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  
                  {screenBase64 ? (
                    // Preview Loaded Base64
                    <div className="space-y-2 select-none">
                      <div className="w-16 h-16 rounded-lg overflow-hidden mx-auto border border-emerald-400">
                        <img src={screenBase64} alt="Target screenshot preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="block text-[10px] font-extrabold text-emerald-500">
                        File Selected: {screenFileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => { setScreenBase64(''); setScreenFileName(''); }}
                        className="text-[9px] text-rose-500 underline font-bold"
                      >
                        Clear Attachment
                      </button>
                    </div>
                  ) : (
                    // Default Prompt
                    <div className="space-y-1.5 text-slate-400 select-none">
                      <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                      <span className="block text-xs font-bold text-slate-700 dark:text-slate-350">
                        Drag and drop screenshot file here
                      </span>
                      <span className="block text-[9px] tracking-wider uppercase">
                        Supported: PNG, JPEG (Max 1.4 MB)
                      </span>
                    </div>
                  )}

                </div>
              </div>

              <button
                type="submit"
                id="submit-lead-form-btn"
                className="mt-6 w-full py-4 bg-brand-primary hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer"
              >
                Submit Client Lead data
              </button>

            </form>
          </div>
        </div>
      )}

      {/* TAB D: MIS Tracking Feed */}
      {activeTab === 'mistracking' && (
        <div id="tabPanel-misTracking" className="animate-fade-up">
          <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 border border-slate-205 dark:border-slate-800/85">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">MIS Real-Time Tracking</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Approved or processed under manual check audits of Public Ads India</p>
              </div>
              <span className="text-[10px] font-mono text-slate-450 bg-slate-50 dark:bg-slate-900/35 px-2 py-1 rounded">My Submissions Feed</span>
            </div>

            {pubSubmissions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs font-medium">
                No campaign submissions located for your publisher account. Submit conversions in Data Submission first.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-450 uppercase font-extrabold tracking-widest bg-slate-50 dark:bg-slate-900/10">
                        <th className="p-3 rounded-l-xl">Campaign Name</th>
                        <th className="p-3">Client Coordinates</th>
                        <th className="p-3">Client Code</th>
                        <th className="p-3">Submission Date</th>
                        <th className="p-3">Verified screenshot</th>
                        <th className="p-3 rounded-r-xl text-right">Status Verified</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pubSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-slate-50 dark:border-slate-850/20">
                          <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">
                            {sub.campaignName}
                          </td>
                          <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                            <span className="block font-bold">{sub.clientName}</span>
                            <span className="block text-[10px] text-slate-400 mt-0.5">{sub.clientPhone}</span>
                          </td>
                          <td className="p-3 font-mono text-slate-500">
                            {sub.clientCode || 'None'}
                          </td>
                          <td className="p-3 text-slate-405">
                            {sub.submitDate}
                          </td>
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={() => setPreviewImage(sub.screenshot)}
                              className="text-brand-accent underline hover:text-blue-500 font-extrabold text-xs cursor-pointer inline-flex items-center gap-1"
                            >
                              View ↗
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <span className={`inline-flex px-2 py-0.5 font-bold text-[10px] rounded-full uppercase tracking-wider ${
                              sub.status === 'Payment Done' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400' :
                              sub.status === 'Trade Done' ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-400' :
                              sub.status === 'Process' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-850 dark:text-amber-400 animate-pulse' :
                              sub.status === 'Reject' ? 'bg-red-105 dark:bg-red-950/40 text-rose-700 dark:text-rose-400' :
                              'bg-blue-105 dark:bg-blue-950/40 text-blue-750 dark:text-blue-350'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {hasMoreSubmissions && (
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={loadMoreSubmissions}
                      className="px-4 py-2 bg-brand-primary hover:bg-blue-700 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                    >
                      Load More Submissions
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB E: Verification Track */}
      {activeTab === 'verification' && (
        <div id="tabPanel-verification" className="max-w-3xl mx-auto animate-fade-up">
          <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 sm:p-8 border border-slate-205 dark:border-slate-800/85">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6 text-center">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">Dynamic Verification Track</h3>
            </div>

            {/* Embedded Live Tally Form Widget Embed */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 text-center">
              <h4 className="text-xs.5 font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest mb-4">Client Video/Image Verification Form</h4>
              
              <div className="w-full bg-white dark:bg-[#0c1322] rounded-2xl border border-slate-150 dark:border-slate-800 p-2 overflow-hidden shadow-2xs">
                <iframe 
                  data-tally-src="https://tally.so/embed/vGg2Wd?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" 
                  loading="lazy" 
                  width="100%" 
                  height="200" 
                  frameBorder="0" 
                  marginHeight={0} 
                  marginWidth={0} 
                  title="Verification Track"
                  className="w-full"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB F: Top Earners Board */}
      {activeTab === 'topearners' && (
        <div id="tabPanel-topEarners" className="animate-fade-up">
          <div className="max-w-2xl mx-auto space-y-8">
            
            {/* 3 top earners podium design */}
            <div className="grid grid-cols-3 gap-4 items-end pt-12">
              {(() => {
                const totalLeaders = getLeaderboard();
                const first = totalLeaders[0] || { name: 'Empty', income: 0, id: 'x', avatar: '😎' };
                const second = totalLeaders[1] || { name: 'Empty', income: 0, id: 'y', avatar: '👩' };
                const third = totalLeaders[2] || { name: 'Empty', income: 0, id: 'z', avatar: '👨' };

                return (
                  <>
                    {/* 2nd place - left silver */}
                    <div className="flex flex-col items-center">
                      <div className="relative text-3xl mb-1.5 animate-bounce delay-150">
                        {second.avatar && (second.avatar.startsWith('data:image/') || second.avatar.startsWith('http')) ? (
                          <div className="w-10 h-10 rounded-full border-2 border-slate-300 overflow-hidden flex items-center justify-center bg-white shadow-xs">
                            <img src={second.avatar} alt="Podium 2" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ) : (
                          second.avatar
                        )}
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-750 dark:text-slate-200 block text-center truncate w-full">{second.name}</span>
                      <span className="text-[9px] font-extrabold text-brand-success font-mono">₹{second.income}</span>
                      
                      {/* Silver Podium block */}
                      <div className="w-full bg-slate-200 dark:bg-slate-800 text-slate-650 h-24 rounded-t-2xl flex flex-col items-center justify-center mt-3 shadow-md border-x border-t border-slate-300 dark:border-slate-700">
                        <span className="text-xl font-black">2</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest mt-0.5">Silver</span>
                      </div>
                    </div>

                    {/* 1st place - center gold crown podium! */}
                    <div className="flex flex-col items-center group">
                      <div className="relative text-5xl mb-1.5 transform group-hover:scale-105 transition-transform flex flex-col items-center">
                        <Crown className="w-5.5 h-5.5 text-amber-500 fill-amber-400 absolute top-[-22px] left-1/2 -translate-x-1/2 rotate-[-5deg] z-10" />
                        {first.avatar && (first.avatar.startsWith('data:image/') || first.avatar.startsWith('http')) ? (
                          <div className="w-14 h-14 rounded-full border-2 border-amber-400 overflow-hidden flex items-center justify-center bg-white shadow-sm mt-1">
                            <img src={first.avatar} alt="Podium 1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ) : (
                          first.avatar
                        )}
                      </div>
                      <span className="text-xs font-black text-slate-900 dark:text-white block text-center truncate w-full">{first.name}</span>
                      <span className="text-xs font-black text-brand-success font-mono">₹{first.income}</span>
                      
                      {/* Gold Podium block */}
                      <div className="w-full bg-amber-400 dark:bg-amber-500 text-amber-950 h-32 rounded-t-3xl flex flex-col items-center justify-center mt-3 shadow-lg border-x border-t border-amber-500 relative">
                        <span className="text-3xl font-black">1</span>
                        <span className="text-[9px] font-black uppercase tracking-widest mt-0.5">Top Earner</span>
                      </div>
                    </div>

                    {/* 3rd place - right bronze */}
                    <div className="flex flex-col items-center">
                      <div className="relative text-2xl mb-1.5 animate-bounce delay-300">
                        {third.avatar && (third.avatar.startsWith('data:image/') || third.avatar.startsWith('http')) ? (
                          <div className="w-9 h-9 rounded-full border-2 border-orange-300 overflow-hidden flex items-center justify-center bg-white shadow-xs">
                            <img src={third.avatar} alt="Podium 3" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ) : (
                          third.avatar
                        )}
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-750 dark:text-slate-200 block text-center truncate w-full">{third.name}</span>
                      <span className="text-[9px] font-extrabold text-brand-success font-mono">₹{third.income}</span>
                      
                      {/* Bronze Podium block */}
                      <div className="w-full bg-orange-200 dark:bg-orange-900/60 text-orange-950 dark:text-orange-305 h-18 rounded-t-2xl flex flex-col items-center justify-center mt-3 shadow-md border-x border-t border-orange-300 dark:border-orange-800">
                        <span className="text-lg font-black">3</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest mt-0.5">Bronze</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* List remaining earners */}
            <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Complete Earnings List</h4>
              
              <div className="space-y-3">
                {getLeaderboard().slice(3).length === 0 ? (
                  <div className="text-center py-2 text-[10px] text-slate-400">Join the active earners ranking by creating verified transactions!</div>
                ) : (
                  getLeaderboard().slice(3).map((leader, i) => (
                    <div key={leader.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-slate-400">#{i + 4}</span>
                        {leader.avatar && (leader.avatar.startsWith('data:image/') || leader.avatar.startsWith('http')) ? (
                          <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-2xs">
                            <img src={leader.avatar} alt="User Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ) : (
                          <span className="text-xl select-none">{leader.avatar}</span>
                        )}
                        <div>
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">{leader.name}</span>
                          <span className="text-[9px] text-slate-450 block font-mono">{leader.id}</span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-brand-success font-mono">₹{leader.income}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB G: Bank Update */}
      {activeTab === 'bankupdate' && (
        <div id="tabPanel-bankUpdate" className="max-w-2xl mx-auto animate-fade-up">
          <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-md">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 text-center">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">Update Banking Ledger</h3>
              <p className="text-xs text-slate-405 mt-1">Provide correct account or UPI coordinates. All details are safely encrypted and private.</p>
            </div>

            {bankFormMsg && (
              <div id="bank-sucess-notification" className="p-3.5 mb-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 font-bold text-xs rounded-xl text-center">
                {bankFormMsg}
              </div>
            )}

            <form onSubmit={handleBankSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Holder Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account Holder Name</label>
                  <input
                    type="text"
                    required
                    value={bankHolderName}
                    onChange={(e) => setBankHolderName(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-850 dark:text-white font-medium"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contact Phone No</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={bankPhone}
                    onChange={(e) => setBankPhone(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-850 dark:text-white font-medium"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Account Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account Number</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter bank Account Number"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-205 dark:border-slate-800 rounded-xl outline-none text-slate-850 dark:text-white font-mono"
                  />
                </div>

                {/* IFSC Code */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">IFSC Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SBIN0001092"
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-205 dark:border-slate-800 rounded-xl outline-none text-slate-850 dark:text-white font-mono uppercase"
                  />
                </div>

              </div>

              {/* UPI ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">UPI ID address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. upi_address@okaxis"
                  value={bankUpi}
                  onChange={(e) => setBankUpi(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-850 dark:text-white font-mono"
                />
              </div>

              {/* UPI QR upload code */}
              <div className="flex flex-col gap-1.5 pt-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Upload Personal UPI QR Code</label>
                
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center flex flex-col justify-center items-center hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors relative">
                  <input
                    id="submit-qr-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'bank')}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />

                  {bankQrCode ? (
                    <div className="space-y-1.5 select-none">
                      <div className="w-16 h-16 rounded-xl overflow-hidden mx-auto border-2 border-brand-accent">
                        <img src={bankQrCode} alt="Uploaded QR Code Preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="block text-[10px] font-extrabold text-brand-accent">UPI QR Code uploaded successfully!</span>
                      <button
                        type="button"
                        onClick={() => setBankQrCode('')}
                        className="text-[9px] text-rose-500 underline font-semibold"
                      >
                        Reset QR code
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 select-none">
                      <QrCode className="w-7 h-7 text-slate-400 mx-auto" />
                      <span className="block text-xs font-bold text-slate-700 dark:text-slate-350">Drag and drop UPI QR image</span>
                      <span className="block text-[8px] text-slate-400">Accepts PNG, JPG (Under 1.4 MB)</span>
                    </div>
                  )}

                </div>
              </div>

              <button
                type="submit"
                id="submit-bank-details-btn"
                className="mt-6 w-full py-4 bg-[#10b981] hover:bg-emerald-600 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer"
              >
                Save Banking details
              </button>

            </form>
          </div>
        </div>
      )}

      {/* Interactive Image Preview Modal */}
      {previewImage && (
        <div 
          id="proof-image-preview-modal-client" 
          className="fixed inset-0 bg-[#060b13]/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
              <span className="font-extrabold text-slate-800 dark:text-slate-100 text-[11px] uppercase tracking-wider">Submitted Lead Screenshot Preview</span>
              <div className="flex gap-2">
                <a 
                  href={previewImage} 
                  download={`proof-${Date.now()}.png`}
                  className="px-3 py-1 bg-brand-accent hover:bg-opacity-90 text-[#0d1628] font-extrabold text-[10px] uppercase rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> Save Image
                </a>
                <button 
                  onClick={() => setPreviewImage(null)}
                  className="p-1 px-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl font-black text-slate-750 dark:text-slate-250 cursor-pointer text-[10px]"
                >
                  ✕ Close
                </button>
              </div>
            </div>
            {/* Image viewport */}
            <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[72vh] min-h-[250px] overflow-auto">
              <img 
                src={previewImage} 
                alt="Uploaded Verification Screenshot" 
                className="max-w-full max-h-[66vh] object-contain rounded-lg shadow-md border border-slate-800" 
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
