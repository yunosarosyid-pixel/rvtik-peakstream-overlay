/**
 * OBS OPEN TRIP OVERLAY & ADMIN HUB
 * TikTok LIVE Streamer Portal & Vertical 9:16 Stream Simulator
 */

import { useState, useEffect } from 'react';
import {
  Tv,
  Layers,
  Sliders,
  Database,
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Flame,
  QrCode,
  Smartphone,
  Plus,
  Minus,
  Sparkles,
  RefreshCw,
  Mountain,
  Calendar,
  Share2
} from 'lucide-react';

interface TripItem {
  id: string;
  name: string;
  mdpl: number;
  date_range: string;
  duration: string;
  price: string;
  slot_remaining: number;
  slot_total: number;
  image_url: string;
  badge_text: string;
  order_index: number;
  is_active: boolean;
  via?: string;
  slogan?: string;
  meeting_point?: string;
  mountain_info?: string;
  brand_handle?: string;
}

interface StreamSettings {
  running_text: string;
  active_trip_index: number;
  auto_slide: boolean;
  slide_interval_seconds: number;
  wa_number: string;
  cta_headline: string;
  cta_subtext: string;
  qris_image_url?: string;
  theme_preset?: string;
  animation_style?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'routes' | 'sql' | 'guide'>('simulator');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [bgMode, setBgMode] = useState<'mountain' | 'dark' | 'grid'>('mountain');
  
