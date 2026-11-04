import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface FloatingInquiryTabProps {
  onNavigate?: (route: string) => void;
}

export default function FloatingInquiryTab({ onNavigate }: FloatingInquiryTabProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!showPopup) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPopup(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPopup]);

  if (!isVisible) return null;

  const handleClick = (e: React.MouseEvent) => {
    // If user clicked the close button, don't open popup
    if ((e.target as HTMLElement).closest('.close-btn-trigger')) {
      return;
    }
    // Recruitment is currently stopped: link removed, show "Offer Soon" popup
    setShowPopup(true);
  };

  return (
    <>
      <div 
        onClick={handleClick}
        className="fixed right-2 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center bg-blue-900/30 hover:bg-blue-800/90 backdrop-blur-md text-white rounded-xl shadow-2xl border border-blue-400/40 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-x-1 active:scale-95 group
          w-[32px] h-[155px] sm:w-[38px] sm:h-[190px] py-2 px-1"
        style={{ contentVisibility: 'auto' }}
        title="Recruitment"
      >
        {/* Sleek integrated close button - Solid 100% opaque, high-contrast & clearly visible */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="close-btn-trigger w-5 h-5 sm:w-6 sm:h-6 bg-slate-950/95 hover:bg-slate-950 text-white rounded-full flex items-center justify-center border border-slate-600 shadow transition-all duration-200 hover:scale-110 shrink-0 mb-1.5 opacity-100"
          title="Hide tab"
          aria-label="Close recruitment tab"
        >
          <X className="w-3.5 h-3.5 stroke-[4] text-white" />
        </button>

        {/* Small separator line */}
        <div className="w-4/5 h-[1px] bg-blue-400/40 mb-2 shrink-0"></div>

        {/* Rotated 90 degrees vertical uppercase text "RECRUITMENT" - High-contrast vibrant red color */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <span className="transform -rotate-90 whitespace-nowrap uppercase font-black tracking-widest text-[11px] sm:text-[13px] select-none text-[#ff2a2a] drop-shadow-[0_1.5px_1.5px_rgba(255,255,255,1)] opacity-100">
            RECRUITMENT
          </span>
        </div>
      </div>

      {/* Offer Soon Popup */}
      {showPopup && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowPopup(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-xs sm:max-w-sm w-full mx-auto shadow-2xl text-center transform transition-all"
          >
            {/* Close button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Exactly "Offer Soon" and nothing else */}
            <div className="py-5">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Offer Soon
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
