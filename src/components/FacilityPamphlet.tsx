import React from 'react';
import { motion } from 'motion/react';
import {
  Check,
  X,
  PackageCheck,
  Mountain,
  PhoneCall,
  ShieldCheck
} from 'lucide-react';
import { TripPackage } from '../types';

interface FacilityPamphletProps {
  trip: TripPackage;
  waNumber: string;
  onOpenWhatsAppQr?: () => void;
}

export const FacilityPamphlet: React.FC<FacilityPamphletProps> = ({
  trip,
  waNumber,
  onOpenWhatsAppQr,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      className="relative z-10 w-full h-full flex flex-col justify-between p-3.5 pt-40 pb-12 text-[#f3eee5] overflow-hidden select-none"
    >
      {/* Muted Atmospheric Background */}
      <div className="absolute inset-0 -z-10 bg-[#100f0e]" />
      <div
        className="absolute inset-0 -z-10 opacity-25 bg-cover bg-center"
        style={{ backgroundImage: `url('${trip.imageUrl}')` }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0e0d0c] via-[#121110]/95 to-[#121110]/85" />

      {/* Top Header Section (Left of circular camera) */}
      <div className="flex flex-col gap-1 max-w-[60%]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#1e3324] border border-[#2d5236] text-[#7de39b] text-[11px] font-mono font-bold w-fit">
          <PackageCheck className="w-3 h-3 text-[#7de39b]" />
          <span>FASILITAS RESMI</span>
        </div>
        <h2 className="text-2xl font-black text-[#f7f4ee] tracking-tight font-['Outfit'] truncate">
          {trip.mountainName}
        </h2>
        <span className="text-[11px] text-stone-400">
          Transparan • Tanpa Biaya Tersembunyi
        </span>
      </div>

      {/* Two Column / Section: Include vs Exclude */}
      <div className="my-auto flex flex-col gap-2.5">
        {/* INCLUDE CARD */}
        <div className="bg-[#17251c] border border-[#2e5538] rounded-xl p-3 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#25422d]">
            <div className="flex items-center gap-1.5 text-[#7de39b] font-bold text-xs uppercase tracking-wider font-mono">
              <div className="w-4 h-4 rounded bg-[#25482e] text-[#7de39b] flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>SUDAH TERMASUK (INCLUDE)</span>
            </div>
            <span className="text-[9px] text-[#7de39b] bg-[#112115] border border-[#25482e] px-2 py-0.5 rounded font-mono">
              Disediakan Tim
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 max-h-44 overflow-y-auto pr-1">
            {trip.includes.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#e5e0d8]">
                <div className="w-3.5 h-3.5 rounded bg-[#25482e] text-[#7de39b] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* EXCLUDE CARD */}
        <div className="bg-[#1b1917] border border-stone-700/80 rounded-xl p-3 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-stone-800">
            <div className="flex items-center gap-1.5 text-stone-300 font-bold text-xs uppercase tracking-wider font-mono">
              <div className="w-4 h-4 rounded bg-stone-800 text-stone-400 flex items-center justify-center">
                <X className="w-3 h-3 stroke-[3]" />
              </div>
              <span>TIDAK TERMASUK (EXCLUDE)</span>
            </div>
            <span className="text-[9px] text-stone-400 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded font-mono">
              Bawa Sendiri
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto pr-1">
            {trip.excludes.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-stone-400">
                <div className="w-3.5 h-3.5 rounded bg-stone-800 text-stone-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-2.5 h-2.5 stroke-[2.5]" />
                </div>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Booking Action Strip */}
      <div
        onClick={onOpenWhatsAppQr}
        className="cursor-pointer bg-[#223d29] hover:bg-[#2b4c34] text-[#f3eee5] p-2.5 rounded-xl flex items-center justify-between border border-[#3e6f4a] shadow-lg transition-colors active:scale-[0.99]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#15271b] text-[#7de39b] border border-[#2e5637] flex items-center justify-center font-bold flex-shrink-0">
            <PhoneCall className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[9px] text-stone-400 uppercase tracking-wider font-mono block">
              KONSULTASI PERLENGKAPAN:
            </span>
            <span className="text-xs font-black tracking-wide block font-mono text-[#f7f4ee]">
              WA: {waNumber}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold bg-[#172b1d] text-[#7de39b] border border-[#2f5538] px-2.5 py-1 rounded font-mono uppercase tracking-wider">
          TANYA ADMIN
        </span>
      </div>
    </motion.div>
  );
};
