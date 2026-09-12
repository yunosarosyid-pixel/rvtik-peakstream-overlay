import React from 'react';
import { StampType } from '../../types';
import { Flame, Sparkles, AlertCircle, Clock, Gift, Award, Zap } from 'lucide-react';

interface PromoBadgeWidgetProps {
  type?: StampType;
  customText?: string;
  size?: 'normal' | 'large';
  animation?: 'bounce' | 'pulse' | 'none';
}

export const PromoBadgeWidget: React.FC<PromoBadgeWidgetProps> = ({
  type = 'FLASH_SALE',
  customText,
  size = 'normal',
  animation = 'bounce'
}) => {
  let label = customText || '';
  let subLabel = 'PROMO BERLAKU SAAT LIVE';
  let badgeStyle = 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-yellow-300 ring-red-500/40 shadow-red-500/40';
  let Icon = Flame;

  switch (type) {
    case 'FLASH_SALE':
      label = customText || '⚡ FLASH SALE LIVE ⚡';
      subLabel = 'HARGA SPESIAL HARI INI';
      badgeStyle = 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border-yellow-300 ring-4 ring-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.5)]';
      Icon = Zap;
      break;
    case 'SISA_2_SLOT':
      label = customText || '🚨 SISA 2 SLOT TERAKHIR!';
      subLabel = 'SIAPA CEPAT DIA DAPAT';
      badgeStyle = 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 border-white ring-4 ring-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.5)]';
      Icon = AlertCircle;
      break;
    case 'BEST_SELLER':
      label = customText || '⭐ TRIP BEST SELLER ⭐';
      subLabel = 'PILIHAN FAVORIT PENDAKI';
      badgeStyle = 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white border-indigo-300 ring-4 ring-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.5)]';
      Icon = Award;
      break;
    case 'HARGA_EARLY_BIRD':
      label = customText || '🎟️ HARGA EARLY BIRD';
      subLabel = 'BOOKING AWAL LEBIH HEMAT';
      badgeStyle = 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white border-emerald-300 ring-4 ring-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.5)]';
      Icon = Sparkles;
      break;
    case 'KUOTA_HAMPIR_HABIS':
      label = customText || '🔥 KUOTA HAMPIR HABIS';
      subLabel = 'SLOT TINGGAL SEDIKIT';
      badgeStyle = 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white border-orange-300 ring-4 ring-orange-500/50 shadow-[0_0_30px_rgba(234,88,12,0.5)]';
      Icon = Clock;
      break;
    case 'PROMO_LIVE_HARI_INI':
      label = customText || '🎁 SPESIAL LIVE TIKTOK';
      subLabel = 'BONUS TAMBAHAN LIVE';
      badgeStyle = 'bg-gradient-to-r from-pink-600 via-rose-500 to-pink-700 text-white border-pink-300 ring-4 ring-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.5)]';
      Icon = Gift;
      break;
    case 'GRATIS_BUFF_STIKER':
      label = customText || '👕 FREE BUFF & STIKER';
      subLabel = 'SETIAP PENDAFTAR LIVE';
      badgeStyle = 'bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 text-white border-cyan-300 ring-4 ring-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.5)]';
      Icon = Gift;
      break;
    default:
      label = customText || '🔥 PROMO KHUSUS';
  }

  let animClass = '';
  if (animation === 'bounce') animClass = 'animate-bounce';
  else if (animation === 'pulse') animClass = 'animate-pulse';

  const isLarge = size === 'large';

  return (
    <div className="w-full h-full flex items-center justify-center p-3 bg-transparent select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <div
        className={`transform -rotate-2 rounded-2xl border-2 px-5 py-3.5 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden backdrop-blur-md ${badgeStyle} ${animClass}`}
      >
        <div className="flex items-center gap-2">
          <Icon className={`${isLarge ? 'w-6 h-6' : 'w-5 h-5'} shrink-0`} />
          <span className={`${isLarge ? 'text-lg md:text-xl' : 'text-sm md:text-base'} font-black tracking-wider uppercase drop-shadow`}>
            {label}
          </span>
        </div>
        <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest opacity-90 mt-0.5">
          {subLabel}
        </span>
      </div>
    </div>
  );
};
