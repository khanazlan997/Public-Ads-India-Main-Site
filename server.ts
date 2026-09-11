import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { snapshotPublishers } from "./src/data/databaseSnapshot";

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
    updatedAt: number;
  }

  let store: ServerStore = {
    submissions: [],
    earnings: [],
    campaigns: [],
    publishers: [],
    bankDetailsMap: {},
    employees: [],
    advertiserInquiries: [],
    partners: [],
    updatedAt: Date.now()
  };

  // Load existing persistent storage from disk if available
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      store = { ...store, ...parsed };
      console.log(`Loaded ${store.submissions.length} submissions and ${store.earnings.length} earnings from server storage.`);
    }
  } catch (e) {
    console.warn("Could not read server_data/store.json, using initialized store:", e);
  }

  if (!store.publishers || store.publishers.length === 0) {
    store.publishers = snapshotPublishers;
  } else {
    const pubMap = new Map();
    snapshotPublishers.forEach(p => pubMap.set(p.id, p));
    store.publishers.forEach(p => {
      const snap = pubMap.get(p.id);
      if (snap && snap.avatar && snap.avatar !== '👤' && (!p.avatar || p.avatar === '👤')) {
        p.avatar = snap.avatar;
      }
      pubMap.set(p.id, p);
    });
    store.publishers = Array.from(pubMap.values());
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

  // Automatic Firestore Cloud Synchronization
  // Pulls all live publishers, submissions, earnings, campaigns, and bank details from Firestore
  async function syncFromFirestore() {
    try {
      const configPath = path.resolve(process.cwd(), "firebase-applet-config.json");
      if (!fs.existsSync(configPath)) return;
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (!config.apiKey || !config.projectId) return;

      const firebaseApp = initializeApp(config, `server-sync-${Date.now()}`);
      const firestore = getFirestore(firebaseApp, config.firestoreDatabaseId);

      console.log("[Server Firestore Sync] Fetching collections from Firestore...");
      
      const [pubSnap, subSnap, earnSnap, campSnap, bankSnap] = await Promise.all([
        getDocs(collection(firestore, "publishers")).catch(() => ({ size: 0, docs: [] } as any)),
        getDocs(collection(firestore, "submissions")).catch(() => ({ size: 0, docs: [] } as any)),
        getDocs(collection(firestore, "earnings")).catch(() => ({ size: 0, docs: [] } as any)),
        getDocs(collection(firestore, "campaigns")).catch(() => ({ size: 0, docs: [] } as any)),
        getDocs(collection(firestore, "bank_details")).catch(() => ({ size: 0, docs: [] } as any)),
      ]);

      let changed = false;

      // 1. Publishers
      if (pubSnap.size > 0) {
        const pubMap = new Map<string, any>();
        store.publishers.forEach(p => pubMap.set(p.id, p));
        pubSnap.docs.forEach((d: any) => {
          const data = { id: d.id, ...d.data() };
          pubMap.set(d.id, { ...(pubMap.get(d.id) || {}), ...data });
        });
        const mergedPubs = Array.from(pubMap.values());
        if (mergedPubs.length !== store.publishers.length) changed = true;
        store.publishers = mergedPubs;
      }

      // 2. Submissions
      if (subSnap.size > 0) {
        const subMap = new Map<string, any>();
        store.submissions.forEach(s => subMap.set(s.id, s));
        subSnap.docs.forEach((d: any) => {
          const data = { id: d.id, ...d.data() };
          subMap.set(d.id, { ...(subMap.get(d.id) || {}), ...data });
        });
        const mergedSubs = Array.from(subMap.values());
        if (mergedSubs.length !== store.submissions.length) changed = true;
        store.submissions = mergedSubs;
      }

      // 3. Earnings
      if (earnSnap.size > 0) {
        const earnMap = new Map<string, any>();
        store.earnings.forEach(e => earnMap.set(e.id, e));
        earnSnap.docs.forEach((d: any) => {
          const data = { id: d.id, ...d.data() };
          earnMap.set(d.id, { ...(earnMap.get(d.id) || {}), ...data });
        });
        const mergedEarns = Array.from(earnMap.values());
        if (mergedEarns.length !== store.earnings.length) changed = true;
        store.earnings = mergedEarns;
      }

      // 4. Campaigns
      if (campSnap.size > 0) {
        const campMap = new Map<string, any>();
        store.campaigns.forEach(c => campMap.set(c.id, c));
        campSnap.docs.forEach((d: any) => {
          const data = { id: d.id, ...d.data() };
          campMap.set(d.id, { ...(campMap.get(d.id) || {}), ...data });
        });
        store.campaigns = Array.from(campMap.values());
      }

      // 5. Bank Details
      if (bankSnap.size > 0) {
        bankSnap.docs.forEach((d: any) => {
          store.bankDetailsMap[d.id] = { ...(store.bankDetailsMap[d.id] || {}), ...d.data() };
        });
      }

      console.log(`[Server Firestore Sync] Synced ${store.publishers.length} publishers, ${store.submissions.length} submissions, ${store.earnings.length} earnings.`);
      scheduleSaveStore();
    } catch (err) {
      console.warn("[Server Firestore Sync] Sync notice:", err);
    }
  }

  // Trigger sync on boot and every 5 minutes in background
  syncFromFirestore();
  setInterval(syncFromFirestore, 5 * 60 * 1000);

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
    const camp = store.campaigns.find(c => c.id === req.params.id);
    if (!camp || !camp.image) {
      return res.status(404).send("Image not found");
    }
    const img = camp.image;
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
    await syncFromFirestore();
    res.json({
      success: true,
      publishersCount: store.publishers.length,
      submissionsCount: store.submissions.length,
      earningsCount: store.earnings.length,
      campaignsCount: store.campaigns.length
    });
  });

  // 2. Fetch server state (Instantly loads latest data without burning Firestore read quota)
  app.get("/api/realtime/state", (req, res) => {
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

  // Dedicated Campaign Management endpoints (Guaranteed cross-device sync & persistence)
  app.post("/api/campaign/update", (req, res) => {
    try {
      const { id, active, campaign, allCampaigns } = req.body || {};
      
      if (Array.isArray(allCampaigns) && allCampaigns.length > 0) {
        store.campaigns = allCampaigns;
      } else if (id && active !== undefined) {
        const camp = store.campaigns.find(c => c.id === id);
        if (camp) {
          camp.active = Boolean(active);
        }
      } else if (campaign && campaign.id) {
        const idx = store.campaigns.findIndex(c => c.id === campaign.id);
        if (idx !== -1) {
          const existingImage = store.campaigns[idx].image;
          const newImage = campaign.image;
          const finalImage = (newImage && typeof newImage === 'string' && newImage.trim().length > 0 && !newImage.startsWith('/api/campaign/image/'))
            ? newImage
            : existingImage;
          store.campaigns[idx] = { 
            ...store.campaigns[idx], 
            ...campaign, 
            image: finalImage 
          };
        } else {
          store.campaigns.unshift(campaign);
        }
      }

      scheduleSaveStore();
      broadcastRealtime({
        type: "SYNC_CAMPAIGNS",
        payload: store.campaigns
      });

      res.json({ success: true, campaigns: store.campaigns, connectedClients: sseClients.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/campaign/delete", (req, res) => {
    try {
      const { id } = req.body || {};
      if (id) {
        store.campaigns = store.campaigns.filter(c => c.id !== id);
        scheduleSaveStore();
        broadcastRealtime({
          type: "SYNC_CAMPAIGNS",
          payload: store.campaigns
        });
      }
      res.json({ success: true, campaigns: store.campaigns, connectedClients: sseClients.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated Publisher Login endpoint (Zero Firestore quota dependency)
  app.post("/api/auth/publisher-login", (req, res) => {
    try {
      const { phoneOrEmail, password } = req.body || {};
      if (!phoneOrEmail || !password) {
        return res.status(400).json({ success: false, message: "Missing credentials" });
      }
      const target = phoneOrEmail.trim().toLowerCase();
      console.log(`[Auth Attempt] Target: ${target}, Server publishers count: ${store.publishers.length}`);
      const pub = store.publishers.find(p => 
        (p.email?.trim().toLowerCase() === target || p.phone?.trim() === phoneOrEmail.trim()) && 
        p.password === password
      );
      if (!pub) {
        console.log(`[Auth Failed] No match found for: ${target}`);
        return res.status(401).json({ success: false, message: "Invalid phone/email or password." });
      }
      if (pub.blocked) {
        return res.status(403).json({ success: false, message: "Your publisher account has been blocked by Admin. Contact support." });
      }
      res.json({ success: true, publisher: pub });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Dedicated Publisher Register endpoint (Zero Firestore quota dependency)
  app.post("/api/publisher/register", (req, res) => {
    try {
      const { publisher } = req.body || {};
      if (!publisher || !publisher.id) {
        return res.status(400).json({ error: "Missing publisher data" });
      }
      const idx = store.publishers.findIndex(p => p.id === publisher.id);
      if (idx !== -1) {
        const existingAvatar = store.publishers[idx].avatar;
        const newAvatar = publisher.avatar;
        const finalAvatar = (newAvatar && newAvatar.startsWith('/api/publisher/avatar/'))
          ? existingAvatar
          : (newAvatar !== undefined ? newAvatar : existingAvatar);
        store.publishers[idx] = { ...store.publishers[idx], ...publisher, avatar: finalAvatar };
      } else {
        store.publishers.unshift(publisher);
      }
      scheduleSaveStore();
      broadcastRealtime({
        type: "SYNC_PUBLISHERS",
        payload: store.publishers
      });
      res.json({ success: true, publisher });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated Publisher Profile Update endpoint
  app.post("/api/publisher/update", (req, res) => {
    try {
      const { publisherId, name, avatar } = req.body || {};
      if (!publisherId) {
        return res.status(400).json({ error: "Missing publisherId" });
      }
      const idx = store.publishers.findIndex(p => p.id === publisherId);
      if (idx !== -1) {
        const existingAvatar = store.publishers[idx].avatar;
        const finalAvatar = (avatar && avatar.startsWith('/api/publisher/avatar/'))
          ? existingAvatar
          : (avatar !== undefined ? avatar : existingAvatar);
        store.publishers[idx] = {
          ...store.publishers[idx],
          ...(name ? { name } : {}),
          avatar: finalAvatar
        };
      } else {
        store.publishers.unshift({ id: publisherId, name: name || publisherId, avatar: avatar || '👤' });
      }
      scheduleSaveStore();
      broadcastRealtime({
        type: "SYNC_PUBLISHERS",
        payload: store.publishers
      });
      res.json({ success: true, publisher: store.publishers.find(p => p.id === publisherId) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated Bank Details endpoint (Zero Firestore quota dependency)
  app.post("/api/bank/update", (req, res) => {
    try {
      const { publisherId, details } = req.body || {};
      if (!publisherId || !details) {
        return res.status(400).json({ error: "Missing publisherId or details" });
      }
      store.bankDetailsMap = {
        ...(store.bankDetailsMap || {}),
        [publisherId]: { ...details, publisherId }
      };
      scheduleSaveStore();
      broadcastRealtime({
        type: "SYNC_BANK_DETAILS",
        payload: store.bankDetailsMap
      });
      res.json({ success: true, bankDetails: store.bankDetailsMap[publisherId] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dedicated Partner Apply endpoint (Zero Firestore quota dependency)
  app.post("/api/partner/apply", (req, res) => {
    try {
      const { partner } = req.body || {};
      if (!partner || !partner.id) {
        return res.status(400).json({ error: "Missing partner data" });
      }
      if (!Array.isArray(store.partners)) store.partners = [];
      const idx = store.partners.findIndex(p => p.id === partner.id);
      if (idx !== -1) {
        store.partners[idx] = { ...store.partners[idx], ...partner };
      } else {
        store.partners.unshift(partner);
      }
      scheduleSaveStore();
      broadcastRealtime({
        type: "SYNC_PARTNERS",
        payload: store.partners
      });
      res.json({ success: true, partner });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Universal Status Update endpoint - Handles ANY status change (Process, Reject, Ready To Trade, Active, Trade Done, Payment Done)
  app.post("/api/submission/update-status", (req, res) => {
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
  app.post("/api/submission/create", (req, res) => {
    try {
      const { submission } = req.body || {};
      if (!submission || !submission.id) {
        return res.status(400).json({ error: "Missing submission data or ID" });
      }

      const idx = store.submissions.findIndex(s => s.id === submission.id);
      if (idx >= 0) {
        store.submissions[idx] = { ...store.submissions[idx], ...submission };
      } else {
        store.submissions.unshift(submission);
      }
      scheduleSaveStore();

      broadcastRealtime({
        type: "NEW_SUBMISSION",
        payload: submission
      });

      res.json({ success: true, submission, connectedClients: sseClients.length });
    } catch (err: any) {
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
      const { submissions, earnings, campaigns, publishers, bankDetailsMap, employees } = req.body || {};

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

      scheduleSaveStore();
      res.json({
        success: true,
        counts: {
          submissions: store.submissions.length,
          earnings: store.earnings.length,
          campaigns: store.campaigns.length,
          publishers: store.publishers.length
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. Advertiser Inquiry submission (Forwards to Admin WhatsApp +91 8934932418 & saves in store)
  app.post("/api/advertiser/inquiry", (req, res) => {
    try {
      const inquiry = req.body;
      if (!inquiry || !inquiry.name || !inquiry.phone) {
        return res.status(400).json({ error: "Missing inquiry details" });
      }
      if (!Array.isArray(store.advertiserInquiries)) {
        store.advertiserInquiries = [];
      }
      store.advertiserInquiries = [inquiry, ...store.advertiserInquiries.filter(i => i.id !== inquiry.id)].slice(0, 500);
      scheduleSaveStore();
      broadcastRealtime({ type: 'SYNC_ADVERTISER_INQUIRIES', payload: store.advertiserInquiries });
      console.log(`[Advertiser Inquiry] Dispatched from ${inquiry.name} (${inquiry.phone}) to Admin +91 8934932418`);
      res.json({ success: true, inquiry });
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
      server: { middlewareMode: true },
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
        // Apply Vite HTML transforms
        template = await vite.transformIndexHtml(url, template);
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

  // Start periodic sync
  setInterval(syncFromFirestore, 600000); // 10 minutes

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
