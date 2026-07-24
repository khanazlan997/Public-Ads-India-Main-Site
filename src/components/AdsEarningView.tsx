import React, { useEffect, useState } from 'react';
import { useAppState } from '../context/AppContext';
import { DollarSign, ShieldCheck, Sparkles, ExternalLink, Settings, RefreshCw, Layers } from 'lucide-react';
import CryptoJS from 'crypto-js';

interface AdsEarningViewProps {
  onNavigate: (route: string) => void;
}

declare global {
  interface Window {
    config?: any;
  }
}

export default function AdsEarningView({ onNavigate }: AdsEarningViewProps) {
  const { currentUser } = useAppState();
  const [appId, setAppId] = useState<string>('34739');
  const [appSecret, setAppSecret] = useState<string>('ztIoZ1cMXCRXBjhCOs2ncKVxVVSMOs88');
  const [showConfigPanel, setShowConfigPanel] = useState<boolean>(false);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

  const ext_user_id = currentUser?.id || "user_" + Math.floor(Math.random() * 100000);
  const email = currentUser?.email || "";
  const username = currentUser?.name || "Guest";

  // MD5 secure_hash calculation as per CPX PHP script specification: md5($user_id . '-' . $app_secret)
  const secureHash = CryptoJS.MD5(`${ext_user_id}-${appSecret}`).toString();

  useEffect(() => {
    // 1. Prepare configuration parameters
    const your_app_id = parseInt(appId, 10) || 34739;

    const script1 = {
      div_id: "fullscreen",
      theme_style: 1,
      order_by: 2,
      limit_surveys: 7
    };

    const script2 = {
      div_id: "sidebar",
      theme_style: 1,
      order_by: 1,
    };

    const script3 = {
      div_id: "single",
      theme_style: 3,
      display_mode: 1
    };

    const script4 = {
      div_id: "notification",
      theme_style: 4,
      position: 5,
      text: "",
      link: "",
      newtab: true
    };

    const script5 = {
      div_id: "notification2",
      theme_style: 4,
      position: 6,
      text: "",
      link: `https://wall.cpx-research.com/index.php?app_id=${your_app_id}&ext_user_id=${ext_user_id}&secure_hash=${secureHash}`,
      newtab: true
    };

    const config = {
      general_config: {
        app_id: your_app_id,
        ext_user_id: ext_user_id,
        email: email,
        username: username,
        secure_hash: secureHash,
        subid_1: "",
        subid_2: "",
      },
      style_config: {
        text_color: "#2b2b2b",
        survey_box: {
          topbar_background_color: "#ffaf20",
          box_background_color: "white",
          rounded_borders: true,
          stars_filled: "black",
        },
      },
      script_config: [script1, script2, script3, script4, script5],
      debug: false,
      useIFrame: true,
      iFramePosition: 1,
      functions: {
        no_surveys_available: () => {
          console.log("no surveys available function here");
        },
        count_new_surveys: (countsurveys: any) => {
          console.log("count surveys function here, count:", countsurveys);
        },
        get_all_surveys: (surveys: any) => {
          console.log("get all surveys function here, surveys: ", surveys);
        },
        get_transaction: (transactions: any) => {
          console.log("transaction function here, transaction: ", transactions);
        }
      }
    };

    // Attach to global window object
    window.config = config;

    // 2. Dynamically load the CPX Research Scripts
    const existingScript = document.getElementById('cpx-research-script');
    if (existingScript) existingScript.remove();

    const existingV2Script = document.getElementById('cpx-research-v2-script');
    if (existingV2Script) existingV2Script.remove();

    // Primary script tag v2
    const scriptV2 = document.createElement('script');
    scriptV2.id = 'cpx-research-v2-script';
    scriptV2.type = 'text/javascript';
    scriptV2.src = 'https://cdn.cpx-research.com/assets/js/script_tag_v2.0.js';
    scriptV2.async = true;
    document.body.appendChild(scriptV2);

    // Wall script tag
    const script = document.createElement('script');
    script.id = 'cpx-research-script';
    script.src = 'https://wall.cpx-research.com/script.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      const s = document.getElementById('cpx-research-script');
      if (s) s.remove();
      const s2 = document.getElementById('cpx-research-v2-script');
      if (s2) s2.remove();
    };
  }, [appId, currentUser]);

  const reloadWall = () => {
    window.location.reload();
  };

  const directOfferUrl = `https://offers.cpx-research.com/index.php?app_id=${appId}&ext_user_id=${ext_user_id}&secure_hash=${secureHash}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&subid_1=&subid_2=`;
  const directWallUrl = `https://wall.cpx-research.com/index.php?app_id=${appId}&ext_user_id=${ext_user_id}&secure_hash=${secureHash}`;

  return (
    <div id="ads-earning-workspace" className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Top Banner & Title Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800/80 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Monetization & Ad Network Wall</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ads Earning Hub <span className="text-amber-400">Public Ads India</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl font-medium">
              Complete surveys, interact with sponsored ad tasks, and generate high eCPM revenue directly connected to your account.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowConfigPanel(!showConfigPanel)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl text-xs font-extrabold transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>{showConfigPanel ? 'Hide Publisher Settings' : 'Publisher App Config'}</span>
            </button>
            <button
              onClick={reloadWall}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Ads</span>
            </button>
          </div>
        </div>

        {/* Optional Publisher Configuration Bar */}
        {showConfigPanel && (
          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">CPX App ID</label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="Enter App ID e.g. 34739"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">App Secret Key</label>
              <input
                type="text"
                value={appSecret}
                onChange={(e) => setAppSecret(e.target.value)}
                placeholder="CPX App Secret Key"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Calculated Secure Hash (MD5)</label>
              <input
                type="text"
                disabled
                value={secureHash}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-emerald-400 font-mono truncate"
              />
            </div>
          </div>
        )}
      </div>

      {/* Direct Offerwall Embedded Section */}
      <div className="space-y-8">
        
        {/* CPX Launcher & Status Bar */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-amber-800 dark:text-amber-300">
                CPX Live Offerwall Launcher
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                If ad-blockers or iframe permissions hide live ads in dev preview, launch your CPX wall directly in a new tab:
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={directOfferUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>Launch Offers (App ID {appId})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={directWallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>Launch Web Wall</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Section 1: Single Item Top Survey Bar */}
        <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Quick High Yield Ad Survey</span>
            </h3>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full">
              Live Feed
            </span>
          </div>
          {/* Target DIV #single required by user script */}
          <div style={{ width: "100%", minHeight: "120px" }} id="single" className="overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900/40 p-2 border border-slate-100 dark:border-slate-800/50">
            <div className="p-4 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 rounded-xl border border-amber-400/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  ★ 4.9
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">Featured High Reward Task</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Consumer Trends Survey 2026</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Takes ~3 minutes • Earn $1.50 (₹125.00)</p>
                </div>
              </div>
              <a
                href={directOfferUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <span>Start Survey Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Section 2: Fullscreen Main Ad Offerwall Grid */}
        <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Sponsored Survey Wall & Ads
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select available tasks below to view ads and earn reward points
                </p>
              </div>
            </div>
            <a
              href={directWallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl text-xs font-bold transition-colors"
            >
              <span>Open Full Web Wall</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Target DIV #fullscreen required by user script */}
          <div style={{ maxWidth: "950px", margin: "auto", minHeight: "300px" }} id="fullscreen" className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-2">
              {[
                { title: "Brand Feedback Poll", earn: "₹95.00", time: "2 min", stars: "★★★★★", category: "Quick Survey" },
                { title: "Tech Products Opinion", earn: "₹180.00", time: "5 min", stars: "★★★★☆", category: "Featured Task" },
                { title: "Shopping Habits Study", earn: "₹240.00", time: "7 min", stars: "★★★★★", category: "High Yield" },
                { title: "Financial App Review", earn: "₹150.00", time: "4 min", stars: "★★★★☆", category: "Hot Offer" },
                { title: "Mobile Gaming Survey", earn: "₹110.00", time: "3 min", stars: "★★★★★", category: "Entertainment" },
                { title: "Daily Quick Poll #102", earn: "₹50.00", time: "1 min", stars: "★★★★★", category: "Instant" }
              ].map((survey, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between gap-3 hover:border-amber-400/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-500 px-2 py-0.5 bg-amber-400/10 rounded-full">{survey.category}</span>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{survey.earn}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{survey.title}</h4>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="text-amber-400">{survey.stars}</span>
                      <span>• {survey.time}</span>
                    </div>
                  </div>
                  <a
                    href={directOfferUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 transition-all"
                  >
                    <span>Take Ad Task</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Sidebar & Notifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-md md:col-span-1">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Sidebar Ad Feed
            </h3>
            {/* Target DIV #sidebar required by user script */}
            <div id="sidebar" style={{ minHeight: "469px" }} className="w-full overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 p-4 space-y-3">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[9px] font-black uppercase text-amber-500 bg-amber-400/10 px-2 py-0.5 rounded-full">Top Ad Offer</span>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">Earn ₹120.00 in 3 min</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Complete instant opinion survey on new mobile apps.</p>
                <a href={directOfferUrl} target="_blank" rel="noopener noreferrer" className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  <span>Start Task</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-400/10 px-2 py-0.5 rounded-full">Instant Rewards</span>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">Earn ₹50.00 Quick Poll</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Share your daily entertainment preferences.</p>
                <a href={directOfferUrl} target="_blank" rel="noopener noreferrer" className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  <span>Start Task</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-md md:col-span-1">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Ad Notifications Feed
            </h3>
            {/* Target DIV #notification required by user script */}
            <div id="notification" style={{ minHeight: "469px" }} className="w-full overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 p-4">
              <div className="p-3.5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-xl">
                <span className="text-[9px] font-black uppercase text-blue-500">Live Notification</span>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Surveys Ready for ID {appId}</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">CPX Research script tag loaded and connected.</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-md md:col-span-1">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Ad Notification Wall #2
            </h3>
            {/* Target DIV #notification2 required by user script */}
            <div id="notification2" style={{ minHeight: "469px" }} className="w-full overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 p-4">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <span className="text-[9px] font-black uppercase text-emerald-500">CPX Wall Link Active</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">Direct offerwall connected with user ID <code className="text-xs font-mono font-bold">{ext_user_id}</code>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded CPX Offers IFrame Display */}
        <div className="bg-white dark:bg-[#0d1628] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>CPX Research Offers & Ad Wall (Direct iFrame)</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400 font-mono">Offers Engine</span>
          </div>
          <iframe
            width="100%"
            height="1200px"
            style={{ border: 0 }}
            src={directOfferUrl}
            title="CPX Research Offers Ad Wall"
            className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900/50"
            allow="geolocation"
          />
        </div>

      </div>

    </div>
  );
}
