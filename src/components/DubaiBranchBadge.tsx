import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface DubaiBranchBadgeProps {
  className?: string;
}

const BADGE_SLIDES = [
  {
    id: 'dubai',
    flag: 'https://flagcdn.com/w80/ae.png',
    flagAlt: 'UAE Dubai Flag',
    text: 'Now Open New Branch In Dubai',
    pulseColor: 'bg-emerald-500',
    pulsePing: 'bg-emerald-400',
    whatsappMsg: 'Hello! I would like to know more about your Dubai Branch operations.',
  },
  {
    id: 'india',
    flag: 'https://flagcdn.com/w80/in.png',
    flagAlt: 'India Flag',
    text: 'Established 2023 in India',
    pulseColor: 'bg-amber-500',
    pulsePing: 'bg-amber-400',
    whatsappMsg: 'Hello! I would like to know more about Public Ads India.',
  },
];

export default function DubaiBranchBadge({ className = '' }: DubaiBranchBadgeProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % BADGE_SLIDES.length);
    }, 3600);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const currentSlide = BADGE_SLIDES[currentSlideIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
        transition={{ duration: 0.3 }}
        className={`relative ${className}`}
      >
        {/* Steady Pill Container with High Frosted Glass Blur (No floating motion) */}
        <div
          className="group relative flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2 rounded-full bg-white/60 dark:bg-[#0c162c]/65 backdrop-blur-2xl border border-white/80 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-amber-400/60 dark:hover:border-amber-400/50 hover:shadow-lg overflow-hidden select-none"
        >
          {/* Subtle Ambient Glass Shimmer */}
          <div
            className="absolute -inset-full bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent rotate-45 pointer-events-none"
            style={{ animation: 'shimmerSweep 7s infinite linear' }}
          />

          {/* Clickable Action with Smooth Faded Animation */}
          <a
            href={`https://wa.me/918934932418?text=${encodeURIComponent(currentSlide.whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center cursor-pointer min-w-[210px] sm:min-w-[230px]"
            title={`${currentSlide.text} - Click to Connect`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="flex items-center gap-2 sm:gap-2.5"
              >
                {/* Flag Icon */}
                <div className="relative w-6 h-4 sm:w-6.5 sm:h-4.5 rounded-[3.5px] overflow-hidden shadow-xs shrink-0 border border-black/10 dark:border-white/25 bg-slate-100 dark:bg-slate-800 transition-transform group-hover:scale-105">
                  <img
                    src={currentSlide.flag}
                    alt={currentSlide.flagAlt}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Animated Faded Text */}
                <span className="text-[11px] sm:text-xs font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  {currentSlide.text}
                </span>

                {/* Glowing Live Pulse Indicator */}
                <span className="relative flex h-2 w-2 shrink-0 ml-0.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentSlide.pulsePing}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${currentSlide.pulseColor}`}></span>
                </span>
              </motion.div>
            </AnimatePresence>
          </a>

          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="p-1 ml-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

