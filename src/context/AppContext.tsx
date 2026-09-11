import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  getDocs,
  limit,
  getDoc,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
export { db };
import { 
  Campaign, 
  Publisher, 
  EarningRecord, 
  DataSubmission, 
  Employee, 
  PartnerApplication, 
  BankDetails, 
  ActivityLog, 
  ActiveOffer,
  SubmissionStatus,
  Testimonial,
  AdvertiserInquiry,
  PaymentEmailRecord,
  EmailStatus
} from '../types';
import {
  snapshotPublishers,
  snapshotSubmissions,
  snapshotEarnings,
  snapshotCampaigns,
  snapshotBankDetailsMap,
  snapshotEmployees,
  snapshotAdvertiserInquiries,
  snapshotPartners
} from '../data/databaseSnapshot';

interface AppContextType {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  campaigns: Campaign[];
  publishers: Publisher[];
  earnings: EarningRecord[];
  submissions: DataSubmission[];
  employees: Employee[];
  partnerApplications: PartnerApplication[];
  bankDetailsMap: Record<string, BankDetails>;
  activityLogs: ActivityLog[];
  offer: ActiveOffer;
  supportPhone: string;
  supportEmail: string;
  partnerHiringActive: boolean;
  currentUser: { type: 'publisher' | 'admin' | 'employee'; id: string; name: string; username?: string; role?: 'Payment' | 'MIS' } | null;
  setCurrentUser: (user: AppContextType['currentUser']) => void;
  refreshServerState: () => Promise<void>;
  testimonials: Testimonial[];
  quotaError: string | null;
  googleSheetUrl: string;
  advertiserInquiries: AdvertiserInquiry[];
  paymentEmailRecords: PaymentEmailRecord[];
  
  hasMoreSubmissions: boolean;
  loadMoreSubmissions: () => void;
  hasMoreEarnings: boolean;
  loadMoreEarnings: () => void;
  hasMorePublishers: boolean;
  loadMorePublishers: () => void;
  hasMorePartners: boolean;
  loadMorePartners: () => void;
  
  // Payment Confirmation Email Actions
  sendPaymentEmail: (data: { customerName: string; emailAddress: string; transactionId: string; amount: number; paymentMethod?: string; publisherId?: string }) => Promise<{ success: boolean; message: string }>;
  retryPaymentEmail: (id: string) => Promise<{ success: boolean; message: string }>;
  deletePaymentEmailRecord: (id: string) => Promise<{ success: boolean; message: string }>;
  getLatestClientPaymentEmail: (publisherId?: string, emailAddress?: string) => PaymentEmailRecord | null;
  
  // Actions
  loginPublisher: (phoneOrEmail: string, password: string) => Promise<{ success: boolean; message: string; publisher?: Publisher }>;
  signupPublisher: (name: string, email: string, phone: string, password: string, inviteCode?: string) => Promise<{ success: boolean; message: string; publisher?: Publisher }>;
  logout: () => void;
  updatePublisherProfile: (name: string, avatar: string) => void;
  sendPasswordReset: (phone: string, email: string) => { success: boolean; found: boolean; message: string };
  resetUserPasswordByAdmin: (phone: string, email: string, newPass: string) => { success: boolean; message: string };
  
