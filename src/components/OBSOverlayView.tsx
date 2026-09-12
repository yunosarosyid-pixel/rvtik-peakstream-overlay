import { useState, useEffect } from 'react';
import {
  MountainTrip,
  StreamState,
  StampType,
} from '../types';
import { WebcamStream } from './WebcamStream';
import { WhatsAppQRCode } from './WhatsAppQRCode';
import {
  Flame,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Users,
  ShieldAlert,
  Sparkles,
  MessageCircle,
  Tag,
  Compass,
  Award
} from 'lucide-react';

interface OBSOverlayViewProps {
  state: StreamState;
  mountains: MountainTrip[];
  onToggleQR?: () => void;
  isStandaloneOverlay?: boolean;
}

export function OBSOverlayView({
  state,
  mountains,
  onToggleQR,
  isStandaloneOverlay = false,
}: OBSOverlayViewProps) {
  const activeMountain =
    mountains.find(m => m.id === state.activeMountainId) || mountains[0] || null;

  // Filter trips that are ready for top banner slider in Mode 1
  const readyTrips = mountains.filter(m => m.isReady);
  const [sliderIndex, setSliderIndex] = useState(0);

  // Auto rotate top banner slider in Mode 1
  useEffect(() => {
    if (state.mode !== 'mode1_facecam' || readyTrips.length <= 1) return;
    const interval = setInterval(() => {
      setSliderIndex(prev => (prev + 1) % readyTrips.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [state.mode, readyTrips.length]);

  const currentSliderTrip = readyTrips[sliderIndex] || activeMountain;

  // Format currency
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Stamp badge label & color
  const renderStampBadge = (stamp: StampType) => {
    if (stamp === 'NONE') return null;

    let label = '';
    let style = '';

    switch (stamp) {
      case 'FLASH_SALE':
        label = '⚡ FLASH SALE LIVE ⚡';
        style = 'bg-red-600 text-white border-yellow-300 ring-4 ring-red-500/50 shadow-red-500/50';
        break;
      case 'SISA_2_SLOT':
        label = '🚨 SISA 2 SLOT TERAKHIR!';
        style = 'bg-amber-500 text-slate-950 border-white ring-4 ring-amber-400/50 shadow-amber-500/50';
        break;
      case 'BEST_SELLER':
        label = '⭐ TRIP BEST SELLER ⭐';
        style = 'bg-indigo-600 text-white border-indigo-300 ring-4 ring-indigo-500/50 shadow-indigo-500/50';
        break;
      case 'HARGA_EARLY_BIRD':
        label = '🎟️ HARGA EARLY BIRD';
        style = 'bg-emerald-600 text-white border-emerald-300 ring-4 ring-emerald-500/50 shadow-emerald-500/50';
        break;
      case 'KUOTA_HAMPIR_HABIS':
        label = '🔥 KUOTA HAMPIR HABIS';
        style = 'bg-orange-600 text-white border-orange-300 ring-4 ring-orange-500/50 shadow-orange-500/50';
        break;
      case 'PROMO_LIVE_HARI_INI':
        label = '🎁 SPESIAL LIVE STREAM';
        style = 'bg-pink-600 text-white border-pink-300 ring-4 ring-pink-500/50 shadow-pink-500/50';
        break;
      case 'GRATIS_BUFF_STIKER':
        label = '👕 FREE BUFF & MERCH';
        style = 'bg-cyan-600 text-white border-cyan-300 ring-4 ring-cyan-500/50 shadow-cyan-500/50';
        break;
      default:
        return null;
    }

    return (
      <div
        id="stream-overlay-stamp"
        className={`transform -rotate-6 uppercase px-4 py-1.5 rounded-xl font-black text-xs md:text-sm tracking-wider border-2 shadow-xl animate-bounce duration-1000 ${style}`}
      >
        {label}
      </div>
    );
  };

  return (
    <div
      id="obs-stream-canvas"
      className={`relative w-full h-full aspect-[9/16] max-h-[92vh] max-w-[520px] mx-auto bg-slate-950 text-white overflow-hidden select-none font-['Plus_Jakarta_Sans',sans-serif] flex flex-col shadow-2xl border-4 border-slate-800 ${
        isStandaloneOverlay ? 'border-none max-h-screen max-w-none h-screen w-screen' : 'rounded-3xl'
      }`}
    >
      {/* ========================================================================= */}
      {/* LAYER 1: VIDEO / BACKGROUND */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0">
        {state.mode === 'mode1_facecam' ? (
          // MODE 1: Fullscreen Webcam
          <div className="w-full h-full">
            <WebcamStream
              deviceId={state.selectedCameraDeviceId}
              isSimulated={state.cameraSimulated}
              spotlight={state.chatSpotlight?.active}
            />
            {/* Dark vignette gradient at top & bottom so UI texts stand out */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />
          </div>
        ) : (
          // MODE 2 & MODE 3: High resolution Mountain Background Backdrop
          <div className="w-full h-full relative">
            <img
              src={activeMountain?.imageUrl}
              alt={activeMountain?.name}
              className="w-full h-full object-cover brightness-[0.35] scale-105 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-900/80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* LAYER 2: TOP STREAM HEADER & LIVE STATUS */}
      {/* ========================================================================= */}
      <header className="relative z-10 p-4 pt-5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          {/* LIVE BADGE */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600/90 text-white font-black text-xs tracking-widest rounded-full shadow-lg border border-red-400/50 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>LIVE</span>
          </div>

          <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/15 text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>RVTik PeakStream</span>
          </div>
        </div>

        {/* TOP CALLOUT */}
        <div className="bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>TAP 2X LAYAR</span>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* LAYER 3: MODE SPECIFIC VIEWPORT CONTENT */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 flex flex-col justify-between p-4 overflow-hidden">
        {/* ---------------------------------------------------- */}
        {/* MODE 1: FACECAM + TOP BANNER SLIDER                  */}
        {/* ---------------------------------------------------- */}
        {state.mode === 'mode1_facecam' && (
          <div className="flex flex-col justify-between h-full">
            {/* TOP BANNER SLIDER: Showing ready trips */}
            {readyTrips.length > 0 && currentSliderTrip && (
              <div
                id="top-banner-slider-card"
                className="w-full bg-slate-900/90 backdrop-blur-xl border-2 border-amber-400/80 rounded-2xl p-3 shadow-2xl transition-all duration-500"
              >
                <div className="flex items-center justify-between text-[10px] font-extrabold text-amber-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-bounce" />
                    OPEN TRIP SIAP BERANGKAT ({sliderIndex + 1}/{readyTrips.length})
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    KUOTA READY
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={currentSliderTrip.imageUrl}
                    alt={currentSliderTrip.name}
                    className="w-14 h-14 rounded-xl object-cover border border-white/20 shadow-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-sm text-white truncate">
                        {currentSliderTrip.name}
                      </h3>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold">
                        {currentSliderTrip.elevation} MDPL
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate mt-0.5">
                      📅 {currentSliderTrip.date} • {currentSliderTrip.duration}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-amber-400 font-black text-xs">
                        {formatIDR(currentSliderTrip.price)}
                      </span>
                      <span className="text-[10px] font-bold text-red-300 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-500/30">
                        Sisa {currentSliderTrip.slotsAvailable} Slot
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stamp Floating in Mode 1 */}
            <div className="flex items-center justify-center my-auto">
              {renderStampBadge(state.stamp)}
            </div>

            {/* Bottom Callout in Mode 1 */}
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Ketik nama gunung di chat
                </p>
                <p className="text-xs font-extrabold text-white">
                  Tanya Jalur, Cuaca & Perlengkapan!
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg">
                BOOKING WA
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE 2: FULL MOUNTAIN TRIP FLYER PAMFLET             */}
        {/* ---------------------------------------------------- */}
        {state.mode === 'mode2_flyer' && activeMountain && (
          <div className="flex flex-col h-full justify-between gap-3 animate-in fade-in zoom-in-95 duration-300">
            {/* Top flyer header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[11px] tracking-wide">
                    {activeMountain.elevation} MDPL
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 font-bold text-[11px] border border-white/10">
                    {activeMountain.level}
                  </span>
                </div>
                {renderStampBadge(state.stamp)}
              </div>

              {/* Title */}
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-md">
                  {activeMountain.name}
                </h1>
                <div className="flex items-center gap-1 text-slate-300 text-xs font-semibold mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate">{activeMountain.route}</span>
                </div>
              </div>
            </div>

            {/* Mid Section: Date & Info Badges */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Jadwal Trip
                  </span>
                  <p className="text-xs font-extrabold text-white truncate">
                    {activeMountain.date}
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Durasi
                  </span>
                  <p className="text-xs font-extrabold text-white truncate">
                    {activeMountain.duration}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlights Tag Pills */}
            <div className="flex flex-wrap gap-1.5">
              {activeMountain.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[10px] font-bold flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Pricing Card Hero */}
            <div className="bg-gradient-to-br from-amber-500/20 via-slate-900/90 to-slate-950/95 backdrop-blur-xl border-2 border-amber-400 rounded-3xl p-4 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-slate-300">
                  HARGA PROMO LIVE:
                </span>
                <span className="line-through text-xs font-bold text-slate-400">
                  {formatIDR(activeMountain.normalPrice)}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="text-2xl md:text-3xl font-black text-amber-400 tracking-tight">
                  {formatIDR(activeMountain.price)}
                  <span className="text-xs text-slate-300 font-medium ml-1">/pax</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wide">
                  HEMAT {formatIDR(activeMountain.normalPrice - activeMountain.price)}
                </span>
              </div>

              {/* Slot Availability Meter */}
              <div className="mt-3 pt-2.5 border-t border-white/10">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-extrabold text-white flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Sisa Kuota:
                  </span>
                  <span
                    className={`font-black ${
                      activeMountain.slotsAvailable <= 2
                        ? 'text-red-400 animate-pulse'
                        : 'text-amber-300'
                    }`}
                  >
                    {activeMountain.slotsAvailable} dari {activeMountain.totalSlots} Kursi
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      activeMountain.slotsAvailable <= 2
                        ? 'bg-gradient-to-r from-red-600 to-orange-500 animate-pulse'
                        : 'bg-gradient-to-r from-amber-500 to-emerald-400'
                    }`}
                    style={{
                      width: `${Math.max(
                        8,
                        ((activeMountain.totalSlots - activeMountain.slotsAvailable) /
                          activeMountain.totalSlots) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Basecamp info */}
            <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
              <span>📍 Titik Kumpul: {activeMountain.basecampLocation}</span>
              <span className="text-emerald-400 font-bold">Resmi Berasuransi</span>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE 3: FASILITAS INCLUDE & EXCLUDE                  */}
        {/* ---------------------------------------------------- */}
        {state.mode === 'mode3_facilities' && activeMountain && (
          <div className="flex flex-col h-full justify-between gap-3 animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  DETAIL FASILITAS RESMI
                </span>
                {renderStampBadge(state.stamp)}
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                {activeMountain.name} ({activeMountain.elevation} MDPL)
              </h2>
            </div>

            {/* Two Column Grid: Include vs Exclude */}
            <div className="grid grid-cols-1 gap-2.5 flex-1 overflow-hidden">
              {/* Card 1: FASILITAS INCLUDE */}
              <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border-2 border-emerald-500/80 shadow-xl flex flex-col">
                <div className="flex items-center gap-1.5 text-emerald-400 font-black text-xs uppercase mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>FASILITAS SUDAH TERMASUK (INCLUDE):</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-200 flex-1 overflow-y-auto pr-1">
                  {activeMountain.includes.map((inc, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-tight">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 2: FASILITAS EXCLUDE */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl p-3 border border-red-500/60 shadow-xl flex flex-col">
                <div className="flex items-center gap-1.5 text-red-400 font-black text-xs uppercase mb-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>TIDAK TERMASUK (EXCLUDE):</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300 flex-1 overflow-y-auto pr-1">
                  {activeMountain.excludes.map((exc, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-tight">
                      <span className="text-red-400 font-bold">✕</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom highlight */}
            <div className="bg-amber-500/15 border border-amber-400/40 rounded-xl p-2.5 text-center">
              <p className="text-xs font-bold text-amber-300">
                Semua perlengkapan kelompok & tenda disiapkan tim kami! Kamu tinggal bawa badan & perlengkapan pribadi.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* LAYER 4: FLOATING CIRCULAR WEBCAM PIP (FOR MODE 2 & MODE 3)               */}
      {/* ========================================================================= */}
      {state.mode !== 'mode1_facecam' && (
        <div
          id="pip-webcam-corner"
          className="absolute bottom-16 right-4 z-20 w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-amber-400 shadow-[0_10px_35px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-500 transform hover:scale-105"
        >
          <WebcamStream
            deviceId={state.selectedCameraDeviceId}
            isSimulated={state.cameraSimulated}
            isCircular={true}
            spotlight={state.chatSpotlight?.active}
          />
          {/* Host Tag */}
          <div className="absolute bottom-1 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full bg-black/80 text-[9px] font-black text-amber-300 border border-amber-400/50 uppercase tracking-wide">
            HOST LIVE
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LAYER 5: SOCIAL NINJA CHAT NOTICE SPOTLIGHT                               */}
      {/* ========================================================================= */}
      {state.chatSpotlight?.active && (
        <div
          id="chat-notice-spotlight-card"
          className="absolute inset-x-4 top-20 z-30 bg-slate-900/95 backdrop-blur-xl border-2 border-amber-400 rounded-2xl p-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.9)] animate-in slide-in-from-top duration-300"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                💬 PERTANYAAN PENONTON LIVE CHAT
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-extrabold">
              SEDANG DIJAWAB HOST
            </span>
          </div>

          <div className="bg-black/50 rounded-xl p-2.5 border border-white/10">
            <p className="text-xs font-extrabold text-amber-300">
              @{state.chatSpotlight.sender}
            </p>
            <p className="text-sm font-bold text-white mt-0.5 leading-snug">
              "{state.chatSpotlight.question}"
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LAYER 6: WHATSAPP QR PASS BOOKING POPUP                                   */}
      {/* ========================================================================= */}
      {state.qrModalActive && activeMountain && (
        <div
          id="qr-pass-modal-backdrop"
          className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <WhatsAppQRCode
            phoneNumber={state.whatsappNumber}
            tripName={activeMountain.name}
            priceFormatted={formatIDR(activeMountain.price)}
            customMessage={state.whatsappMessage}
            onClose={onToggleQR}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* LAYER 7: RUNNING TEXT TICKER AT THE BOTTOM                                 */}
      {/* ========================================================================= */}
      {state.tickerEnabled && (
        <footer
          id="stream-bottom-ticker"
          className="relative z-20 bg-amber-500 text-slate-950 py-1.5 px-3 overflow-hidden flex items-center shadow-lg border-t-2 border-yellow-300 font-black text-xs tracking-wide"
        >
          <div className="flex-shrink-0 bg-slate-950 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded mr-2 uppercase tracking-wider">
            INFO LIVE
          </div>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="inline-block animate-marquee uppercase">
              {state.tickerText} ••••• {state.tickerText}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
