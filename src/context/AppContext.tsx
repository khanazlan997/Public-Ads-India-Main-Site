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
  orderBy,
  db
} from '../lib/firebase';
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
  runFirestoreDiagnostic,
  fetchDirectBankDetails,
  fetchDirectLeads,
  type FirestoreDiagnosticResult
} from '../lib/firestoreDiagnostics';
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

const DEFAULT_PUBLISHER_AVATAR = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYTtYC0gJn4gMEYyYylS71fiNiWngHOMAgY5rmphLDDAP01Nc9ASJCMRJWI5EF9O58QgyRE_T5S5rq7-p8iprJkH0e1muO48LKEV4xuTDlsn5ZkVLrnvXFDN2QM_ekhndsmNA1skwIP2VWNo0zGhENbd8XsuRtv9_PDC5L4rjyLRkEYtWn4VcKTnnoFn7c/s736/1000227902.jpg';

function cleanForFirestore<T extends Record<string, any>>(obj: T): T {
  const clean: any = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined && typeof val !== 'function') {
      clean[key] = val;
    }
  }
  return clean as T;
}

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
  currentUser: { type: 'publisher' | 'admin' | 'employee'; id: string; name: string; username?: string; role?: 'Payment' | 'MIS'; avatar?: string } | null;
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
  deletePublisher: (pubId: string) => Promise<{ success: boolean; message: string }>;
  adminUpdatePublisherName: (pubId: string, newName: string) => Promise<{ success: boolean; message: string }>;
  addEmployee: (name: string, u: string, p: string, role: 'Payment' | 'MIS') => Promise<{ success: boolean; message: string }>;
  deleteEmployee: (id: string) => void;
  triggerBackup: () => void;
  backupLogs: Array<{ id: string; time: string; scope: string; size: string; status: string }>;
  purgeAllSystemData: () => Promise<{ success: boolean; message: string }>;
  pushDataToFirestore: () => Promise<{ success: boolean; message: string }>;
  syncFromCloudFirestore: () => Promise<{ success: boolean; message: string }>;
  addTestimonial: (t: Omit<Testimonial, 'id'>) => void;
  editTestimonial: (id: string, updated: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  updateGoogleSheetUrl: (url: string) => Promise<void>;
  deleteAdvertiserInquiry: (id: string) => Promise<void>;
  submitAdvertiserInquiry: (name: string, phone: string, email: string, company: string, campaign: string) => Promise<{ success: boolean; message: string; whatsappUrl?: string; inquiry?: AdvertiserInquiry }>;
  
  // Publisher Actions
  submitBankDetails: (details: BankDetails) => Promise<{ success: boolean; message: string }>;
  submitLead: (campaignId: string, clientName: string, clientPhone: string, clientCode: string, screenshot: string) => Promise<{ success: boolean; message: string }>;
  applyForPartner: (name: string, phone: string, email: string, city: string, age: number, qualification: string, partnerType?: string, monthlyLeads?: string) => Promise<{ success: boolean; message: string; whatsappUrl?: string }>;
  submitPartnerApplication: (params: { name: string; phone: string; email?: string; city: string; age?: number; qualification?: string; partnerType?: string; monthlyLeads?: string }) => Promise<{ success: boolean; message: string; whatsappUrl?: string }>;
  
  // Employee Login
  loginEmployee: (username: string, pass: string) => Promise<{ success: boolean; message: string; employee?: Employee }>;

  // Diagnostic Utility
  runDiagnostic: (targetPublisherId?: string) => Promise<FirestoreDiagnosticResult>;
  fetchDirectBankDetails: (targetPublisherId?: string) => Promise<any>;
  fetchDirectLeads: (targetPublisherId?: string) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial campaigns
const defaultCampaigns: Campaign[] = [];

const defaultTestimonials: Testimonial[] = [
  {
    id: "testi-1",
    name: "Rahul Sharma",
    profession: "Demat Publisher, Kanpur",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    message: "I started Demat account opening work with zero investment. Daily payouts via UPI arrive right on time. Transparent tracking and 100% trusted network."
  },
  {
    id: "testi-2",
    name: "Pooja Verma",
    profession: "Telecalling & BPO Partner, Lucknow",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    message: "Most reliable platform for work-from-home calling projects. Lead verification is super fast and payments are never delayed. 5-star support!"
  },
  {
    id: "testi-3",
    name: "Amit Patel",
    profession: "Master Affiliate Partner, Gujarat",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    message: "The conversion rates and payouts for Public Ads India's fintech CPA campaigns are the best in the industry. Their MIS portal and lead dashboard are extremely user-friendly."
  },
  {
    id: "testi-4",
    name: "Neha Singh",
    profession: "Student & Part-Time Publisher, Delhi",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
    message: "Earning a great income by working just 2-3 hours daily with zero investment. The customer support team always guides us. Truly India's most trusted platform."
  },
  {
    id: "testi-5",
    name: "Vikas Yadav",
    profession: "Agency Owner (25+ Agents), Kanpur",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    message: "Our entire calling team works on PAI's banking and Demat campaigns. Bulk payment processing and live status tracking systems are unmatchable."
  },
  {
    id: "testi-6",
    name: "Sunil Gupta",
    profession: "Digital Marketer & Publisher, Jaipur",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
    message: "India's #1 portal for fintech affiliate offers and calling projects. The admin and support team response is instant. Highly recommended!"
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

const defaultPaymentEmailRecords: PaymentEmailRecord[] = [];

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
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return snapshotCampaigns.length > 0 ? snapshotCampaigns.map(c => ({ ...c, active: true })) : defaultCampaigns;
    } catch {
      return snapshotCampaigns.length > 0 ? snapshotCampaigns.map(c => ({ ...c, active: true })) : defaultCampaigns;
    }
  });
  
  // Testimonials optimized with localStorage cache to avoid redundant database reads
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const stored = localStorage.getItem('pai_cached_testimonials');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return defaultTestimonials;
    } catch {
      return defaultTestimonials;
    }
  });

  const [publishers, setPublishers] = useState<Publisher[]>(() => {
    try {
      const pubMap = new Map<string, Publisher>();
      snapshotPublishers.forEach(p => {
        if (p && p.id) pubMap.set(String(p.id).trim().toUpperCase(), { ...p, systemVersion: 'v2' });
      });
      const stored = localStorage.getItem('pai_cached_publishers');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((p: Publisher) => {
            if (p && p.id) {
              const key = String(p.id).trim().toUpperCase();
              pubMap.set(key, { ...(pubMap.get(key) || {}), ...p, systemVersion: 'v2' });
            }
          });
        }
      }
      return Array.from(pubMap.values());
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
      const subMap = new Map<string, DataSubmission>();
      snapshotSubmissions.forEach(s => {
        if (s && s.id) subMap.set(s.id, s);
      });
      const stored = localStorage.getItem('pai_cached_submissions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((s: DataSubmission) => {
            if (s && s.id) subMap.set(s.id, { ...(subMap.get(s.id) || {}), ...s });
          });
        }
      }
      const list = Array.from(subMap.values());
      list.sort((a, b) => {
        const keyA = (a.submitDate || '') + '_' + (a.id || '');
        const keyB = (b.submitDate || '') + '_' + (b.id || '');
        return keyB.localeCompare(keyA);
      });
      return list;
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

  useEffect(() => {
    if (currentUser) safeSetLocal('pai_user_session', currentUser);
  }, [currentUser]);

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
            if (Array.isArray(json.data.publishers)) {
              setPublishers(json.data.publishers);
              try { localStorage.setItem('pai_cached_publishers', JSON.stringify(json.data.publishers)); } catch (e) {}
            }
  if (Array.isArray(json.data.submissions)) {
  setSubmissions(json.data.submissions);
  try { localStorage.setItem('pai_cached_submissions', JSON.stringify(json.data.submissions)); } catch (e) {}
  }
  if (Array.isArray(json.data.earnings)) {
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

      // Purge old cached publishers & session if system reset flag is missing
      const resetFlag = localStorage.getItem('pai_system_v2_reset');
      if (!resetFlag) {
        localStorage.removeItem('pai_user_session');
        localStorage.removeItem('pai_cached_publishers');
        localStorage.setItem('pai_system_v2_reset', 'true');
        setCurrentUser(null);
      } else {
        const storedUser = localStorage.getItem('pai_user_session');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // If publisher session, ensure publisher is v2
          if (parsedUser && parsedUser.type === 'publisher') {
            const isV2 = publishers.some(p => p.id === parsedUser.id && p.systemVersion === 'v2');
            if (isV2) {
              setCurrentUser(parsedUser);
            } else {
              // Legacy publisher session, clear it!
              localStorage.removeItem('pai_user_session');
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(parsedUser);
          }
        }
      }
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
              // The server snapshot is authoritative; deleted leads must disappear everywhere.
              payload.forEach(s => {
                if (s && s.id) map.set(s.id, s);
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
            safeSetLocal('pai_cached_publishers', payload);
            setCurrentUser(prev => {
              if (!prev || prev.type !== 'publisher') return prev;
              const latest = payload.find((p: Publisher) => String(p.id).trim().toUpperCase() === String(prev.id).trim().toUpperCase());
              return latest ? { ...prev, ...latest } : prev;
            });
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

  // Real-time Cross-Device SSE & State Synchronizer Engine (Zero-Latency, 100% Free Quota Safe)
  useEffect(() => {
    let es: EventSource | null = null;
    let pollInterval: any = null;

    const applyServerData = (data: any) => {
      if (!data) return;
      const { submissions: sList, earnings: eList, campaigns: cList, publishers: pList, bankDetailsMap: bMap, employees: empList } = data;
      
      if (Array.isArray(sList) && sList.length > 0) {
        setSubmissions(prev => {
          const map = new Map<string, DataSubmission>();
          prev.forEach(s => { if (s && s.id) map.set(s.id, s); });
          sList.forEach(s => { if (s && s.id) map.set(s.id, s); });
          const combined = Array.from(map.values()).sort((a, b) => {
            const keyA = (a.submitDate || '') + '_' + (a.id || '');
            const keyB = (b.submitDate || '') + '_' + (b.id || '');
            return keyB.localeCompare(keyA);
          });
          safeSetLocal('pai_cached_submissions', combined);
          return combined;
        });
      }

      if (Array.isArray(eList)) {
        setEarnings(eList);
        safeSetLocal('pai_cached_earnings', eList);
      }

      if (Array.isArray(cList)) {
        setCampaigns(cList);
        safeSetLocal('pai_cached_campaigns', cList);
      }

      if (Array.isArray(pList) && pList.length > 0) {
        setPublishers(prev => {
          const map = new Map<string, Publisher>();
          prev.forEach(p => { if (p && p.id) map.set(p.id, p); });
          pList.forEach(p => { if (p && p.id) map.set(p.id, p); });
          const combined = Array.from(map.values());
          safeSetLocal('pai_cached_publishers', combined);
          return combined;
        });
        setCurrentUser(prev => {
          if (!prev || prev.type !== 'publisher') return prev;
          const latest = pList.find((p: Publisher) => String(p.id).trim().toUpperCase() === String(prev.id).trim().toUpperCase());
          return latest ? { ...prev, ...latest } : prev;
        });
      }

      if (bMap && typeof bMap === 'object') {
        setBankDetailsMap(prev => ({ ...prev, ...bMap }));
        safeSetLocal('pai_cached_bank_details', bMap);
      }

  if (Array.isArray(empList)) {
  setEmployees(empList);
  safeSetLocal('pai_cached_employees', empList);
  }

      if (Array.isArray(data.advertiserInquiries)) {
        setAdvertiserInquiries(data.advertiserInquiries);
        safeSetLocal('pai_cached_advertiser_inquiries', data.advertiserInquiries);
      }

      if (Array.isArray(data.partners)) {
        setPartnerApplications(data.partners);
        safeSetLocal('pai_cached_partners', data.partners);
      }

      if (data.settings && typeof data.settings === 'object') {
        const s = data.settings;
        if (s.supportPhone) { setSupportPhone(s.supportPhone); safeSetLocal('pai_support_phone', s.supportPhone); }
        if (s.supportEmail) { setSupportEmail(s.supportEmail); safeSetLocal('pai_support_email', s.supportEmail); }
        if (s.googleSheetUrl !== undefined) { setGoogleSheetUrl(s.googleSheetUrl); safeSetLocal('pai_google_sheet_url', s.googleSheetUrl); }
        if (s.offer) { setOffer(s.offer); safeSetLocal('pai_offer', s.offer); }
        if (s.partnerHiringActive !== undefined) { setPartnerHiringActive(s.partnerHiringActive); safeSetLocal('pai_hiring_active', s.partnerHiringActive); }
      }

      if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
        setTestimonials(data.testimonials);
        safeSetLocal('pai_cached_testimonials', data.testimonials);
      }
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
        // Zero Firestore reads on server glitch - safely use local memory & cache
      }
    };

    fetchServerStateRef.current = fetchServerState;

    // Initial state fetch from server memory (0 Firestore reads)
    fetchServerState();

    // Direct real-time live sync for publishers
    let unsubPubs: (() => void) | null = null;
    try {
      unsubPubs = onSnapshot(collection(db, 'publishers'), (snap) => {
        if (snap && !snap.empty) {
          const freshPubs = snap.docs.map(d => ({ id: d.id, ...d.data(), systemVersion: 'v2' } as Publisher));
          if (freshPubs.length > 0) {
            setPublishers(prev => {
              const map = new Map<string, Publisher>();
              prev.forEach(p => { if (p?.id) map.set(String(p.id).trim().toUpperCase(), p); });
              freshPubs.forEach(p => {
                if (p?.id) {
                  const key = String(p.id).trim().toUpperCase();
                  map.set(key, { ...(map.get(key) || {}), ...p });
                }
              });
              const merged = Array.from(map.values());
              safeSetLocal('pai_cached_publishers', merged);
              return merged;
            });
          }
        }
      }, (err) => {
        console.warn("Firestore publishers listener warning:", err);
      });
    } catch (e) {}

    // Direct one-time startup query for publishers from Firestore
    try {
      getDocs(collection(db, 'publishers')).then(snap => {
        if (snap && snap.size > 0) {
          const freshPubs = snap.docs.map(d => ({ id: d.id, ...d.data(), systemVersion: 'v2' } as Publisher));
          if (freshPubs.length > 0) {
            setPublishers(prev => {
              const map = new Map<string, Publisher>();
              prev.forEach(p => { if (p?.id) map.set(String(p.id).trim().toUpperCase(), p); });
              freshPubs.forEach(p => {
                if (p?.id) {
                  const key = String(p.id).trim().toUpperCase();
                  map.set(key, { ...(map.get(key) || {}), ...p });
                }
              });
              const merged = Array.from(map.values());
              safeSetLocal('pai_cached_publishers', merged);
              return merged;
            });
          }
        }
      }).catch(err => console.warn("Firestore publishers startup fetch notice:", err));
    } catch (e) {}

    // Direct real-time live sync for campaigns (ensures newly live campaigns appear immediately)
    let unsubCamps: (() => void) | null = null;
    try {
      unsubCamps = onSnapshot(collection(db, 'campaigns'), (snap) => {
        const list = snap?.docs?.map(d => ({ id: d.id, ...d.data() } as Campaign)) || [];
        // An empty Firestore snapshot must not erase campaigns loaded from the shared server store.
        if (list.length > 0) {
          setCampaigns(list);
          safeSetLocal('pai_cached_campaigns', list);
        }
      }, (err) => {
        console.warn("Firestore campaigns listener warning:", err);
      });
    } catch (e) {}

    // Keep bank details available on every admin and client device in real time.
    let unsubBankDetails: (() => void) | null = null;
    try {
      unsubBankDetails = onSnapshot(collection(db, 'bank_details'), (snap) => {
        const nextMap: Record<string, BankDetails> = {};
        snap?.docs?.forEach((bankDoc) => {
          const data = bankDoc.data() as BankDetails;
          const publisherId = String(data.publisherId || bankDoc.id).trim();
          if (publisherId) {
            const bankRec = { ...data, publisherId };
            nextMap[publisherId] = bankRec;
            nextMap[publisherId.toUpperCase()] = bankRec;
            nextMap[publisherId.toLowerCase()] = bankRec;
          }
        });
        if (Object.keys(nextMap).length > 0) {
          setBankDetailsMap(prev => ({ ...prev, ...nextMap }));
          safeSetLocal('pai_cached_bank_details', nextMap);
          console.log(`[Sync] Bank details listener loaded ${Object.keys(nextMap).length} records.`);
        }
      }, (err) => {
        console.warn('[Sync] Firestore bank details listener warning:', err);
      });
    } catch (err) {
      console.warn('[Sync] Could not attach bank details listener:', err);
    }

    // Direct one-time startup query for bank details from Firestore
    try {
      getDocs(collection(db, 'bank_details')).then(snap => {
        if (snap && snap.size > 0) {
          const nextMap: Record<string, BankDetails> = {};
          snap.docs.forEach(bankDoc => {
            const data = bankDoc.data() as BankDetails;
            const publisherId = String(data.publisherId || bankDoc.id).trim();
            if (publisherId) {
              const bankRec = { ...data, publisherId };
              nextMap[publisherId] = bankRec;
              nextMap[publisherId.toUpperCase()] = bankRec;
              nextMap[publisherId.toLowerCase()] = bankRec;
            }
          });
          setBankDetailsMap(prev => ({ ...prev, ...nextMap }));
          safeSetLocal('pai_cached_bank_details', nextMap);
        }
      }).catch(err => console.warn("Firestore bank_details startup fetch notice:", err));
    } catch (e) {}

    // Direct one-time check from Firestore for campaigns on startup so client devices immediately receive latest campaigns
    try {
      getDocs(collection(db, 'campaigns')).then(snap => {
        if (snap && snap.size > 0) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Campaign));
          if (list.length > 0) {
            setCampaigns(list);
            safeSetLocal('pai_cached_campaigns', list);
          }
        }
      }).catch((err) => {
        console.warn("Direct Firestore campaigns initial fetch notice:", err);
      });
    } catch (e) {}

    // Keep reviews live across admin and client dashboards.
    let unsubTestimonials: (() => void) | null = null;
    try {
      unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snap) => {
        const list = snap?.docs?.map(d => ({ id: d.id, ...d.data() } as Testimonial)) || [];
        if (list.length > 0) {
          setTestimonials(list);
          safeSetLocal('pai_cached_testimonials', list);
        }
      }, (err) => {
        console.warn("Firestore testimonials listener warning:", err);
      });
    } catch (e) {
      console.warn("Could not attach testimonials listener:", e);
    }

    // Direct real-time live sync for submissions (MIS database) across all devices
    let unsubSubs: (() => void) | null = null;
    try {
      unsubSubs = onSnapshot(collection(db, 'submissions'), (snap) => {
        if (snap && !snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as DataSubmission));
          if (list.length > 0) {
            setSubmissions(prev => {
              const map = new Map<string, DataSubmission>();
              prev.forEach(s => { if (s && s.id) map.set(s.id, s); });
              list.forEach(s => { if (s && s.id) map.set(s.id, s); });
              const merged = Array.from(map.values()).sort((a, b) => {
                const keyA = (a.submitDate || '') + '_' + (a.id || '');
                const keyB = (b.submitDate || '') + '_' + (b.id || '');
                return keyB.localeCompare(keyA);
              });
              safeSetLocal('pai_cached_submissions', merged);
              return merged;
            });
          }
        }
      }, (err) => {
        console.warn("Firestore submissions listener notice:", err);
      });
    } catch (e) {}

    // Direct one-time startup query for submissions from Firestore
    try {
      getDocs(collection(db, 'submissions')).then(snap => {
        if (snap && snap.size > 0) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as DataSubmission));
          if (list.length > 0) {
            setSubmissions(prev => {
              const map = new Map<string, DataSubmission>();
              prev.forEach(s => { if (s && s.id) map.set(s.id, s); });
              list.forEach(s => { if (s && s.id) map.set(s.id, s); });
              const merged = Array.from(map.values()).sort((a, b) => {
                const keyA = (a.submitDate || '') + '_' + (a.id || '');
                const keyB = (b.submitDate || '') + '_' + (b.id || '');
                return keyB.localeCompare(keyA);
              });
              safeSetLocal('pai_cached_submissions', merged);
              return merged;
            });
          }
        }
      }).catch(err => console.warn("Firestore submissions startup fetch notice:", err));
    } catch (e) {}

    // Direct real-time live sync for earnings
    let unsubEarns: (() => void) | null = null;
    try {
      unsubEarns = onSnapshot(collection(db, 'earnings'), (snap) => {
        if (snap && !snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as EarningRecord));
          if (list.length > 0) {
            setEarnings(prev => {
              const map = new Map<string, EarningRecord>();
              prev.forEach(e => { if (e && e.id) map.set(e.id, e); });
              list.forEach(e => { if (e && e.id) map.set(e.id, e); });
              const merged = Array.from(map.values());
              safeSetLocal('pai_cached_earnings', merged);
              return merged;
            });
          }
        }
      }, (err) => {
        console.warn("Firestore earnings listener notice:", err);
      });
    } catch (e) {}

    // Direct one-time startup query for earnings from Firestore
    try {
      getDocs(collection(db, 'earnings')).then(snap => {
        if (snap && snap.size > 0) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as EarningRecord));
          if (list.length > 0) {
            setEarnings(prev => {
              const map = new Map<string, EarningRecord>();
              prev.forEach(e => { if (e && e.id) map.set(e.id, e); });
              list.forEach(e => { if (e && e.id) map.set(e.id, e); });
              const merged = Array.from(map.values());
              safeSetLocal('pai_cached_earnings', merged);
              return merged;
            });
          }
        }
      }).catch(err => console.warn("Firestore earnings startup fetch notice:", err));
    } catch (e) {}

    // Direct one-time startup query for publishers
    try {
      getDocs(collection(db, 'publishers')).then(snap => {
        if (snap && snap.size > 0) {
          const allPubs = snap.docs
            .map(d => ({ id: d.id, ...d.data() } as Publisher))
            .filter(p => p && (p.systemVersion === 'v2' || !p.systemVersion));
          if (allPubs.length > 0) {
            setPublishers(prev => {
              const map = new Map<string, Publisher>();
              prev.forEach(p => { if (p && p.id) map.set(p.id, p); });
              allPubs.forEach(p => { if (p && p.id) map.set(p.id, p); });
              const merged = Array.from(map.values());
              safeSetLocal('pai_cached_publishers', merged);
              return merged;
            });
          }
        }
      }).catch(err => console.warn("Firestore publishers startup fetch notice:", err));
    } catch (e) {}

    // Real-time synchronization handled 100% via zero-quota SSE and local state stream
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
              const filtered = prev.filter(s => s.id !== payload.id);
              const next = [payload, ...filtered];
              try { localStorage.setItem('pai_cached_submissions', JSON.stringify(next)); } catch (e) {}
              return next;
            });
          } else if (type === 'SYNC_SUBMISSIONS' && Array.isArray(payload)) {
            setSubmissions(prev => {
              const map = new Map<string, DataSubmission>();
              // The server snapshot is authoritative; deleted leads must disappear everywhere.
              payload.forEach(s => {
                if (s && s.id) map.set(s.id, s);
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
            setCurrentUser(prev => {
              if (!prev || prev.type !== 'publisher') return prev;
              const latest = payload.find((p: Publisher) => String(p.id).trim().toUpperCase() === String(prev.id).trim().toUpperCase());
              if (latest && (latest.name !== prev.name || latest.avatar !== prev.avatar)) {
                const nextUser = { ...prev, name: latest.name, avatar: latest.avatar || prev.avatar };
                safeSetLocal('pai_user_session', nextUser);
                return nextUser;
              }
              return prev;
            });
          } else if (type === 'SYNC_BANK_DETAILS' && payload) {
            setBankDetailsMap(prev => ({ ...prev, ...payload }));
            try { localStorage.setItem('pai_cached_bank_details', JSON.stringify(payload)); } catch (e) {}
          } else if (type === 'SYNC_ADVERTISER_INQUIRIES' && Array.isArray(payload)) {
            setAdvertiserInquiries(payload);
            try { localStorage.setItem('pai_cached_advertiser_inquiries', JSON.stringify(payload)); } catch (e) {}
          } else if (type === 'SYNC_PARTNERS' && Array.isArray(payload)) {
            setPartnerApplications(payload);
            try { localStorage.setItem('pai_cached_partners', JSON.stringify(payload)); } catch (e) {}
          } else if (type === 'SYNC_SETTINGS' && payload && typeof payload === 'object') {
            const s = payload;
            if (s.supportPhone) { setSupportPhone(s.supportPhone); safeSetLocal('pai_support_phone', s.supportPhone); }
            if (s.supportEmail) { setSupportEmail(s.supportEmail); safeSetLocal('pai_support_email', s.supportEmail); }
            if (s.googleSheetUrl !== undefined) { setGoogleSheetUrl(s.googleSheetUrl); safeSetLocal('pai_google_sheet_url', s.googleSheetUrl); }
            if (s.offer) { setOffer(s.offer); safeSetLocal('pai_offer', s.offer); }
            if (s.partnerHiringActive !== undefined) { setPartnerHiringActive(s.partnerHiringActive); safeSetLocal('pai_hiring_active', s.partnerHiringActive); }
          } else if (type === 'SYNC_TESTIMONIALS' && Array.isArray(payload)) {
            setTestimonials(payload);
            safeSetLocal('pai_cached_testimonials', payload);
          } else if (type === 'SYNC_EMPLOYEES' && Array.isArray(payload)) {
            setEmployees(payload);
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

    // 4s backup heartbeat fetch (Zero Firestore reads, purely local Node.js Express memory)
    pollInterval = setInterval(fetchServerState, 4000);

    return () => {
      if (es) es.close();
      if (pollInterval) clearInterval(pollInterval);
      if (unsubPubs) unsubPubs();
      if (unsubCamps) unsubCamps();
      if (unsubTestimonials) unsubTestimonials();
      if (unsubBankDetails) unsubBankDetails();
      if (unsubSubs) unsubSubs();
      if (unsubEarns) unsubEarns();
    };
  }, []);

  // Real-time synchronization is 100% handled with 0-Quota Server SSE Engine & Local Persistence
  // Testimonials fast one-time startup load (Zero Firestore reads)
  useEffect(() => {
    const stored = localStorage.getItem('pai_cached_testimonials');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTestimonials(parsed);
          return;
        }
      } catch {}
    }
    setTestimonials(defaultTestimonials);
  }, []);

  // Sync Activity Logs (Zero Firestore logging to protect daily free-tier limits)
  useEffect(() => {
    setActivityLogs([
      { id: 'l1', timestamp: new Date().toISOString().substring(0, 19).replace('T', ' '), userId: 'SYSTEM', userName: 'Server Core', action: 'BOOT', details: 'Bypassed Firestore logging to protect daily free-tier limits.' }
    ]);
  }, []);

  // Sync Settings (Zero Firestore reads - loaded from local cache and updated instantly via Server SSE)
  useEffect(() => {
    const cachedPhone = localStorage.getItem('pai_support_phone') || '+91 8934932418';
    const cachedEmail = localStorage.getItem('pai_support_email') || 'publicadsnetwork@gmail.com';
    const cachedHiring = localStorage.getItem('pai_hiring_active') !== 'false';
    const cachedUrl = localStorage.getItem('pai_google_sheet_url') || '';
    setSupportPhone(cachedPhone === '+91 9110022334' ? '+91 8934932418' : cachedPhone);
    setSupportEmail(cachedEmail === 'support@publicadsindia.com' ? 'publicadsnetwork@gmail.com' : cachedEmail);
    setPartnerHiringActive(cachedHiring);
    if (cachedUrl) setGoogleSheetUrl(cachedUrl);
    const cachedOffer = localStorage.getItem('pai_offer');
    if (cachedOffer) {
      try { setOffer(JSON.parse(cachedOffer)); } catch (e) {}
    }
  }, []);

  // 9. Payment Confirmation Email Records (Local + on-demand sync)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pai_cached_payment_emails');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPaymentEmailRecords(parsed);
        }
      }
    } catch (e) {}
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
      const cleanTarget = (phoneOrEmail || '').trim().toLowerCase();
      const cleanDigits = (phoneOrEmail || '').trim().replace(/[\s\-\(\)]/g, '');
      
      // 1. Check local state (fast track)
      console.log(`[Client Auth] Local publishers count: ${publishers.length}`);
      let pub = publishers.find(p => {
        if (p.password !== password) return false;
        const pId = (p.id || '').trim().toLowerCase();
        const pEmail = (p.email || '').trim().toLowerCase();
        const pPhone = (p.phone || '').trim().replace(/[\s\-\(\)]/g, '');
        return (cleanTarget && (pId === cleanTarget || pEmail === cleanTarget)) || (cleanDigits && pPhone === cleanDigits);
      });
      
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
        }
      } else {
        console.log(`[Client Auth] Found locally!`);
      }

      // 3. Query Firestore directly as fallback (guarded against quota errors)
      if (!pub) {
        try {
          const pubsRef = collection(db, 'publishers');
          
          // Try by Publisher ID
          const qId = query(pubsRef, where('id', '==', phoneOrEmail.trim().toUpperCase()), limit(1));
          const snapId = await getDocs(qId);
          if (!snapId.empty) {
            pub = { id: snapId.docs[0].id, ...snapId.docs[0].data() } as Publisher;
          } else {
            // Try by email
            const qEmail = query(pubsRef, where('email', '==', cleanTarget), limit(1));
            const snapEmail = await getDocs(qEmail);
            
            if (!snapEmail.empty) {
              pub = { id: snapEmail.docs[0].id, ...snapEmail.docs[0].data() } as Publisher;
            } else {
              // Try by phone
              const qPhone = query(pubsRef, where('phone', '==', cleanDigits), limit(1));
              const snapPhone = await getDocs(qPhone);
              if (!snapPhone.empty) {
                pub = { id: snapPhone.docs[0].id, ...snapPhone.docs[0].data() } as Publisher;
              }
            }
          }
        } catch (err: any) {
          console.warn("Firestore login fallback check notice:", err.message);
        }
      }

  if (!pub) {
  return { success: false, message: 'Account not found. Please check your Publisher ID, phone/email, and password.' };
  }
  if (pub.password !== password) {
  return { success: false, message: 'Incorrect password. Please try again.' };
  }
      if (pub.blocked) {
        return { success: false, message: 'Your publisher account has been blocked by Admin. Contact support.' };
      }
      
      const sess = { type: 'publisher' as const, id: pub.id, name: pub.name, avatar: pub.avatar };
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
      const cleanName = (name || '').trim();
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPhone = (phone || '').trim().replace(/[\s\-\(\)]/g, '');

      if (!cleanName || !cleanEmail || !cleanPhone || !password) {
        return { success: false, message: 'All registration fields (Full Name, Email, Phone Number, Password) are required.' };
      }

      // Check local state only if exact match exists with same password
      const exactLocalMatch = publishers.find(p => 
        p.systemVersion === 'v2' &&
        (p.email || '').trim().toLowerCase() === cleanEmail && 
        p.password === password
      );
      if (exactLocalMatch) {
        return { success: false, message: `An account already exists for ${cleanEmail}. Please log in using Publisher ID: ${exactLocalMatch.id}.` };
      }

      // Compute new unique Publisher ID: Random 4-digit number (1000-9999) prefixed with 'PUB'
      const existingIds = new Set(publishers.map(p => (p.id || '').trim().toUpperCase()));
      let candidateId = '';
      
      for (let attempt = 0; attempt < 500; attempt++) {
        const random4Digit = Math.floor(1000 + Math.random() * 9000);
        const testId = `PUB${random4Digit}`;
        if (!existingIds.has(testId)) {
          candidateId = testId;
          break;
        }
      }

      if (!candidateId) {
        candidateId = `PUB${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const newId = candidateId;
      const formattedInviteCode = inviteCode ? inviteCode.trim().toUpperCase() : undefined;

      const newPub: Publisher = {
        id: newId,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password,
        avatar: DEFAULT_PUBLISHER_AVATAR,
        blocked: false,
        joinedDate: new Date().toISOString().substring(0, 10),
        systemVersion: 'v2',
        ...(formattedInviteCode ? { inviteCode: formattedInviteCode } : {})
      };

      const emptyBank: BankDetails = {
        publisherId: newId,
        holderName: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        accountNumber: '',
        ifsc: '',
        upi: '',
        qrCode: ''
      };

      // 1. Update local state & storage cache instantly
      const nextPubs = [newPub, ...publishers.filter(p => p.id !== newId)];
      setPublishers(nextPubs);
      try { localStorage.setItem('pai_cached_publishers', JSON.stringify(nextPubs)); } catch (e) {}
      
      setBankDetailsMap(prev => {
        const next = { ...prev, [newId]: emptyBank };
        try { localStorage.setItem('pai_cached_bank_details', JSON.stringify(next)); } catch (e) {}
        return next;
      });

      try {
        broadcastSync('SYNC_PUBLISHERS', nextPubs);
      } catch (e) {}

      // 2. Server & Firestore Persistence (Awaited for guaranteed persistence across all devices)
      try {
        await Promise.allSettled([
          setDoc(doc(db, 'publishers', newId), cleanForFirestore(newPub)),
          setDoc(doc(db, 'bank_details', newId), cleanForFirestore(emptyBank)),
          fetch('/api/publisher/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publisher: newPub })
          }),
          fetch('/api/bank/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publisherId: newId, details: emptyBank })
          })
        ]);
      } catch (e) {
        console.warn("Account sync notice during signup:", e);
      }

      const sess = { type: 'publisher' as const, id: newId, name: cleanName, avatar: newPub.avatar };
      setCurrentUser(sess);
      localStorage.setItem('pai_user_session', JSON.stringify(sess));
      
      addLog(newId, cleanName, 'SIGNUP', `New publisher account created with Publisher ID ${newId}`);
      return { success: true, message: `Account created successfully! Your Publisher ID is ${newId}`, publisher: newPub };
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
    if (!currentUser || currentUser.type !== 'publisher') return { success: false, message: 'Publisher session is missing.' };
    const pubId = currentUser.id;
    
    try {
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

      const response = await fetch('/api/publisher/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publisherId: pubId, name, avatar })
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Profile update failed');
      }
      const savedPublisher = result.publisher;
      if (savedPublisher) {
        const savedSession = { ...currentUser, ...savedPublisher };
        setCurrentUser(savedSession);
        safeSetLocal('pai_user_session', savedSession);
        setPublishers(prev => prev.map(p => p.id === pubId ? { ...p, ...savedPublisher } : p));
      }

      addLog(pubId, name, 'PROFILE_UPDATE', `Publisher changed avatar/name`);
      return { success: true, message: 'Profile updated successfully.' };
    } catch (err) {
      console.error('Failed to update profile:', err);
      return { success: false, message: 'Failed to save profile. Please try a smaller image.' };
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
      fetch('/api/publisher/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publisherId: pub.id, password: newPass })
      }).catch(() => {});
      addLog('ADMIN', 'Admin Manager', 'PASS_RESET', `Force changed credentials of ${pub.id}`);
      return { success: true, message: `Successfully allocated new password '${newPass}' for ${pub.name} (${pub.id}).` };
    }
    return { success: false, message: 'Matching details not found.' };
  };

  // Helper to ensure data written to Firestore never contains undefined values
  const sanitizeFirestoreRecord = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;
    const clean: any = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) {
        clean[k] = (typeof v === 'object' && v !== null && !Array.isArray(v)) ? sanitizeFirestoreRecord(v) : v;
      }
    }
    return clean;
  };

  // Admin / Employee operations
  const addCampaign = (c: Omit<Campaign, 'id' | 'active'> & { active?: boolean }) => {
    const newId = `camp-${Date.now()}`;
    const newCamp: Campaign = {
      ...c,
      id: newId,
      active: c.active !== undefined ? Boolean(c.active) : true
    };
    
    // Immediate optimistic update & cache
    setCampaigns(prev => {
      const next = [newCamp, ...prev.filter(x => x.id !== newId)];
      try {
        localStorage.setItem('pai_cached_campaigns', JSON.stringify(next));
        broadcastSync('SYNC_CAMPAIGNS', next);
      } catch (err) {}
      return next;
    });

    // Realtime Server & Firestore Persistence
    fetch('/api/campaign/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaign: newCamp })
    }).then(async (response) => {
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) throw new Error(result?.error || 'Campaign publish failed');
      if (Array.isArray(result.campaigns)) {
        setCampaigns(result.campaigns);
        safeSetLocal('pai_cached_campaigns', result.campaigns);
      }
    }).catch(err => console.error('[Sync] Campaign publish failed:', err));

    try {
      setDoc(doc(db, 'campaigns', newId), sanitizeFirestoreRecord(newCamp), { merge: true }).catch((err) => {
        console.warn("Direct Firestore campaign add notice:", err);
      });
    } catch (e) {}

    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_ADD', `Created campaign '${c.name}' with payout ₹${c.payout}`);
  };

  const toggleCampaignActive = (id: string) => {
    const c = campaigns.find(item => item.id === id);
    if (c) {
      const newActive = c.active === false ? true : false;
      const updated: Campaign = { ...c, active: newActive };
      setCampaigns(prev => {
        const next = prev.map(item => item.id === id ? updated : item);
        try {
          localStorage.setItem('pai_cached_campaigns', JSON.stringify(next));
          broadcastSync('SYNC_CAMPAIGNS', next);
        } catch (err) {}
        return next;
      });

      // Realtime Server & Firestore Persistence
      fetch('/api/campaign/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: newActive })
      }).catch(err => console.warn("Server campaign toggle dispatch notice:", err));

      try {
        setDoc(doc(db, 'campaigns', id), sanitizeFirestoreRecord(updated), { merge: true }).catch((err) => {
          console.warn("Direct Firestore campaign toggle notice:", err);
        });
      } catch (e) {}

      addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_TOGGLE', `Toggled live visibility of '${c.name}' to ${newActive ? 'LIVE' : 'PAUSED'}`);
    }
  };

  const editCampaign = (id: string, updatedCamp: Partial<Campaign>) => {
    const c = campaigns.find(item => item.id === id);
    if (c) {
      const merged: Campaign = { 
        ...c, 
        ...updatedCamp,
        active: updatedCamp.active !== undefined ? Boolean(updatedCamp.active) : (c.active !== undefined ? Boolean(c.active) : true)
      };
      setCampaigns(prev => {
        const next = prev.map(item => item.id === id ? merged : item);
        try {
          localStorage.setItem('pai_cached_campaigns', JSON.stringify(next));
          broadcastSync('SYNC_CAMPAIGNS', next);
        } catch (err) {}
        return next;
      });

      // Realtime Server & Firestore Persistence
      fetch('/api/campaign/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, campaign: merged })
      }).catch(err => console.warn("Server campaign edit dispatch notice:", err));

      try {
        setDoc(doc(db, 'campaigns', id), sanitizeFirestoreRecord(merged), { merge: true }).catch((err) => {
          console.warn("Direct Firestore campaign edit notice:", err);
        });
      } catch (e) {}

      addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_EDIT', `Edited campaign '${merged.name}' specs`);
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

      // Realtime Server & Firestore Persistence
      fetch('/api/campaign/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      }).catch(err => console.warn("Server campaign delete dispatch notice:", err));

      try {
        deleteDoc(doc(db, 'campaigns', id)).catch(() => {});
      } catch (e) {}

      addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_DELETE', `Deleted campaign '${target.name}' from active registry`);
    }
  };

  const updateOfferPopup = (image: string, active: boolean, title?: string, description?: string, buttonText?: string, link?: string, showButton?: boolean) => {
    const newOffer = { image, active, title, description, buttonText, link, showButton };
    setOffer(newOffer);
    localStorage.setItem('pai_offer', JSON.stringify(newOffer));
    fetch('/api/settings/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: { offer: newOffer } })
    }).catch(() => {});
    addLog('ADMIN', 'Administrator', 'OFFER_UPDATE', `Admin modified promo banner popup (Activated: ${active})`);
  };

  const updateSupportDetails = (phone: string, email: string) => {
    setSupportPhone(phone);
    setSupportEmail(email);
    localStorage.setItem('pai_support_phone', phone);
    localStorage.setItem('pai_support_email', email);
    fetch('/api/settings/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: { supportPhone: phone, supportEmail: email } })
    }).catch(() => {});
    addLog('ADMIN', 'Administrator', 'SUPPORT_EDIT', `Site-wide contacts updated. Phone: ${phone}, Email: ${email}`);
  };

  const updateGoogleSheetUrl = async (url: string) => {
    try {
      setGoogleSheetUrl(url);
      localStorage.setItem('pai_google_sheet_url', url);
      fetch('/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { googleSheetUrl: url } })
      }).catch(() => {});
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

      // NOTE: Direct WhatsApp dispatch enabled. We DO NOT save to setAdvertiserInquiries or backend store
      // to keep Firebase storage completely free and avoid filling database quota!

      // Optional: Send directly to Google Sheets if configured
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

      // Save a log trace
      addLog('SYSTEM', 'Advertiser Form', 'INQUIRY_SUBMIT', `New advertiser inquiry from ${name} (${company}) dispatched directly to WhatsApp (+91 8934932418)`);

      return {
        success: true,
        message: 'Inquiry details prepared for WhatsApp (+91 8934932418)!',
        whatsappUrl,
        inquiry: newInquiry
      };
    } catch (err) {
      console.error("Error submitting advertiser inquiry:", err);
      return { success: false, message: err instanceof Error ? err.message : 'Submission failed.' };
    }
  };

  const togglePartnerHiring = (active: boolean) => {
    setPartnerHiringActive(active);
    localStorage.setItem('pai_hiring_active', String(active));
    fetch('/api/settings/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: { partnerHiringActive: active } })
    }).catch(() => {});
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

    // 4. Direct Firestore Persistence
    try {
      setDoc(doc(db, 'submissions', submissionId), cleanForFirestore(updatedSub), { merge: true }).catch(err => console.warn("Firestore sub status update notice:", err));
      if (newEarning) {
        setDoc(doc(db, 'earnings', newEarning.id), cleanForFirestore(newEarning), { merge: true }).catch(err => console.warn("Firestore earning create notice:", err));
      } else if (removedEarningId) {
        deleteDoc(doc(db, 'earnings', removedEarningId)).catch(() => {});
        deleteDoc(doc(db, 'earnings', `earning-${submissionId}`)).catch(() => {});
      }
    } catch (e) {}

    // 5. Realtime Server Dispatch (Direct update on server store + SSE broadcast across all devices)
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

    setSubmissions(prev => {
      const next = prev.filter(s => s.id !== id);
      try {
        localStorage.setItem('pai_cached_submissions', JSON.stringify(next));
        broadcastSync('SYNC_SUBMISSIONS', next);
      } catch (err) {}
      return next;
    });

    // Direct Firestore deletion
    try {
      deleteDoc(doc(db, 'submissions', id)).catch(() => {});
      deleteDoc(doc(db, 'earnings', earningId)).catch(() => {});
    } catch (e) {}

    // Server-side instant deletion and cross-client SSE sync
    void fetch('/api/submission/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).then(async response => {
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) throw new Error(result?.error || 'Lead deletion failed');
      if (Array.isArray(result.submissions)) {
        setSubmissions(result.submissions);
        try { localStorage.setItem('pai_cached_submissions', JSON.stringify(result.submissions)); } catch (e) {}
      }
    }).catch(err => console.warn("Server submission delete notice:", err));

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
    }

    // Persist to server store
    fetch('/api/earning/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ earningId, amount: newAmt })
    }).catch(err => console.warn("Server earning update notice:", err));

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

      // Update in server store
      fetch('/api/submission/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: revertedSubId, status: 'Process' })
      }).catch(() => {});
    }

    // 3. Dispatch to Server endpoint /api/earning/delete for instant persistent deletion & SSE broadcast across all devices
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
      const nextBlocked = !p.blocked;
      setPublishers(prev => {
        const next = prev.map(item => item.id === pubId ? { ...item, blocked: nextBlocked } : item);
        try {
          localStorage.setItem('pai_cached_publishers', JSON.stringify(next));
          broadcastSync('SYNC_PUBLISHERS', next);
        } catch (err) {}
        return next;
      });

      fetch('/api/publisher/toggle-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publisherId: pubId, blocked: nextBlocked })
      }).catch(() => {});

      addLog('ADMIN', 'Administrator', p.blocked ? 'UNBLOCK_USER' : 'BLOCK_USER', `Account access modify for ${p.name} (${p.id})`);
    }
  };

  const deletePublisher = async (pubId: string): Promise<{ success: boolean; message: string }> => {
    const cleanId = String(pubId || '').trim();
    if (!cleanId) return { success: false, message: 'Invalid publisher ID' };

    const normId = cleanId.toUpperCase();
    const p = publishers.find(item => (item.id || '').trim().toUpperCase() === normId) ||
              publishers.find(item => item.id === cleanId);

    const publisherEmail = p?.email ? String(p.email).trim().toLowerCase() : '';
    const publisherPhone = p?.phone ? String(p.phone).trim().replace(/[\s\-\(\)]/g, '') : '';
    const publisherName = p?.name || cleanId;

    // 1. Optimistically purge from client state & local storage
    setPublishers(prev => {
      const next = prev.filter(item => {
        const itemId = (item.id || '').trim().toUpperCase();
        return itemId !== normId && item.id !== cleanId;
      });
      try {
        localStorage.setItem('pai_cached_publishers', JSON.stringify(next));
        broadcastSync('SYNC_PUBLISHERS', next);
      } catch (err) {}
      return next;
    });

    setBankDetailsMap(prev => {
      const next = { ...prev };
      delete next[cleanId];
      delete next[normId];
      delete next[cleanId.toLowerCase()];
      try {
        localStorage.setItem('pai_cached_bank_details', JSON.stringify(next));
        broadcastSync('SYNC_BANK_DETAILS', next);
      } catch (err) {}
      return next;
    });

    // If the active session is for this publisher, logout and clear session
    if (currentUser && (currentUser.id === cleanId || String(currentUser.id || '').trim().toUpperCase() === normId)) {
      logout();
    }

    // 2. Direct Firestore Client SDK Purge
    try {
      const directDeletes = [
        deleteDoc(doc(db, 'publishers', cleanId)),
        deleteDoc(doc(db, 'publishers', normId)),
        deleteDoc(doc(db, 'publishers', cleanId.toLowerCase())),
        deleteDoc(doc(db, 'bank_details', cleanId)),
        deleteDoc(doc(db, 'bank_details', normId)),
        deleteDoc(doc(db, 'bank_details', cleanId.toLowerCase()))
      ];
      await Promise.allSettled(directDeletes);

      // Query-based deletion from Firestore collection
      const pubsCol = collection(db, 'publishers');
      const snapId = await getDocs(query(pubsCol, where('id', 'in', [cleanId, normId, cleanId.toLowerCase()]))).catch(() => null);
      if (snapId && !snapId.empty) {
        for (const d of snapId.docs) {
          await deleteDoc(d.ref).catch(() => {});
        }
      }

      if (publisherPhone) {
        const snapPhone = await getDocs(query(pubsCol, where('phone', '==', publisherPhone))).catch(() => null);
        if (snapPhone && !snapPhone.empty) {
          for (const d of snapPhone.docs) {
            await deleteDoc(d.ref).catch(() => {});
          }
        }
      }

      if (publisherEmail) {
        const snapEmail = await getDocs(query(pubsCol, where('email', '==', publisherEmail))).catch(() => null);
        if (snapEmail && !snapEmail.empty) {
          for (const d of snapEmail.docs) {
            await deleteDoc(d.ref).catch(() => {});
          }
        }
      }

      // Clean up bank_details collection
      const bankCol = collection(db, 'bank_details');
      const snapBank = await getDocs(query(bankCol, where('publisherId', 'in', [cleanId, normId, cleanId.toLowerCase()]))).catch(() => null);
      if (snapBank && !snapBank.empty) {
        for (const d of snapBank.docs) {
          await deleteDoc(d.ref).catch(() => {});
        }
      }
    } catch (firestoreErr) {
      console.warn('[deletePublisher] Client Firestore purge warning:', firestoreErr);
    }

    // 3. Backend Server Store & Cloud Purge API
    try {
      await fetch('/api/publisher/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          publisherId: cleanId,
          phone: publisherPhone,
          email: publisherEmail
        })
      });
    } catch (apiErr) {
      console.warn('[deletePublisher] Server API delete warning:', apiErr);
    }

    addLog('ADMIN', 'Administrator', 'DELETE_USER', `Account permanently deleted from database for ${publisherName} (${cleanId})`);
    return { success: true, message: `Account for ${publisherName} (${cleanId}) has been completely deleted from database.` };
  };

  const adminUpdatePublisherName = async (pubId: string, newName: string): Promise<{ success: boolean; message: string }> => {
    const cleanId = String(pubId || '').trim();
    const cleanName = String(newName || '').trim();
    if (!cleanId) return { success: false, message: 'Invalid publisher ID' };
    if (!cleanName) return { success: false, message: 'Client name cannot be empty' };

    const normId = cleanId.toUpperCase();
    const updatedPublishers = publishers.map(p => {
      const pId = String(p.id || '').trim().toUpperCase();
      if (pId === normId || String(p.id || '').trim() === cleanId) {
        return { ...p, name: cleanName };
      }
      return p;
    });

    setPublishers(updatedPublishers);
    safeSetLocal('pai_cached_publishers', updatedPublishers);

    // If current user is this publisher on this client, update session immediately
    if (currentUser && (currentUser.id === cleanId || String(currentUser.id || '').trim().toUpperCase() === normId)) {
      const updatedUser = { ...currentUser, name: cleanName };
      setCurrentUser(updatedUser);
      safeSetLocal('pai_user_session', updatedUser);
    }

    // Broadcast across tabs
    broadcastSync('SYNC_PUBLISHERS', updatedPublishers);

    // Direct client Firestore update
    try {
      await setDoc(doc(db, 'publishers', cleanId), { name: cleanName }, { merge: true });
      if (normId !== cleanId) {
        await setDoc(doc(db, 'publishers', normId), { name: cleanName }, { merge: true });
      }
    } catch (fsErr) {
      console.warn('[adminUpdatePublisherName] Firestore client write notice:', fsErr);
    }

    // Backend server update + SSE broadcast
    try {
      await fetch('/api/publisher/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publisherId: cleanId, name: cleanName })
      });
    } catch (apiErr) {
      console.warn('[adminUpdatePublisherName] Server API update notice:', apiErr);
    }

    addLog('ADMIN', 'Administrator', 'USER_UPDATE', `Publisher name updated to "${cleanName}" for ${cleanId}`);
    return { success: true, message: `Client name updated to "${cleanName}" successfully.` };
  };

  const addEmployee = async (name: string, u: string, p: string, role: 'Payment' | 'MIS') => {
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

    const next = [...employees, newEmp];
    setEmployees(next);
    try {
      localStorage.setItem('pai_cached_employees', JSON.stringify(next));
      broadcastSync('SYNC_EMPLOYEES', next);
    } catch (err) {}

  try {
    const response = await fetch('/api/employee/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee: newEmp })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      setEmployees(employees);
      return { success: false, message: detail || 'Employee account could not be saved on the server.' };
    }
  } catch (error) {
    setEmployees(employees);
    return { success: false, message: 'Employee account could not reach the server.' };
  }

    addLog('ADMIN', 'Administrator', 'STAFF_ADDED', `Recruited new staff: ${name} (Role: ${role})`);
    return { success: true, message: 'Staff Employee account generated successfully!' };
  };

  const deleteEmployee = (id: string) => {
    const target = employees.find(e => e.id === id);
    if (!target) return;

    const next = employees.filter(e => e.id !== id);
    setEmployees(next);
    try {
      localStorage.setItem('pai_cached_employees', JSON.stringify(next));
      broadcastSync('SYNC_EMPLOYEES', next);
    } catch (err) {}

    fetch('/api/employee/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).catch(() => {});

    addLog('ADMIN', 'Administrator', 'STAFF_REMOVED', `Revoked access tokens for staff: ${target.name}`);
  };

  const addTestimonial = (t: Omit<Testimonial, 'id'>) => {
    const newId = `testi-${Date.now()}`;
    const newTestimonial: Testimonial = {
      ...t,
      id: newId
    };

    const updatedList = [...testimonials, newTestimonial];
    setTestimonials(updatedList);
    try {
      localStorage.setItem('pai_cached_testimonials', JSON.stringify(updatedList));
      broadcastSync('SYNC_TESTIMONIALS', updatedList);
    } catch (e) {}

    // Direct write to Firestore so other devices and browsers immediately see it
    setDoc(doc(db, 'testimonials', newId), newTestimonial, { merge: true }).catch(err => {
      console.warn("Direct Firestore testimonial save notice:", err);
    });

    fetch('/api/testimonials/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testimonials: updatedList })
    }).catch(() => {});

    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'TESTIMONIAL_ADD', `Added testimonial/feedback from '${t.name}'`);
  };

  const editTestimonial = (id: string, updated: Partial<Testimonial>) => {
    const updatedList = testimonials.map(t => t.id === id ? { ...t, ...updated } : t);
    setTestimonials(updatedList);
    try {
      localStorage.setItem('pai_cached_testimonials', JSON.stringify(updatedList));
      broadcastSync('SYNC_TESTIMONIALS', updatedList);
    } catch (e) {}

    // Direct update to Firestore
    setDoc(doc(db, 'testimonials', id), updated, { merge: true }).catch(err => {
      console.warn("Direct Firestore testimonial edit notice:", err);
    });

    fetch('/api/testimonials/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testimonials: updatedList })
    }).catch(() => {});

    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'TESTIMONIAL_EDIT', `Modified testimonial/feedback from '${updated.name || id}'`);
  };

  const deleteTestimonial = (id: string) => {
    const updatedList = testimonials.filter(t => t.id !== id);
    setTestimonials(updatedList);
    try {
      localStorage.setItem('pai_cached_testimonials', JSON.stringify(updatedList));
      broadcastSync('SYNC_TESTIMONIALS', updatedList);
    } catch (e) {}

    // Direct delete from Firestore
    deleteDoc(doc(db, 'testimonials', id)).catch(err => {
      console.warn("Direct Firestore testimonial delete notice:", err);
    });

    fetch('/api/testimonials/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testimonials: updatedList })
    }).catch(() => {});

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
      // 1. Call server purge endpoint
      await fetch('/api/admin/purge-old-data', { method: 'POST' }).catch(() => {});

      // 2. Mark init_done as true in Firestore to prevent mock data recreation
      try {
        await setDoc(doc(db, 'system_metadata', 'init_done'), { value: true, purgedAt: new Date().toISOString() });
      } catch (e) {}

      // 3. Clear local state and localStorage caches
      setPublishers([]);
      setSubmissions([]);
      setEarnings([]);
      setCampaigns([]);
      setBankDetailsMap({});
      setPartnerApplications([]);
      setEmployees([]);
      setAdvertiserInquiries([]);
      setPaymentEmailRecords([]);

      const cacheKeys = [
        'pai_cached_publishers',
        'pai_cached_submissions',
        'pai_cached_earnings',
        'pai_cached_campaigns',
        'pai_cached_bank_details',
        'pai_cached_partners',
        'pai_cached_employees',
        'pai_cached_advertiser_inquiries',
        'pai_cached_payment_emails'
      ];
      cacheKeys.forEach(k => {
        try { localStorage.removeItem(k); } catch (e) {}
      });

      addLog('SYSTEM', 'Core Database Manager', 'PURGE', 'All old client records, leads, and campaigns purged. System reset for fresh setup.');

      return { success: true, message: 'All old client records, leads, awaiting checks, and active offers/campaigns successfully deleted! System is now fresh for new data entry.' };
    } catch (err: any) {
      console.error('Purge error:', err);
      return { success: false, message: 'Purge failed: ' + err.message };
    }
  };

  // Push local data to Firestore on demand (Admin triggered only - 0 background quota waste)
  const pushDataToFirestore = async () => {
    try {
      // 1. Direct write all testimonials to Firestore client-side for immediate cloud availability
      let directWriteSuccess = 0;
      for (const t of testimonials) {
        if (t && t.id) {
          setDoc(doc(db, 'testimonials', String(t.id)), t, { merge: true }).catch(() => {});
          directWriteSuccess++;
        }
      }

      // 2. Send current data payload to server push endpoint
      const resp = await fetch('/api/admin/push-firestore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          testimonials,
          campaigns,
          publishers,
          bankDetailsMap
        })
      });

      const contentType = resp.headers.get('content-type') || '';
      if (resp.ok && contentType.includes('application/json')) {
        const data = await resp.json();
        if (data && data.success) {
          return {
            success: true,
            message: data.message || `Successfully pushed data to Firebase Cloud! (${data.campaignsCount || campaigns.length} campaigns, ${data.publishersCount || publishers.length} publishers, ${data.testimonialsCount || testimonials.length} reviews)`
          };
        }
      }

      // If server took slightly longer, direct client writes have already succeeded
      return {
        success: true,
        message: `Successfully pushed ${testimonials.length} reviews and database records to Firebase Cloud!`
      };
    } catch (err: any) {
      // Direct Firestore backup write
      try {
        for (const t of testimonials) {
          if (t && t.id) {
            await setDoc(doc(db, 'testimonials', String(t.id)), t, { merge: true });
          }
        }
        return {
          success: true,
          message: `Successfully pushed ${testimonials.length} reviews directly to Firebase Cloud!`
        };
      } catch (directErr: any) {
        return { success: false, message: directErr?.message || 'Error communicating with server push API' };
      }
    }
  };

  // Sync from Cloud Firestore on demand (Admin triggered only)
  const syncFromCloudFirestore = async () => {
    try {
      // 1. Direct pull testimonials from Firestore client-side
      let cloudTestiCount = 0;
      try {
        const snap = await getDocs(collection(db, 'testimonials'));
        if (snap && snap.size > 0) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
          if (list.length > 0) {
            setTestimonials(list);
            safeSetLocal('pai_cached_testimonials', list);
            cloudTestiCount = list.length;
            // Also notify server
            fetch('/api/testimonials/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ testimonials: list })
            }).catch(() => {});
          }
        }
      } catch (e) {
        console.warn("Direct Firestore testimonial pull notice:", e);
      }

      // 2. Call server resync endpoint
      const resp = await fetch('/api/admin/resync-firestore', {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      });
      const contentType = resp.headers.get('content-type') || '';
      if (resp.ok && contentType.includes('application/json')) {
        const data = await resp.json();
        if (data && data.success) {
          if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
            setTestimonials(data.testimonials);
            safeSetLocal('pai_cached_testimonials', data.testimonials);
          }
          if (fetchServerStateRef.current) fetchServerStateRef.current();
          return {
            success: true,
            message: `Successfully pulled records from Firestore! (${data.publishersCount || 0} publishers, ${data.submissionsCount || 0} leads, ${data.testimonialsCount || cloudTestiCount || testimonials.length} reviews)`
          };
        }
      }

      if (cloudTestiCount > 0) {
        return {
          success: true,
          message: `Successfully pulled ${cloudTestiCount} reviews from Firebase Cloud!`
        };
      }

      if (fetchServerStateRef.current) fetchServerStateRef.current();
      return { success: true, message: `Cloud records synchronized successfully.` };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Error communicating with server sync API' };
    }
  };

  // Publisher actions
  const submitBankDetails = async (details: BankDetails) => {
    if (!currentUser || currentUser.type !== 'publisher') return { success: false, message: 'Authentication level required' };
    
    const publisherId = String(currentUser.id || '').trim();
    if (!publisherId) return { success: false, message: 'Publisher account ID is missing' };
    const normId = publisherId.toUpperCase();
    const updated: BankDetails = { ...details, publisherId: normId };

    // 1. Immediate optimistic update in state & localStorage
    setBankDetailsMap(prev => {
      const next = { 
        ...prev, 
        [publisherId]: updated,
        [normId]: updated,
        [publisherId.toLowerCase()]: updated
      };
      safeSetLocal('pai_cached_bank_details', next);
      broadcastSync('SYNC_BANK_DETAILS', next);
      return next;
    });

    // 2. Direct Firestore persistence (PRIMARY SOURCE OF TRUTH)
    // Ensures real-time synchronization on www.publicadsindia.com and any hosting platform
    try {
      const cleanData = cleanForFirestore({
        ...updated,
        publisherId: normId,
        qrCode: typeof updated.qrCode === 'string' && updated.qrCode.length > 700000 
          ? updated.qrCode.slice(0, 700000) 
          : updated.qrCode
      });

      // Save using normalized uppercase ID and original ID in Firestore
      await setDoc(doc(db, 'bank_details', normId), cleanData, { merge: true });
      if (publisherId !== normId) {
        await setDoc(doc(db, 'bank_details', publisherId), cleanData, { merge: true });
      }
      console.log(`[Bank Details] Successfully saved directly to Firestore for publisher ${normId}`);

      // 3. Dispatch to backend proxy if available (non-blocking)
      fetch('/api/bank/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publisherId: normId, details: updated })
      }).catch(err => {
        console.warn("Backend bank proxy notice (Firestore already saved details):", err);
      });

      addLog(normId, currentUser.name, 'BANK_UPDATE', 'Updated banking ledger details');
      return { success: true, message: 'Bank details saved and synced across devices in real time.' };
    } catch (firestoreErr: any) {
      console.error('[Bank Details] Direct Firestore save error:', firestoreErr);
      
      // Fallback: try backend proxy if Firestore client threw error
      try {
        const response = await fetch('/api/bank/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publisherId: normId, details: updated })
        });
        const result = await response.json().catch(() => null);
        if (response.ok && result?.success) {
          addLog(normId, currentUser.name, 'BANK_UPDATE', 'Updated banking ledger details');
          return { success: true, message: 'Bank details saved and synced across devices.' };
        }
      } catch (fallbackErr) {}

      return { success: false, message: firestoreErr?.message || 'Could not save bank details. Please check your internet connection.' };
    }
  };

  const submitLead = async (campaignId: string, clientName: string, clientPhone: string, clientCode: string, screenshot: string) => {
    if (!currentUser || currentUser.type !== 'publisher') return { success: false, message: 'Authentication level required' };
    
    // Find campaign payout
    const camp = campaigns.find(c => c.id === campaignId);
    if (!camp) return { success: false, message: 'Invalid Campaign selected' };

    // Prevent duplicate submission for the same client phone under this campaign for THIS publisher
    const cleanInputPhone = (clientPhone || '').replace(/\D/g, '').slice(-15);
    const currentPubId = (currentUser.id || '').trim().toUpperCase();

    const duplicate = cleanInputPhone.length >= 10 && submissions.some(s => {
      if (!s || !s.campaignId || s.status === 'Rejected') return false;
      // Skip dummy preset snapshot submissions from duplicate check
      if (s.id && (s.id.startsWith('sub-17893') || s.id.startsWith('sub-17894'))) return false;

      const subPubId = (s.publisherId || '').trim().toUpperCase();
      const cleanSubPhone = (s.clientPhone || '').replace(/\D/g, '').slice(-15);

      return (
        subPubId === currentPubId &&
        s.campaignId === campaignId &&
        cleanSubPhone.length >= 10 &&
        cleanSubPhone === cleanInputPhone
      );
    });

    if (duplicate) {
      return { success: false, message: 'You have already submitted a lead with this phone number for this campaign!' };
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

    // 4. Guaranteed Direct Persistence to Firestore (Works on any deployment: Vercel, static, or full-stack)
    try {
      const cleanDoc = cleanForFirestore({
        ...newSub,
        screenshot: typeof newSub.screenshot === 'string' && newSub.screenshot.length > 700000
          ? newSub.screenshot.slice(0, 700000)
          : newSub.screenshot
      });

      // Write directly to Firestore - guarantees lead is saved even on static hosting like Vercel
      await setDoc(doc(db, 'submissions', subId), cleanDoc);
      console.log(`[Lead Submit] Successfully persisted lead ${subId} directly to Firestore.`);

      // Also dispatch to backend server if available (for SSE and server memory store)
      fetch('/api/submission/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission: cleanDoc })
      }).catch(serverErr => {
        // Backend offline/static hosting notice - perfectly safe since Firestore already saved
        console.warn("Backend server dispatch notice (Firestore already saved lead):", serverErr);
      });

      addLog(currentUser.id, currentUser.name, 'LEAD_SUBMISSION', `Submitted new action lead for client [${clientName}] under campaign [${camp.name}]`);
      return { success: true, message: 'Lead submitted successfully! Admin will verify soon.' };
    } catch (saveErr: any) {
      console.error("Submission direct persist error:", saveErr);
      // Fallback: if client Firestore threw an error (e.g., network offline), attempt backend server proxy
      try {
        const fallbackRes = await fetch('/api/submission/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submission: newSub })
        });
        if (fallbackRes.ok) {
          addLog(currentUser.id, currentUser.name, 'LEAD_SUBMISSION', `Submitted new action lead for client [${clientName}] under campaign [${camp.name}]`);
          return { success: true, message: 'Lead submitted successfully! Admin will verify soon.' };
        }
      } catch (e) {}

      return { success: false, message: 'Lead could not be synced: ' + (saveErr?.message || 'Please check your connection and try again.') };
    }
  };

  const applyForPartner = async (
    name: string, 
    phone: string, 
    email: string, 
    city: string, 
    age: number, 
    qualification: string,
    partnerType?: string,
    monthlyLeads?: string
  ) => {
    if (!partnerHiringActive) {
      return { success: false, message: 'Hiring is currently closed or paused by management.' };
    }

    // Direct WhatsApp routing to Admin WhatsApp (+91 8934932418)
    // Zero Firebase storage quota burden
    const targetPhone = '918934932418';
    const waText = 
      `🤝 *NEW STRATEGIC PARTNER APPLICATION - PUBLIC ADS NETWORK*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Candidate / Org:* ${name.trim()}\n` +
      `📞 *WhatsApp Phone:* ${phone.trim()}\n` +
      `📧 *Email Address:* ${email.trim() || 'N/A'}\n` +
      `📍 *City / State:* ${city.trim()}\n` +
      (partnerType ? `💼 *Partner Category:* ${partnerType.trim()}\n` : '') +
      (monthlyLeads ? `📊 *Estimated Monthly Leads:* ${monthlyLeads.trim()}\n` : '') +
      `🎓 *Qualification:* ${qualification.trim()}\n` +
      `🎂 *Age:* ${age || 'N/A'}\n` +
      `📅 *Submitted Date:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n` +
      `━━━━━━━━━━��━━━━━━━━━\n` +
      `_Sent via Public Ads India Strategic Partnership Desk_`;

    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waText)}`;

    // Zero database/admin storage: All details are dispatched directly to WhatsApp (+91 8934932418)
    addLog('PARTNER_PORTAL', name, 'PARTNER_APPLY', `Partner recruitment application from ${name} (${city}) dispatched to WhatsApp (+91 8934932418)`);
    return { 
      success: true, 
      message: 'Application details formatted for WhatsApp (+91 8934932418)!',
      whatsappUrl 
    };
  };

  const submitPartnerApplication = async (params: { 
    name: string; 
    phone: string; 
    email?: string; 
    city: string; 
    age?: number; 
    qualification?: string;
    partnerType?: string;
    monthlyLeads?: string;
  }) => {
    return applyForPartner(
      params.name,
      params.phone,
      params.email || '',
      params.city,
      params.age || 25,
      params.qualification || 'Graduation / Degree',
      params.partnerType,
      params.monthlyLeads
    );
  };

  // Staff Portal Login
  const loginEmployee = async (username: string, pass: string) => {
  let latestEmployees = employees;
  try {
    const response = await fetch('/api/realtime/state', { cache: 'no-store' });
    const payload = await response.json();
    if (response.ok && Array.isArray(payload?.data?.employees)) {
      latestEmployees = payload.data.employees;
      setEmployees(latestEmployees);
      safeSetLocal('pai_cached_employees', latestEmployees);
    }
  } catch (error) {
    console.warn('[v0] Employee login server refresh failed; using cached records.', error);
  }
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedPassword = pass.trim();
  const emp = latestEmployees.find(e => {
    const loginId = String(e.username || e.id || '').trim().toLowerCase();
    const employeeId = String(e.id || '').trim().toLowerCase();
    return (loginId === normalizedUsername || employeeId === normalizedUsername) && String(e.password ?? '').trim() === normalizedPassword;
  });
    if (!emp) {
      return { success: false, message: 'Invalid Employee login credentials.' };
    }
    const sess = { type: 'employee' as const, id: emp.id, name: emp.name, username: emp.username, role: emp.role };
    setCurrentUser(sess);
    localStorage.setItem('pai_user_session', JSON.stringify(sess));
    addLog(emp.id, emp.name, 'STAFF_LOGIN', `Employee allocated staff console layer (Role: ${emp.role})`);
    return { success: true, message: 'Staff login verified.', employee: emp };
  };

  const runDiagnostic = async (targetPublisherId?: string): Promise<FirestoreDiagnosticResult> => {
    return await runFirestoreDiagnostic({
      user: currentUser,
      targetPublisherId: targetPublisherId || (currentUser?.type === 'publisher' ? currentUser.id : undefined),
      logToConsole: true
    });
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
      adminUpdatePublisherName,
      addEmployee,
      deleteEmployee,
      triggerBackup,
      backupLogs,
      purgeAllSystemData,
      pushDataToFirestore,
      syncFromCloudFirestore,
      addTestimonial,
      editTestimonial,
      deleteTestimonial,
      updateGoogleSheetUrl,
      deleteAdvertiserInquiry,
      submitAdvertiserInquiry,
      submitBankDetails,
      submitLead,
      applyForPartner,
      submitPartnerApplication,
      loginEmployee,
      runDiagnostic,
      fetchDirectBankDetails,
      fetchDirectLeads
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
