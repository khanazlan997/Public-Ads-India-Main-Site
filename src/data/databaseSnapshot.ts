// Static persistent database snapshot bundled with application
// Ensures 100% instant access across ANY device, even if Firestore read quota is exhausted or device is offline.
import type { Publisher, DataSubmission, EarningRecord, Campaign, BankDetails, Employee, AdvertiserInquiry, PartnerApplication } from "../types";

export const snapshotPublishers: Publisher[] = [];

export const snapshotEarnings: EarningRecord[] = [];

export const snapshotCampaigns: Campaign[] = [
  {
    "id": "camp-1782186948368",
    "name": "Jainam Broking Trade",
    "vertical": "Demat",
    "model": "CPA",
    "platform": "both",
    "kpi": "₹400 Brokrage Generate | 10 Time Buy Sell Maha Bank Stock",
    "geo": "India (PAN)",
    "payout": 600,
    "terms": "Create Account + Add fund ₹400 Complete Trade In Maha Bank Stock 10 Time Buy and Sell",
    "link": "https://sl1nk.com/e1i526c",
    "image": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=200",
    "directOpen": false,
    "active": true
  },
  {
    "id": "camp-1782187352501",
    "name": "ICICI SIP MF",
    "vertical": "MUTUAL FUND",
    "model": "CPA",
    "platform": "both",
    "geo": "India (PAN)",
    "kpi": "Document Based SIP | Add Fund 250",
    "payout": 450,
    "terms": "Contact Whatsapp Complete ICICI MF SIP Earn 400 Rupee | Same Day",
    "link": "https://wa.me/919196344494?text=*ICICI%20SIP%20APPLICATION*%0A%0ANAME%20:%0ANUMBER%20:%0AEMAIL%20:%0ADOB%20:%0APAN%20NO.%20:%0ACITY%20:%0APIN%20CODE%20:%0ABANK%20ACC.%20NO.%20:%0AIFSC%20CODE%20:%0AUPI%20:%0A%0A*SEND%20DETAIL%20FOR%20SIP%20✅*",
    "image": "https://companieslogo.com/img/orig/ICICIBANK.NS-d8fa5a43.png",
    "directOpen": true,
    "active": true
  },
  {
    "id": "camp-1782488164497",
    "name": "AngelOne Login NXT",
    "vertical": "Demat",
    "model": "CPA",
    "platform": "both",
    "geo": "India (PAN)",
    "kpi": "Create Account | Complete KYC | After Activation Login Account | After Login Earn ₹200",
    "payout": 200,
    "terms": "Create Account | Complete KYC | After Activation Login Account | After Login Earn ₹200",
    "link": "https://a.aonelink.in/ANGOne/bim3Nhz",
    "image": "https://companieslogo.com/img/orig/ANGELONE.NS-1b32eb04.png",
    "directOpen": true,
    "active": true
  },
  {
    "id": "camp-1782729203113",
    "name": "Axis Mutual Fund",
    "vertical": "Mutual Fund",
    "model": "CPA",
    "platform": "app",
    "geo": "India (PAN)",
    "kpi": "Complete SIP Add Fund ₹100 to ₹120",
    "payout": 250,
    "terms": "Send Detail Team Leader Complete SIP and Earn Rupee ₹250 Per SIP",
    "link": "https://wa.me/919196344494?text=%2AAXIS%20SIP%20DETAIL%2A%0A%0ANAME%20%3A%0ANUMBER%20%3A%0AEMAIL%20%3A%0ADOB%20%3A%0APAN%20NO.%20%3A%0ACITY%20%3A%0APIN%20CODE%20%3A%0ABANK%20ACC.%20NO.%20%3A%0AIFSC%20CODE%20%3A%0AUPI%20%3A%0A%0A%2ASEND%20DETAIL%20FOR%20SIP%20%E2%9C%85%2A",
    "image": "https://companieslogo.com/img/orig/AXISBANK.NS-afad3e20.png",
    "directOpen": true,
    "active": true
  },
  {
    "id": "camp-1782899563444",
    "name": "mStock Login (AZK)",
    "vertical": "Demat",
    "model": "CPA",
    "platform": "app",
    "geo": "India (PAN)",
    "kpi": "Only Complete KYC | and Successfull Open Account",
    "payout": 100,
    "terms": "Only Account Opening & Complete KYC Earn ₹100 Same Day",
    "link": "https://mstock.onelink.me/CX05/1zec7d23",
    "image": "https://companieslogo.com/img/orig/MIRAE.KS-11bb5cbb.png",
    "directOpen": true,
    "active": true
  },
  {
    "id": "camp-1783059438041",
    "name": "Angelone NXT Trade (KFGY)",
    "vertical": "Demat",
    "model": "CPA",
    "platform": "both",
    "geo": "India (PAN)",
    "kpi": "Angelone Only Trade (KFGY) Create Account & After Activation Login Add Fund ₹20 Complete Trade 5 Time Buy Sell 'Idea NSE' Share.",
    "payout": 400,
    "terms": "Angelone :\nComplete KYC Account.\nAfter Activation Complete Trade Add Fund ₹20\n5 Time Buy / Sell Share \"Idea NSE\".\nComplete Task Earn ₹400₹ Same Day ✅",
    "link": "https://a.aonelink.in/ANGOne/64wX1Zd?utm_source=youtube&utm_medium=azln&utm_campaign=azln",
    "image": "https://companieslogo.com/img/orig/ANGELONE.NS-1b32eb04.png",
    "directOpen": true,
    "active": true
  },
  {
    "id": "camp-1783315293867",
    "name": "HDFC Mutual Fund",
    "vertical": "Mutual Fund",
    "model": "CPA",
    "platform": "both",
    "geo": "India (PAN)",
    "kpi": "Document Based | Investment ₹100 - Refundable after 45 Days",
    "payout": 250,
    "terms": "Complete SIP for Document Based Investment ₹100 | Payout ₹250 Same Day",
    "link": "https://wa.me/919196344494?text=*HDFC%20SIP%20APPLICATION*%0A%0ANAME%20:%0ANUMBER%20:%0AEMAIL%20:%0ADOB%20:%0APAN%20NO.%20:%0ACITY%20:%0APIN%20CODE%20:%0ABANK%20ACC.%20NO.%20:%0AIFSC%20CODE%20:%0AUPI%20:%0A%0A*SEND%20DETAIL%20FOR%20SIP%20✅*",
    "image": "https://companieslogo.com/img/orig/HDFCBANK.NS-d655f470.png",
    "directOpen": true,
    "active": true
  },
  {
    "id": "camp-1783427397425",
    "name": "YAPO Calling Work",
    "vertical": "Calling",
    "model": "CALL",
    "platform": "app",
    "geo": "India (PAN)",
    "kpi": "Create Account Female Only | Using Code : VFNGMGJ4 | Earn Money Weekly ₹5000",
    "payout": 1000,
    "terms": "This Campaign Only For 18+ Girls | Calling Work Using Code : VFNGMGJ4",
    "link": "https://play.google.com/store/apps/details?id=in.yapo",
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    "directOpen": true,
    "active": true
  },
  {
    "id": "camp-1784023117999",
    "name": "AETHRAM TRADE",
    "vertical": "Demat",
    "model": "CPA",
    "platform": "both",
    "geo": "India (PAN)",
    "kpi": "Only Account Opening | Complete KYC and Successfull Account Opening",
    "payout": 110,
    "terms": "Daily Report | After Activation Payment Next Day Settle ✅ Login Only ",
    "link": "https://ekyc.aetramtrades.in/?refid=UkFUTTAyMTExMQ==",
    "image": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=200",
    "directOpen": true,
    "active": true
  },
  {
    "id": "camp-1784102918199",
    "name": "Lemonn Broking",
    "vertical": "Demat",
    "model": "CPA",
    "platform": "both",
    "geo": "India (PAN)",
    "kpi": "Create Account Successfully Active Add fund ₹100 Buy (Idea,PC Jeweller,RattanIndia Power) Any One Share Buy.",
    "payout": 300,
    "terms": "Add Fund 100 | After Trade Payout ₹ 300",
    "link": "https://buildyourweebsite.com/form.php?form_code=6a4de13b",
    "image": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=200",
    "directOpen": true,
    "active": true
  },
  {
    "id": "camp-1784103135491",
    "name": "Incred Stocko : Broking",
    "vertical": "Demat",
    "model": "CPA",
    "platform": "both",
    "geo": "India (PAN)",
    "kpi": "Create FnO Account Successfully | After Active FnO Account Add fund ₹200 Complete FnO Share",
    "payout": 500,
    "terms": "Add fund ₹200 Trade Complete In FnO | Payout ₹500 Weekly",
    "link": "https://advinix.gotrackier.io/click?campaign_id=33&pub_id=73&source={click_id}",
    "image": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=200",
    "directOpen": true,
    "active": true
  },
  {
    "id": "camp-1784872228768",
    "name": "ICICI Mutual Fund",
    "vertical": "Mutual Fund",
    "model": "CPA",
    "platform": "web",
    "geo": "India (PAN)",
    "kpi": "Document Based Process | Add Fund 1000 Next Day Withdrawl | Payout Same Day",
    "payout": 600,
    "terms": "Contact Whatsapp +91 9196344494 Complete ICICI MF SIP Earn 600 Rupee | Same Day | Fund Withdrawl Next Day",
    "link": "https://wa.me/919196344494?text=*ICICI%20SIP%20APPLICATION*%0A%0ANAME%20:%0ANUMBER%20:%0AEMAIL%20:%0ADOB%20:%0APAN%20NO.%20:%0ACITY%20:%0APIN%20CODE%20:%0ABANK%20ACC.%20NO.%20:%0AIFSC%20CODE%20:%0AUPI%20:%0A%0A*SEND%20DETAIL%20FOR%20SIP%20✅*",
    "image": "https://companieslogo.com/img/orig/ICICIBANK.NS-d8fa5a43.png",
    "directOpen": true,
    "active": true
  },
  {
    "id": "camp-1786523186293",
    "name": "5 Paisa Broking",
    "vertical": "Demat",
    "model": "CPA",
    "platform": "both",
    "geo": "India (PAN)",
    "kpi": "Create Account Complete KYC After Activation Add Fund ₹50 Buy \"IDEA Share\" 2 Times",
    "payout": 250,
    "terms": "Create Account Complete KYC After Activation Add Fund ₹50 Buy \"IDEA Share\" 2 Times Earn ₹250",
    "link": "https://www.5paisa.com/demat-account?ReferralCode=55701760&ReturnUrl=invest-open-account",
    "image": "https://companieslogo.com/img/orig/5PAISA.NS-078c1ffb.png",
    "directOpen": true,
    "active": true
  },
  {
    "id": "camp-1786523345335",
    "name": "Pocketfull Demat",
    "vertical": "Demat",
    "model": "CPA",
    "platform": "both",
    "geo": "India (PAN)",
    "kpi": "Create Account Complete KYC After Activation Add Fund ₹30 Buys \"IDEA Share\" 5 Times Buy Sell",
    "payout": 280,
    "terms": "Create Account Complete KYC After Activation Add Fund ₹30 Buys \"IDEA Share\" 5 Times Buy Sell — Earn ₹280",
    "link": "https://web.pocketful.in/short/L2fMYOjB",
    "image": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=200",
    "directOpen": true,
    "active": true
  },
  {
    "id": "camp-1788081993708",
    "name": "mStock MUTUL FUND",
    "vertical": "MUTUL FUND",
    "model": "CPA",
    "platform": "web",
    "geo": "India (PAN)",
    "kpi": "DOCUMENT BASED | ADD FUND ₹100/₹120 PAYOUT ₹250",
    "payout": 250,
    "terms": "BULK QUANTITY 20+ SIP = ₹300/PER ACCOUNT",
    "link": "https://wa.me/919196344494?text=%2AMSTOCK%20MF%20DETAIL%2A%0A%0ANAME%20%3A%0ANUMBER%20%3A%0AEMAIL%20%3A%0ADOB%20%3A%0APAN%20NO.%20%3A%0ASTATE%20NAME%20%3A%0ACITY%20NAME%20%3A%0AAREA%20%3A%0APIN%20CODE%20%3A%0ABANK%20ACC.%20NO.%20%3A%0AIFSC%20CODE%20%3A%0AUPI%20%3A%0A%0A%2ASEND%20DETAIL%20FOR%20MF%20%E2%9C%85%2A",
    "image": "https://companieslogo.com/img/orig/MIRAE.KS-11bb5cbb.png",
    "directOpen": true,
    "active": true
  },
  {
    "id": "camp-1788287125677",
    "name": "KOTAK MUTUAL FUND",
    "vertical": "MUTUAL FUND",
    "model": "CPA",
    "platform": "web",
    "geo": "India (PAN)",
    "kpi": "Document Based | Add fund : 100 Same Day Payment Avilable.",
    "payout": 300,
    "terms": "Document Based Process | Add Fund : 100 | Payout : 300 | Same Day Payment",
    "link": "https://wa.me/919196344494?text=%2AKOTAK%20MF%20DETAIL%2A%0A%0ANAME%20%3A%0ANUMBER%20%3A%0AEMAIL%20%3A%0ADOB%20%3A%0APAN%20NO.%20%3A%0ACITY%20%3A%0APIN%20CODE%20%3A%0ABANK%20ACC.%20NO.%20%3A%0AIFSC%20CODE%20%3A%0AUPI%20%3A%0A%0A%2ASEND%20DETAIL%20FOR%20SIP%20%E2%9C%85%2A",
    "image": "https://companieslogo.com/img/orig/KOTAKBANK.NS-9ceb4be6.png",
    "directOpen": true,
    "active": true
  }
];

export const snapshotBankDetailsMap: Record<string, BankDetails> = {};

export const snapshotEmployees: Employee[] = [];

export const snapshotSubmissions: DataSubmission[] = [];

export const snapshotAdvertiserInquiries: AdvertiserInquiry[] = [
  {
    "id": "INQ-TEST1",
    "name": "Rajesh Kumar",
    "phone": "9876543210",
    "email": "rajesh@example.com",
    "company": "Fintech Leads Co",
    "campaign": "Loan CPA Promotion",
    "submittedAt": "2026-09-09T17:30:00.000Z"
  }
];

export const snapshotPartners: PartnerApplication[] = [];