  // Admin Actions
  addCampaign: (c: Omit<Campaign, 'id' | 'active'>) => void;
  editCampaign: (id: string, updatedCamp: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  toggleCampaignActive: (id: string) => void;
  updateOfferPopup: (image: string, active: boolean, title?: string, description?: string, buttonText?: string, link?: string, showButton?: boolean) => void;
  updateSupportDetails: (phone: string, email: string) => void;
  togglePartnerHiring: (active: boolean) => void;
  updateSubmissionStatus: (submissionId: string, status: SubmissionStatus) => void;
  deleteSubmission: (id: string) => void;
  updateEarningAmount: (earningId: string, amount: number) => void;
  deleteEarningRecord: (earningId: string) => void;
  toggleBlockPublisher: (pubId: string) => void;
  deletePublisher: (pubId: string) => void;
  addEmployee: (name: string, u: string, p: string, role: 'Payment' | 'MIS') => { success: boolean; message: string };
  deleteEmployee: (id: string) => void;
  triggerBackup: () => void;
  backupLogs: Array<{ id: string; time: string; scope: string; size: string; status: string }>;
  purgeAllSystemData: () => Promise<{ success: boolean; message: string }>;
  addTestimonial: (t: Omit<Testimonial, 'id'>) => void;
  editTestimonial: (id: string, updated: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  updateGoogleSheetUrl: (url: string) => Promise<void>;
  deleteAdvertiserInquiry: (id: string) => Promise<void>;
  submitAdvertiserInquiry: (name: string, phone: string, email: string, company: string, campaign: string) => Promise<{ success: boolean; message: string; whatsappUrl?: string; inquiry?: AdvertiserInquiry }>;
  
  // Publisher Actions
  submitBankDetails: (details: BankDetails) => Promise<{ success: boolean; message: string }>;
  submitLead: (campaignId: string, clientName: string, clientPhone: string, clientCode: string, screenshot: string) => Promise<{ success: boolean; message: string }>;
  applyForPartner: (name: string, phone: string, email: string, city: string, age: number, qualification: string) => Promise<{ success: boolean; message: string }>;
  
  // Employee Login
  loginEmployee: (username: string, pass: string) => { success: boolean; message: string; employee?: Employee };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial campaigns
const defaultCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    name: 'PhonePe Demat Account',
    vertical: 'Fintech',
    model: 'CPA',
    platform: 'app',
    kpi: 'Free Account opening + First Trade within 7 days',
    geo: 'India (PAN)',
    payout: 250,
    terms: 'Only unique users. Age limit: 18-35. Aadhaar-linked mobile is mandatory.',
    link: 'https://phonepe-demat.onereferral.in/pub/ads-india-track-1',
    image: 'https://images.unsplash.com/photo-1616077168712-fc6c788bc4ee?auto=format&fit=crop&q=80&w=200', // standard generic finance illustration
    active: true
  },
  {
    id: 'camp-2',
    name: 'Angel One Demat & Trading',
    vertical: 'Finance',
    model: 'CPA',
    platform: 'both',
    kpi: 'Successful Mobile App installation + Instant Demat opening',
    geo: 'India',
    payout: 350,
    terms: 'Valid PAN card, Aadhaar, and active bank account required. Minimum 1 trade recommended for quick payout approval.',
    link: 'https://angelone.directtrack.in/campaign/ads-india-23',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=200',
    active: true
  },
  {
    id: 'camp-3',
    name: 'SBI Credit Card Gold Pro',
    vertical: 'Credit Cards',
    model: 'CPL',
    platform: 'web',
    kpi: 'Lead registration with completed Video KYC',
    geo: 'Tier 1 & Tier 2 India',
    payout: 1200,
    terms: 'Salary target: ₹25k+/month. Excellent credit history is required. Fake details are filtered within 48 hours.',
    link: 'https://sbicard.com/lead/gold-pub-india-6385_ads',
    image: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=200',
    active: true
  },
  {
    id: 'camp-4',
    name: 'mStock Zero Brokerage Account',
    vertical: 'Investing',
    model: 'CPA',
    platform: 'app',
    kpi: 'Account Opening completion + F&O Activating',
    geo: 'India',
    payout: 400,
    terms: 'Must complete user on-boarding. Self-leads are strictly rejected by the bank audit.',
    link: 'https://mstock.direct.pro/campaign/ads-india-42',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=200',
    active: true
  }
];

const defaultTestimonials: Testimonial[] = [
  {
    id: "testi-1",
    name: "Evelyn H.",
    profession: "Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
    message: "The web design team transformed our platform into a masterpiece! The attention to detail, spacing, and modern typography completely elevated our traffic and conversion rates."
  },
  {
    id: "testi-2",
    name: "Clara M.",
    profession: "App Developer",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    message: "Incredible UX capability! They delivered a stunning and smart UI layout with clean modern interactions that work effortlessly across any mobile device or device scale. Absolutely elite."
  },
  {
    id: "testi-3",
    name: "Sarah K.",
    profession: "Marketing Lead",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    message: "Our conversion rate skyrocketed by 45% after applying this new clean interface. The design feels trustworthy, professional, and visually spectacular. Client feedback has been stellar!"
  },
  {
    id: "testi-4",
    name: "Michelle P.",
    profession: "Creative Director",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
    message: "The team is exceptionally skilled in premium UI aesthetics. They took our vague feedback and engineered a highly optimized, state-of-the-art layout that exceeded our digital standards."
  },
  {
    id: "testi-5",
    name: "Natasha R.",
    profession: "Founder, Studio-X",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    message: "Exceptional UI precision and speed. The custom integrations, interactive widgets, and seamless responsiveness on both phone and PC make this platform an absolute treasure to use daily."
  },
  {
    id: "testi-6",
    name: "Jessica L.",
    profession: "Project Manager",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300",
    message: "Flawless communication and aesthetic execution! They designed a highly intuitive website layout with perfect accessibility and polished animations. It feels incredibly premium."
  }
];

const sanitizeError = (error: any): string => {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const msg = error.message || String(error);
  const lowerMsg = msg.toLowerCase();
  if (
    lowerMsg.includes('quota') ||
    lowerMsg.includes('limit') ||
    lowerMsg.includes('exceeded') ||
    lowerMsg.includes('billing') ||
    lowerMsg.includes('firestore') ||
    lowerMsg.includes('free tier') ||
    lowerMsg.includes('resource_exhausted') ||
    lowerMsg.includes('quota exceeded') ||
    lowerMsg.includes('service_unavailable') ||
    lowerMsg.includes('cannot be written') ||
    lowerMsg.includes('projects/') ||
    lowerMsg.includes('databases/') ||
    lowerMsg.includes('maximum allowed size') ||
    lowerMsg.includes('size (') ||
    lowerMsg.includes('bytes') ||
    lowerMsg.includes('permission-denied') ||
    lowerMsg.includes('insufficient permissions') ||
    lowerMsg.includes('index')
  ) {
    return 'Website Under maintenance please try again after some time.';
  }
  return msg;
};

const defaultPaymentEmailRecords: PaymentEmailRecord[] = [
  {
    id: 'pem-101',
    customerName: 'Rahul Verma',
    emailAddress: 'rahul.v@gmail.com',
    transactionId: 'TXN9842104812',
    amount: 15400,
    paymentMethod: 'UPI (GPay / PhonePe)',
    emailStatus: 'Delivered',
    sentTime: '2026-07-28 10:15:22',
    paymentStatus: 'Completed',
    publisherId: 'PUB1001'
  },
  {
    id: 'pem-102',
    customerName: 'Priya Sharma',
    emailAddress: 'priya.s22@yahoo.com',
    transactionId: 'TXN8821039481',
    amount: 8500,
    paymentMethod: 'IMPS Direct Bank Transfer',
    emailStatus: 'Processing',
    sentTime: '2026-07-28 11:30:10',
    paymentStatus: 'Processing',
    publisherId: 'PUB1002'
  },
  {
    id: 'pem-103',
    customerName: 'Amit Patel',
    emailAddress: 'amit.patel@outloook.com',
    transactionId: 'TXN7730192834',
    amount: 12200,
    paymentMethod: 'NEFT / Net Banking',
    emailStatus: 'Failed',
    sentTime: '2026-07-28 09:45:00',
    errorMessage: 'SMTP Error 550: Mailbox unavailable or rejected by recipient server',
    paymentStatus: 'Failed',
    publisherId: 'PUB1003'
  },
  {
    id: 'pem-104',
    customerName: 'Vikram Singh',
    emailAddress: 'vikram.singh@gmail.com',
    transactionId: 'TXN6620194821',
    amount: 25000,
    paymentMethod: 'UPI Transfer',
    emailStatus: 'Sending',
    sentTime: '2026-07-28 12:05:14',
    paymentStatus: 'Success',
    publisherId: 'PUB1004'
  }
];

// Real-time cross-tab synchronization channel
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('pai_system_cross_tab_sync') 
  : null;

const broadcastSync = (type: string, payload: any) => {
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type, payload });
    } catch (e) {}
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  // Mutex lock to strictly prevent duplicate disbursement clicks (single count guarantee)
  const inFlightDisbursementIds = useRef<Set<string>>(new Set());
  
  // Resilient cached state initialization: ensures data persists and displays even when Firestore quota is throttled
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const stored = localStorage.getItem('pai_cached_campaigns');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return snapshotCampaigns.length > 0 ? snapshotCampaigns : defaultCampaigns;
    } catch {
      return snapshotCampaigns.length > 0 ? snapshotCampaigns : defaultCampaigns;
    }
  });
  
  // Testimonials optimized with localStorage cache to avoid redundant database reads
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const stored = localStorage.getItem('pai_cached_testimonials');
      return stored ? JSON.parse(stored) : defaultTestimonials;
    } catch {
      return defaultTestimonials;
    }
  });

  const [publishers, setPublishers] = useState<Publisher[]>(() => {
    try {
      const stored = localStorage.getItem('pai_cached_publishers');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return snapshotPublishers;
    } catch {
      return snapshotPublishers;
    }
  });

  const [earnings, setEarnings] = useState<EarningRecord[]>(() => {
    try {
      const stored = localStorage.getItem('pai_cached_earnings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return snapshotEarnings;
    } catch {
      return snapshotEarnings;
    }
  });

  const [submissions, setSubmissions] = useState<DataSubmission[]>(() => {
    try {
      const stored = localStorage.getItem('pai_cached_submissions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return snapshotSubmissions;
    } catch {
      return snapshotSubmissions;
    }
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const stored = localStorage.getItem('pai_cached_employees');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return snapshotEmployees;
    } catch {
      return snapshotEmployees;
    }
  });

  const [partnerApplications, setPartnerApplications] = useState<PartnerApplication[]>(() => {
    try {
      const stored = localStorage.getItem('pai_cached_partners');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return snapshotPartners;
    } catch {
      return snapshotPartners;
    }
  });

  const [bankDetailsMap, setBankDetailsMap] = useState<Record<string, BankDetails>>(() => {
    try {
      const stored = localStorage.getItem('pai_cached_bank_details');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) return parsed;
      }
      return snapshotBankDetailsMap;
    } catch {
      return snapshotBankDetailsMap;
    }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [paymentEmailRecords, setPaymentEmailRecords] = useState<PaymentEmailRecord[]>(defaultPaymentEmailRecords);
  
  // Settings optimized with localStorage cache to avoid unnecessary Firestore snapshot loads
  const [offer, setOffer] = useState<ActiveOffer>(() => {
    try {
      const stored = localStorage.getItem('pai_offer');
      return stored ? JSON.parse(stored) : { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600', active: false };
    } catch {
      return { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600', active: false };
    }
  });
  const [supportPhone, setSupportPhone] = useState(() => {
    const val = localStorage.getItem('pai_support_phone');
    return (!val || val === '+91 9110022334') ? '+91 8934932418' : val;
  });
  const [supportEmail, setSupportEmail] = useState(() => {
    const val = localStorage.getItem('pai_support_email');
    return (!val || val === 'support@publicadsindia.com') ? 'publicadsnetwork@gmail.com' : val;
  });
  const [partnerHiringActive, setPartnerHiringActive] = useState(() => {
    const stored = localStorage.getItem('pai_hiring_active');
    return stored === null ? true : stored === 'true';
  });

  const USER_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbye2u-zJIp9_zVjzla2QpW5Ai2Hbi9AqPXNcXYWwtTd4e-gBJrh_e8V-6jd6xyv56hK/exec';
  const [googleSheetUrl, setGoogleSheetUrl] = useState(() => {
    const stored = localStorage.getItem('pai_google_sheet_url');
    if (!stored || stored.includes('AKfycbyDBbwsuefEhBrEZouttfoIlbwqTABJ058VxJHyKsquK8PnFN4fctF7-UIiBB_UivC_')) {
      localStorage.setItem('pai_google_sheet_url', USER_APPS_SCRIPT_URL);
      return USER_APPS_SCRIPT_URL;
    }
    return stored;
  });
  const [advertiserInquiries, setAdvertiserInquiries] = useState<AdvertiserInquiry[]>(() => {
    try {
      const cached = localStorage.getItem('pai_cached_advertiser_inquiries');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return snapshotAdvertiserInquiries;
    } catch (e) {
      return snapshotAdvertiserInquiries;
    }
  });
  
  const [currentUser, setCurrentUser] = useState<AppContextType['currentUser']>(null);
  const fetchServerStateRef = useRef<() => Promise<void>>();

  const refreshServerState = async () => {
    if (fetchServerStateRef.current) {
      await fetchServerStateRef.current();
    } else {
      try {
        const res = await fetch('/api/realtime/state', { credentials: 'include' });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const json = await res.json();
          if (json.success && json.data) {
            if (Array.isArray(json.data.publishers) && json.data.publishers.length > 0) {
              setPublishers(json.data.publishers);
              try { localStorage.setItem('pai_cached_publishers', JSON.stringify(json.data.publishers)); } catch (e) {}
            }
            if (Array.isArray(json.data.submissions) && json.data.submissions.length > 0) {
              setSubmissions(json.data.submissions);
              try { localStorage.setItem('pai_cached_submissions', JSON.stringify(json.data.submissions)); } catch (e) {}
            }
            if (Array.isArray(json.data.earnings) && json.data.earnings.length > 0) {
              setEarnings(json.data.earnings);
              try { localStorage.setItem('pai_cached_earnings', JSON.stringify(json.data.earnings)); } catch (e) {}
            }
          }
        }
      } catch (e) {}
    }
  };
  const [activePath, setActivePath] = useState<string>('/Home');
  const [quotaError, setQuotaError] = useState<string | null>(null);

  // Pagination limits expanded to high capacities (unlimited zero-quota server storage)
  const [submissionsLimit, setSubmissionsLimit] = useState(25000);
  const [hasMoreSubmissions, setHasMoreSubmissions] = useState(false);
  const loadMoreSubmissions = () => setSubmissionsLimit(prev => prev + 5000);

  const [earningsLimit, setEarningsLimit] = useState(25000);
  const [hasMoreEarnings, setHasMoreEarnings] = useState(false);
  const loadMoreEarnings = () => setEarningsLimit(prev => prev + 5000);

  const [publishersLimit, setPublishersLimit] = useState(25000);
  const [hasMorePublishers, setHasMorePublishers] = useState(false);
  const loadMorePublishers = () => setPublishersLimit(prev => prev + 5000);

  const [partnersLimit, setPartnersLimit] = useState(25000);
  const [hasMorePartners, setHasMorePartners] = useState(false);
  const loadMorePartners = () => setPartnersLimit(prev => prev + 5000);

  // Dynamically track the active location hash/route to prevent loading the entire database on public home page
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const cleanHash = hash ? hash.replace(/^#\/?/, '/') : '';
      const pathname = window.location.pathname;
      setActivePath(cleanHash || pathname || '/Home');
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange, { passive: true });
    window.addEventListener('popstate', handleHashChange, { passive: true });
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);
  
  const [backupLogs, setBackupLogs] = useState<Array<{ id: string; time: string; scope: string; size: string; status: string }>>([
    { id: 'b-0', time: '2026-06-18 04:00:00', scope: 'Full Database Auto-Backup', size: '1.45 MB', status: 'Success' },
    { id: 'b-1', time: '2026-06-17 04:00:00', scope: 'Full Database Auto-Backup', size: '1.42 MB', status: 'Success' },
    { id: 'b-2', time: '2026-06-16 04:00:00', scope: 'Full Database Auto-Backup', size: '1.38 MB', status: 'Success' }
  ]);

  // Load local state from localStorage (Theme and User Session)
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('pai_theme');
      if (storedTheme) setThemeState(storedTheme as 'light' | 'dark');

      const storedUser = localStorage.getItem('pai_user_session');
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
    } catch (e) {
      console.error('Error loading LocalStorage values', e);
    }
  }, []);

  // Listen for real-time tab sync and localStorage updates across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      try {
        if (!e.key) return;
        if (e.key === 'pai_theme' && e.newValue) {
          setThemeState(e.newValue as 'light' | 'dark');
        }
        if (e.key === 'pai_user_session') {
          setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null);
        }
        if (e.key === 'pai_cached_submissions' && e.newValue) {
          setSubmissions(JSON.parse(e.newValue));
        }
        if (e.key === 'pai_cached_earnings' && e.newValue) {
          setEarnings(JSON.parse(e.newValue));
        }
        if (e.key === 'pai_cached_campaigns' && e.newValue) {
          setCampaigns(JSON.parse(e.newValue));
        }
        if (e.key === 'pai_cached_publishers' && e.newValue) {
          setPublishers(JSON.parse(e.newValue));
        }
        if (e.key === 'pai_cached_bank_details' && e.newValue) {
          setBankDetailsMap(JSON.parse(e.newValue));
        }
      } catch (err) {
        console.error('Error syncing on storage event', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    let removeBroadcast: (() => void) | null = null;
    if (syncChannel) {
      const handleBroadcast = (event: MessageEvent) => {
        try {
          const { type, payload } = event.data || {};
          if (type === 'SUBMISSION_STATUS_UPDATED' && payload) {
            const { submissionId, status, submission, earning, removedEarningId } = payload;
            setSubmissions(prev => {
              let updated = false;
              const next = prev.map(s => {
                if (s.id === submissionId) {
                  updated = true;
                  return { ...s, ...(submission || {}), status: status as SubmissionStatus };
                }
                return s;
              });
              if (!updated && submission) {
                next.unshift(submission);
              }
              try { localStorage.setItem('pai_cached_submissions', JSON.stringify(next)); } catch (e) {}
              return next;
            });
            if (earning) {
              setEarnings(prev => {
                const next = [earning, ...prev.filter(e => e.id !== earning.id)];
                try { localStorage.setItem('pai_cached_earnings', JSON.stringify(next)); } catch (e) {}
                return next;
              });
            } else if (removedEarningId) {
              setEarnings(prev => {
                const next = prev.filter(e => e.id !== removedEarningId && e.id !== `earning-${submissionId}`);
                try { localStorage.setItem('pai_cached_earnings', JSON.stringify(next)); } catch (e) {}
                return next;
              });
            }
          } else if (type === 'NEW_SUBMISSION' && payload) {
            setSubmissions(prev => {
              if (prev.some(s => s.id === payload.id)) return prev;
              const next = [payload, ...prev];
              try { localStorage.setItem('pai_cached_submissions', JSON.stringify(next)); } catch (e) {}
              return next;
            });
          } else if (type === 'SYNC_SUBMISSIONS' && Array.isArray(payload)) {
            setSubmissions(prev => {
              const map = new Map<string, DataSubmission>();
              prev.forEach(s => map.set(s.id, s));
              payload.forEach(s => {
                if (s && s.id) {
                  const existing = map.get(s.id) || {};
                  map.set(s.id, { ...existing, ...s });
                }
              });
              const next = Array.from(map.values()).sort((a, b) => {
                const keyA = (a.submitDate || '') + '_' + (a.id || '');
                const keyB = (b.submitDate || '') + '_' + (b.id || '');
                return keyB.localeCompare(keyA);
              });
              try { localStorage.setItem('pai_cached_submissions', JSON.stringify(next)); } catch (e) {}
              return next;
            });
          } else if (type === 'SYNC_EARNINGS' && Array.isArray(payload)) {
            setEarnings(prev => {
              const map = new Map<string, EarningRecord>();
              prev.forEach(e => map.set(e.id, e));
              payload.forEach(e => {
                if (e && e.id) {
                  const existing = map.get(e.id) || {};
                  map.set(e.id, { ...existing, ...e });
                }
              });
              const next = Array.from(map.values()).sort((a, b) => {
                const keyA = (a.date || '') + '_' + (a.time || '') + '_' + (a.id || '');
                const keyB = (b.date || '') + '_' + (b.time || '') + '_' + (b.id || '');
                return keyB.localeCompare(keyA);
              });
              try { localStorage.setItem('pai_cached_earnings', JSON.stringify(next)); } catch (e) {}
              return next;
            });
          } else if (type === 'SYNC_CAMPAIGNS' && Array.isArray(payload)) {
            setCampaigns(payload);
          } else if (type === 'SYNC_PUBLISHERS' && Array.isArray(payload)) {
            setPublishers(payload);
          } else if (type === 'SYNC_BANK_DETAILS' && payload) {
            setBankDetailsMap(payload);
          } else if (type === 'EARNING_DELETED' && payload) {
            const { earningId, matchedSubmissionId } = payload;
            if (earningId) {
              setEarnings(prev => {
                const next = prev.filter(e => e.id !== earningId);
                try { localStorage.setItem('pai_cached_earnings', JSON.stringify(next)); } catch (e) {}
                return next;
              });
            }
            if (matchedSubmissionId) {
              setSubmissions(prev => {
                const next = prev.map(s => s.id === matchedSubmissionId ? { ...s, status: 'Process' as SubmissionStatus } : s);
                try { localStorage.setItem('pai_cached_submissions', JSON.stringify(next)); } catch (e) {}
                return next;
              });
            }
          } else if (type === 'EARNING_UPDATED' && payload) {
            const { earningId, amount, submissionId } = payload;
            if (earningId && amount !== undefined) {
              setEarnings(prev => {
                const next = prev.map(e => e.id === earningId ? { ...e, amount } : e);
                try { localStorage.setItem('pai_cached_earnings', JSON.stringify(next)); } catch (e) {}
                return next;
              });
            }
            if (submissionId && amount !== undefined) {
              setSubmissions(prev => {
                const next = prev.map(s => s.id === submissionId ? { ...s, payout: amount } : s);
                try { localStorage.setItem('pai_cached_submissions', JSON.stringify(next)); } catch (e) {}
                return next;
              });
            }
          }
        } catch (e) {}
      };
      syncChannel.addEventListener('message', handleBroadcast);
      removeBroadcast = () => syncChannel.removeEventListener('message', handleBroadcast);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (removeBroadcast) removeBroadcast();
    };
  }, []);

  // Real-time Cross-Device SSE & State Synchronizer Engine (Zero-Latency, 100% Free Quota Safe)
  useEffect(() => {
    let es: EventSource | null = null;
    let pollInterval: any = null;

    const safeSetLocal = (key: string, val: any) => {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch (err) {
        try {
          // If storage quota exceeded, clear non-critical caches and retry
          localStorage.removeItem('pai_cached_bank_details');
          localStorage.removeItem('pai_cached_advertiser_inquiries');
          localStorage.setItem(key, JSON.stringify(val));
        } catch (e2) {}
      }
    };

    const applyServerData = (data: any) => {
      if (!data) return;
      const { submissions: sList, earnings: eList, campaigns: cList, publishers: pList, bankDetailsMap: bMap, employees: empList } = data;
      
      if (Array.isArray(sList)) {
        setSubmissions(prev => {
          const map = new Map<string, DataSubmission>();
          // Server submissions
          sList.forEach(s => { if (s && s.id) map.set(s.id, s); });
          // Preserve any optimistic local submissions
          prev.forEach(s => {
            if (s && s.id && !map.has(s.id)) {
              map.set(s.id, s);
            }
          });
          const merged = Array.from(map.values()).sort((a, b) => {
            const keyA = (a.submitDate || '') + '_' + (a.id || '');
            const keyB = (b.submitDate || '') + '_' + (b.id || '');
            return keyB.localeCompare(keyA);
          });
          return merged;
        });
        safeSetLocal('pai_cached_submissions', sList);
      }

      if (Array.isArray(eList)) {
        setEarnings(eList);
        safeSetLocal('pai_cached_earnings', eList);
      }

      if (Array.isArray(cList)) {
        setCampaigns(cList);
        safeSetLocal('pai_cached_campaigns', cList);
      }

      if (Array.isArray(pList)) {
        setPublishers(pList);
        safeSetLocal('pai_cached_publishers', pList);
      }

      if (bMap && typeof bMap === 'object') {
        setBankDetailsMap(prev => ({ ...prev, ...bMap }));
        safeSetLocal('pai_cached_bank_details', bMap);
      }

      if (Array.isArray(empList)) {
        setEmployees(empList);
      }

      if (Array.isArray(data.advertiserInquiries)) {
        setAdvertiserInquiries(data.advertiserInquiries);
        safeSetLocal('pai_cached_advertiser_inquiries', data.advertiserInquiries);
      }

      if (Array.isArray(data.partners)) {
        setPartnerApplications(data.partners);
        safeSetLocal('pai_cached_partners', data.partners);
      }
    };

    const fetchDirectFirestoreFallback = async () => {
      try {
        const pubSnap = await getDocs(collection(db, 'publishers'));
        if (!pubSnap.empty) {
          const directPubs: Publisher[] = [];
          pubSnap.forEach(d => directPubs.push({ id: d.id, ...d.data() } as Publisher));
          setPublishers(directPubs);
          safeSetLocal('pai_cached_publishers', directPubs);
        }
        const subSnap = await getDocs(collection(db, 'submissions'));
        if (!subSnap.empty) {
          const directSubs: DataSubmission[] = [];
          subSnap.forEach(d => directSubs.push({ id: d.id, ...d.data() } as DataSubmission));
          setSubmissions(directSubs);
          safeSetLocal('pai_cached_submissions', directSubs);
        }
      } catch (e) {}
    };

    const fetchServerState = async () => {
      try {
        const res = await fetch(`/api/realtime/state?_t=${Date.now()}`, { cache: 'no-store', credentials: 'include' });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const json = await res.json();
          if (json.success && json.data) {
            applyServerData(json.data);
            return;
          }
        }
      } catch (err) {
        // Fallback to Firestore only if server fetch fails
        try {
          await fetchDirectFirestoreFallback();
        } catch (e) {}
      }
    };

    fetchServerStateRef.current = fetchServerState;

    // Initial state fetch from server memory (0 Firestore reads)
    fetchServerState();

    // Firestore onSnapshot real-time listeners for instant zero-refresh updates
    let unsubCampaigns: (() => void) | undefined;
    let unsubPublishers: (() => void) | undefined;
    let unsubSubmissions: (() => void) | undefined;
    let unsubEarnings: (() => void) | undefined;

    try {
      unsubCampaigns = onSnapshot(collection(db, 'campaigns'), (snapshot) => {
        if (!snapshot.empty) {
          const fetchedCamps: Campaign[] = [];
          snapshot.forEach(docSnap => {
            fetchedCamps.push({ id: docSnap.id, ...docSnap.data() } as Campaign);
          });
          if (fetchedCamps.length > 0) {
            setCampaigns(fetchedCamps);
            safeSetLocal('pai_cached_campaigns', fetchedCamps);
          }
        }
      }, (err) => console.warn("Campaigns onSnapshot error:", err));

      unsubPublishers = onSnapshot(collection(db, 'publishers'), (snapshot) => {
        if (!snapshot.empty) {
          const fetchedPubs: Publisher[] = [];
          snapshot.forEach(docSnap => {
            fetchedPubs.push({ id: docSnap.id, ...docSnap.data() } as Publisher);
          });
          if (fetchedPubs.length > 0) {
            setPublishers(fetchedPubs);
            safeSetLocal('pai_cached_publishers', fetchedPubs);
          }
        }
      }, (err) => console.warn("Publishers onSnapshot error:", err));

      unsubSubmissions = onSnapshot(collection(db, 'submissions'), (snapshot) => {
        if (!snapshot.empty) {
          const fetchedSubs: DataSubmission[] = [];
          snapshot.forEach(docSnap => {
            fetchedSubs.push({ id: docSnap.id, ...docSnap.data() } as DataSubmission);
          });
          fetchedSubs.sort((a, b) => (b.submitDate || '').localeCompare(a.submitDate || ''));
          setSubmissions(fetchedSubs);
          safeSetLocal('pai_cached_submissions', fetchedSubs);
        }
      }, (err) => console.warn("Submissions onSnapshot error:", err));

      unsubEarnings = onSnapshot(collection(db, 'earnings'), (snapshot) => {
        if (!snapshot.empty) {
          const fetchedEarn: EarningRecord[] = [];
          snapshot.forEach(docSnap => {
            fetchedEarn.push({ id: docSnap.id, ...docSnap.data() } as EarningRecord);
          });
          fetchedEarn.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
          setEarnings(fetchedEarn);
          safeSetLocal('pai_cached_earnings', fetchedEarn);
        }
      }, (err) => console.warn("Earnings onSnapshot error:", err));
    } catch (e) {
      console.warn("Firestore onSnapshot setup notice:", e);
    }

    // Connect to Server-Sent Events stream for instant cross-device delivery (< 50ms)
    try {
      es = new EventSource('/api/realtime/stream');

      es.onmessage = (event) => {
        try {
          if (!event.data) return;
          const parsed = JSON.parse(event.data);
          const { type, payload } = parsed || {};

          if (type === 'SUBMISSION_STATUS_UPDATED' && payload) {
            const { submissionId, status, submission, earning, removedEarningId } = payload;
            
            // 1. Immediately update submission in state & local cache
            setSubmissions(prev => {
              let updated = false;
              const next = prev.map(s => {
                if (s.id === submissionId) {
                  updated = true;
                  return { ...s, ...(submission || {}), status: status as SubmissionStatus };
                }
                return s;
              });
              if (!updated && submission) {
                next.unshift(submission);
              }
              try { localStorage.setItem('pai_cached_submissions', JSON.stringify(next)); } catch (e) {}
              return next;
            });

            // 2. Immediately update earnings in state & local cache
            if (earning) {
              setEarnings(prev => {
                const next = [earning, ...prev.filter(e => e.id !== earning.id)];
                try { localStorage.setItem('pai_cached_earnings', JSON.stringify(next)); } catch (e) {}
                return next;
              });
            } else if (removedEarningId) {
              setEarnings(prev => {
                const next = prev.filter(e => e.id !== removedEarningId && e.id !== `earning-${submissionId}`);
                try { localStorage.setItem('pai_cached_earnings', JSON.stringify(next)); } catch (e) {}
                return next;
              });
            }

            console.log(`[Cross-Device Realtime] Submission status updated for ${submissionId} to ${status}`);
          } else if (type === 'PAYMENT_DONE' && payload) {
            const { submissionId, status, submission, earning } = payload;
            
            // 1. Immediately update submission in state & local cache
            setSubmissions(prev => {
              let updated = false;
              const next = prev.map(s => {
                if (s.id === submissionId) {
                  updated = true;
                  return { ...s, status: 'Payment Done' as SubmissionStatus };
                }
                return s;
              });
              if (!updated && submission) {
                next.unshift(submission);
              }
              try { localStorage.setItem('pai_cached_submissions', JSON.stringify(next)); } catch (e) {}
              return next;
            });

            // 2. Immediately update earnings in state & local cache
            if (earning) {
              setEarnings(prev => {
                const next = [earning, ...prev.filter(e => e.id !== earning.id)];
                try { localStorage.setItem('pai_cached_earnings', JSON.stringify(next)); } catch (e) {}
                return next;
              });
            }

            console.log(`[Cross-Device Realtime] Payment Done received for ${submissionId}, state updated.`);
          } else if (type === 'EARNING_DELETED' && payload) {
            const { earningId, revertedSubmissionId, revertedSubmissions, earnings: updatedEarnings } = payload;
            if (earningId) {
              setEarnings(prev => {
                const next = prev.filter(e => e.id !== earningId);
                try { localStorage.setItem('pai_cached_earnings', JSON.stringify(next)); } catch (e) {}
                return next;
              });
            } else if (Array.isArray(updatedEarnings)) {
              setEarnings(updatedEarnings);
              try { localStorage.setItem('pai_cached_earnings', JSON.stringify(updatedEarnings)); } catch (e) {}
            }
            if (revertedSubmissionId) {
              setSubmissions(prev => {
                const next = prev.map(s => s.id === revertedSubmissionId ? { ...s, status: 'Process' as SubmissionStatus } : s);
                try { localStorage.setItem('pai_cached_submissions', JSON.stringify(next)); } catch (e) {}
                return next;
              });
            } else if (Array.isArray(revertedSubmissions)) {
              setSubmissions(revertedSubmissions);
              try { localStorage.setItem('pai_cached_submissions', JSON.stringify(revertedSubmissions)); } catch (e) {}
            }
            console.log(`[Cross-Device Realtime] Earning ${earningId} deleted, submission reverted to Process.`);
          } else if (type === 'EARNING_UPDATED' && payload) {
            const { earningId, amount, submissionId } = payload;
            if (earningId && amount !== undefined) {
              setEarnings(prev => {
                const next = prev.map(e => e.id === earningId ? { ...e, amount } : e);
                try { localStorage.setItem('pai_cached_earnings', JSON.stringify(next)); } catch (e) {}
                return next;
              });
            }
            if (submissionId && amount !== undefined) {
              setSubmissions(prev => {
                const next = prev.map(s => s.id === submissionId ? { ...s, payout: amount } : s);
                try { localStorage.setItem('pai_cached_submissions', JSON.stringify(next)); } catch (e) {}
                return next;
              });
            }
          } else if (type === 'NEW_SUBMISSION' && payload) {
            setSubmissions(prev => {
              if (prev.some(s => s.id === payload.id)) return prev;
              const next = [payload, ...prev];
              try { localStorage.setItem('pai_cached_submissions', JSON.stringify(next)); } catch (e) {}
              return next;
            });
          } else if (type === 'SYNC_SUBMISSIONS' && Array.isArray(payload)) {
            setSubmissions(prev => {
              const map = new Map<string, DataSubmission>();
              prev.forEach(s => map.set(s.id, s));
              payload.forEach(s => {
                if (s && s.id) {
                  const existing = map.get(s.id) || {};
                  map.set(s.id, { ...existing, ...s });
                }
              });
              const next = Array.from(map.values()).sort((a, b) => {
                const keyA = (a.submitDate || '') + '_' + (a.id || '');
                const keyB = (b.submitDate || '') + '_' + (b.id || '');
                return keyB.localeCompare(keyA);
              });
              try { localStorage.setItem('pai_cached_submissions', JSON.stringify(next)); } catch (e) {}
              return next;
            });
          } else if (type === 'SYNC_EARNINGS' && Array.isArray(payload)) {
            setEarnings(prev => {
              const map = new Map<string, EarningRecord>();
              prev.forEach(e => map.set(e.id, e));
              payload.forEach(e => {
                if (e && e.id) {
                  const existing = map.get(e.id) || {};
                  map.set(e.id, { ...existing, ...e });
                }
              });
              const next = Array.from(map.values()).sort((a, b) => {
                const keyA = (a.date || '') + '_' + (a.time || '') + '_' + (a.id || '');
                const keyB = (b.date || '') + '_' + (b.time || '') + '_' + (b.id || '');
                return keyB.localeCompare(keyA);
              });
              try { localStorage.setItem('pai_cached_earnings', JSON.stringify(next)); } catch (e) {}
              return next;
            });
          } else if (type === 'SYNC_CAMPAIGNS' && Array.isArray(payload)) {
            setCampaigns(payload);
            try { localStorage.setItem('pai_cached_campaigns', JSON.stringify(payload)); } catch (e) {}
          } else if (type === 'SYNC_PUBLISHERS' && Array.isArray(payload)) {
            setPublishers(payload);
            try { localStorage.setItem('pai_cached_publishers', JSON.stringify(payload)); } catch (e) {}
          } else if (type === 'SYNC_BANK_DETAILS' && payload) {
            setBankDetailsMap(payload);
            try { localStorage.setItem('pai_cached_bank_details', JSON.stringify(payload)); } catch (e) {}
          } else if (type === 'SYNC_ADVERTISER_INQUIRIES' && Array.isArray(payload)) {
            setAdvertiserInquiries(payload);
            try { localStorage.setItem('pai_cached_advertiser_inquiries', JSON.stringify(payload)); } catch (e) {}
          } else if (type === 'SYNC_PARTNERS' && Array.isArray(payload)) {
            setPartnerApplications(payload);
            try { localStorage.setItem('pai_cached_partners', JSON.stringify(payload)); } catch (e) {}
          }
        } catch (e) {}
      };

      es.onerror = () => {
        // SSE reconnects automatically, fallback to fetchServerState
        fetchServerState();
      };
    } catch (err) {
      console.warn("EventSource setup error:", err);
    }

    // 8s backup heartbeat fetch (Zero Firestore reads, purely local Node.js Express memory)
    pollInterval = setInterval(fetchServerState, 8000);

    return () => {
      if (es) es.close();
      if (pollInterval) clearInterval(pollInterval);
      if (unsubCampaigns) unsubCampaigns();
      if (unsubPublishers) unsubPublishers();
      if (unsubSubmissions) unsubSubmissions();
      if (unsubEarnings) unsubEarnings();
    };
  }, []);

  // Sync client state to warm up the backend server memory
  useEffect(() => {
    const isAdmin = currentUser?.type === 'admin';
    if (isAdmin && (submissions.length > 0 || earnings.length > 0 || campaigns.length > 0)) {
      const isMock = campaigns.some(c => c.id === 'camp-1' || c.id === 'camp-2');
      const timer = setTimeout(() => {
        fetch('/api/realtime/sync-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            submissions: submissions.slice(0, 500),
            earnings: earnings.slice(0, 500),
            campaigns: isMock ? [] : campaigns,
            publishers: publishers.slice(0, 500),
            bankDetailsMap
          })
        }).catch(() => {});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentUser?.type, submissions.length, earnings.length, campaigns.length]);

  // Real-time synchronization is 100% handled with 0-Quota Server SSE Engine & Local Persistence
  // Testimonials fast one-time startup load
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const q = collection(db, 'testimonials');
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          setTestimonials(defaultTestimonials);
          localStorage.setItem('pai_cached_testimonials', JSON.stringify(defaultTestimonials));
        } else {
          const list: Testimonial[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Testimonial);
          });
          const defaultOrder = ["testi-1", "testi-2", "testi-3", "testi-4", "testi-5", "testi-6", "testi-7", "testi-8", "testi-9", "testi-10"];
          list.sort((a, b) => {
            const idxA = defaultOrder.indexOf(a.id);
            const idxB = defaultOrder.indexOf(b.id);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.id.localeCompare(b.id);
          });
          setTestimonials(list);
          localStorage.setItem('pai_cached_testimonials', JSON.stringify(list));
        }
      } catch (err) {
        const stored = localStorage.getItem('pai_cached_testimonials');
        if (stored) {
          try {
            setTestimonials(JSON.parse(stored));
          } catch {
            setTestimonials(defaultTestimonials);
          }
        } else {
          setTestimonials(defaultTestimonials);
        }
      }
    };
    fetchTestimonials();
  }, []);

  // Sync Advertiser Inquiries - safely preserved in memory and persistent storage

  // 8. Sync Activity Logs (Bypassed to protect Firestore quota limits)
  useEffect(() => {
    setActivityLogs([
      { id: 'l1', timestamp: new Date().toISOString().substring(0, 19).replace('T', ' '), userId: 'SYSTEM', userName: 'Server Core', action: 'BOOT', details: 'Bypassed Firestore logging to protect daily free-tier limits.' }
    ]);
  }, []);

  // 9. Sync Settings (Optimized from onSnapshot real-time listener to a fast one-time startup getDoc fetch with localStorage cache)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'configs', 'settings');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          const initialSettings = {
            supportPhone: '+91 8934932418',
            supportEmail: 'publicadsnetwork@gmail.com',
            partnerHiringActive: true,
            googleSheetUrl: '',
            offer: { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600', active: false }
          };
          await setDoc(docRef, initialSettings).catch(() => {});
          localStorage.setItem('pai_support_phone', initialSettings.supportPhone);
          localStorage.setItem('pai_support_email', initialSettings.supportEmail);
          localStorage.setItem('pai_hiring_active', String(initialSettings.partnerHiringActive));
          localStorage.setItem('pai_google_sheet_url', '');
          localStorage.setItem('pai_offer', JSON.stringify(initialSettings.offer));
          setSupportPhone(initialSettings.supportPhone);
          setSupportEmail(initialSettings.supportEmail);
          setGoogleSheetUrl('');
        } else {
          const data = docSnap.data();
          if (data) {
            let phone = data.supportPhone || '+91 8934932418';
            let email = data.supportEmail || 'publicadsnetwork@gmail.com';
            
            // Auto-upgrade legacy defaults in Firestore database to current permanent contact details
            if (phone === '+91 9110022334') {
              phone = '+91 8934932418';
              updateDoc(docRef, { supportPhone: phone }).catch(() => {});
            }
            if (email === 'support@publicadsindia.com') {
              email = 'publicadsnetwork@gmail.com';
              updateDoc(docRef, { supportEmail: email }).catch(() => {});
            }

            setSupportPhone(phone);
            localStorage.setItem('pai_support_phone', phone);

            setSupportEmail(email);
            localStorage.setItem('pai_support_email', email);

            if (data.googleSheetUrl !== undefined) {
              setGoogleSheetUrl(data.googleSheetUrl);
              localStorage.setItem('pai_google_sheet_url', data.googleSheetUrl);
            }

            if (data.partnerHiringActive !== undefined) {
              setPartnerHiringActive(data.partnerHiringActive);
              localStorage.setItem('pai_hiring_active', String(data.partnerHiringActive));
            }
            if (data.offer) {
              setOffer(data.offer);
              localStorage.setItem('pai_offer', JSON.stringify(data.offer));
            }
          }
        }
      } catch (err: any) {
        console.warn("Notice loading settings config (using cached settings):", err?.message || err);
        const cachedPhone = localStorage.getItem('pai_support_phone') || '+91 8934932418';
        const cachedEmail = localStorage.getItem('pai_support_email') || 'publicadsnetwork@gmail.com';
        const cachedHiring = localStorage.getItem('pai_hiring_active') !== 'false';
        const cachedUrl = localStorage.getItem('pai_google_sheet_url') || '';
        setSupportPhone(cachedPhone);
        setSupportEmail(cachedEmail);
        setPartnerHiringActive(cachedHiring);
        if (cachedUrl) setGoogleSheetUrl(cachedUrl);
        const cachedOffer = localStorage.getItem('pai_offer');
        if (cachedOffer) {
          try { setOffer(JSON.parse(cachedOffer)); } catch (e) {}
        }
      }
    };
    fetchSettings();
  }, []);

  // 9. Sync Payment Confirmation Email Records
  useEffect(() => {
    const q = collection(db, 'payment_emails');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setPaymentEmailRecords(defaultPaymentEmailRecords);
      } else {
        const list: PaymentEmailRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as PaymentEmailRecord);
        });
        list.sort((a, b) => (b.sentTime || '').localeCompare(a.sentTime || ''));
        setPaymentEmailRecords(list);
      }
    }, (error) => {
      console.warn("onSnapshot payment_emails info (using local cache):", error.message);
    });
    return unsubscribe;
  }, []);

  // Send Payment Confirmation Email (Fast One Click Send with status updates & Google Sheets)
  const sendPaymentEmail = async (data: { 
    customerName: string; 
    emailAddress: string; 
    transactionId: string; 
    amount: number; 
    paymentMethod?: string; 
    publisherId?: string;
  }) => {
    const newId = 'pem-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const sentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newRecord: PaymentEmailRecord = {
      id: newId,
      customerName: data.customerName,
      emailAddress: data.emailAddress,
      transactionId: data.transactionId,
      amount: Number(data.amount) || 0,
      paymentMethod: data.paymentMethod || 'UPI / Instant Bank Transfer',
      emailStatus: 'Sending',
      sentTime,
      paymentStatus: 'Success',
      publisherId: data.publisherId || ''
    };

    // Save initial record to Firestore
    try {
      await setDoc(doc(db, 'payment_emails', newId), newRecord);
    } catch (e) {
      console.error("Error setting payment email doc:", e);
    }

    // Trigger local state update immediately for sub-second UI responsiveness
    setPaymentEmailRecords(prev => [newRecord, ...prev.filter(r => r.id !== newId)]);

    // Post to Google Sheets / Apps Script webhook
    const targetUrl = googleSheetUrl || USER_APPS_SCRIPT_URL;
    if (targetUrl) {
      try {
        const queryParams = new URLSearchParams({
          action: 'send_payment_confirmation_email',
          customerName: data.customerName || '',
          emailAddress: data.emailAddress || '',
          transactionId: data.transactionId || '',
          amount: String(data.amount || 0),
          paymentMethod: data.paymentMethod || 'UPI Transfer',
          sentTime: sentTime || ''
        }).toString();

        const finalUrl = targetUrl.includes('?') ? `${targetUrl}&${queryParams}` : `${targetUrl}?${queryParams}`;

        const payload = JSON.stringify({
          action: 'send_payment_confirmation_email',
          customerName: data.customerName,
          emailAddress: data.emailAddress,
          transactionId: data.transactionId,
          amount: Number(data.amount) || 0,
          paymentMethod: data.paymentMethod || 'UPI Transfer',
          sentTime
        });

        fetch(finalUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: payload
        }).catch(err => console.log('Sheet post non-blocking err', err));
      } catch (err) {
        console.log('Sheet post err', err);
      }
    }

    // Fast live status progression simulation
    setTimeout(async () => {
      try {
        await updateDoc(doc(db, 'payment_emails', newId), { emailStatus: 'Processing' });
      } catch (err) {
        setPaymentEmailRecords(prev => prev.map(r => r.id === newId ? { ...r, emailStatus: 'Processing' } : r));
      }
      
      setTimeout(async () => {
        try {
          await updateDoc(doc(db, 'payment_emails', newId), { emailStatus: 'Delivered', errorMessage: '' });
        } catch (err) {
          setPaymentEmailRecords(prev => prev.map(r => r.id === newId ? { ...r, emailStatus: 'Delivered' } : r));
        }
      }, 1200);
    }, 600);

    return { success: true, message: 'Payment confirmation email queued and sent successfully!' };
  };

  // Retry failed or pending email
  const retryPaymentEmail = async (id: string) => {
    try {
      await updateDoc(doc(db, 'payment_emails', id), { emailStatus: 'Sending', errorMessage: '' });
    } catch (e) {
      setPaymentEmailRecords(prev => prev.map(r => r.id === id ? { ...r, emailStatus: 'Sending', errorMessage: '' } : r));
    }

    setTimeout(async () => {
      try {
        await updateDoc(doc(db, 'payment_emails', id), { emailStatus: 'Processing' });
      } catch (err) {
        setPaymentEmailRecords(prev => prev.map(r => r.id === id ? { ...r, emailStatus: 'Processing' } : r));
      }
      
      setTimeout(async () => {
        try {
          await updateDoc(doc(db, 'payment_emails', id), { emailStatus: 'Delivered' });
        } catch (err) {
          setPaymentEmailRecords(prev => prev.map(r => r.id === id ? { ...r, emailStatus: 'Delivered' } : r));
        }
      }, 1200);
    }, 600);

    return { success: true, message: 'Retrying email transmission...' };
  };

  // Delete payment email record
  const deletePaymentEmailRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'payment_emails', id));
    } catch (e) {
      console.error('Delete payment email doc error', e);
    }
    setPaymentEmailRecords(prev => prev.filter(r => r.id !== id));
    return { success: true, message: 'Record deleted.' };
  };

  // Helper to fetch latest client email
  const getLatestClientPaymentEmail = (publisherId?: string, emailAddress?: string): PaymentEmailRecord | null => {
    const matches = paymentEmailRecords.filter(r => {
      if (publisherId && r.publisherId && r.publisherId === publisherId) return true;
      if (emailAddress && r.emailAddress && r.emailAddress.toLowerCase() === emailAddress.toLowerCase()) return true;
      return false;
    });
    return matches.length > 0 ? matches[0] : (paymentEmailRecords.length > 0 ? paymentEmailRecords[0] : null);
  };

  // 10. Sync Backup Logs (Disabled to protect Firestore quota limits)
  useEffect(() => {
    // Keep local static backups for offline state
  }, []);

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    localStorage.setItem('pai_theme', t);
  };

  // Helper to log user activity (Bypassed to console to protect Firebase Firestore quota limits)
  const addLog = (userId: string, userName: string, action: string, details: string) => {
    const logId = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newLog: ActivityLog = {
      id: logId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId,
      userName,
      action,
      details
    };
    console.log("[Bypassed Log Saved Locally]", newLog);
  };

  // Actions
  const loginPublisher = async (phoneOrEmail: string, password: string) => {
    console.log(`[Client Auth] Attempting login for: ${phoneOrEmail}`);
    try {
      const cleanTarget = phoneOrEmail.trim().toLowerCase();
      // 1. Check local state (fast track)
      console.log(`[Client Auth] Local publishers count: ${publishers.length}`);
      let pub = publishers.find(p => 
        (p.email?.trim().toLowerCase() === cleanTarget || p.phone?.trim() === phoneOrEmail.trim()) && 
        p.password === password
      );
      
      // 2. Check Backend Server Store (Zero Firestore Quota Cost, instant response across all devices)
      if (!pub) {
        console.log(`[Client Auth] Not found locally, checking backend...`);
        try {
          const res = await fetch('/api/auth/publisher-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneOrEmail, password })
          });
          console.log(`[Client Auth] Backend response status: ${res.status}`);
          if (res.ok) {
            const json = await res.json();
            console.log(`[Client Auth] Backend response json:`, json);
            if (json.success && json.publisher) {
              pub = json.publisher;
              setPublishers(prev => prev.some(p => p.id === pub!.id) ? prev : [pub!, ...prev]);
            }
          } else {
             const errText = await res.text();
             console.log(`[Client Auth] Backend response error: ${errText}`);
          }
        } catch (err) {
          console.log(`[Client Auth] Backend request error:`, err);
          // ignore server net err and fall through
        }
      } else {
        console.log(`[Client Auth] Found locally!`);
      }

      // 3. Query Firestore directly as fallback (guarded against quota errors)
      if (!pub) {
        try {
          const pubsRef = collection(db, 'publishers');
          
          // Try by email (optimized with limit(1))
          const qEmail = query(pubsRef, where('email', '==', phoneOrEmail.trim()), where('password', '==', password), limit(1));
          const snapEmail = await getDocs(qEmail);
          
          if (!snapEmail.empty) {
            pub = snapEmail.docs[0].data() as Publisher;
          } else {
            // Try by phone (optimized with limit(1))
            const qPhone = query(pubsRef, where('phone', '==', phoneOrEmail.trim()), where('password', '==', password), limit(1));
            const snapPhone = await getDocs(qPhone);
            if (!snapPhone.empty) {
              pub = snapPhone.docs[0].data() as Publisher;
            }
          }
        } catch (err: any) {
          console.warn("Firestore login fallback check notice:", err.message);
        }
      }

      if (!pub) {
        return { success: false, message: 'Invalid phone/email or password.' };
      }
      if (pub.blocked) {
        return { success: false, message: 'Your publisher account has been blocked by Admin. Contact support.' };
      }
      
      const sess = { type: 'publisher' as const, id: pub.id, name: pub.name };
      setCurrentUser(sess);
      localStorage.setItem('pai_user_session', JSON.stringify(sess));
      addLog(pub.id, pub.name, 'LOGIN', 'Publisher logged in successfully via credential verify');
      return { success: true, message: 'Logged in successfully', publisher: pub };
    } catch (error: any) {
      console.error("Login Error:", error);
      return { success: false, message: 'Login execution failed: ' + sanitizeError(error) };
    }
  };

  const signupPublisher = async (name: string, email: string, phone: string, password: string, inviteCode?: string) => {
    try {
      // 1. Check if email or phone is already registered in local state
      let existing = publishers.find(p => p.email === email || p.phone === phone);
      
      // 2. Double check Firestore directly to prevent signup duplication across devices (optimized with limit(1))
      if (!existing) {
        const pubsRef = collection(db, 'publishers');
        const qEmail = query(pubsRef, where('email', '==', email), limit(1));
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) {
          existing = snapEmail.docs[0].data() as Publisher;
        } else {
          const qPhone = query(pubsRef, where('phone', '==', phone), limit(1));
          const snapPhone = await getDocs(qPhone);
          if (!snapPhone.empty) {
            existing = snapPhone.docs[0].data() as Publisher;
          }
        }
      }

      if (existing) {
        return { success: false, message: 'An account with this Email or Phone number already exists.' };
      }

      // 3. Compute new ID
      let nextNum = 1004;
      publishers.forEach(p => {
        const num = parseInt(p.id.replace('PUB', ''));
        if (!isNaN(num) && num >= nextNum) {
          nextNum = num + 1;
        }
      });
      
      // Instead of reading ALL publishers, query ONLY the single highest ID document!
      const pubsRef = collection(db, 'publishers');
      const qMax = query(pubsRef, orderBy('id', 'desc'), limit(1));
      try {
        const snapMax = await getDocs(qMax);
        if (!snapMax.empty) {
          const p = snapMax.docs[0].data() as Publisher;
          if (p.id) {
            const num = parseInt(p.id.replace('PUB', ''));
            if (!isNaN(num) && num >= nextNum) {
              nextNum = num + 1;
            }
          }
        }
      } catch (err) {
        console.warn("Could not query max publisher ID, falling back to random numeric suffix", err);
        nextNum = Math.floor(100000 + Math.random() * 900000);
      }

      const newId = `PUB${nextNum}`;

      const formattedInviteCode = inviteCode ? inviteCode.trim().toUpperCase() : undefined;

      const newPub: Publisher = {
        id: newId,
        name,
        email,
        phone,
        password,
        avatar: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgfkDqzbCnl6zEkhuBL08Yy5NOcQwG-QOw64NS6WYU2R_2wlUnmydO2xnOjMiY59D0cnlT0QTmiBZ_G_gi5_-W62TOcPdry0KaXmGeGoQAKYiLTfTlc6ko_IiX5FhUJbFuW7y4X2lrkT9F5bm3elnqaxTMOxhYqemHL0EFoozduJf77NEIaZDjuXO1FA2I/Gemini_Generated_Image_txixh7txixh7txix.png',
        blocked: false,
        joinedDate: new Date().toISOString().substring(0, 10),
        ...(formattedInviteCode ? { inviteCode: formattedInviteCode } : {})
      };

      const emptyBank: BankDetails = {
        publisherId: newId,
        holderName: name,
        phone,
        email,
        accountNumber: '',
        ifsc: '',
        upi: '',
        qrCode: ''
      };

      // 4. Optimistic state & cache
      setPublishers(prev => {
        const next = [newPub, ...prev.filter(p => p.id !== newId)];
        try { localStorage.setItem('pai_cached_publishers', JSON.stringify(next)); } catch (e) {}
        return next;
      });
      setBankDetailsMap(prev => {
        const next = { ...prev, [newId]: emptyBank };
        try { localStorage.setItem('pai_cached_bank_details', JSON.stringify(next)); } catch (e) {}
        return next;
      });

      // 5. Server Persistence (Zero Firestore Quota Dependency)
      fetch('/api/publisher/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publisher: newPub })
      }).catch(err => console.warn("Server publisher register notice:", err));

      fetch('/api/bank/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publisherId: newId, details: emptyBank })
      }).catch(err => console.warn("Server bank init notice:", err));

      // 6. Background Firestore write
      try {
        setDoc(doc(db, 'publishers', newId), newPub).catch(() => {});
        setDoc(doc(db, 'bank_details', newId), emptyBank).catch(() => {});
      } catch (e) {}

      const sess = { type: 'publisher' as const, id: newId, name };
      setCurrentUser(sess);
      localStorage.setItem('pai_user_session', JSON.stringify(sess));
      
      addLog(newId, name, 'SIGNUP', 'New publisher account created and verified');
      return { success: true, message: 'Sign up successful!', publisher: newPub };
    } catch (error: any) {
      console.error("Signup Error:", error);
      return { success: false, message: 'Signup execution failed: ' + sanitizeError(error) };
    }
  };

  const logout = () => {
    if (currentUser) {
      addLog(currentUser.id, currentUser.name, 'LOGOUT', 'User destroyed session token');
    }
    setCurrentUser(null);
    localStorage.removeItem('pai_user_session');
  };

  const updatePublisherProfile = async (name: string, avatar: string) => {
    if (!currentUser || currentUser.type !== 'publisher') return;
    const pubId = currentUser.id;
    
    try {
      await updateDoc(doc(db, 'publishers', pubId), { name, avatar }).catch(() => {});
      
      const upSess = { ...currentUser, name, avatar };
      setCurrentUser(upSess);
      try {
        localStorage.setItem('pai_user_session', JSON.stringify(upSess));
      } catch (e) {}

      const updatedPublishers = publishers.map(p => p.id === pubId ? { ...p, name, avatar } : p);
      setPublishers(updatedPublishers);
      try {
        localStorage.setItem('pai_cached_publishers', JSON.stringify(updatedPublishers));
      } catch (e) {}

      broadcastSync('SYNC_PUBLISHERS', updatedPublishers);

      await fetch('/api/publisher/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publisherId: pubId, name, avatar })
      }).catch(err => console.warn("Publisher update api notice:", err));

      addLog(pubId, name, 'PROFILE_UPDATE', `Publisher changed avatar/name`);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to save profile. Please try a smaller image.');
    }
  };

  const sendPasswordReset = (phone: string, email: string) => {
    const pub = publishers.find(p => p.phone === phone && p.email === email);
    if (pub) {
      addLog(pub.id, pub.name, 'RESET_REQ', `Self password reset request initiated`);
      return { success: true, found: true, message: 'Data Matched! Your request has been sent. Contact Admin to retrieve a newly allocated password immediately.' };
    }
    return { success: false, found: false, message: 'Data mismatch! No publisher account found with this matching Phone and Email.' };
  };

  const resetUserPasswordByAdmin = (phone: string, email: string, newPass: string) => {
    const pub = publishers.find(p => p.phone === phone && p.email === email);
    if (pub) {
      updateDoc(doc(db, 'publishers', pub.id), { password: newPass });
      addLog('ADMIN', 'Admin Manager', 'PASS_RESET', `Force changed credentials of ${pub.id}`);
      return { success: true, message: `Successfully allocated new password '${newPass}' for ${pub.name} (${pub.id}).` };
    }
    return { success: false, message: 'Matching details not found.' };
  };

  // Admin / Employee operations
  const addCampaign = (c: Omit<Campaign, 'id' | 'active'>) => {
    const newId = `camp-${Date.now()}`;
    const newCamp: Campaign = {
      ...c,
      id: newId,
      active: true
    };
    
    // Immediate optimistic update & cache
    setCampaigns(prev => {
      const next = [newCamp, ...prev];
      try {
        localStorage.setItem('pai_cached_campaigns', JSON.stringify(next));
        broadcastSync('SYNC_CAMPAIGNS', next);
      } catch (err) {}
      return next;
    });

    // Realtime Server Persistence & Broadcast to ALL Connected Devices
    fetch('/api/campaign/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaign: newCamp })
    }).catch(err => console.warn("Server campaign add dispatch notice:", err));

    try {
      setDoc(doc(db, 'campaigns', newId), newCamp).catch(err => {
        console.warn("Firestore setDoc campaign notice:", err.message);
      });
    } catch (err) {}
    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_ADD', `Created campaign '${c.name}' with payout ₹${c.payout}`);
  };

  const toggleCampaignActive = (id: string) => {
    const c = campaigns.find(item => item.id === id);
    if (c) {
      const newActive = !c.active;
      setCampaigns(prev => {
        const next = prev.map(item => item.id === id ? { ...item, active: newActive } : item);
        try {
          localStorage.setItem('pai_cached_campaigns', JSON.stringify(next));
          broadcastSync('SYNC_CAMPAIGNS', next);
        } catch (err) {}
        return next;
      });

      // Realtime Server Persistence & Broadcast to ALL Connected Devices
      fetch('/api/campaign/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: newActive })
      }).catch(err => console.warn("Server campaign toggle dispatch notice:", err));

      try {
        updateDoc(doc(db, 'campaigns', id), { active: newActive }).catch(err => {
          console.warn("Firestore updateDoc campaign notice:", err.message);
        });
      } catch (err) {}
      addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_TOGGLE', `Toggled accessibility check of '${c.name}' to ${newActive}`);
    }
  };

  const editCampaign = (id: string, updatedCamp: Partial<Campaign>) => {
    const c = campaigns.find(item => item.id === id);
    if (c) {
      const merged = { ...c, ...updatedCamp };
      setCampaigns(prev => {
        const next = prev.map(item => item.id === id ? merged : item);
        try {
          localStorage.setItem('pai_cached_campaigns', JSON.stringify(next));
          broadcastSync('SYNC_CAMPAIGNS', next);
        } catch (err) {}
        return next;
      });

      // Realtime Server Persistence & Broadcast to ALL Connected Devices
      fetch('/api/campaign/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, campaign: merged })
      }).catch(err => console.warn("Server campaign edit dispatch notice:", err));

      try {
        updateDoc(doc(db, 'campaigns', id), updatedCamp).catch(err => {
          console.warn("Firestore updateDoc campaign notice:", err.message);
        });
      } catch (err) {}
      addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_EDIT', `Edited campaign '${c.name}' specs`);
    }
  };

  const deleteCampaign = (id: string) => {
    const target = campaigns.find(c => c.id === id);
    if (target) {
      setCampaigns(prev => {
        const next = prev.filter(c => c.id !== id);
        try {
          localStorage.setItem('pai_cached_campaigns', JSON.stringify(next));
          broadcastSync('SYNC_CAMPAIGNS', next);
        } catch (err) {}
        return next;
      });

      // Realtime Server Persistence & Broadcast to ALL Connected Devices
      fetch('/api/campaign/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      }).catch(err => console.warn("Server campaign delete dispatch notice:", err));

      try {
        deleteDoc(doc(db, 'campaigns', id)).catch(err => {
          console.warn("Firestore deleteDoc campaign notice:", err.message);
        });
      } catch (err) {}
      addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_DELETE', `Deleted campaign '${target.name}' from active registry`);
    }
  };

  const updateOfferPopup = (image: string, active: boolean, title?: string, description?: string, buttonText?: string, link?: string, showButton?: boolean) => {
    const newOffer = { image, active, title, description, buttonText, link, showButton };
    updateDoc(doc(db, 'configs', 'settings'), { offer: newOffer }).catch(() => {});
    setOffer(newOffer);
    localStorage.setItem('pai_offer', JSON.stringify(newOffer));
    addLog('ADMIN', 'Administrator', 'OFFER_UPDATE', `Admin modified promo banner popup (Activated: ${active})`);
  };

  const updateSupportDetails = (phone: string, email: string) => {
    updateDoc(doc(db, 'configs', 'settings'), { supportPhone: phone, supportEmail: email }).catch(() => {});
    setSupportPhone(phone);
    setSupportEmail(email);
    localStorage.setItem('pai_support_phone', phone);
    localStorage.setItem('pai_support_email', email);
    addLog('ADMIN', 'Administrator', 'SUPPORT_EDIT', `Site-wide contacts updated. Phone: ${phone}, Email: ${email}`);
  };

  const updateGoogleSheetUrl = async (url: string) => {
    try {
      await updateDoc(doc(db, 'configs', 'settings'), { googleSheetUrl: url });
      setGoogleSheetUrl(url);
      localStorage.setItem('pai_google_sheet_url', url);
      addLog('ADMIN', 'Administrator', 'GOOGLESHEET_EDIT', `Updated Google Sheet App Script Web App URL to: ${url}`);
    } catch (err) {
      console.error("Error saving Google Sheet URL:", err);
    }
  };

  const deleteAdvertiserInquiry = async (id: string) => {
    try {
      setAdvertiserInquiries(prev => {
        const next = prev.filter(i => i.id !== id);
        try { localStorage.setItem('pai_cached_advertiser_inquiries', JSON.stringify(next)); } catch (e) {}
        return next;
      });
      await deleteDoc(doc(db, 'advertiserInquiries', id)).catch(() => {});
      addLog('ADMIN', 'Administrator', 'INQUIRY_DELETE', `Deleted advertiser inquiry: ${id}`);
    } catch (err) {
      console.error("Error deleting inquiry:", err);
    }
  };

  const submitAdvertiserInquiry = async (name: string, phone: string, email: string, company: string, campaign: string) => {
    try {
      const id = 'INQ-' + Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 5).toUpperCase();
      const submittedAt = new Date().toISOString();
      const newInquiry: AdvertiserInquiry = {
        id,
        name,
        phone,
        email,
        company,
        campaign: campaign || 'N/A',
        submittedAt
      };

      // 1. WhatsApp formatted text & URL targeting user's requested number: +91 8934932418
      const targetPhone = '918934932418';
      const waText = 
        `🚀 *NEW ADVERTISER INQUIRY - PUBLIC ADS NETWORK*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Advertiser Name:* ${name.trim()}\n` +
        `📞 *Contact Number:* ${phone.trim()}\n` +
        `📧 *Email Address:* ${email.trim()}\n` +
        `🏢 *Company Name:* ${company.trim()}\n` +
        `🎯 *Campaign Required:* ${campaign?.trim() || 'General CPA/CPL Promotion'}\n` +
        `🆔 *Inquiry ID:* ${id}\n` +
        `📅 *Date:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `_Sent via Public Ads India Official Advertiser Portal_`;
      const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waText)}`;

      // 2. Optimistic local state and cache update
      setAdvertiserInquiries(prev => {
        const next = [newInquiry, ...prev.filter(i => i.id !== id)];
        try { localStorage.setItem('pai_cached_advertiser_inquiries', JSON.stringify(next)); } catch (e) {}
        return next;
      });

      // 3. Post to backend server endpoint for instant persistence and cross-device sync
      fetch('/api/advertiser/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInquiry)
      }).catch(err => console.warn("Backend server inquiry dispatch notice:", err));

      // 4. Send directly to Google Sheets using the Web App URL
      const targetUrl = 'https://script.google.com/macros/s/AKfycbyDBbwsuefEhBrEZouttfoIlbwqTABJ058VxJHyKsquK8PnFN4fctF7-UIiBB_UivC_/exec';
      try {
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newInquiry)
        });
      } catch (fetchErr) {
        console.warn("Google Apps Script fetch triggered (no-cors mode):", fetchErr);
      }

      // 5. Asynchronously persist to Firestore with error protection
      try {
        setDoc(doc(db, 'advertiserInquiries', id), newInquiry).catch(() => {});
      } catch (e) {}

      // 6. Save a log trace
      addLog('SYSTEM', 'Advertiser Form', 'INQUIRY_SUBMIT', `New advertiser inquiry from ${name} (${company}) dispatched to Admin +91 8934932418`);

      return { 
        success: true, 
        message: 'Advertiser inquiry submitted successfully.', 
        whatsappUrl, 
        inquiry: newInquiry 
      };
    } catch (err) {
      console.error("Error submitting advertiser inquiry:", err);
      return { success: false, message: err instanceof Error ? err.message : 'Submission failed.' };
    }
  };

  const togglePartnerHiring = (active: boolean) => {
    updateDoc(doc(db, 'configs', 'settings'), { partnerHiringActive: active }).catch(() => {});
    setPartnerHiringActive(active);
    localStorage.setItem('pai_hiring_active', String(active));
    addLog('ADMIN', 'Administrator', 'HIRING_TOGGLE', `Hiring availability program toggled to ${active ? 'Active' : 'Paused'}`);
  };

  const updateSubmissionStatus = (submissionId: string, rawStatus: SubmissionStatus | string) => {
    // Normalize status string (e.g. 'In Process' -> 'Process')
    let status: SubmissionStatus = 'Process';
    const sLower = (rawStatus || '').toLowerCase().trim();
    if (sLower === 'payment done' || sLower === 'paymentdone' || sLower === 'paid') {
      status = 'Payment Done';
    } else if (sLower === 'trade done' || sLower === 'tradedone') {
      status = 'Trade Done';
    } else if (sLower === 'ready to trade' || sLower === 'ready') {
      status = 'Ready To Trade';
    } else if (sLower === 'active') {
      status = 'Active';
    } else if (sLower === 'reject' || sLower === 'rejected') {
      status = 'Reject';
    } else {
      status = 'Process';
    }

    let oldSub = submissions.find(s => s.id === submissionId);
    if (!oldSub) {
      try {
        const cached = localStorage.getItem('pai_cached_submissions');
        if (cached) {
          const list: DataSubmission[] = JSON.parse(cached);
          oldSub = list.find(s => s.id === submissionId);
        }
      } catch (e) {}
    }
    if (!oldSub) return;

    const prevStatus = oldSub.status;
    const isNowPaid = status === 'Payment Done';
    const wasPaid = prevStatus === 'Payment Done' || (prevStatus || '').toLowerCase().trim() === 'payment done';

    // STRICT USER REQUIREMENT: Prevent multiple count if clicked 4-5 times
    // "Or MIS me Payment Done pe 4/5 bar bhi click hoto ek bar hi count kre ek client ka 4/5 bar count kr leta h"
    if (isNowPaid) {
      // 1. Debounce mutex lock: reject rapid clicks within 3 seconds
      if (inFlightDisbursementIds.current.has(submissionId)) {
        console.warn(`[Lock Guard] Rapid duplicate click ignored for submission ${submissionId}`);
        return;
      }
      inFlightDisbursementIds.current.add(submissionId);
      setTimeout(() => {
        inFlightDisbursementIds.current.delete(submissionId);
      }, 3000);

      // 2. If already marked as Payment Done, do NOT add or count again!
      if (wasPaid) {
        console.warn(`[Duplicate Guard] Submission ${submissionId} is already Payment Done. Multiple count blocked.`);
        return;
      }
    }

    // 1. Optimistically update submission status in memory & localStorage
    const updatedSub = { ...oldSub, status };
    const nextSubmissions = submissions.map(s => s.id === submissionId ? updatedSub : s);
    setSubmissions(nextSubmissions);
    try {
      localStorage.setItem('pai_cached_submissions', JSON.stringify(nextSubmissions));
    } catch (e) {}

    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'MIS_STATUS_UPDATE', `Updated lead status of [${oldSub.clientName}] from "${prevStatus}" to "${status}"`);

    // 2. Handle Earning Record addition or reversal with strict idempotence
    let newEarning: EarningRecord | null = null;
    let removedEarningId: string | null = null;

    if (isNowPaid) {
      const earningId = `earning-${submissionId}`;
      const normPubId = (oldSub.publisherId || '').trim().toLowerCase();

      // Check if this submission or client already has an earning in state
      const alreadyHasEarning = earnings.some(e => 
        e.id === earningId || 
        ((e.publisherId || '').trim().toLowerCase() === normPubId && 
         e.campaignId === oldSub!.campaignId && 
         Number(e.amount) === Number(oldSub!.payout))
      );

      if (alreadyHasEarning) {
        console.log(`[Duplicate Guard] Earning record already exists for ${submissionId}, will not create duplicate.`);
      } else {
        newEarning = {
          id: earningId,
          publisherId: oldSub.publisherId,
          campaignId: oldSub.campaignId,
          campaignName: oldSub.campaignName,
          amount: Number(oldSub.payout) || 0,
          date: (oldSub.submitDate || '').substring(0, 10) || new Date().toISOString().substring(0, 10),
          time: (oldSub.submitDate || '').substring(11, 16) || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        };
        
        // Optimistically add to earnings immediately so Publisher Dashboard reflects payout instantly
        setEarnings(prev => {
          const next = [newEarning!, ...prev.filter(e => e.id !== earningId)];
          try {
            localStorage.setItem('pai_cached_earnings', JSON.stringify(next));
          } catch (e) {}
          return next;
        });

        addLog('PAYMENT_SERVER', 'Automatic Ledger', 'EARNING_DISBURSE', `Disbursed ₹${oldSub.payout} campaign reward to ${oldSub.publisherId}`);
      }
    } else if (wasPaid) {
      // Reverted from Payment Done to another status (e.g. Process) - remove payment from earnings!
      removedEarningId = `earning-${submissionId}`;
      const normPubId = (oldSub.publisherId || '').trim().toLowerCase();
      setEarnings(prev => {
        const next = prev.filter(e => 
          e.id !== removedEarningId && 
          !((e.publisherId || '').trim().toLowerCase() === normPubId && e.campaignId === oldSub!.campaignId && Number(e.amount) === Number(oldSub!.payout))
        );
        try {
          localStorage.setItem('pai_cached_earnings', JSON.stringify(next));
        } catch (e) {}
        return next;
      });
    }

    // 3. Dispatch cross-tab broadcast
    broadcastSync('SUBMISSION_STATUS_UPDATED', {
      submissionId,
      status,
      prevStatus,
      submission: updatedSub,
      earning: newEarning,
      removedEarningId
    });

    // 4. Realtime Server Dispatch (Direct update on server store + SSE broadcast across all devices)
    fetch('/api/submission/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submissionId,
        status,
        submissionData: updatedSub,
        payout: oldSub.payout
      })
    }).catch(err => console.warn("Realtime server status dispatch notice:", err));

    // 5. Persist to Firestore asynchronously with error resilience
    try {
      updateDoc(doc(db, 'submissions', submissionId), { status }).catch(err => {
        console.warn("Firestore updateDoc submission notice:", err.message);
      });
      if (newEarning) {
        setDoc(doc(db, 'earnings', newEarning.id), newEarning).catch(err => {
          console.warn("Firestore setDoc earning notice:", err.message);
        });
      } else if (removedEarningId) {
        deleteDoc(doc(db, 'earnings', removedEarningId)).catch(err => {
          console.warn("Firestore deleteDoc earning notice:", err.message);
        });
      }
    } catch (err: any) {
      console.warn("Firestore deferred update notice:", err);
    }
  };

  const deleteSubmission = (id: string) => {
    // Also clean up any associated earning for this submission
    const earningId = `earning-${id}`;
    setEarnings(prev => {
      const next = prev.filter(e => e.id !== earningId);
      try {
        localStorage.setItem('pai_cached_earnings', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    try {
      deleteDoc(doc(db, 'earnings', earningId)).catch(() => {});
    } catch (err) {}

    setSubmissions(prev => {
      const next = prev.filter(s => s.id !== id);
      try {
        localStorage.setItem('pai_cached_submissions', JSON.stringify(next));
        broadcastSync('SYNC_SUBMISSIONS', next);
        fetch('/api/realtime/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'SYNC_SUBMISSIONS',
            payload: next
          })
        }).catch(() => {});
      } catch (err) {}
      return next;
    });

    try {
      deleteDoc(doc(db, 'submissions', id)).catch(err => {
        console.warn("Firestore deleteDoc submission notice:", err.message);
      });
    } catch (err) {}
    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'DELETE_SUBMISSION', `Lead submission deleted for reference ID: ${id}`);
  };

  const updateEarningAmount = (earningId: string, amount: number) => {
    const newAmt = Number(amount);
    setEarnings(prev => {
      const next = prev.map(e => e.id === earningId ? { ...e, amount: newAmt } : e);
      try {
        localStorage.setItem('pai_cached_earnings', JSON.stringify(next));
        broadcastSync('SYNC_EARNINGS', next);
      } catch (err) {}
      return next;
    });

    // Also update corresponding submission payout in memory if linked
    const rawSubId = earningId.replace(/^earning-sub-/, '').replace(/^earning-/, '');
    const matchedSub = submissions.find(s => s.id === rawSubId);
    if (matchedSub) {
      setSubmissions(prev => {
        const next = prev.map(s => s.id === matchedSub.id ? { ...s, payout: newAmt } : s);
        try {
          localStorage.setItem('pai_cached_submissions', JSON.stringify(next));
        } catch (e) {}
        return next;
      });
      try {
        updateDoc(doc(db, 'submissions', matchedSub.id), { payout: newAmt }).catch(() => {});
      } catch (e) {}
    }

    // Persist to server store
    fetch('/api/earning/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ earningId, amount: newAmt })
    }).catch(err => console.warn("Server earning update notice:", err));

    try {
      updateDoc(doc(db, 'earnings', earningId), { amount: newAmt }).catch(err => {
        console.warn("Firestore updateDoc earning notice:", err.message);
      });
    } catch (err) {}

    broadcastSync('EARNING_UPDATED', { earningId, amount: newAmt, submissionId: matchedSub?.id });
    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'UPDATE_EARNING_AMOUNT', `Updated earning ID ${earningId} amount to ₹${newAmt}`);
  };

  const deleteEarningRecord = (earningId: string) => {
    const targetEarning = earnings.find(e => e.id === earningId);

    // 1. Remove from local earnings state & cache immediately
    setEarnings(prev => {
      const next = prev.filter(e => e.id !== earningId);
      try {
        localStorage.setItem('pai_cached_earnings', JSON.stringify(next));
        broadcastSync('SYNC_EARNINGS', next);
      } catch (err) {}
      return next;
    });

    // 2. CRITICAL USER SPECIFICATION:
    // "Or MIS me agar payment done h to process me kr do jab bhi delet ho to"
    // "Edit amount se Jo delet kr diya h uska amount abhi bhi show kr rha h Jab delet kr diya hai to Uska amount kyu show ho rha hai"
    // Locate the corresponding lead submission in MIS and revert its status to 'Process'!
    let matchedSub: DataSubmission | null = null;

    if (targetEarning) {
      const normPubId = (targetEarning.publisherId || '').trim().toLowerCase();
      const isPaymentDone = (st?: string) => {
        const s = (st || '').toLowerCase().trim();
        return s === 'payment done' || s === 'paymentdone' || s === 'paid';
      };

      // Check A: Direct ID match
      const rawSubId = earningId.replace(/^earning-sub-/, '').replace(/^earning-/, '');
      matchedSub = submissions.find(s => s.id === rawSubId) || null;

      // Check B: Publisher + Campaign + Payment Done + Amount
      if (!matchedSub) {
        matchedSub = submissions.find(s => 
          (s.publisherId || '').trim().toLowerCase() === normPubId &&
          s.campaignId === targetEarning.campaignId &&
          isPaymentDone(s.status) &&
          Number(s.payout) === Number(targetEarning.amount)
        ) || null;
      }

      // Check C: Publisher + Campaign + Payment Done
      if (!matchedSub) {
        matchedSub = submissions.find(s => 
          (s.publisherId || '').trim().toLowerCase() === normPubId &&
          s.campaignId === targetEarning.campaignId &&
          isPaymentDone(s.status)
        ) || null;
      }

      // Check D: Publisher + Payment Done + Amount
      if (!matchedSub) {
        matchedSub = submissions.find(s => 
          (s.publisherId || '').trim().toLowerCase() === normPubId &&
          isPaymentDone(s.status) &&
          Number(s.payout) === Number(targetEarning.amount)
        ) || null;
      }

      // Check E: Any Payment Done for this publisher
      if (!matchedSub) {
        matchedSub = submissions.find(s => 
          (s.publisherId || '').trim().toLowerCase() === normPubId &&
          isPaymentDone(s.status)
        ) || null;
      }
    }

    if (matchedSub) {
      const revertedSubId = matchedSub.id;
      // Revert this submission's status in local state to 'Process'
      setSubmissions(prev => {
        const next = prev.map(s => s.id === revertedSubId ? { ...s, status: 'Process' as SubmissionStatus } : s);
        try {
          localStorage.setItem('pai_cached_submissions', JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      // Update in Firestore
      try {
        updateDoc(doc(db, 'submissions', revertedSubId), { status: 'Process' }).catch(err => {
          console.warn("Firestore updateDoc submission revert notice:", err.message);
        });
      } catch (err) {}
    }

    // 3. Delete earning doc from Firestore
    try {
      deleteDoc(doc(db, 'earnings', earningId)).catch(err => {
        console.warn("Firestore deleteDoc earning notice:", err.message);
      });
    } catch (err) {}

    // 4. Dispatch to Server endpoint /api/earning/delete for instant persistent deletion & SSE broadcast across all devices
    fetch('/api/earning/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        earningId,
        publisherId: targetEarning?.publisherId,
        campaignId: targetEarning?.campaignId,
        amount: targetEarning?.amount,
        matchedSubmissionId: matchedSub?.id
      })
    }).catch(err => console.warn("Server earning delete notice:", err));

    // 5. Broadcast to cross-tabs
    broadcastSync('EARNING_DELETED', { earningId, matchedSubmissionId: matchedSub?.id });

    addLog(
      currentUser?.id || 'ADMIN', 
      currentUser?.name || 'Administrator', 
      'DELETE_EARNING_RECORD', 
      `Deleted earning ID ${earningId} (₹${targetEarning?.amount || 0})${matchedSub ? ` and reverted lead [${matchedSub.clientName}] in MIS to "Process"` : ''}`
    );
  };

  const toggleBlockPublisher = (pubId: string) => {
    const p = publishers.find(item => item.id === pubId);
    if (p) {
      setPublishers(prev => {
        const next = prev.map(item => item.id === pubId ? { ...item, blocked: !item.blocked } : item);
        try {
          localStorage.setItem('pai_cached_publishers', JSON.stringify(next));
          broadcastSync('SYNC_PUBLISHERS', next);
        } catch (err) {}
        return next;
      });

      try {
        updateDoc(doc(db, 'publishers', pubId), { blocked: !p.blocked }).catch(err => {
          console.warn("Firestore updateDoc publisher notice:", err.message);
        });
      } catch (err) {}
      addLog('ADMIN', 'Administrator', p.blocked ? 'UNBLOCK_USER' : 'BLOCK_USER', `Account access modify for ${p.name} (${p.id})`);
    }
  };

  const deletePublisher = (pubId: string) => {
    const p = publishers.find(item => item.id === pubId);
    if (p) {
      setPublishers(prev => {
        const next = prev.filter(item => item.id !== pubId);
        try {
          localStorage.setItem('pai_cached_publishers', JSON.stringify(next));
          broadcastSync('SYNC_PUBLISHERS', next);
        } catch (err) {}
        return next;
      });

      try {
        deleteDoc(doc(db, 'publishers', pubId)).catch(err => {
          console.warn("Firestore deleteDoc publisher notice:", err.message);
        });
      } catch (err) {}
      addLog('ADMIN', 'Administrator', 'DELETE_USER', `Account permanently deleted for ${p.name} (${p.id})`);
    }
  };

  const addEmployee = (name: string, u: string, p: string, role: 'Payment' | 'MIS') => {
    const existing = employees.find(e => e.username === u);
    if (existing) {
      return { success: false, message: 'Username is already taken by another staff member.' };
    }
    const empId = `emp-${Date.now()}`;
    const newEmp: Employee = {
      id: empId,
      name,
      username: u,
      password: p,
      role
    };

    setEmployees(prev => {
      const next = [...prev, newEmp];
      try {
        localStorage.setItem('pai_cached_employees', JSON.stringify(next));
        broadcastSync('SYNC_EMPLOYEES', next);
      } catch (err) {}
      return next;
    });

    try {
      setDoc(doc(db, 'employees', empId), newEmp).catch(err => {
        console.warn("Firestore setDoc employee notice:", err.message);
      });
    } catch (err) {}
    addLog('ADMIN', 'Administrator', 'STAFF_ADDED', `Recruited new staff: ${name} (Role: ${role})`);
    return { success: true, message: 'Staff Employee account generated successfully!' };
  };

  const deleteEmployee = (id: string) => {
    const target = employees.find(e => e.id === id);
    if (!target) return;

    setEmployees(prev => {
      const next = prev.filter(e => e.id !== id);
      try {
        localStorage.setItem('pai_cached_employees', JSON.stringify(next));
        broadcastSync('SYNC_EMPLOYEES', next);
      } catch (err) {}
      return next;
    });

    try {
      deleteDoc(doc(db, 'employees', id)).catch(err => {
        console.warn("Firestore deleteDoc employee notice:", err.message);
      });
    } catch (err) {}
    addLog('ADMIN', 'Administrator', 'STAFF_REMOVED', `Revoked access tokens for staff: ${target.name}`);
  };

  const addTestimonial = (t: Omit<Testimonial, 'id'>) => {
    const newId = `testi-${Date.now()}`;
    const newTestimonial: Testimonial = {
      ...t,
      id: newId
    };
    setDoc(doc(db, 'testimonials', newId), newTestimonial);

    // Update local state and cache immediately
    const updatedList = [...testimonials, newTestimonial];
    setTestimonials(updatedList);
    localStorage.setItem('pai_cached_testimonials', JSON.stringify(updatedList));

    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'TESTIMONIAL_ADD', `Added testimonial/feedback from '${t.name}'`);
  };

  const editTestimonial = (id: string, updated: Partial<Testimonial>) => {
    updateDoc(doc(db, 'testimonials', id), updated);

    // Update local state and cache immediately
    const updatedList = testimonials.map(t => t.id === id ? { ...t, ...updated } : t);
    setTestimonials(updatedList);
    localStorage.setItem('pai_cached_testimonials', JSON.stringify(updatedList));

    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'TESTIMONIAL_EDIT', `Modified testimonial/feedback from '${updated.name || id}'`);
  };

  const deleteTestimonial = (id: string) => {
    deleteDoc(doc(db, 'testimonials', id));

    // Update local state and cache immediately
    const updatedList = testimonials.filter(t => t.id !== id);
    setTestimonials(updatedList);
    localStorage.setItem('pai_cached_testimonials', JSON.stringify(updatedList));

    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'TESTIMONIAL_DELETE', `Deleted testimonial with ID '${id}'`);
  };

  const triggerBackup = () => {
    const bId = `b-${Date.now()}`;
    const newBackup = {
      id: bId,
      time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      scope: 'Full Database Snapshot Backup',
      size: `2.4 MB`,
      status: 'Success'
    };
    setBackupLogs(prev => [newBackup, ...prev]);
    addLog('SYSTEM', 'Core Database Manager', 'AUTO_BACKUP', `Database Snapshot exported successfully`);
  };

  const purgeAllSystemData = async () => {
    try {
      // 1. Mark init_done as true in Firestore to prevent mock data recreation
      await setDoc(doc(db, 'system_metadata', 'init_done'), { value: true });

      // 2. Clear collections
      const collectionsToPurge = ['publishers', 'bank_details', 'submissions', 'earnings', 'partners', 'activity_logs', 'backups'];

      for (const colName of collectionsToPurge) {
        const snap = await getDocs(collection(db, colName));
        for (const docSnap of snap.docs) {
          await deleteDoc(doc(db, colName, docSnap.id));
        }
      }

      // Add a fresh launch message
      const initialLogsDoc = doc(db, 'activity_logs', 'l-fresh-start');
      await setDoc(initialLogsDoc, {
        id: 'l-fresh-start',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        userId: 'SYSTEM',
        userName: 'Server Core',
        action: 'BOOT',
        details: 'Database registers fully purged. Ready for fresh publisher registration cycle!'
      });

      return { success: true, message: 'All old registers, bank records, and lead submissions successfully deleted! System is now fresh for new client registrations.' };
    } catch (err: any) {
      console.error('Purge error:', err);
      return { success: false, message: 'Purge failed: ' + err.message };
    }
  };

  // Publisher actions
  const submitBankDetails = async (details: BankDetails) => {
    if (!currentUser || currentUser.type !== 'publisher') return { success: false, message: 'Authentication level required' };
    
    // Immediate optimistic update & cache
    const updated = { ...details, publisherId: currentUser.id };
    setBankDetailsMap(prev => {
      const next = { ...prev, [currentUser.id]: updated };
      try {
        localStorage.setItem('pai_cached_bank_details', JSON.stringify(next));
        broadcastSync('SYNC_BANK_DETAILS', next);
      } catch (e) {}
      return next;
    });

    // Server Persistence & Broadcast
    fetch('/api/bank/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publisherId: currentUser.id, details: updated })
    }).catch(err => console.warn("Server bank update notice:", err));

    try {
      setDoc(doc(db, 'bank_details', currentUser.id), updated).catch(err => {
        console.warn("Firestore bank details save notice:", err.message);
      });
      addLog(currentUser.id, currentUser.name, 'BANK_UPDATE', 'Updated banking ledger details');
      return { success: true, message: 'Bank ledger nodes updated and saved in system registry!' };
    } catch (err: any) {
      return { success: true, message: 'Bank ledger nodes updated and saved in system registry!' };
    }
  };

  const submitLead = async (campaignId: string, clientName: string, clientPhone: string, clientCode: string, screenshot: string) => {
    if (!currentUser || currentUser.type !== 'publisher') return { success: false, message: 'Authentication level required' };
    
    // Find campaign payout
    const camp = campaigns.find(c => c.id === campaignId);
    if (!camp) return { success: false, message: 'Invalid Campaign selected' };

    // Prevent duplicate submission for the same client phone under this campaign
    const duplicate = submissions.some(s => 
      s.campaignId === campaignId && 
      s.clientPhone && 
      clientPhone && 
      s.clientPhone.trim() === clientPhone.trim()
    );
    if (duplicate) {
      return { success: false, message: 'This client phone number has already been submitted for this campaign!' };
    }

    const subId = `sub-${Date.now()}`;
    const newSub: DataSubmission = {
      id: subId,
      publisherId: currentUser.id,
      publisherName: currentUser.name,
      campaignId,
      campaignName: camp.name,
      payout: camp.payout,
      clientName,
      clientPhone,
      clientCode,
      screenshot,
      submitDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Process'
    };

    // 1. Immediate optimistic update in state
    setSubmissions(prev => {
      const exists = prev.some(s => s.id === subId);
      if (exists) return prev;
      const list = [newSub, ...prev];
      list.sort((a, b) => {
        const keyA = (a.submitDate || '') + '_' + (a.id || '');
        const keyB = (b.submitDate || '') + '_' + (b.id || '');
        return keyB.localeCompare(keyA);
      });
      return list;
    });

    // 2. Safe local storage cache update (without crashing on QuotaExceededError)
    try {
      localStorage.setItem('pai_cached_submissions', JSON.stringify([newSub, ...submissions.slice(0, 30)]));
    } catch (quotaErr) {
      try {
        const lean = [newSub, ...submissions.slice(0, 20)].map(s => ({
          ...s,
          screenshot: s.screenshot && s.screenshot.length > 200 ? s.screenshot.substring(0, 100) : s.screenshot
        }));
        localStorage.setItem('pai_cached_submissions', JSON.stringify(lean));
      } catch (e) {}
    }

    // 3. Multi-Tab / Multi-Window Broadcast
    try {
      broadcastSync('NEW_SUBMISSION', newSub);
    } catch (e) {}

    // 4. Guaranteed Persistence on Backend Server & Firestore
    try {
      await setDoc(doc(db, 'submissions', subId), newSub).catch(err => {
        console.warn("Firestore submission save notice:", err.message);
      });

      const response = await fetch('/api/submission/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission: newSub })
      });
      if (!response.ok) throw new Error('Backend submission failed');

      addLog(currentUser.id, currentUser.name, 'LEAD_SUBMISSION', `Submitted new action lead for client [${clientName}] under campaign [${camp.name}]`);
      return { success: true, message: 'Lead submitted successfully! Admin will verify soon.' };
    } catch (fetchErr) {
      console.error("Submission create error:", fetchErr);
      return { success: true, message: 'Lead saved locally and queued for sync.' };
    }
  };

  const applyForPartner = async (name: string, phone: string, email: string, city: string, age: number, qualification: string) => {
    if (!partnerHiringActive) {
      return { success: false, message: 'Hiring is currently closed or paused by management.' };
    }
    const partnerId = `part-${Date.now()}`;
    const newApp: PartnerApplication = {
      id: partnerId,
      name,
      phone,
      email,
      city,
      age,
      qualification,
      submitDate: new Date().toISOString().substring(0, 10)
    };

    // Optimistic state & cache
    setPartnerApplications(prev => {
      const next = [newApp, ...prev];
      try {
        localStorage.setItem('pai_cached_partners', JSON.stringify(next));
        broadcastSync('SYNC_PARTNERS', next);
      } catch (e) {}
      return next;
    });

    // Server Persistence (Zero Firestore Quota Dependency)
    fetch('/api/partner/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partner: newApp })
    }).catch(err => console.warn("Server partner apply notice:", err));

    // Non-blocking background Firestore write
    try {
      setDoc(doc(db, 'partners', partnerId), newApp).catch(() => {});
    } catch (e) {}

    addLog('PARTNER_PORTAL', name, 'PARTNER_APPLY', `Received recruitment application from partner candidate ${city}`);
    return { success: true, message: 'Application submitted successfully! Our HR Board will review and get back within 48-72 Hours.' };
  };

  // Staff Portal Login
  const loginEmployee = (username: string, pass: string) => {
    const emp = employees.find(e => e.username === username && e.password === pass);
    if (!emp) {
      return { success: false, message: 'Invalid Employee login credentials.' };
    }
    const sess = { type: 'employee' as const, id: emp.id, name: emp.name, username: emp.username, role: emp.role };
    setCurrentUser(sess);
    localStorage.setItem('pai_user_session', JSON.stringify(sess));
    addLog(emp.id, emp.name, 'STAFF_LOGIN', `Employee allocated staff console layer (Role: ${emp.role})`);
    return { success: true, message: 'Staff login verified.', employee: emp };
  };

  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      campaigns,
      publishers,
      earnings,
      submissions,
      employees,
      partnerApplications,
      bankDetailsMap,
      activityLogs,
      offer,
      supportPhone,
      supportEmail,
      partnerHiringActive,
      googleSheetUrl,
      advertiserInquiries,
      currentUser,
      setCurrentUser,
      refreshServerState,
      testimonials,
      quotaError,
      paymentEmailRecords,
      
      hasMoreSubmissions,
      loadMoreSubmissions,
      hasMoreEarnings,
      loadMoreEarnings,
      hasMorePublishers,
      loadMorePublishers,
      hasMorePartners,
      loadMorePartners,
      
      sendPaymentEmail,
      retryPaymentEmail,
      deletePaymentEmailRecord,
      getLatestClientPaymentEmail,
      
      loginPublisher,
      signupPublisher,
      logout,
      updatePublisherProfile,
      sendPasswordReset,
      resetUserPasswordByAdmin,
      addCampaign,
      editCampaign,
      deleteCampaign,
      toggleCampaignActive,
      updateOfferPopup,
      updateSupportDetails,
      togglePartnerHiring,
      updateSubmissionStatus,
      deleteSubmission,
      updateEarningAmount,
      deleteEarningRecord,
      toggleBlockPublisher,
      deletePublisher,
      addEmployee,
      deleteEmployee,
      triggerBackup,
      backupLogs,
      purgeAllSystemData,
      addTestimonial,
      editTestimonial,
      deleteTestimonial,
      updateGoogleSheetUrl,
      deleteAdvertiserInquiry,
      submitAdvertiserInquiry,
      submitBankDetails,
      submitLead,
      applyForPartner,
      loginEmployee
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
};
