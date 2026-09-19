import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface CongratsModalProps {
  publisherInfo: { id: string; name: string } | null;
  onClose: () => void;
}

export default function CongratsModal({ publisherInfo, onClose }: CongratsModalProps) {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (!publisherInfo) return;
    setTimeLeft(5);

    // 5-second countdown timer
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [publisherInfo, onClose]);

  if (!publisherInfo) return null;

  return (
    <AnimatePresence>
      <div 
        id="congrats-modal-backdrop"
        className="fixed inset-0 z-[999999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-950/50 rounded-3xl max-w-lg w-full p-8 shadow-2xl text-center overflow-hidden"
        >
          {/* Top Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Celebration Trophy / Badge */}
          <div className="relative mx-auto w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/30 text-white mb-6 animate-bounce">
            <Trophy className="w-10 h-10" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-slate-950 shadow-md">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
          </div>

          {/* Title */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-black tracking-wider uppercase mb-3 border border-emerald-200/50">
            <CheckCircle2 className="w-3.5 h-3.5" /> New Account Registered Successfully
          </span>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Congratulations, {publisherInfo.name}! 🎉
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed font-medium">
            Your official Publisher Account has been successfully generated and synchronized across our network servers.
          </p>

          {/* Publisher ID Box */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 mb-6 text-center shadow-inner">
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Your Licensed Publisher ID</span>
            <span className="font-mono text-2xl font-black text-indigo-650 dark:text-indigo-400 tracking-wider">
              {publisherInfo.id}
            </span>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-3 mb-6 text-left">
            <div className="p-3 bg-indigo-50/50 dark:bg-slate-950/40 rounded-xl border border-indigo-100 dark:border-slate-800/80 flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <p className="text-[11px] font-black text-slate-800 dark:text-slate-200">Instant Access</p>
                <p className="text-[10px] text-slate-400">Ready to submit leads</p>
              </div>
            </div>
            <div className="p-3 bg-emerald-50/50 dark:bg-slate-950/40 rounded-xl border border-emerald-100 dark:border-slate-800/80 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-[11px] font-black text-slate-800 dark:text-slate-200">100% Secure</p>
                <p className="text-[10px] text-slate-400">Verified banking ledger</p>
              </div>
            </div>
          </div>

          {/* Countdown & Action */}
          <div className="space-y-3">
            <button
              type="button"
              id="congrats-dismiss-btn"
              onClick={onClose}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Get Started & Start Earning</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] font-bold text-slate-400">
              Auto-closing in <span className="font-mono text-indigo-600 dark:text-indigo-400 font-black">{timeLeft}s</span>...
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
