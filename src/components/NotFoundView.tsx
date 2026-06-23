import React from 'react';
import { motion } from 'motion/react';
import { Globe, Home, AlertTriangle } from 'lucide-react';

interface NotFoundViewProps {
  onNavigate: (route: string) => void;
}

export default function NotFoundView({ onNavigate }: NotFoundViewProps) {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden py-12 md:py-20 select-none">
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      {/* Styled Ambient Glow Background Circles */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500/5 dark:bg-amber-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-xl w-full">
        {/* Animated Main Element (Floating 404 Card) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/75 dark:bg-[#0d1628]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] mb-8"
        >
          {/* Animated Glowing Error Indicator badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-[10px] uppercase font-black tracking-widest rounded-full mb-6">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Error Code: 404 (Route Lost)</span>
          </div>

          {/* Huge Neon Glowing 404 Display */}
          <div className="relative mb-6">
            <h1 className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500 select-none filter drop-shadow-sm font-sans">
              404
            </h1>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 opacity-5 pointer-events-none select-none text-9xl font-black blur-md text-blue-500">
              404
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            Whoops! This Location is Unreachable.
          </p>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold mt-3 leading-relaxed max-w-md mx-auto">
            The page or dynamic section you are searching for does not exist on <span className="text-blue-600 dark:text-amber-400">Public Ads India</span> portal. You may have manually typed an invalid extension URL or this route has moved.
          </p>
        </motion.div>

        {/* Buttons and Redirection controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
        >
          {/* Back to Home CTA */}
          <button
            onClick={() => onNavigate('/Home')}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2.5 shadow-md active:scale-95 transition-transform text-xs sm:text-sm tracking-wide cursor-pointer border border-blue-500/10"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </button>

          {/* Old Website CTA */}
          <a
            href="https://publicads-support.blogspot.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-extrabold rounded-2xl flex items-center justify-center gap-2.5 shadow-sm active:scale-95 transition-transform text-xs sm:text-sm tracking-wide cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <Globe className="w-4 h-4 text-blue-600 dark:text-amber-400" />
            <span>Visit Old Website</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