  // Real-time state connected with window.OpenTripSync
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [settings, setSettings] = useState<Partial<StreamSettings>>({
    running_text: '🔥 PROMO LIVE STREAMING OPEN TRIP SPESIAL TIKTOK LIVE! DISKON DP 50% HANYA SAAT LIVE BERLANGSUNG • HUBUNGI WHATSAPP DI BIO • SISA KUOTA TERBATAS SIAPA CEPAT DIA DAPAT!',
    wa_number: '081234567890 / 081234567890',
    cta_headline: 'BOOKING OPEN TRIP',
    cta_subtext: 'Hubungi WhatsApp untuk reservasi kuota',
    auto_slide: true,
    slide_interval_seconds: 8,
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [connStatus, setConnStatus] = useState<'local' | 'supabase' | 'server'>('server');

  useEffect(() => {
    // Check if OpenTripSync is loaded via /app.js
    const sync = (window as any).OpenTripSync;
    if (sync) {
      sync.init();
      sync.onTripsChange((newTrips: TripItem[]) => setTrips(newTrips));
      sync.onSettingsChange((newSettings: StreamSettings) => setSettings(newSettings));
      sync.onSlideChange((idx: number) => setCurrentSlide(idx));
      sync.onConnectionChange((status: { mode: 'local' | 'supabase' | 'server' }) => {
        setConnStatus(status.mode);
      });
    }
  }, []);

  const activeTrip = trips[currentSlide] || trips[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAdjustSlot = (delta: number) => {
    if (!activeTrip) return;
    const sync = (window as any).OpenTripSync;
    if (sync) {
      sync.adjustSlot(activeTrip.id, delta);
    }
  };

  const handleNextSlide = () => {
    const sync = (window as any).OpenTripSync;
    if (sync) sync.nextSlide();
  };

  const handlePrevSlide = () => {
    const sync = (window as any).OpenTripSync;
    if (sync) sync.prevSlide();
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const overlayRoutes = [
    {
      id: 'card',
      title: 'Overlay Card Open Trip',
      fileName: 'card.html',
      url: `${baseUrl}/card.html`,
      width: 440,
      height: 580,
      desc: 'Carousel interaktif menampilkan destinasi, MDPL, tanggal, durasi, harga, dan badge sisa slot kuota.',
      badge: 'Utama'
    },
    {
      id: 'running-text',
      title: 'Overlay Running Text',
      fileName: 'running-text.html',
      url: `${baseUrl}/running-text.html`,
      width: 1080,
      height: 60,
      desc: 'Footer teks berjalan dengan animasi CSS halus tanpa patah-patah & real-time sync.',
      badge: 'Footer'
    },
    {
      id: 'cta',
      title: 'Overlay Banner CTA & QRIS',
      fileName: 'cta.html',
      url: `${baseUrl}/cta.html`,
      width: 440,
      height: 240,
      desc: 'Banner call-to-action booking via WhatsApp dan QR code pembayaran DP QRIS.',
      badge: 'Konversi'
    },
    {
      id: 'admin',
      title: 'Dashboard Admin Kontrol',
      fileName: 'admin.html',
      url: `${baseUrl}/admin.html`,
      width: 1080,
      height: 900,
      desc: 'Panel kontrol mobile/tablet untuk host live: ubah slot instan, ganti slide, & edit running text.',
      badge: 'Remote'
    }
  ];

  const sqlCode = `-- ==============================================================================
-- SKEMA TABEL SUPABASE: OBS OVERLAY OPEN TRIP REAL-TIME (TIKTOK LIVE STREAM)
-- ==============================================================================

-- 1. Buat Tabel 'trips' (Daftar Destinasi Open Trip Lengkap)
CREATE TABLE IF NOT EXISTS public.trips (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    via TEXT DEFAULT 'VIA STANDAR',
    slogan TEXT DEFAULT 'Yuk Ikut Mendaki...',
    meeting_point TEXT DEFAULT '',
    mountain_info TEXT DEFAULT '',
    brand_handle TEXT DEFAULT '@KITA ADVENTURE INDONESIA',
    mdpl INTEGER NOT NULL DEFAULT 0,
    date_range TEXT NOT NULL,
    duration TEXT NOT NULL DEFAULT '3H2M',
    price TEXT NOT NULL,
    slot_remaining INTEGER NOT NULL DEFAULT 5,
    slot_total INTEGER NOT NULL DEFAULT 15,
    image_url TEXT NOT NULL,
    badge_text TEXT DEFAULT 'HOT DEAL',
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- JIKA TABEL SUDAH DIBUAT SEBELUMNYA, JALANKAN ALTER TABLE INI (Agar tidak error saat simpan):
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS via TEXT DEFAULT 'VIA STANDAR';
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS slogan TEXT DEFAULT 'Yuk Ikut Mendaki...';
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS meeting_point TEXT DEFAULT '';
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS mountain_info TEXT DEFAULT '';
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS brand_handle TEXT DEFAULT '@KITA ADVENTURE INDONESIA';

-- 2. Buat Tabel 'settings' (Pengaturan Running Text, Slide Aktif, & CTA)
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'stream_settings',
    running_text TEXT NOT NULL,
    active_trip_id TEXT,
    active_trip_index INTEGER DEFAULT 0,
    auto_slide BOOLEAN DEFAULT true,
    slide_interval_seconds INTEGER DEFAULT 8,
    wa_number TEXT NOT NULL DEFAULT '081234567890 / 081234567890',
    qris_image_url TEXT DEFAULT '',
    cta_headline TEXT NOT NULL DEFAULT 'BOOKING OPEN TRIP',
    cta_subtext TEXT NOT NULL DEFAULT '081234567890 / 081234567890',
    theme_preset TEXT DEFAULT 'white-alpine',
    animation_style TEXT DEFAULT 'smooth-3d',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 4. Policies Read & Write untuk Public Anon
DROP POLICY IF EXISTS "Public can view trips" ON public.trips;
DROP POLICY IF EXISTS "Public can insert trips" ON public.trips;
DROP POLICY IF EXISTS "Public can update trips" ON public.trips;
DROP POLICY IF EXISTS "Public can delete trips" ON public.trips;

CREATE POLICY "Public can view trips" ON public.trips FOR SELECT USING (true);
CREATE POLICY "Public can insert trips" ON public.trips FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update trips" ON public.trips FOR UPDATE USING (true);
CREATE POLICY "Public can delete trips" ON public.trips FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public can view settings" ON public.settings;
DROP POLICY IF EXISTS "Public can update settings" ON public.settings;
DROP POLICY IF EXISTS "Public can insert settings" ON public.settings;

CREATE POLICY "Public can view settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Public can update settings" ON public.settings FOR UPDATE USING (true);
CREATE POLICY "Public can insert settings" ON public.settings FOR INSERT WITH CHECK (true);

-- 5. Aktifkan Supabase Realtime
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'trips') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'settings') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
  END IF;
END $$;`;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-[#e5a93c] selection:text-[#0f141c]">
      {/* Top Navigation Bar */}
      <header className="border-b border-amber-500/20 bg-[#0f141c]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  OBS Live Stream Overlay
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-extrabold tracking-wider bg-red-600/20 text-red-400 border border-red-500/30 uppercase animate-pulse">
                  TikTok 9:16
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Modular Real-Time Open Trip Engine & Remote Dashboard</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{connStatus === 'supabase' ? 'Supabase Realtime' : connStatus === 'server' ? 'Realtime Sync Aktif (OBS Ready)' : 'Live Sync Active'}</span>
            </div>

            <a
              href="/admin.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-[#e5a93c] text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02]"
            >
              <Smartphone className="w-4 h-4" />
              <span>Buka Admin HP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 sm:gap-6 border-t border-slate-800/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === 'simulator'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Simulator Live TikTok (9:16)</span>
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === 'routes'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Link Browser Source OBS</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === 'sql'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Skema SQL Supabase</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === 'guide'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Panduan Setup OBS</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* TAB 1: LIVE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 9:16 Vertical Live Stream Mockup */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>PREVIEW OBS STUDIO (RESOLUSI TIKTOK 1080 × 1920)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Backdrop:</span>
                  <button
                    onClick={() => setBgMode('mountain')}
                    className={`px-2 py-1 text-[11px] font-bold rounded ${
                      bgMode === 'mountain' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Kamera Live
                  </button>
                  <button
                    onClick={() => setBgMode('grid')}
                    className={`px-2 py-1 text-[11px] font-bold rounded ${
                      bgMode === 'grid' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Transparan Grid
                  </button>
                </div>
              </div>

              {/* Smartphone 9:16 Screen Frame */}
              <div className="relative w-full max-w-[390px] aspect-[9/16] rounded-3xl border-4 border-slate-800 shadow-2xl shadow-black overflow-hidden flex flex-col justify-between bg-slate-950 select-none">
                {/* Background Simulation */}
                {bgMode === 'mountain' && (
                  <div className="absolute inset-0 z-0">
                    <img
                      src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
                      alt="Stream Backdrop"
                      className="w-full h-full object-cover brightness-[0.7] contrast-[1.1]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
                  </div>
                )}
                {bgMode === 'grid' && (
                  <div
                    className="absolute inset-0 z-0 bg-[#0d1117]"
                    style={{
                      backgroundImage: `
                        linear-gradient(45deg, #161b22 25%, transparent 25%), 
                        linear-gradient(-45deg, #161b22 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #161b22 75%), 
                        linear-gradient(-45deg, transparent 75%, #161b22 75%)
                      `,
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                  />
                )}

                {/* Top Overlay: Streamer Header & Live Indicator */}
                <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[11px] font-black text-slate-950">
                      OT
                    </div>
                    <span className="text-xs font-bold text-white">@opentrip_nusantara</span>
                    <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
                  </div>
                  <div className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-red-600/40 animate-pulse">
                    <span>●</span> 1.4K Penonton
                  </div>
                </div>

                {/* Upper Area: Overlay Card Component (card.html) - Serba Putih Video Style */}
                <div className="relative z-10 px-3 pt-2">
                  <div className="video-card-container !w-full !rounded-2xl shadow-2xl">
                    <img
                      src={activeTrip?.image_url || 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800'}
                      alt={activeTrip?.name || 'Mountain Trip'}
                      className="video-card-bg-img"
                    />
                    <div className="video-card-overlay-gradient" />

                    <div className="video-card-content !p-3">
                      {/* Top Row */}
                      <div className="video-card-top-row">
                        <div className="video-card-slogan !text-sm">
                          {activeTrip?.slogan || 'Yuk Ikut Mendaki...'}
                        </div>
                      </div>

                      {/* Title & Via */}
                      <div className="video-card-title-section !mt-1">
                        <h2 className="video-card-title !text-xl !leading-tight">{activeTrip?.name || 'GUNUNG SINDORO'}</h2>
                        <div className="video-card-via !text-xs">{activeTrip?.via || 'VIA WATU LUNYU'}</div>
                      </div>

                      {/* Center Info Section */}
                      <div className="video-card-center-section !my-2">
                        <div className="video-card-start-from !text-[11px]">Start from</div>
                        <div className="video-card-price-pill mono-num !text-base !py-1 !px-4">
                          {activeTrip?.price || 'IDR 950.000'}
                        </div>
                        <div className="video-card-route-pill !text-[10px] !py-1 !px-2.5 !mt-1.5">
                          {activeTrip?.meeting_point || activeTrip?.date_range || 'Jakarta - Solo - Madiun - Banyuwangi'}
                        </div>
                        <div className="video-card-sub-badges !gap-1.5 !mt-1.5">
                          <div className="video-card-pill-info !text-[9px] !py-0.5 !px-2">
                            {activeTrip?.duration || '5 Hari 4 Malam'}
                          </div>
                          <div className="video-card-pill-info !text-[9px] !py-0.5 !px-2">
                            {activeTrip?.mountain_info || `${activeTrip?.mdpl || 3136} MDPL`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Lower Area: CTA WhatsApp Floating Bar (cta.html) */}
                <div className="relative z-10 px-3 pb-2 mt-auto">
                  <div className="video-cta-container !w-full !p-2 shadow-2xl">
                    <svg className="video-cta-wa-icon !w-6 !h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <div className="video-cta-info">
                      <div className="video-cta-headline !text-xs font-black text-white">{settings.cta_headline || 'BOOKING OPEN TRIP'}</div>
                      <div className="video-cta-phones mono-num !text-xs font-black text-white">{settings.wa_number || '081234567890 / 081234567890'}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Overlay: Running Text Footer (running-text.html) */}
                <div className="relative z-10 w-full">
                  <div className="running-text-full-bar !h-9">
                    <div className="live-alert-badge !text-[10px] !px-2.5">
                      <span>INFO LIVE</span>
                    </div>
                    <div className="marquee-track">
                      <div className="marquee-inner">
                        <div className="marquee-chunk !text-xs !text-white">
                          <span>{settings.running_text}</span>
                          <span className="marquee-dot">◆</span>
                        </div>
                        <div className="marquee-chunk !text-xs !text-white">
                          <span>{settings.running_text}</span>
                          <span className="marquee-dot">◆</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Testing Remote Controls */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="bg-[#0f141c] border border-amber-500/30 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-amber-400 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4" />
                    <span>Uji Interaksi Real-Time</span>
                  </h3>
                  <span className="text-[11px] font-bold text-slate-400">Sinkron Seketika</span>
                </div>

                {/* Quick Slide Navigation */}
                <div className="mb-5 bg-black/40 border border-slate-800 rounded-xl p-3">
                  <span className="text-xs font-bold text-slate-400 block mb-2">GANTI SLIDE DI OVERLAY:</span>
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={handlePrevSlide}
                      className="px-3 py-2 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-black text-xs rounded-lg transition-all flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <div className="text-center">
                      <div className="font-extrabold text-white text-sm">{activeTrip?.name}</div>
                      <div className="text-[11px] text-amber-400 font-mono">
                        Slide {currentSlide + 1} dari {trips.length || 6}
                      </div>
                    </div>
                    <button
                      onClick={handleNextSlide}
                      className="px-3 py-2 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-black text-xs rounded-lg transition-all flex items-center gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Fast Slot Accelerator */}
                <div className="mb-5 bg-black/40 border border-slate-800 rounded-xl p-3">
                  <span className="text-xs font-bold text-slate-400 block mb-2">
                    AKSELERASI SISA SLOT KUOTA (SIMULASI PENONTON DEAL):
                  </span>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs text-slate-300 font-medium">Sisa Kuota Sekarang:</span>
                      <div className="text-xl font-black text-emerald-400 font-mono">
                        {activeTrip?.slot_remaining} Slot
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAdjustSlot(-1)}
                        className="px-3 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500 font-black text-xs rounded-lg transition-all flex items-center gap-1"
                      >
                        <Minus className="w-4 h-4" /> Kurangi (-1)
                      </button>
                      <button
                        onClick={() => handleAdjustSlot(1)}
                        className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500 font-black text-xs rounded-lg transition-all flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> Tambah (+1)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct Links to Component Pages */}
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-2">BUKA KOMPONEN DI TAB TERPISAH:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="/card.html"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-between"
                    >
                      <span>Card Open Trip</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    </a>
                    <a
                      href="/running-text.html"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-between"
                    >
                      <span>Running Text</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    </a>
                    <a
                      href="/cta.html"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-between"
                    >
                      <span>Banner CTA & QRIS</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    </a>
                    <a
                      href="/admin.html"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 flex items-center justify-between"
                    >
                      <span>Dashboard Admin</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Pro Tip Card */}
              <div className="bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-slate-300 flex gap-3 items-start">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400 block mb-1">Fitur Dual-Sync (Offline & Cloud):</strong>
                  Aplikasi ini dilengkapi <em>BroadcastChannel & LocalStorage fallback</em>. Anda bisa membuka <code>admin.html</code> di satu tab dan <code>card.html</code> di OBS Browser Source pada komputer yang sama, dan keduanya langsung tersinkron seketika! Hubungkan ke Supabase jika ingin mengontrol dari HP saat live streaming.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MODULAR OBS ROUTES */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-black text-white">URL Browser Source OBS Studio</h2>
              <p className="text-sm text-slate-400 mt-1">
                Gunakan URL di bawah ini untuk ditambahkan sebagai <strong>Browser Source</strong> terpisah di OBS Studio. Setiap overlay memiliki latar transparan murni.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {overlayRoutes.map((route) => (
                <div
                  key={route.id}
                  className="bg-[#0f141c] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {route.badge}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {route.width} × {route.height} px
                      </span>
                    </div>

                    <h3 className="font-extrabold text-lg text-white mb-1.5">{route.title}</h3>
                    <p className="text-xs text-slate-400 mb-4">{route.desc}</p>

                    <div className="bg-black/60 border border-slate-800 rounded-xl p-3 mb-4">
                      <span className="text-[11px] text-slate-500 block mb-1 font-mono">Browser Source URL:</span>
                      <div className="text-xs font-mono text-amber-300 break-all">{route.url}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleCopy(route.url, route.id)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      {copiedKey === route.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-950" />
                          <span>URL Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Salin URL OBS</span>
                        </>
                      )}
                    </button>

                    <a
                      href={route.url}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1"
                      title="Buka Preview Langsung"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SUPABASE SQL SCHEMA */}
        {activeTab === 'sql' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white">Skema SQL Supabase Realtime</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Copy seluruh skema SQL ini dan jalankan di <strong>SQL Editor</strong> Supabase Anda.
                </p>
              </div>
              <button
                onClick={() => handleCopy(sqlCode, 'sql-full')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
              >
                {copiedKey === 'sql-full' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Skema SQL Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Seluruh Skema SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#080b10] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="px-4 py-2.5 bg-[#0f141c] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>supabase-schema.sql</span>
                <span>PostgreSQL • Row Level Security • Supabase Realtime</span>
              </div>
              <pre className="p-4 text-xs font-mono text-amber-200/90 overflow-x-auto leading-relaxed max-h-[500px]">
                {sqlCode}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: PANDUAN SETUP OBS */}
        {activeTab === 'guide' && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-black text-white">Panduan Setup OBS Studio untuk TikTok LIVE</h2>
              <p className="text-sm text-slate-400 mt-1">
                Langkah-langkah menyambungkan overlay modular ke OBS Studio untuk streaming format vertikal (9:16).
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0f141c] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2 font-extrabold text-base text-amber-400">
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Set Kanvas OBS ke Format Vertikal (TikTok LIVE)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 ml-10 list-disc">
                  <li>Buka OBS Studio &gt; <strong>Settings</strong> &gt; <strong>Video</strong>.</li>
                  <li>Ubah <strong>Base (Canvas) Resolution</strong> menjadi <code>1080x1920</code> (rasio 9:16 vertikal).</li>
                  <li>Ubah <strong>Output (Scaled) Resolution</strong> menjadi <code>1080x1920</code> dan FPS ke <code>60 FPS</code>.</li>
                </ul>
              </div>

              <div className="bg-[#0f141c] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2 font-extrabold text-base text-amber-400">
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Tambahkan Komponen 1: Card Open Trip</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 ml-10 list-disc">
                  <li>Di panel <strong>Sources</strong>, klik tombol <strong>+</strong> &gt; pilih <strong>Browser</strong>.</li>
                  <li>Beri nama: <code>OpenTrip - Card Carousel</code>.</li>
                  <li>Masukkan URL: <code>{baseUrl}/card.html</code>.</li>
                  <li>Set Width: <code>440</code> dan Height: <code>580</code>.</li>
                  <li>Centang opsi <em>Shutdown source when not visible</em> dan <em>Refresh browser when scene becomes active</em>.</li>
                  <li>Atur posisi card di sisi atas-kiri atau tengah layar sesuai framing kamera Anda.</li>
                </ul>
              </div>

              <div className="bg-[#0f141c] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2 font-extrabold text-base text-amber-400">
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>Tambahkan Komponen 2: Running Text Footer</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 ml-10 list-disc">
                  <li>Klik <strong>+</strong> di Sources &gt; pilih <strong>Browser</strong>.</li>
                  <li>Beri nama: <code>OpenTrip - Running Text</code>.</li>
                  <li>Masukkan URL: <code>{baseUrl}/running-text.html</code>.</li>
                  <li>Set Width: <code>1080</code> dan Height: <code>60</code>.</li>
                  <li>Posisikan bar di bagian paling bawah layar streaming (footer).</li>
                </ul>
              </div>

              <div className="bg-[#0f141c] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2 font-extrabold text-base text-amber-400">
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                    4
                  </span>
                  <span>Tambahkan Komponen 3: Banner CTA & QRIS</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 ml-10 list-disc">
                  <li>Klik <strong>+</strong> di Sources &gt; pilih <strong>Browser</strong>.</li>
                  <li>Beri nama: <code>OpenTrip - CTA Banner</code>.</li>
                  <li>Masukkan URL: <code>{baseUrl}/cta.html</code>.</li>
                  <li>Set Width: <code>440</code> dan Height: <code>240</code>.</li>
                  <li>Posisikan tepat di atas running text footer.</li>
                </ul>
              </div>

              <div className="bg-[#0f141c] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2 font-extrabold text-base text-amber-400">
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                    5
                  </span>
                  <span>Kontrol Jarak Jauh dari HP / Tablet Saat Live</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 ml-10 list-disc">
                  <li>Buka link <code>{baseUrl}/admin.html</code> di browser HP atau tablet host streaming.</li>
                  <li>Saat ada penonton yang transfer DP via WhatsApp, tekan tombol <strong className="text-red-400">-1</strong> pada destinasi yang bersangkutan.</li>
                  <li>Sisa kuota slot di layar live streaming OBS akan langsung berkurang secara real-time tanpa delay!</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0b0e14] py-4 text-center text-xs text-slate-500">
        OBS Open Trip Live Stream Overlay • Developed for TikTok LIVE & OBS Studio • Real-Time Powered
      </footer>
    </div>
  );
}
