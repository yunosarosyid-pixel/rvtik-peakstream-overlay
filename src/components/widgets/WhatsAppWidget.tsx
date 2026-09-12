import React from 'react';
import { MessageCircle, PhoneCall, ArrowRight, ShieldCheck } from 'lucide-react';

interface WhatsAppWidgetProps {
  waNumber?: string;
  adminName?: string;
  ctaText?: string;
  theme?: 'green' | 'dark' | 'gold';
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  waNumber = '6281234567890',
  adminName = 'Admin RVTik Trip',
  ctaText = 'KLIK LINK DI BIO / WA SEKARANG',
  theme = 'green'
}) => {
  // Clean phone number for display
  const formattedNumber = waNumber.startsWith('62')
    ? `+62 ${waNumber.slice(2, 5)}-${waNumber.slice(5, 9)}-${waNumber.slice(9)}`
    : waNumber;

  const themeStyles = {
    green: {
      card: 'bg-slate-950/95 border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.3)]',
      iconBox: 'bg-emerald-500 text-slate-950 shadow-emerald-500/50',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      btn: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950',
      phoneText: 'text-emerald-400'
    },
    dark: {
      card: 'bg-slate-900/95 border-slate-700 shadow-2xl',
      iconBox: 'bg-emerald-500 text-slate-950',
      badge: 'bg-slate-800 text-slate-300 border-slate-700',
      btn: 'bg-emerald-500 text-slate-950',
      phoneText: 'text-white'
    },
    gold: {
      card: 'bg-slate-950/95 border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.3)]',
      iconBox: 'bg-amber-500 text-slate-950 shadow-amber-500/50',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      btn: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950',
      phoneText: 'text-amber-400'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.green;

  return (
    <div className="w-full h-full flex items-center justify-center p-3 bg-transparent select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <div className={`w-full max-w-md rounded-2xl border-2 p-3.5 backdrop-blur-md flex items-center gap-3.5 relative overflow-hidden ${currentTheme.card}`}>
        {/* Glowing background accent */}
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Pulsing WA Icon Box */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-2xl bg-emerald-500/30 animate-ping opacity-60" />
          <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${currentTheme.iconBox}`}>
            <MessageCircle className="w-7 h-7 fill-current" />
          </div>
        </div>

        {/* Details text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border bg-emerald-500/20 text-emerald-300 border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>RESPON CEPAT</span>
            </span>
            <span className="text-[11px] text-slate-400 truncate">{adminName}</span>
          </div>

          <div className={`text-base md:text-lg font-black tracking-tight ${currentTheme.phoneText} flex items-center gap-1.5`}>
            <PhoneCall className="w-4 h-4 shrink-0 opacity-80" />
            <span className="truncate">{formattedNumber}</span>
          </div>

          <p className="text-[11px] font-bold text-slate-300 tracking-wide mt-0.5 flex items-center gap-1">
            <span>{ctaText}</span>
            <ArrowRight className="w-3 h-3 text-emerald-400 animate-pulse shrink-0" />
          </p>
        </div>
      </div>
    </div>
  );
};
