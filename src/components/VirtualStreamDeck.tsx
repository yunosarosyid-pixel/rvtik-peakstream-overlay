import { useState, useEffect } from 'react';
import {
  MountainTrip,
  StreamState,
  BroadcastMode,
  StampType,
  OverlayPreset,
  CardPosition,
} from '../types';
import {
  Video,
  FileText,
  ListChecks,
  Flame,
  Minus,
  Plus,
  QrCode,
  MessageSquare,
  Sparkles,
  Camera,
  Settings,
  Tv,
  Smartphone,
  Copy,
  Check,
  RotateCcw,
  Send,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Sliders,
  Layers,
  Radio,
  Wifi,
} from 'lucide-react';
import { DEFAULT_OVERLAY_CUSTOMIZATION } from '../utils/syncState';

interface VirtualStreamDeckProps {
  state: StreamState;
  mountains: MountainTrip[];
  onUpdateState: (partial: Partial<StreamState>) => void;
  onOpenMountainManager: () => void;
  onOpenOBSGuide: () => void;
  onOpenOverlayCustomizer?: () => void;
}

export function VirtualStreamDeck({
  state,
  mountains,
  onUpdateState,
  onOpenMountainManager,
  onOpenOBSGuide,
  onOpenOverlayCustomizer,
}: VirtualStreamDeckProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [chatViewerName, setChatViewerName] = useState('Budi_Pendaki99');
  const [chatViewerQuestion, setChatViewerQuestion] = useState(
    'Kak kalau pemula belum pernah naik gunung, kuat nggak ikut jalur Torean?'
  );
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);

  const custom = state.customization || DEFAULT_OVERLAY_CUSTOMIZATION;

  // Selected mountain
  const activeMountain =
    mountains.find(m => m.id === state.activeMountainId) || mountains[0] || null;

  // Filter ready mountains
  const readyMountains = mountains.filter(m => m.isReady);

  // Enumerate video devices
  useEffect(() => {
    async function loadDevices() {
      try {
        if (!navigator.mediaDevices?.enumerateDevices) return;
        const devices = await navigator.mediaDevices.enumerateDevices();
        setCameraDevices(devices.filter(d => d.kind === 'videoinput'));
      } catch {
        // ignore
      }
    }
    loadDevices();
  }, []);

  // Copy helper
  const handleCopyLink = (type: 'overlay' | 'controller') => {
    const origin = window.location.origin + window.location.pathname;
    const targetUrl = `${origin}?view=${type}`;
    navigator.clipboard.writeText(targetUrl);
    setCopiedUrl(type);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Slot modifier
  const handleModifySlot = (delta: number) => {
    if (!activeMountain) return;
    const newSlots = Math.max(0, Math.min(activeMountain.totalSlots, activeMountain.slotsAvailable + delta));
    const updatedMountains = mountains.map(m =>
      m.id === activeMountain.id ? { ...m, slotsAvailable: newSlots } : m
    );
    const event = new CustomEvent('UPDATE_ALL_MOUNTAINS', { detail: updatedMountains });
    window.dispatchEvent(event);
  };

  // Quick preset apply
  const handleQuickPreset = (preset: OverlayPreset) => {
    if (preset === 'transparent_hud') {
      onUpdateState({
        customization: {
          ...custom,
          preset: 'transparent_hud',
          bgMode: 'transparent',
          showWebcamLayer: false,
          showTopBanner: true,
          showTripCard: true,
          cardPosition: 'bottom',
          cardSize: 'compact',
          cardOpacity: 90,
          showStamp: true,
          stampPosition: 'top-right',
          showTicker: true,
          showLiveBadge: true,
          showTapNotice: true,
        },
      });
    } else if (preset === 'full_presentation') {
      onUpdateState({
        customization: {
          ...custom,
          preset: 'full_presentation',
          bgMode: 'image_backdrop',
          showWebcamLayer: false,
          showTopBanner: true,
          showTripCard: true,
          cardPosition: 'center',
          cardSize: 'normal',
          cardOpacity: 95,
          showStamp: true,
          stampPosition: 'top-right',
          showTicker: true,
          showLiveBadge: true,
          showTapNotice: true,
        },
      });
    } else if (preset === 'minimal_ticker') {
      onUpdateState({
        customization: {
          ...custom,
          preset: 'minimal_ticker',
          bgMode: 'transparent',
          showWebcamLayer: false,
          showTopBanner: false,
          showTripCard: false,
          cardPosition: 'hidden',
          showStamp: true,
          stampPosition: 'top-right',
          showTicker: true,
          showLiveBadge: true,
          showTapNotice: true,
        },
      });
    }
  };

  // Toggle chat spotlight
  const handleTriggerSpotlight = () => {
    if (state.chatSpotlight?.active) {
      onUpdateState({ chatSpotlight: null });
    } else {
      onUpdateState({
        chatSpotlight: {
          active: true,
          sender: chatViewerName.trim() || 'Penonton Live',
          question: chatViewerQuestion.trim() || 'Berapa kuota yang tersisa kak?',
          timestamp: Date.now(),
        },
      });
    }
  };

  return (
    <div
      id="virtual-stream-deck-panel"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 text-white shadow-2xl flex flex-col gap-6"
    >
      {/* ---------------------------------------------------- */}
      {/* TOP HEADER: TITLE, REALTIME SYNC BADGE & LINKS       */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h2 className="text-lg md:text-xl font-black text-white tracking-tight">
              Virtual Stream Deck
            </h2>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              <span>Real-Time OBS Connected</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Klik tombol apa saja di HP / Remote, tampilan OBS Browser Source langsung berganti seketika!
          </p>
        </div>

        {/* OBS & HP links */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopyLink('overlay')}
            id="btn-copy-obs-link"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            title="Salin URL ini untuk dimasukkan ke Browser Source OBS Studio"
          >
            {copiedUrl === 'overlay' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">URL OBS Disalin!</span>
              </>
            ) : (
              <>
                <Tv className="w-3.5 h-3.5 text-amber-400" />
                <span>Link OBS (9:16)</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleCopyLink('controller')}
            id="btn-copy-remote-link"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            title="Buka link ini di HP untuk dijadikan Stream Deck fisik tanpa kabel"
          >
            {copiedUrl === 'controller' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Link HP Disalin!</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Link Remote HP</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenOBSGuide}
            id="btn-open-obs-guide"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Panduan Cara Pasang & Solusi Tampilan OBS"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 0: KUSTOMISASI TAMPILAN OVERLAY (UTAMA)      */}
      {/* ---------------------------------------------------- */}
      <div className="bg-gradient-to-br from-amber-500/10 via-slate-800/60 to-slate-900 rounded-2xl p-4 border-2 border-amber-400/60 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
              Kustomisasi Tampilan Overlay OBS
            </span>
          </div>
          {onOpenOverlayCustomizer && (
            <button
              onClick={onOpenOverlayCustomizer}
              id="btn-open-customizer-modal"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
            >
              <span>Buka Menu Kustom Detail →</span>
            </button>
          )}
        </div>

        {/* Quick Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickPreset('transparent_hud')}
            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
              custom.preset === 'transparent_hud'
                ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/50'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div>
              <div className="font-extrabold text-xs text-white">🌟 Transparan HUD</div>
              <div className="text-[10px] text-slate-300 mt-0.5">Kamera OBS tembus, kartu di bawah</div>
            </div>
            {custom.preset === 'transparent_hud' && <Check className="w-4 h-4 text-amber-400 flex-shrink-0 ml-1" />}
          </button>

          <button
            type="button"
            onClick={() => handleQuickPreset('full_presentation')}
            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
              custom.preset === 'full_presentation'
                ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/50'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div>
              <div className="font-extrabold text-xs text-white">🏔️ Presentasi Penuh</div>
              <div className="text-[10px] text-slate-300 mt-0.5">Foto gunung solid, kartu tengah</div>
            </div>
            {custom.preset === 'full_presentation' && <Check className="w-4 h-4 text-amber-400 flex-shrink-0 ml-1" />}
          </button>

          <button
            type="button"
            onClick={() => handleQuickPreset('minimal_ticker')}
            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
              custom.preset === 'minimal_ticker'
                ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/50'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div>
              <div className="font-extrabold text-xs text-white">⚡ Minimal Ticker</div>
              <div className="text-[10px] text-slate-300 mt-0.5">Hanya running text & stempel</div>
            </div>
            {custom.preset === 'minimal_ticker' && <Check className="w-4 h-4 text-amber-400 flex-shrink-0 ml-1" />}
          </button>
        </div>

        {/* Quick Position & Transparency switches */}
        <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold text-[11px]">Latar:</span>
            {(['transparent', 'glass', 'solid_dark'] as const).map(mode => (
              <button
                key={mode}
                onClick={() =>
                  onUpdateState({
                    customization: { ...custom, bgMode: mode, preset: 'custom' },
                  })
                }
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                  custom.bgMode === mode
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {mode === 'transparent' ? 'Transparan' : mode === 'glass' ? 'Kaca' : 'Gelap'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold text-[11px]">Posisi Kartu:</span>
            {(['bottom', 'center', 'top', 'hidden'] as CardPosition[]).map(pos => (
              <button
                key={pos}
                onClick={() =>
                  onUpdateState({
                    customization: {
                      ...custom,
                      cardPosition: pos,
                      showTripCard: pos !== 'hidden',
                      preset: 'custom',
                    },
                  })
                }
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition capitalize ${
                  custom.cardPosition === pos && (pos !== 'hidden' ? custom.showTripCard : true)
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {pos === 'bottom' ? 'Bawah' : pos === 'center' ? 'Tengah' : pos === 'top' ? 'Atas' : 'Sembunyi'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 1: 3 BROADCAST MODES SWITCHER                */}
      {/* ---------------------------------------------------- */}
      <div>
        <label className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block mb-2">
          1. Mode Konten Siaran:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Mode 1 */}
          <button
            onClick={() => onUpdateState({ mode: 'mode1_facecam' })}
            id="deck-btn-mode-1"
            className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 ${
              state.mode === 'mode1_facecam'
                ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                state.mode === 'mode1_facecam'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-white">Mode 1: Overlay Live Stream</div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                Cocok untuk overlay di atas kamera OBS & banner trip
              </div>
            </div>
          </button>

          {/* Mode 2 */}
          <button
            onClick={() => onUpdateState({ mode: 'mode2_flyer' })}
            id="deck-btn-mode-2"
            className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 ${
              state.mode === 'mode2_flyer'
                ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                state.mode === 'mode2_flyer'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-white">Mode 2: Pamflet Rute Gunung</div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                Detail elevasi, rute, harga promo & kuota
              </div>
            </div>
          </button>

          {/* Mode 3 */}
          <button
            onClick={() => onUpdateState({ mode: 'mode3_facilities' })}
            id="deck-btn-mode-3"
            className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 ${
              state.mode === 'mode3_facilities'
                ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                state.mode === 'mode3_facilities'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              <ListChecks className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-white">Mode 3: Fasilitas Trip</div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                Rincian fasilitas Include vs Exclude
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 2: QUICK READY MOUNTAIN BUTTONS              */}
      {/* ---------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            2. Ganti Gunung Siaran (Real-Time 1-Klik):
          </label>
          <button
            onClick={onOpenMountainManager}
            id="btn-manage-mountains"
            className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 underline underline-offset-4 decoration-amber-400"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            Kelola Daftar Gunung
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {readyMountains.map(mountain => {
            const isSelected = mountain.id === state.activeMountainId;
            return (
              <button
                key={mountain.id}
                onClick={() => onUpdateState({ activeMountainId: mountain.id })}
                id={`btn-select-mountain-${mountain.id}`}
                className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/25 to-slate-800 border-amber-400 ring-2 ring-amber-400/60 shadow-lg'
                    : 'bg-slate-800/70 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                    {mountain.elevation}M
                  </span>
                  <span className="text-[10px] font-bold text-red-400">
                    {mountain.slotsAvailable} slot
                  </span>
                </div>
                <div className="font-extrabold text-xs text-white truncate">
                  {mountain.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {mountain.duration}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 3: REAL-TIME SLOT CONTROLS & QR PASS         */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Real-time Slot counter */}
        <div className="bg-slate-800/50 rounded-2xl p-3.5 border border-slate-700/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
              3. Kontrol Kuota Slot Live:
            </span>
            <span className="text-xs font-bold text-slate-300">
              {activeMountain?.name}: <strong className="text-amber-400 font-black text-sm">{activeMountain?.slotsAvailable}</strong> / {activeMountain?.totalSlots} Slot
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleModifySlot(-1)}
              id="deck-btn-minus-slot"
              className="py-2.5 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 font-black text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Minus className="w-4 h-4" />
              <span>-1 Slot (Laku Terjual)</span>
            </button>

            <button
              onClick={() => handleModifySlot(1)}
              id="deck-btn-plus-slot"
              className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-black text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+1 Slot (Tambah)</span>
            </button>
          </div>
        </div>

        {/* WhatsApp QR Modal Trigger */}
        <div className="bg-slate-800/50 rounded-2xl p-3.5 border border-slate-700/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
              4. Pop-up Tiket QR WhatsApp:
            </span>
            <span className="text-[10px] font-bold text-slate-400 font-mono">
              +{state.whatsappNumber}
            </span>
          </div>

          <button
            onClick={() => onUpdateState({ qrModalActive: !state.qrModalActive })}
            id="deck-btn-toggle-qr"
            className={`py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition active:scale-95 ${
              state.qrModalActive
                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 shadow-lg'
                : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>
              {state.qrModalActive ? '✓ Sembunyikan QR Code di Layar' : 'Munculkan Tiket QR Booking WA'}
            </span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 4: PROMO STAMPS                              */}
      {/* ---------------------------------------------------- */}
      <div>
        <label className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block mb-2">
          5. Pasang Stempel Promo Instan (Badge Animasi):
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'NONE', label: 'Hapus Stempel' },
            { id: 'FLASH_SALE', label: '⚡ FLASH SALE' },
            { id: 'SISA_2_SLOT', label: '🚨 SISA 2 SLOT' },
            { id: 'BEST_SELLER', label: '⭐ BEST SELLER' },
            { id: 'HARGA_EARLY_BIRD', label: '🎟️ EARLY BIRD' },
            { id: 'KUOTA_HAMPIR_HABIS', label: '🔥 KUOTA MENIPIS' },
            { id: 'PROMO_LIVE_HARI_INI', label: '🎁 PROMO LIVE' },
            { id: 'GRATIS_BUFF_STIKER', label: '👕 FREE BUFF' },
          ].map(stampItem => {
            const isSelected = state.stamp === stampItem.id;
            return (
              <button
                key={stampItem.id}
                onClick={() => onUpdateState({ stamp: stampItem.id as StampType })}
                id={`deck-stamp-${stampItem.id}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {stampItem.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 5: SOCIAL NINJA CHAT NOTICE SPOTLIGHT        */}
      {/* ---------------------------------------------------- */}
      <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-extrabold text-white uppercase tracking-wide">
              Social Ninja Chat Notice Spotlight
            </span>
          </div>
          {state.chatSpotlight?.active && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 animate-pulse">
              SPOTLIGHT AKTIF DI OBS
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              Username Penonton:
            </label>
            <input
              type="text"
              value={chatViewerName}
              onChange={e => setChatViewerName(e.target.value)}
              placeholder="Contoh: rina_adventure"
              id="input-chat-viewer-name"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              Isi Pertanyaan Chat:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatViewerQuestion}
                onChange={e => setChatViewerQuestion(e.target.value)}
                placeholder="Tulis pertanyaan penonton live..."
                id="input-chat-viewer-question"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleTriggerSpotlight}
                id="btn-trigger-chat-spotlight"
                className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 flex-shrink-0 ${
                  state.chatSpotlight?.active
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{state.chatSpotlight?.active ? 'Tutup Notice' : 'Sorot di Layar'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Question Presets */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700/50 overflow-x-auto text-[11px]">
          <span className="text-slate-500 font-semibold flex-shrink-0">Preset Cepat:</span>
          {[
            'Kak kalau pemula kuat nggak ya ikut jalur ini?',
            'Bawa baju dan jaket berapa stel buat camp?',
            'Apakah tenda sudah disiapkan dari panitia?',
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setChatViewerQuestion(preset)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap text-[10px]"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 6: RUNNING TICKER EDITOR                     */}
      {/* ---------------------------------------------------- */}
      <div className="bg-slate-800/40 rounded-2xl p-3.5 border border-slate-700/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Edit Running Text Marquee Bawah:
          </span>
          <button
            onClick={() => onUpdateState({ tickerEnabled: !state.tickerEnabled })}
            id="deck-btn-toggle-ticker"
            className={`text-[10px] font-bold px-2 py-0.5 rounded border transition ${
              state.tickerEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {state.tickerEnabled ? 'Ticker Aktif' : 'Nonaktif'}
          </button>
        </div>

        <input
          type="text"
          value={state.tickerText}
          onChange={e => onUpdateState({ tickerText: e.target.value })}
          placeholder="Teks berjalan di bawah layar..."
          id="input-ticker-text"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
        />
      </div>
    </div>
  );
}
