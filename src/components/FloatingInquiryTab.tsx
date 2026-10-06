import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FloatingInquiryTabProps {
  onNavigate?: (route: string) => void;
}

export default function FloatingInquiryTab({ onNavigate }: FloatingInquiryTabProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClick = (e: React.MouseEvent) => {
    // If user clicked the close button, don't navigate
    if ((e.target as HTMLElement).closest('.close-btn-trigger')) {
      return;
    }
    if (onNavigate) {
      onNavigate('/recruitment-tender');
    } else {
      window.location.hash = '#/recruitment-tender';
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="fixed right-2 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center bg-blue-900/30 hover:bg-blue-800/90 backdrop-blur-md text-white rounded-xl shadow-2xl border border-blue-400/40 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-x-1 active:scale-95 group
        w-[32px] h-[155px] sm:w-[38px] sm:h-[190px] py-2 px-1"
      style={{ contentVisibility: 'auto' }}
      title="View Public Ads India Official Recruitment & Tenders"
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
  );
}
