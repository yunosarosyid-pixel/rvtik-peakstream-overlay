import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mountain,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Flame,
  Sparkles,
  Compass,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { TripPackage } from '../types';

interface TripPamphletProps {
  trip: TripPackage;
  waNumber: string;
  quickStamp: string | null;
  onOpenWhatsAppQr?: () => void;
}

export const TripPamphlet: React.FC<TripPamphletProps> = ({
  trip,
  waNumber,
  quickStamp,
  onOpenWhatsAppQr,
}) => {
  const discountPercent = Math.round(
    ((trip.originalPrice - trip.promoPrice) / trip.originalPrice) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      className="relative z-10 w-full h-full flex flex-col justify-between p-3.5 pt-40 pb-12 text-[#f3eee5] overflow-hidden select-none"
    >
      {/* Background Mountain Photo with Matte Dark Shading */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-[#121110]">
        <motion.img
          key={trip.imageUrl}
          src={trip.imageUrl}
          alt={trip.mountainName}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 7, ease: 'easeOut' }}
          className="w-full h-full object-cover opacity-60"
        />
        {/* Layered dark atmospheric scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0c] via-[#121110]/90 to-[#121110]/75" />
      </div>

      {/* Top Left Expedition Metadata Tag (Leaves space for camera on the right) */}
      <div className="flex flex-col gap-1.5 max-w-[60%]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#1e3324] border border-[#2d5236] text-[#7de39b] text-[11px] font-mono font-bold uppercase tracking-wider">
            <Mountain className="w-3 h-3" />
            {trip.elevationMdpl} MDPL
          </span>
          {trip.badgeTag && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#3d2714] border border-[#78461b] text-[#f8a855] text-[10px] font-bold uppercase tracking-wider">
              {trip.badgeTag}
            </span>
          )}
        </div>

        <div className="inline-flex items-center gap-1.5 text-[11px] text-stone-300 bg-[#1c1a17]/90 border border-stone-700/70 px-2.5 py-1 rounded w-fit">
          <MapPin className="w-3 h-3 text-[#f8a855]" />
          <span className="font-medium truncate">{trip.route}</span>
        </div>
      </div>

      {/* Center Main Pamphlet Body */}
      <div className="my-auto flex flex-col gap-2.5">
        {/* Mountain Heading */}
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#7de39b] uppercase font-mono mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7de39b]" />
            PAKET OPEN TRIP RESMI
          </div>
          <h1 className="text-3xl font-black text-[#f7f4ee] tracking-tight leading-none font-['Outfit']">
            {trip.mountainName}
          </h1>
          <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
            {trip.subtitle}
          </p>
        </div>

        {/* Schedule & Duration Specs Card */}
        <div className="grid grid-cols-2 gap-2 bg-[#191715]/95 border border-stone-700/80 rounded-xl p-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#25221e] border border-stone-700 flex items-center justify-center text-[#7de39b] flex-shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] text-stone-400 block uppercase font-mono tracking-wider">
                Tanggal Trip
              </span>
              <span className="text-xs font-bold text-[#f5f1ea] block truncate">
                {trip.tripDates}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#25221e] border border-stone-700 flex items-center justify-center text-[#f8a855] flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] text-stone-400 block uppercase font-mono tracking-wider">
                Durasi
              </span>
              <span className="text-xs font-bold text-[#f5f1ea] block truncate">
                {trip.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Highlights Checklist */}
        <div className="bg-[#171513]/90 border border-stone-800 rounded-xl p-2.5">
          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-1.5 font-mono">
            HIGHLIGHT PERJALANAN:
          </span>
          <div className="grid grid-cols-1 gap-1">
            {trip.highlights.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7de39b] flex-shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Price & Slot Banner */}
        <div className="bg-[#18231c] border-2 border-[#376943] rounded-xl p-3 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-stone-400 line-through font-mono">
                Rp {trip.originalPrice.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] bg-[#992222] text-[#f7f4ee] font-black px-1.5 py-0.2 rounded font-mono">
                HEMAT {discountPercent}%
              </span>
            </div>

            {/* Urgency Badge */}
            <div className="flex items-center gap-1 text-[10px] font-black text-[#f8a855] bg-[#3a2010] border border-[#78461b] px-2 py-0.5 rounded">
              <Flame className="w-3 h-3 text-[#f8a855]" />
              <span>SISA {trip.availableSlots} DARI {trip.totalSlots} SLOT</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-[#66e088] font-['Outfit'] tracking-tight">
                Rp {trip.promoPrice.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-stone-400 font-normal ml-1">/ peserta</span>
            </div>

            <span className="text-[10px] text-[#7de39b] font-mono bg-[#14291a] px-2 py-1 rounded border border-[#2d5236]">
              All-In Simaksi & Porter
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Booking Action Strip (Rugged Tactical Bar) */}
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
              DAFTAR VIA WHATSAPP RESMI:
            </span>
            <span className="text-xs font-black tracking-wide block font-mono text-[#f7f4ee]">
              {waNumber}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold bg-[#172b1d] text-[#7de39b] border border-[#2f5538] px-2.5 py-1 rounded font-mono uppercase tracking-wider">
          SCAN QR WA
        </span>
      </div>

      {/* Quick Stamp Graphic Overlay */}
      <AnimatePresence>
        {quickStamp && (
          <motion.div
            initial={{ scale: 2.2, rotate: -22, opacity: 0 }}
            animate={{ scale: 1, rotate: -12, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40"
          >
            <div className="border-4 border-[#c53030] bg-[#991b1b]/95 text-[#fcf9f2] font-black text-2xl px-5 py-2 rounded-xl shadow-2xl tracking-widest uppercase font-['Outfit'] border-dashed">
              {quickStamp}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
