import React, { useState, useEffect } from 'react';
import { X, Gift, Sparkles } from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export default function OfferPopup() {
  const { offer } = useAppState();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (offer.active && offer.image) {
      // Check if user already dismissed this specific offer in the current session
      const isClosed = sessionStorage.getItem('pai_offer_dismissed_img') === offer.image;
      if (isClosed) {
        setVisible(false);
        return;
      }

      // Small delay for better UX feel
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [offer]);

  const dismissOffer = () => {
    setVisible(false);
    if (offer.image) {
      sessionStorage.setItem('pai_offer_dismissed_img', offer.image);
    }
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <div id="offer-popup" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative max-w-lg w-full bg-white dark:bg-[#0d1628] rounded-2xl overflow-hidden shadow-2xl border border-brand-accent/30"
        >
          {/* Close button top right */}
          <button 
            id="close-offer-popup"
            onClick={dismissOffer}
            className="absolute top-3 right-3 z-10 p-2 text-white bg-black/60 rounded-full hover:bg-black/90 transition-colors border border-white/20 hover:scale-105 active:scale-95"
            aria-label="Close Announcement"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner */}
          <div className="relative aspect-video w-full bg-brand-primary">
            <img 
              src={offer.image} 
              alt="Special Active Offer! Earn more commissions with Public Ads India" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Visual shine gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <span className="inline-flex items-center gap-1 bg-amber-500 text-black font-extrabold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 select-none w-fit">
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                Live Offer Alert
              </span>
              <h3 className="text-xl font-extrabold text-white tracking-tight drop-shadow-md">
                {offer.title || "Maximize Your Payouts with Active Campaigns!"}
              </h3>
            </div>
          </div>

          <div className="p-6 text-center max-w-sm mx-auto flex flex-col items-center">
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mb-5 w-full break-words">
              {offer.description || "Limited time bonus directly to your wallet dashboard. Check active rates, submit valid leads, and request bulk approvals."}
            </p>
            {offer.showButton !== false && (
              offer.link ? (
                <a
                  id="accept-offer-view"
                  href={offer.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={dismissOffer}
                  className="w-full py-3 bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-95 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-center no-underline text-xs animate-fade-up"
                >
                  <Gift className="w-5 h-5" />
                  {offer.buttonText || "Claim Offer Bonuses Now"}
                </a>
              ) : (
                <button
                  id="accept-offer-view"
                  onClick={dismissOffer}
                  className="w-full py-3 bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-95 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-xs animate-fade-up"
                >
                  <Gift className="w-5 h-5" />
                  {offer.buttonText || "Claim Offer Bonuses Now"}
                </button>
              )
            )}
            {offer.showButton === false && (
              <p className="text-[10px] text-slate-400 font-medium">Click the 'X' at top right to close this announcement</p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
