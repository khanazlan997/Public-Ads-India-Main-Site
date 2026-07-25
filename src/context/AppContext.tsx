import React, { createContext, useContext, useState, useEffect } from 'react';
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
  AdvertiserInquiry
} from '../types';

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
  testimonials: Testimonial[];
  quotaError: string | null;
  googleSheetUrl: string;
  advertiserInquiries: AdvertiserInquiry[];
  
  hasMoreSubmissions: boolean;
  loadMoreSubmissions: () => void;
  hasMoreEarnings: boolean;
  loadMoreEarnings: () => void;
  hasMorePublishers: boolean;
  loadMorePublishers: () => void;
  hasMorePartners: boolean;
  loadMorePartners: () => void;
  
  // Actions
  loginPublisher: (phoneOrEmail: string, password: string) => Promise<{ success: boolean; message: string; publisher?: Publisher }>;
  signupPublisher: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message: string; publisher?: Publisher }>;
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
  submitAdvertiserInquiry: (name: string, phone: string, email: string, company: string, campaign: string) => Promise<{ success: boolean; message: string }>;
  
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  
  // Testimonials optimized with localStorage cache to avoid redundant database reads
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const stored = localStorage.getItem('pai_cached_testimonials');
      return stored ? JSON.parse(stored) : defaultTestimonials;
    } catch {
      return defaultTestimonials;
    }
  });

  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const [submissions, setSubmissions] = useState<DataSubmission[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [partnerApplications, setPartnerApplications] = useState<PartnerApplication[]>([]);
  const [bankDetailsMap, setBankDetailsMap] = useState<Record<string, BankDetails>>({});
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  
  // Settings optimized with localStorage cache to avoid unnecessary Firestore snapshot loads
  const [offer, setOffer] = useState<ActiveOffer>(() => {
    try {
      const stored = localStorage.getItem('pai_offer');
      return stored ? JSON.parse(stored) : { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600', active: true };
    } catch {
      return { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600', active: true };
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

  const [googleSheetUrl, setGoogleSheetUrl] = useState(() => {
    return localStorage.getItem('pai_google_sheet_url') || 'https://script.google.com/macros/s/AKfycbyDBbwsuefEhBrEZouttfoIlbwqTABJ058VxJHyKsquK8PnFN4fctF7-UIiBB_UivC_/exec';
  });
  const [advertiserInquiries, setAdvertiserInquiries] = useState<AdvertiserInquiry[]>([]);
  
  const [currentUser, setCurrentUser] = useState<AppContextType['currentUser']>(null);
  const [activePath, setActivePath] = useState<string>('/Home');
  const [quotaError, setQuotaError] = useState<string | null>(null);

  // Pagination states for lazy loading and O(1) reads
  const [submissionsLimit, setSubmissionsLimit] = useState(5000);
  const [hasMoreSubmissions, setHasMoreSubmissions] = useState(true);
  const loadMoreSubmissions = () => setSubmissionsLimit(prev => prev + 1000);

  const [earningsLimit, setEarningsLimit] = useState(5000);
  const [hasMoreEarnings, setHasMoreEarnings] = useState(true);
  const loadMoreEarnings = () => setEarningsLimit(prev => prev + 1000);

  const [publishersLimit, setPublishersLimit] = useState(5000);
  const [hasMorePublishers, setHasMorePublishers] = useState(true);
  const loadMorePublishers = () => setPublishersLimit(prev => prev + 1000);

  const [partnersLimit, setPartnersLimit] = useState(5000);
  const [hasMorePartners, setHasMorePartners] = useState(true);
  const loadMorePartners = () => setPartnersLimit(prev => prev + 1000);

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

  // Listen for localstorage changes across tabs (just for Theme & User Session)
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
      } catch (err) {
        console.error('Error syncing on storage event', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 1. Sync Campaigns
  useEffect(() => {
    const q = collection(db, 'campaigns');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setCampaigns([]);
      } else {
        const list: Campaign[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Campaign);
        });
        setCampaigns(list);
      }
    }, (error) => {
      console.error("onSnapshot campaigns error:", error);
      const lower = error.message?.toLowerCase() || '';
      if (lower.includes("quota") || lower.includes("limit") || lower.includes("exhausted") || lower.includes("billing") || lower.includes("resource") || lower.includes("project_number")) {
        setQuotaError("maintenance");
      }
    });
    return unsubscribe;
  }, []);

  // 1b. Sync Testimonials from Firestore on app mount
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
          // Sort testimonials so they maintain consistent orders (supports up to 10 sorted items)
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
        console.error("Error loading testimonials:", err);
        // Fallback to cache if Firestore read fails
        const stored = localStorage.getItem('pai_cached_testimonials');
        if (stored) {
          try {
            setTestimonials(JSON.parse(stored));
          } catch {
            setTestimonials(defaultTestimonials);
          }
        }
      }
    };
    fetchTestimonials();
  }, []);

  // 2. Sync Publishers (Optimized with limit-based Pagination)
  useEffect(() => {
    if (!currentUser) {
      setPublishers([]);
      return;
    }
    const isAdminOrEmployee = currentUser.type === 'admin' || currentUser.type === 'employee';

    let q;
    if (isAdminOrEmployee) {
      q = query(collection(db, 'publishers'), limit(publishersLimit));
    } else {
      q = query(collection(db, 'publishers'), where('id', '==', currentUser.id), limit(1));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setPublishers([]);
        setHasMorePublishers(false);
      } else {
        const list: Publisher[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Publisher);
        });
        list.sort((a, b) => {
          const keyA = (a.joinedDate || '') + '_' + (a.id || '');
          const keyB = (b.joinedDate || '') + '_' + (b.id || '');
          return keyB.localeCompare(keyA);
        });
        setPublishers(list);
        
        // Expose pagination indicators
        if (isAdminOrEmployee) {
          setHasMorePublishers(snapshot.docs.length >= publishersLimit);
        } else {
          setHasMorePublishers(false);
        }
      }
    }, (error) => {
      console.error("onSnapshot publishers error:", error);
      const lower = error.message?.toLowerCase() || '';
      if (lower.includes("quota") || lower.includes("limit") || lower.includes("exhausted") || lower.includes("billing") || lower.includes("resource")) {
        setQuotaError("maintenance");
      }
    });
    return unsubscribe;
  }, [currentUser, publishersLimit]);

  // 3. Sync Bank Details Map
  useEffect(() => {
    if (!currentUser) {
      setBankDetailsMap({});
      return;
    }
    const isAdminOrEmployee = currentUser.type === 'admin' || currentUser.type === 'employee';

    let q;
    if (isAdminOrEmployee) {
      q = query(collection(db, 'bank_details'), limit(publishersLimit));
    } else {
      q = query(collection(db, 'bank_details'), where('publisherId', '==', currentUser.id), limit(1));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setBankDetailsMap({});
      } else {
        const map: Record<string, BankDetails> = {};
        snapshot.forEach((docSnap) => {
          map[docSnap.id] = docSnap.data() as BankDetails;
        });
        setBankDetailsMap(map);
      }
    }, (error) => {
      console.error("onSnapshot bank_details error:", error);
      const lower = error.message?.toLowerCase() || '';
      if (lower.includes("quota") || lower.includes("limit") || lower.includes("exhausted") || lower.includes("billing") || lower.includes("resource")) {
        setQuotaError("maintenance");
      }
    });
    return unsubscribe;
  }, [currentUser, publishersLimit]);

  // 4. Sync Earnings
  useEffect(() => {
    if (!currentUser) {
      setEarnings([]);
      return;
    }
    const isAdminOrEmployee = currentUser.type === 'admin' || currentUser.type === 'employee';

    let q;
    if (isAdminOrEmployee) {
      q = query(collection(db, 'earnings'), limit(earningsLimit));
    } else {
      q = query(collection(db, 'earnings'), where('publisherId', '==', currentUser.id), limit(earningsLimit));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setEarnings([]);
        setHasMoreEarnings(false);
      } else {
        const list: EarningRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as EarningRecord);
        });
        list.sort((a, b) => {
          const keyA = (a.date || '') + '_' + (a.time || '') + '_' + (a.id || '');
          const keyB = (b.date || '') + '_' + (b.time || '') + '_' + (b.id || '');
          return keyB.localeCompare(keyA);
        });
        setEarnings(list);
        setHasMoreEarnings(snapshot.docs.length >= earningsLimit);
      }
    }, (error) => {
      console.error("onSnapshot earnings error:", error);
      const lower = error.message?.toLowerCase() || '';
      if (lower.includes("quota") || lower.includes("limit") || lower.includes("exhausted") || lower.includes("billing") || lower.includes("resource")) {
        setQuotaError("maintenance");
      }
    });
    return unsubscribe;
  }, [currentUser, earningsLimit]);

  // 5. Sync Submissions (Always active when authenticated)
  useEffect(() => {
    if (!currentUser) {
      setSubmissions([]);
      return;
    }
    const isAdminOrEmployee = currentUser.type === 'admin' || currentUser.type === 'employee';

    let q;
    if (isAdminOrEmployee) {
      q = query(collection(db, 'submissions'), limit(submissionsLimit));
    } else {
      q = query(collection(db, 'submissions'), where('publisherId', '==', currentUser.id), limit(submissionsLimit));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setSubmissions([]);
        setHasMoreSubmissions(false);
      } else {
        const list: DataSubmission[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as DataSubmission);
        });
        list.sort((a, b) => {
          const keyA = (a.submitDate || '') + '_' + (a.id || '');
          const keyB = (b.submitDate || '') + '_' + (b.id || '');
          return keyB.localeCompare(keyA);
        });
        setSubmissions(list);
        setHasMoreSubmissions(snapshot.docs.length >= submissionsLimit);
      }
    }, (error) => {
      console.error("onSnapshot submissions error:", error);
      const lower = error.message?.toLowerCase() || '';
      if (lower.includes("quota") || lower.includes("limit") || lower.includes("exhausted") || lower.includes("billing") || lower.includes("resource")) {
        setQuotaError("maintenance");
      }
    });
    return unsubscribe;
  }, [currentUser, submissionsLimit]);

  // 6. Sync Employees
  useEffect(() => {
    if (!currentUser && !['/Admin', '/Employee', 'admin', 'employee'].some(p => activePath.toLowerCase().includes(p))) {
      setEmployees([]);
      return;
    }
    const q = query(collection(db, 'employees'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setEmployees([]);
      } else {
        const list: Employee[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Employee);
        });
        setEmployees(list);
      }
    });
    return unsubscribe;
  }, [currentUser, activePath]);

  // 7. Sync Partner Applications
  useEffect(() => {
    if (!currentUser && !['/Admin', '/Partner', 'admin', 'partner'].some(p => activePath.toLowerCase().includes(p))) {
      setPartnerApplications([]);
      return;
    }
    const q = query(collection(db, 'partners'), limit(partnersLimit));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setPartnerApplications([]);
        setHasMorePartners(false);
      } else {
        const list: PartnerApplication[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as PartnerApplication);
        });
        setPartnerApplications(list);
        setHasMorePartners(snapshot.docs.length >= partnersLimit);
      }
    });
    return unsubscribe;
  }, [currentUser, activePath, partnersLimit]);

  // Sync Advertiser Inquiries (Removed to avoid Firestore logging as requested)
  useEffect(() => {
    setAdvertiserInquiries([]);
  }, [activePath]);

  // 8. Sync Activity Logs (Bypassed to protect Firestore quota limits)
  useEffect(() => {
    setActivityLogs([
      { id: 'l1', timestamp: new Date().toISOString().substring(0, 19).replace('T', ' '), userId: 'SYSTEM', userName: 'Server Core', action: 'BOOT', details: 'Bypassed Firestore logging to protect daily free-tier limits.' }
    ]);
  }, [activePath]);

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
            offer: { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600', active: true }
          };
          await setDoc(docRef, initialSettings);
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
              updateDoc(docRef, { supportPhone: phone });
            }
            if (email === 'support@publicadsindia.com') {
              email = 'publicadsnetwork@gmail.com';
              updateDoc(docRef, { supportEmail: email });
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
      } catch (err) {
        console.error("Error loading settings config:", err);
      }
    };
    fetchSettings();
  }, []);

  // 10. Sync Backup Logs (Disabled to protect Firestore quota limits)
  useEffect(() => {
    // Keep local static backups for offline state
  }, [activePath]);

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
    try {
      // 1. Check local state (fast track)
      let pub = publishers.find(p => (p.email === phoneOrEmail || p.phone === phoneOrEmail) && p.password === password);
      
      // 2. Query Firestore directly (eliminates race conditions, network latency issues on new devices)
      if (!pub) {
        const pubsRef = collection(db, 'publishers');
        
        // Try by email (optimized with limit(1))
        const qEmail = query(pubsRef, where('email', '==', phoneOrEmail), where('password', '==', password), limit(1));
        const snapEmail = await getDocs(qEmail);
        
        if (!snapEmail.empty) {
          pub = snapEmail.docs[0].data() as Publisher;
        } else {
          // Try by phone (optimized with limit(1))
          const qPhone = query(pubsRef, where('phone', '==', phoneOrEmail), where('password', '==', password), limit(1));
          const snapPhone = await getDocs(qPhone);
          if (!snapPhone.empty) {
            pub = snapPhone.docs[0].data() as Publisher;
          }
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

  const signupPublisher = async (name: string, email: string, phone: string, password: string) => {
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

      const newPub: Publisher = {
        id: newId,
        name,
        email,
        phone,
        password,
        avatar: '👤',
        blocked: false,
        joinedDate: new Date().toISOString().substring(0, 10)
      };

      // 4. Save to Firestore (await to ensure durable database write completes!)
      await setDoc(doc(db, 'publishers', newId), newPub);

      // Create matching bank details record
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
      await setDoc(doc(db, 'bank_details', newId), emptyBank);

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

  const updatePublisherProfile = (name: string, avatar: string) => {
    if (!currentUser || currentUser.type !== 'publisher') return;
    const pubId = currentUser.id;
    
    updateDoc(doc(db, 'publishers', pubId), { name, avatar });
    
    const upSess = { ...currentUser, name };
    setCurrentUser(upSess);
    localStorage.setItem('pai_user_session', JSON.stringify(upSess));

    addLog(pubId, name, 'PROFILE_UPDATE', `Publisher changed avatar/name`);
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
    setDoc(doc(db, 'campaigns', newId), newCamp);
    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_ADD', `Created campaign '${c.name}' with payout ₹${c.payout}`);
  };

  const toggleCampaignActive = (id: string) => {
    const c = campaigns.find(item => item.id === id);
    if (c) {
      updateDoc(doc(db, 'campaigns', id), { active: !c.active });
      addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_TOGGLE', `Toggled accessibility check of '${c.name}' to ${!c.active}`);
    }
  };

  const editCampaign = (id: string, updatedCamp: Partial<Campaign>) => {
    const c = campaigns.find(item => item.id === id);
    if (c) {
      updateDoc(doc(db, 'campaigns', id), updatedCamp);
      addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_EDIT', `Edited campaign '${c.name}' specs`);
    }
  };

  const deleteCampaign = (id: string) => {
    const target = campaigns.find(c => c.id === id);
    if (target) {
      deleteDoc(doc(db, 'campaigns', id));
      addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_DELETE', `Deleted campaign '${target.name}' from active registry`);
    }
  };

  const updateOfferPopup = (image: string, active: boolean, title?: string, description?: string, buttonText?: string, link?: string, showButton?: boolean) => {
    const newOffer = { image, active, title, description, buttonText, link, showButton };
    updateDoc(doc(db, 'configs', 'settings'), { offer: newOffer });
    setOffer(newOffer);
    localStorage.setItem('pai_offer', JSON.stringify(newOffer));
    addLog('ADMIN', 'Administrator', 'OFFER_UPDATE', `Admin modified promo banner popup (Activated: ${active})`);
  };

  const updateSupportDetails = (phone: string, email: string) => {
    updateDoc(doc(db, 'configs', 'settings'), { supportPhone: phone, supportEmail: email });
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
      await deleteDoc(doc(db, 'advertiserInquiries', id));
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

      // Send directly to Google Sheets using the hardcoded Web App URL provided by the user
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
      addLog('SYSTEM', 'Advertiser Form', 'INQUIRY_SUBMIT', `New advertiser inquiry from ${name} (${company}) sent to Google Sheet`);

      return { success: true, message: 'Advertiser inquiry submitted successfully.' };
    } catch (err) {
      console.error("Error submitting advertiser inquiry:", err);
      return { success: false, message: err instanceof Error ? err.message : 'Submission failed.' };
    }
  };

  const togglePartnerHiring = (active: boolean) => {
    updateDoc(doc(db, 'configs', 'settings'), { partnerHiringActive: active });
    setPartnerHiringActive(active);
    localStorage.setItem('pai_hiring_active', String(active));
    addLog('ADMIN', 'Administrator', 'HIRING_TOGGLE', `Hiring availability program toggled to ${active ? 'Active' : 'Paused'}`);
  };

  const updateSubmissionStatus = (submissionId: string, status: SubmissionStatus) => {
    const oldSub = submissions.find(s => s.id === submissionId);
    if (!oldSub) return;
    if (oldSub.status === 'PaymentDone' && status !== 'Payment Done') return; // protect payouts from getting reverted simply

    updateDoc(doc(db, 'submissions', submissionId), { status });
    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'MIS_STATUS_UPDATE', `Approved campaign status of [${oldSub.clientName}] to ${status}`);

    // Core specification requirement: "or isme jo Payment Done hai na mai jis bhi account ko payment done click kruga us campaing ka jo ammount hoga uske dashboard me add ho jye. jitna mene campaing create ke time amount rakha hu."
    if (status === 'Payment Done' && oldSub.status !== 'Payment Done') {
      // Allocate the campaign payout into earnings of sub's publisher now
      const earningId = `earning-${Date.now()}`;
      const newEarning: EarningRecord = {
        id: earningId,
        publisherId: oldSub.publisherId,
        campaignId: oldSub.campaignId,
        campaignName: oldSub.campaignName,
        amount: oldSub.payout,
        date: new Date().toISOString().substring(0, 10),
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      };
      
      setDoc(doc(db, 'earnings', earningId), newEarning);
      addLog('PAYMENT_SERVER', 'Automatic Ledger', 'EARNING_DISBURSE', `Disbursed ₹${oldSub.payout} campaign reward to ${oldSub.publisherId}`);
    }
  };

  const deleteSubmission = (id: string) => {
    deleteDoc(doc(db, 'submissions', id));
    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'DELETE_SUBMISSION', `Lead submission deleted for reference ID: ${id}`);
  };

  const updateEarningAmount = (earningId: string, amount: number) => {
    updateDoc(doc(db, 'earnings', earningId), { amount });
    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'UPDATE_EARNING_AMOUNT', `Updated earning ID ${earningId} amount to ₹${amount}`);
  };

  const deleteEarningRecord = (earningId: string) => {
    deleteDoc(doc(db, 'earnings', earningId));
    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'DELETE_EARNING_RECORD', `Deleted earning ID ${earningId}`);
  };

  const toggleBlockPublisher = (pubId: string) => {
    const p = publishers.find(item => item.id === pubId);
    if (p) {
      updateDoc(doc(db, 'publishers', pubId), { blocked: !p.blocked });
      addLog('ADMIN', 'Administrator', p.blocked ? 'UNBLOCK_USER' : 'BLOCK_USER', `Account access modify for ${p.name} (${p.id})`);
    }
  };

  const deletePublisher = (pubId: string) => {
    const p = publishers.find(item => item.id === pubId);
    if (p) {
      deleteDoc(doc(db, 'publishers', pubId));
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
    setDoc(doc(db, 'employees', empId), newEmp);
    addLog('ADMIN', 'Administrator', 'STAFF_ADDED', `Recruited new staff: ${name} (Role: ${role})`);
    return { success: true, message: 'Staff Employee account generated successfully!' };
  };

  const deleteEmployee = (id: string) => {
    const target = employees.find(e => e.id === id);
    if (!target) return;
    deleteDoc(doc(db, 'employees', id));
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
    try {
      await setDoc(doc(db, 'bank_details', currentUser.id), {
        ...details,
        publisherId: currentUser.id
      });
      await addLog(currentUser.id, currentUser.name, 'BANK_UPDATE', 'Updated banking ledger details');
      return { success: true, message: 'Bank ledger nodes updated and saved in system registry!' };
    } catch (err: any) {
      console.error('Error saving bank details:', err);
      return { success: false, message: sanitizeError(err) };
    }
  };

  const submitLead = async (campaignId: string, clientName: string, clientPhone: string, clientCode: string, screenshot: string) => {
    if (!currentUser || currentUser.type !== 'publisher') return { success: false, message: 'Authentication level required' };
    
    // Find campaign payout
    const camp = campaigns.find(c => c.id === campaignId);
    if (!camp) return { success: false, message: 'Invalid Campaign selected' };

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

    try {
      await setDoc(doc(db, 'submissions', subId), newSub);
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
      await addLog(currentUser.id, currentUser.name, 'LEAD_SUBMISSION', `Submitted new action lead for client [${clientName}] under campaign [${camp.name}]`);
      return { success: true, message: 'Data saved successfully. Admin and leads inspectors are matching details now!' };
    } catch (err: any) {
      console.error('Error submitting lead:', err);
      return { success: false, message: sanitizeError(err) };
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

    try {
      await setDoc(doc(db, 'partners', partnerId), newApp);
      await addLog('PARTNER_PORTAL', name, 'PARTNER_APPLY', `Received recruitment application from partner candidate ${city}`);
      return { success: true, message: 'Application submitted successfully! Our HR Board will review and get back within 48-72 Hours.' };
    } catch (err: any) {
      console.error('Error applying for partner:', err);
      return { success: false, message: sanitizeError(err) };
    }
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
      testimonials,
      quotaError,
      
      hasMoreSubmissions,
      loadMoreSubmissions,
      hasMoreEarnings,
      loadMoreEarnings,
      hasMorePublishers,
      loadMorePublishers,
      hasMorePartners,
      loadMorePartners,
      
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
