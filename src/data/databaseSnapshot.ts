// Static persistent database snapshot bundled with application
// Ensures 100% instant access across ANY device, even if Firestore read quota is exhausted or device is offline.
import type { Publisher, DataSubmission, EarningRecord, Campaign, BankDetails, Employee, AdvertiserInquiry, PartnerApplication } from "../types";

export const snapshotPublishers: Publisher[] = [
  {
    "id": "PUB1533",
    "name": "Isma Ansari",
    "email": "ismaansari877@gmail.com",
    "password": "isma@11",
    "systemVersion": "v2",
    "blocked": false,
    "joinedDate": "2026-09-14",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7sa2JYSrSfdqquW-8HZa7VeRXZWm01vdBGsVG-m85ilMv6789q9qcUz-iSLN2YUiDq3stBXueElaMPuCg-M6JNFrHdNLK8UnfT3NDgYyCmniwdlagcYXeb7IQ29jSK5PGRS2gm7mx3uUaEFkjQpGVRv6gF0b43SFyf6NFHpPVOo2RuYJY8M2njpv5hXs/s2048/Gemini_Generated_Image_txixh7txixh7txix.png",
    "phone": "8090084432"
  },
  {
    "id": "PUB1622",
    "blocked": false,
    "password": "897182",
    "email": "ayankhanking350@gmail.com",
    "name": "Ayan khan",
    "systemVersion": "v2",
    "joinedDate": "2026-09-13",
    "inviteCode": "1098",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7sa2JYSrSfdqquW-8HZa7VeRXZWm01vdBGsVG-m85ilMv6789q9qcUz-iSLN2YUiDq3stBXueElaMPuCg-M6JNFrHdNLK8UnfT3NDgYyCmniwdlagcYXeb7IQ29jSK5PGRS2gm7mx3uUaEFkjQpGVRv6gF0b43SFyf6NFHpPVOo2RuYJY8M2njpv5hXs/s2048/Gemini_Generated_Image_txixh7txixh7txix.png",
    "phone": "8971828604"
  },
  {
    "id": "PUB1923",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYTtYC0gJn4gMEYyYylS71fiNiWngHOMAgY5rmphLDDAP01Nc9ASJCMRJWI5EF9O58QgyRE_T5S5rq7-p8iprJkH0e1muO48LKEV4xuTDlsn5ZkVLrnvXFDN2QM_ekhndsmNA1skwIP2VWNo0zGhENbd8XsuRtv9_PDC5L4rjyLRkEYtWn4VcKTnnoFn7c/s736/1000227902.jpg",
    "joinedDate": "2026-09-14",
    "password": "caBwyz-kodhah-vokte7",
    "phone": "7619508951",
    "blocked": false,
    "inviteCode": "PUB 6634",
    "name": "Aaiman Siddique",
    "email": "aimanammu947@gmail.com",
    "systemVersion": "v2"
  },
  {
    "id": "PUB3019",
    "email": "ruhifathima1902@gmail.com",
    "blocked": false,
    "name": "Ruhi Fathima",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYTtYC0gJn4gMEYyYylS71fiNiWngHOMAgY5rmphLDDAP01Nc9ASJCMRJWI5EF9O58QgyRE_T5S5rq7-p8iprJkH0e1muO48LKEV4xuTDlsn5ZkVLrnvXFDN2QM_ekhndsmNA1skwIP2VWNo0zGhENbd8XsuRtv9_PDC5L4rjyLRkEYtWn4VcKTnnoFn7c/s736/1000227902.jpg",
    "inviteCode": "PUB7874",
    "phone": "9986712823",
    "password": "190219",
    "systemVersion": "v2",
    "joinedDate": "2026-09-14"
  },
  {
    "id": "PUB3135",
    "password": "1234",
    "systemVersion": "v2",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7sa2JYSrSfdqquW-8HZa7VeRXZWm01vdBGsVG-m85ilMv6789q9qcUz-iSLN2YUiDq3stBXueElaMPuCg-M6JNFrHdNLK8UnfT3NDgYyCmniwdlagcYXeb7IQ29jSK5PGRS2gm7mx3uUaEFkjQpGVRv6gF0b43SFyf6NFHpPVOo2RuYJY8M2njpv5hXs/s2048/Gemini_Generated_Image_txixh7txixh7txix.png",
    "blocked": false,
    "email": "nehabully86@gmail.com",
    "joinedDate": "2026-09-13",
    "name": "Neha Agarwal",
    "phone": "7980652631"
  },
  {
    "id": "PUB3155",
    "phone": "7676784264",
    "systemVersion": "v2",
    "blocked": false,
    "joinedDate": "2026-09-13",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7sa2JYSrSfdqquW-8HZa7VeRXZWm01vdBGsVG-m85ilMv6789q9qcUz-iSLN2YUiDq3stBXueElaMPuCg-M6JNFrHdNLK8UnfT3NDgYyCmniwdlagcYXeb7IQ29jSK5PGRS2gm7mx3uUaEFkjQpGVRv6gF0b43SFyf6NFHpPVOo2RuYJY8M2njpv5hXs/s2048/Gemini_Generated_Image_txixh7txixh7txix.png",
    "email": "7676784264",
    "name": "Misba khan",
    "password": "Misba@7867"
  },
  {
    "id": "PUB3557",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYTtYC0gJn4gMEYyYylS71fiNiWngHOMAgY5rmphLDDAP01Nc9ASJCMRJWI5EF9O58QgyRE_T5S5rq7-p8iprJkH0e1muO48LKEV4xuTDlsn5ZkVLrnvXFDN2QM_ekhndsmNA1skwIP2VWNo0zGhENbd8XsuRtv9_PDC5L4rjyLRkEYtWn4VcKTnnoFn7c/s736/1000227902.jpg",
    "email": "shaikhsameerali287@gmail.com",
    "blocked": false,
    "phone": "8856079734",
    "password": "181019",
    "joinedDate": "2026-09-15",
    "name": "Shaikh",
    "systemVersion": "v2"
  },
  {
    "id": "PUB4232",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7sa2JYSrSfdqquW-8HZa7VeRXZWm01vdBGsVG-m85ilMv6789q9qcUz-iSLN2YUiDq3stBXueElaMPuCg-M6JNFrHdNLK8UnfT3NDgYyCmniwdlagcYXeb7IQ29jSK5PGRS2gm7mx3uUaEFkjQpGVRv6gF0b43SFyf6NFHpPVOo2RuYJY8M2njpv5hXs/s2048/Gemini_Generated_Image_txixh7txixh7txix.png",
    "name": "Shaikh sameer",
    "phone": "8856079734",
    "joinedDate": "2026-09-14",
    "email": "shaikhsameerali287@gmail.com",
    "password": "shaikh181019",
    "systemVersion": "v2",
    "blocked": false
  },
  {
    "id": "PUB5253",
    "password": "Azlan123#",
    "avatar": "data:image/jpeg;base64,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",
    "systemVersion": "v2",
    "joinedDate": "2026-09-13",
    "email": "khanazlan997@gmail.com",
    "name": "AZLAN KHAN",
    "phone": "8934932418",
    "blocked": false
  },
  {
    "id": "PUB6634",
    "joinedDate": "2026-09-13",
    "phone": "6239055230",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7sa2JYSrSfdqquW-8HZa7VeRXZWm01vdBGsVG-m85ilMv6789q9qcUz-iSLN2YUiDq3stBXueElaMPuCg-M6JNFrHdNLK8UnfT3NDgYyCmniwdlagcYXeb7IQ29jSK5PGRS2gm7mx3uUaEFkjQpGVRv6gF0b43SFyf6NFHpPVOo2RuYJY8M2njpv5hXs/s2048/Gemini_Generated_Image_txixh7txixh7txix.png",
    "blocked": false,
    "name": "Momina Ansari",
    "systemVersion": "v2",
    "email": "mominaansari840@gmail.com",
    "password": "An@biy@7890"
  },
  {
    "id": "PUB6659",
    "phone": "7382345356",
    "password": "Suzi@321",
    "joinedDate": "2026-09-13",
    "blocked": false,
    "systemVersion": "v2",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7sa2JYSrSfdqquW-8HZa7VeRXZWm01vdBGsVG-m85ilMv6789q9qcUz-iSLN2YUiDq3stBXueElaMPuCg-M6JNFrHdNLK8UnfT3NDgYyCmniwdlagcYXeb7IQ29jSK5PGRS2gm7mx3uUaEFkjQpGVRv6gF0b43SFyf6NFHpPVOo2RuYJY8M2njpv5hXs/s2048/Gemini_Generated_Image_txixh7txixh7txix.png",
    "name": "Suzi",
    "email": "suzainsuzi001@gamil.com"
  },
  {
    "id": "PUB7010",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYTtYC0gJn4gMEYyYylS71fiNiWngHOMAgY5rmphLDDAP01Nc9ASJCMRJWI5EF9O58QgyRE_T5S5rq7-p8iprJkH0e1muO48LKEV4xuTDlsn5ZkVLrnvXFDN2QM_ekhndsmNA1skwIP2VWNo0zGhENbd8XsuRtv9_PDC5L4rjyLRkEYtWn4VcKTnnoFn7c/s736/1000227902.jpg",
    "password": "Mahe@123",
    "email": "9112475994",
    "joinedDate": "2026-09-14",
    "name": "Mahewish",
    "phone": "9112475994",
    "systemVersion": "v2",
    "blocked": false
  },
  {
    "id": "PUB7140",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYTtYC0gJn4gMEYyYylS71fiNiWngHOMAgY5rmphLDDAP01Nc9ASJCMRJWI5EF9O58QgyRE_T5S5rq7-p8iprJkH0e1muO48LKEV4xuTDlsn5ZkVLrnvXFDN2QM_ekhndsmNA1skwIP2VWNo0zGhENbd8XsuRtv9_PDC5L4rjyLRkEYtWn4VcKTnnoFn7c/s736/1000227902.jpg",
    "email": "shaikhameen010208@gmail.com",
    "joinedDate": "2026-09-15",
    "password": "sameer181019",
    "name": "Shaikh",
    "phone": "8856079734",
    "blocked": false,
    "systemVersion": "v2"
  },
  {
    "id": "PUB7304",
    "name": "Md kaif",
    "email": "mdkaifofc@gmail.com",
    "blocked": false,
    "systemVersion": "v2",
    "phone": "6290902746",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7sa2JYSrSfdqquW-8HZa7VeRXZWm01vdBGsVG-m85ilMv6789q9qcUz-iSLN2YUiDq3stBXueElaMPuCg-M6JNFrHdNLK8UnfT3NDgYyCmniwdlagcYXeb7IQ29jSK5PGRS2gm7mx3uUaEFkjQpGVRv6gF0b43SFyf6NFHpPVOo2RuYJY8M2njpv5hXs/s2048/Gemini_Generated_Image_txixh7txixh7txix.png",
    "password": "Kaif2003@#",
    "joinedDate": "2026-09-13"
  },
  {
    "id": "PUB7874",
    "blocked": false,
    "phone": "9964791052",
    "systemVersion": "v2",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7sa2JYSrSfdqquW-8HZa7VeRXZWm01vdBGsVG-m85ilMv6789q9qcUz-iSLN2YUiDq3stBXueElaMPuCg-M6JNFrHdNLK8UnfT3NDgYyCmniwdlagcYXeb7IQ29jSK5PGRS2gm7mx3uUaEFkjQpGVRv6gF0b43SFyf6NFHpPVOo2RuYJY8M2njpv5hXs/s2048/Gemini_Generated_Image_txixh7txixh7txix.png",
    "inviteCode": "PUB1090",
    "password": "030405",
    "name": "Noorain Falak",
    "email": "noorainfalak0099@gmail.com",
    "joinedDate": "2026-09-14"
  },
  {
    "id": "PUB8568",
    "password": "Mehak@123",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYTtYC0gJn4gMEYyYylS71fiNiWngHOMAgY5rmphLDDAP01Nc9ASJCMRJWI5EF9O58QgyRE_T5S5rq7-p8iprJkH0e1muO48LKEV4xuTDlsn5ZkVLrnvXFDN2QM_ekhndsmNA1skwIP2VWNo0zGhENbd8XsuRtv9_PDC5L4rjyLRkEYtWn4VcKTnnoFn7c/s736/1000227902.jpg",
    "blocked": false,
    "email": "9886965876",
    "name": "Mehak taj",
    "joinedDate": "2026-09-14",
    "phone": "8310573970",
    "systemVersion": "v2"
  },
  {
    "id": "PUB9365",
    "avatar": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYTtYC0gJn4gMEYyYylS71fiNiWngHOMAgY5rmphLDDAP01Nc9ASJCMRJWI5EF9O58QgyRE_T5S5rq7-p8iprJkH0e1muO48LKEV4xuTDlsn5ZkVLrnvXFDN2QM_ekhndsmNA1skwIP2VWNo0zGhENbd8XsuRtv9_PDC5L4rjyLRkEYtWn4VcKTnnoFn7c/s736/1000227902.jpg",
    "phone": "8197810665",
    "systemVersion": "v2",
    "name": "Simran",
    "joinedDate": "2026-09-14",
    "password": "zaisha234@",
    "email": "khan81978106@gmail.com",
    "blocked": false
  }
];

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

