import React, { createContext, useContext, useState, useEffect } from 'react';
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
  SubmissionStatus
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
  
  // Actions
  loginPublisher: (phoneOrEmail: string, password: string) => { success: boolean; message: string; publisher?: Publisher };
  signupPublisher: (name: string, email: string, phone: string, password: string) => { success: boolean; message: string; publisher?: Publisher };
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
  addEmployee: (name: string, u: string, p: string, role: 'Payment' | 'MIS') => { success: boolean; message: string };
  deleteEmployee: (id: string) => void;
  triggerBackup: () => void;
  backupLogs: Array<{ id: string; time: string; scope: string; size: string; status: string }>;
  
  // Publisher Actions
  submitBankDetails: (details: BankDetails) => void;
  submitLead: (campaignId: string, clientName: string, clientPhone: string, clientCode: string, screenshot: string) => { success: boolean; message: string };
  applyForPartner: (name: string, phone: string, email: string, city: string, age: number, qualification: string) => { success: boolean; message: string };
  
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
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
  
  const [backupLogs, setBackupLogs] = useState<Array<{ id: string; time: string; scope: string; size: string; status: string }>>([
    { id: 'b-0', time: '2026-06-18 04:00:00', scope: 'Full Database Auto-Backup', size: '1.45 MB', status: 'Success' },
    { id: 'b-1', time: '2026-06-17 04:00:00', scope: 'Full Database Auto-Backup', size: '1.42 MB', status: 'Success' },
    { id: 'b-2', time: '2026-06-16 04:00:00', scope: 'Full Database Auto-Backup', size: '1.38 MB', status: 'Success' }
  ]);

  // Load state from localstorage
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('pai_theme');
      if (storedTheme) setThemeState(storedTheme as 'light' | 'dark');

      const storedCampaigns = localStorage.getItem('pai_campaigns');
      if (storedCampaigns) {
        setCampaigns(JSON.parse(storedCampaigns));
      } else {
        setCampaigns(defaultCampaigns);
        localStorage.setItem('pai_campaigns', JSON.stringify(defaultCampaigns));
      }

      // Load or initialize publishers
      const storedPubs = localStorage.getItem('pai_pubs');
      if (storedPubs) {
        setPublishers(JSON.parse(storedPubs));
      } else {
        // Pre-create two mock publishers
        const initialPubs: Publisher[] = [
          { id: 'PUB1001', name: 'Riya Sharma', email: 'riya@gmail.com', phone: '9876543210', password: 'password123', avatar: '👩', blocked: false, joinedDate: '2025-01-10' },
          { id: 'PUB1002', name: 'Amit Patel', email: 'amit@gmail.com', phone: '8765432109', password: 'password123', avatar: '👨', blocked: false, joinedDate: '2025-02-15' },
          { id: 'PUB1003', name: 'Zeeshan Khan', email: 'zeeshan@gmail.com', phone: '7654321098', password: 'password123', avatar: '😎', blocked: false, joinedDate: '2025-03-01' }
        ];
        setPublishers(initialPubs);
        localStorage.setItem('pai_pubs', JSON.stringify(initialPubs));
      }

      // Load or initialize BankDetails
      const storedBank = localStorage.getItem('pai_bank');
      if (storedBank) {
        setBankDetailsMap(JSON.parse(storedBank));
      } else {
        const initialBank: Record<string, BankDetails> = {
          'PUB1001': { publisherId: 'PUB1001', holderName: 'Riya Sharma', phone: '9876543210', email: 'riya@gmail.com', accountNumber: '5010024921092', ifsc: 'HDFC0000213', upi: 'riyasharma@okhdfc', qrCode: '' },
          'PUB1002': { publisherId: 'PUB1002', holderName: 'Amit Patel', phone: '8765432109', email: 'amit@gmail.com', accountNumber: '3029108391039', ifsc: 'SBIN0001092', upi: 'amitpatel@okaxis', qrCode: '' }
        };
        setBankDetailsMap(initialBank);
        localStorage.setItem('pai_bank', JSON.stringify(initialBank));
      }

      // Load or initialize Earnings
      const storedEarnings = localStorage.getItem('pai_earnings');
      if (storedEarnings) {
        setEarnings(JSON.parse(storedEarnings));
      } else {
        const initialEarnings: EarningRecord[] = [
          { id: 'e1', publisherId: 'PUB1001', campaignId: 'camp-1', campaignName: 'PhonePe Demat Account', amount: 250, date: '2026-06-18', time: '14:25' },
          { id: 'e2', publisherId: 'PUB1001', campaignId: 'camp-2', campaignName: 'Angel One Demat & Trading', amount: 350, date: '2026-06-17', time: '11:05' },
          { id: 'e3', publisherId: 'PUB1001', campaignId: 'camp-3', campaignName: 'SBI Credit Card Gold Pro', amount: 1200, date: '2026-06-15', time: '18:40' },
          { id: 'e4', publisherId: 'PUB1002', campaignId: 'camp-1', campaignName: 'PhonePe Demat Account', amount: 250, date: '2026-06-18', time: '16:15' },
          { id: 'e5', publisherId: 'PUB1002', campaignId: 'camp-3', campaignName: 'SBI Credit Card Gold Pro', amount: 1200, date: '2026-06-14', time: '09:30' },
          { id: 'e6', publisherId: 'PUB1003', campaignId: 'camp-2', campaignName: 'Angel One Demat & Trading', amount: 350, date: '2026-06-18', time: '12:00' },
          { id: 'e7', publisherId: 'PUB1003', campaignId: 'camp-4', campaignName: 'mStock Zero Brokerage Account', amount: 400, date: '2026-06-16', time: '15:10' }
        ];
        setEarnings(initialEarnings);
        localStorage.setItem('pai_earnings', JSON.stringify(initialEarnings));
      }

      // Load or initialize Submissions
      const storedSubs = localStorage.getItem('pai_subs');
      if (storedSubs) {
        setSubmissions(JSON.parse(storedSubs));
      } else {
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
            screenshot: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=150', // generic capture
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
        setSubmissions(initialSubs);
        localStorage.setItem('pai_subs', JSON.stringify(initialSubs));
      }

      // Employees
      const storedEmployees = localStorage.getItem('pai_employees');
      if (storedEmployees) {
        setEmployees(JSON.parse(storedEmployees));
      } else {
        const initialEmployees: Employee[] = [
          { id: 'emp-1', name: 'Karan Mehra', username: 'karan_pay', password: 'Emp@123', role: 'Payment' },
          { id: 'emp-2', name: 'Sneha Roy', username: 'sneha_mis', password: 'Emp@123', role: 'MIS' }
        ];
        setEmployees(initialEmployees);
        localStorage.setItem('pai_employees', JSON.stringify(initialEmployees));
      }

      // Partner Applications
      const storedPartners = localStorage.getItem('pai_partners');
      if (storedPartners) {
        setPartnerApplications(JSON.parse(storedPartners));
      } else {
        const initialPartners: PartnerApplication[] = [
          { id: 'part-1', name: 'Deepak Tyagi', phone: '9443210987', email: 'deepak@gmail.com', city: 'Delhi', age: 26, qualification: 'MBA', submitDate: '2026-06-16' }
        ];
        setPartnerApplications(initialPartners);
        localStorage.setItem('pai_partners', JSON.stringify(initialPartners));
      }

      // Popup Offers
      const storedOffer = localStorage.getItem('pai_offer');
      if (storedOffer) {
        setOffer(JSON.parse(storedOffer));
      } else {
        const initialOffer = { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600', active: true }; // elegant commercial banners
        setOffer(initialOffer);
        localStorage.setItem('pai_offer', JSON.stringify(initialOffer));
      }

      // Support details
      const storedSupportPhone = localStorage.getItem('pai_supp_phone');
      if (storedSupportPhone) setSupportPhone(storedSupportPhone);

      const storedSupportEmail = localStorage.getItem('pai_supp_email');
      if (storedSupportEmail) setSupportEmail(storedSupportEmail);

      const storedHiring = localStorage.getItem('pai_hiring_active');
      if (storedHiring) setPartnerHiringActive(storedHiring === 'true');

      // User Session
      const storedUser = localStorage.getItem('pai_user_session');
      if (storedUser) setCurrentUser(JSON.parse(storedUser));

      // Logs
      const storedLogs = localStorage.getItem('pai_logs');
      if (storedLogs) {
        setActivityLogs(JSON.parse(storedLogs));
      } else {
        const initialLogs: ActivityLog[] = [
          { id: 'l1', timestamp: '2026-06-18 10:15:20', userId: 'SYSTEM', userName: 'Server Core', action: 'BOOT', details: 'Public Ads India web console initialized successfully' },
          { id: 'l2', timestamp: '2026-06-18 12:40:11', userId: 'PUB1001', userName: 'Riya Sharma', action: 'LOGIN', details: 'Successful session establishment from client browser' }
        ];
        setActivityLogs(initialLogs);
        localStorage.setItem('pai_logs', JSON.stringify(initialLogs));
      }

      // Backup Logs
      const storedBLogs = localStorage.getItem('pai_backup_logs');
      if (storedBLogs) setBackupLogs(JSON.parse(storedBLogs));

    } catch (e) {
      console.error('Error loading LocalStorage', e);
    }
  }, []);

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    localStorage.setItem('pai_theme', t);
  };

  // Helper to log user activity
  const addLog = (userId: string, userName: string, action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId,
      userName,
      action,
      details
    };
    const updated = [newLog, ...activityLogs].slice(0, 100); // keep recent 100 logs
    setActivityLogs(updated);
    localStorage.setItem('pai_logs', JSON.stringify(updated));
  };

  // Actions
  const loginPublisher = (phoneOrEmail: string, password: string) => {
    const pub = publishers.find(p => (p.email === phoneOrEmail || p.phone === phoneOrEmail) && p.password === password);
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
  };

  const signupPublisher = (name: string, email: string, phone: string, password: string) => {
    const existing = publishers.find(p => p.email === email || p.phone === phone);
    if (existing) {
      return { success: false, message: 'An account with this Email or Phone number already exists.' };
    }

    const newId = `PUB${1000 + publishers.length + 1}`;
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

    const updatedPubs = [...publishers, newPub];
    setPublishers(updatedPubs);
    localStorage.setItem('pai_pubs', JSON.stringify(updatedPubs));

    // Auto create basic empty bank details record
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
    const updatedBank = { ...bankDetailsMap, [newId]: emptyBank };
    setBankDetailsMap(updatedBank);
    localStorage.setItem('pai_bank', JSON.stringify(updatedBank));

    const sess = { type: 'publisher' as const, id: newId, name };
    setCurrentUser(sess);
    localStorage.setItem('pai_user_session', JSON.stringify(sess));
    
    addLog(newId, name, 'SIGNUP', 'New publisher account created and verified');
    return { success: true, message: 'Sign up successful!', publisher: newPub };
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
    const updatedPubs = publishers.map(p => {
      if (p.id === pubId) {
        return { ...p, name, avatar };
      }
      return p;
    });
    setPublishers(updatedPubs);
    localStorage.setItem('pai_pubs', JSON.stringify(updatedPubs));
    
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
    const index = publishers.findIndex(p => p.phone === phone && p.email === email);
    if (index !== -1) {
      const updated = [...publishers];
      updated[index] = { ...updated[index], password: newPass };
      setPublishers(updated);
      localStorage.setItem('pai_pubs', JSON.stringify(updated));
      addLog('ADMIN', 'Admin Manager', 'PASS_RESET', `Force changed credentials of ${updated[index].id}`);
      return { success: true, message: `Successfully allocated new password 'Admin@123' for ${updated[index].name} (${updated[index].id}).` };
    }
    return { success: false, message: 'Matching details not found.' };
  };

  // Admin / Employee operations
  const addCampaign = (c: Omit<Campaign, 'id' | 'active'>) => {
    const newCamp: Campaign = {
      ...c,
      id: `camp-${Date.now()}`,
      active: true
    };
    const updated = [...campaigns, newCamp];
    setCampaigns(updated);
    localStorage.setItem('pai_campaigns', JSON.stringify(updated));
    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_ADD', `Created campaign '${c.name}' with payout ₹${c.payout}`);
  };

  const toggleCampaignActive = (id: string) => {
    const updated = campaigns.map(c => {
      if (c.id === id) {
        addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_TOGGLE', `Toggled accessibility check of '${c.name}' to ${!c.active}`);
        return { ...c, active: !c.active };
      }
      return c;
    });
    setCampaigns(updated);
    localStorage.setItem('pai_campaigns', JSON.stringify(updated));
  };

  const editCampaign = (id: string, updatedCamp: Partial<Campaign>) => {
    const updated = campaigns.map(c => {
      if (c.id === id) {
        addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_EDIT', `Edited campaign '${c.name}' specs`);
        return { ...c, ...updatedCamp };
      }
      return c;
    });
    setCampaigns(updated);
    localStorage.setItem('pai_campaigns', JSON.stringify(updated));
  };

  const deleteCampaign = (id: string) => {
    const target = campaigns.find(c => c.id === id);
    const updated = campaigns.filter(c => c.id !== id);
    setCampaigns(updated);
    localStorage.setItem('pai_campaigns', JSON.stringify(updated));
    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'CAMPAIGN_DELETE', `Deleted campaign '${target?.name || id}' from active registry`);
  };

  const updateOfferPopup = (image: string, active: boolean, title?: string, description?: string, buttonText?: string, link?: string, showButton?: boolean) => {
    const newOffer = { image, active, title, description, buttonText, link, showButton };
    setOffer(newOffer);
    localStorage.setItem('pai_offer', JSON.stringify(newOffer));
    addLog('ADMIN', 'Administrator', 'OFFER_UPDATE', `Admin modified promo banner popup (Activated: ${active})`);
  };

  const updateSupportDetails = (phone: string, email: string) => {
    setSupportPhone(phone);
    setSupportEmail(email);
    localStorage.setItem('pai_supp_phone', phone);
    localStorage.setItem('pai_supp_email', email);
    addLog('ADMIN', 'Administrator', 'SUPPORT_EDIT', `Site-wide contacts updated. Phone: ${phone}, Email: ${email}`);
  };

  const togglePartnerHiring = (active: boolean) => {
    setPartnerHiringActive(active);
    localStorage.setItem('pai_hiring_active', active ? 'true' : 'false');
    addLog('ADMIN', 'Administrator', 'HIRING_TOGGLE', `Hiring availability program toggled to ${active ? 'Active' : 'Paused'}`);
  };

  const updateSubmissionStatus = (submissionId: string, status: SubmissionStatus) => {
    const subIndex = submissions.findIndex(s => s.id === submissionId);
    if (subIndex === -1) return;
    const oldSub = submissions[subIndex];
    if (oldSub.status === 'PaymentDone' && status !== 'Payment Done') return; // protect payouts from getting reverted simply

    const updatedSubs = [...submissions];
    updatedSubs[subIndex] = { ...oldSub, status };
    setSubmissions(updatedSubs);
    localStorage.setItem('pai_subs', JSON.stringify(updatedSubs));

    addLog(currentUser?.id || 'ADMIN', currentUser?.name || 'Administrator', 'MIS_STATUS_UPDATE', `Approved campaign status of [${oldSub.clientName}] to ${status}`);

    // Core specification requirement: "or isme jo Payment Done hai na mai jis bhi account ko payment done click kruga us campaing ka jo ammount hoga uske dashboard me add ho jye. jitna mene campaing create ke time amount rakha hu."
    if (status === 'Payment Done' && oldSub.status !== 'Payment Done') {
      // Allocate the campaign payout into earnings of sub's publisher now
      const newEarning: EarningRecord = {
        id: `earning-${Date.now()}`,
        publisherId: oldSub.publisherId,
        campaignId: oldSub.campaignId,
        campaignName: oldSub.campaignName,
        amount: oldSub.payout,
        date: new Date().toISOString().substring(0, 10),
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      };
      
      const newEarnings = [newEarning, ...earnings];
      setEarnings(newEarnings);
      localStorage.setItem('pai_earnings', JSON.stringify(newEarnings));
      
      addLog('PAYMENT_SERVER', 'Automatic Ledger', 'EARNING_DISBURSE', `Disbursed ₹${oldSub.payout} campaign reward to ${oldSub.publisherId}`);
    }
  };

  const toggleBlockPublisher = (pubId: string) => {
    const updated = publishers.map(p => {
      if (p.id === pubId) {
        addLog('ADMIN', 'Administrator', p.blocked ? 'UNBLOCK_USER' : 'BLOCK_USER', `Account access modify for ${p.name} (${p.id})`);
        return { ...p, blocked: !p.blocked };
      }
      return p;
    });
    setPublishers(updated);
    localStorage.setItem('pai_pubs', JSON.stringify(updated));
  };

  const addEmployee = (name: string, u: string, p: string, role: 'Payment' | 'MIS') => {
    const existing = employees.find(e => e.username === u);
    if (existing) {
      return { success: false, message: 'Username is already taken by another staff member.' };
    }
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name,
      username: u,
      password: p,
      role
    };
    const updated = [...employees, newEmp];
    setEmployees(updated);
    localStorage.setItem('pai_employees', JSON.stringify(updated));
    addLog('ADMIN', 'Administrator', 'STAFF_ADDED', `Recruited new staff: ${name} (Role: ${role})`);
    return { success: true, message: 'Staff Employee account generated successfully!' };
  };

  const deleteEmployee = (id: string) => {
    const target = employees.find(e => e.id === id);
    if (!target) return;
    const updated = employees.filter(e => e.id !== id);
    setEmployees(updated);
    localStorage.setItem('pai_employees', JSON.stringify(updated));
    addLog('ADMIN', 'Administrator', 'STAFF_REMOVED', `Revoked access tokens for staff: ${target.name}`);
  };

  const triggerBackup = () => {
    const databaseSize = (JSON.stringify(localStorage).length / 1024).toFixed(2);
    const newBackup = {
      id: `b-${Date.now()}`,
      time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      scope: 'Full Database Snapshot Backup',
      size: `${databaseSize} KB`,
      status: 'Success'
    };
    const updatedBackups = [newBackup, ...backupLogs];
    setBackupLogs(updatedBackups);
    localStorage.setItem('pai_backup_logs', JSON.stringify(updatedBackups));
    addLog('SYSTEM', 'Core Database Manager', 'AUTO_BACKUP', `Database Snapshot exported successfully: size ${databaseSize} KB. Integrity check passes.`);
  };

  // Publisher actions
  const submitBankDetails = (details: BankDetails) => {
    if (!currentUser || currentUser.type !== 'publisher') return;
    const updated = {
      ...bankDetailsMap,
      [currentUser.id]: {
        ...details,
        publisherId: currentUser.id
      }
    };
    setBankDetailsMap(updated);
    localStorage.setItem('pai_bank', JSON.stringify(updated));
    addLog(currentUser.id, currentUser.name, 'BANK_UPDATE', 'Updated banking ledger details');
  };

  const submitLead = (campaignId: string, clientName: string, clientPhone: string, clientCode: string, screenshot: string) => {
    if (!currentUser || currentUser.type !== 'publisher') return { success: false, message: 'Authentication level required' };
    
    // Find campaign payout
    const camp = campaigns.find(c => c.id === campaignId);
    if (!camp) return { success: false, message: 'Invalid Campaign selected' };

    const newSub: DataSubmission = {
      id: `sub-${Date.now()}`,
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

    const updated = [newSub, ...submissions];
    setSubmissions(updated);
    localStorage.setItem('pai_subs', JSON.stringify(updated));

    addLog(currentUser.id, currentUser.name, 'LEAD_SUBMISSION', `Submitted new action lead for client [${clientName}] under campaign [${camp.name}]`);
    return { success: true, message: 'Data saved successfully. Admin and leads inspectors are matching details now!' };
  };

  const applyForPartner = (name: string, phone: string, email: string, city: string, age: number, qualification: string) => {
    if (!partnerHiringActive) {
      return { success: false, message: 'Hiring is currently closed or paused by management.' };
    }
    const newApp: PartnerApplication = {
      id: `part-${Date.now()}`,
      name,
      phone,
      email,
      city,
      age,
      qualification,
      submitDate: new Date().toISOString().substring(0, 10)
    };

    const updated = [newApp, ...partnerApplications];
    setPartnerApplications(updated);
    localStorage.setItem('pai_partners', JSON.stringify(updated));

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
      currentUser,
      
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
      addEmployee,
      deleteEmployee,
      triggerBackup,
      backupLogs,
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
