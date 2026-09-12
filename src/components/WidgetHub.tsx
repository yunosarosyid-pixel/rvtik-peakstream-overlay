import React, { useState } from 'react';
import { MountainTrip, StampType } from '../types';
import {
  Copy,
  Check,
  ExternalLink,
  Sliders,
  Sparkles,
  Layers,
  MessageCircle,
  Flame,
  FileText,
  Volume2,
  Maximize2,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  QrCode,
  Tag
} from 'lucide-react';
import { RunningTextWidget } from './widgets/RunningTextWidget';
import { WhatsAppWidget } from './widgets/WhatsAppWidget';
import { PromoBadgeWidget } from './widgets/PromoBadgeWidget';
import { FacilitiesWidget } from './widgets/FacilitiesWidget';
import { MountainTripWidget } from './widgets/MountainTripWidget';
import { QRCodeWidget } from './widgets/QRCodeWidget';

interface WidgetHubProps {
  mountains: MountainTrip[];
  whatsappNumber: string;
  onOpenMountainManager?: () => void;
  onOpenFullOBSGuide?: () => void;
}

export const WidgetHub: React.FC<WidgetHubProps> = ({
  mountains,
  whatsappNumber,
  onOpenMountainManager,
  onOpenFullOBSGuide
}) => {
  const [selectedMountainId, setSelectedMountainId] = useState<string>(mountains[0]?.id || 'rinjani');
  const [selectedStamp, setSelectedStamp] = useState<StampType>('FLASH_SALE');
  const [runningTextCustom, setRunningTextCustom] = useState(
    '🔥 PROMO SPESIAL LIVE STREAM: BOOKING SEKARANG DAPAT DISKON SPESIAL & FREE BUFF/MERCHANDISE! TANYA JALUR LANGSUNG DI CHAT! 🔥'
  );
  const [runningSpeed, setRunningSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [runningTheme, setRunningTheme] = useState<'amber' | 'emerald' | 'crimson' | 'cyber'>('amber');
  const [tripTheme, setTripTheme] = useState<'amber' | 'emerald' | 'crimson' | 'cyber'>('amber');
  const [tripLayout, setTripLayout] = useState<'card' | 'banner'>('card');
  const [facilitiesTheme, setFacilitiesTheme] = useState<'amber' | 'emerald' | 'dark'>('amber');
  const [waTheme, setWaTheme] = useState<'green' | 'gold' | 'dark'>('green');
  const [waAdminName, setWaAdminName] = useState('Admin RVTik Adventure');

  // Copy notification state per widget id
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedMountain =
    mountains.find(m => m.id === selectedMountainId) || mountains[0];

  // Base URL
  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}${window.location.pathname}`
    : '';

  // Generator links
  const getWidgetUrl = (widgetType: string, params: Record<string, string>) => {
    const searchParams = new URLSearchParams({ widget: widgetType, ...params });
    return `${baseUrl}?${searchParams.toString()}`;
  };

  const handleCopy = (key: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  // Preset links list
  const runningTextUrl = getWidgetUrl('running-text', {
    text: runningTextCustom,
    speed: runningSpeed,
    theme: runningTheme
  });

  const whatsappUrl = getWidgetUrl('whatsapp', {
    wa: whatsappNumber,
    admin: waAdminName,
    theme: waTheme
  });

  const promoBadgeUrl = getWidgetUrl('promo-badge', {
    type: selectedStamp,
    animation: 'bounce'
  });

  const tripCardUrl = getWidgetUrl('trip-card', {
    mountain: selectedMountain?.id || 'rinjani',
    theme: tripTheme,
    layout: tripLayout
  });

  const facilitiesUrl = getWidgetUrl('facilities', {
    mountain: selectedMountain?.id || 'rinjani',
    theme: facilitiesTheme
  });

  const qrCodeUrl = getWidgetUrl('qr-code', {
    wa: whatsappNumber,
    mountain: selectedMountain?.name || 'Open Trip'
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-['Plus_Jakarta_Sans',sans-serif] text-white">
      {/* Top Banner Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/50 p-6 md:p-8 shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-500 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                SISTEM MODULAR OBS 100% BEBAS MACET
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                Transparan Bawaan (Alpha)
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              Pusat Link Widget OBS (Koleksi Siap Copas)
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-1.5 max-w-3xl leading-relaxed">
              Cukup <strong>salin link masing-masing modul</strong> di bawah dan tempelkan ke <strong>Browser Source OBS Studio</strong> Anda. Setiap elemen bisa Anda letakkan, geser, atau sembunyikan secara bebas tanpa khawatir macet atau terpotong!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onOpenFullOBSGuide && (
              <button
                onClick={onOpenFullOBSGuide}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs md:text-sm font-bold border border-slate-700 flex items-center gap-1.5 transition"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Panduan Pasang OBS</span>
              </button>
            )}
            {onOpenMountainManager && (
              <button
                onClick={onOpenMountainManager}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs md:text-sm font-black flex items-center gap-1.5 shadow-lg transition"
              >
                <Sliders className="w-4 h-4" />
                <span>Kelola Data Trip ({mountains.length} Gunung)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Mountain Selector Pill Bar */}
      <div className="mb-8 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-sm font-bold text-slate-200">
              Pilih Gunung yang Sedang Dibahas di Siaran:
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Gunung terpilih: <strong className="text-amber-400">{selectedMountain?.name} ({selectedMountain?.elevation} MDPL)</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {mountains.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMountainId(m.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-1.5 border ${
                selectedMountainId === m.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <span>{m.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedMountainId === m.id ? 'bg-slate-950 text-amber-300' : 'bg-slate-700 text-slate-300'
              }`}>
                {m.elevation}M
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Modular Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ========================================================================= */}
        {/* WIDGET 1: RUNNING TEXT MARQUEE                                            */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-slate-900/80 border-2 border-slate-800 hover:border-amber-500/60 p-5 flex flex-col justify-between gap-4 transition shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">1. Running Text (Teks Berjalan)</h3>
                  <p className="text-xs text-slate-400">Teks berjalan animasi halus di bagian bawah/atas OBS</p>
                </div>
              </div>
              <span className="text-[11px] font-mono bg-slate-800 text-amber-300 px-2.5 py-1 rounded-lg border border-slate-700">
                1080 × 80 px
              </span>
            </div>

            {/* Customizer controls */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Isi Teks Berjalan:
                </label>
                <input
                  type="text"
                  value={runningTextCustom}
                  onChange={e => setRunningTextCustom(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  placeholder="Ketik pengumuman promo live..."
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Kecepatan:</label>
                  <select
                    value={runningSpeed}
                    onChange={e => setRunningSpeed(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="slow">Lambat (Slow)</option>
                    <option value="normal">Sedang (Normal)</option>
                    <option value="fast">Cepat (Fast)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Tema Warna:</label>
                  <select
                    value={runningTheme}
                    onChange={e => setRunningTheme(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="amber">Amber Gold</option>
                    <option value="emerald">Emerald Green</option>
                    <option value="crimson">Crimson Red</option>
                    <option value="cyber">Cyber Cyan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="rounded-2xl bg-slate-950/60 p-2 border border-slate-800/80 mb-4 overflow-hidden">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block px-2 pb-1">
                Pratinjau Hasil di OBS:
              </span>
              <RunningTextWidget
                text={runningTextCustom}
                speed={runningSpeed}
                theme={runningTheme}
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={() => handleCopy('running-text', runningTextUrl)}
              className={`w-full sm:w-auto flex-1 px-4 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition ${
                copiedKey === 'running-text'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg'
              }`}
            >
              {copiedKey === 'running-text' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'running-text' ? 'Berhasil Dicopas!' : 'Salin Link Browser Source'}</span>
            </button>
            <a
              href={runningTextUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
              title="Buka Pratinjau di Tab Baru"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* WIDGET 2: NOMOR WHATSAPP & BOOKING BADGE                                  */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-slate-900/80 border-2 border-slate-800 hover:border-emerald-500/60 p-5 flex flex-col justify-between gap-4 transition shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">2. Nomor WhatsApp Booking</h3>
                  <p className="text-xs text-slate-400">Tombol CTA interaktif dengan animasi denyut &amp; nomor resmi</p>
                </div>
              </div>
              <span className="text-[11px] font-mono bg-slate-800 text-emerald-300 px-2.5 py-1 rounded-lg border border-slate-700">
                450 × 120 px
              </span>
            </div>

            {/* Customizer controls */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div>
                <label className="font-bold text-slate-400 block mb-1">Nama Admin:</label>
                <input
                  type="text"
                  value={waAdminName}
                  onChange={e => setWaAdminName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-400 block mb-1">Tema Gaya:</label>
                <select
                  value={waTheme}
                  onChange={e => setWaTheme(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="green">Emerald WhatsApp</option>
                  <option value="gold">Gold Luxury</option>
                  <option value="dark">Stealth Dark</option>
                </select>
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="rounded-2xl bg-slate-950/60 p-2 border border-slate-800/80 mb-4 overflow-hidden">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block px-2 pb-1">
                Pratinjau Hasil di OBS:
              </span>
              <WhatsAppWidget
                waNumber={whatsappNumber}
                adminName={waAdminName}
                theme={waTheme}
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={() => handleCopy('whatsapp', whatsappUrl)}
              className={`w-full sm:w-auto flex-1 px-4 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition ${
                copiedKey === 'whatsapp'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg'
              }`}
            >
              {copiedKey === 'whatsapp' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'whatsapp' ? 'Berhasil Dicopas!' : 'Salin Link WhatsApp OBS'}</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
              title="Buka Pratinjau di Tab Baru"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* WIDGET 3: STEMPEL PROMO INSTAN (BADGE ANIMASI)                            */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-slate-900/80 border-2 border-slate-800 hover:border-red-500/60 p-5 flex flex-col justify-between gap-4 transition shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">3. Stempel Promo Instan (Badge)</h3>
                  <p className="text-xs text-slate-400">Badge promosi dinamis bergerak untuk memicu urgensi penonton</p>
                </div>
              </div>
              <span className="text-[11px] font-mono bg-slate-800 text-red-300 px-2.5 py-1 rounded-lg border border-slate-700">
                360 × 120 px
              </span>
            </div>

            {/* Customizer controls */}
            <div className="space-y-3 mb-4">
              <label className="text-xs font-bold text-slate-400 block">
                Pilih Jenis Stempel Promo:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'FLASH_SALE', name: '⚡ FLASH SALE' },
                  { id: 'SISA_2_SLOT', name: '🚨 SISA 2 SLOT' },
                  { id: 'BEST_SELLER', name: '⭐ BEST SELLER' },
                  { id: 'HARGA_EARLY_BIRD', name: '🎟️ EARLY BIRD' },
                  { id: 'KUOTA_HAMPIR_HABIS', name: '🔥 KUOTA HABIS' },
                  { id: 'GRATIS_BUFF_STIKER', name: '👕 FREE MERCH' }
                ].map(stamp => (
                  <button
                    key={stamp.id}
                    onClick={() => setSelectedStamp(stamp.id as StampType)}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold text-left transition border ${
                      selectedStamp === stamp.id
                        ? 'bg-red-600 text-white border-yellow-300 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {stamp.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="rounded-2xl bg-slate-950/60 p-2 border border-slate-800/80 mb-4 overflow-hidden">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block px-2 pb-1">
                Pratinjau Hasil di OBS:
              </span>
              <PromoBadgeWidget type={selectedStamp} />
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={() => handleCopy('promo-badge', promoBadgeUrl)}
              className={`w-full sm:w-auto flex-1 px-4 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition ${
                copiedKey === 'promo-badge'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg'
              }`}
            >
              {copiedKey === 'promo-badge' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'promo-badge' ? 'Berhasil Dicopas!' : 'Salin Link Stempel Promo'}</span>
            </button>
            <a
              href={promoBadgeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
              title="Buka Pratinjau di Tab Baru"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* WIDGET 4: PAMFLET TRIP PER GUNUNG                                         */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-slate-900/80 border-2 border-slate-800 hover:border-amber-500/60 p-5 flex flex-col justify-between gap-4 transition shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">4. Pamflet Trip Aktif (Per Gunung)</h3>
                  <p className="text-xs text-slate-400">Poster info harga, tanggal, MDPL, dan kuota tersisa</p>
                </div>
              </div>
              <span className="text-[11px] font-mono bg-slate-800 text-amber-300 px-2.5 py-1 rounded-lg border border-slate-700">
                {tripLayout === 'card' ? '420 × 580 px' : '1080 × 120 px'}
              </span>
            </div>

            {/* Customizer controls */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div>
                <label className="font-bold text-slate-400 block mb-1">Bentuk Layout:</label>
                <select
                  value={tripLayout}
                  onChange={e => setTripLayout(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="card">Poster Vertikal (Card)</option>
                  <option value="banner">Bar Horisontal (Banner Bawah)</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-400 block mb-1">Tema Warna:</label>
                <select
                  value={tripTheme}
                  onChange={e => setTripTheme(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="amber">Amber Gold</option>
                  <option value="emerald">Emerald Nature</option>
                  <option value="crimson">Crimson Sale</option>
                  <option value="cyber">Cyber Blue</option>
                </select>
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="rounded-2xl bg-slate-950/60 p-2 border border-slate-800/80 mb-4 overflow-hidden">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block px-2 pb-1">
                Pratinjau untuk: <strong className="text-amber-400">{selectedMountain?.name}</strong>
              </span>
              <MountainTripWidget
                mountain={selectedMountain}
                theme={tripTheme}
                layout={tripLayout}
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={() => handleCopy('trip-card', tripCardUrl)}
              className={`w-full sm:w-auto flex-1 px-4 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition ${
                copiedKey === 'trip-card'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg'
              }`}
            >
              {copiedKey === 'trip-card' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'trip-card' ? 'Berhasil Dicopas!' : `Salin Link ${selectedMountain?.name}`}</span>
            </button>
            <a
              href={tripCardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
              title="Buka Pratinjau di Tab Baru"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* WIDGET 5: FASILITAS INCLUDE VS EXCLUDE (TAMBAHAN ANDA)                    */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-slate-900/80 border-2 border-slate-800 hover:border-emerald-500/60 p-5 flex flex-col justify-between gap-4 transition shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">5. Fasilitas Include &amp; Exclude</h3>
                  <p className="text-xs text-slate-400">Tabel elegan komparasi apa saja yang didapat &amp; tidak didapat peserta</p>
                </div>
              </div>
              <span className="text-[11px] font-mono bg-slate-800 text-emerald-300 px-2.5 py-1 rounded-lg border border-slate-700">
                560 × 440 px
              </span>
            </div>

            {/* Customizer controls */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div>
                <label className="font-bold text-slate-400 block mb-1">Tema Tampilan:</label>
                <select
                  value={facilitiesTheme}
                  onChange={e => setFacilitiesTheme(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="amber">Amber Gold</option>
                  <option value="emerald">Emerald Eco</option>
                  <option value="dark">Slate Neutral</option>
                </select>
              </div>
              <div className="flex items-end">
                <span className="text-[11px] text-slate-400 pb-1.5">
                  Termasuk: <strong className="text-emerald-400">{selectedMountain.includes.length} poin</strong> • Exclude: <strong className="text-rose-400">{selectedMountain.excludes.length} poin</strong>
                </span>
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="rounded-2xl bg-slate-950/60 p-2 border border-slate-800/80 mb-4 overflow-hidden">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block px-2 pb-1">
                Pratinjau Fasilitas: <strong className="text-emerald-400">{selectedMountain?.name}</strong>
              </span>
              <FacilitiesWidget
                mountain={selectedMountain}
                theme={facilitiesTheme}
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={() => handleCopy('facilities', facilitiesUrl)}
              className={`w-full sm:w-auto flex-1 px-4 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition ${
                copiedKey === 'facilities'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg'
              }`}
            >
              {copiedKey === 'facilities' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'facilities' ? 'Berhasil Dicopas!' : `Salin Link Fasilitas ${selectedMountain?.name}`}</span>
            </button>
            <a
              href={facilitiesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
              title="Buka Pratinjau di Tab Baru"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* WIDGET 6: QR CODE SCAN BOOKING PASS                                       */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-slate-900/80 border-2 border-slate-800 hover:border-cyan-500/60 p-5 flex flex-col justify-between gap-4 transition shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">6. QR Code WhatsApp Booking Pass</h3>
                  <p className="text-xs text-slate-400">QR Code yang bisa di-scan penonton langsung untuk chat admin</p>
                </div>
              </div>
              <span className="text-[11px] font-mono bg-slate-800 text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-700">
                300 × 340 px
              </span>
            </div>

            {/* Live Preview Box */}
            <div className="rounded-2xl bg-slate-950/60 p-2 border border-slate-800/80 mb-4 overflow-hidden flex justify-center">
              <QRCodeWidget
                waNumber={whatsappNumber}
                mountainName={selectedMountain?.name}
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={() => handleCopy('qr-code', qrCodeUrl)}
              className={`w-full sm:w-auto flex-1 px-4 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition ${
                copiedKey === 'qr-code'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg'
              }`}
            >
              {copiedKey === 'qr-code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'qr-code' ? 'Berhasil Dicopas!' : 'Salin Link QR Code OBS'}</span>
            </button>
            <a
              href={qrCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
              title="Buka Pratinjau di Tab Baru"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Quick OBS Guide Card at Bottom */}
      <div className="mt-8 rounded-2xl bg-slate-900 border border-slate-800 p-5">
        <h4 className="text-sm font-black text-amber-400 flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4" />
          Cara Menempelkan Link ke OBS Studio (Hanya 3 Langkah Cepat):
        </h4>
        <ol className="text-xs text-slate-300 space-y-1.5 list-decimal pl-5 leading-relaxed">
          <li>Di OBS Studio pada kotak <strong>Sources</strong>, klik tombol <strong>+</strong> lalu pilih <strong>Browser</strong>.</li>
          <li>Tempelkan (*Paste*) link yang Anda salin dari tombol di atas ke kolom <strong>URL</strong>.</li>
          <li>Masukkan ukuran <strong>Width &amp; Height</strong> sesuai rekomendasi kotak abu-abu di atas (misal: 1080 × 80 untuk Running Text). Selesai! Elemen tersebut akan muncul transparan dan bisa Anda geser ke mana saja!</li>
        </ol>
      </div>
    </div>
  );
};