export const snapshotSubmissions: DataSubmission[] = [
  {
    "id": "sub-1789386137020",
    "clientName": "Jyoti thakur ",
    "publisherId": "PUB3135",
    "status": "Process",
    "payout": 400,
    "submitDate": "2026-09-14 11:42",
    "screenshot": "data:image/jpeg;base64,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AOZ4fn6lbAjW4Nlr8A5nh+fqVslKka7wmu8KUQRrvCa7wpRBGu8JrvClEEa7wmu8KUQRrvCa7wqvkbG3M9waN5Nla+l0DXeE13hAboga7wmu8IpQRrvCa7wpRBGu8JrvClEEa7wmu8KUQRrvCggnadFZEBcHiPOVT+a71XeLg8R5yqfzXeqqqZdbgsUkOFxRysLHi92uFiNVnoilQiIgIiICKpexps5wHiVIIcLggjeEEoiIMSshke+KRgzBhN26X1G0X0uP8lXjhkjie10zpS4kgutpfo0XuizTe0601fEV5ipmsPF8UwNdy+kW17xYHReEUeJSl2V0rQ0W5byLu62zZ3LdZmZsuYX3XU2CnouMk/Rq20ta6tjklcTHE7QCQ6/FrbwLfJbRLKVURpNrTYREWpEUX1spQEREBERAXGV2G1slfO9lLK5rpHEENOuq7NFsTpkwIsb3jQ9tp/3W/dPeND22n/db91jWSixveND22n/db90940Pbaf8Adb90GSixveND22n/AHW/dPeND22n/db90HnVgmUadHZzJ9VkU2kDf/xk+i8/eND22n/db90940Pbaf8Adb90GSixveND22n/AHW/dPeND22n/db90GSixveND22n/db90940Pbaf91v3QY7428RNEYHGZxfldxd9pNjm8lsFj+8aHttP+637p7xoe20/7rfugyUWN7xoe20/7rfunvGh7bT/ALrfugyVSQOdG4MdlcRody8feND22n/db90940Pbaf8Adb90FI4nNq2OMRBDXZn3vfZ0rMWN7xoe20/7rfunvGh7bT/ut+6DJRY3vGh7bT/ut+6e8aHttP8Aut+6DJRY3vGh7bT/ALrfunvGh7bT/ut+6DJRY3vGh7bT/ut+6e8aHttP+637oPx4iIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIg//9k=",
    "campaignName": "Angelone Trade",
    "campaignId": "camp-1789371507755",
    "clientCode": "",
    "publisherName": "Neha Agarwal",
    "clientPhone": "8219519309"
  }
];

export const snapshotAdvertiserInquiries: AdvertiserInquiry[] = [];

export const snapshotPartners: PartnerApplication[] = [];
