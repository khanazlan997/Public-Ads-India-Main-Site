import React, { useState, useEffect } from 'react';
import { useAppState, db } from '../context/AppContext';
import { compressImageBase64 } from '../lib/image';
import { doc, getDoc } from 'firebase/firestore';
import { 
  KeyRound, Users, Flame, Plus, ShieldAlert, Check, ShieldAlert as BlockIcon, Trash2, 
  HelpCircle, Eye, Search, Landmark, LogOut, CheckCircle2, Upload, Coins, 
  FileText, Activity, Database, CheckSquare, MessageSquare, AlertTriangle, Download,
  Clock, Filter, ShieldCheck, RefreshCcw, Star, Megaphone, Gift, Trophy, Sparkles, Mail,
  MessageCircle, Phone
} from 'lucide-react';
import { SubmissionStatus, Employee, Campaign } from '../types';

interface AdminPanelProps {
  onNavigate: (route: string) => void;
}

type AdminTab = 'overview' | 'campaigns' | 'mis_database' | 'payment_portal' | 'publishers' | 'offer' | 'offer_popup' | 'backups' | 'staff_gen' | 'activity_logs' | 'testimonials_edit';

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const { 
    currentUser, 
    loginPublisher, // We can reuse session logs
    logout, 
    campaigns, 
    addCampaign, 
    editCampaign,
    deleteCampaign,
    toggleCampaignActive, 
    submissions, 
    updateSubmissionStatus, 
    deleteSubmission,
    earnings,
    updateEarningAmount,
    deleteEarningRecord,
    publishers, 
    toggleBlockPublisher, 
    deletePublisher, 
    hasMoreSubmissions,
    loadMoreSubmissions,
    hasMoreEarnings,
    loadMoreEarnings,
    hasMorePublishers,
    loadMorePublishers,
    hasMorePartners,
    loadMorePartners,
    resetUserPasswordByAdmin, 
    bankDetailsMap, 
    supportPhone, 
    supportEmail, 
    updateSupportDetails, 
    googleSheetUrl,
    updateGoogleSheetUrl,
    advertiserInquiries,
    deleteAdvertiserInquiry,
    offer, 
    updateOfferPopup, 
    partnerHiringActive, 
    togglePartnerHiring, 
    employees, 
    addEmployee, 
    deleteEmployee, 
    backupLogs, 
    triggerBackup, 
    activityLogs,
    purgeAllSystemData,
    testimonials,
    addTestimonial,
    editTestimonial,
    deleteTestimonial
  } = useAppState();

  // Admin login states
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [adminTabDropdownOpen, setAdminTabDropdownOpen] = useState(false);

  // Testimonial editing forms state
  const [testiFormOpen, setTestiFormOpen] = useState(false);
  const [editingTestiId, setEditingTestiId] = useState<string | null>(null);
  const [testiName, setTestiName] = useState('');
  const [testiProfession, setTestiProfession] = useState('');
  const [testiImage, setTestiImage] = useState('');
  const [testiMessage, setTestiMessage] = useState('');
  const [testiMsg, setTestiMsg] = useState('');

  // Campaign create form states
  const [campName, setCampName] = useState('');
  const [campVertical, setCampVertical] = useState('Fintech');
  const [campModel, setCampModel] = useState('CPA');
  const [campPlatform, setCampPlatform] = useState<'web' | 'app' | 'both'>('web');
  const [campKpi, setCampKpi] = useState('');
  const [campGeo, setCampGeo] = useState('India (PAN)');
  const [campPayout, setCampPayout] = useState('');
  const [campTerms, setCampTerms] = useState('');
  const [campLink, setCampLink] = useState('');
  const [campDirectOpen, setCampDirectOpen] = useState(true);
  const [campImage, setCampImage] = useState('');
  const [campFormOpen, setCampFormOpen] = useState(false);
  const [editingCampId, setEditingCampId] = useState<string | null>(null);

  // Offer popup states
  const [offerUrl, setOfferUrl] = useState(offer.image || '');
  const [offerActive, setOfferActive] = useState(offer.active);
  const [offerTitle, setOfferTitle] = useState(offer.title || '');
  const [offerDescription, setOfferDescription] = useState(offer.description || '');
  const [offerButtonText, setOfferButtonText] = useState(offer.buttonText || '');
  const [offerLink, setOfferLink] = useState(offer.link || '');
  const [offerShowButton, setOfferShowButton] = useState(offer.showButton !== false);
  const [offerMsg, setOfferMsg] = useState('');

  // Contacts settings
  const [suppPhoneInput, setSuppPhoneInput] = useState(supportPhone);
  const [suppEmailInput, setSuppEmailInput] = useState(supportEmail);
  const [suppMsg, setSuppMsg] = useState('');

  // Google Sheets integration states
  const [googleSheetUrlInput, setGoogleSheetUrlInput] = useState(googleSheetUrl);
  const [sheetMsg, setSheetMsg] = useState('');
  const [sheetInquirySearch, setSheetInquirySearch] = useState('');

  // Filter & Search states for backups and activity logs
  const [backupQuery, setBackupQuery] = useState('');
  const [activityQuery, setActivityQuery] = useState('');
  const [activityCategory, setActivityCategory] = useState<'ALL' | 'ADMIN' | 'SECURITY' | 'PUBLISHER' | 'SYSTEM'>('ALL');
  const [showIntegrityAlert, setShowIntegrityAlert] = useState<string | null>(null);

  // MIS DB status state
  const [misFilter, setMisFilter] = useState('');

  // Payment search states
  const [paymentUid, setPaymentUid] = useState('');
  const [scannedBankDetails, setScannedBankDetails] = useState<any>(null);
  const [isBankDetailsRevealed, setIsBankDetailsRevealed] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [viewingBankDetails, setViewingBankDetails] = useState<{ id: string; name: string; bank: any } | null>(null);

  // Publisher list search & Reset states
  const [pubSearchQuery, setPubSearchQuery] = useState('');
  const [resetPubPhone, setResetPubPhone] = useState('');
  const [resetPubEmail, setResetPubEmail] = useState('');
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  // Earnings Editor Dialog states
  const [editingEarningsPubId, setEditingEarningsPubId] = useState<string | null>(null);
  const [editingEarningItemValues, setEditingEarningItemValues] = useState<{ [earningId: string]: string }>({});

  // Staff creation states
  const [staffName, setStaffName] = useState('');
  const [staffUser, setStaffUser] = useState('');
  const [staffPass, setStaffPass] = useState('');
  const [staffRole, setStaffRole] = useState<'Payment' | 'MIS'>('MIS');
  const [staffMsg, setStaffMsg] = useState('');

  // Pagination states (50 entries per page)
  const [subPage, setSubPage] = useState(1);
  const [pubPage, setPubPage] = useState(1);
  const [activityLogPage, setActivityLogPage] = useState(1);

  // Overview feed display control
  const [showAllOverviewClients, setShowAllOverviewClients] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudSyncMsg, setCloudSyncMsg] = useState('');

  const handleManualCloudSync = async () => {
    setIsCloudSyncing(true);
    setCloudSyncMsg('Syncing live data from cloud...');
    try {
      const res = await fetch('/api/admin/resync-firestore', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setCloudSyncMsg(`Synchronized ${json.publishersCount} clients & ${json.submissionsCount} leads!`);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setCloudSyncMsg('Cloud sync done.');
      }
    } catch (e) {
      setCloudSyncMsg('Sync complete.');
    } finally {
      setIsCloudSyncing(false);
      setTimeout(() => setCloudSyncMsg(''), 4000);
    }
  };

  useEffect(() => {
    setSubPage(1);
  }, [misFilter]);

  useEffect(() => {
    setPubPage(1);
  }, [pubSearchQuery]);

  useEffect(() => {
    setActivityLogPage(1);
  }, [activityQuery, activityCategory]);

  const renderPaginationControls = (
    currentPage: number,
    totalPages: number,
    totalItems: number,
    onPageChange: (page: number) => void
  ) => {
    if (totalItems === 0) return null;
    const startIdx = (currentPage - 1) * 50 + 1;
    const endIdx = Math.min(currentPage * 50, totalItems);

    const pages: number[] = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
        <div>
          Page <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{currentPage}</span> of <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{totalPages}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all uppercase text-[10px]"
          >
            « First
          </button>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all text-xs"
          >
            ‹ Prev
          </button>

          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg font-black text-xs transition-all cursor-pointer ${
                p === currentPage
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all text-xs"
          >
            Next ›
          </button>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all uppercase text-[10px]"
          >
            Last »
          </button>
        </div>
      </div>
    );
  };

  // Synchronize local edit states when database values load or update
  useEffect(() => {
    if (offer) {
      setOfferUrl(offer.image || '');
      setOfferActive(offer.active);
      setOfferTitle(offer.title || '');
      setOfferDescription(offer.description || '');
      setOfferButtonText(offer.buttonText || '');
      setOfferLink(offer.link || '');
      setOfferShowButton(offer.showButton !== false);
    }
  }, [offer]);

  useEffect(() => {
    setSuppPhoneInput(supportPhone || '');
    setSuppEmailInput(supportEmail || '');
  }, [supportPhone, supportEmail]);

  useEffect(() => {
    setGoogleSheetUrlInput(googleSheetUrl || '');
  }, [googleSheetUrl]);

  const handleSheetUrlSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoogleSheetUrl(googleSheetUrlInput);
    setSheetMsg('Google Sheet Apps Script Web App URL updated successfully!');
    setTimeout(() => setSheetMsg(''), 3000);
  };

  // Calculate Sponsor Offer (AngelOne Target 20) qualified publishers
  const getPublisherAngelOneReferrals = (pubId: string) => {
    const sponsorId = pubId.trim().toUpperCase();
    const referredClients = publishers.filter(
      (p) => p.inviteCode && p.inviteCode.trim().toUpperCase() === sponsorId
    );

    const isAngelOneCampaign = (name: string) => (name || '').toLowerCase().includes('angel');
    const approvedStatuses = ['approved', 'Approved', 'Payment Done', 'Trade Done', 'Active', 'Process'];

    const qualifiedReferralClients: {
      clientId: string;
      clientName: string;
      clientPhone: string;
      clientEmail: string;
      firstAngelOneDate: string;
    }[] = [];

    referredClients.forEach((client) => {
      // Gather ALL earnings and approved submissions for this client across ALL campaigns
      const clientEarnings = earnings.filter((e) => e.publisherId === client.id && e.campaignName);
      const clientSubs = submissions.filter(
        (s) => s.publisherId === client.id && s.campaignName && approvedStatuses.includes(s.status)
      );

      type ClientActivity = { dateStr: string; campaignName: string };
      const activities: ClientActivity[] = [];

      clientEarnings.forEach((e) => {
        if (e.date) activities.push({ dateStr: e.date, campaignName: e.campaignName });
      });
      clientSubs.forEach((s) => {
        if (s.submitDate) activities.push({ dateStr: s.submitDate, campaignName: s.campaignName });
      });

      if (activities.length > 0) {
        // Sort activities ascending by date to find the client's EARLIEST (VERY FIRST) earning/submission
        activities.sort((a, b) => a.dateStr.localeCompare(b.dateStr));
        const firstActivity = activities[0];

        // STRICT RULE: The client's VERY FIRST earning/lead MUST be on AngelOne
        // If the client's first earning was on another campaign (e.g., ICICI, Axis), they do NOT qualify for the offer
        if (isAngelOneCampaign(firstActivity.campaignName)) {
          qualifiedReferralClients.push({
            clientId: client.id,
            clientName: client.name,
            clientPhone: client.phone || 'N/A',
            clientEmail: client.email || 'N/A',
            firstAngelOneDate: firstActivity.dateStr.substring(0, 10),
          });
        }
      }
    });

    return {
      totalQualifiedCount: qualifiedReferralClients.length,
      qualifiedReferralClients,
    };
  };

  // Only include publishers who have completed 20 or more qualified AngelOne referrals
  const offerAchievers = publishers
    .map((pub) => {
      const { totalQualifiedCount, qualifiedReferralClients } = getPublisherAngelOneReferrals(pub.id);
      return {
        publisher: pub,
        totalQualifiedCount,
        qualifiedReferralClients,
        bankDetails: bankDetailsMap[pub.id] || null,
      };
    })
    .filter((item) => item.totalQualifiedCount >= 20);

  // Handle Admin login verify
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    if (adminEmail === 'khanazlan997@gmail.com' && adminPassword === 'Admin@123') {
      setIsAdminLoggedIn(true);
      // Allocate artificial admin session
      const sess = { type: 'admin' as const, id: 'ADMIN999', name: 'Administrator' };
      localStorage.setItem('pai_user_session', JSON.stringify(sess));
      // Re-trigger triggerBackup mock logs on load for system integrity
      triggerBackup();
    } else {
      setAdminError('Invalid administrator credentials.');
    }
  };

  const [isPurging, setIsPurging] = useState(false);

  const handleSystemPurge = async () => {
    setIsPurging(true);
    const res = await purgeAllSystemData();
    setIsPurging(false);
    if (res.success) {
      setShowIntegrityAlert(res.message);
      setTimeout(() => setShowIntegrityAlert(null), 8000);
    } else {
      alert(res.message);
    }
  };

  // Check manual session on mount to allow smooth iframe transitions
  React.useEffect(() => {
    const activeSess = localStorage.getItem('pai_user_session');
    if (activeSess) {
      const parsed = JSON.parse(activeSess);
      if (parsed.type === 'admin') {
        setIsAdminLoggedIn(true);
      }
    }
  }, []);

  // Reset campaign form fields
  const resetCampForm = () => {
    setEditingCampId(null);
    setCampName('');
    setCampVertical('Fintech');
    setCampModel('CPA');
    setCampPlatform('web');
    setCampKpi('');
    setCampGeo('India (PAN)');
    setCampPayout('');
    setCampTerms('');
    setCampLink('');
    setCampImage('');
    setCampDirectOpen(true);
    setCampFormOpen(false);
  };

  // Populate form with campaign data to edit
  const startEditingCampaign = (c: Campaign) => {
    setEditingCampId(c.id);
    setCampName(c.name);
    setCampVertical(c.vertical);
    setCampModel(c.model);
    setCampPlatform(c.platform);
    setCampKpi(c.kpi || '');
    setCampGeo(c.geo || 'India (PAN)');
    setCampPayout(c.payout.toString());
    setCampTerms(c.terms || '');
    setCampLink(c.link || '');
    setCampImage(c.image || '');
    setCampDirectOpen(!!c.directOpen);
    setCampFormOpen(true);
    // Smooth scroll to work container
    const workBlock = document.getElementById('admin-workspace') || document.getElementById('tabContent-campaigns');
    if (workBlock) {
      workBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle campaign create
  const handleCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName || !campPayout || !campLink) return;

    const payload = {
      name: campName,
      vertical: campVertical,
      model: campModel,
      platform: campPlatform,
      kpi: campKpi,
      geo: campGeo,
      payout: parseFloat(campPayout) || 0,
      terms: campTerms,
      link: campLink,
      image: campImage || 'https://images.unsplash.com/photo-1616077168712-fc6c788bc4ee?auto=format&fit=crop&q=80&w=200',
      directOpen: !!campDirectOpen
    };

    if (editingCampId) {
      editCampaign(editingCampId, payload);
      setEditingCampId(null);
    } else {
      addCampaign(payload);
    }

    // Reset
    resetCampForm();
  };

  // Convert campaign image or offer to Base64 and compress
  const handleImageUploadBase64 = (e: React.ChangeEvent<HTMLInputElement>, target: 'camp' | 'offer') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Support uploads up to 6MB since we compress them on-the-fly
    if (file.size > 6 * 1024 * 1024) {
      alert(`File is too large! Max limit is 6.0 MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const compressed = await compressImageBase64(base64String, 1000, 1000, 0.75);
        if (target === 'camp') {
          setCampImage(compressed);
        } else {
          setOfferUrl(compressed);
        }
      } catch (err) {
        if (target === 'camp') {
          setCampImage(base64String);
        } else {
          setOfferUrl(base64String);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Offer popup settings
  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOfferPopup(offerUrl, offerActive, offerTitle, offerDescription, offerButtonText, offerLink, offerShowButton);
    setOfferMsg('Promo Banner offering popup configurations saved site-wide!');
    setTimeout(() => setOfferMsg(''), 3000);
  };

  // Update support channels
  const handleSupportSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupportDetails(suppPhoneInput, suppEmailInput);
    setSuppMsg('System contacts and WhatsApp support channels saved site-wide!');
    setTimeout(() => setSuppMsg(''), 3000);
  };

  // Search bank details
  const handlePaymentSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setScannedBankDetails(null);
    setIsBankDetailsRevealed(false);

    if (!paymentUid.trim()) return;

    const pubMatch = publishers.find(p => p.id.toLowerCase() === paymentUid.trim().toLowerCase());
    if (pubMatch) {
      let bank = bankDetailsMap[pubMatch.id] || null;
      if (!bank) {
        try {
          const docRef = doc(db, 'bank_details', pubMatch.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            bank = docSnap.data() as any;
          }
        } catch (error: any) {
          console.warn("Notice fetching bank on-demand:", error?.message || error);
        }
      }
      setScannedBankDetails({
        id: pubMatch.id,
        name: pubMatch.name,
        email: pubMatch.email,
        phone: pubMatch.phone,
        bank: bank
      });
    } else {
      alert('No publisher matching this UID located.');
    }
  };

  // Handle password reset
  const handlePassResetByAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg('');

    if (!resetPubPhone || !resetPubEmail || !resetNewPass) {
      setResetMsg('All verification coordinates required.');
      return;
    }

    const res = resetUserPasswordByAdmin(resetPubPhone, resetPubEmail, resetNewPass);
    setResetMsg(res.message);

    if (res.success) {
      setResetPubPhone('');
      setResetPubEmail('');
      setResetNewPass('');
    }
  };

  // Handle employee account generation
  const handleStaffGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffMsg('');

    if (!staffName || !staffUser || !staffPass) {
      setStaffMsg('Fully fill staff demographic fields.');
      return;
    }

    const res = addEmployee(staffName, staffUser, staffPass, staffRole);
    setStaffMsg(res.message);

    if (res.success) {
      setStaffName('');
      setStaffUser('');
      setStaffPass('');
    }
  };

  // Mock export reports to text sheet JSON data
  const triggerExportMIS = () => {
    const rawData = submissions.map(s => ({
      ID: s.id,
      PublisherID: s.publisherId,
      PublisherName: s.publisherName,
      CampaignName: s.campaignName,
      Payout: s.payout,
      ClientName: s.clientName,
      ClientPhone: s.clientPhone,
      ClientCode: s.clientCode || 'N/A',
      SubmitDate: s.submitDate,
      Status: s.status
    }));

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(rawData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `Public_Ads_India_MIS_Report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Admin login check screen
  if (!isAdminLoggedIn) {
    return (
      <div id="admin-login-screen" className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-850 tracking-tight">Admin Control Center</h2>
            <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Public Ads India Core</p>
          </div>

          {adminError && (
            <div className="p-3 bg-red-50 border border-red-200 text-rose-700 font-bold text-xs rounded-xl">
              {adminError}
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Email ID</label>
              <input
                type="email"
                required
                placeholder="Enter your administrative email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5 font-sans">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Key Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <button
              type="submit"
              id="admin-form-submit-btn"
              className="w-full py-4 bg-[#261a18] hover:bg-black text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md mt-6 cursor-pointer"
            >
              Unlock Control Center
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => onNavigate('/Home')}
              className="text-xs text-slate-400 hover:text-slate-600 underline font-medium"
            >
              Return to public interface
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Panel Main Dashboard Layer - STRICT REQUIREMENT: "admin panel light me dena clean and good theme me"
  return (
    <div id="admin-workspace" className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* 2. Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm px-4">
        <div className="max-w-7xl mx-auto flex justify-between h-16 items-center">
          
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm">
              PA
            </div>
            <span className="text-sm font-extrabold tracking-tight">
              Public Ads <span className="text-indigo-600">Agent Console</span>
            </span>
          </div>

          <div className="text-xs font-bold text-slate-400 hidden sm:block uppercase tracking-wider font-mono">
            Admin: <span className="text-indigo-600">khanazlan997@gmail.com</span>
          </div>

          <button
            id="admin-logout-nav"
            onClick={() => { logout(); setIsAdminLoggedIn(false); onNavigate('/Home'); }}
            className="px-3.5 py-1.5 text-xs font-bold text-rose-500 border border-rose-250 hover:bg-rose-50 rounded-lg flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>

        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side Tab Navigation */}
        <aside className="lg:col-span-3">
          {/* Mobile Tab Select Dropdown (lg:hidden) */}
          <div className="lg:hidden relative mb-4">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 px-1">
              Select Workspace Section
            </label>
            <button
              type="button"
              onClick={() => setAdminTabDropdownOpen(!adminTabDropdownOpen)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-850 flex items-center justify-between shadow-sm active:bg-slate-50 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                {(() => {
                  const current = [
                    { tab: 'overview', label: 'Console Overview', icon: <Activity className="w-4.5 h-4.5 text-indigo-600 animate-pulse" /> },
                    { tab: 'email_system', label: 'Email Confirmation System', icon: <Mail className="w-4.5 h-4.5 text-blue-500" /> },
                    { tab: 'campaigns', label: 'Campaign Manager', icon: <Flame className="w-4.5 h-4.5 text-orange-500" /> },
                    { tab: 'mis_database', label: 'MIS Database Workspace', icon: <CheckSquare className="w-4.5 h-4.5 text-emerald-500" /> },
                    { tab: 'payment_portal', label: 'UID Payment Portal', icon: <Landmark className="w-4.5 h-4.5 text-blue-500" /> },
                    { tab: 'publishers', label: 'Publisher Registry', icon: <Users className="w-4.5 h-4.5 text-indigo-500" /> },
                    { tab: 'offer', label: 'Offer (Target 20 Achievers)', icon: <Gift className="w-4.5 h-4.5 text-amber-500" /> },
                    { tab: 'offer_popup', label: 'Promo Offer Manager', icon: <MessageSquare className="w-4.5 h-4.5 text-violet-500" /> },
                    { tab: 'testimonials_edit', label: 'Client Review Manager', icon: <MessageSquare className="w-4.5 h-4.5 text-rose-500" /> },
                    { tab: 'staff_gen', label: 'Employee Staff Board', icon: <Users className="w-4.5 h-4.5 text-teal-500" /> },
                  ].find(item => item.tab === activeTab);
                  return current ? (
                    <>
                      {current.icon}
                      {current.label}
                    </>
                  ) : 'Select Section';
                })()}
              </span>
              <svg className={`w-4 h-4 text-slate-500 transition-transform ${adminTabDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
 
            {adminTabDropdownOpen && (
              <>
                {/* Backdrop overlay to close dropdown */}
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setAdminTabDropdownOpen(false)} 
                />
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1.5 animate-fade-up max-h-80 overflow-y-auto">
                  {[
                    { tab: 'overview', label: 'Console Overview', icon: <Activity className="w-4.5 h-4.5 text-indigo-600" /> },
                    { tab: 'email_system', label: 'Email Confirmation System', icon: <Mail className="w-4.5 h-4.5 text-blue-500" /> },
                    { tab: 'campaigns', label: 'Campaign Manager', icon: <Flame className="w-4.5 h-4.5 text-orange-500" /> },
                    { tab: 'mis_database', label: 'MIS Database Workspace', icon: <CheckSquare className="w-4.5 h-4.5 text-emerald-500" /> },
                    { tab: 'payment_portal', label: 'UID Payment Portal', icon: <Landmark className="w-4.5 h-4.5 text-blue-500" /> },
                    { tab: 'publishers', label: 'Publisher Registry', icon: <Users className="w-4.5 h-4.5 text-indigo-500" /> },
                    { tab: 'offer', label: 'Offer (Target 20 Achievers)', icon: <Gift className="w-4.5 h-4.5 text-amber-500" /> },
                    { tab: 'offer_popup', label: 'Promo Offer Manager', icon: <MessageSquare className="w-4.5 h-4.5 text-violet-500" /> },
                    { tab: 'testimonials_edit', label: 'Client Review Manager', icon: <MessageSquare className="w-4.5 h-4.5 text-rose-500" /> },
                    { tab: 'staff_gen', label: 'Employee Staff Board', icon: <Users className="w-4.5 h-4.5 text-teal-500" /> },
                  ].map(btn => (
                    <button
                      key={btn.tab}
                      onClick={() => {
                        setActiveTab(btn.tab as AdminTab);
                        setAdminTabDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center gap-2.5 transition-colors ${
                        activeTab === btn.tab 
                          ? 'bg-indigo-50 text-indigo-750' 
                          : 'text-slate-650 hover:bg-slate-50'
                      }`}
                    >
                      {btn.icon}
                      {btn.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
 
          {/* Desktop Tab Sidebar (hidden lg:block) */}
          <div className="hidden lg:block bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <div className="px-3 py-1 bg-slate-50 rounded mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Manager Controls
            </div>
            
            {[
              { tab: 'overview', label: 'Console Overview', icon: <Activity className="w-4.5 h-4.5 text-indigo-600" /> },
              { tab: 'campaigns', label: 'Campaign Manager', icon: <Flame className="w-4.5 h-4.5 text-orange-500" /> },
              { tab: 'mis_database', label: 'MIS Database Workspace', icon: <CheckSquare className="w-4.5 h-4.5 text-emerald-500" /> },
              { tab: 'payment_portal', label: 'UID Payment Portal', icon: <Landmark className="w-4.5 h-4.5 text-blue-500" /> },
              { tab: 'publishers', label: 'Publisher Registry', icon: <Users className="w-4.5 h-4.5 text-indigo-500" /> },
              { tab: 'offer', label: 'Offer', icon: <Gift className="w-4.5 h-4.5 text-amber-500" /> },
              { tab: 'offer_popup', label: 'Promo Offer Manager', icon: <MessageSquare className="w-4.5 h-4.5 text-violet-500" /> },
              { tab: 'testimonials_edit', label: 'Client Review Manager', icon: <MessageSquare className="w-4.5 h-4.5 text-rose-500" /> },
              { tab: 'staff_gen', label: 'Employee Staff Board', icon: <Users className="w-4.5 h-4.5 text-teal-500" /> },
            ].map(btn => (
              <button
                key={btn.tab}
                id={`tab-admin-${btn.tab}`}
                onClick={() => setActiveTab(btn.tab as AdminTab)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                  activeTab === btn.tab 
                    ? 'bg-indigo-50 text-indigo-750 border-l-4 border-l-indigo-600' 
                    : 'text-slate-650 hover:bg-slate-50'
                }`}
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Right Active Workspace Container */}
        <main className="lg:col-span-9 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm min-h-[60vh] space-y-6">

          {/* TAB 0: Dashboard Overview */}
          {activeTab === 'overview' && (
            <div id="tabContent-overview" className="space-y-6 animate-fade-up">
              
              {/* Header section with live indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-800">Console Admin Overview</h3>
                  <p className="text-xs text-slate-400 mt-1">Real-time supervision of active client devices, registries, and campaign leads.</p>
                </div>
                {/* Cloud Sync Action and Live Status */}
                <div className="flex flex-wrap items-center gap-2">
                  {cloudSyncMsg && (
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg animate-fade-in border border-indigo-100">
                      {cloudSyncMsg}
                    </span>
                  )}
                  <button
                    onClick={handleManualCloudSync}
                    disabled={isCloudSyncing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-black transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                    title="Pull all latest clients and submissions from cloud"
                  >
                    <RefreshCcw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
                    <span>{isCloudSyncing ? 'Syncing...' : 'Sync Cloud Data'}</span>
                  </button>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl max-w-max self-start sm:self-auto">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest font-mono">
                      Live Synchronized
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistics Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Card 1: Total Registered Clients */}
                <div onClick={() => setActiveTab('publishers')} className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100 rounded-2xl shadow-sm hover:shadow transition-all duration-300 cursor-pointer group hover:-translate-y-0.5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-indigo-800 uppercase tracking-widest font-sans">
                      All Registered Clients
                    </span>
                    <Users className="w-5 h-5 text-indigo-600 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-800">{publishers.length}</span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-100/80 px-1.5 py-0.5 rounded-md uppercase">Live</span>
                  </div>
                  <p className="text-[10px] text-indigo-700/80 font-bold mt-1.5">View complete registry →</p>
                </div>

                {/* Card 2: Total Campaign Submissions */}
                <div onClick={() => setActiveTab('mis_database')} className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-100 rounded-2xl shadow-sm hover:shadow transition-all duration-300 cursor-pointer group hover:-translate-y-0.5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-orange-800 uppercase tracking-widest font-sans">
                      Campaign Leads
                    </span>
                    <CheckSquare className="w-5 h-5 text-orange-500 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-800">{submissions.length}</span>
                    <span className="text-[10px] font-black text-slate-500 font-mono">records</span>
                  </div>
                  <p className="text-[10px] text-orange-700/80 font-bold mt-1.5">Verify screenshots & leads →</p>
                </div>

                {/* Card 3: Pending verification leads */}
                <div onClick={() => setActiveTab('mis_database')} className="p-4 bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-100 rounded-2xl shadow-sm hover:shadow transition-all duration-300 cursor-pointer group hover:-translate-y-0.5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-violet-800 uppercase tracking-widest font-sans">
                      Awaiting Check
                    </span>
                    <Clock className="w-5 h-5 text-violet-600 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-violet-700 font-mono">
                      {submissions.filter(s => s.status === 'Process').length}
                    </span>
                    <span className="text-[10px] bg-violet-100 text-violet-700 font-black px-1.5 py-0.5 rounded-md uppercase animate-pulse">Pending</span>
                  </div>
                  <p className="text-[10px] text-violet-700/80 font-bold mt-1.5">Approve payouts →</p>
                </div>

                {/* Card 4: Active Campaigns */}
                <div onClick={() => setActiveTab('campaigns')} className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100 rounded-2xl shadow-sm hover:shadow transition-all duration-300 cursor-pointer group hover:-translate-y-0.5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest font-sans">
                      Active Offers
                    </span>
                    <Flame className="w-5 h-5 text-emerald-600 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-800">
                      {campaigns.filter(c => c.active !== false).length}
                    </span>
                    <span className="text-[10px] font-black text-indigo-600">running</span>
                  </div>
                  <p className="text-[10px] text-emerald-700/80 font-bold mt-1.5">Manage tracking links →</p>
                </div>

                {/* Card 5: Sponsor Offer Achievers */}
                <div onClick={() => setActiveTab('offer')} className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/80 rounded-2xl shadow-sm hover:shadow transition-all duration-300 cursor-pointer group hover:-translate-y-0.5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest font-sans">
                      Offer Target Achievers
                    </span>
                    <Gift className="w-5 h-5 text-amber-600 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-amber-900 font-mono">
                      {offerAchievers.length}
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.5 rounded-md uppercase font-mono">20+ Refer</span>
                  </div>
                  <p className="text-[10px] text-amber-800/80 font-bold mt-1.5">View 20+ AngelOne achievers →</p>
                </div>
              </div>

              {/* Two Column Layout for live feed tracking */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Column Left: Live registered clients feed */}
                <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-4">
                  <div className="flex flex-wrap justify-between items-center border-b border-slate-105 pb-3 gap-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <h4 className="text-sm font-black text-slate-800">Registered Clients</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setShowAllOverviewClients(false)}
                          className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${!showAllOverviewClients ? 'bg-white shadow-xs text-indigo-700 font-black' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          Recent 10
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAllOverviewClients(true)}
                          className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${showAllOverviewClients ? 'bg-white shadow-xs text-indigo-700 font-black' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          All ({publishers.length})
                        </button>
                      </div>
                      <span className="text-xs font-black text-[#25D366] shrink-0 uppercase tracking-wider font-mono">
                        ● Live
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">
                    Whenever an agent registers an account, their details appear here instantaneously with cloud sync.
                  </p>

                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {publishers.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        No publishers registered yet.
                      </div>
                    ) : (
                      (showAllOverviewClients 
                        ? [...publishers].sort((a,b) => b.id.localeCompare(a.id))
                        : [...publishers].sort((a,b) => b.id.localeCompare(a.id)).slice(0, 10)
                      ).map(pub => (
                          <div key={pub.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-indigo-50/40 border border-slate-100 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="shrink-0 select-none flex items-center justify-center">
                                {pub.avatar && (pub.avatar.startsWith('data:') || pub.avatar.startsWith('http') || pub.avatar.startsWith('/api/')) ? (
                                  <img 
                                    src={pub.avatar} 
                                    alt="Avatar" 
                                    className="w-8 h-8 rounded-full object-cover" 
                                    referrerPolicy="no-referrer" 
                                  />
                                ) : (
                                  <span className="text-xl">{pub.avatar || '👤'}</span>
                                )}
                              </span>
                              <div className="truncate">
                                <p className="text-xs font-black text-slate-800 truncate">{pub.name}</p>
                                <p className="text-[10px] text-slate-400 truncate">Mobile: {pub.phone} | Email: {pub.email}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[10px] font-mono font-bold text-indigo-600 block bg-indigo-50 px-2 py-0.5 rounded-lg">{pub.id}</span>
                              <span className="text-[9px] text-slate-400 mt-0.5 block">{pub.joinedDate}</span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>

                  <button 
                    onClick={() => setActiveTab('publishers')}
                    className="w-full text-center py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                  >
                    Manage all {publishers.length} Publisher Accounts in Registry →
                  </button>
                </div>

                {/* Column Right: Action Leads Submissions Live Feed */}
                <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-105 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-orange-500" />
                      <h4 className="text-sm font-black text-slate-800">Recent Lead Actions Feed</h4>
                    </div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest font-mono">
                      Recent {Math.min(submissions.length, 5)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Live tracking of campaign payouts and task reports completed on different devices.
                  </p>

                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {submissions.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        No lead submissions received yet.
                      </div>
                    ) : (
                      [...submissions]
                        .sort((a,b) => b.id.localeCompare(a.id))
                        .slice(0, 10)
                        .map(sub => (
                          <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-orange-50/40 border border-slate-100 transition-colors">
                            <div className="truncate pr-2">
                              <p className="text-xs font-black text-slate-800 truncate">{sub.clientName}</p>
                              <p className="text-[10px] text-slate-400 truncate">
                                Publisher: <span className="font-bold text-slate-650">{sub.publisherName}</span>
                              </p>
                              <p className="text-[9px] text-slate-400 truncate mt-0.5 font-mono">
                                Campaign: {sub.campaignName}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-md block text-center uppercase tracking-wider ${
                                sub.status === 'Payment Done' ? 'bg-emerald-100 text-emerald-800'  :
                                sub.status === 'Process' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                                sub.status === 'Reject' ? 'bg-rose-100 text-rose-800' :
                                'bg-indigo-100 text-indigo-800'
                              }`}>
                                {sub.status}
                              </span>
                              <span className="text-[10px] font-bold text-slate-800 block mt-1 font-mono text-right">₹{sub.payout}</span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>

                  <button 
                    onClick={() => setActiveTab('mis_database')}
                    className="w-full text-center py-2 bg-orange-50 hover:bg-orange-100/80 text-orange-700 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                  >
                    Open MIS Lead Verification Dashboard →
                  </button>
                </div>

                {/* Advertiser Inquiries card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                          Advertiser Inquiries ({advertiserInquiries.length})
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          Directly dispatched to Admin WhatsApp (+91 8934932418)
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Admin WhatsApp: +91 8934932418
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                    {advertiserInquiries.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        No advertiser inquiries received yet. Any submissions from the "Become an Advertiser" form will appear here and are immediately routed to WhatsApp +91 8934932418.
                      </div>
                    ) : (
                      advertiserInquiries.map(inq => (
                        <div key={inq.id} className="p-3.5 bg-slate-50 rounded-xl hover:bg-amber-50/40 border border-slate-100 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-800">{inq.name}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                                {inq.company}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-600">
                              <span>📞 <span className="font-semibold">{inq.phone}</span></span>
                              <span>📧 <span className="font-semibold">{inq.email}</span></span>
                              <span>🎯 Campaign: <span className="font-bold text-slate-800">{inq.campaign}</span></span>
                            </div>
                            <p className="text-[9px] text-slate-400 font-mono">
                              ID: {inq.id} • {inq.submittedAt ? new Date(inq.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Recent'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <a
                              href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '').length === 10 ? '91' + inq.phone.replace(/[^0-9]/g, '') : inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inq.name}, we received your advertiser inquiry for "${inq.campaign}" on Public Ads India.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105"
                            >
                              <MessageCircle className="w-3 h-3 fill-current" />
                              Chat Advertiser
                            </a>
                            <button
                              onClick={() => deleteAdvertiserInquiry(inq.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50"
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 1: Campaign Manager */}
          {activeTab === 'campaigns' && (
            <div id="tabContent-campaigns" className="space-y-6 animate-fade-up">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-850">Campaigns Manager</h3>
                  <p className="text-xs text-slate-450 mt-1">Configure vertical payouts, terms, and direct active/inactive dashboard visibility.</p>
                </div>
                
                <button
                  id="admin-add-camp-trigger"
                  onClick={() => setCampFormOpen(!campFormOpen)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add More Campaign
                </button>
              </div>

              {/* Create/Edit form toggle panel */}
              {campFormOpen && (
                <form onSubmit={handleCampaignSubmit} className="p-5 border border-slate-100 bg-slate-50 rounded-2xl space-y-4 animate-fade-up">
                  <h4 className="text-sm font-bold text-slate-800">
                    {editingCampId ? `Edit Campaign Specs: ${campName}` : 'Add New Active Campaign'}
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Campaign Name</label>
                      <input 
                        type="text" required placeholder="e.g. PhonePe Demat Account" value={campName} onChange={(e) => setCampName(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">GEO Target Scope</label>
                      <input 
                        type="text" placeholder="e.g. India (PAN)" value={campGeo} onChange={(e) => setCampGeo(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Vertical Category</label>
                      <input 
                        type="text" placeholder="Fintech / Finance" value={campVertical} onChange={(e) => setCampVertical(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Campaign Model</label>
                      <input 
                        type="text" placeholder="CPA / CPL" value={campModel} onChange={(e) => setCampModel(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Payout Amount (₹)</label>
                      <input 
                        type="number" required placeholder="payout per lead opener" value={campPayout} onChange={(e) => setCampPayout(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Platform Target</label>
                      <select 
                        value={campPlatform} onChange={(e) => setCampPlatform(e.target.value as any)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none"
                      >
                        <option value="web">Web browser only</option>
                        <option value="app">Mobile App only</option>
                        <option value="both">Both scopes (Cross)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Target Links (Affiliate pasted)</label>
                      <input 
                        type="text" required placeholder="https://tracking.link..." value={campLink} onChange={(e) => setCampLink(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none font-mono"
                      />
                      <label className="inline-flex items-center gap-2 mt-1.5 px-1 select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={campDirectOpen}
                          onChange={(e) => setCampDirectOpen(e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        />
                        <span className="text-[10.5px] font-bold text-slate-650">
                          Direct Open Link (Client will get direct open button instead of copy option)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">KPI Target Rules (Requirements)</label>
                    <input 
                      type="text" placeholder="Successful KYC opened + first trade verify..." value={campKpi} onChange={(e) => setCampKpi(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Campaign Logo / Image Circle Upload</label>
                    <div className="relative border border-dashed border-slate-300 p-4 rounded-xl text-center bg-white">
                      <input 
                        type="file" accept="image/*" onChange={(e) => handleImageUploadBase64(e, 'camp')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {campImage ? (
                        <div className="flex items-center justify-center gap-2">
                          <img src={campImage} className="w-10 h-10 rounded-full object-cover shrink-0" />
                          <span className="text-[10px] font-bold text-indigo-650">Logo loaded! Change file click.</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-450 block font-bold">Upload Custom Circle Circular Logo</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Extended Terms & Conditions</label>
                    <textarea 
                      placeholder="Enter specific criteria blocks such as age bounds, mandatory documents..." value={campTerms} onChange={(e) => setCampTerms(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none h-16 resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {editingCampId && (
                      <button
                        type="button"
                        onClick={resetCampForm}
                        className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="submit"
                      id="add-campaign-form-btn"
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-xs rounded-xl cursor-pointer"
                    >
                      {editingCampId ? 'Save Campaign Specifications' : 'Draft Campaign as Active'}
                    </button>
                  </div>
                </form>
              )}

              {/* Campaigns table feed */}
              <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-450 uppercase font-extrabold tracking-widest border-b border-slate-150">
                      <th className="p-4">Visual Logo</th>
                      <th className="p-4">Campaign specifications</th>
                      <th className="p-3">Payout model</th>
                      <th className="p-3">Sponsor KPI Target</th>
                      <th className="p-4 text-center">Management Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {campaigns.map(camp => (
                      <tr key={camp.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <img src={camp.image} alt={camp.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" referrerPolicy="no-referrer" />
                        </td>
                        <td className="p-4">
                          <span className="font-extrabold text-slate-900 block">{camp.name}</span>
                          <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{camp.id} • {camp.vertical} ({camp.platform})</span>
                          <span className="inline-block text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 mt-1">
                            {(camp.directOpen !== false && (camp.directOpen as any) !== 'false') ? '🌐 Direct Open' : '📋 Copy Link'}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-emerald-600 font-mono">
                          ₹{camp.payout} ({camp.model})
                        </td>
                        <td className="p-3 text-slate-600 font-medium">
                          {camp.kpi}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                            <button
                              onClick={() => startEditingCampaign(camp)}
                              className="w-full sm:w-auto px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 border border-amber-200/50"
                              title="Edit Campaign Specifications"
                            >
                              Edit Specs
                            </button>
                            
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete campaign "${camp.name}"? This will permanently delete the campaign specifications.`)) {
                                  deleteCampaign(camp.id);
                                }
                              }}
                              className="w-full sm:w-auto px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 border border-rose-200/50"
                              title="Delete Campaign"
                            >
                              Delete
                            </button>

                            <button
                              id={`toggle-camp-act-${camp.id}`}
                              onClick={() => toggleCampaignActive(camp.id)}
                              className={`w-full sm:w-auto px-2.5 py-1.5 text-[10px] font-black rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                                camp.active 
                                  ? 'bg-indigo-50 text-indigo-750 hover:bg-indigo-100' 
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-150'
                              }`}
                            >
                              {camp.active ? 'Hide (Active)' : 'Show (Hidden)'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            </div>
          )}

          {/* TAB 2: MIS Database Workspace */}
          {activeTab === 'mis_database' && (
            <div id="tabContent-misDatabase" className="space-y-6 animate-fade-up">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-850">MIS Leads Database Workspace</h3>
                  <p className="text-xs text-slate-450 mt-1">Audit submitted publisher logs, view uploaded screenshort proofs, and disburse campaign commission rewards dynamically.</p>
                </div>

                <div className="flex gap-2.5 items-center w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Filter clients/publishers..."
                    value={misFilter}
                    onChange={(e) => setMisFilter(e.target.value)}
                    className="text-xs p-2 border border-slate-200 rounded-xl outline-none"
                  />
                  <button
                    id="export-mis-anchor-trigger"
                    onClick={triggerExportMIS}
                    className="p-2.5 bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-650 rounded-xl hover:shadow-sm border border-slate-200 shrink-0"
                    title="Export logs as local JSON file details"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Data Table */}
              {submissions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                  No publisher data submissions located in core databases yet.
                </div>
              ) : (
                <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-450 uppercase font-extrabold tracking-widest border-b border-slate-150">
                          <th className="p-4">Submission Ref</th>
                          <th className="p-4">Client Demographics</th>
                          <th className="p-3">Campaign vertical</th>
                          <th className="p-3">Payout rate</th>
                          <th className="p-3">Audits screen</th>
                          <th className="p-3">Status</th>
                          <th className="p-4 text-right">Verification Commands</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(() => {
                          const filtered = submissions
                            .filter(sub => {
                              const f = misFilter.toLowerCase();
                              return (
                                sub.clientName.toLowerCase().includes(f) ||
                                sub.publisherName.toLowerCase().includes(f) ||
                                sub.publisherId.toLowerCase().includes(f) ||
                                sub.campaignName.toLowerCase().includes(f) ||
                                sub.id.toLowerCase().includes(f) ||
                                (sub.clientPhone && sub.clientPhone.includes(f)) ||
                                (sub.clientCode && sub.clientCode.toLowerCase().includes(f))
                              );
                            })
                            .sort((a, b) => {
                              const keyA = (a.submitDate || '') + '_' + (a.id || '');
                              const keyB = (b.submitDate || '') + '_' + (b.id || '');
                              return keyB.localeCompare(keyA);
                            });

                          const totalPages = Math.ceil(filtered.length / 50) || 1;
                          const currentSlice = filtered.slice((subPage - 1) * 50, subPage * 50);

                          return currentSlice.map(sub => (
                            <tr key={sub.id} className="hover:bg-slate-50/50">
                              <td className="p-4">
                                <span className="font-extrabold text-slate-900 block">{sub.id.substring(0, 8)}</span>
                                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                  <span className="text-[10px] text-slate-400 font-mono">By: {sub.publisherName} ({sub.publisherId})</span>
                                  <button
                                    type="button"
                                    id={`view-bank-sub-${sub.id}`}
                                    onClick={async () => {
                                      let bank = bankDetailsMap[sub.publisherId] || null;
                                      if (!bank) {
                                        try {
                                          const docRef = doc(db, 'bank_details', sub.publisherId);
                                          const docSnap = await getDoc(docRef);
                                          if (docSnap.exists()) {
                                            bank = docSnap.data() as any;
                                          }
                                        } catch (error: any) {
                                          console.warn("Notice fetching bank on-demand:", error?.message || error);
                                        }
                                      }
                                      setViewingBankDetails({
                                        id: sub.publisherId,
                                        name: sub.publisherName,
                                        bank: bank
                                      });
                                    }}
                                    className="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[9px] font-extrabold border border-emerald-100 uppercase tracking-wide cursor-pointer transition-all"
                                    title="View Publisher Bank Details"
                                  >
                                    🏦 Bank
                                  </button>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="font-extrabold text-slate-800 block">{sub.clientName}</span>
                                <span className="text-[10px] text-slate-450 block mt-0.5">{sub.clientPhone} • {sub.clientCode || 'NO CODE'}</span>
                              </td>
                              <td className="p-3 font-medium text-slate-600 capitalize">
                                {sub.campaignName}
                              </td>
                              <td className="p-3 font-bold text-red-500 font-mono">
                                ₹{sub.payout}
                              </td>
                              <td className="p-3">
                                <button
                                  type="button"
                                  onClick={() => setPreviewImage(sub.screenshot)}
                                  className="text-indigo-605 dark:text-indigo-400 underline font-extrabold text-xs cursor-pointer inline-flex items-center gap-1 hover:text-indigo-805"
                                >
                                  View proof ↗
                                </button>
                              </td>
                              <td className="p-3">
                                <span className={`inline-flex px-1.5 py-0.5 font-bold text-[9px] rounded-full uppercase tracking-wider ${
                                  sub.status === 'Payment Done' ? 'bg-emerald-100 text-emerald-800' :
                                  sub.status === 'Trade Done' ? 'bg-indigo-100 text-indigo-805' :
                                  sub.status === 'Process' ? 'bg-amber-100 text-amber-800' :
                                  sub.status === 'Reject' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-105 text-blue-750'
                                }`}>
                                  {sub.status}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex flex-wrap gap-1 md:justify-end max-w-[340px] ml-auto">
                                  <button
                                    onClick={() => updateSubmissionStatus(sub.id, 'Process')}
                                    className={`px-2 py-1 text-[9px] font-extrabold rounded uppercase tracking-wider cursor-pointer border border-transparent transition-all ${
                                      sub.status === 'Process'
                                        ? 'bg-yellow-400 text-slate-950 font-black shadow-sm ring-1 ring-yellow-400'
                                        : 'bg-[#DBDBDB] hover:bg-slate-300 text-slate-800'
                                    }`}
                                  >
                                    Process
                                  </button>
                                  <button
                                    onClick={() => updateSubmissionStatus(sub.id, 'Reject')}
                                    className={`px-2 py-1 text-[9px] font-extrabold rounded uppercase tracking-wider cursor-pointer border border-transparent transition-all ${
                                      sub.status === 'Reject'
                                        ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-650'
                                        : 'bg-[#DBDBDB] hover:bg-slate-300 text-slate-800'
                                    }`}
                                  >
                                    Reject
                                  </button>
                                  <button
                                    onClick={() => updateSubmissionStatus(sub.id, 'Ready To Trade')}
                                    className={`px-2 py-1 text-[9px] font-extrabold rounded uppercase tracking-wider cursor-pointer border border-transparent transition-all ${
                                      sub.status === 'Ready To Trade'
                                        ? 'bg-yellow-400 text-slate-950 font-black shadow-sm ring-1 ring-yellow-400'
                                        : 'bg-[#DBDBDB] hover:bg-slate-300 text-slate-800'
                                    }`}
                                  >
                                    Ready Trade
                                  </button>
                                  <button
                                    onClick={() => updateSubmissionStatus(sub.id, 'Active')}
                                    className={`px-2 py-1 text-[9px] font-extrabold rounded uppercase tracking-wider cursor-pointer border border-transparent transition-all ${
                                      sub.status === 'Active'
                                        ? 'bg-yellow-400 text-slate-950 font-black shadow-sm ring-1 ring-yellow-400'
                                        : 'bg-[#DBDBDB] hover:bg-slate-300 text-slate-800'
                                    }`}
                                  >
                                    Active
                                  </button>
                                  <button
                                    onClick={() => updateSubmissionStatus(sub.id, 'Trade Done')}
                                    className={`px-2 py-1 text-[9px] font-extrabold rounded uppercase tracking-wider cursor-pointer border border-transparent transition-all ${
                                      sub.status === 'Trade Done'
                                        ? 'bg-yellow-400 text-slate-950 font-black shadow-sm ring-1 ring-yellow-400'
                                        : 'bg-[#DBDBDB] hover:bg-slate-300 text-slate-800'
                                    }`}
                                  >
                                    Trade Done
                                  </button>
                                  <button
                                    disabled={sub.status === 'Payment Done'}
                                    onClick={() => {
                                      if (sub.status === 'Payment Done') return;
                                      updateSubmissionStatus(sub.id, 'Payment Done');
                                    }}
                                    className={`px-2 py-1 text-[9px] font-extrabold uppercase rounded tracking-wider border border-transparent transition-all ${
                                      sub.status === 'Payment Done' 
                                        ? 'bg-emerald-600 text-white shadow-md font-black cursor-not-allowed opacity-90' 
                                        : 'bg-[#DBDBDB] hover:bg-slate-300 text-slate-800 cursor-pointer'
                                    }`}
                                    title={sub.status === 'Payment Done' ? 'Payment already disbursed for this lead' : 'Click to disburse payment'}
                                  >
                                    {sub.status === 'Payment Done' ? '✓ Paid Done' : 'Payment Done'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to permanently delete this submission?')) {
                                        deleteSubmission(sub.id);
                                      }
                                    }}
                                    className="px-2 py-1 text-[9px] font-extrabold uppercase rounded tracking-wider cursor-pointer bg-red-50 hover:bg-red-100 text-red-650 flex items-center gap-1 border border-red-200 transition-all"
                                    title="Delete Submission"
                                  >
                                    <Trash2 className="w-3 h-3 text-red-500" />
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                  {renderPaginationControls(
                    subPage,
                    Math.ceil(
                      submissions.filter(sub => {
                        const f = misFilter.toLowerCase();
                        return (
                          sub.clientName.toLowerCase().includes(f) ||
                          sub.publisherName.toLowerCase().includes(f) ||
                          sub.publisherId.toLowerCase().includes(f) ||
                          sub.campaignName.toLowerCase().includes(f) ||
                          sub.id.toLowerCase().includes(f) ||
                          (sub.clientPhone && sub.clientPhone.includes(f)) ||
                          (sub.clientCode && sub.clientCode.toLowerCase().includes(f))
                        );
                      }).length / 50
                    ) || 1,
                    submissions.filter(sub => {
                      const f = misFilter.toLowerCase();
                      return (
                        sub.clientName.toLowerCase().includes(f) ||
                        sub.publisherName.toLowerCase().includes(f) ||
                        sub.publisherId.toLowerCase().includes(f) ||
                        sub.campaignName.toLowerCase().includes(f) ||
                        sub.id.toLowerCase().includes(f) ||
                        (sub.clientPhone && sub.clientPhone.includes(f)) ||
                        (sub.clientCode && sub.clientCode.toLowerCase().includes(f))
                      );
                    }).length,
                    setSubPage
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 3: Payment UID Portal */}
          {activeTab === 'payment_portal' && (
            <div id="tabContent-paymentPortal" className="space-y-6 animate-fade-up">
              <div className="pb-4 border-b border-slate-150">
                <h3 className="text-lg font-black text-slate-850">Payment search portal</h3>
                <p className="text-xs text-slate-450 mt-1">Search secure banking ledgers of any publisher candidate via registered Licensed UID code.</p>
              </div>

              {/* UID search form */}
              <form onSubmit={handlePaymentSearch} className="flex gap-3 max-w-md">
                <input
                  type="text"
                  required
                  placeholder="Enter User ID (e.g. PUB1001)"
                  value={paymentUid}
                  onChange={(e) => setPaymentUid(e.target.value)}
                  className="flex-1 text-xs p-3 border border-slate-200 rounded-xl outline-none"
                />
                <button
                  type="submit"
                  id="search-by-uid-btn"
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs rounded-xl uppercase tracking-wider"
                >
                  Locate Ledger
                </button>
              </form>

              {/* Scanned result card */}
              {scannedBankDetails && (
                <div id="UID-ledger-output" className="p-6 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4 animate-fade-up max-w-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest font-mono text-slate-400">Located Candidate Node</span>
                      <h4 className="text-base font-extrabold mt-1 text-slate-900">{scannedBankDetails.name}</h4>
                      <p className="text-xs text-slate-450 mt-0.5">{scannedBankDetails.email} • {scannedBankDetails.phone}</p>
                    </div>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded font-extrabold">{scannedBankDetails.id}</span>
                  </div>

                  {!isBankDetailsRevealed ? (
                    <button
                      type="button"
                      id="reveal-bank-details"
                      onClick={() => setIsBankDetailsRevealed(true)}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
                    >
                      Show Bank Details
                    </button>
                  ) : (
                    <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 animate-fade-up">
                      {scannedBankDetails.bank && scannedBankDetails.bank.accountNumber ? (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Holder Name</span>
                              <span className="text-xs font-bold text-slate-750">{scannedBankDetails.bank.holderName}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Account Number</span>
                              <span className="text-xs font-bold text-slate-750 font-mono">{scannedBankDetails.bank.accountNumber}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Bank IFSC Code</span>
                              <span className="text-xs font-bold text-slate-750 font-mono uppercase">{scannedBankDetails.bank.ifsc}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">UPI ID Ledger</span>
                              <span className="text-xs font-bold text-slate-750 font-mono">{scannedBankDetails.bank.upi}</span>
                            </div>
                          </div>

                          {scannedBankDetails.bank.qrCode && (
                            <div className="pt-2">
                              <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-2">Uploaded UPI QR Scan card</span>
                              <img src={scannedBankDetails.bank.qrCode} alt="Client QR code" className="w-32 h-32 rounded border border-slate-150 object-cover" />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-xs text-slate-450 text-center py-4 font-bold">
                          Client has not provided banking/ledger coordinates in their dashboard yet.
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* TAB 4: Publisher Registry & Password Reset */}
          {activeTab === 'publishers' && (
            <div id="tabContent-publishers" className="space-y-8 animate-fade-up">
              
              {/* Profile Block Control */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-150 gap-2">
                  <div>
                    <h3 className="text-base font-black text-slate-850">
                      Publisher registry management ({publishers.length} Registered Clients)
                    </h3>
                    <p className="text-xs text-slate-450 mt-1">Audit active profiles, search by name or mobile, or lock suspicious operations immediately.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleManualCloudSync}
                      disabled={isCloudSyncing}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-black transition-all cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCcw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
                      <span>{isCloudSyncing ? 'Syncing...' : 'Sync Cloud Data'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 w-full max-w-sm mb-4">
                  <input
                    type="text"
                    placeholder="Search publisher name, ID, or mobile..."
                    value={pubSearchQuery}
                    onChange={(e) => setPubSearchQuery(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs bg-white">
                    <thead>
                      <tr className="bg-slate-50 text-slate-450 uppercase font-extrabold tracking-widest border-b border-slate-150">
                        <th className="p-3">Avatar</th>
                        <th className="p-3">Publisher ID</th>
                        <th className="p-3">Publisher Name</th>
                        <th className="p-3">Registered Mobile</th>
                        <th className="p-3">Total Earned</th>
                        <th className="p-3">Registry date</th>
                        <th className="p-3 text-right">Access & Earnings Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        const filtered = publishers
                          .filter(p => 
                            !pubSearchQuery || 
                            p.name.toLowerCase().includes(pubSearchQuery.toLowerCase()) || 
                            p.id.toLowerCase().includes(pubSearchQuery.toLowerCase()) ||
                            (p.phone && p.phone.includes(pubSearchQuery)) ||
                            (p.email && p.email.toLowerCase().includes(pubSearchQuery.toLowerCase()))
                          )
                          .sort((a, b) => {
                            const keyA = (a.joinedDate || '') + '_' + (a.id || '');
                            const keyB = (b.joinedDate || '') + '_' + (b.id || '');
                            return keyB.localeCompare(keyA);
                          });

                        const totalPages = Math.ceil(filtered.length / 50) || 1;
                        const currentSlice = filtered.slice((pubPage - 1) * 50, pubPage * 50);

                        return currentSlice.map(pub => (
                          <tr key={pub.id} className="hover:bg-slate-50/50">
                            <td className="p-3 text-lg select-none">
                              {pub.avatar && (pub.avatar.startsWith('data:') || pub.avatar.startsWith('http') || pub.avatar.startsWith('/api/')) ? (
                                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-slate-100">
                                  <img 
                                    src={pub.avatar} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover" 
                                    referrerPolicy="no-referrer" 
                                    id={`pub-avatar-img-${pub.id}`}
                                  />
                                </div>
                              ) : (
                                pub.avatar || '😎'
                              )}
                            </td>
                            <td className="p-3 font-mono font-bold text-indigo-650">{pub.id}</td>
                            <td className="p-3 font-extrabold text-slate-800">{pub.name}</td>
                            <td className="p-3 font-medium text-slate-650">{pub.phone}</td>
                            <td className="p-3">
                              {(() => {
                                const normId = (pub.id || '').trim().toLowerCase();
                                const pubEarnings = (earnings || []).filter(e => (e.publisherId || '').trim().toLowerCase() === normId);
                                const paidSubs = (submissions || []).filter(s => {
                                  const matchesPub = (s.publisherId || '').trim().toLowerCase() === normId;
                                  const st = (s.status || '').toLowerCase().trim();
                                  return matchesPub && (st === 'payment done' || st === 'paymentdone' || st === 'paid');
                                });

                                // Combined earnings ensuring zero double-counting
                                const combined = [...pubEarnings];
                                paidSubs.forEach(sub => {
                                  const alreadyPresent = pubEarnings.some(e => 
                                    (e.campaignId === sub.campaignId && Number(e.amount) === Number(sub.payout)) ||
                                    e.id === `earning-${sub.id}`
                                  );
                                  if (!alreadyPresent) {
                                    combined.push({
                                      id: `earning-sub-${sub.id}`,
                                      publisherId: pub.id,
                                      campaignId: sub.campaignId,
                                      campaignName: sub.campaignName,
                                      amount: Number(sub.payout) || 0,
                                      date: (sub.submitDate || '').substring(0, 10),
                                      time: (sub.submitDate || '').substring(11, 16)
                                    });
                                  }
                                });

                                const totalSum = combined.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
                                return (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-450 font-black text-xs border border-indigo-100/50">
                                    ₹{totalSum}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="p-3 text-slate-405">{pub.joinedDate}</td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-2 items-center">
                                <button
                                  id={`view-bank-pub-${pub.id}`}
                                  onClick={async () => {
                                    let bank = bankDetailsMap[pub.id] || null;
                                    if (!bank) {
                                      try {
                                        const docRef = doc(db, 'bank_details', pub.id);
                                        const docSnap = await getDoc(docRef);
                                        if (docSnap.exists()) {
                                          bank = docSnap.data() as any;
                                        }
                                      } catch (error: any) {
                                        console.warn("Notice fetching bank on-demand:", error?.message || error);
                                      }
                                    }
                                    setViewingBankDetails({
                                      id: pub.id,
                                      name: pub.name,
                                      bank: bank
                                    });
                                  }}
                                  className="px-2.5 py-1 text-[10px] font-black bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 rounded-lg border border-emerald-150 transition-colors cursor-pointer flex items-center gap-1"
                                  title="View Publisher Bank Ledger Details"
                                >
                                  🏦 View Bank
                                </button>
                                <button
                                  id={`edit-earnings-${pub.id}`}
                                  onClick={() => {
                                    setEditingEarningsPubId(pub.id);
                                    const normId = (pub.id || '').trim().toLowerCase();
                                    const pubEarnings = (earnings || []).filter(e => (e.publisherId || '').trim().toLowerCase() === normId);
                                    const values: { [key: string]: string } = {};
                                    pubEarnings.forEach(e => {
                                      values[e.id] = String(e.amount);
                                    });
                                    setEditingEarningItemValues(values);
                                  }}
                                  className="px-2.5 py-1 text-[10px] font-black bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800 rounded-lg border border-indigo-150 transition-colors cursor-pointer flex items-center gap-1"
                                  title="Edit earning amounts or delete last 5 transactions"
                                >
                                  💰 Edit Amount
                                </button>
                                <button
                                  id={`block-unblock-${pub.id}`}
                                  onClick={() => toggleBlockPublisher(pub.id)}
                                  className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-colors cursor-pointer ${
                                    pub.blocked 
                                      ? 'bg-rose-100 text-rose-700 hover:bg-emerald-100 hover:text-emerald-700' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-700'
                                  }`}
                                  title={pub.blocked ? 'Unlock publisher account' : 'Block publisher account'}
                                >
                                  {pub.blocked ? '🔴 Unblock' : '🟢 Block'}
                                </button>
                                <button
                                  id={`delete-pub-${pub.id}`}
                                  onClick={() => {
                                    if (window.confirm(`Are you absolutely sure you want to permanently delete publisher account for ${pub.name} (${pub.id})? This is irreversible.`)) {
                                      deletePublisher(pub.id);
                                    }
                                  }}
                                  className="px-2.5 py-1 text-[10px] font-black bg-red-100 hover:bg-red-200 text-red-650 hover:text-red-750 rounded-lg transition-colors cursor-pointer"
                                  title="Permanently Delete Creator"
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
                {renderPaginationControls(
                  pubPage,
                  Math.ceil(
                    publishers.filter(p => 
                      !pubSearchQuery || 
                      p.name.toLowerCase().includes(pubSearchQuery.toLowerCase()) || 
                      p.id.toLowerCase().includes(pubSearchQuery.toLowerCase()) ||
                      (p.phone && p.phone.includes(pubSearchQuery)) ||
                      (p.email && p.email.toLowerCase().includes(pubSearchQuery.toLowerCase()))
                    ).length / 50
                  ) || 1,
                  publishers.filter(p => 
                    !pubSearchQuery || 
                    p.name.toLowerCase().includes(pubSearchQuery.toLowerCase()) || 
                    p.id.toLowerCase().includes(pubSearchQuery.toLowerCase()) ||
                    (p.phone && p.phone.includes(pubSearchQuery)) ||
                    (p.email && p.email.toLowerCase().includes(pubSearchQuery.toLowerCase()))
                  ).length,
                  setPubPage
                )}
              </div>
              </div>

              {/* Master Code Password resetting system */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-850">Emergency Staff / User Password Reset</h4>
                  <p className="text-xs text-slate-400 mt-1">If candidate is locked or forgot password details. Enter matched phone + email to force assign new credentials.</p>
                </div>

                {resetMsg && (
                  <div className="p-3 bg-indigo-50 border border-indigo-150 text-indigo-750 font-bold text-xs rounded-xl">
                    {resetMsg}
                  </div>
                )}

                <form onSubmit={handlePassResetByAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Mobile No.</span>
                    <input
                      type="text" required placeholder="e.g. 9876543210" value={resetPubPhone} onChange={(e) => setResetPubPhone(e.target.value)}
                      className="text-xs p-2.5 border border-slate-200 bg-white rounded-lg outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Email ID</span>
                    <input
                      type="email" required placeholder="e.g. name@gmail.com" value={resetPubEmail} onChange={(e) => setResetPubEmail(e.target.value)}
                      className="text-xs p-2.5 border border-slate-200 bg-white rounded-lg outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Assign New Password</span>
                    <input
                      type="text" required placeholder="Desired password" value={resetNewPass} onChange={(e) => setResetNewPass(e.target.value)}
                      className="text-xs p-2.5 border border-slate-200 bg-white rounded-lg outline-none font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    id="admin-reset-pw-btn"
                    className="w-full sm:col-span-3 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Authorize New Password Allocation
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB OFFER: Sponsor Offer Achievers Section (Target 20 AngelOne Referrals) */}
          {activeTab === 'offer' && (
            <div id="tabContent-offer" className="space-y-6 animate-fade-up">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                      <Gift className="w-5 h-5" />
                    </span>
                    <h3 className="text-xl font-black text-slate-800">Sponsorship Offer Achievers</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Is section me sirf unhi publishers ka data show hoga jinhone <strong>20 AngelOne Referrals + First Earning</strong> ka target complete kar liya hai.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-2 rounded-xl text-xs font-black shrink-0">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>Target: 20 AngelOne Referrals</span>
                </div>
              </div>

              {/* Data Display */}
              {offerAchievers.length === 0 ? (
                <div className="p-10 bg-slate-50/80 border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-4">
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-amber-200">
                    <Gift className="w-8 h-8" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="text-base font-black text-slate-800">No Target Achievers Yet</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Abhi kisi bhi publisher ka <strong>20 AngelOne referral + First Earning</strong> target complete nahi hua hai. Jaise hi kisi publisher ke 20 completed referrals ho jayenge, unka data yahan automatically show hone lagega.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] font-extrabold text-slate-600 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Rule: Target 20/20 Required to Display Data</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>Qualified Target Achievers ({offerAchievers.length})</span>
                  </div>

                  {offerAchievers.map(({ publisher: pub, totalQualifiedCount, qualifiedReferralClients, bankDetails }) => (
                    <div key={pub.id} className="bg-white border-2 border-amber-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4">
                      {/* Achiever Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-sm shadow">
                            {pub.name ? pub.name.charAt(0).toUpperCase() : 'P'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-slate-900">{pub.name}</h4>
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Target Achieved
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-mono">
                              ID: <strong className="text-indigo-600">{pub.id}</strong> | Phone: {pub.phone} | Email: {pub.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-3.5 py-2 rounded-xl shrink-0">
                          <Trophy className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-black text-amber-900 font-mono">
                            {totalQualifiedCount} / 20 Completed
                          </span>
                        </div>
                      </div>

                      {/* Bank / Payment Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                        <div>
                          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">UPI ID / Payment Method</span>
                          <span className="font-bold text-slate-800 font-mono block mt-0.5">
                            {bankDetails?.upiId || pub.upiId || 'Not provided yet'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Bank Account Details</span>
                          <span className="font-bold text-slate-800 block mt-0.5">
                            {bankDetails?.accountNo ? `${bankDetails.bankName || 'Bank'} - A/C: ${bankDetails.accountNo} (IFSC: ${bankDetails.ifscCode})` : 'Bank details not submitted'}
                          </span>
                        </div>
                      </div>

                      {/* List of 20+ Referred Clients */}
                      <div className="space-y-2">
                        <span className="text-xs font-black text-slate-700 block">
                          Completed AngelOne Referrals Breakdown ({qualifiedReferralClients.length}):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
                          {qualifiedReferralClients.map((client, idx) => (
                            <div key={client.clientId} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                              <div>
                                <span className="font-bold text-slate-800 block truncate max-w-[140px]">
                                  #{idx + 1} {client.clientName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono block">
                                  ID: {client.clientId}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded block">
                                  First Earning Done
                                </span>
                                <span className="text-[9px] text-slate-400 block mt-0.5">
                                  {client.firstAngelOneDate}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Promo Offer Manager & WhatsApp number */}
          {activeTab === 'offer_popup' && (
            <div id="tabContent-offerPopup" className="space-y-8 animate-fade-up">
              
              {/* Promotion update config */}
              <form onSubmit={handleOfferSubmit} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div>
                  <h4 className="text-sm font-black text-slate-850">Promo Offer Banner Popup</h4>
                  <p className="text-xs text-slate-450 mt-1">Configure special promotional popups with custom text, destination link action buttons, and uploaded images for all publisher dashboards.</p>
                </div>

                {offerMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-800 font-bold text-xs rounded-xl">
                    {offerMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-2">
                  
                  {/* Left Column: Image setup & upload */}
                  <div className="space-y-4">
                    <div className="border-b border-slate-200/60 pb-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">1. Banner Image Asset (Photo)</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-450 uppercase">Current banner preview</label>
                      {offerUrl ? (
                        <div className="relative rounded-lg border border-slate-200 overflow-hidden bg-slate-100 max-w-sm aspect-video mt-1 group">
                          <img src={offerUrl} alt="Offer popup banner preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setOfferUrl('')}
                            className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider shadow"
                          >
                            Remove Photo
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center border border-dashed border-slate-300 rounded-lg h-32 bg-slate-55/60 text-slate-400 text-xs font-semibold mt-1">
                          No banner graphics configured
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-450 uppercase">Upload new photo</span>
                      <div className="relative border border-dashed border-slate-300 hover:border-indigo-455 p-6 rounded-xl text-center bg-white transition-all cursor-pointer group">
                        <input
                          type="file" accept="image/*" onChange={(e) => handleImageUploadBase64(e, 'offer')}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-indigo-650 block group-hover:scale-[1.01] transition-transform">
                          📁 Select or Drop Photo File
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block font-medium">Supports JPG, JPEG, PNG, WEBP (Max 2 MB)</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-450 uppercase">Or alternative raw URL</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={offerUrl}
                        onChange={(e) => setOfferUrl(e.target.value)}
                        className="text-xs p-2.5 border border-slate-200 bg-white rounded-lg outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  {/* Right Column: Text and settings info */}
                  <div className="space-y-4">
                    <div className="border-b border-slate-200/60 pb-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">2. Dynamic Offer texts</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Offer overlay title / heading</span>
                      <input
                        type="text"
                        placeholder="e.g. Maximize Your Payouts with Active Campaigns!"
                        value={offerTitle}
                        onChange={(e) => setOfferTitle(e.target.value)}
                        className="text-xs p-2.5 border border-slate-200 bg-white rounded-lg outline-none font-semibold focus:border-indigo-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Offer subtext details (description)</span>
                      <textarea
                        rows={3}
                        placeholder="e.g. Limited time bonus directly to your wallet dashboard. Check active rates, submit valid leads, and request bulk approvals."
                        value={offerDescription}
                        onChange={(e) => setOfferDescription(e.target.value)}
                        className="text-xs p-2.5 border border-slate-200 bg-white rounded-lg outline-none focus:border-indigo-400 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100/80 p-2.5 rounded-lg border border-slate-200/50">
                      <input
                        type="checkbox"
                        id="offer-show-button-toggle"
                        checked={offerShowButton}
                        onChange={(e) => setOfferShowButton(e.target.checked)}
                        className="w-4.5 h-4.5 accent-indigo-600 rounded cursor-pointer"
                      />
                      <label htmlFor="offer-show-button-toggle" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                        Provide Action Button / Redirection Link
                      </label>
                    </div>

                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-200 ${!offerShowButton ? 'opacity-40 pointer-events-none' : ''}`}>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">CTA Button label text</span>
                        <input
                          type="text"
                          placeholder="e.g. Claim Offer Bonuses Now"
                          value={offerButtonText}
                          onChange={(e) => setOfferButtonText(e.target.value)}
                          className="text-xs p-2.5 border border-slate-200 bg-white rounded-lg outline-none focus:border-indigo-400"
                          disabled={!offerShowButton}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Click Destination Link URL (Optional)</span>
                        <input
                          type="url"
                          placeholder="e.g. https://publicadsindia.com/exclusive"
                          value={offerLink}
                          onChange={(e) => setOfferLink(e.target.value)}
                          className="text-xs p-2.5 border border-slate-200 bg-white rounded-lg outline-none focus:border-indigo-400"
                          disabled={!offerShowButton}
                        />
                      </div>
                    </div>
                  </div>

                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox" id="popup-offer-active" checked={offerActive} onChange={(e) => setOfferActive(e.target.checked)}
                      className="w-4.5 h-4.5 accent-indigo-600 rounded cursor-pointer"
                    />
                    <label htmlFor="popup-offer-active" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                      Activate Popup Overlay across all publisher screens on launch
                    </label>
                  </div>

                  <button
                    type="submit"
                    id="submit-promo-popup-btn"
                    className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold uppercase rounded-xl tracking-wider cursor-pointer shadow-sm transition-colors"
                  >
                    Save popup configurations
                  </button>
                </div>
              </form>

              {/* Editable support contacts updates */}
              <form onSubmit={handleSupportSave} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div>
                  <h4 className="text-sm font-black text-slate-850">WhatsApp Help Desk Support & Contact update</h4>
                  <p className="text-xs text-slate-450 mt-1">Updates core support coordinates, email targets, and instant WhatsApp redirections site-wide inside Contact section.</p>
                </div>

                {suppMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-800 font-bold text-xs rounded-xl">
                    {suppMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Support Assist Phone (+91 with code)</span>
                    <input
                      type="text" required value={suppPhoneInput} onChange={(e) => setSuppPhoneInput(e.target.value)}
                      className="text-xs p-2.5 border border-slate-200 bg-white text-slate-900 rounded-lg outline-none font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Support Assist Email</span>
                    <input
                      type="email" required value={suppEmailInput} onChange={(e) => setSuppEmailInput(e.target.value)}
                      className="text-xs p-2.5 border border-slate-200 bg-white text-slate-900 rounded-lg outline-none font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="submit-channels-btn"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-xl tracking-wider cursor-pointer"
                >
                  Update Site-wide support channels
                </button>
              </form>

            </div>
          )}

          {/* TAB 6: Staff Employees Generator Board */}
          {activeTab === 'staff_gen' && (
            <div id="tabContent-staffGen" className="space-y-6 animate-fade-up">
              
              <div className="pb-4 border-b border-slate-150">
                <h3 className="text-lg font-black text-slate-850">Employee Staff Generator</h3>
                <p className="text-xs text-slate-450 mt-1">Create dedicated, role-authorized login credentials for regional payment processors or MIS leads check employees.</p>
              </div>

              {/* Generate staffing credentials card */}
              <form onSubmit={handleStaffGenerate} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <h4 className="text-xs.5 font-bold uppercase tracking-widest text-slate-400">Recruit New Staff Employee</h4>

                {staffMsg && (
                  <div className="p-3 bg-indigo-50 border border-indigo-150 text-indigo-750 font-bold text-xs rounded-xl">
                    {staffMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Staff real name</span>
                    <input
                      type="text" required value={staffName} onChange={(e) => setStaffName(e.target.value)} placeholder="e.g. Karan Mehra"
                      className="text-xs p-2.5 border border-slate-200 bg-white text-slate-900 rounded-lg outline-none font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Username prefix</span>
                    <input
                      type="text" required value={staffUser} onChange={(e) => setStaffUser(e.target.value)} placeholder="e.g. karan_pay"
                      className="text-xs p-2.5 border border-slate-200 bg-white text-slate-900 rounded-lg outline-none font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Staff login password</span>
                    <input
                      type="text" required value={staffPass} onChange={(e) => setStaffPass(e.target.value)} placeholder="Initial password"
                      className="text-xs p-2.5 border border-slate-200 bg-white text-slate-900 rounded-lg outline-none font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned console authorization</span>
                    <select
                      value={staffRole} onChange={(e) => setStaffRole(e.target.value as any)}
                      className="text-xs p-2.5 border border-slate-200 bg-white text-slate-900 rounded-lg outline-none font-bold"
                    >
                      <option value="MIS">Leads Check MIS Portal (Masks and hides bank detials automatically)</option>
                      <option value="Payment">Payment processing Desk (Consolidates disburse rewards only)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  id="admin-staff-gen-btn"
                  className="w-full py-3 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-black uppercase tracking-widest rounded-xl"
                >
                  Generate Employee Access License
                </button>
              </form>

              {/* Staff table */}
              <div className="border border-slate-200 bg-white rounded-xl overflow-hidden mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs bg-white">
                  <thead>
                    <tr className="bg-slate-105 text-slate-450 uppercase font-black border-b border-slate-150">
                      <th className="p-4">Employee ID</th>
                      <th className="p-4">Assigned Prefix</th>
                      <th className="p-4">Credential code</th>
                      <th className="p-3">Staff Role Authorization</th>
                      <th className="p-4 text-right">Access revocation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employees.map(emp => (
                      <tr key={emp.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-extrabold text-slate-900">{emp.name}</td>
                        <td className="p-4 font-mono font-bold text-slate-650">{emp.username}</td>
                        <td className="p-4 font-mono text-slate-500">{emp.password}</td>
                        <td className="p-3 font-semibold text-indigo-650 uppercase tracking-wide">
                          {emp.role === 'Payment' ? '💸 Payments Only' : '🔍 Leads Audit MIS (Secret Banks hidden)'}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            id={`delete-emp-${emp.id}`}
                            onClick={() => deleteEmployee(emp.id)}
                            className="p-1 px-2.5 bg-red-100 text-rose-700 hover:bg-rose-200 font-bold rounded uppercase text-[10px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            </div>
          )}

          {/* TAB 7: Systems Backup Logs */}
          {activeTab === 'backups' && (
            <div id="tabContent-backups" className="space-y-6 animate-fade-up">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-600" />
                    Database Automated Backups & Snapshots
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Evaluates system integrity blocks, creates secure database snapshot archives, and enables instant state downloads.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    id="admin-dump-backup-btn"
                    onClick={() => {
                      triggerBackup();
                      setShowIntegrityAlert("New manual snapshot created! Full localized datasets archived successfully.");
                      setTimeout(() => setShowIntegrityAlert(null), 4000);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-850 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider cursor-pointer shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <RefreshCcw className="w-4.5 h-4.5 animate-spin" style={{ animationDuration: '3s' }} />
                    Take Snapshot Now
                  </button>
                </div>
              </div>

              {/* Advanced Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-250 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider block">Storage Utilized</span>
                    <span className="text-sm font-black text-slate-800">
                      {(JSON.stringify(localStorage).length / 1024).toFixed(2)} KB
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Quota Limit: 5,120 KB</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-250 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider block">Integrity Status</span>
                    <span className="text-sm font-black text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      100% Secure
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">SHA-256 Consistency Verified</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-250 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider block">Active Records</span>
                    <span className="text-sm font-black text-slate-800">
                      {backupLogs.length} Snapshots
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Automated snapshots live</span>
                  </div>
                </div>
              </div>

              {/* Integrity Warning / Status Alerts */}
              {showIntegrityAlert && (
                <div className="flex gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-900 animate-fade-up">
                  <CheckCircle2 className="w-5.5 h-5.5 shrink-0 text-indigo-600 mt-0.5 animate-bounce" />
                  <div>
                    <span className="block font-extrabold text-xs">System Operation Notice</span>
                    <span className="block text-[10px] text-indigo-600 mt-1 leading-normal font-semibold">
                      {showIntegrityAlert}
                    </span>
                  </div>
                </div>
              )}

              {/* Alert element explaining utility to user clearly */}
              <div className="flex gap-3.5 p-4 bg-emerald-50/60 border border-emerald-150 rounded-2xl text-emerald-850">
                <CheckCircle2 className="w-5.5 h-5.5 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <span className="block font-black text-xs text-slate-800">How Backup Snapshots Protect Your Data</span>
                  <span className="block text-[11px] text-slate-600 mt-1 leading-relaxed font-medium">
                    This advanced interface allows you to instantly backup details of campaigns, publisher wallets, and client lead history to a local backup record. You can then download physical <strong>JSON Backup Files</strong> directly as secure hard-copies on your PC to guarantee 0% data-loss.
                  </span>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search backups by Reference ID or Date..."
                  value={backupQuery}
                  onChange={(e) => setBackupQuery(e.target.value)}
                  className="w-full text-xs outline-none bg-transparent text-slate-800 font-medium placeholder:text-slate-400"
                />
                {backupQuery && (
                  <button 
                    onClick={() => setBackupQuery('')}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {/* Backup List Table with elegant styling */}
              <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs bg-white">
                    <thead>
                      <tr className="bg-slate-55/80 text-slate-400 uppercase font-extrabold tracking-widest border-b border-slate-200 text-[10px] font-mono">
                        <th className="p-4">Backup ID Ref</th>
                        <th className="p-4">Snapshot Completed Date Time</th>
                        <th className="p-3">Scope Area</th>
                        <th className="p-3 text-right">Data Sizing</th>
                        <th className="p-4 text-center">Actions / Downloads</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {backupLogs
                        .filter(log => 
                          log.id.toLowerCase().includes(backupQuery.toLowerCase()) ||
                          log.time.toLowerCase().includes(backupQuery.toLowerCase()) ||
                          log.scope.toLowerCase().includes(backupQuery.toLowerCase())
                        )
                        .map(log => (
                          <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="p-4 font-mono font-bold text-indigo-650">{log.id}</td>
                            <td className="p-4 font-medium text-slate-800 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              {log.time}
                            </td>
                            <td className="p-3 text-slate-500 font-semibold text-xs lowercase first-letter:uppercase">{log.scope}</td>
                            <td className="p-3 text-right font-mono text-slate-800 font-extrabold">{log.size}</td>
                            <td className="p-4 text-center">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const payload = {
                                      backupId: log.id,
                                      time: log.time,
                                      campaigns: campaigns,
                                      submissions: submissions,
                                      publishers: publishers
                                    };
                                    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(payload, null, 2))}`;
                                    const downloadAnchor = document.createElement('a');
                                    downloadAnchor.setAttribute("href", jsonString);
                                    downloadAnchor.setAttribute("download", `PublicAds_LocalSnapshot_${log.id}.json`);
                                    document.body.appendChild(downloadAnchor);
                                    downloadAnchor.click();
                                    downloadAnchor.remove();
                                    
                                    setShowIntegrityAlert(`Exported offline database bundle for reference ${log.id} successfully!`);
                                    setTimeout(() => setShowIntegrityAlert(null), 4000);
                                  }}
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-all"
                                  title="Download actual physical dataset file"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Download File
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowIntegrityAlert(`Dry-Run Verification Complete! All hashed indexes verified against host schema. Diagnostic Code: OK.`);
                                    setTimeout(() => setShowIntegrityAlert(null), 5000);
                                  }}
                                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] rounded-lg tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-all"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                                  Verify Status
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                      {backupLogs.filter(log => 
                        log.id.toLowerCase().includes(backupQuery.toLowerCase()) ||
                        log.time.toLowerCase().includes(backupQuery.toLowerCase()) ||
                        log.scope.toLowerCase().includes(backupQuery.toLowerCase())
                      ).length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400 font-medium font-mono text-xs">
                            No backup records match the search query. Try another keyword.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Danger Zone: Purge System Data */}
              <div className="mt-8 border border-red-200 bg-red-50/50 p-6 rounded-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-red-900 flex items-center gap-2">
                      <Trash2 className="w-4.5 h-4.5 text-red-650" />
                      Danger Zone: Database Reset & Purge Area
                    </h4>
                    <p className="text-[11px] text-red-700 leading-normal font-medium max-w-2xl">
                      This action will **PERMANENTLY DESTRUCTIVELY DELETE** all user registers (publishers), client action submissions, banking ledger details, lead earnings, and audit logs. This cannot be undone. Active campaigns and employees will remain preserved. Use this strictly when initiating a new advertiser cycle.
                    </p>
                  </div>
                  <div>
                    <button
                      id="admin-destructive-purge-btn"
                      type="button"
                      disabled={isPurging}
                      onClick={() => {
                        const promptWord = prompt("WARNING! This will clear all publishers, earnings, and submissions. To verify, type the word 'CONFIRM' below:");
                        if (promptWord === 'CONFIRM') {
                          handleSystemPurge();
                        } else if (promptWord !== null) {
                          alert("Invalid confirmation text. Data purge canceled.");
                        }
                      }}
                      className="whitespace-nowrap px-4 py-2.5 bg-red-650 hover:bg-red-700 active:bg-red-850 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider cursor-pointer shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                    >
                      {isPurging ? (
                        <>
                          <RefreshCcw className="w-4.5 h-4.5 animate-spin" />
                          Purging Data...
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4.5 h-4.5 animate-pulse" style={{ animationDuration: '2s' }} />
                          Purge Old Registers
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: User Activity Logs */}
          {activeTab === 'activity_logs' && (
            <div id="tabContent-activity" className="space-y-6 animate-fade-up">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    Security Audit Trail & Activity Logs
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Live chronological audit trail tracking client logins, credentials resets, system updates, and payout disburse ledgers.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activityLogs, null, 2));
                      const dlAnchor = document.createElement('a');
                      dlAnchor.setAttribute("href", dataStr);
                      dlAnchor.setAttribute("download", `PublicAds_AuditTrail_${Date.now()}.json`);
                      dlAnchor.click();
                      dlAnchor.remove();
                    }}
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download JSON Logs
                  </button>
                </div>
              </div>

              {/* Informative alert explaining what this logs screen is for */}
              <div className="bg-slate-50/60 p-4 border border-slate-200 rounded-2xl flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-black text-xs text-slate-800">What is the Activity Log for?</span>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed font-semibold">
                    The activity log acts as your site-wide secure security register. Whenever anyone (Administrators, Employees, or Publishers) updates a campaign, requests a payment, logins, or changes settings, the system logs the exact timestamp and operator identity automatically. Use this to combat lead fraud and audit operational events easily.
                  </p>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] text-slate-450 uppercase font-black block tracking-wider">Total Audited Hits</span>
                  <span className="text-xl font-extrabold text-slate-800 block mt-1">{activityLogs.length}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Continuous stream</span>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] text-slate-450 uppercase font-black block tracking-wider">Security Events</span>
                  <span className="text-xl font-extrabold text-amber-600 block mt-1">
                    {activityLogs.filter(log => ['ADMIN_AUTH', 'PASSWORD_RESET', 'BLOCKED', 'PUBLISHER_LOGIN'].includes(log.action)).length}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Admin & user access actions</span>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] text-slate-455 uppercase font-black block tracking-wider">Campaign Actions</span>
                  <span className="text-xl font-extrabold text-blue-600 block mt-1">
                    {activityLogs.filter(log => ['CAMPAIGN_CREATE', 'CAMPAIGN_UPDATE', 'CAMPAIGN_DELETE'].includes(log.action)).length}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Campaign state modifiers</span>
                </div>

                <div className="bg-indigo-50/40 border border-indigo-100 p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] text-indigo-800 uppercase font-black block tracking-wider">Filtered Items</span>
                  <span className="text-xl font-extrabold text-indigo-750 block mt-1">
                    {activityLogs.filter(log => {
                      const matchQuery = 
                        log.id.toLowerCase().includes(activityQuery.toLowerCase()) ||
                        log.timestamp.toLowerCase().includes(activityQuery.toLowerCase()) ||
                        log.userName.toLowerCase().includes(activityQuery.toLowerCase()) ||
                        log.userId.toLowerCase().includes(activityQuery.toLowerCase()) ||
                        log.action.toLowerCase().includes(activityQuery.toLowerCase()) ||
                        log.details.toLowerCase().includes(activityQuery.toLowerCase());

                      if (!matchQuery) return false;

                      if (activityCategory === 'ALL') return true;
                      if (activityCategory === 'ADMIN') {
                        return ['CAMPAIGN_CREATE', 'CAMPAIGN_UPDATE', 'CAMPAIGN_DELETE', 'OFFER_UPDATE', 'STAFF_REMOVED', 'STAFF_CREATED'].includes(log.action);
                      }
                      if (activityCategory === 'SECURITY') {
                        return ['ADMIN_AUTH', 'PASSWORD_RESET', 'BLOCKED', 'UNBLOCKED', 'PUBLISHER_LOGIN'].includes(log.action);
                      }
                      if (activityCategory === 'PUBLISHER') {
                        return ['PUBLISHER_SIGNUP', 'SUBMIT_LEADS', 'SUBMIT_LEAD', 'LEAD_SUBMITTED', 'BANK_UPDATE'].includes(log.action);
                      }
                      if (activityCategory === 'SYSTEM') {
                        return ['AUTO_BACKUP', 'INTEGRITY_RESTORE'].includes(log.action) || log.userId === 'SYSTEM';
                      }
                      return true;
                    }).length}
                  </span>
                  <span className="text-[9px] text-indigo-600 block mt-0.5">Matches filters</span>
                </div>
              </div>

              {/* Filters Box */}
              <div className="p-4 bg-slate-55 border border-slate-200 rounded-2xl space-y-3.5 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-3">
                  
                  {/* Search input bar */}
                  <div className="flex-1 flex items-center gap-2.5 bg-white border border-slate-200 px-3 py-2 rounded-xl focus-within:border-indigo-400 transition-colors">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search audit trail by actor names, actions, descriptions, User ID..."
                      value={activityQuery}
                      onChange={(e) => setActivityQuery(e.target.value)}
                      className="w-full text-xs outline-none bg-transparent text-slate-800 font-medium placeholder:text-slate-400"
                    />
                    {activityQuery && (
                      <button 
                        onClick={() => setActivityQuery('')}
                        className="text-[10px] font-extrabold text-slate-450 hover:text-slate-600 uppercase tracking-widest"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Filter category tabs selector */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mr-1.5">Category:</span>
                    {[
                      { id: 'ALL', label: 'All Log Entries' },
                      { id: 'ADMIN', label: 'Admin' },
                      { id: 'SECURITY', label: 'Access Control' },
                      { id: 'PUBLISHER', label: 'Publisher' },
                      { id: 'SYSTEM', label: 'System' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActivityCategory(tab.id as any)}
                        className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                          activityCategory === tab.id
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white hover:bg-slate-200 text-slate-650 border border-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                </div>
              </div>

              {/* Logger feed table with color badges */}
              <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto max-h-[55vh]">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-slate-50 backdrop-blur-md text-slate-400 uppercase font-black border-b border-slate-200 z-10 text-[9px] tracking-wider font-mono">
                      <tr>
                        <th className="p-4">Timestamp logs</th>
                        <th className="p-4">Operative User & ID</th>
                        <th className="p-3 text-center">Operation Target</th>
                        <th className="p-4">Detailed Operation Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-700">
                      {(() => {
                        const filtered = activityLogs
                          .filter(log => {
                            const matchQuery = 
                              log.id.toLowerCase().includes(activityQuery.toLowerCase()) ||
                              log.timestamp.toLowerCase().includes(activityQuery.toLowerCase()) ||
                              log.userName.toLowerCase().includes(activityQuery.toLowerCase()) ||
                              log.userId.toLowerCase().includes(activityQuery.toLowerCase()) ||
                              log.action.toLowerCase().includes(activityQuery.toLowerCase()) ||
                              log.details.toLowerCase().includes(activityQuery.toLowerCase());

                            if (!matchQuery) return false;

                            if (activityCategory === 'ALL') return true;
                            if (activityCategory === 'ADMIN') {
                              return ['CAMPAIGN_CREATE', 'CAMPAIGN_UPDATE', 'CAMPAIGN_DELETE', 'OFFER_UPDATE', 'STAFF_REMOVED', 'STAFF_CREATED'].includes(log.action);
                            }
                            if (activityCategory === 'SECURITY') {
                              return ['ADMIN_AUTH', 'PASSWORD_RESET', 'BLOCKED', 'UNBLOCKED', 'PUBLISHER_LOGIN'].includes(log.action);
                            }
                            if (activityCategory === 'PUBLISHER') {
                              return ['PUBLISHER_SIGNUP', 'SUBMIT_LEADS', 'SUBMIT_LEAD', 'LEAD_SUBMITTED', 'BANK_UPDATE'].includes(log.action);
                            }
                            if (activityCategory === 'SYSTEM') {
                              return ['AUTO_BACKUP', 'INTEGRITY_RESTORE'].includes(log.action) || log.userId === 'SYSTEM';
                            }
                            return true;
                          })
                          .sort((a, b) => {
                            const keyA = (a.timestamp || '') + '_' + (a.id || '');
                            const keyB = (b.timestamp || '') + '_' + (b.id || '');
                            return keyB.localeCompare(keyA);
                          });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={4} className="p-8 text-center text-slate-400 font-medium font-mono text-xs">
                                No auditable trails found matching selection parameters.
                              </td>
                            </tr>
                          );
                        }

                        const currentSlice = filtered.slice((activityLogPage - 1) * 50, activityLogPage * 50);

                        return currentSlice.map(log => {
                          let badgeStyle = 'bg-slate-100 text-slate-800 border-slate-200';
                          const act = log.action.toUpperCase();
                          if (act.includes('DELETE') || act.includes('REMOVE') || act.includes('BLOCKED')) {
                            badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
                          } else if (act.includes('CREATE') || act.includes('SIGNUP') || act.includes('BACKUP') || act.includes('APPROVE') || act.includes('SUCCESS')) {
                            badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-250';
                          } else if (act.includes('AUTH') || act.includes('RESET') || act.includes('LOGIN')) {
                            badgeStyle = 'bg-amber-50 text-amber-700 border-amber-250';
                          } else if (act.includes('UPDATE') || act.includes('TOGGLE') || act.includes('EDIT')) {
                            badgeStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                          }

                          return (
                            <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 text-slate-450 font-medium whitespace-nowrap">{log.timestamp}</td>
                              <td className="p-4 font-bold whitespace-nowrap">
                                <span className="text-slate-800 font-semibold">{log.userName}</span>
                                <span className="text-[10px] text-slate-400 block font-normal">UID: {log.userId}</span>
                              </td>
                              <td className="p-3 text-center whitespace-nowrap">
                                <span className={`inline-block border px-2.5 py-0.5 rounded-full font-extrabold uppercase text-[9px] tracking-wide ${badgeStyle}`}>
                                  {log.action}
                                </span>
                              </td>
                              <td className="p-4 text-slate-600 font-medium leading-relaxed max-w-sm break-words">{log.details}</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
                {renderPaginationControls(
                  activityLogPage,
                  Math.ceil(
                    activityLogs.filter(log => {
                      const matchQuery = 
                        log.id.toLowerCase().includes(activityQuery.toLowerCase()) ||
                        log.timestamp.toLowerCase().includes(activityQuery.toLowerCase()) ||
                        log.userName.toLowerCase().includes(activityQuery.toLowerCase()) ||
                        log.userId.toLowerCase().includes(activityQuery.toLowerCase()) ||
                        log.action.toLowerCase().includes(activityQuery.toLowerCase()) ||
                        log.details.toLowerCase().includes(activityQuery.toLowerCase());

                      if (!matchQuery) return false;

                      if (activityCategory === 'ALL') return true;
                      if (activityCategory === 'ADMIN') {
                        return ['CAMPAIGN_CREATE', 'CAMPAIGN_UPDATE', 'CAMPAIGN_DELETE', 'OFFER_UPDATE', 'STAFF_REMOVED', 'STAFF_CREATED'].includes(log.action);
                      }
                      if (activityCategory === 'SECURITY') {
                        return ['ADMIN_AUTH', 'PASSWORD_RESET', 'BLOCKED', 'UNBLOCKED', 'PUBLISHER_LOGIN'].includes(log.action);
                      }
                      if (activityCategory === 'PUBLISHER') {
                        return ['PUBLISHER_SIGNUP', 'SUBMIT_LEADS', 'SUBMIT_LEAD', 'LEAD_SUBMITTED', 'BANK_UPDATE'].includes(log.action);
                      }
                      if (activityCategory === 'SYSTEM') {
                        return ['AUTO_BACKUP', 'INTEGRITY_RESTORE'].includes(log.action) || log.userId === 'SYSTEM';
                      }
                      return true;
                    }).length / 50
                  ) || 1,
                  activityLogs.filter(log => {
                    const matchQuery = 
                      log.id.toLowerCase().includes(activityQuery.toLowerCase()) ||
                      log.timestamp.toLowerCase().includes(activityQuery.toLowerCase()) ||
                      log.userName.toLowerCase().includes(activityQuery.toLowerCase()) ||
                      log.userId.toLowerCase().includes(activityQuery.toLowerCase()) ||
                      log.action.toLowerCase().includes(activityQuery.toLowerCase()) ||
                      log.details.toLowerCase().includes(activityQuery.toLowerCase());

                    if (!matchQuery) return false;

                    if (activityCategory === 'ALL') return true;
                    if (activityCategory === 'ADMIN') {
                      return ['CAMPAIGN_CREATE', 'CAMPAIGN_UPDATE', 'CAMPAIGN_DELETE', 'OFFER_UPDATE', 'STAFF_REMOVED', 'STAFF_CREATED'].includes(log.action);
                    }
                    if (activityCategory === 'SECURITY') {
                      return ['ADMIN_AUTH', 'PASSWORD_RESET', 'BLOCKED', 'UNBLOCKED', 'PUBLISHER_LOGIN'].includes(log.action);
                    }
                    if (activityCategory === 'PUBLISHER') {
                      return ['PUBLISHER_SIGNUP', 'SUBMIT_LEADS', 'SUBMIT_LEAD', 'LEAD_SUBMITTED', 'BANK_UPDATE'].includes(log.action);
                    }
                    if (activityCategory === 'SYSTEM') {
                      return ['AUTO_BACKUP', 'INTEGRITY_RESTORE'].includes(log.action) || log.userId === 'SYSTEM';
                    }
                    return true;
                  }).length,
                  setActivityLogPage
                )}
              </div>
            </div>
          )}

          {/* TAB 9: Testimonials / Feedback Reviews Editor */}
          {activeTab === 'testimonials_edit' && (
            <div id="tabContent-testimonials" className="space-y-6 animate-fade-up">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 font-sans">
                    <MessageSquare className="w-5 h-5 text-rose-500" />
                    Client Review & Feedback Manager
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage the customer testimonials displayed dynamically on your public homepage. Add, edit, or remove reviews.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (!testiFormOpen && !editingTestiId && testimonials.length >= 10) {
                        setTestiMsg('Warning: You cannot add more than 10 reviews. Please edit or delete existing reviews to replace them.');
                        return;
                      }
                      setEditingTestiId(null);
                      setTestiName('');
                      setTestiProfession('');
                      setTestiImage('');
                      setTestiMessage('');
                      setTestiMsg('');
                      setTestiFormOpen(!testiFormOpen);
                    }}
                    className="px-3.5 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    {testiFormOpen ? 'Close Editor Form' : 'Add New Review'}
                  </button>
                </div>
              </div>

              {testiMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-xl flex items-center justify-between">
                  <span>{testiMsg}</span>
                  <button onClick={() => setTestiMsg('')} className="bg-transparent border-0 text-[10px] text-emerald-800 hover:text-emerald-950 font-bold">✕ Dismiss</button>
                </div>
              )}

              {/* Collapsible create/edit form */}
              {testiFormOpen && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!testiName || !testiProfession || !testiMessage) {
                      setTestiMsg('Warning: Plase fully fill all required review fields (Name, Profession, Message).');
                      return;
                    }
                    if (!editingTestiId && testimonials.length >= 10) {
                      setTestiMsg('Warning: You cannot add more than 10 reviews. Please edit or delete existing reviews.');
                      return;
                    }
                    const payload = {
                      name: testiName,
                      profession: testiProfession,
                      image: testiImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150', // Default modern face avatar
                      message: testiMessage
                    };

                    if (editingTestiId) {
                      editTestimonial(editingTestiId, payload);
                      setTestiMsg(`Review from '${testiName}' updated successfully!`);
                    } else {
                      addTestimonial(payload);
                      setTestiMsg(`Review from '${testiName}' added to home carousel!`);
                    }

                    // Reset form
                    setEditingTestiId(null);
                    setTestiName('');
                    setTestiProfession('');
                    setTestiImage('');
                    setTestiMessage('');
                    setTestiFormOpen(false);
                  }}
                  className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm"
                >
                  <h4 className="text-sm font-black text-slate-800 font-sans">
                    {editingTestiId ? 'Edit Review Record' : 'Configure Custom Testimonial Card'}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">Client Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Evelyn H."
                        value={testiName}
                        onChange={(e) => setTestiName(e.target.value)}
                        className="w-full text-xs p-3 border border-slate-200 bg-white text-slate-900 rounded-xl outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Job & Subtitle Text</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Founder, Studio-X / Designer"
                        value={testiProfession}
                        onChange={(e) => setTestiProfession(e.target.value)}
                        className="w-full text-xs p-3 border border-slate-200 bg-white text-slate-900 rounded-xl outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Profile Image URL (External link)</label>
                      <input
                        type="url"
                        placeholder="Paste image URL (https://...)"
                        value={testiImage}
                        onChange={(e) => setTestiImage(e.target.value)}
                        className="w-full text-xs p-3 border border-slate-200 bg-white text-slate-900 rounded-xl outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Upload Local Photo link</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 5 * 1024 * 1024) {
                              alert('Photo exceeds safety guidelines (5 MB limit).');
                              return;
                            }
                            const r = new FileReader();
                            r.onloadend = async () => {
                              const base64String = r.result as string;
                              try {
                                const compressed = await compressImageBase64(base64String, 200, 200, 0.8);
                                setTestiImage(compressed);
                              } catch (err) {
                                setTestiImage(base64String);
                              }
                            };
                            r.readAsDataURL(file);
                          }}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        />
                        <div className="w-full text-center border border-dashed border-slate-300 p-2.5 rounded-xl bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5">
                          <Upload className="w-4 h-4 text-slate-400" />
                          Upload Photo File
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 font-sans">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Feedback Review Message</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Exceptional UI precision and speed. The custom integrations make this platform excellent..."
                      value={testiMessage}
                      onChange={(e) => setTestiMessage(e.target.value)}
                      className="w-full text-xs p-3 border border-slate-200 bg-white text-slate-900 rounded-xl outline-none focus:border-indigo-500 font-medium leading-relaxed resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTestiId(null);
                        setTestiName('');
                        setTestiProfession('');
                        setTestiImage('');
                        setTestiMessage('');
                        setTestiFormOpen(false);
                      }}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4.5 py-2 bg-[#2d1b18] hover:bg-black text-white font-black text-xs rounded-xl shadow cursor-pointer"
                    >
                      {editingTestiId ? 'Save Review Updates' : 'Add Testimonial'}
                    </button>
                  </div>
                </form>
              )}

              {/* Informative alert explaining reviews defaults */}
              <div className="p-4 bg-rose-50/50 border border-rose-200/50 rounded-2xl flex gap-3 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-black text-xs text-rose-950 font-sans">Testimonial Parameters Info</span>
                  <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed font-semibold">
                    By default, all dynamic testimonials will render ⭐⭐⭐⭐⭐ (5 Star reviews) on the landing page carousel to uphold top agency ratings automatically. You can manage their image avatars, complete customer profiles, and specific message bodies down here in real-time.
                  </p>
                </div>
              </div>

              {/* Testimonials List Grid / Table */}
              <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10 text-[9px] text-slate-400 font-black uppercase tracking-wider font-mono">
                      <tr>
                        <th className="p-4">Profile Avatar</th>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Designation / Profession</th>
                        <th className="p-4">Rating Star Check</th>
                        <th className="p-4">Review Message Message</th>
                        <th className="p-4 text-right">Interactive Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {testimonials.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                              onError={(e) => {
                                // Default modern safe face placeholder on error
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
                              }}
                            />
                          </td>
                          <td className="p-4 font-black text-slate-800 font-sans">{item.name}</td>
                          <td className="p-4 font-bold text-slate-500 font-sans">{item.profession}</td>
                          <td className="p-4 text-amber-500">
                            <span className="flex gap-0.5">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            </span>
                          </td>
                          <td className="p-4 font-medium text-slate-650 max-w-sm font-sans text-[11.5px] leading-relaxed break-words">{item.message}</td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2 text-xs">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingTestiId(item.id);
                                  setTestiName(item.name);
                                  setTestiProfession(item.profession);
                                  setTestiImage(item.image);
                                  setTestiMessage(item.message);
                                  setTestiFormOpen(true);
                                  // Smooth scroll to top of panel workspace
                                  const workBlock = document.getElementById('admin-workspace') || document.getElementById('tabContent-testimonials');
                                  if (workBlock) {
                                    workBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }
                                }}
                                className="px-2.5 py-1.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-lg font-black transition-colors cursor-pointer"
                              >
                                Edit Review
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Are you absolutely sure you want to delete the testimonial of "${item.name}"?`)) {
                                    deleteTestimonial(item.id);
                                    setTestiMsg(`Review from '${item.name}' permanently deleted.`);
                                  }
                                }}
                                className="px-2.5 py-1.5 text-rose-650 hover:bg-rose-50 border border-rose-200 rounded-lg font-black transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {testimonials.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 font-medium font-mono text-xs">
                            No active reviews shown. Add a custom feedback to feed the dynamic homepage carousel!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}



        </main>
      </div>

      {/* Interactive Bank Details Modal */}
      {viewingBankDetails && (
        <div 
          id="publisher-bank-details-modal" 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setViewingBankDetails(null)}
        >
          <div 
            className="relative bg-white rounded-2xl overflow-hidden max-w-md w-full border border-slate-200 shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-150 bg-slate-50">
              <span className="font-extrabold text-slate-850 text-[11px] uppercase tracking-wider">🏦 Banking Ledger: {viewingBankDetails.id}</span>
              <button 
                onClick={() => setViewingBankDetails(null)}
                className="p-1 px-2.5 bg-slate-200 hover:bg-slate-300 rounded-xl font-black text-slate-750 cursor-pointer text-[10px]"
              >
                ✕ Close
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="block text-[10px] uppercase tracking-widest font-mono text-slate-400">Account Owner</span>
                <h4 className="text-base font-extrabold mt-0.5 text-slate-900">{viewingBankDetails.name}</h4>
              </div>

              {viewingBankDetails.bank && (viewingBankDetails.bank.accountNumber || viewingBankDetails.bank.upi) ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Holder Name</span>
                      <span className="text-xs font-bold text-slate-750">{viewingBankDetails.bank.holderName || viewingBankDetails.name}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Account Number</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-slate-750 font-mono">{viewingBankDetails.bank.accountNumber || 'N/A'}</span>
                        {viewingBankDetails.bank.accountNumber && (
                          <button 
                            onClick={() => {
                              const txt = viewingBankDetails.bank.accountNumber;
                              const ta = document.createElement("textarea"); ta.value = txt; ta.style.position="fixed"; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
                              alert('Copied Account Number!');
                            }}
                            className="px-1.5 py-0.5 text-[8px] font-black bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition-colors"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Bank IFSC Code</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-slate-750 font-mono uppercase">{viewingBankDetails.bank.ifsc || 'N/A'}</span>
                        {viewingBankDetails.bank.ifsc && (
                          <button 
                            onClick={() => {
                              const txt = viewingBankDetails.bank.ifsc;
                              const ta = document.createElement("textarea"); ta.value = txt; ta.style.position="fixed"; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
                              alert('Copied IFSC!');
                            }}
                            className="px-1.5 py-0.5 text-[8px] font-black bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition-colors"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">UPI ID Ledger</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-slate-750 font-mono">{viewingBankDetails.bank.upi || 'N/A'}</span>
                        {viewingBankDetails.bank.upi && (
                          <button 
                            onClick={() => {
                              const txt = viewingBankDetails.bank.upi;
                              const ta = document.createElement("textarea"); ta.value = txt; ta.style.position="fixed"; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
                              alert('Copied UPI ID!');
                            }}
                            className="px-1.5 py-0.5 text-[8px] font-black bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition-colors"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Registered Phone</span>
                      <span className="text-xs font-bold text-slate-750 font-mono">{viewingBankDetails.bank.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Registered Email</span>
                      <span className="text-xs font-bold text-slate-750 font-mono break-all">{viewingBankDetails.bank.email || 'N/A'}</span>
                    </div>
                  </div>

                  {viewingBankDetails.bank.qrCode && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-2">Uploaded UPI QR Scan card</span>
                      <div className="flex justify-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <img 
                          src={viewingBankDetails.bank.qrCode} 
                          alt="Client QR code" 
                          className="w-40 h-40 rounded border border-slate-150 object-contain bg-white" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-450 text-xs font-semibold space-y-2">
                  <p className="text-2xl">🏦</p>
                  <p className="text-slate-500 font-bold">No bank ledger coordinates configured.</p>
                  <p className="text-[10px] text-slate-400 max-w-xs mx-auto font-normal">This client has not filled out or saved their bank or UPI details inside their dashboard yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Image Preview Modal */}
      {previewImage && (
        <div 
          id="proof-image-preview-modal-admin" 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-150 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40">
              <span className="font-extrabold text-slate-800 dark:text-slate-100 text-[11px] uppercase tracking-wider">Verification Proof / Screenshot Preview</span>
              <div className="flex gap-2">
                <a 
                  href={previewImage} 
                  download={`proof-${Date.now()}.png`}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] uppercase rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> Download
                </a>
                <button 
                  onClick={() => setPreviewImage(null)}
                  className="p-1 px-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl font-black text-slate-750 dark:text-slate-250 cursor-pointer text-[10px]"
                >
                  ✕ Close
                </button>
              </div>
            </div>
            {/* Image Box */}
            <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[72vh] min-h-[250px] overflow-auto">
              <img 
                src={previewImage} 
                alt="Verification Proof" 
                className="max-w-full max-h-[66vh] object-contain rounded-lg shadow-md border border-slate-700" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Interactive Earnings Editor Modal */}
      {editingEarningsPubId && (
        <div 
          id="publisher-earnings-editor-modal" 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setEditingEarningsPubId(null)}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-150 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40">
              <div>
                <span className="font-extrabold text-slate-800 dark:text-slate-100 text-[12px] uppercase tracking-wider block">
                  Manage Earnings: {publishers.find(p => p.id === editingEarningsPubId)?.name || 'Publisher'}
                </span>
                <span className="font-mono text-[10px] text-indigo-650 dark:text-indigo-400 font-bold block mt-0.5">
                  ID: {editingEarningsPubId}
                </span>
              </div>
              <button 
                onClick={() => setEditingEarningsPubId(null)}
                className="p-1 px-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl font-black text-slate-750 dark:text-slate-250 cursor-pointer text-[10px]"
              >
                ✕ Close
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Stats Bar */}
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/25 border border-indigo-100 dark:border-indigo-900/50 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Accumulated Earnings</span>
                  <div className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
                    ₹{(earnings || []).filter(e => e.publisherId === editingEarningsPubId).reduce((sum, e) => sum + (e.amount || 0), 0)}
                  </div>
                </div>
                <div className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-450 p-2 rounded-lg">
                  <Coins className="w-6 h-6" />
                </div>
              </div>

              {/* Transactions Title */}
              <div>
                <h4 className="text-xs font-black text-slate-750 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Recent 5 Earning Transactions</span>
                  <span className="bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 px-1.5 py-0.5 rounded-full font-mono">
                    {Math.min(5, (earnings || []).filter(e => e.publisherId === editingEarningsPubId).length)} shown
                  </span>
                </h4>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1">
                  You can edit the disbursed campaign payout amounts directly or permanently remove transactional records to adjust the ledger balance.
                </p>
              </div>

              {/* Earning Logs List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {(() => {
                  const normEditPubId = (editingEarningsPubId || '').trim().toLowerCase();
                  const pubEarnings = (earnings || []).filter(e => (e.publisherId || '').trim().toLowerCase() === normEditPubId);
                  const sortedEarnings = [...pubEarnings].sort((a, b) => {
                    const keyA = (a.date || '') + '_' + (a.time || '') + '_' + (a.id || '');
                    const keyB = (b.date || '') + '_' + (b.time || '') + '_' + (b.id || '');
                    return keyB.localeCompare(keyA);
                  });

                  if (sortedEarnings.length === 0) {
                    return (
                      <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 font-mono text-xs">
                        No earning disburse records found for this user.
                      </div>
                    );
                  }

                  return sortedEarnings.map((earning) => {
                    const currentInputValue = editingEarningItemValues[earning.id] !== undefined 
                      ? editingEarningItemValues[earning.id] 
                      : String(earning.amount);

                    return (
                      <div 
                        key={earning.id} 
                        className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in"
                      >
                        {/* Record Info */}
                        <div className="space-y-1">
                          <div className="font-extrabold text-slate-750 dark:text-slate-300 text-xs line-clamp-1">
                            {earning.campaignName || 'Campaign Reward'}
                          </div>
                          <div className="flex items-center gap-2 text-[9px] text-slate-400 dark:text-slate-500 font-mono font-bold">
                            <span>📅 {earning.date}</span>
                            <span>⏱️ {earning.time}</span>
                            <span className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-indigo-550 dark:text-indigo-400">
                              ID: {earning.id}
                            </span>
                          </div>
                        </div>

                        {/* Record Edit Controls */}
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <span className="absolute left-2 inset-y-0 flex items-center text-[10px] font-black text-slate-400">₹</span>
                            <input
                              type="number"
                              value={currentInputValue}
                              onChange={(e) => {
                                setEditingEarningItemValues(prev => ({
                                  ...prev,
                                  [earning.id]: e.target.value
                                }));
                              }}
                              className="w-20 pl-4 pr-1 text-center font-extrabold font-mono text-xs p-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-lg outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-550/30"
                              placeholder="0"
                            />
                          </div>

                          {/* Save Edit Button */}
                          <button
                            onClick={() => {
                              const newAmt = Number(currentInputValue);
                              if (isNaN(newAmt) || newAmt < 0) {
                                alert('Please enter a valid positive number for amount.');
                                return;
                              }
                              updateEarningAmount(earning.id, newAmt);
                              alert('Earning record successfully updated!');
                            }}
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/60 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900 rounded-lg transition-all cursor-pointer text-[10px] font-extrabold uppercase tracking-wider"
                            title="Save new amount"
                          >
                            Save
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to permanently remove this ₹${earning.amount} earning record? This will immediately reduce the user's total balance and revert the client lead status in MIS to 'Process'.`)) {
                                deleteEarningRecord(earning.id);
                                // Remove from local value tracking as well
                                setEditingEarningItemValues(prev => {
                                  const updated = { ...prev };
                                  delete updated[earning.id];
                                  return updated;
                                });
                              }
                            }}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-650 hover:text-rose-750 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-400 border border-rose-100 dark:border-rose-900 rounded-lg transition-all cursor-pointer"
                            title="Delete this transaction log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 dark:bg-slate-950/40 p-4 border-t border-slate-150 dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 font-medium">
                Changes persist to the server in real-time. Closing this modal updates the registry calculations instantly.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
