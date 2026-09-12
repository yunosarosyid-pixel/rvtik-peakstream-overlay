import { useState, useEffect } from 'react';
import {
  MountainTrip,
  StreamState,
  StampType,
  OverlayCustomization,
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
  Sparkles,
  Compass,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  X,
  Smartphone,
  Maximize2,
} from 'lucide-react';
import { DEFAULT_OVERLAY_CUSTOMIZATION } from '../utils/syncState';

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

  const custom: OverlayCustomization = state.customization || DEFAULT_OVERLAY_CUSTOMIZATION;

  // Filter trips that are ready for top banner slider
  const readyTrips = mountains.filter(m => m.isReady);
  const [sliderIndex, setSliderIndex] = useState(0);

  // Auto rotate top banner slider
  useEffect(() => {
    if (readyTrips.length <= 1) return;
    const interval = setInterval(() => {
      setSliderIndex(prev => (prev + 1) % readyTrips.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [readyTrips.length]);

  const currentSliderTrip = readyTrips[sliderIndex] || activeMountain;

  // Viewport detection to guide streamer if OBS resolution is not 9:16
  const [viewport, setViewport] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 1080,
    h: typeof window !== 'undefined' ? window.innerHeight : 1920,
  });
  const [dismissWarning, setDismissWarning] = useState(false);
  const [force916Preview, setForce916Preview] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isWideOrSquare = viewport.h / Math.max(1, viewport.w) < 1.35;

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
    if (!custom.showStamp || stamp === 'NONE') return null;

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

    // Position styling
    let positionClass = 'my-auto self-center';
    if (custom.stampPosition === 'top-right') positionClass = 'absolute top-16 right-4 z-20';
    else if (custom.stampPosition === 'top-left') positionClass = 'absolute top-16 left-4 z-20';
    else if (custom.stampPosition === 'bottom-right') positionClass = 'absolute bottom-20 right-4 z-20';
    else if (custom.stampPosition === 'bottom-left') positionClass = 'absolute bottom-20 left-4 z-20';
    else if (custom.stampPosition === 'center') positionClass = 'absolute inset-0 m-auto w-max h-max z-20';

    return (
      <div
        id="stream-overlay-stamp"
        className={`${positionClass} transform -rotate-6 uppercase px-3.5 py-1.5 rounded-xl font-black text-xs md:text-sm tracking-wider border-2 shadow-2xl animate-bounce duration-1000 ${style} pointer-events-none`}
      >
        {label}
      </div>
    );
  };

  // Background style class
  let backgroundLayerClass = 'bg-transparent';
  if (custom.bgMode === 'glass') {
    backgroundLayerClass = 'bg-slate-950/40 backdrop-blur-sm';
  } else if (custom.bgMode === 'solid_dark') {
    backgroundLayerClass = 'bg-slate-950';
  } else if (custom.bgMode === 'image_backdrop' || state.mode !== 'mode1_facecam') {
    backgroundLayerClass = 'bg-slate-950';
  }

  // Theme styling for cards
  const getThemeCardStyles = () => {
    switch (custom.cardTheme) {
      case 'emerald-green':
        return {
          border: 'border-emerald-500/80',
          accentBg: 'bg-emerald-500',
          accentText: 'text-emerald-400',
          pillBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          gradient: 'from-emerald-500/20 via-slate-900/90 to-slate-950/95',
          glow: 'shadow-emerald-500/20',
        };
      case 'neon-red':
        return {
          border: 'border-red-500/80',
          accentBg: 'bg-red-600',
          accentText: 'text-red-400',
          pillBg: 'bg-red-500/20 text-red-300 border-red-500/30',
          gradient: 'from-red-600/20 via-slate-900/90 to-slate-950/95',
          glow: 'shadow-red-500/20',
        };
      case 'cyber-blue':
        return {
          border: 'border-cyan-400/80',
          accentBg: 'bg-cyan-500',
          accentText: 'text-cyan-400',
          pillBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          gradient: 'from-cyan-500/20 via-slate-900/90 to-slate-950/95',
          glow: 'shadow-cyan-500/20',
        };
      case 'amber-gold':
      default:
        return {
          border: 'border-amber-400/80',
          accentBg: 'bg-amber-500',
          accentText: 'text-amber-400',
          pillBg: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
          gradient: 'from-amber-500/20 via-slate-900/90 to-slate-950/95',
          glow: 'shadow-amber-500/20',
        };
    }
  };

  const themeStyle = getThemeCardStyles();
  const cardOpacityStyle = { backgroundColor: `rgba(15, 23, 42, ${((custom.cardOpacity || 92) / 100).toFixed(2)})` };

  const content = (
    <div
      id="obs-stream-canvas"
      className={`relative w-full h-full text-white overflow-hidden select-none font-['Plus_Jakarta_Sans',sans-serif] flex flex-col ${
        isStandaloneOverlay
          ? 'w-full h-full min-h-screen border-none bg-transparent'
          : 'w-full h-full'
      } ${backgroundLayerClass}`}
    >
      {/* Non-intrusive notification if OBS resolution is square/horizontal instead of 9:16 */}
      {isStandaloneOverlay && isWideOrSquare && !dismissWarning && (
        <div
          id="resolution-check-banner"
          className="relative z-50 bg-amber-500 text-slate-950 px-3 py-2 shadow-2xl flex items-center justify-between border-b-2 border-yellow-300 text-xs font-bold pointer-events-auto"
        >
          <div className="flex items-center gap-2 pr-2">
            <AlertTriangle className="w-4 h-4 text-red-700 flex-shrink-0" />
            <span>
              Resolusi Layar Saat Ini: <strong>{viewport.w} × {viewport.h}</strong> (Bukan Vertikal 9:16).
              Di OBS Studio: Klik Kanan Browser Source &gt; <strong>Properties</strong> &gt; Ubah <strong>Width: 1080</strong> &amp; <strong>Height: 1920</strong> lalu tekan <strong>Ctrl + F</strong>.
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setForce916Preview(!force916Preview)}
              className="px-2 py-1 bg-slate-950 text-amber-300 rounded-lg text-[10px] hover:bg-slate-900 flex items-center gap-1 transition"
            >
              <Smartphone className="w-3 h-3" />
              <span>{force916Preview ? 'Isi Layar Penuh' : 'Bingkai 9:16'}</span>
            </button>
            <button
              onClick={() => setDismissWarning(true)}
              className="p-1 hover:bg-amber-600 rounded text-slate-950 transition"
              title="Tutup Peringatan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* LAYER 1: VIDEO / BACKGROUND / PHOTO                                       */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Only show WebcamStream if explicitly enabled by user (default OFF in OBS) */}
        {custom.showWebcamLayer && (
          <div className="w-full h-full">
            <WebcamStream
              deviceId={state.selectedCameraDeviceId}
              isSimulated={state.cameraSimulated}
              spotlight={state.chatSpotlight?.active}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />
          </div>
        )}

        {/* If image backdrop mode or presentation mode is active */}
        {(custom.bgMode === 'image_backdrop' || state.mode !== 'mode1_facecam') && (
          <div className="w-full h-full relative">
            <img
              src={activeMountain?.imageUrl}
              alt={activeMountain?.name}
              className="w-full h-full object-cover brightness-[0.35] scale-105 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-900/80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* LAYER 2: TOP STREAM HEADER & LIVE STATUS                                   */}
      {/* ========================================================================= */}
      {(custom.showLiveBadge || custom.showTapNotice) && (
        <header className="relative z-10 p-3 pt-4 flex items-center justify-between pointer-events-none">
          {custom.showLiveBadge ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600/90 text-white font-black text-xs tracking-widest rounded-full shadow-lg border border-red-400/50 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>LIVE</span>
              </div>
              <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/15 text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>RVTik PeakStream</span>
              </div>
            </div>
          ) : <div />}

          {custom.showTapNotice && (
            <div className="bg-amber-500/25 backdrop-blur-md border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 animate-pulse shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>TAP 2X LAYAR</span>
            </div>
          )}
        </header>
      )}

      {/* ========================================================================= */}
      {/* FLOATING STAMP BADGE                                                      */}
      {/* ========================================================================= */}
      {renderStampBadge(state.stamp)}

      {/* ========================================================================= */}
      {/* LAYER 3: MAIN VIEWPORT WITH CUSTOM POSITIONING                             */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 flex flex-col justify-between p-3.5 overflow-hidden">
        {/* TOP SECTION: BANNER SLIDER */}
        <div>
          {custom.showTopBanner && readyTrips.length > 0 && currentSliderTrip && (
            <div
              id="top-banner-slider-card"
              style={cardOpacityStyle}
              className={`w-full backdrop-blur-xl border-2 ${themeStyle.border} rounded-2xl p-2.5 shadow-2xl transition-all duration-500 mb-2`}
            >
              <div className="flex items-center justify-between text-[10px] font-extrabold text-amber-400 mb-1">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-bounce" />
                  {custom.customHeadline || 'OPEN TRIP SIAP BERANGKAT'} ({sliderIndex + 1}/{readyTrips.length})
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  KUOTA READY
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <img
                  src={currentSliderTrip.imageUrl}
                  alt={currentSliderTrip.name}
                  className="w-12 h-12 rounded-xl object-cover border border-white/20 shadow-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-extrabold text-xs md:text-sm text-white truncate">
                      {currentSliderTrip.name}
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold flex-shrink-0">
                      {currentSliderTrip.elevation} MDPL
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 truncate mt-0.5">
                    📅 {currentSliderTrip.date} • {currentSliderTrip.duration}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-amber-400 font-black text-xs">
                      {formatIDR(currentSliderTrip.price)}
                    </span>
                    <span className="text-[9px] font-bold text-red-300 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-500/30">
                      Sisa {currentSliderTrip.slotsAvailable} Slot
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* If Trip card is positioned at TOP */}
          {custom.showTripCard && custom.cardPosition === 'top' && activeMountain && (
            <TripDetailsCard
              mountain={activeMountain}
              formatIDR={formatIDR}
              custom={custom}
              themeStyle={themeStyle}
              cardOpacityStyle={cardOpacityStyle}
            />
          )}
        </div>

        {/* MIDDLE SECTION: IF CARD POSITION IS CENTER */}
        <div className="my-auto">
          {custom.showTripCard && custom.cardPosition === 'center' && activeMountain && (
            <TripDetailsCard
              mountain={activeMountain}
              formatIDR={formatIDR}
              custom={custom}
              themeStyle={themeStyle}
              cardOpacityStyle={cardOpacityStyle}
            />
          )}

          {/* Facilities mode */}
          {state.mode === 'mode3_facilities' && activeMountain && (
            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border-2 border-emerald-500/80 shadow-xl">
                <div className="flex items-center gap-1.5 text-emerald-400 font-black text-xs uppercase mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>FASILITAS INCLUDE ({activeMountain.name}):</span>
                </div>
                <ul className="space-y-1 text-[11px] text-slate-200">
                  {activeMountain.includes.slice(0, 4).map((inc, i) => (
                    <li key={i} className="flex items-start gap-1 leading-tight">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl p-3 border border-red-500/60 shadow-xl">
                <div className="flex items-center gap-1.5 text-red-400 font-black text-xs uppercase mb-1.5">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>TIDAK TERMASUK (EXCLUDE):</span>
                </div>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  {activeMountain.excludes.slice(0, 3).map((exc, i) => (
                    <li key={i} className="flex items-start gap-1 leading-tight">
                      <span className="text-red-400 font-bold">✕</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: IF CARD POSITION IS BOTTOM (RECOMMENDED FOR STREAMERS) */}
        <div className="space-y-2">
          {custom.showTripCard && custom.cardPosition === 'bottom' && activeMountain && (
            <TripDetailsCard
              mountain={activeMountain}
              formatIDR={formatIDR}
              custom={custom}
              themeStyle={themeStyle}
              cardOpacityStyle={cardOpacityStyle}
            />
          )}

          {/* Quick Callout Bar */}
          <div className="bg-black/70 backdrop-blur-md rounded-2xl p-2.5 border border-white/15 flex items-center justify-between">
            <div className="text-left min-w-0 pr-2">
              <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider truncate">
                {custom.customCallout || 'TANYA JALUR & BOOKING VIA CHAT'}
              </p>
              <p className="text-xs font-extrabold text-white truncate">
                Ketik nama gunung untuk info rute!
              </p>
            </div>
            <button
              onClick={onToggleQR}
              className={`px-3 py-1.5 rounded-xl ${themeStyle.accentBg} text-slate-950 font-black text-xs shadow-lg flex-shrink-0 flex items-center gap-1`}
            >
              <span>BOOKING WA</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* LAYER 5: CHAT SPOTLIGHT NOTICE                                            */}
      {/* ========================================================================= */}
      {custom.showChatNotice && state.chatSpotlight?.active && (
        <div
          id="chat-notice-spotlight-card"
          className="absolute inset-x-3.5 top-16 z-30 bg-slate-900/95 backdrop-blur-xl border-2 border-amber-400 rounded-2xl p-3 shadow-2xl animate-in slide-in-from-top duration-300"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                💬 PERTANYAAN LIVE CHAT
              </span>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-extrabold">
              DIJAWAB HOST
            </span>
          </div>

          <div className="bg-black/60 rounded-xl p-2 border border-white/10">
            <p className="text-xs font-extrabold text-amber-300">
              @{state.chatSpotlight.sender}
            </p>
            <p className="text-xs font-bold text-white mt-0.5 leading-snug">
              "{state.chatSpotlight.question}"
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LAYER 6: WHATSAPP QR PASS POPUP                                           */}
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
      {/* LAYER 7: RUNNING TICKER AT BOTTOM                                         */}
      {/* ========================================================================= */}
      {custom.showTicker && state.tickerEnabled && (
        <footer
          id="stream-bottom-ticker"
          className="relative z-20 bg-amber-500 text-slate-950 py-1.5 px-3 overflow-hidden flex items-center shadow-lg border-t-2 border-yellow-300 font-black text-xs tracking-wide flex-shrink-0"
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

  if (isStandaloneOverlay && force916Preview) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none">
        <div className="w-full max-w-[390px] aspect-[9/16] rounded-3xl overflow-hidden border-4 border-slate-700 shadow-2xl relative flex flex-col bg-slate-900">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

// Sub-component: Clean Customizable Trip Details Card
interface TripDetailsCardProps {
  mountain: MountainTrip;
  formatIDR: (val: number) => string;
  custom: OverlayCustomization;
  themeStyle: any;
  cardOpacityStyle: any;
}

function TripDetailsCard({
  mountain,
  formatIDR,
  custom,
  themeStyle,
  cardOpacityStyle,
}: TripDetailsCardProps) {
  const isCompact = custom.cardSize === 'compact';
  const isMinimal = custom.cardSize === 'minimal';

  if (isMinimal) {
    return (
      <div
        style={cardOpacityStyle}
        className={`w-full backdrop-blur-xl border-2 ${themeStyle.border} rounded-2xl p-2.5 shadow-2xl flex items-center justify-between gap-2`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm text-white truncate">{mountain.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
              {mountain.elevation} MDPL
            </span>
          </div>
          <p className="text-[10px] text-slate-300 truncate">
            📅 {mountain.date} • {mountain.duration}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-amber-400 font-black text-sm">{formatIDR(mountain.price)}</div>
          <div className="text-[9px] font-bold text-red-300">Sisa {mountain.slotsAvailable} Slot</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={cardOpacityStyle}
      className={`w-full backdrop-blur-xl border-2 ${themeStyle.border} rounded-3xl p-3.5 shadow-2xl transition-all duration-300`}
    >
      {/* Top row: Name & Badges */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] tracking-wide">
              {mountain.elevation} MDPL
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 font-bold text-[10px] border border-white/10">
              {mountain.level}
            </span>
            <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3" /> Berasuransi
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-white tracking-tight uppercase mt-1 leading-tight">
            {mountain.name}
          </h2>
          <div className="flex items-center gap-1 text-slate-300 text-[11px] font-semibold mt-0.5">
            <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span className="truncate">{mountain.route}</span>
          </div>
        </div>

        <img
          src={mountain.imageUrl}
          alt={mountain.name}
          className="w-14 h-14 rounded-2xl object-cover border border-white/20 shadow-md flex-shrink-0"
        />
      </div>

      {/* Date & Schedule info */}
      <div className="grid grid-cols-2 gap-2 my-2">
        <div className="bg-slate-900/80 rounded-xl p-2 border border-white/10 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] text-slate-400 font-bold uppercase block">Jadwal</span>
            <p className="text-xs font-extrabold text-white truncate">{mountain.date}</p>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-2 border border-white/10 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] text-slate-400 font-bold uppercase block">Durasi</span>
            <p className="text-xs font-extrabold text-white truncate">{mountain.duration}</p>
          </div>
        </div>
      </div>

      {/* Pricing and Slot availability */}
      <div className="bg-black/60 rounded-2xl p-2.5 border border-white/10">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="line-through text-[10px] font-bold text-slate-400">
                {formatIDR(mountain.normalPrice)}
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px]">
                HEMAT {formatIDR(mountain.normalPrice - mountain.price)}
              </span>
            </div>
            <div className="text-xl md:text-2xl font-black text-amber-400 tracking-tight">
              {formatIDR(mountain.price)}
              <span className="text-[10px] text-slate-300 font-normal ml-1">/orang</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-300 font-extrabold flex items-center gap-1 justify-end">
              <Users className="w-3 h-3 text-amber-400" />
              <span>Sisa Kuota:</span>
            </div>
            <span
              className={`text-xs font-black ${
                mountain.slotsAvailable <= 2 ? 'text-red-400 animate-pulse' : 'text-amber-300'
              }`}
            >
              {mountain.slotsAvailable} dari {mountain.totalSlots} Kursi
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10 mt-2">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              mountain.slotsAvailable <= 2
                ? 'bg-gradient-to-r from-red-600 to-orange-500 animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-emerald-400'
            }`}
            style={{
              width: `${Math.max(
                8,
                ((mountain.totalSlots - mountain.slotsAvailable) / mountain.totalSlots) * 100
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
