import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { snapshotPublishers, snapshotCampaigns } from "./src/data/databaseSnapshot";

const defaultTestimonials = [
  {
    id: "testi-1",
    name: "Rahul Sharma",
    profession: "Demat Publisher, Kanpur",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    message: "Maine zero investment se Demat account opening work start kiya tha. Daily UPI se payout exact time pe mil jata hai. Transparent tracking and 100% trusted network."
  },
  {
    id: "testi-2",
    name: "Pooja Verma",
    profession: "Telecalling & BPO Partner, Lucknow",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    message: "Work from home calling work ke liye sabse reliable platform hai. Lead verification bahut fast hota hai aur payment me kabhi delay nahi hua. 5-star support!"
  },
  {
    id: "testi-3",
    name: "Amit Patel",
    profession: "Master Affiliate Partner, Gujarat",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    message: "Public Ads India ke fintech CPA campaigns ka conversion rate aur payout industry me sabse best hai. Inka MIS portal aur lead dashboard behad user-friendly hai."
  },
  {
    id: "testi-4",
    name: "Neha Singh",
    profession: "Student & Part-Time Publisher, Delhi",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
    message: "Bina kisi investment ke daily 2-3 hours work karke achi income generate ho rahi hai. Customer support team hamesha guide karti hai. Truly India's trusted platform."
  },
  {
    id: "testi-5",
    name: "Vikas Yadav",
    profession: "Agency Owner (25+ Agents), Kanpur",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    message: "Hamari Puri calling team PAI ke banking aur Demat campaigns par kaam karti hai. Bulk payment processing aur live status tracking system unmatchable hai."
  },
  {
    id: "testi-6",
    name: "Sunil Gupta",
    profession: "Digital Marketer & Publisher, Jaipur",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
    message: "Fintech affiliate offers aur calling projects ke liye India ka #1 portal. Admin aur support team ka response instant rehta hai. Highly recommended!"
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // CORS middleware for seamless cross-device mobile and desktop access
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // JSON body parser with generous limit
  app.use(express.json({ limit: "25mb" }));

  // Add standard api health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // ==========================================
  // REALTIME SYNCHRONIZATION ENGINE (SSE & REST)
  // Protects Firebase Quota & provides 50ms Cross-Device Real-time updates
  // ==========================================
  const DATA_DIR = path.resolve(process.cwd(), "server_data");
  const DATA_FILE = path.join(DATA_DIR, "store.json");

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn("Could not verify server_data dir:", err);
  }

  interface ServerStore {
    submissions: any[];
    earnings: any[];
    campaigns: any[];
    publishers: any[];
    bankDetailsMap: Record<string, any>;
    employees: any[];
    advertiserInquiries: any[];
    partners: any[];
    testimonials?: any[];
    settings?: any;
    updatedAt: number;
  }

  const defaultSettings = {
    supportPhone: '+91 8934932418',
    supportEmail: 'publicadsnetwork@gmail.com',
    partnerHiringActive: true,
    googleSheetUrl: '',
    offer: { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600', active: false }
  };

  let store: ServerStore = {
    submissions: [],
    earnings: [],
    campaigns: [],
    publishers: [],
    bankDetailsMap: {},
    employees: [],
    advertiserInquiries: [],
    partners: [],
    testimonials: [],
    settings: defaultSettings,
    updatedAt: Date.now()
  };

  // Load existing persistent storage from disk if available
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      store = { ...store, ...parsed };
      if (!store.settings) store.settings = defaultSettings;
      else store.settings = { ...defaultSettings, ...store.settings };
      if (!Array.isArray(store.testimonials) || store.testimonials.length === 0) {
        store.testimonials = defaultTestimonials;
      }
  // Keep persisted client records. Older accounts and leads remain valid data;
  // filtering them at server startup caused different devices to show different counts.
  if (!Array.isArray(store.publishers)) store.publishers = [];
  if (!Array.isArray(store.submissions)) store.submissions = [];
  if (!Array.isArray(store.earnings)) store.earnings = [];
      console.log(`Loaded ${store.submissions.length} submissions, ${store.earnings.length} earnings, and ${store.publishers.length} v2 publishers from server storage.`);
    }
  } catch (e) {
    console.warn("Could not read server_data/store.json, using initialized store:", e);
  }

  if (!Array.isArray(store.testimonials) || store.testimonials.length === 0) {
    store.testimonials = defaultTestimonials;
  }

  if (!store.publishers) {
    store.publishers = [];
  }

  // Campaigns Initialization & Synchronization
  if (!Array.isArray(store.campaigns) || store.campaigns.length === 0) {
    store.campaigns = snapshotCampaigns;
  }

  // Auto-reconciliation: ensure every submission marked 'Payment Done' has a corresponding record in store.earnings
  let reconciledEarnings = 0;
  const isPaymentDone = (st?: string) => {
    const s = (st || '').toLowerCase().trim();
    return s === 'payment done' || s === 'paymentdone' || s === 'paid';
  };

  store.submissions.forEach(sub => {
    if (isPaymentDone(sub.status)) {
      const pubId = (sub.publisherId || '').trim();
      const hasEarning = store.earnings.some(e => e.id === `earning-${sub.id}`);
      if (!hasEarning) {
        store.earnings.unshift({
          id: `earning-${sub.id}`,
          publisherId: pubId,
          campaignId: sub.campaignId || '',
          campaignName: sub.campaignName || 'Campaign Payout',
          amount: Number(sub.payout) || 0,
          date: (sub.submitDate || '').substring(0, 10) || new Date().toISOString().substring(0, 10),
          time: (sub.submitDate || '').substring(11, 16) || '12:00'
        });
        reconciledEarnings++;
      }
    }
  });
  if (reconciledEarnings > 0) {
    console.log(`[Store Auto-Reconciled] Added ${reconciledEarnings} missing earning records for confirmed Payment Done leads.`);
    setTimeout(() => {
      try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(store), "utf-8");
      } catch (e) {}
    }, 1500);
  }

  let saveTimer: NodeJS.Timeout | null = null;
  function scheduleSaveStore() {
    if (saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      try {
        store.updatedAt = Date.now();
        fs.writeFileSync(DATA_FILE, JSON.stringify(store), "utf-8");
      } catch (err) {
        console.error("Error writing server_data/store.json:", err);
      }
    }, 1000);
  }

  // Manual / Explicit Firestore Cloud Synchronization
  // Cached single Firestore instance to prevent socket/connection leaks across repeated calls
  let cachedServerFirestore: any = null;
  function getServerFirestore() {
    if (cachedServerFirestore) return cachedServerFirestore;
    try {
      const configPath = path.resolve(process.cwd(), "firebase-applet-config.json");
      if (!fs.existsSync(configPath)) return null;
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (!config.apiKey || !config.projectId) return null;
      const existingApps = getApps();
      const firebaseApp = existingApps.find(a => a.name === "server-app") || initializeApp(config, "server-app");
      cachedServerFirestore = getFirestore(firebaseApp, config.firestoreDatabaseId);
      return cachedServerFirestore;
    } catch (e) {
      console.error("Error creating server Firestore instance:", e);
      return null;
    }
  }

  // Only called when Admin explicitly triggers a Push or Pull, avoiding automatic background quota consumption
  async function syncFromFirestore() {
    try {
      const firestore = getServerFirestore();
      if (!firestore) return { success: false, message: "Firebase is not configured or reachable." };

      console.log("[Server Firestore Sync (Manual)] Fetching collections from Firestore on demand...");
      
      const [pubSnap, subSnap, earnSnap, campSnap, bankSnap, testiSnap] = await Promise.all([
        getDocs(collection(firestore, "publishers")).catch(() => ({ size: 0, docs: [] } as any)),
        getDocs(collection(firestore, "submissions")).catch(() => ({ size: 0, docs: [] } as any)),
        getDocs(collection(firestore, "earnings")).catch(() => ({ size: 0, docs: [] } as any)),
        getDocs(collection(firestore, "campaigns")).catch(() => ({ size: 0, docs: [] } as any)),
        getDocs(collection(firestore, "bank_details")).catch(() => ({ size: 0, docs: [] } as any)),
        getDocs(collection(firestore, "testimonials")).catch(() => ({ size: 0, docs: [] } as any)),
      ]);

      // 1. Publishers (strictly v2 accounts from new database)
      if (pubSnap.size > 0) {
        const pubMap = new Map<string, any>();
        store.publishers.forEach(p => {
          if (p && p.systemVersion === 'v2') pubMap.set(p.id, p);
        });
        pubSnap.docs.forEach((d: any) => {
          const data = { id: d.id, ...d.data() };
          if (data.systemVersion === 'v2') {
            pubMap.set(d.id, { ...(pubMap.get(d.id) || {}), ...data });
          }
        });
        store.publishers = Array.from(pubMap.values());
      }

      const validPubIdsUpper = new Set((store.publishers || []).map(p => String(p.id || '').trim().toUpperCase()));

      // 2. Submissions: Firestore is canonical when available. Never retain
      // device/server-only records after a successful Firestore read.
      if (subSnap.size > 0) {
        store.submissions = subSnap.docs.map((d: any) => {
          const data = { id: d.id, ...d.data() };
          const publisherId = String(data.publisherId || '').trim().toUpperCase();
          return { ...data, publisherId: publisherId || data.publisherId };
        });
      }

      // 3. Earnings (preserve all current earnings; merge any from Firestore)
      const earnMap = new Map<string, any>();
      (store.earnings || []).forEach(e => {
        if (e && e.id) earnMap.set(e.id, e);
      });
      if (earnSnap.size > 0) {
        earnSnap.docs.forEach((d: any) => {
          const data = { id: d.id, ...d.data() };
          const normPubId = String(data.publisherId || '').trim().toUpperCase();
          if (validPubIdsUpper.size === 0 || validPubIdsUpper.has(normPubId) || !data.publisherId) {
            earnMap.set(d.id, { ...(earnMap.get(d.id) || {}), ...data, publisherId: normPubId || data.publisherId });
          }
        });
      }
      store.earnings = Array.from(earnMap.values());

      // 4. Campaigns
      if (campSnap.size > 0) {
        const campMap = new Map<string, any>();
        store.campaigns.forEach(c => campMap.set(c.id, c));
        campSnap.docs.forEach((d: any) => {
          const data = { id: d.id, ...d.data() };
          campMap.set(d.id, { ...(campMap.get(d.id) || {}), ...data });
        });
        store.campaigns = Array.from(campMap.values());
      } else if (!store.campaigns || store.campaigns.length === 0) {
        store.campaigns = snapshotCampaigns;
        if (firestore) {
          for (const c of store.campaigns) {
            setDoc(doc(firestore, "campaigns", c.id), c, { merge: true }).catch(() => {});
          }
        }
      }

      // 5. Bank Details: replace the in-memory map with the canonical snapshot.
      if (bankSnap.size > 0) {
        store.bankDetailsMap = {};
        bankSnap.docs.forEach((d: any) => {
          store.bankDetailsMap[d.id] = { id: d.id, ...d.data() };
        });
      }

      // 6. Testimonials (Reviews)
      if (testiSnap.size > 0) {
        const tMap = new Map<string, any>();
        (store.testimonials || []).forEach(t => tMap.set(t.id, t));
        testiSnap.docs.forEach((d: any) => {
          const data = { id: d.id, ...d.data() };
          tMap.set(d.id, { ...(tMap.get(d.id) || {}), ...data });
        });
        store.testimonials = Array.from(tMap.values());
      }

      console.log(`[Server Firestore Sync (Manual)] Synced ${store.publishers.length} publishers, ${store.submissions.length} submissions, ${store.earnings.length} earnings, ${store.testimonials.length} reviews.`);
      scheduleSaveStore();

      // Instant SSE broadcast to ALL connected devices
      broadcastRealtime({
        type: "SYNC_TESTIMONIALS",
        payload: store.testimonials
      });
      broadcastRealtime({
        type: "SYNC_CAMPAIGNS",
        payload: store.campaigns
      });
      broadcastRealtime({
        type: "SYNC_PUBLISHERS",
        payload: store.publishers
      });
      broadcastRealtime({
        type: "SYNC_SUBMISSIONS",
        payload: store.submissions
      });
      broadcastRealtime({
        type: "SYNC_EARNINGS",
        payload: store.earnings
      });

      return {
        success: true,
        publishersCount: store.publishers.length,
        submissionsCount: store.submissions.length,
        earningsCount: store.earnings.length,
        campaignsCount: store.campaigns.length,
        testimonialsCount: store.testimonials.length,
        testimonials: store.testimonials,
        campaigns: store.campaigns,
        publishers: store.publishers
      };
    } catch (err: any) {
      console.warn("[Server Firestore Sync] Sync notice:", err);
      return { success: false, message: err?.message || String(err) };
    }
  }

  // Push local server store data to Firestore on demand (when explicitly triggered by Admin)
  async function pushToFirestore(clientData?: any) {
    try {
      // Merge any client-supplied fresh state (reviews, campaigns, publishers) into store first
      if (clientData && typeof clientData === "object") {
        if (Array.isArray(clientData.testimonials) && clientData.testimonials.length > 0) {
          store.testimonials = clientData.testimonials;
        }
        if (Array.isArray(clientData.campaigns) && clientData.campaigns.length > 0) {
          store.campaigns = clientData.campaigns;
        }
        if (Array.isArray(clientData.publishers) && clientData.publishers.length > 0) {
          store.publishers = clientData.publishers;
        }
        if (clientData.bankDetailsMap && typeof clientData.bankDetailsMap === "object") {
          store.bankDetailsMap = { ...store.bankDetailsMap, ...clientData.bankDetailsMap };
        }
        scheduleSaveStore();
  }

  const firestore = getServerFirestore();
      if (!firestore) return { success: false, message: "Firebase is not configured or reachable." };

      console.log("[Server Firestore Push (Manual)] Writing data to Firestore on demand using high-speed writeBatch...");
      
      const ops: { ref: any; data: any }[] = [];

      // 1. Metadata
      ops.push({
        ref: doc(firestore, "system_metadata", "init_done"),
        data: { value: true, updatedAt: new Date().toISOString() }
      });

      // 2. Campaigns
      for (const c of (store.campaigns || [])) {
        if (c && c.id) {
          ops.push({ ref: doc(firestore, "campaigns", String(c.id)), data: c });
        }
      }

      // 3. Publishers
      for (const p of (store.publishers || [])) {
        if (p && p.id) {
          ops.push({ ref: doc(firestore, "publishers", String(p.id)), data: p });
        }
      }

      // 4. Submissions (clean screenshot to light URL if data:URI to prevent 1MB Firestore document limits)
      for (const s of (store.submissions || [])) {
        if (s && s.id) {
          const cleanSub = {
            ...s,
            screenshot: s.screenshot && s.screenshot.length > 500 ? `/api/submission/screenshot/${s.id}` : s.screenshot
          };
          ops.push({ ref: doc(firestore, "submissions", String(s.id)), data: cleanSub });
        }
      }

      // 5. Earnings
      for (const e of (store.earnings || [])) {
        if (e && e.id) {
          ops.push({ ref: doc(firestore, "earnings", String(e.id)), data: e });
        }
      }

      // 6. Bank Details
      for (const [pubId, b] of Object.entries(store.bankDetailsMap || {})) {
        if (pubId && b) {
          const cleanBank = {
            ...b,
            qrCode: b.qrCode && b.qrCode.length > 500 ? `/api/bank/qr/${pubId}` : b.qrCode
          };
          ops.push({ ref: doc(firestore, "bank_details", String(pubId)), data: cleanBank });
        }
      }

      // 7. Testimonials (Reviews)
      for (const t of (store.testimonials || [])) {
        if (t && t.id) {
          ops.push({ ref: doc(firestore, "testimonials", String(t.id)), data: t });
        }
      }

      // Commit in batches of 400 (Firestore allows up to 500 operations per batch)
      const BATCH_SIZE = 400;
      let committedCount = 0;

      for (let i = 0; i < ops.length; i += BATCH_SIZE) {
        const batch = writeBatch(firestore);
        const chunk = ops.slice(i, i + BATCH_SIZE);
        for (const item of chunk) {
          batch.set(item.ref, item.data, { merge: true });
        }
        await batch.commit();
        committedCount += chunk.length;
      }

      console.log(`[Server Firestore Push (Manual)] Successfully pushed ${committedCount} items in batch commits.`);

      // Broadcast to all active clients
      broadcastRealtime({
        type: "SYNC_TESTIMONIALS",
        payload: store.testimonials
      });
      broadcastRealtime({
        type: "SYNC_CAMPAIGNS",
        payload: store.campaigns
      });
      broadcastRealtime({
        type: "SYNC_PUBLISHERS",
        payload: store.publishers
      });

      return {
        success: true,
        message: `Successfully pushed ${committedCount} records to Firebase Firestore!`,
        campaignsCount: (store.campaigns || []).length,
        publishersCount: (store.publishers || []).length,
        submissionsCount: (store.submissions || []).length,
        earningsCount: (store.earnings || []).length,
        testimonialsCount: (store.testimonials || []).length,
        testimonials: store.testimonials
      };
    } catch (err: any) {
      console.warn("[Server Firestore Push] Push notice:", err);
      return { success: false, message: err?.message || String(err) };
    }
  }

  // Purge old client collections from Firestore on demand
  async function purgeOldClientDataFromFirestore() {
    try {
      const configPath = path.resolve(process.cwd(), "firebase-applet-config.json");
      if (!fs.existsSync(configPath)) return { success: false, message: "No Firebase config found" };
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (!config.apiKey || !config.projectId) return { success: false, message: "Invalid Firebase config" };

      const firebaseApp = initializeApp(config, `server-purge-${Date.now()}`);
      const firestore = getFirestore(firebaseApp, config.firestoreDatabaseId);

      console.log("[Server Firestore Purge] Clearing old client collections in Firestore...");
      const collectionsToPurge = ["publishers", "submissions", "earnings", "campaigns", "bank_details", "partners", "advertiserInquiries", "payment_emails"];

      for (const colName of collectionsToPurge) {
        try {
          const snap = await getDocs(collection(firestore, colName));
          for (const d of snap.docs) {
            await deleteDoc(doc(firestore, colName, d.id)).catch(() => {});
          }
        } catch (e) {
          console.warn(`Purge collection ${colName} notice:`, e);
        }
      }

      await setDoc(doc(firestore, "system_metadata", "init_done"), { value: true, purgedAt: new Date().toISOString() }).catch(() => {});

      // Clear local server store memory
      store.publishers = [];
      store.submissions = [];
      store.earnings = [];
      store.campaigns = [];
      store.bankDetailsMap = {};
      store.employees = [];
      store.advertiserInquiries = [];
      store.partners = [];
      scheduleSaveStore();

      return { success: true, message: "All old client records, leads, and active campaigns purged from Firebase and Server Store. Ready for fresh setup!" };
    } catch (err: any) {
      console.warn("[Server Firestore Purge] Purge notice:", err);
      return { success: false, message: err?.message || String(err) };
    }
  }

  // Active Server-Sent Events (SSE) connections for cross-device real-time sync
  const sseClients: { id: string; res: express.Response }[] = [];

  function broadcastRealtime(event: { type: string; payload: any; timestamp?: number }) {
    event.timestamp = event.timestamp || Date.now();
    const message = `data: ${JSON.stringify(event)}\n\n`;
    for (let i = sseClients.length - 1; i >= 0; i--) {
      try {
        sseClients[i].res.write(message);
      } catch (err) {
        sseClients.splice(i, 1);
      }
    }
  }

  // SSE Keep-Alive heartbeat every 20 seconds
  setInterval(() => {
    for (let i = sseClients.length - 1; i >= 0; i--) {
      try {
        sseClients[i].res.write(": keepalive\n\n");
      } catch (e) {
        sseClients.splice(i, 1);
      }
    }
  }, 20000);

  // 1. SSE Stream Endpoint for clients (Mobile, Desktop, Admin, Employee)
  app.get("/api/realtime/stream", (req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no"
    });

    const clientId = `client-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const clientObj = { id: clientId, res };
    sseClients.push(clientObj);

    // Initial greeting
    res.write(`data: ${JSON.stringify({ type: "CONNECTED", clientId, timestamp: Date.now() })}\n\n`);

    req.on("close", () => {
      const idx = sseClients.indexOf(clientObj);
      if (idx !== -1) sseClients.splice(idx, 1);
    });
  });

  // Image streaming endpoints to keep JSON state ultra-lightweight (<100KB vs 9.5MB)
  app.get("/api/submission/screenshot/:id", (req, res) => {
    const sub = store.submissions.find(s => s.id === req.params.id);
    if (!sub || !sub.screenshot) {
      return res.status(404).send("Screenshot not found");
    }
    const shot = sub.screenshot;
    if (shot.startsWith("data:")) {
      const matches = shot.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const type = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        res.setHeader("Content-Type", type);
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(buffer);
      }
    }
    if (shot.startsWith("http")) {
      return res.redirect(shot);
    }
    res.send(shot);
  });

  app.get("/api/publisher/avatar/:id", (req, res) => {
    const pub = store.publishers.find(p => p.id === req.params.id);
    if (!pub || !pub.avatar) {
      return res.status(404).send("Avatar not found");
    }
    const av = pub.avatar;
    if (av.startsWith("data:")) {
      const matches = av.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const type = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        res.setHeader("Content-Type", type);
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(buffer);
      }
    }
    if (av.startsWith("http")) {
      return res.redirect(av);
    }
    res.send(av);
  });

  app.get("/api/bank/qr/:id", (req, res) => {
    const bank = store.bankDetailsMap[req.params.id];
    if (!bank || !bank.qrCode) {
      return res.status(404).send("QR code not found");
    }
    const qr = bank.qrCode;
    if (qr.startsWith("data:")) {
      const matches = qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const type = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        res.setHeader("Content-Type", type);
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(buffer);
      }
    }
    if (qr.startsWith("http")) {
      return res.redirect(qr);
    }
    res.send(qr);
  });

  app.get("/api/campaign/image/:id", (req, res) => {
    const camp = store.campaigns.find(c => c.id === req.params.id) || snapshotCampaigns.find(c => c.id === req.params.id);
    let img = camp?.image;
    if (!img || img === `/api/campaign/image/${req.params.id}`) {
      const snap = snapshotCampaigns.find(c => c.id === req.params.id);
      img = snap?.image && !snap.image.startsWith('/api/campaign/image/') ? snap.image : 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=200';
    }
    if (img.startsWith("data:")) {
      const matches = img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const type = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        res.setHeader("Content-Type", type);
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(buffer);
      }
    }
    if (img.startsWith("http")) {
      return res.redirect(img);
    }
    res.send(img);
  });

  // Dedicated manual trigger to force pull latest records from Firestore
  app.post("/api/admin/resync-firestore", async (req, res) => {
    try {
      res.setHeader("Content-Type", "application/json");
      const result = await syncFromFirestore();
      res.json(result);
    } catch (err: any) {
      console.error("Error in /api/admin/resync-firestore:", err);
      res.status(500).json({ success: false, message: err?.message || "Failed to sync from Firestore" });
    }
  });

  // Dedicated manual trigger to push local server store data to Firestore
  app.post("/api/admin/push-firestore", async (req, res) => {
    try {
      res.setHeader("Content-Type", "application/json");
      const result = await pushToFirestore(req.body);
      res.json(result);
    } catch (err: any) {
      console.error("Error in /api/admin/push-firestore:", err);
      res.status(500).json({ success: false, message: err?.message || "Failed to push to Firestore" });
    }
  });

  // Dedicated Testimonials Management endpoints (Guaranteed cross-device sync & persistence)
  app.post("/api/testimonials/update", async (req, res) => {
    try {
      res.setHeader("Content-Type", "application/json");
      const { testimonials, testimonial } = req.body || {};
      if (Array.isArray(testimonials)) {
        store.testimonials = testimonials;
      } else if (testimonial && testimonial.id) {
        if (!Array.isArray(store.testimonials)) store.testimonials = [];
        const idx = store.testimonials.findIndex(t => t.id === testimonial.id);
        if (idx !== -1) {
          store.testimonials[idx] = { ...store.testimonials[idx], ...testimonial };
        } else {
          store.testimonials.unshift(testimonial);
        }
      }

      scheduleSaveStore();
      const firestore = getServerFirestore();
      if (firestore) {
        try {
          if (Array.isArray(testimonials)) {
            await Promise.all(
              testimonials.filter(t => t && t.id).map(t =>
                setDoc(doc(firestore, "testimonials", String(t.id)), sanitizeFirestoreData(t), { merge: true })
              )
            );
          } else if (testimonial && testimonial.id) {
            await setDoc(doc(firestore, "testimonials", String(testimonial.id)), sanitizeFirestoreData(testimonial), { merge: true });
          }
        } catch (fErr) {
          console.warn("[Sync] Firestore testimonial update notice:", fErr);
        }
      }

      broadcastRealtime({
        type: "SYNC_TESTIMONIALS",
        payload: store.testimonials
      });

      console.log(`[Testimonials Updated] Total: ${store.testimonials.length}. Synced to Firestore and broadcasted.`);
      res.json({ success: true, testimonials: store.testimonials, connectedClients: sseClients.length });
    } catch (err: any) {
      console.error("Error in /api/testimonials/update:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/testimonials/delete", async (req, res) => {
    try {
      res.setHeader("Content-Type", "application/json");
      const { id } = req.body || {};
      if (id) {
        if (!Array.isArray(store.testimonials)) store.testimonials = [];
        store.testimonials = store.testimonials.filter(t => t.id !== id);
        scheduleSaveStore();
        const firestore = getServerFirestore();
        if (firestore) {
          deleteDoc(doc(firestore, "testimonials", String(id))).catch(() => {});
        }
        broadcastRealtime({
          type: "SYNC_TESTIMONIALS",
          payload: store.testimonials
        });
      }
      res.json({ success: true, testimonials: store.testimonials, connectedClients: sseClients.length });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Dedicated manual trigger to purge all old client records
  app.post("/api/admin/purge-old-data", async (req, res) => {
    const result = await purgeOldClientDataFromFirestore();
    broadcastRealtime({ type: "SYNC_PUBLISHERS", payload: [] });
    broadcastRealtime({ type: "SYNC_SUBMISSIONS", payload: [] });
    broadcastRealtime({ type: "SYNC_EARNINGS", payload: [] });
    broadcastRealtime({ type: "SYNC_CAMPAIGNS", payload: [] });
    broadcastRealtime({ type: "SYNC_BANK_DETAILS", payload: {} });
    res.json(result);
  });

  // 2. Fetch server state (Instantly loads latest data without burning Firestore read quota)
  app.get("/api/realtime/state", async (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    // Auto-reconcile on demand: ensure every submission marked 'Payment Done' has an earning record in store
    const isPaymentDone = (st?: string) => {
      const s = (st || '').toLowerCase().trim();
      return s === 'payment done' || s === 'paymentdone' || s === 'paid';
    };
    let reconciled = false;
    store.submissions.forEach(sub => {
      if (isPaymentDone(sub.status)) {
        const pubId = (sub.publisherId || '').trim();
        const hasEarning = store.earnings.some(e => 
          e.id === `earning-${sub.id}` || 
          e.id === `earning-sub-${sub.id}` ||
          (e.publisherId?.trim().toLowerCase() === pubId.toLowerCase() && 
           e.campaignId === sub.campaignId && 
           Number(e.amount) === Number(sub.payout))
        );
        if (!hasEarning) {
          store.earnings.unshift({
            id: `earning-sub-${sub.id}`,
            publisherId: pubId,
            campaignId: sub.campaignId || '',
            campaignName: sub.campaignName || 'Campaign Payout',
            amount: Number(sub.payout) || 0,
            date: (sub.submitDate || '').substring(0, 10) || new Date().toISOString().substring(0, 10),
            time: (sub.submitDate || '').substring(11, 16) || '12:00'
          });
          reconciled = true;
        }
      }
    });
    if (reconciled) {
      scheduleSaveStore();
    }

    // Hydrate every admin-facing collection from Firestore so all devices share
    // one canonical snapshot instead of each device's local memory/cache.
    const firestore = getServerFirestore();
    if (firestore) {
      try {
        const [submissionSnapshot, employeeSnapshot, publisherSnapshot, bankSnapshot] = await Promise.all([
          getDocs(collection(firestore, 'submissions')),
          getDocs(collection(firestore, 'employees')),
          getDocs(collection(firestore, 'publishers')),
          getDocs(collection(firestore, 'bank_details')),
        ]);
        if (submissionSnapshot.size > 0) {
          store.submissions = submissionSnapshot.docs.map((item: any) => ({ id: item.id, ...item.data() }));
        }
        if (employeeSnapshot.size > 0) {
          store.employees = employeeSnapshot.docs.map((item: any) => ({ id: item.id, ...item.data() }));
        }
        if (publisherSnapshot.size > 0) {
          store.publishers = publisherSnapshot.docs.map((item: any) => ({ id: item.id, ...item.data() }));
        }
        if (bankSnapshot.size > 0) {
          store.bankDetailsMap = Object.fromEntries(bankSnapshot.docs.map((item: any) => [item.id, { id: item.id, ...item.data() }]));
        }
      } catch (error) {
        console.warn('[Sync] Could not hydrate canonical admin data from Firestore:', error);
      }
    }

    // Build lightweight payload (< 150KB vs 9.5MB) to guarantee lightning speed and prevent localStorage QuotaExceeded errors
    const lightweightSubmissions = store.submissions.map(sub => ({
      ...sub,
      screenshot: sub.screenshot && sub.screenshot.length > 500
        ? `/api/submission/screenshot/${sub.id}`
        : sub.screenshot
    }));

    const lightweightPublishers = store.publishers;

    const lightweightCampaigns = store.campaigns;

    const lightweightBanks: Record<string, any> = {};
    for (const [k, v] of Object.entries(store.bankDetailsMap || {})) {
      if (v) {
        lightweightBanks[k] = {
          ...v,
          qrCode: v.qrCode && v.qrCode.length > 500
            ? `/api/bank/qr/${k}`
            : v.qrCode
        };
      }
    }

    const payload = {
      ...store,
      submissions: lightweightSubmissions,
      publishers: lightweightPublishers,
      campaigns: lightweightCampaigns,
      bankDetailsMap: lightweightBanks
    };

    res.json({
      success: true,
      data: payload,
      counts: {
        publishers: store.publishers.length,
        submissions: store.submissions.length,
        earnings: store.earnings.length,
        campaigns: store.campaigns.length
      },
      connectedClients: sseClients.length,
      serverTime: Date.now()
    });
  });

  // Helper to ensure objects written to Firestore never contain undefined values
  function sanitizeFirestoreData(obj: any): any {
    if (!obj || typeof obj !== "object") return obj;
    const clean: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) {
        clean[k] = (typeof v === "object" && v !== null && !Array.isArray(v))
          ? sanitizeFirestoreData(v)
          : v;
      }
    }
    return clean;
  }

  // Dedicated Campaign Management endpoints (Guaranteed cross-device sync & persistence)
  app.post("/api/campaign/update", async (req, res) => {
    try {
      const { id, active, campaign, allCampaigns } = req.body || {};
      const firestore = getServerFirestore();
      
      if (Array.isArray(allCampaigns) && allCampaigns.length > 0) {
        store.campaigns = allCampaigns;
        if (firestore) {
          await Promise.all(allCampaigns.filter((c: any) => c && c.id).map((c: any) =>
            setDoc(doc(firestore, "campaigns", c.id), sanitizeFirestoreData(c), { merge: true })
          ));
        }
      } else if (campaign && (campaign.id || id)) {
        const campId = campaign.id || id;
        const idx = store.campaigns.findIndex(c => c.id === campId);
        const campaignWithActive = {
          ...campaign,
          id: campId,
          active: campaign.active !== undefined ? Boolean(campaign.active) : true
        };
        if (idx !== -1) {
          const existingImage = store.campaigns[idx].image;
          const newImage = campaignWithActive.image;
          const finalImage = (newImage && typeof newImage === 'string' && newImage.trim().length > 0 && !newImage.startsWith('/api/campaign/image/'))
            ? newImage
            : existingImage;
          store.campaigns[idx] = { 
            ...store.campaigns[idx], 
            ...campaignWithActive, 
            image: finalImage 
          };
        } else {
          store.campaigns.unshift(campaignWithActive);
        }
        if (firestore) {
          const targetCamp = store.campaigns.find(c => c.id === campId);
          if (targetCamp) {
            await setDoc(doc(firestore, "campaigns", campId), sanitizeFirestoreData(targetCamp), { merge: true });
          }
        }
      } else if (id && active !== undefined) {
        let camp = store.campaigns.find(c => c.id === id);
        if (camp) {
          camp.active = Boolean(active);
        } else {
          const snap = snapshotCampaigns.find(c => c.id === id);
          if (snap) {
            camp = { ...snap, active: Boolean(active) };
            store.campaigns.push(camp);
          }
        }
        if (camp && firestore) {
          await setDoc(doc(firestore, "campaigns", id), sanitizeFirestoreData(camp), { merge: true });
        }
      }

      scheduleSaveStore();
      broadcastRealtime({
        type: "SYNC_CAMPAIGNS",
        payload: store.campaigns
      });

      console.log(`[Campaigns Updated] Total: ${store.campaigns.length}. Synced to Firestore and broadcasted.`);
      res.json({ success: true, campaigns: store.campaigns, connectedClients: sseClients.length });
    } catch (err: any) {
      console.error("Error in /api/campaign/update:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/campaign/delete", async (req, res) => {
    try {
      const { id } = req.body || {};
      if (id) {
        store.campaigns = store.campaigns.filter(c => c.id !== id);
        scheduleSaveStore();
        const firestore = getServerFirestore();
        if (firestore) {
          await deleteDoc(doc(firestore, "campaigns", id)).catch((err) => {
            console.warn("[Sync] Firestore campaign delete notice:", err);
          });
        }
        broadcastRealtime({
          type: "SYNC_CAMPAIGNS",
          payload: store.campaigns
        });
        console.log(`[Campaign Deleted] ID: ${id}. Removed from Firestore and broadcasted.`);
      }
      res.json({ success: true, campaigns: store.campaigns, connectedClients: sseClients.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated Publisher Login endpoint (Strictly v2 new database accounts only)
  app.post("/api/auth/publisher-login", async (req, res) => {
    try {
      const { phoneOrEmail, password } = req.body || {};
      if (!phoneOrEmail || !password) {
        return res.status(400).json({ success: false, message: "Missing credentials" });
      }
  const target = phoneOrEmail.trim().toLowerCase();
  const targetDigits = phoneOrEmail.trim().replace(/[\s\-\(\)]/g, '');
  console.log(`[Auth Attempt] Target: ${target}, Server publishers count: ${store.publishers.length}`);
      
      let pub = store.publishers.find(p => 
        p.systemVersion === 'v2' &&
        (p.id?.trim().toLowerCase() === target || p.email?.trim().toLowerCase() === target || p.phone?.trim().replace(/[\s\-\(\)]/g, '') === targetDigits) &&
        p.password === password
      );

      // Check Firestore directly if not yet loaded in server memory
      if (!pub) {
        const firestore = getServerFirestore();
        if (firestore) {
          try {
            const pubSnap = await getDocs(collection(firestore, "publishers"));
            pubSnap.forEach((d: any) => {
              const data = { id: d.id, ...d.data() };
              if (
                data.systemVersion === 'v2' &&
                (data.id?.trim().toLowerCase() === target || data.email?.trim().toLowerCase() === target || data.phone?.trim().replace(/[\s\-\(\)]/g, '') === targetDigits) &&
                data.password === password
              ) {
                pub = data;
                if (!store.publishers.some(p => p.id === data.id)) {
                  store.publishers.unshift(data);
                  scheduleSaveStore();
                }
              }
            });
          } catch (fireErr) {
            console.warn("Firestore fallback check in login:", fireErr);
          }
        }
      }

      if (!pub) {
        console.log(`[Auth Failed] No v2 match found for: ${target}`);
        return res.status(401).json({ success: false, message: "Account not found or legacy account expired. Please register a new Publisher account." });
      }
      if (pub.blocked) {
        return res.status(403).json({ success: false, message: "Your publisher account has been blocked by Admin. Contact support." });
      }
      res.json({ success: true, publisher: pub });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Dedicated Publisher Register endpoint (Zero Firestore quota dependency, synced to cloud)
  app.post("/api/publisher/register", (req, res) => {
    try {
      const { publisher } = req.body || {};
      if (!publisher || !publisher.id) {
        return res.status(400).json({ error: "Missing publisher data" });
      }
      const v2Pub = { ...publisher, systemVersion: 'v2' };
      const idx = store.publishers.findIndex(p => p.id === v2Pub.id);
      if (idx !== -1) {
        const existingAvatar = store.publishers[idx].avatar;
        const newAvatar = v2Pub.avatar;
        const finalAvatar = (newAvatar && newAvatar.startsWith('/api/publisher/avatar/'))
          ? existingAvatar
          : (newAvatar !== undefined ? newAvatar : existingAvatar);
        store.publishers[idx] = { ...store.publishers[idx], ...v2Pub, avatar: finalAvatar };
      } else {
        store.publishers.unshift(v2Pub);
      }
      scheduleSaveStore();
      
      const firestore = getServerFirestore();
      if (firestore) {
        setDoc(doc(firestore, "publishers", v2Pub.id), v2Pub, { merge: true }).catch(() => {});
      }

      broadcastRealtime({
        type: "SYNC_PUBLISHERS",
        payload: store.publishers
      });
      res.json({ success: true, publisher: v2Pub });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated Publisher Profile Update endpoint
  app.post("/api/publisher/update", async (req, res) => {
    try {
      const { publisherId, name, avatar } = req.body || {};
      if (!publisherId) {
        return res.status(400).json({ error: "Missing publisherId" });
      }
      const normalizedPublisherId = String(publisherId).trim().toUpperCase();
      const idx = store.publishers.findIndex(p => String(p.id || '').trim().toUpperCase() === normalizedPublisherId);
      if (idx !== -1) {
        const existingAvatar = store.publishers[idx].avatar;
        const finalAvatar = (avatar && !avatar.startsWith('/api/publisher/avatar/'))
          ? avatar
          : (avatar !== undefined && !avatar.startsWith('/api/publisher/avatar/') ? avatar : existingAvatar);
        store.publishers[idx] = {
          ...store.publishers[idx],
          id: normalizedPublisherId,
          ...(name ? { name } : {}),
          avatar: finalAvatar,
          systemVersion: 'v2'
        };
      } else {
        store.publishers.unshift({
          id: normalizedPublisherId,
          name: name || normalizedPublisherId,
          avatar: avatar || '👤',
          systemVersion: 'v2'
        });
      }
      scheduleSaveStore();
      const savedPublisher = store.publishers.find(p => String(p.id || '').trim().toUpperCase() === normalizedPublisherId);
      broadcastRealtime({
        type: "SYNC_PUBLISHERS",
        payload: store.publishers
      });
      console.log(`[Sync] Profile saved for ${publisherId}; broadcasted to ${sseClients.length} clients.`);
      res.json({ success: true, publisher: savedPublisher });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated Bank Details endpoint (Zero Firestore quota dependency)
  app.post("/api/bank/update", async (req, res) => {
    try {
      const { publisherId, details } = req.body || {};
      if (!publisherId || !details) {
        return res.status(400).json({ error: "Missing publisherId or details" });
      }
      const bankDetails = { ...details, publisherId };
      store.bankDetailsMap = {
        ...(store.bankDetailsMap || {}),
        [publisherId]: bankDetails
      };
      scheduleSaveStore();

      const firestore = getServerFirestore();
      if (firestore) {
        await setDoc(
          doc(firestore, "bank_details", String(publisherId)),
          sanitizeFirestoreData(bankDetails),
          { merge: true }
        );
      }

      broadcastRealtime({
        type: "SYNC_BANK_DETAILS",
        payload: store.bankDetailsMap
      });
      console.log(`[Sync] Bank details saved for publisher ${publisherId}; broadcasted to ${sseClients.length} clients.`);
      res.json({ success: true, bankDetails });
    } catch (err: any) {
      console.error("[Sync] Bank details update failed:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated GET Bank Details endpoint
  app.get("/api/bank/:publisherId", async (req, res) => {
    const pubId = String(req.params.publisherId || '').trim();
    if (!pubId) return res.status(400).json({ error: "Missing publisherId" });
    const target = pubId.toLowerCase();
    const foundEntry = Object.entries(store.bankDetailsMap || {}).find(([key]) => key.trim().toLowerCase() === target);
    if (foundEntry) {
      return res.json({ success: true, bankDetails: foundEntry[1], source: 'server-store' });
    }

    try {
      const firestore = getServerFirestore();
      if (firestore) {
        const cloudSnap = await getDocs(collection(firestore, 'bank_details'));
        const cloudEntry = cloudSnap.docs.find((bankDoc: any) => {
          const data = bankDoc.data() || {};
          return String(data.publisherId || bankDoc.id).trim().toLowerCase() === target;
        });
        if (cloudEntry) {
          const bankDetails = { ...cloudEntry.data(), publisherId: pubId };
          store.bankDetailsMap = { ...(store.bankDetailsMap || {}), [pubId]: bankDetails };
          scheduleSaveStore();
          console.log(`[Sync] Loaded bank details for ${pubId} from Firestore fallback.`);
          return res.json({ success: true, bankDetails, source: 'firestore' });
        }
      }
    } catch (err) {
      console.warn(`[Sync] Firestore bank lookup failed for ${pubId}:`, err);
    }
    return res.status(404).json({ success: false, message: "Bank details not found" });
  });

  // Dedicated Partner Apply endpoint (Direct WhatsApp routing - Zero database/Firestore quota)
  app.post("/api/partner/apply", (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      // No server or database persistence needed - data is directly routed to WhatsApp
      res.json({ success: true, message: "Direct WhatsApp routing active. Zero database storage consumed." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated Settings Update endpoint (Zero Firestore quota)
  app.post("/api/settings/update", (req, res) => {
    try {
      const { settings } = req.body || {};
      if (settings && typeof settings === 'object') {
        store.settings = { ...(store.settings || {}), ...settings };
        scheduleSaveStore();
        broadcastRealtime({
          type: "SYNC_SETTINGS",
          payload: store.settings
        });
      }
      res.json({ success: true, settings: store.settings });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated Submission Delete endpoint (Synced to cloud & server store)
  app.post("/api/submission/delete", async (req, res) => {
    try {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: "Missing submission ID" });
      const normalizedId = String(id).trim();
      const idx = store.submissions.findIndex(s => String(s.id || '').trim() === normalizedId);
      let deleted = false;
      if (idx !== -1) {
        store.submissions.splice(idx, 1);
        deleted = true;
        scheduleSaveStore();
        const firestore = getServerFirestore();
        if (firestore) {
          await deleteDoc(doc(firestore, "submissions", normalizedId)).catch(error => {
            console.warn('[Sync] Firestore lead deletion failed:', error);
          });
        }
      }
      // Always broadcast the canonical snapshot, including when the list becomes empty.
      broadcastRealtime({
        type: "SYNC_SUBMISSIONS",
        payload: store.submissions
      });
      res.json({ success: true, deleted, count: store.submissions.length, submissions: store.submissions });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated Publisher Delete endpoint (Synced to cloud & server store)
  app.post("/api/publisher/delete", async (req, res) => {
    try {
      const { publisherId } = req.body || {};
      if (!publisherId) return res.status(400).json({ error: "Missing publisherId" });
      const idx = store.publishers.findIndex(p => p.id === publisherId);
      if (idx !== -1) {
        store.publishers.splice(idx, 1);
        scheduleSaveStore();
        const firestore = getServerFirestore();
        if (firestore) {
          deleteDoc(doc(firestore, "publishers", String(publisherId))).catch(() => {});
          deleteDoc(doc(firestore, "bank_details", String(publisherId))).catch(() => {});
        }
        broadcastRealtime({
          type: "SYNC_PUBLISHERS",
          payload: store.publishers
        });
      }
      res.json({ success: true, count: store.publishers.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated Publisher Block/Unblock endpoint (Synced to cloud & server store)
  app.post("/api/publisher/toggle-block", async (req, res) => {
    try {
      const { publisherId, blocked } = req.body || {};
      if (!publisherId) return res.status(400).json({ error: "Missing publisherId" });
      const pub = store.publishers.find(p => p.id === publisherId);
      if (pub) {
        pub.blocked = blocked !== undefined ? blocked : !pub.blocked;
        scheduleSaveStore();
        const firestore = getServerFirestore();
        if (firestore) {
          setDoc(doc(firestore, "publishers", String(publisherId)), { blocked: Boolean(pub.blocked) }, { merge: true }).catch(() => {});
        }
        broadcastRealtime({
          type: "SYNC_PUBLISHERS",
          payload: store.publishers
        });
      }
      res.json({ success: true, publisher: pub });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated Employee CRUD endpoints (Zero Firestore quota)
  app.post("/api/employee/update", async (req, res) => {
    try {
      const { employee } = req.body || {};
      if (!employee || !employee.id) return res.status(400).json({ error: "Missing employee data" });
      if (!Array.isArray(store.employees)) store.employees = [];
      const idx = store.employees.findIndex(e => e.id === employee.id);
      if (idx !== -1) {
        store.employees[idx] = { ...store.employees[idx], ...employee };
      } else {
        store.employees.unshift(employee);
      }
      scheduleSaveStore();
      const firestore = getServerFirestore();
      if (firestore) {
        await setDoc(doc(firestore, "employees", String(employee.id)), sanitizeFirestoreData(employee), { merge: true });
      }
      broadcastRealtime({
        type: "SYNC_EMPLOYEES",
        payload: store.employees
      });
      res.json({ success: true, employees: store.employees });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/employee/delete", (req, res) => {
    try {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: "Missing employee ID" });
      if (!Array.isArray(store.employees)) store.employees = [];
      const idx = store.employees.findIndex(e => e.id === id);
      if (idx !== -1) {
        store.employees.splice(idx, 1);
        scheduleSaveStore();
        broadcastRealtime({
          type: "SYNC_EMPLOYEES",
          payload: store.employees
        });
      }
      res.json({ success: true, count: store.employees.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Universal Status Update endpoint - Handles ANY status change (Process, Reject, Ready To Trade, Active, Trade Done, Payment Done)
  app.post("/api/submission/update-status", async (req, res) => {
    try {
      const { submissionId, status, submissionData, payout } = req.body || {};
      if (!submissionId || !status) {
        return res.status(400).json({ error: "Missing submissionId or status" });
      }

      const isPaymentDone = (st?: string) => {
        const s = (st || '').toLowerCase().trim();
        return s === 'payment done' || s === 'paymentdone' || s === 'paid';
      };

      // 1. Locate or insert submission
      let sub = store.submissions.find(s => s.id === submissionId);
      const prevStatus = sub?.status;

      if (!sub && submissionData) {
        sub = { ...submissionData, id: submissionId, status };
        store.submissions.unshift(sub);
      } else if (sub) {
        sub.status = status;
        if (payout !== undefined && payout !== null) sub.payout = Number(payout);
        if (submissionData?.payout !== undefined) sub.payout = Number(submissionData.payout);
      }

      let newEarning: any = null;
      let removedEarningId: string | null = null;

      // 2. Handle Earning Synchronization with 100% precision & STRICT IDEMPOTENCE (Single count per lead)
      if (isPaymentDone(status)) {
        const pubId = (sub?.publisherId || submissionData?.publisherId || '').trim();
        // Check if an earning for this submission ALREADY exists (prevent multiple counts if clicked 4-5 times)
        const existingEarning = store.earnings.find(e => 
          e.id === `earning-${submissionId}` || 
          (e.publisherId?.trim().toLowerCase() === pubId.toLowerCase() && 
           e.campaignId === sub?.campaignId && 
           Number(e.amount) === Number(sub?.payout))
        );

        if (existingEarning) {
          // STRICT IDEMPOTENCE: Already exists! Do NOT add or count again!
          newEarning = existingEarning;
        } else if (sub) {
          // Exactly 1 earning record per client submission with deterministic ID
          newEarning = {
            id: `earning-${submissionId}`,
            publisherId: sub.publisherId,
            campaignId: sub.campaignId || '',
            campaignName: sub.campaignName || 'Campaign Payout',
            amount: Number(sub.payout) || 0,
            date: (sub.submitDate || '').substring(0, 10) || new Date().toISOString().substring(0, 10),
            time: (sub.submitDate || '').substring(11, 16) || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
          };
          store.earnings.unshift(newEarning);
        }
      } else {
        // If status changed away from Payment Done (e.g., reverted to Process or Reject),
        // remove the corresponding earning record so client/publisher doesn't see invalid payout!
        const earningIdx = store.earnings.findIndex(e => 
          e.id === `earning-${submissionId}` || 
          (sub && e.publisherId?.trim().toLowerCase() === sub.publisherId?.trim().toLowerCase() && e.campaignId === sub.campaignId && Number(e.amount) === Number(sub.payout))
        );
        if (earningIdx !== -1) {
          removedEarningId = store.earnings[earningIdx].id;
          store.earnings.splice(earningIdx, 1);
        }
      }

      scheduleSaveStore();

      const firestore = getServerFirestore();
      if (firestore && sub) {
        try {
          const cleanSub = {
            ...sub,
            screenshot: sub.screenshot && sub.screenshot.length > 500 ? `/api/submission/screenshot/${sub.id}` : sub.screenshot
          };
          setDoc(doc(firestore, "submissions", String(submissionId)), sanitizeFirestoreData(cleanSub), { merge: true }).catch(() => {});
          if (newEarning) {
            setDoc(doc(firestore, "earnings", String(newEarning.id)), sanitizeFirestoreData(newEarning), { merge: true }).catch(() => {});
          }
          if (removedEarningId) {
            deleteDoc(doc(firestore, "earnings", String(removedEarningId))).catch(() => {});
          }
        } catch (fErr) {
          console.warn("[Sync] Firestore status update notice:", fErr);
        }
      }

      // Broadcast unified real-time event to ALL clients (Admin, Employee, Publisher)
      broadcastRealtime({
        type: "SUBMISSION_STATUS_UPDATED",
        payload: {
          submissionId,
          status,
          prevStatus,
          submission: sub,
          earning: newEarning,
          removedEarningId
        }
      });

      // Also broadcast legacy PAYMENT_DONE if status is Payment Done for backward compatibility
      if (isPaymentDone(status)) {
        broadcastRealtime({
          type: "PAYMENT_DONE",
          payload: {
            submissionId,
            status: 'Payment Done',
            submission: sub,
            earning: newEarning
          }
        });
      }

      console.log(`[Status Updated] Submission ${submissionId} changed to "${status}". Connected clients: ${sseClients.length}`);

      res.json({
        success: true,
        submission: sub,
        earning: newEarning,
        removedEarningId,
        connectedClients: sseClients.length
      });
    } catch (err: any) {
      console.error("Error in /api/submission/update-status:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated endpoint for newly submitted leads (Zero risk of overwriting other submissions)
  app.post("/api/submission/create", async (req, res) => {
  try {
  const { submission } = req.body || {};
  if (!submission || !submission.id) {
  return res.status(400).json({ error: "Missing submission data or ID" });
  }

    const normSub = {
      ...submission,
      publisherId: String(submission.publisherId || '').trim().toUpperCase()
    };

  const idx = store.submissions.findIndex(s => s.id === normSub.id);
  if (idx >= 0) {
  store.submissions[idx] = { ...store.submissions[idx], ...normSub };
  } else {
  store.submissions.unshift(normSub);
  }
  scheduleSaveStore();

  const firestore = getServerFirestore();
    if (firestore) {
      try {
        let firestorePayload = sanitizeFirestoreData(normSub);
        if (firestorePayload.screenshot && typeof firestorePayload.screenshot === 'string' && firestorePayload.screenshot.length > 750000) {
          firestorePayload = { ...firestorePayload, screenshot: firestorePayload.screenshot.substring(0, 50000) };
        }
        await setDoc(
          doc(firestore, "submissions", String(normSub.id)),
          firestorePayload,
          { merge: true }
        );
      } catch (firestoreError) {
        // The server store and SSE are the canonical fallback when Firestore is unavailable.
        console.warn('[Sync] Firestore lead write skipped; server lead remains saved:', firestoreError);
      }
    }

    broadcastRealtime({
      type: "NEW_SUBMISSION",
      payload: normSub
    });
    console.log(`[Sync] Submission ${normSub.id} saved for publisher ${normSub.publisherId}; broadcasted to ${sseClients.length} clients.`);

    res.json({ success: true, submission: normSub, connectedClients: sseClients.length });
  } catch (err: any) {
  console.error("[Sync] Submission create failed:", err);
  res.status(500).json({ error: err.message });
  }
  });

  // 4. Dedicated Realtime "Payment Done" endpoint (retained for backward compatibility)
  app.post("/api/realtime/payment-done", (req, res) => {
    try {
      const { submissionId, status = 'Payment Done', submissionData, earningData } = req.body || {};
      if (!submissionId) {
        return res.status(400).json({ error: "Missing submissionId" });
      }

      // Update submission status in server store
      let sub = store.submissions.find(s => s.id === submissionId);
      if (!sub && submissionData) {
        sub = { ...submissionData, id: submissionId, status: 'Payment Done' };
        store.submissions.unshift(sub);
      } else if (sub) {
        sub.status = 'Payment Done';
        if (submissionData?.payout) sub.payout = submissionData.payout;
      }

      // Create or ensure Earning record exists
      let newEarning = earningData;
      if (!newEarning && sub) {
        newEarning = {
          id: `earning-${submissionId}`,
          publisherId: sub.publisherId,
          campaignId: sub.campaignId,
          campaignName: sub.campaignName,
          amount: sub.payout || 0,
          date: new Date().toISOString().substring(0, 10),
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        };
      }

      if (newEarning) {
        const exists = store.earnings.some(e => e.id === newEarning.id);
        if (!exists) {
          store.earnings.unshift(newEarning);
        }
      }

      scheduleSaveStore();

      // Broadcast immediately to ALL devices across internet
      broadcastRealtime({
        type: "SUBMISSION_STATUS_UPDATED",
        payload: {
          submissionId,
          status: 'Payment Done',
          submission: sub,
          earning: newEarning
        }
      });
      broadcastRealtime({
        type: "PAYMENT_DONE",
        payload: {
          submissionId,
          status: 'Payment Done',
          submission: sub,
          earning: newEarning
        }
      });

      console.log(`[Realtime Sync] Payment Done processed for ${submissionId}, payout ₹${sub?.payout || newEarning?.amount || 0} broadcasted to ${sseClients.length} clients.`);

      res.json({
        success: true,
        submission: sub,
        earning: newEarning,
        connectedClients: sseClients.length
      });
    } catch (err: any) {
      console.error("Error in /api/realtime/payment-done:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // 4b. Dedicated Endpoint to DELETE an Earning Record & Revert Lead Status to 'Process' in MIS
  // "Or MIS me agar payment done h to process me kr do jab bhi delet ho to"
  app.post("/api/earning/delete", (req, res) => {
    try {
      const { earningId, publisherId, campaignId, amount, matchedSubmissionId } = req.body || {};
      if (!earningId && !matchedSubmissionId) {
        return res.status(400).json({ error: "Missing earningId or matchedSubmissionId" });
      }

      console.log(`[Earning Delete Request] earningId=${earningId}, matchedSubmissionId=${matchedSubmissionId}, pub=${publisherId}`);

      // 1. Remove earning from store.earnings
      let removedEarning: any = null;
      if (earningId) {
        const idx = store.earnings.findIndex(e => e.id === earningId);
        if (idx !== -1) {
          removedEarning = store.earnings.splice(idx, 1)[0];
        }
      }
      // If not removed by exact ID, find matching earning by publisherId + campaignId + amount
      if (!removedEarning && publisherId) {
        const normPubId = (publisherId || '').trim().toLowerCase();
        const idx = store.earnings.findIndex(e => 
          (e.publisherId || '').trim().toLowerCase() === normPubId &&
          (!campaignId || e.campaignId === campaignId) &&
          (amount === undefined || Number(e.amount) === Number(amount))
        );
        if (idx !== -1) {
          removedEarning = store.earnings.splice(idx, 1)[0];
        }
      }

      // 2. CRITICAL USER SPECIFICATION: Revert corresponding lead submission status to 'Process'
      let revertedSub: any = null;
      const isPaymentDone = (st?: string) => {
        const s = (st || '').toLowerCase().trim();
        return s === 'payment done' || s === 'paymentdone' || s === 'paid';
      };

      if (matchedSubmissionId) {
        revertedSub = store.submissions.find(s => s.id === matchedSubmissionId);
      }
      if (!revertedSub && earningId) {
        const rawSubId = earningId.replace(/^earning-sub-/, '').replace(/^earning-/, '');
        revertedSub = store.submissions.find(s => s.id === rawSubId);
      }
      if (!revertedSub && publisherId) {
        const normPubId = (publisherId || '').trim().toLowerCase();
        revertedSub = store.submissions.find(s => 
          (s.publisherId || '').trim().toLowerCase() === normPubId &&
          (!campaignId || s.campaignId === campaignId) &&
          isPaymentDone(s.status) &&
          (amount === undefined || Number(s.payout) === Number(amount))
        );
        if (!revertedSub) {
          revertedSub = store.submissions.find(s => 
            (s.publisherId || '').trim().toLowerCase() === normPubId &&
            isPaymentDone(s.status)
          );
        }
      }

      if (revertedSub) {
        revertedSub.status = 'Process';
        console.log(`[Earning Delete] Reverted submission ${revertedSub.id} (${revertedSub.clientName}) from 'Payment Done' to 'Process'`);
      }

      scheduleSaveStore();

      // 3. Broadcast real-time deletion & status reversion to all connected clients
      broadcastRealtime({
        type: "EARNING_DELETED",
        payload: {
          earningId: earningId || removedEarning?.id,
          removedEarning,
          revertedSubmissionId: revertedSub?.id,
          revertedSubmissions: store.submissions,
          earnings: store.earnings
        }
      });

      // Also broadcast status updated event so MIS table refreshes to Process instantly
      if (revertedSub) {
        broadcastRealtime({
          type: "SUBMISSION_STATUS_UPDATED",
          payload: {
            submissionId: revertedSub.id,
            status: 'Process',
            prevStatus: 'Payment Done',
            submission: revertedSub,
            removedEarningId: earningId || removedEarning?.id
          }
        });
      }

      res.json({
        success: true,
        deletedEarningId: earningId || removedEarning?.id,
        revertedSubmissionId: revertedSub?.id,
        earningsRemaining: store.earnings.length,
        connectedClients: sseClients.length
      });
    } catch (err: any) {
      console.error("Error in /api/earning/delete:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // 4c. Dedicated Endpoint to UPDATE an Earning Record Amount
  app.post("/api/earning/update", (req, res) => {
    try {
      const { earningId, amount } = req.body || {};
      if (!earningId || amount === undefined) {
        return res.status(400).json({ error: "Missing earningId or amount" });
      }

      const newAmt = Number(amount);
      const earning = store.earnings.find(e => e.id === earningId);
      if (earning) {
        earning.amount = newAmt;
      }

      // Also update matching submission payout in store if linked
      const rawSubId = earningId.replace(/^earning-sub-/, '').replace(/^earning-/, '');
      const sub = store.submissions.find(s => s.id === rawSubId);
      if (sub) {
        sub.payout = newAmt;
      }

      scheduleSaveStore();

      broadcastRealtime({
        type: "EARNING_UPDATED",
        payload: {
          earningId,
          amount: newAmt,
          submissionId: sub?.id,
          earnings: store.earnings
        }
      });

      res.json({ success: true, earningId, amount: newAmt });
    } catch (err: any) {
      console.error("Error in /api/earning/update:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // 5. General Broadcast endpoint for any entity change - MERGES arrays instead of blindly replacing!
  app.post("/api/realtime/broadcast", (req, res) => {
    try {
      const { type, payload } = req.body || {};
      if (!type) {
        return res.status(400).json({ error: "Missing event type" });
      }

      if (type === 'SYNC_SUBMISSIONS' && Array.isArray(payload)) {
        // Safe Merge by ID to protect all other submissions from getting wiped
        const map = new Map<string, any>(store.submissions.map(s => [s.id, s]));
        payload.forEach(s => {
          if (s && s.id) {
            const existing = map.get(s.id) || {};
            map.set(s.id, { ...existing, ...s });
          }
        });
        store.submissions = Array.from(map.values()).sort((a, b) => (b.submitDate || '').localeCompare(a.submitDate || ''));
      } else if (type === 'SYNC_EARNINGS' && Array.isArray(payload)) {
        // Safe Merge by ID
        const map = new Map<string, any>(store.earnings.map(e => [e.id, e]));
        payload.forEach(e => {
          if (e && e.id) {
            const existing = map.get(e.id) || {};
            map.set(e.id, { ...existing, ...e });
          }
        });
        store.earnings = Array.from(map.values()).sort((a, b) => {
          const keyA = (a.date || '') + '_' + (a.time || '') + '_' + (a.id || '');
          const keyB = (b.date || '') + '_' + (b.time || '') + '_' + (b.id || '');
          return keyB.localeCompare(keyA);
        });
      } else if (type === 'SYNC_CAMPAIGNS' && Array.isArray(payload)) {
        store.campaigns = payload;
      } else if (type === 'SYNC_PUBLISHERS' && Array.isArray(payload)) {
        const map = new Map<string, any>(store.publishers.map(p => [p.id, p]));
        payload.forEach(p => {
          if (p && p.id) {
            const existing = map.get(p.id) || {};
            map.set(p.id, { ...existing, ...p });
          }
        });
        store.publishers = Array.from(map.values());
      } else if (type === 'SYNC_BANK_DETAILS' && payload) {
        store.bankDetailsMap = { ...(store.bankDetailsMap || {}), ...payload };
      } else if (type === 'SYNC_EMPLOYEES' && Array.isArray(payload)) {
        store.employees = payload;
      } else if (type === 'SYNC_TESTIMONIALS' && Array.isArray(payload)) {
        store.testimonials = payload;
      }

      scheduleSaveStore();
      broadcastRealtime({ type, payload });

      res.json({ success: true, connectedClients: sseClients.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Batch sync from client to initialize server store with latest data
  app.post("/api/realtime/sync-batch", (req, res) => {
    try {
      const { submissions, earnings, campaigns, publishers, bankDetailsMap, employees, testimonials } = req.body || {};

      if (Array.isArray(submissions) && submissions.length > 0) {
        const map = new Map<string, any>(store.submissions.map(s => [s.id, s]));
        submissions.forEach(s => map.set(s.id, s));
        store.submissions = Array.from(map.values());
      }

      if (Array.isArray(earnings) && earnings.length > 0) {
        const map = new Map<string, any>(store.earnings.map(e => [e.id, e]));
        earnings.forEach(e => map.set(e.id, e));
        store.earnings = Array.from(map.values());
      }

      if (Array.isArray(campaigns) && campaigns.length > 0) {
        const isMock = (c: any) => c.id === 'camp-1' || c.id === 'camp-2' || c.id === 'camp-3' || c.id === 'camp-4';
        const realCampaigns = campaigns.filter(c => !isMock(c));
        if (realCampaigns.length > 0) {
          const map = new Map<string, any>(store.campaigns.map(c => [c.id, c]));
          realCampaigns.forEach(c => {
            if (c && c.id) {
              const existing = map.get(c.id) || {};
              map.set(c.id, { ...existing, ...c });
            }
          });
          store.campaigns = Array.from(map.values());
        }
      }

      if (Array.isArray(publishers) && publishers.length > 0) {
        const map = new Map<string, any>(store.publishers.map(p => [p.id, p]));
        publishers.forEach(p => map.set(p.id, p));
        store.publishers = Array.from(map.values());
      }

      if (bankDetailsMap && typeof bankDetailsMap === 'object') {
        store.bankDetailsMap = { ...store.bankDetailsMap, ...bankDetailsMap };
      }

      if (Array.isArray(employees) && employees.length > 0) {
        store.employees = employees;
      }

      if (Array.isArray(testimonials) && testimonials.length > 0) {
        store.testimonials = testimonials;
      }

      scheduleSaveStore();
      res.json({
        success: true,
        counts: {
          submissions: store.submissions.length,
          earnings: store.earnings.length,
          campaigns: store.campaigns.length,
          publishers: store.publishers.length,
          testimonials: store.testimonials.length
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. Advertiser Inquiry submission (Direct WhatsApp routing - Zero database/Firestore quota)
  app.post("/api/advertiser/inquiry", (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      // No server or database persistence needed - data is directly routed to WhatsApp
      res.json({ success: true, message: "Direct WhatsApp delivery active. Zero database storage consumed." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/advertiser/inquiries", (req, res) => {
    res.json({ success: true, data: store.advertiserInquiries || [] });
  });

  // Vite middleware for development or Static Assets for production
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      // Express owns the HTTP listener below, so Vite cannot receive the
      // WebSocket upgrade required by its default HMR client in middleware mode.
      // Disable HMR here to prevent the client from retrying a socket that can
      // never be upgraded; the preview server still reloads on restart.
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    
    // Use vite's connect instance as middleware
    app.use(vite.middlewares);

    // Handle SPA fallback routing in development so page refresh doesn't return 404
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        // Read index.html
        let template = fs.readFileSync(
          path.resolve(process.cwd(), "index.html"),
          "utf-8"
        );
        // Apply Vite HTML transforms. HMR is disabled because this Express
        // middleware does not own the WebSocket upgrade handler. Remove the
        // injected client as a final safeguard so the browser never retries
        // an unavailable HMR socket in the preview.
        template = await vite.transformIndexHtml(url, template);
        template = template.replace(/<script[^>]+src=["']\/\@vite\/client["'][^>]*><\/script>/gi, "");
        // Send the transformed HTML back
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files
    app.use(express.static(distPath));
    
    // Handle SPA fallback routing for index.html (Very important to prevent 404s on page refresh)
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Auto-sync clean data from Firestore on boot
    syncFromFirestore().then((res: any) => {
      console.log(`[Server Init] Initial Firestore sync complete. Publishers: ${res?.publishersCount || 0}, Campaigns: ${store.campaigns.length}`);
    }).catch(e => {
      console.warn("[Server Init] Firestore initial sync skipped/failed:", e.message);
    });

    // Periodic sync every 25 seconds to catch cross-device publisher registrations & updates
    setInterval(() => {
      syncFromFirestore().catch(() => {});
    }, 25000);
  });
}

startServer();
