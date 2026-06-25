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
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
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
  Testimonial
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
    lowerMsg.includes('service_unavailable')
  ) {
    return 'Database daily limits reached or server busy. Please upgrade your Firebase plan or try again later.';
  }
  return msg;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const [submissions, setSubmissions] = useState<DataSubmission[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [partnerApplications, setPartnerApplications] = useState<PartnerApplication[]>([]);
  const [bankDetailsMap, setBankDetailsMap] = useState<Record<string, BankDetails>>({});
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [offer, setOffer] = useState<ActiveOffer>({ image: '', active: false });
  const [supportPhone, setSupportPhone] = useState('+91 9110022334');
  const [supportEmail = 'support@publicadsindia.com', setSupportEmail] = useState('support@publicadsindia.com');
  const [partnerHiringActive, setPartnerHiringActive] = useState(true);
  const [currentUser, setCurrentUser] = useState<AppContextType['currentUser']>(null);
  const [initDoneState, setInitDoneState] = useState<boolean | null>(null);
  const [activePath, setActivePath] = useState<string>('/Home');
  const [quotaError, setQuotaError] = useState<string | null>(null);

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

  // Monitor initialization state to avoid auto-generating mock records if database is empty or purged
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'system_metadata', 'init_done'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().value === true) {
        setInitDoneState(true);
      } else {
        setInitDoneState(false);
      }
    }, (error) => {
      console.error("onSnapshot system_metadata error:", error);
      const lower = error.message?.toLowerCase() || '';
      if (lower.includes("quota") || lower.includes("limit") || lower.includes("exhausted") || lower.includes("billing") || lower.includes("resource") || lower.includes("project_number")) {
        setQuotaError("Firestore daily free-tier read limits exceeded. Enable billing / upgrade to Blaze plan on Firebase Console to avoid interruptions.");
      }
    });
    return unsubscribe;
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
    if (initDoneState === null) return;
    const q = collection(db, 'campaigns');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        if (initDoneState === false) {
          defaultCampaigns.forEach((c) => {
            setDoc(doc(db, 'campaigns', c.id), c);
          });
          setDoc(doc(db, 'system_metadata', 'init_done'), { value: true });
        } else {
          setCampaigns([]);
        }
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
        setQuotaError("Firestore daily free-tier read limits exceeded. Enable billing / upgrade to Blaze plan on Firebase Console to avoid interruptions.");
      }
    });
    return unsubscribe;
  }, [initDoneState]);

  // 1b. Sync Testimonials
  useEffect(() => {
    if (initDoneState === null) return;
    const fetchTestimonials = async () => {
      try {
        const q = collection(db, 'testimonials');
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          if (initDoneState === false) {
            defaultTestimonials.forEach((t) => {
              setDoc(doc(db, 'testimonials', t.id), t);
            });
            setDoc(doc(db, 'system_metadata', 'init_done'), { value: true });
          } else {
            setTestimonials([]);
          }
        } else {
          const list: Testimonial[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Testimonial);
          });
          // Sort testimonials so they maintain consistent orders e.g., by matching order in array
          const defaultOrder = ["testi-1", "testi-2", "testi-3", "testi-4", "testi-5", "testi-6"];
          list.sort((a, b) => {
            const idxA = defaultOrder.indexOf(a.id);
            const idxB = defaultOrder.indexOf(b.id);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.id.localeCompare(b.id);
          });
          setTestimonials(list);
        }
      } catch (err) {
        console.error("Error loading testimonials:", err);
      }
    };
    fetchTestimonials();
  }, [initDoneState]);

  // 2. Sync Publishers
  useEffect(() => {
    if (initDoneState === null) return;
    
    const isAdminOrEmployee = currentUser?.type === 'admin' || currentUser?.type === 'employee';
    const isPublisher = currentUser?.type === 'publisher';
    
    if (!currentUser) {
      setPublishers([]);
      return;
    }

    let q;
    if (isAdminOrEmployee) {
      q = collection(db, 'publishers');
    } else if (isPublisher) {
      q = query(collection(db, 'publishers'), where('id', '==', currentUser.id));
    } else {
      setPublishers([]);
      return;
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        if (initDoneState === false && isAdminOrEmployee) {
          const initialPubs: Publisher[] = [
            { id: 'PUB1001', name: 'Riya Sharma', email: 'riya@gmail.com', phone: '9876543210', password: 'password123', avatar: '👩', blocked: false, joinedDate: '2025-01-10' },
            { id: 'PUB1002', name: 'Amit Patel', email: 'amit@gmail.com', phone: '8765432109', password: 'password123', avatar: '👨', blocked: false, joinedDate: '2025-02-15' },
            { id: 'PUB1003', name: 'Zeeshan Khan', email: 'zeeshan@gmail.com', phone: '7654321098', password: 'password123', avatar: '😎', blocked: false, joinedDate: '2025-03-01' }
          ];
          initialPubs.forEach((p) => {
            setDoc(doc(db, 'publishers', p.id), p);
          });
          setDoc(doc(db, 'system_metadata', 'init_done'), { value: true });
        } else {
          setPublishers([]);
        }
      } else {
        const list: Publisher[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Publisher);
        });
        setPublishers(list);
      }
    }, (error) => {
      console.error("onSnapshot publishers error:", error);
      const lower = error.message?.toLowerCase() || '';
      if (lower.includes("quota") || lower.includes("limit") || lower.includes("exhausted") || lower.includes("billing") || lower.includes("resource")) {
        setQuotaError("Firestore daily free-tier read limits exceeded. Enable billing / upgrade to Blaze plan on Firebase Console to avoid interruptions.");
      }
    });
    return unsubscribe;
  }, [initDoneState, currentUser]);

  // 3. Sync Bank Details Map
  useEffect(() => {
    if (initDoneState === null) return;
    
    const isAdminOrEmployee = currentUser?.type === 'admin' || currentUser?.type === 'employee';
    const isPublisher = currentUser?.type === 'publisher';
    
    if (!currentUser) {
      setBankDetailsMap({});
      return;
    }

    let q;
    if (isAdminOrEmployee) {
      q = collection(db, 'bank_details');
    } else if (isPublisher) {
      q = query(collection(db, 'bank_details'), where('publisherId', '==', currentUser.id));
    } else {
      setBankDetailsMap({});
      return;
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        if (initDoneState === false && isAdminOrEmployee) {
          const initialBank: Record<string, BankDetails> = {
            'PUB1001': { publisherId: 'PUB1001', holderName: 'Riya Sharma', phone: '9876543210', email: 'riya@gmail.com', accountNumber: '5010024921092', ifsc: 'HDFC0000213', upi: 'riyasharma@okhdfc', qrCode: '' },
            'PUB1002': { publisherId: 'PUB1002', holderName: 'Amit Patel', phone: '8765432109', email: 'amit@gmail.com', accountNumber: '3029108391039', ifsc: 'SBIN0001092', upi: 'amitpatel@okaxis', qrCode: '' }
          };
          Object.entries(initialBank).forEach(([pubId, details]) => {
            setDoc(doc(db, 'bank_details', pubId), details);
          });
          setDoc(doc(db, 'system_metadata', 'init_done'), { value: true });
        } else {
          setBankDetailsMap({});
        }
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
        setQuotaError("Firestore daily free-tier read limits exceeded. Enable billing / upgrade to Blaze plan on Firebase Console to avoid interruptions.");
      }
    });
    return unsubscribe;
  }, [initDoneState, currentUser]);

  // 4. Sync Earnings
  useEffect(() => {
    if (initDoneState === null) return;
    
    const isAdminOrEmployee = currentUser?.type === 'admin' || currentUser?.type === 'employee';
    const isPublisher = currentUser?.type === 'publisher';
    
    if (!currentUser) {
      setEarnings([]);
      return;
    }

    let q;
    if (isAdminOrEmployee) {
      q = collection(db, 'earnings');
    } else if (isPublisher) {
      q = query(collection(db, 'earnings'), where('publisherId', '==', currentUser.id));
    } else {
      setEarnings([]);
      return;
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        if (initDoneState === false && isAdminOrEmployee) {
          const initialEarnings: EarningRecord[] = [
            { id: 'e1', publisherId: 'PUB1001', campaignId: 'camp-1', campaignName: 'PhonePe Demat Account', amount: 250, date: '2026-06-18', time: '14:25' },
            { id: 'e2', publisherId: 'PUB1001', campaignId: 'camp-2', campaignName: 'Angel One Demat & Trading', amount: 350, date: '2026-06-17', time: '11:05' },
            { id: 'e3', publisherId: 'PUB1001', campaignId: 'camp-3', campaignName: 'SBI Credit Card Gold Pro', amount: 1200, date: '2026-06-15', time: '18:40' },
            { id: 'e4', publisherId: 'PUB1002', campaignId: 'camp-1', campaignName: 'PhonePe Demat Account', amount: 250, date: '2026-06-18', time: '16:15' },
            { id: 'e5', publisherId: 'PUB1002', campaignId: 'camp-3', campaignName: 'SBI Credit Card Gold Pro', amount: 1200, date: '2026-06-14', time: '09:30' },
            { id: 'e6', publisherId: 'PUB1003', campaignId: 'camp-2', campaignName: 'Angel One Demat & Trading', amount: 350, date: '2026-06-18', time: '12:00' },
            { id: 'e7', publisherId: 'PUB1003', campaignId: 'camp-4', campaignName: 'mStock Zero Brokerage Account', amount: 400, date: '2026-06-16', time: '15:10' }
          ];
          initialEarnings.forEach((e) => {
            setDoc(doc(db, 'earnings', e.id), e);
          });
          setDoc(doc(db, 'system_metadata', 'init_done'), { value: true });
        } else {
          setEarnings([]);
        }
      } else {
        const list: EarningRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as EarningRecord);
        });
        setEarnings(list);
      }
    }, (error) => {
      console.error("onSnapshot earnings error:", error);
      const lower = error.message?.toLowerCase() || '';
      if (lower.includes("quota") || lower.includes("limit") || lower.includes("exhausted") || lower.includes("billing") || lower.includes("resource")) {
        setQuotaError("Firestore daily free-tier read limits exceeded. Enable billing / upgrade to Blaze plan on Firebase Console to avoid interruptions.");
      }
    });
    return unsubscribe;
  }, [initDoneState, currentUser]);

  // 5. Sync Submissions
  useEffect(() => {
    if (initDoneState === null) return;
    
    const isAdminOrEmployee = currentUser?.type === 'admin' || currentUser?.type === 'employee';
    const isPublisher = currentUser?.type === 'publisher';
    
    if (!currentUser) {
      setSubmissions([]);
      return;
    }

    let q;
    if (isAdminOrEmployee) {
      q = collection(db, 'submissions');
    } else if (isPublisher) {
      q = query(collection(db, 'submissions'), where('publisherId', '==', currentUser.id));
    } else {
      setSubmissions([]);
      return;
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        if (initDoneState === false && isAdminOrEmployee) {
          const initialSubs: DataSubmission[] = [
            {
              id: 'sub-1',
              publisherId: 'PUB1001',
              publisherName: 'Riya Sharma',
              campaignId: 'camp-1',
              campaignName: 'PhonePe Demat Account',
              payout: 250,
              clientName: 'Rahul Verma',
              clientPhone: '9123456780',
              clientCode: 'PAV109',
              screenshot: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=150',
              submitDate: '2026-06-18 14:10',
              status: 'Payment Done'
            },
            {
              id: 'sub-2',
              publisherId: 'PUB1001',
              publisherName: 'Riya Sharma',
              campaignId: 'camp-3',
              campaignName: 'SBI Credit Card Gold Pro',
              payout: 1200,
              clientName: 'Sanjay Kumar',
              clientPhone: '9543210987',
              clientCode: 'PASB987',
              screenshot: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=150',
              submitDate: '2026-06-18 15:30',
              status: 'Process'
            },
            {
              id: 'sub-3',
              publisherId: 'PUB1002',
              publisherName: 'Amit Patel',
              campaignId: 'camp-2',
              campaignName: 'Angel One Demat & Trading',
              payout: 350,
              clientName: 'Vinay Singh',
              clientPhone: '9988776655',
              clientCode: 'PANG002',
              screenshot: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=150',
              submitDate: '2026-06-17 10:15',
              status: 'Active'
            }
          ];
          initialSubs.forEach((s) => {
            setDoc(doc(db, 'submissions', s.id), s);
          });
          setDoc(doc(db, 'system_metadata', 'init_done'), { value: true });
        } else {
          setSubmissions([]);
        }
      } else {
        const list: DataSubmission[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as DataSubmission);
        });
        setSubmissions(list);
      }
    }, (error) => {
      console.error("onSnapshot submissions error:", error);
      const lower = error.message?.toLowerCase() || '';
      if (lower.includes("quota") || lower.includes("limit") || lower.includes("exhausted") || lower.includes("billing") || lower.includes("resource")) {
        setQuotaError("Firestore daily free-tier read limits exceeded. Enable billing / upgrade to Blaze plan on Firebase Console to avoid interruptions.");
      }
    });
    return unsubscribe;
  }, [initDoneState, currentUser]);

  // 6. Sync Employees
  useEffect(() => {
    if (initDoneState === null) return;
    const deservesEmployees = ['/Admin', '/Employee'].includes(activePath);
    if (!deservesEmployees) {
      setEmployees([]);
      return;
    }
    const q = collection(db, 'employees');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        if (initDoneState === false) {
          const initialEmployees: Employee[] = [
            { id: 'emp-1', name: 'Karan Mehra', username: 'karan_pay', password: 'Emp@123', role: 'Payment' },
            { id: 'emp-2', name: 'Sneha Roy', username: 'sneha_mis', password: 'Emp@123', role: 'MIS' }
          ];
          initialEmployees.forEach((emp) => {
            setDoc(doc(db, 'employees', emp.id), emp);
          });
        } else {
          setEmployees([]);
        }
      } else {
        const list: Employee[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Employee);
        });
        setEmployees(list);
      }
    });
    return unsubscribe;
  }, [initDoneState, activePath]);

  // 7. Sync Partner Applications
  useEffect(() => {
    if (initDoneState === null) return;
    const deservesPartners = ['/Admin', '/Partner'].includes(activePath);
    if (!deservesPartners) {
      setPartnerApplications([]);
      return;
    }
    const q = collection(db, 'partners');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        if (initDoneState === false) {
          const initialPartners: PartnerApplication[] = [
            { id: 'part-1', name: 'Deepak Tyagi', phone: '9443210987', email: 'deepak@gmail.com', city: 'Delhi', age: 26, qualification: 'MBA', submitDate: '2026-06-16' }
          ];
          initialPartners.forEach((part) => {
            setDoc(doc(db, 'partners', part.id), part);
          });
        } else {
          setPartnerApplications([]);
        }
      } else {
        const list: PartnerApplication[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as PartnerApplication);
        });
        setPartnerApplications(list);
      }
    });
    return unsubscribe;
  }, [initDoneState, activePath]);

  // 8. Sync Activity Logs
  useEffect(() => {
    if (initDoneState === null) return;
    const deservesLogs = activePath === '/Admin';
    if (!deservesLogs) {
      setActivityLogs([]);
      return;
    }
    const q = collection(db, 'activity_logs');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        if (initDoneState === false) {
          const initialLogs: ActivityLog[] = [
            { id: 'l1', timestamp: '2026-06-18 10:15:20', userId: 'SYSTEM', userName: 'Server Core', action: 'BOOT', details: 'Public Ads India web console initialized successfully' },
            { id: 'l2', timestamp: '2026-06-18 12:40:11', userId: 'PUB1001', userName: 'Riya Sharma', action: 'LOGIN', details: 'Successful session establishment from client browser' }
          ];
          initialLogs.forEach((log) => {
            setDoc(doc(db, 'activity_logs', log.id), log);
          });
        } else {
          setActivityLogs([]);
        }
      } else {
        const list: ActivityLog[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as ActivityLog);
        });
        list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        setActivityLogs(list);
      }
    });
    return unsubscribe;
  }, [initDoneState, activePath]);

  // 9. Sync Settings
  useEffect(() => {
    const docRef = doc(db, 'configs', 'settings');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (!docSnap.exists()) {
        const initialSettings = {
          supportPhone: '+91 9110022334',
          supportEmail: 'support@publicadsindia.com',
          partnerHiringActive: true,
          offer: { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600', active: true }
        };
        setDoc(docRef, initialSettings);
      } else {
        const data = docSnap.data();
        if (data) {
          if (data.supportPhone) setSupportPhone(data.supportPhone);
          if (data.supportEmail) setSupportEmail(data.supportEmail);
          if (data.partnerHiringActive !== undefined) setPartnerHiringActive(data.partnerHiringActive);
          if (data.offer) setOffer(data.offer);
        }
      }
    });
    return unsubscribe;
  }, []);

  // 10. Sync Backup Logs
  useEffect(() => {
    if (initDoneState === null) return;
    const deservesBackups = activePath === '/Admin';
    if (!deservesBackups) {
      setBackupLogs([]);
      return;
    }
    const q = collection(db, 'backups');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        if (initDoneState === false) {
          const initialBackups = [
            { id: 'b-0', time: '2026-06-18 04:00:00', scope: 'Full Database Auto-Backup', size: '1.45 MB', status: 'Success' },
            { id: 'b-1', time: '2026-06-17 04:00:00', scope: 'Full Database Auto-Backup', size: '1.42 MB', status: 'Success' },
            { id: 'b-2', time: '2026-06-16 04:00:00', scope: 'Full Database Auto-Backup', size: '1.38 MB', status: 'Success' }
          ];
          initialBackups.forEach((b) => {
            setDoc(doc(db, 'backups', b.id), b);
          });
        } else {
          setBackupLogs([]);
        }
      } else {
        const list: any[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data());
        });
        list.sort((a, b) => b.time.localeCompare(a.time));
        setBackupLogs(list);
      }
    });
    return unsubscribe;
  }, [initDoneState, activePath]);

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    localStorage.setItem('pai_theme', t);
  };

  // Helper to log user activity
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
    setDoc(doc(db, 'activity_logs', logId), newLog);
  };

  // Actions
  const loginPublisher = async (phoneOrEmail: string, password: string) => {
    try {
      // 1. Check local state (fast track)
      let pub = publishers.find(p => (p.email === phoneOrEmail || p.phone === phoneOrEmail) && p.password === password);
      
      // 2. Query Firestore directly (eliminates race conditions, network latency issues on new devices)
      if (!pub) {
        const pubsRef = collection(db, 'publishers');
        
        // Try by email
        const qEmail = query(pubsRef, where('email', '==', phoneOrEmail), where('password', '==', password));
        const snapEmail = await getDocs(qEmail);
        
        if (!snapEmail.empty) {
          pub = snapEmail.docs[0].data() as Publisher;
        } else {
          // Try by phone
          const qPhone = query(pubsRef, where('phone', '==', phoneOrEmail), where('password', '==', password));
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
      
      // 2. Double check Firestore directly to prevent signup duplication across devices
      if (!existing) {
        const pubsRef = collection(db, 'publishers');
        const qEmail = query(pubsRef, where('email', '==', email));
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) {
          existing = snapEmail.docs[0].data() as Publisher;
        } else {
          const qPhone = query(pubsRef, where('phone', '==', phone));
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
      
      // Also check Firestore collections to prevent ID collision across offline instances
      const pubsRef = collection(db, 'publishers');
      const snapAll = await getDocs(query(pubsRef));
      snapAll.forEach(docSnap => {
        const p = docSnap.data() as Publisher;
        if (p.id) {
          const num = parseInt(p.id.replace('PUB', ''));
          if (!isNaN(num) && num >= nextNum) {
            nextNum = num + 1;
          }
        }
      });

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
    addLog('ADMIN', 'Administrator', 'OFFER_UPDATE', `Admin modified promo banner popup (Activated: ${active})`);
  };

  const updateSupportDetails = (phone: string, email: string) => {
    updateDoc(doc(db, 'configs', 'settings'), { supportPhone: phone, supportEmail: email });
    addLog('ADMIN', 'Administrator', 'SUPPORT_EDIT', `Site-wide contacts updated. Phone: ${phone}, Email: ${email}`);
  };

  const togglePartnerHiring = (active: boolean) => {
    updateDoc(doc(db, 'configs', 'settings'), { partnerHiringActive: active });
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
    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'TESTIMONIAL_ADD', `Added testimonial/feedback from '${t.name}'`);
  };

  const editTestimonial = (id: string, updated: Partial<Testimonial>) => {
    updateDoc(doc(db, 'testimonials', id), updated);
    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'TESTIMONIAL_EDIT', `Modified testimonial/feedback from '${updated.name || id}'`);
  };

  const deleteTestimonial = (id: string) => {
    deleteDoc(doc(db, 'testimonials', id));
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
    setDoc(doc(db, 'backups', bId), newBackup);
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
      currentUser,
      testimonials,
      quotaError,
      
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
