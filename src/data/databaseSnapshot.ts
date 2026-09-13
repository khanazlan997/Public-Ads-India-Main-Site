// Static persistent database snapshot bundled with application
// Ensures 100% instant access across ANY device, even if Firestore read quota is exhausted or device is offline.
import type { Publisher, DataSubmission, EarningRecord, Campaign, BankDetails, Employee, AdvertiserInquiry, PartnerApplication } from "../types";

export const snapshotPublishers: Publisher[] = [];

export const snapshotEarnings: EarningRecord[] = [];

export const snapshotCampaigns: Campaign[] = [
  {
    id: "camp-angelone",
    name: "AngelOne Demat & Trading",
    vertical: "Demat & Stock Broking",
    model: "CPA",
    platform: "both",
    kpi: "Instant Account Opening + First Trade/Earning",
    geo: "India",
    payout: 500,
    terms: "Aadhaar linked Mobile + PAN Card required. Instant e-KYC approval.",
    link: "https://angel-one.onelink.me/w0n5/4b0g4x7z",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600",
    active: true
  },
  {
    id: "camp-jainam",
    name: "Jainam Broking Demat",
    vertical: "Demat & Stock Broking",
    model: "CPA",
    platform: "web",
    kpi: "Digital Onboarding & e-Sign Completion",
    geo: "India",
    payout: 400,
    terms: "PAN Card + Aadhaar Card + Cancelled Cheque required.",
    link: "https://jainam.in/register",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600",
    active: true
  },
  {
    id: "camp-5paisa",
    name: "5Paisa Discount Broking",
    vertical: "Discount Broking",
    model: "CPL",
    platform: "app",
    kpi: "5-Minute Paperless Account Opening",
    geo: "India",
    payout: 350,
    terms: "Aadhaar OTP + PAN verification.",
    link: "https://www.5paisa.com/open-demat-account",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600",
    active: true
  },
  {
    id: "camp-icici-mf",
    name: "ICICI Prudential Mutual Fund SIP",
    vertical: "Mutual Funds & SIP",
    model: "CPA",
    platform: "web",
    kpi: "First SIP Mandate Setup starting at ₹500/mo",
    geo: "India",
    payout: 300,
    terms: "KYC verified Bank Account + PAN Card required.",
    link: "https://www.icicipruamc.com",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=600",
    active: true
  },
  {
    id: "camp-aetram",
    name: "Aetram Trade Global Forex",
    vertical: "Forex & Global Markets",
    model: "CPA",
    platform: "both",
    kpi: "Account Verification & Minimum Deposit",
    geo: "Global / India",
    payout: 600,
    terms: "Passport/Voter ID/Aadhaar + Bank Statement required.",
    link: "https://aetramtrade.com",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=600",
    active: true
  },
  {
    id: "camp-mstock",
    name: "mStock Zero Brokerage Demat",
    vertical: "Discount Broking",
    model: "CPA",
    platform: "app",
    kpi: "Successful 100% Digital e-KYC Onboarding",
    geo: "India",
    payout: 450,
    terms: "PAN Card + Aadhaar Linked Mobile required.",
    link: "https://www.mstock.com",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600",
    active: true
  }
];

export const snapshotBankDetailsMap: Record<string, BankDetails> = {};

export const snapshotEmployees: Employee[] = [];

export const snapshotSubmissions: DataSubmission[] = [];

export const snapshotAdvertiserInquiries: AdvertiserInquiry[] = [];

export const snapshotPartners: PartnerApplication[] = [];
