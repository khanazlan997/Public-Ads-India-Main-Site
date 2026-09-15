import React, { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export default function OfferPopup() {
  const { offer } = useAppState();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (offer && offer.active && (offer.image || offer.title || offer.description)) {
      // Check if user already dismissed this specific offer in the current session
      const offerKey = `pai_dismissed_${offer.image || ''}_${offer.title || ''}`;
      const isClosed = sessionStorage.getItem(offerKey);
      if (isClosed === 'true') {
        setVisible(false);
        return;
      }

      // Small smooth delay for optimal entrance feel
      const timer = setTimeout(() => {
        setVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [offer?.active, offer?.image, offer?.title, offer?.description]);

  const dismissOffer = () => {
    setVisible(false);
    if (offer) {
      const offerKey = `pai_dismissed_${offer.image || ''}_${offer.title || ''}`;
      sessionStorage.setItem(offerKey, 'true');
    }
  };

  if (!visible || !offer?.active) return null;

  return (
    <AnimatePresence>
      <div id="offer-popup" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800"
        >
          {/* Close button top right */}
          <button 
            id="close-offer-popup"
            onClick={dismissOffer}
            className="absolute top-3.5 right-3.5 z-20 p-2 text-white bg-black/60 hover:bg-black/85 backdrop-blur-md rounded-full transition-all duration-200 border border-white/20 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            aria-label="Close Announcement"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Banner Image Container */}
          {offer.image && (
            <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden border-b border-slate-100 dark:border-slate-800">
              <img 
                src={offer.image} 
                alt={offer.title || "Public Ads India Offer Announcement"} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Body Content Area */}
          <div className="px-6 py-5 sm:px-8 sm:py-6 flex flex-col items-center text-center">
            {offer.title && (
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2">
                {offer.title}
              </h3>
            )}
            {/* Description */}
            <p className="text-sm sm:text-[15px] text-slate-800 dark:text-slate-100 font-semibold leading-relaxed mb-5 max-w-md break-words">
              {offer.description || "Limited time bonus directly to your wallet dashboard. Check active rates, submit valid leads, and request bulk approvals."}
            </p>

            {/* Actions */}
            <div className="w-full flex flex-col items-center">
              {offer.showButton !== false && (
                offer.link ? (
                  <a
                    id="accept-offer-view"
                    href={offer.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={dismissOffer}
                    className="w-full py-3 px-6 bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-95 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer no-underline active:scale-[0.99]"
                  >
                    <Gift className="w-4 h-4" />
                    <span>{offer.buttonText || "Claim Offer Bonuses Now"}</span>
                  </a>
                ) : (
                  <button
                    id="accept-offer-view"
                    onClick={dismissOffer}
                    className="w-full py-3 px-6 bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-95 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.99]"
                  >
                    <Gift className="w-4 h-4" />
                    <span>{offer.buttonText || "Claim Offer Bonuses Now"}</span>
                  </button>
                )
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
