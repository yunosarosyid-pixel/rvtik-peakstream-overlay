import React from 'react';
import { Flame, PhoneCall, Mountain, Compass } from 'lucide-react';

interface RunningTickerProps {
  text: string;
  waNumber: string;
}

export const RunningTicker: React.FC<RunningTickerProps> = ({ text, waNumber }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 h-9 bg-[#100f0e]/98 border-t border-stone-800 flex items-center overflow-hidden select-none">
      {/* Fixed Left Badge */}
      <div className="flex-shrink-0 z-10 h-full px-2.5 bg-[#1b2e20] border-r border-[#2a4d33] flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#7de39b]">
        <Compass className="w-3 h-3 text-[#7de39b]" />
        <span>INFO LIVE</span>
      </div>

      {/* Marquee Running Text */}
      <div className="relative flex overflow-x-hidden w-full text-[11px] font-mono text-[#dcd7cc]">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 pl-4">
          <span className="text-[#f5ebd9]">{text}</span>
          <span className="text-[#7de39b] font-bold flex items-center gap-1">
            <PhoneCall className="w-3 h-3 text-[#7de39b]" />
            WHATSAPP: {waNumber}
          </span>
          <span className="text-[#f8a855] flex items-center gap-1">
            <Mountain className="w-3 h-3 text-[#f8a855]" />
            KUNCI SLOT SEKARANG VIA WA ADMIN
          </span>
        </div>

        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-8 pl-4">
          <span className="text-[#f5ebd9]">{text}</span>
          <span className="text-[#7de39b] font-bold flex items-center gap-1">
            <PhoneCall className="w-3 h-3 text-[#7de39b]" />
            WHATSAPP: {waNumber}
          </span>
          <span className="text-[#f8a855] flex items-center gap-1">
            <Mountain className="w-3 h-3 text-[#f8a855]" />
            KUNCI SLOT SEKARANG VIA WA ADMIN
          </span>
        </div>
      </div>
    </div>
  );
};
