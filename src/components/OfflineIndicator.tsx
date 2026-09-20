import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[99999] animate-fade-up">
      {!isOnline ? (
        <div className="bg-rose-950/90 border border-rose-800 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
          <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center shrink-0">
            <WifiOff className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider">No Internet Connection</p>
            <p className="text-[11px] text-rose-200">You are offline. Changes will sync when reconnected.</p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="ml-2 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      ) : showReconnected ? (
        <div className="bg-emerald-950/90 border border-emerald-800 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider">Back Online</p>
            <p className="text-[11px] text-emerald-200">Connection restored successfully.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
