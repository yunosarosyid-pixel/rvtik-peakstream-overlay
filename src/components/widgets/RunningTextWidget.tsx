import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';

interface RunningTextWidgetProps {
  text?: string;
  speed?: 'slow' | 'normal' | 'fast';
  theme?: 'amber' | 'emerald' | 'crimson' | 'cyber';
  prefix?: string;
}

export const RunningTextWidget: React.FC<RunningTextWidgetProps> = ({
  text,
  speed = 'normal',
  theme = 'amber',
  prefix = '🔥 INFO LIVE'
}) => {
  const content = text || '🔥 PROMO LIVE HARI INI: DAPATKAN DISKON SPESIAL & FREE MERCHANDISE RESMI UNTUK SETIAP BOOKING TRIP! HUBUNGI ADMIN SEKARANG! 🏔️ JAMINAN TIKET SIMAKSI RESMI & FASILITAS TENDA LENGKAP!';

  // Speed duration mapping
  let animationDuration = '22s';
  if (speed === 'slow') animationDuration = '35s';
  if (speed === 'fast') animationDuration = '12s';

  // Theme styling
  const themeMap = {
    amber: {
      bar: 'bg-slate-950/95 border-amber-500 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.3)]',
      badge: 'bg-amber-400 text-slate-950',
      sparkle: 'text-amber-400'
    },
    emerald: {
      bar: 'bg-slate-950/95 border-emerald-500 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.3)]',
      badge: 'bg-emerald-400 text-slate-950',
      sparkle: 'text-emerald-400'
    },
    crimson: {
      bar: 'bg-slate-950/95 border-red-500 text-red-300 shadow-[0_0_25px_rgba(239,68,68,0.3)]',
      badge: 'bg-red-600 text-white',
      sparkle: 'text-yellow-300'
    },
    cyber: {
      bar: 'bg-slate-950/95 border-cyan-500 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)]',
      badge: 'bg-cyan-400 text-slate-950',
      sparkle: 'text-cyan-300'
    }
  };

  const currentTheme = themeMap[theme] || themeMap.amber;

  return (
    <div className="w-full flex items-center justify-center p-1 bg-transparent select-none overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1 Single Horizontal Row with fixed height (50px) */}
      <div className={`w-full h-12 flex items-center rounded-2xl border-2 backdrop-blur-md overflow-hidden relative ${currentTheme.bar}`}>
        
        {/* Fixed Left Badge: INFO LIVE */}
        <div className={`z-10 shrink-0 h-full px-4 flex items-center gap-2 font-black text-xs md:text-sm tracking-wider uppercase shadow-lg ${currentTheme.badge}`}>
          <Volume2 className="w-4 h-4 shrink-0 animate-pulse" />
          <span className="whitespace-nowrap">{prefix}</span>
        </div>

        {/* 1-Line Seamless Scrolling Marquee Channel */}
        <div className="relative flex-1 h-full overflow-hidden flex items-center">
          <div
            className="flex items-center whitespace-nowrap will-change-transform"
            style={{
              animation: `marquee ${animationDuration} linear infinite`,
            }}
          >
            {/* Block 1 */}
            <div className="flex items-center gap-6 px-4 text-xs md:text-sm font-black whitespace-nowrap">
              <span className="flex items-center gap-2">
                <Sparkles className={`w-3.5 h-3.5 ${currentTheme.sparkle} shrink-0`} />
                <span>{content}</span>
              </span>
              <span className="text-slate-600 font-bold">•</span>
            </div>

            {/* Block 2 (Identical for continuous infinite loop without gap) */}
            <div className="flex items-center gap-6 px-4 text-xs md:text-sm font-black whitespace-nowrap">
              <span className="flex items-center gap-2">
                <Sparkles className={`w-3.5 h-3.5 ${currentTheme.sparkle} shrink-0`} />
                <span>{content}</span>
              </span>
              <span className="text-slate-600 font-bold">•</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
