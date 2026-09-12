import React from 'react';
import { MountainTrip } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Flame,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';

interface MountainTripWidgetProps {
  mountain: MountainTrip;
  theme?: 'amber' | 'emerald' | 'crimson' | 'cyber';
  layout?: 'card' | 'banner';
}

export const MountainTripWidget: React.FC<MountainTripWidgetProps> = ({
  mountain,
  theme = 'amber',
  layout = 'card'
}) => {
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const discountPercent = Math.round(
    ((mountain.normalPrice - mountain.price) / mountain.normalPrice) * 100
  );

  const themeStyles = {
    amber: {
      card: 'bg-slate-950/95 border-amber-500/80 shadow-[0_0_40px_rgba(245,158,11,0.25)]',
      price: 'text-amber-400',
      badge: 'bg-amber-500 text-slate-950',
      slotAlert: mountain.slotsAvailable <= 2 ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse' : 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      accentGlow: 'bg-amber-500/10'
    },
    emerald: {
      card: 'bg-slate-950/95 border-emerald-500/80 shadow-[0_0_40px_rgba(16,185,129,0.25)]',
      price: 'text-emerald-400',
      badge: 'bg-emerald-500 text-slate-950',
      slotAlert: mountain.slotsAvailable <= 2 ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      accentGlow: 'bg-emerald-500/10'
    },
    crimson: {
      card: 'bg-slate-950/95 border-red-500/80 shadow-[0_0_40px_rgba(239,68,68,0.25)]',
      price: 'text-yellow-400',
      badge: 'bg-red-600 text-white',
      slotAlert: 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse',
      accentGlow: 'bg-red-500/10'
    },
    cyber: {
      card: 'bg-slate-950/95 border-cyan-500/80 shadow-[0_0_40px_rgba(6,182,212,0.25)]',
      price: 'text-cyan-400',
      badge: 'bg-cyan-500 text-slate-950',
      slotAlert: mountain.slotsAvailable <= 2 ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      accentGlow: 'bg-cyan-500/10'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.amber;

  if (layout === 'banner') {
    return (
      <div className="w-full h-full flex items-center justify-center p-2 bg-transparent select-none font-['Plus_Jakarta_Sans',sans-serif]">
        <div className={`w-full rounded-2xl border-2 p-3 backdrop-blur-xl flex items-center justify-between gap-3 ${currentTheme.card}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-700">
              <img src={mountain.imageUrl} alt={mountain.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${currentTheme.badge}`}>
                  {mountain.elevation} MDPL
                </span>
                <span className="text-xs text-slate-400 truncate">{mountain.route}</span>
              </div>
              <h3 className="text-base font-black text-white truncate">{mountain.name}</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-right">
            <div>
              <span className="text-[10px] text-slate-400 line-through block">{formatIDR(mountain.normalPrice)}</span>
              <span className={`text-base font-black ${currentTheme.price}`}>{formatIDR(mountain.price)}</span>
            </div>
            <div className={`px-2.5 py-1 rounded-xl border text-xs font-black flex items-center gap-1 ${currentTheme.slotAlert}`}>
              <Users className="w-3.5 h-3.5" />
              <span>Sisa {mountain.slotsAvailable} Slot</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-3 bg-transparent select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <div className={`w-full max-w-sm rounded-3xl border-2 overflow-hidden backdrop-blur-xl flex flex-col relative shadow-2xl ${currentTheme.card}`}>
        {/* Mountain Image Header with floating tags */}
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={mountain.imageUrl}
            alt={mountain.name}
            className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Elevation Pill */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full text-xs font-black">
            <span>{mountain.elevation} MDPL</span>
          </div>

          {/* Discount Pill */}
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-full border border-yellow-300 shadow-lg">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>HEMAT {discountPercent}%</span>
            </div>
          )}

          {/* Mountain Title Bottom of Image */}
          <div className="absolute bottom-2.5 left-3.5 right-3.5">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              {mountain.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{mountain.route}</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col gap-3">
          {/* Trip schedule row */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Jadwal Trip</span>
                <strong className="text-slate-200 block truncate">{mountain.date}</strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Durasi</span>
                <strong className="text-slate-200 block truncate">{mountain.duration}</strong>
              </div>
            </div>
          </div>

          {/* Price & Slot booking row */}
          <div className="flex items-end justify-between pt-1">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 line-through">
                  {formatIDR(mountain.normalPrice)}
                </span>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                  LIVE PROMO
                </span>
              </div>
              <div className={`text-2xl font-black tracking-tight ${currentTheme.price}`}>
                {formatIDR(mountain.price)}
              </div>
            </div>

            <div className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 shadow-md ${currentTheme.slotAlert}`}>
              <Users className="w-4 h-4 shrink-0" />
              <span>Sisa {mountain.slotsAvailable} Slot</span>
            </div>
          </div>

          {/* Key tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {mountain.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-semibold bg-slate-800/90 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-lg flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
