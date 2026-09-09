import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

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

  // 2. Fetch server state (Instantly loads latest data without burning Firestore read quota)
  app.get("/api/realtime/state", (req, res) => {
    res.json({
      success: true,
      data: store,
      connectedClients: sseClients.length,
      serverTime: Date.now()
    });
  });

  // 3. Dedicated Realtime "Payment Done" endpoint
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
          id: `earning-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
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

  // 4. General Broadcast endpoint for any entity change
  app.post("/api/realtime/broadcast", (req, res) => {
    try {
      const { type, payload } = req.body || {};
      if (!type) {
        return res.status(400).json({ error: "Missing event type" });
      }

      if (type === 'SYNC_SUBMISSIONS' && Array.isArray(payload)) {
        store.submissions = payload;
      } else if (type === 'SYNC_EARNINGS' && Array.isArray(payload)) {
        store.earnings = payload;
      } else if (type === 'SYNC_CAMPAIGNS' && Array.isArray(payload)) {
        store.campaigns = payload;
      } else if (type === 'SYNC_PUBLISHERS' && Array.isArray(payload)) {
        store.publishers = payload;
      } else if (type === 'SYNC_BANK_DETAILS' && payload) {
        store.bankDetailsMap = payload;
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
        store.campaigns = campaigns;
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
