import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAppState } from '../context/AppContext';
import { compressImageBase64 } from '../lib/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  IndianRupee, Coins, Calendar, ArrowRight, User, Settings, CheckCircle2, 
  HelpCircle, Copy, AlertCircle, FileText, QrCode, Crown, Trophy, 
  Camera, UploadCloud, Edit3, Sparkles, LogOut, Check, ChevronDown, ChevronRight,
  Lock, X, Download, ExternalLink, Eye, EyeOff, ShieldCheck, Gift
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
  const [authInviteCode, setAuthInviteCode] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Password recovery flow
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [recoveryMsg, setRecoveryMsg] = useState('');

  // Profile editing state
  const [profileName, setProfileName] = useState('');
  const [requestedNewName, setRequestedNewName] = useState('');
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

  // Bank Popup & Validation States
  const [showBankConfirmModal, setShowBankConfirmModal] = useState(false);
  const [showBankSuccessModal, setShowBankSuccessModal] = useState(false);
  const [showBankWarningModal, setShowBankWarningModal] = useState(false);
  const [bankWarningMsg, setBankWarningMsg] = useState('');
  const [missingFieldsList, setMissingFieldsList] = useState<string[]>([]);
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [showMaskedAccount, setShowMaskedAccount] = useState(true);

  // Leader submissions inputs
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [leadClientName, setLeadClientName] = useState('');
  const [leadClientPhone, setLeadClientPhone] = useState('');
  const [leadClientCode, setLeadClientCode] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
      const res = await signupPublisher(authName, authEmail, authPhone, authPassword, authInviteCode);
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

  const handleSavePhoto = (newAvatar?: string) => {
    const avatarToSave = newAvatar || profileAvatar;
    if (!avatarToSave) return;
    
    // Save to profile context
    updatePublisherProfile(profileName, avatarToSave);
    if (newAvatar) setProfileAvatar(newAvatar);
    
    // Trigger Confetti Animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Automatically return to profile view so updated DP is immediately visible
    setIsEditingProfile(false);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newNameFormatted = requestedNewName.trim() || profileName;
    
    // Construct WhatsApp message in English for name replacement request
    const waMsg = `Hello Admin, I want to request a profile name replacement.\n\nPublisher UID: ${currentUser?.id || ''}\nCurrent Name: ${profileName}\nNew Requested Name: ${newNameFormatted}\n\nNote: I acknowledge that a ₹99 fee is required for the name replacement process.`;
    
    // Open WhatsApp link to +91 8934932418
    const waUrl = `https://wa.me/918934932418?text=${encodeURIComponent(waMsg)}`;
    window.open(waUrl, '_blank');

    // Save avatar locally if updated
    updatePublisherProfile(profileName, profileAvatar);
    setIsEditingProfile(false);
  };

  // Convert files to base64 and compress
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'lead' | 'bank') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // We allow files up to 6MB since we will automatically compress them down to < 200KB anyway
    if (file.size > 6 * 1024 * 1024) {
      alert('File is too large! Maximum limit is 6.0 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      
      try {
        // Compress the image before storing to prevent Firestore size limit issues (1MB)
        const compressedBase64 = await compressImageBase64(base64String, 900, 900, 0.7);
        
        if (target === 'lead') {
          setScreenBase64(compressedBase64);
          setScreenFileName(file.name);
        } else {
          setBankQrCode(compressedBase64);
        }
      } catch (err) {
        console.error('Image compression failed, using original', err);
        if (target === 'lead') {
          setScreenBase64(base64String);
          setScreenFileName(file.name);
        } else {
          setBankQrCode(base64String);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Lead Lead code
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

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

    setIsSubmitting(true);
    try {
      const res = await submitLead(selectedCampaignId, leadClientName, leadClientPhone, leadClientCode, screenBase64);
      if (res.success) {
        setSubmissionSuccess(res.message);
        setShowSuccessPopup(true);
        // Reset form fields
        setLeadClientName('');
        setLeadClientPhone('');
        setLeadClientCode('');
        setScreenBase64('');
        setScreenFileName('');
      } else {
        setSubmissionError(res.message);
      }
    } catch (err: any) {
      setSubmissionError(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Utility to mask bank account numbers
  const getMaskedAccount = (acc: string) => {
    if (!acc) return '••••';
    if (acc.length <= 4) return acc;
    const lastFour = acc.slice(-4);
    const masked = '•'.repeat(Math.min(acc.length - 4, 8));
    return `${masked} ${lastFour}`;
  };

  // Validate Bank Form & Open Review Modal or Warning Modal
  const handleBankFormReview = (e: React.FormEvent) => {
    e.preventDefault();
    setBankFormMsg('');
    setBankWarningMsg('');
    const missing: string[] = [];

    if (!bankHolderName || bankHolderName.trim().length < 2) {
      missing.push('Account Holder Name');
    }
    if (!bankPhone || bankPhone.trim().length < 10) {
      missing.push('Contact Phone Number (10 digits)');
    }
    if (!bankAccount || bankAccount.trim().length < 8) {
      missing.push('Bank Account Number (minimum 8 digits)');
    }
    if (!bankIfsc || bankIfsc.trim().length < 4) {
      missing.push('Valid IFSC Code (e.g. SBIN0001092)');
    }
    if (!bankUpi || !bankUpi.includes('@') || bankUpi.trim().length < 3) {
      missing.push('Valid UPI ID Address (e.g. name@okaxis)');
    }

    if (missing.length > 0) {
      setMissingFieldsList(missing);
      setBankWarningMsg('Incomplete Banking Information');
      setShowBankWarningModal(true);
      return;
    }

    // Open Checkout / Confirmation Modal
    setShowBankConfirmModal(true);
  };

  // Final Bank Details Save
  const handleConfirmBankSave = async () => {
    setIsSavingBank(true);
    try {
      const details: BankDetails = {
        publisherId: currentUser!.id,
        holderName: bankHolderName.trim(),
        phone: bankPhone.trim(),
        email: bankEmail.trim(),
        accountNumber: bankAccount.trim(),
        ifsc: bankIfsc.toUpperCase().trim(),
        upi: bankUpi.trim(),
        qrCode: bankQrCode
      };

      const res = await submitBankDetails(details);
      setShowBankConfirmModal(false);

      if (res.success) {
        setBankFormMsg('Banking Ledger Updated Successfully');
        setShowBankSuccessModal(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setBankWarningMsg(res.message || 'Failed to update bank details.');
        setMissingFieldsList([]);
        setShowBankWarningModal(true);
      }
    } catch (err: any) {
      setShowBankConfirmModal(false);
      setBankWarningMsg(err.message || 'An unexpected error occurred while saving.');
      setMissingFieldsList([]);
      setShowBankWarningModal(true);
    } finally {
      setIsSavingBank(false);
    }
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

  // Helper calculation metrics - Robust calculation that computes payout from both earnings and confirmed payment submissions
  const getPublisherEarnings = (pubId: string) => {
    const normPubId = (pubId || '').trim().toLowerCase();
    const pubEarnings = earnings.filter(e => (e.publisherId || '').trim().toLowerCase() === normPubId);
    const pubSubmissions = submissions.filter(s => (s.publisherId || '').trim().toLowerCase() === normPubId);
    const paidSubs = pubSubmissions.filter(s => {
      const st = (s.status || '').toLowerCase().trim();
      return st === 'payment done' || st === 'paymentdone' || st === 'paid';
    });

    // Create a combined list of all earnings ensuring zero double-counting
    const combined = [...pubEarnings];
    paidSubs.forEach(sub => {
      const alreadyPresent = pubEarnings.some(e => 
        (e.campaignId === sub.campaignId && Number(e.amount) === Number(sub.payout)) ||
        e.id === `earning-${sub.id}`
      );
      if (!alreadyPresent) {
        combined.push({
          id: `earning-sub-${sub.id}`,
          publisherId: pubId,
          campaignId: sub.campaignId,
          campaignName: sub.campaignName,
          amount: Number(sub.payout) || 0,
          date: (sub.submitDate || '').substring(0, 10) || new Date().toISOString().substring(0, 10),
          time: (sub.submitDate || '').substring(11, 16) || ''
        });
      }
    });

    // Sum total
    const total = combined.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    // Sum last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7 = combined
      .filter(e => {
        try {
          return new Date(e.date) >= sevenDaysAgo;
        } catch {
          return true;
        }
      })
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    // Sum last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30 = combined
      .filter(e => {
        try {
          return new Date(e.date) >= thirtyDaysAgo;
        } catch {
          return true;
        }
      })
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    return { total, last7, last30 };
  };

  const getLeaderboard = () => {
    // Map with dynamic sums
    const leaders = publishers.map(p => {
      const stats = getPublisherEarnings(p.id);
      return {
        id: p.id,
        name: p.name,
        avatar: p.avatar || '😎',
        income: stats.total
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
                  onClick={() => { setIsSignupMode(false); setAuthError(''); setAuthInviteCode(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isSignupMode ? 'bg-white dark:bg-[#0d1628] text-brand-primary dark:text-white shadow-sm' : 'text-slate-500'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  id="tab-signup"
                  onClick={() => { setIsSignupMode(true); setAuthError(''); setAuthInviteCode(''); }}
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

              {isSignupMode && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Enter Invite Code <span className="text-slate-400 dark:text-slate-500 font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="PUB***"
                    value={authInviteCode}
                    onChange={(e) => setAuthInviteCode(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-brand-accent text-slate-900 dark:text-white font-medium uppercase placeholder:normal-case"
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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full text-xs p-3 pr-10 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-brand-accent text-slate-900 dark:text-white font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
  const normCurrentUserId = (currentUser?.id || '').trim().toLowerCase();
  const publisherEarningStats = getPublisherEarnings(currentUser.id);
  const matchedEarnings = earnings.filter(e => (e.publisherId || '').trim().toLowerCase() === normCurrentUserId).slice(0, 5);
  const activeAndAdminCamps = campaigns.filter(c => c.active !== false && String(c.active) !== 'false');
  const pubSubmissions = submissions.filter(s => (s.publisherId || '').trim().toLowerCase() === normCurrentUserId);

  // User's successful UPI settlements / payouts (Last 5 only)
  const paidSubmissions = pubSubmissions.filter(s => {
    const st = (s.status || '').toLowerCase().trim();
    return st === 'payment done' || st === 'paymentdone' || st === 'paid';
  });
  const userEarnings = earnings.filter(e => (e.publisherId || '').trim().toLowerCase() === normCurrentUserId);

  interface PayoutRecord {
    id: string;
    campaignName: string;
    amount: number;
    date: string;
    upi: string;
    status: string;
  }

  const userPayoutHistory: PayoutRecord[] = Array.from(
    new Map<string, PayoutRecord>(
      [
        ...paidSubmissions.map(s => [
          s.id,
          {
            id: s.id,
            campaignName: s.campaignName,
            amount: Number(s.payout) || 0,
            date: s.submitDate,
            upi: bankUpi || bankDetailsMap[currentUser?.id || '']?.upi || 'Registered UPI',
            status: 'Payment Done'
          }
        ] as [string, PayoutRecord]),
        ...userEarnings.map(e => [
          e.id,
          {
            id: e.id,
            campaignName: e.campaignName,
            amount: Number(e.amount) || 0,
            date: `${e.date} ${e.time || ''}`.trim(),
            upi: bankUpi || bankDetailsMap[currentUser?.id || '']?.upi || 'Registered UPI',
            status: 'Payment Done'
          }
        ] as [string, PayoutRecord])
      ]
    ).values()
  )
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 5);

  return (
    <div id="active-publisher-workspace" className="max-w-7xl mx-auto px-4 py-8">
      
      {/* PC/Desktop Only: Top action row with logout OUTSIDE the container */}
      <div className="hidden lg:flex justify-end mb-4">
        <button
          id="nav-logout-avatar-desktop"
          onClick={() => { logout(); onNavigate('/Home'); }}
          className="group flex items-center gap-1.5 text-xs font-black text-rose-500 hover:text-rose-600 transition-all uppercase tracking-wider select-none px-4 py-2 bg-white dark:bg-[#0d1628] rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs cursor-pointer"
          title="Sign out of Ad Network"
        >
          <span>Logout</span>
          <ChevronRight className="w-3.5 h-3.5 text-rose-450 group-hover:translate-x-0.5 transition-transform" />
          <LogOut className="w-4 h-4 ml-0.5 text-rose-500" />
        </button>
      </div>

      {/* Mobile/Phone Only: Segmented Navigation Bar Menu - Responsive Mobile Dropdown next to logout */}
      <div id="publisher-navbar-mobile" className="lg:hidden relative border-b border-slate-200/50 dark:border-slate-800/50 pb-6 mb-8 select-none">
        <div className="flex items-end justify-between gap-3">
          <div className="flex-1 max-w-xs sm:max-w-md">
            <div className="relative">
              {/* The main trigger button */}
              <button
                type="button"
                onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
                className="w-full flex items-center justify-between gap-3 px-4.5 py-3.5 bg-slate-900 dark:bg-[#09101f] hover:bg-slate-800 dark:hover:bg-[#0d162b] rounded-2xl border-2 border-slate-700/80 dark:border-slate-800 shadow-md text-sm font-black text-white transition-all text-left group cursor-pointer ring-1 ring-slate-700/30"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {activeTab === 'dashboard' && <Coins className="w-5 h-5" />}
                    {activeTab === 'campaign' && <FileText className="w-5 h-5" />}
                    {activeTab === 'datasubmit' && <UploadCloud className="w-5 h-5" />}
                    {activeTab === 'mistracking' && <HelpCircle className="w-5 h-5" />}
                    {activeTab === 'verification' && <CheckCircle2 className="w-5 h-5" />}
                    {activeTab === 'topearners' && <Trophy className="w-5 h-5" />}
                    {activeTab === 'bankupdate' && <QrCode className="w-5 h-5" />}
                  </span>
                  <div>
                    <span className="text-[10px] block font-bold text-sky-400 uppercase tracking-wider font-sans leading-none mb-1">Current Active Space</span>
                    <span className="text-sm font-black tracking-tight block text-white dark:text-slate-100">
                      {activeTab === 'dashboard' && 'Dashboard'}
                      {activeTab === 'campaign' && 'Live Campaign'}
                      {activeTab === 'datasubmit' && 'Leads Submit'}
                      {activeTab === 'mistracking' && 'MIS Lead Report'}
                      {activeTab === 'verification' && 'Client File Submit'}
                      {activeTab === 'topearners' && 'Top Earners Board'}
                      {activeTab === 'bankupdate' && 'Bank Update'}
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isNavMenuOpen ? 'rotate-180 text-sky-400' : 'group-hover:text-slate-200'}`} />
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
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 dark:bg-[#09101f] text-white border-2 border-slate-700/80 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/80 max-h-[400px] overflow-y-auto animate-fade-up ring-1 ring-slate-700/30">
                    {[
                      { tabId: 'dashboard', label: 'Dashboard', desc: 'Overview & earnings stats', icon: <Coins className="w-4.5 h-4.5" /> },
                      { tabId: 'campaign', label: 'Live Campaign', desc: 'Browse available deals', icon: <FileText className="w-4.5 h-4.5" /> },
                      { tabId: 'datasubmit', label: 'Leads Submit', desc: 'Upload proof files', icon: <UploadCloud className="w-4.5 h-4.5" /> },
                      { tabId: 'mistracking', label: 'MIS Lead Report', desc: 'Track dispute logs', icon: <HelpCircle className="w-4.5 h-4.5" /> },
                      { tabId: 'verification', label: 'Client File Submit', desc: 'Lead approval states', icon: <CheckCircle2 className="w-4.5 h-4.5" /> },
                      { tabId: 'topearners', label: 'Top Earners Board', desc: 'High payout records', icon: <Trophy className="w-4.5 h-4.5" /> },
                      { tabId: 'bankupdate', label: 'Bank Update', desc: 'Configure bank / UPI', icon: <QrCode className="w-4.5 h-4.5" /> }
                    ].map((btn) => (
                      <button
                        key={btn.tabId}
                        id={`tab-publisher-${btn.tabId}`}
                        type="button"
                        onClick={() => {
                          setActiveTab(btn.tabId as TabType);
                          setIsNavMenuOpen(false);
                        }}
                        className={`w-full px-4.5 py-3.5 flex items-center justify-between gap-3 text-left transition-all hover:bg-slate-800/90 dark:hover:bg-slate-800/60 cursor-pointer ${
                          activeTab === btn.tabId 
                            ? 'bg-blue-600/25 text-blue-400 font-bold border-l-4 border-blue-500 pl-3.5' 
                            : 'text-slate-200 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`p-2 rounded-xl transition-colors ${
                            activeTab === btn.tabId 
                              ? 'bg-blue-500/30 text-blue-400' 
                              : 'bg-slate-800 text-slate-400 dark:bg-slate-800/80 dark:text-slate-400'
                          }`}>
                            {btn.icon}
                          </span>
                          <div>
                            <span className="text-sm font-black block tracking-tight text-white dark:text-slate-100">{btn.label}</span>
                            {btn.desc ? (
                              <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium block mt-0.5">{btn.desc}</span>
                            ) : null}
                          </div>
                        </div>
                        
                        {activeTab === btn.tabId && (
                          <Check className="w-4 h-4 text-blue-400 mr-1.5" />
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
            className="p-3.5 bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-200 dark:bg-[#0d1628]/30 dark:border-rose-950/40 rounded-2xl transition-all shadow-sm flex items-center justify-center shrink-0 mb-0.5 cursor-pointer"
            title="Sign out of Ad Network"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Top Profile Element bar - Redesigned to be ultra-premium */}
      <div className="relative mb-8 select-none pt-12 sm:pt-16">
        {/* Dynamic canvas animating in the background of the entire row block */}
        <div className="absolute inset-0 bg-slate-50/25 dark:bg-[#070b13]/40 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 pointer-events-none overflow-hidden h-full w-full">
          <PremiumFinanceGeometricCanvas />
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-6 items-stretch">
          {/* Card 1: User Profile Adaptive Glass Card */}
          <div className="relative bg-white dark:bg-[#0d1628] rounded-3xl p-6 sm:p-7 pt-8 sm:pt-10 border-2 border-slate-900 dark:border-slate-700 shadow-md transition-all duration-300 min-h-[140px]">
            {!isEditingProfile ? (
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 z-10 relative w-full h-full">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  {/* Clean Professional Avatar Centered exactly on the Top Border Line */}
                  <div className="relative shrink-0 -mt-[80px] sm:-mt-[96px] mb-1 sm:mb-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white dark:bg-[#0d1628] border border-slate-300 dark:border-slate-700 rounded-full flex items-center justify-center overflow-hidden select-none shadow-lg ring-2 ring-white dark:ring-[#0d1628]">
                      {profileAvatar && (profileAvatar.startsWith('data:image/') || profileAvatar.startsWith('http')) ? (
                        <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-4xl sm:text-5xl">{profileAvatar || '😎'}</span>
                      )}
                    </div>
                  </div>

                  {/* Profile Info Details */}
                  <div className="space-y-1 sm:pt-1">
                    <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 block">
                      Welcome Back
                    </span>

                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <span>Hello, {profileName}!</span>
                        <button
                          type="button"
                          onClick={() => {
                            setRequestedNewName(profileName);
                            setIsEditingProfile(true);
                          }}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-xl transition-all hover:scale-110 cursor-pointer"
                          title="Edit display name"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1.5">
                      <span className="bg-slate-100 dark:bg-slate-800/90 px-3 py-1 rounded-xl text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono font-bold flex items-center gap-1.5">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">ID:</span>
                        <span className="text-blue-600 dark:text-blue-400">{currentUser.id}</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 rounded-xl text-xs font-extrabold" title="Account Verified">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Verified Publisher</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Inline Edit Profile Form */
              <form onSubmit={handleProfileSave} className="relative z-10 flex flex-col gap-3.5 animate-fade-up w-full text-left">
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Avatar / Upload Photo</span>

                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {['😎', '👩', '👨', '🦁', '🦊', '🐨', '🐼'].map(av => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => {
                          setProfileAvatar(av);
                          handleSavePhoto(av);
                        }}
                        className={`text-lg p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${profileAvatar === av ? 'bg-blue-100 dark:bg-blue-950/60 border-2 border-blue-500' : 'border border-transparent'}`}
                      >
                        {av}
                      </button>
                    ))}
                    
                    <label className="cursor-pointer flex items-center justify-center p-1.5 px-2.5 rounded-lg border border-dashed border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all" title="Upload custom image">
                      <span className="flex items-center gap-1 text-[10px]">
                        <Camera className="w-3 h-3" />
                        <span>Upload Photo</span>
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                               alert("Photo too large! (Limit 5MB)");
                               return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              const base64String = reader.result as string;
                              let finalAvatar = base64String;
                              try {
                                finalAvatar = await compressImageBase64(base64String, 200, 200, 0.8);
                              } catch (err) {
                                finalAvatar = base64String;
                              }
                              setProfileAvatar(finalAvatar);
                              handleSavePhoto(finalAvatar);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                
                <div className="w-full space-y-1">
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">New Display Name</span>
                  <input
                    type="text"
                    required
                    value={requestedNewName}
                    onChange={(e) => setRequestedNewName(e.target.value)}
                    placeholder="Type new display name here..."
                    className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                {/* Notice in English regarding ₹99 name replacement fee */}
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300/60 dark:border-amber-800/40 rounded-xl text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Name Replacement Charge: ₹99</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-normal font-medium">
                    Note: A <strong>₹99 fee</strong> is required to replace your display name. Clicking submit will open WhatsApp to send your name change request with your Publisher UID (<strong className="font-mono text-blue-600 dark:text-blue-400">{currentUser.id}</strong>) and details.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                     type="submit"
                     className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                     <Edit3 className="w-4 h-4" />
                     <span>Send Request on WhatsApp (₹99 Fee)</span>
                  </button>
                  <button
                     type="button"
                     onClick={() => setIsEditingProfile(false)}
                     className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs uppercase rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                     Cancel
                  </button>
                </div>
              </form>
            )}
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

      {/* 3. PC/Desktop Only: Desktop Horizontal Tabs Menu - Bento Style (visible on screen lengths >= 1024px) */}
      <div id="publisher-navbar-desktop" className="hidden lg:block relative border-b border-slate-200/50 dark:border-slate-800/50 pb-6 mb-8 select-none">
        <div className="flex flex-wrap items-stretch gap-2.5">
          {[
            { tabId: 'dashboard', label: 'Dashboard', desc: 'Overview & stats', icon: <Coins className="w-4.5 h-4.5" /> },
            { tabId: 'campaign', label: 'Live Campaign', desc: 'Browse active deals', icon: <FileText className="w-4.5 h-4.5" /> },
            { tabId: 'datasubmit', label: 'Leads Submit', desc: 'Upload proof files', icon: <UploadCloud className="w-4.5 h-4.5" /> },
            { tabId: 'mistracking', label: 'MIS Lead Report', desc: 'Track dispute logs', icon: <HelpCircle className="w-4.5 h-4.5" /> },
            { tabId: 'verification', label: 'Client File Submit', desc: 'Lead approval states', icon: <CheckCircle2 className="w-4.5 h-4.5" /> },
            { tabId: 'topearners', label: 'Top Earners Board', desc: 'High payout records', icon: <Trophy className="w-4.5 h-4.5" /> },
            { tabId: 'bankupdate', label: 'Bank Update', desc: 'Configure bank / UPI', icon: <QrCode className="w-4.5 h-4.5" /> }
          ].map((btn) => (
            <button
              key={btn.tabId}
              type="button"
              onClick={() => setActiveTab(btn.tabId as TabType)}
              className={`flex-1 min-w-[130px] max-w-[185px] p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
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
                <span className={`text-xs sm:text-[13px] font-black tracking-tight block ${activeTab === btn.tabId ? 'text-indigo-700 dark:text-indigo-350' : 'text-slate-900 dark:text-slate-200'}`}>{btn.label}</span>
                {btn.desc ? (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium leading-normal mt-0.5">{btn.desc}</span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Tab Context Router panels */}

      {/* TAB A: Dashboard */}
      {activeTab === 'dashboard' && (
        <div id="tabPanel-dashboard" className="space-y-8 animate-fade-up">

          {/* Main cards display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Card 1: All time total */}
            <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800 text-white rounded-3xl p-6 shadow-xl shadow-indigo-500/10 border border-indigo-400/30 dark:border-indigo-500/30 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-center relative z-10">
                <span className="text-xs font-black uppercase tracking-widest text-indigo-100">All-Time Earnings</span>
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-inner">
                  <IndianRupee className="w-5 h-5 fill-amber-300 animate-bounce" />
                </div>
              </div>
              <h3 className="text-3xl font-black font-mono mt-4 text-white tracking-tight relative z-10">₹{publisherEarningStats.total}</h3>
              <p className="text-[11px] text-indigo-100 font-medium mt-2.5 relative z-10">Total payout successfully consolidated.</p>
            </div>

            {/* Card 2: Last 7 Days */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent bg-white dark:bg-[#0d1628] rounded-3xl p-6 border border-emerald-500/25 dark:border-emerald-500/30 shadow-xl shadow-emerald-500/5 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-center relative z-10">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400">Last 7 Days</span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-4 tracking-tight relative z-10">₹{publisherEarningStats.last7}</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-2.5 relative z-10">Recent payout logs checked.</p>
            </div>

            {/* Card 3: Last 30 Days */}
            <div className="bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-transparent bg-white dark:bg-[#0d1628] rounded-3xl p-6 border border-sky-500/25 dark:border-sky-500/30 shadow-xl shadow-sky-500/5 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-center relative z-10">
                <span className="text-xs font-black uppercase tracking-widest text-sky-800 dark:text-sky-400">Last 30 Days</span>
                <div className="w-10 h-10 rounded-2xl bg-sky-500/15 dark:bg-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <Coins className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-4 tracking-tight relative z-10">₹{publisherEarningStats.last30}</h3>
              <p className="text-[11px] text-sky-600 dark:text-sky-400 font-bold mt-2.5 relative z-10">Evaluated active lead cycles.</p>
            </div>

          </div>

          {/* 2-Column Grid: My Income Desk + Total Work Box Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* NEW: Profile Summary Card */}
            <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                {profileAvatar && (profileAvatar.startsWith('data:image/') || profileAvatar.startsWith('http') || profileAvatar.startsWith('/api/')) ? (
                  <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-4xl">{profileAvatar || '😎'}</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{profileName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">ID: {currentUser?.id}</p>
                <div className="mt-2 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  <p>Bank: {bankAccount || 'Not set'}</p>
                  <p>UPI: {bankUpi || 'Not set'}</p>
                </div>
              </div>
            </div>
            
            {/* Card 3: Right Dynamic Income Desk Card */}
            <div className="relative bg-gradient-to-b from-white/90 to-emerald-50/30 dark:from-[#0d1628] dark:to-emerald-950/20 border-2 border-slate-900 dark:border-slate-700 p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:shadow-lg group overflow-hidden min-h-[140px] shadow-sm">
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

              <div className="my-3 flex items-baseline gap-1 text-left">
                <span className="text-sm font-black text-slate-400 dark:text-slate-500">₹</span>
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-450 font-mono tracking-tight">
                  {publisherEarningStats.total}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-semibold leading-none text-left">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Database synced & locked in</span>
              </div>
            </div>

            {/* Total Work Box Card */}
            <div className="relative bg-white dark:bg-[#0d1628] border-2 border-slate-900 dark:border-slate-700 rounded-3xl p-6 transition-all duration-300 hover:shadow-lg overflow-hidden flex flex-col justify-between min-h-[140px] shadow-sm">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-slate-455 dark:text-slate-500 uppercase font-black tracking-widest leading-none">Total Work</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black text-slate-855 dark:text-slate-100 font-mono">
                        {pubSubmissions.length}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Leads</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Breakdown badges */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
                  ✓ {pubSubmissions.filter(s => ['approved', 'Approved', 'Payment Done', 'Trade Done'].includes(s.status)).length} Approved
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40">
                  ⏳ {pubSubmissions.filter(s => ['pending', 'Process'].includes(s.status)).length} In Verification
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-semibold leading-none text-left mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span>All submitted leads locked & synced safely</span>
              </div>
            </div>

          </div>

          {/* My Client Submissions Feed in Main Dashboard */}
          <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 border-2 border-slate-900 dark:border-slate-700 shadow-sm mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-indigo-500" />
                  <span>My Client Submissions (सबमिट किए गए लीड्स)</span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Real-time status of your submitted client leads</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('datasubmit')}
                  className="text-[11px] font-bold px-3.5 py-1.5 bg-brand-primary text-white rounded-xl hover:bg-blue-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span>+ Submit New Lead</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('mistracking')}
                  className="text-[10px] font-bold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-750 transition cursor-pointer"
                >
                  View All in MIS ↗
                </button>
              </div>
            </div>

            {pubSubmissions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs font-medium border-2 border-dashed border-slate-100 dark:border-slate-850 rounded-2xl">
                <p>No campaign submissions yet for your publisher account.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('datasubmit')}
                  className="mt-3 text-xs font-bold text-brand-accent underline hover:text-blue-500 cursor-pointer"
                >
                  Click here to submit your first client conversion
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-450 uppercase font-extrabold tracking-widest bg-slate-50 dark:bg-slate-900/10">
                      <th className="p-3 rounded-l-xl">Campaign Name</th>
                      <th className="p-3">Client Name & Phone</th>
                      <th className="p-3">Client Code</th>
                      <th className="p-3">Payout</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Screenshot</th>
                      <th className="p-3 rounded-r-xl text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pubSubmissions.slice(0, 10).map((sub) => (
                      <tr key={sub.id} className="border-b border-slate-50 dark:border-slate-850/20 hover:bg-slate-50/50 dark:hover:bg-slate-850/10 transition">
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
                        <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          ₹{sub.payout || 0}
                        </td>
                        <td className="p-3 text-slate-400 text-[11px]">
                          {sub.submitDate}
                        </td>
                        <td className="p-3">
                          {sub.screenshot ? (
                            <button
                              type="button"
                              onClick={() => setPreviewImage(sub.screenshot)}
                              className="text-brand-accent underline hover:text-blue-500 font-extrabold text-xs cursor-pointer inline-flex items-center gap-1"
                            >
                              View ↗
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[10px]">No file</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <span className={`inline-flex px-2.5 py-1 font-bold text-[10px] rounded-full uppercase tracking-wider ${
                            sub.status === 'Payment Done' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800' :
                            sub.status === 'Trade Done' ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-800' :
                            sub.status === 'Process' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-850 dark:text-amber-400 border border-amber-300 dark:border-amber-800 animate-pulse' :
                            sub.status === 'Reject' ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800' :
                            'bg-blue-100 dark:bg-blue-950/40 text-blue-750 dark:text-blue-350 border border-blue-300 dark:border-blue-800'
                          }`}>
                            {sub.status}
                          </span>
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
                disabled={isSubmitting}
                className={`mt-6 w-full py-4 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                  isSubmitting 
                    ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-80' 
                    : 'bg-brand-primary hover:bg-blue-700 cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting client lead...
                  </>
                ) : (
                  'Submit Client Lead data'
                )}
              </button>

            </form>
          </div>

          {/* Quick Submissions Feed below form */}
          {pubSubmissions.length > 0 && (
            <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-md mt-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Recently Submitted Leads ({pubSubmissions.length})
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('mistracking')}
                  className="text-[11px] font-bold text-brand-accent hover:underline cursor-pointer"
                >
                  Full Report ↗
                </button>
              </div>
              <div className="space-y-2.5">
                {pubSubmissions.slice(0, 3).map((sub) => (
                  <div key={sub.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{sub.clientName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({sub.clientPhone})</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{sub.campaignName} • ₹{sub.payout}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider ${
                      sub.status === 'Payment Done' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400' :
                      sub.status === 'Trade Done' ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-400' :
                      sub.status === 'Process' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 animate-pulse' :
                      sub.status === 'Reject' ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400' :
                      'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                No campaign submissions located for your publisher account. Submit conversions in Leads Submit first.
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
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* List remaining earners */}
            <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xs relative overflow-hidden min-h-[320px]">
              {/* Coming Soon Premium Overlay */}
              <div className="absolute inset-0 bg-white/80 dark:bg-[#0d1628]/90 backdrop-blur-xs flex flex-col items-center justify-center z-20 p-6 select-none">
                <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-sm animate-bounce" style={{ animationDuration: '3s' }}>
                  <Trophy className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-slate-850 dark:text-slate-100 uppercase tracking-widest font-mono">Coming Soon</h4>
                <p className="text-[11px] text-slate-450 dark:text-slate-505 font-bold uppercase tracking-wider mt-1.5 text-center max-w-xs leading-relaxed">
                  Live publishers leaderboard ranking will go active shortly
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-[9px] text-indigo-550 dark:text-indigo-400 font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-550 dark:bg-indigo-400 animate-ping" />
                  <span>Integrating System Ledgers</span>
                </div>
              </div>

              <div className="text-center pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Top Earners Leaderboard</h3>
                <p className="text-xs text-slate-450 mt-1">Our live public high-earning publishers performance list</p>
              </div>
              
              <div className="space-y-3">
                {getLeaderboard().length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">Join the active earners ranking by creating verified transactions!</div>
                ) : (
                  getLeaderboard().map((leader, i) => (
                    <div key={leader.id} className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/40 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/60">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold w-6 text-center text-slate-500 dark:text-slate-400">
                          #{i + 1}
                        </span>
                        {leader.avatar && (leader.avatar.startsWith('data:image/') || leader.avatar.startsWith('http') || leader.avatar.startsWith('/api/')) ? (
                          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-2xs">
                            <img src={leader.avatar} alt="User Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ) : (
                          <span className="text-xl select-none w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 rounded-full">{leader.avatar}</span>
                        )}
                        <div>
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">{leader.name}</span>
                          <span className="text-[9px] text-slate-455 block font-mono">{leader.id}</span>
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
        <div id="tabPanel-bankUpdate" className="max-w-2xl mx-auto animate-fade-up space-y-6">
          <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-md">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 text-center">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Payout & Banking Ledger Setup</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Provide correct bank account or UPI coordinates. All financial data is 256-bit encrypted.</p>
            </div>

            {bankFormMsg && (
              <div id="bank-sucess-notification" className="p-3.5 mb-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 font-bold text-xs rounded-xl text-center">
                {bankFormMsg}
              </div>
            )}

            <form onSubmit={handleBankFormReview} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Holder Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <span>Account Holder Name</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full name as per bank passbook"
                    value={bankHolderName}
                    onChange={(e) => setBankHolderName(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 text-slate-850 dark:text-white font-medium"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <span>Contact Phone Number</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={bankPhone}
                    onChange={(e) => setBankPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 text-slate-850 dark:text-white font-mono"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Account Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <span>Bank Account Number</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter bank account number"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value.replace(/\s/g, ''))}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 text-slate-850 dark:text-white font-mono"
                  />
                </div>

                {/* IFSC Code */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <span>IFSC Code</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SBIN0001092"
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value.toUpperCase().replace(/\s/g, ''))}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 text-slate-850 dark:text-white font-mono uppercase"
                  />
                </div>

              </div>

              {/* UPI ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <span>UPI ID Address</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. username@okaxis or 9876543210@paytm"
                  value={bankUpi}
                  onChange={(e) => setBankUpi(e.target.value.replace(/\s/g, ''))}
                  className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 text-slate-850 dark:text-white font-mono"
                />
              </div>

              {/* UPI QR upload code */}
              <div className="flex flex-col gap-1.5 pt-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Upload Personal UPI QR Code (Optional)</label>
                
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
                className="mt-6 w-full py-4 bg-[#10b981] hover:bg-emerald-600 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Banking Details</span>
              </button>

            </form>
          </div>

          {/* Payout History Section (Last 5 Only) */}
          <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 sm:p-8 border-2 border-slate-900 dark:border-slate-700 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Payout History</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Previous successful UPI settlements for your account
                </p>
              </div>
              <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                Last 5 Only
              </span>
            </div>

            {userPayoutHistory.length === 0 ? (
              <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Coins className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">No UPI settlements recorded yet</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  When campaign conversions are processed and paid out, your successful settlements will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="pb-3 px-2">Campaign / ID</th>
                      <th className="pb-3 px-2">Settlement UPI</th>
                      <th className="pb-3 px-2 text-right">Payout Amount</th>
                      <th className="pb-3 px-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-semibold">
                    {userPayoutHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-2">
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 block">{item.campaignName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{item.id} • {item.date}</span>
                        </td>
                        <td className="py-3 px-2 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                          {item.upi}
                        </td>
                        <td className="py-3 px-2 text-right font-black text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                          ₹{item.amount}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>Paid Done</span>
                          </span>
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

      {/* Dynamic Animated Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setShowSuccessPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative bg-white dark:bg-[#0d1628] rounded-3xl p-8 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl text-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Confetti / Particle effect container (pure CSS) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
                <div className="absolute top-10 left-10 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                <div className="absolute top-24 right-12 w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
                <div className="absolute bottom-16 left-16 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
              </div>

              {/* Animated Checkmark SVG */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center border border-emerald-100 dark:border-emerald-800/40 shadow-inner">
                  <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Data Saved Successfully!
              </h3>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                Your client lead submission has been safely recorded in our network database. You can track its live verification status right from your dashboard!
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessPopup(false);
                    setActiveTab('dashboard');
                  }}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  View In Dashboard ↗
                </button>
                <button
                  type="button"
                  onClick={() => setShowSuccessPopup(false)}
                  className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold text-xs tracking-wider uppercase rounded-xl transition cursor-pointer"
                >
                  Submit Another
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Animated Bank Warning / Incomplete Info Modal */}
      <AnimatePresence>
        {showBankWarningModal && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
            onClick={() => setShowBankWarningModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              className="relative bg-white dark:bg-[#0d1628] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-200 dark:border-rose-900/50 shadow-2xl text-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />
              
              <div className="flex justify-center mb-5 mt-2">
                <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/50 rounded-2xl flex items-center justify-center border border-rose-200 dark:border-rose-800/60 shadow-inner">
                  <AlertCircle className="w-8 h-8 text-rose-500 animate-bounce" />
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                {bankWarningMsg || 'Incomplete Bank Information'}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">
                We could not save your bank details because some mandatory fields are missing or incomplete. Please review and fill out the details below:
              </p>

              {missingFieldsList.length > 0 && (
                <div className="mb-6 p-4 bg-rose-50/80 dark:bg-rose-950/30 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 text-left space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-1">
                    Required / Missing Fields:
                  </span>
                  {missingFieldsList.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowBankWarningModal(false)}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs tracking-wider uppercase rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Complete Required Fields
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bank Details Review & Checkout Modal */}
      <AnimatePresence>
        {showBankConfirmModal && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
            onClick={() => !isSavingBank && setShowBankConfirmModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-white dark:bg-[#0d1628] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Verify Banking Details
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Confirm payout coordinates before saving
                    </p>
                  </div>
                </div>
                {!isSavingBank && (
                  <button
                    onClick={() => setShowBankConfirmModal(false)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Summary Checkout Card */}
              <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3.5 mb-6">
                
                <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account Holder</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{bankHolderName}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone</span>
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{bankPhone}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
                      {showMaskedAccount ? getMaskedAccount(bankAccount) : bankAccount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowMaskedAccount(!showMaskedAccount)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showMaskedAccount ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">IFSC Code</span>
                  <span className="text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-200">{bankIfsc}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">UPI ID Address</span>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{bankUpi}</span>
                </div>

                {bankQrCode && (
                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Attached UPI QR Code</span>
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                      <img src={bankQrCode} alt="Attached QR Code" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl mb-6 text-[11px] text-amber-800 dark:text-amber-300 font-medium flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Please double check all digits carefully. Future payout disbursements will automatically be routed to these coordinates.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isSavingBank}
                  onClick={() => setShowBankConfirmModal(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  disabled={isSavingBank}
                  onClick={handleConfirmBankSave}
                  className="py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs tracking-wider uppercase rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingBank ? (
                    <span>Saving Ledger...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>CONFIRM</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Animated Bank Details Success Modal */}
      <AnimatePresence>
        {showBankSuccessModal && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
            onClick={() => setShowBankSuccessModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative bg-white dark:bg-[#0d1628] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-emerald-200 dark:border-emerald-900/50 shadow-2xl text-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Confetti effect container */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
                <div className="absolute top-10 left-10 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                <div className="absolute top-24 right-12 w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
                <div className="absolute bottom-16 left-16 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
              </div>

              {/* Glowing animated check mark */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                  <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg relative z-10">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Bank Details Saved Successfully!
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6">
                Your payout coordinates have been encrypted and saved. All future commission disbursements will be deposited directly to this verified account.
              </p>

              {/* Receipt Box */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-left space-y-2 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Account Holder:</span>
                  <span className="font-black text-slate-800 dark:text-slate-200">{bankHolderName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Account No:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{getMaskedAccount(bankAccount)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">IFSC Code:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{bankIfsc}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">UPI Address:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{bankUpi}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowBankSuccessModal(false)}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs tracking-wider uppercase rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Done / Return to Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
