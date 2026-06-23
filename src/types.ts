export type SubmissionStatus = 'Process' | 'Reject' | 'Ready To Trade' | 'Active' | 'Payment Done' | 'Trade Done';

export interface Campaign {
  id: string;
  name: string;
  vertical: string;
  model: string; // CPA, CPI, CPL, etc.
  platform: 'web' | 'app' | 'both';
  kpi: string;
  geo: string;
  payout: number; // in ₹
  terms: string;
  link: string;
  image: string; // Base64 or standard asset URL/placeholder icon
  active: boolean;
  directOpen?: boolean;
}

export interface Publisher {
  id: string; // e.g. "PUB1001"
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar: string; // Base64 or icon code
  blocked: boolean;
  joinedDate: string;
}

export interface EarningRecord {
  id: string;
  publisherId: string;
  campaignId: string;
  campaignName: string;
  amount: number;
  date: string;
  time: string;
}

export interface DataSubmission {
  id: string;
  publisherId: string;
  publisherName: string;
  campaignId: string;
  campaignName: string;
  payout: number;
  clientName: string;
  clientPhone: string;
  clientCode?: string;
  screenshot: string; // Base64 image
  submitDate: string;
  status: SubmissionStatus;
}

export interface Employee {
  id: string;
  name: string;
  username: string; // login identifier
  password: string;
  role: 'Payment' | 'MIS'; // 'Payment' can process payment, 'MIS' can check leads but CANNOT see bank details
}

export interface PartnerApplication {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  age: number;
  qualification: string;
  submitDate: string;
}

export interface BankDetails {
  publisherId: string;
  holderName: string;
  phone: string;
  email: string;
  accountNumber: string;
  ifsc: string;
  upi: string;
  qrCode: string; // Base64 image
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
}

export interface ActiveOffer {
  image: string; // Base64 or standard URL
  active: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
  link?: string;
  showButton?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  profession: string;
  image: string;
  message: string;
}

