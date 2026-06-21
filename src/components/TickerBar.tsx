import React from 'react';
import { ShieldCheck, Users, Flame, Award, HeartHandshake } from 'lucide-react';

export default function TickerBar() {
  const items = [
    { text: "Zero Investment Work", icon: <Flame className="w-4 h-4 text-brand-gold fill-brand-gold animate-bounce" /> },
    { text: "2000+ Active Publishers", icon: <Users className="w-4 h-4 text-emerald-300" /> },
    { text: "₹5Cr+ Total Paid Out", icon: <Award className="w-4 h-4 text-amber-300" /> },
    { text: "ISO 9001:2015 Certified", icon: <ShieldCheck className="w-4 h-4 text-blue-300" /> },
    { text: "50+ Live Campaigns", icon: <Flame className="w-4 h-4 text-orange-400" /> },
    { text: "CVC Cyber Security Verified", icon: <ShieldCheck className="w-4 h-4 text-brand-success" /> },
    { text: "Company Estb. 2023", icon: <HeartHandshake className="w-4 h-4 text-pink-300" /> }
  ];

  // Repeat items to make ticker continuous
  const tickerItems = [...items, ...items, ...items, ...items];

  return (
    <div id="ticker-bar" className="bg-[#1e40af] text-white py-2.5 overflow-hidden border-y border-blue-800 relative z-30 select-none shadow-sm">
      <div className="inline-flex whitespace-nowrap animate-ticker divide-x divide-blue-700/60 font-medium text-sm">
        {tickerItems.map((item, index) => (
          <div key={index} className="inline-flex items-center gap-2.5 px-6 tracking-wide">
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
