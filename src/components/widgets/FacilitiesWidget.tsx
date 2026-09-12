import React from 'react';
import { MountainTrip } from '../../types';
import {
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Flame,
  Award
} from 'lucide-react';

interface FacilitiesWidgetProps {
  mountain: MountainTrip;
  theme?: 'amber' | 'emerald' | 'dark';
}

export const FacilitiesWidget: React.FC<FacilitiesWidgetProps> = ({
  mountain,
  theme = 'amber'
}) => {
  const themeMap = {
    amber: {
      card: 'bg-slate-950/95 border-amber-500/80 shadow-[0_0_35px_rgba(245,158,11,0.25)]',
      headerBadge: 'bg-amber-500 text-slate-950 font-black',
      includeBorder: 'border-emerald-500/30 bg-emerald-950/20',
      excludeBorder: 'border-rose-500/30 bg-rose-950/20',
    },
    emerald: {
      card: 'bg-slate-950/95 border-emerald-500/80 shadow-[0_0_35px_rgba(16,185,129,0.25)]',
      headerBadge: 'bg-emerald-500 text-slate-950 font-black',
      includeBorder: 'border-emerald-500/30 bg-emerald-950/20',
      excludeBorder: 'border-rose-500/30 bg-rose-950/20',
    },
    dark: {
      card: 'bg-slate-900/95 border-slate-700 shadow-2xl',
      headerBadge: 'bg-slate-800 text-white font-black',
      includeBorder: 'border-slate-800 bg-slate-950/40',
      excludeBorder: 'border-slate-800 bg-slate-950/40',
    }
  };

  const currentTheme = themeMap[theme] || themeMap.amber;

  return (
    <div className="w-full h-full flex items-center justify-center p-3 bg-transparent select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <div className={`w-full max-w-xl rounded-3xl border-2 p-5 backdrop-blur-xl flex flex-col gap-4 relative overflow-hidden ${currentTheme.card}`}>
        {/* Top Header: Mountain info & title */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full ${currentTheme.headerBadge}`}>
                  FASILITAS RESMI TRIP
                </span>
                <span className="text-xs text-slate-400 font-bold">{mountain.elevation} MDPL</span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-white tracking-tight">
                {mountain.name}
              </h2>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Jalur Pendakian</span>
            <span className="text-xs md:text-sm font-bold text-amber-300">{mountain.route}</span>
          </div>
        </div>

        {/* 2-Column Grid: INCLUDE vs EXCLUDE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* INCLUDE COLUMN */}
          <div className={`rounded-2xl p-3.5 border ${currentTheme.includeBorder} flex flex-col gap-2`}>
            <div className="flex items-center justify-between pb-1.5 border-b border-emerald-500/20">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="text-xs font-black tracking-wider uppercase">Fasilitas Termasuk</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                INCLUDE
              </span>
            </div>

            <ul className="space-y-1.5 pt-1">
              {mountain.includes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-200 leading-snug">
                  <span className="text-emerald-400 mt-0.5 font-black text-sm">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* EXCLUDE COLUMN */}
          <div className={`rounded-2xl p-3.5 border ${currentTheme.excludeBorder} flex flex-col gap-2`}>
            <div className="flex items-center justify-between pb-1.5 border-b border-rose-500/20">
              <div className="flex items-center gap-1.5 text-rose-400">
                <XCircle className="w-4 h-4 shrink-0" />
                <span className="text-xs font-black tracking-wider uppercase">Tidak Termasuk</span>
              </div>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold">
                EXCLUDE
              </span>
            </div>

            <ul className="space-y-1.5 pt-1">
              {mountain.excludes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-300 leading-snug">
                  <span className="text-rose-400 mt-0.5 font-black text-sm">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Guarantee notice */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Tenda Bersih &amp; Guide APGI Berlisensi</span>
          </div>
          <span className="font-semibold text-slate-400">Tingkat: <strong className="text-white">{mountain.level}</strong></span>
        </div>
      </div>
    </div>
  );
};
