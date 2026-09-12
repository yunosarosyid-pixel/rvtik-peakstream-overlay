import React, { useState } from 'react';
import {
  Video,
  Mountain,
  PackageCheck,
  Plus,
  Minus,
  QrCode,
  Sparkles,
  PhoneCall,
  MessageSquareQuote,
  Settings,
  Flame,
  CheckCircle,
  Camera,
  Copy,
  Check,
  Compass,
  Layers
} from 'lucide-react';
import { TripPackage, StreamSettings, DisplayMode } from '../types';
import { TripEditorModal } from './TripEditorModal';

interface StreamDeckControllerProps {
  settings: StreamSettings;
  trips: TripPackage[];
  onUpdateSettings: (newSettings: StreamSettings) => void;
  onUpdateTrips: (newTrips: TripPackage[]) => void;
  onTriggerStamp: (stamp: string | null) => void;
  availableVideoDevices?: MediaDeviceInfo[];
}

export const StreamDeckController: React.FC<StreamDeckControllerProps> = ({
  settings,
  trips,
  onUpdateSettings,
  onUpdateTrips,
  onTriggerStamp,
  availableVideoDevices = [],
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Chat notice input states (Social Ninja stream integration)
  const [customViewerName, setCustomViewerName] = useState(settings.noticeViewerName);
  const [customQuestion, setCustomQuestion] = useState(settings.noticeQuestion);

  // Quick preset questions common in open trip live streams
  const PRESET_QUESTIONS = [
    { viewer: '@pendaki_santai', q: 'Kak untuk Merbabu tendanya bawa sendiri atau sudah include?' },
    { viewer: '@petualang_solo', q: 'Bisa gabung sendirian ngga kak? Aman buat cewek?' },
    { viewer: '@novice_hiker', q: 'Fisik belum terlalu kuat apakah kuat sampai puncak?' },
    { viewer: '@bayu_trekker', q: 'Meeting point-nya di mana dan ada penjemputan dari stasiun?' },
    { viewer: '@dinda_outdoor', q: 'Bisa bayar DP dulu atau langsung lunas kak?' },
  ];

  const readyTrips = trips.filter((t) => t.isReady);
  const activeTrip = trips.find((t) => t.id === settings.activeTripId) || readyTrips[0] || trips[0];

  // Change display mode
  const handleModeChange = (mode: DisplayMode) => {
    onUpdateSettings({ ...settings, currentMode: mode });
  };

  // Select active mountain trip
  const handleSelectTrip = (tripId: string) => {
    onUpdateSettings({ ...settings, activeTripId: tripId });
  };

  // Slot modifier
  const handleAdjustSlot = (delta: number) => {
    if (!activeTrip) return;
    const newSlots = Math.max(0, activeTrip.availableSlots + delta);
    const updatedTrips = trips.map((t) =>
      t.id === activeTrip.id ? { ...t, availableSlots: newSlots } : t
    );
    onUpdateTrips(updatedTrips);
  };

  // Trigger Notice for serious question
  const handleTriggerNotice = (viewer: string, q: string) => {
    onUpdateSettings({
      ...settings,
      showNoticeSpotlight: true,
      noticeViewerName: viewer,
      noticeQuestion: q,
    });
  };

  const handleDismissNotice = () => {
    onUpdateSettings({ ...settings, showNoticeSpotlight: false });
  };

  // Copy OBS Browser Source URL
  const handleCopyObsUrl = () => {
    const url = `${window.location.origin}${window.location.pathname}?view=overlay`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 space-y-4 text-stone-200 font-['Plus_Jakarta_Sans'] select-none">
      {/* Top Stream Status & OBS URL Bar */}
      <div className="bg-[#181715] border border-stone-800 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#221f1c] border border-stone-700 flex items-center justify-center text-[#7de39b]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-[#f4efe6] font-['Outfit']">
                RVTik PeakStream Virtual Deck
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#7de39b] bg-[#1a2d1e] border border-[#2d5236] px-2 py-0.2 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7de39b] animate-pulse" />
                LIVE SYNC
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Remote kontrol siaran live open trip pendakian (OBS Browser Source)
            </p>
          </div>
        </div>

        {/* OBS URL Button & Edit Trips */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyObsUrl}
            className="text-xs bg-[#24211d] hover:bg-[#2e2a25] border border-stone-700 text-stone-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-mono transition-colors active:scale-95"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#7de39b]" />
                <span className="text-[#7de39b]">URL OBS Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
                <span>Salin URL OBS</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsEditorOpen(true)}
            className="text-xs bg-[#27462e] hover:bg-[#31583a] text-[#f4efe6] border border-[#3e6f4a] px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-colors shadow"
          >
            <Settings className="w-3.5 h-3.5 text-[#7de39b]" />
            <span>Kelola Gunung</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: MAIN DISPLAY MODES (3 PRIMARY STREAM DECK BUTTONS) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-mono">
            01 • PILIH MODE TAMPILAN OBS
          </span>
          <span className="text-[10px] text-[#7de39b] font-mono">
            Status: {settings.currentMode === 'mode1_full' ? 'MODE 1 (KAMERA FULL)' : settings.currentMode === 'mode2_trip' ? 'MODE 2 (PAMFLET GUNUNG)' : 'MODE 3 (FASILITAS)'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Mode 1 Button */}
          <button
            onClick={() => handleModeChange('mode1_full')}
            className={`p-3.5 rounded-xl border text-left transition-all active:scale-[0.98] ${
              settings.currentMode === 'mode1_full'
                ? 'bg-[#1b2b1e] border-[#448053] shadow-md'
                : 'bg-[#181715] border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#221f1c] text-[#7de39b] border border-stone-700 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              {settings.currentMode === 'mode1_full' && (
                <span className="text-[9px] bg-[#27462e] text-[#7de39b] border border-[#3e6f4a] font-mono font-bold px-2 py-0.5 rounded">
                  ON AIR
                </span>
              )}
            </div>
            <h3 className="text-xs font-bold text-[#f7f4ee] font-['Outfit']">
              MODE 1: KAMERA FULL
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
              Wajah tampil penuh + mini banner slider trip ready di atas layar.
            </p>
          </button>

          {/* Mode 2 Button */}
          <button
            onClick={() => handleModeChange('mode2_trip')}
            className={`p-3.5 rounded-xl border text-left transition-all active:scale-[0.98] ${
              settings.currentMode === 'mode2_trip'
                ? 'bg-[#1b2b1e] border-[#448053] shadow-md'
                : 'bg-[#181715] border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#221f1c] text-[#f8a855] border border-stone-700 flex items-center justify-center">
                <Mountain className="w-4 h-4" />
              </div>
              {settings.currentMode === 'mode2_trip' && (
                <span className="text-[9px] bg-[#27462e] text-[#7de39b] border border-[#3e6f4a] font-mono font-bold px-2 py-0.5 rounded">
                  ON AIR
                </span>
              )}
            </div>
            <h3 className="text-xs font-bold text-[#f7f4ee] font-['Outfit']">
              MODE 2: PAMFLET GUNUNG
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
              Kamera otomatis mengecil bulat, layar menampilkan poster & harga.
            </p>
          </button>

          {/* Mode 3 Button */}
          <button
            onClick={() => handleModeChange('mode3_facility')}
            className={`p-3.5 rounded-xl border text-left transition-all active:scale-[0.98] ${
              settings.currentMode === 'mode3_facility'
                ? 'bg-[#1b2b1e] border-[#448053] shadow-md'
                : 'bg-[#181715] border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#221f1c] text-teal-400 border border-stone-700 flex items-center justify-center">
                <PackageCheck className="w-4 h-4" />
              </div>
              {settings.currentMode === 'mode3_facility' && (
                <span className="text-[9px] bg-[#27462e] text-[#7de39b] border border-[#3e6f4a] font-mono font-bold px-2 py-0.5 rounded">
                  ON AIR
                </span>
              )}
            </div>
            <h3 className="text-xs font-bold text-[#f7f4ee] font-['Outfit']">
              MODE 3: FASILITAS TRIP
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
              Kamera tetap bulat, layar menampilkan rincian Include & Exclude.
            </p>
          </button>
        </div>
      </div>

      {/* SECTION 2: DYNAMIC READY MOUNTAINS (INSTANT BUTTONS) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-mono">
            02 • TOMBOL INSTAN GUNUNG READY ({readyTrips.length})
          </span>
          <button
            onClick={() => setIsEditorOpen(true)}
            className="text-[11px] text-[#7de39b] hover:underline font-mono"
          >
            + Kelola Status Ready
          </button>
        </div>

        {readyTrips.length === 0 ? (
          <div className="p-3 bg-[#181715] border border-stone-800 rounded-xl text-center text-xs text-stone-400 font-mono">
            Belum ada gunung yang berstatus 'Ready'. Klik 'Kelola Status Ready' untuk mengaktifkan.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {readyTrips.map((t) => {
              const isSelected = activeTrip?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    handleSelectTrip(t.id);
                    if (settings.currentMode === 'mode1_full') {
                      handleModeChange('mode2_trip');
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all active:scale-[0.98] flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1b2b1e] border-[#448053] shadow'
                      : 'bg-[#181715] border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-[#7de39b]">
                      {t.elevationMdpl}m
                    </span>
                    <span className="text-[9px] font-mono text-[#f8a855] bg-[#291b12] px-1 py-0.2 rounded">
                      Sisa {t.availableSlots}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#f7f4ee] truncate font-['Outfit']">
                      {t.mountainName}
                    </h4>
                    <span className="text-[10px] text-stone-400 font-mono block truncate">
                      Rp {t.promoPrice.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="mt-1.5 text-[9px] font-mono text-[#7de39b] flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-[#7de39b]" />
                      SEDANG TAMPIL
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 3: LIVE TRIP QUICK CONTROLS (SLOT & PROMO STAMPS) */}
      {activeTrip && (
        <div className="bg-[#181715] border border-stone-800 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-800">
            <div>
              <span className="text-[9px] text-stone-400 uppercase font-mono tracking-wider block">
                Trip Terpilih Saat Ini:
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#7de39b] font-['Outfit']">
                {activeTrip.mountainName} ({activeTrip.route})
              </span>
            </div>

            {/* Instant Slot Modifier Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-300 font-mono">
                Sisa Kuota: <span className="text-[#f8a855] font-bold">{activeTrip.availableSlots}</span> / {activeTrip.totalSlots}
              </span>

              <div className="flex items-center gap-1 bg-[#100f0e] p-0.5 rounded-lg border border-stone-800">
                <button
                  onClick={() => handleAdjustSlot(-1)}
                  title="Kurangi 1 Slot (Ada yang booking di live)"
                  className="w-7 h-7 rounded bg-[#3d1818] hover:bg-[#522020] text-[#f8a8a8] font-bold flex items-center justify-center transition-colors active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleAdjustSlot(1)}
                  title="Tambah 1 Slot"
                  className="w-7 h-7 rounded bg-[#1e3324] hover:bg-[#284430] text-[#7de39b] font-bold flex items-center justify-center transition-colors active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Animated Stamps */}
          <div>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-mono block mb-1.5">
              Stempel Promo Cepat di Pamflet:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'FLASH SALE', val: 'FLASH SALE' },
                { label: 'SISA 2 SLOT', val: 'SISA 2 SLOT' },
                { label: 'BEST SELLER', val: 'BEST SELLER' },
                { label: 'HAMPIR HABIS', val: 'HAMPIR HABIS' },
                { label: 'PROMO LIVE', val: 'PROMO LIVE' },
              ].map((s) => (
                <button
                  key={s.val}
                  onClick={() => onTriggerStamp(settings.quickStamp === s.val ? null : s.val)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold uppercase transition-all active:scale-95 ${
                    settings.quickStamp === s.val
                      ? 'bg-[#821e1e] text-[#fbf7f0] border border-[#a82828]'
                      : 'bg-[#22201d] hover:bg-[#2a2723] text-stone-300 border border-stone-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}

              {settings.quickStamp && (
                <button
                  onClick={() => onTriggerStamp(null)}
                  className="text-xs px-2 py-1 rounded-lg bg-[#141311] text-stone-400 hover:text-stone-200 border border-stone-800 font-mono"
                >
                  Hapus Stempel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SOCIAL NINJA STREAM CHAT NOTICE */}
      <div className="bg-[#181715] border border-[#6b3e1a]/60 rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2e1d12] text-[#f8a855] border border-[#6b3e1a] flex items-center justify-center">
              <MessageSquareQuote className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#f8a855] font-mono">
                04 • SOCIAL NINJA CHAT NOTICE TRIGGER
              </h3>
              <p className="text-[11px] text-stone-400">
                Sorot pertanyaan serius penonton agar host langsung notice & pertanyaan muncul di siaran.
              </p>
            </div>
          </div>

          {settings.showNoticeSpotlight && (
            <button
              onClick={handleDismissNotice}
              className="text-xs bg-[#4a1818] hover:bg-[#612020] text-[#f8a8a8] border border-[#802a2a] font-mono font-bold px-2.5 py-1 rounded-lg transition-colors"
            >
              Tutup Notice
            </button>
          )}
        </div>

        {/* Input Custom Notice */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-4">
            <input
              type="text"
              placeholder="Username (@andi)"
              value={customViewerName}
              onChange={(e) => setCustomViewerName(e.target.value)}
              className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-[#f5ebd9] font-mono focus:outline-none focus:border-[#f8a855]"
            />
          </div>
          <div className="sm:col-span-6">
            <input
              type="text"
              placeholder="Tulis pertanyaan penonton..."
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-[#f5ebd9] focus:outline-none focus:border-[#f8a855]"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              onClick={() => handleTriggerNotice(customViewerName, customQuestion)}
              className="w-full h-full min-h-[32px] bg-[#3a2212] hover:bg-[#4f2f19] text-[#f8a855] border border-[#78461b] font-mono font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition-colors active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Notice!
            </button>
          </div>
        </div>

        {/* Quick Presets for FAQ Chat */}
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-mono block mb-1">
            FAQ Cepat (Klik untuk langsung tampilkan):
          </span>
          <div className="flex flex-wrap gap-1">
            {PRESET_QUESTIONS.map((pq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCustomViewerName(pq.viewer);
                  setCustomQuestion(pq.q);
                  handleTriggerNotice(pq.viewer, pq.q);
                }}
                className="text-[10.5px] bg-[#221f1c] hover:bg-[#2d2924] border border-stone-700 text-stone-300 px-2 py-1 rounded text-left truncate max-w-xs transition-colors"
              >
                <span className="text-[#f8a855] font-mono mr-1">{pq.viewer}:</span>
                "{pq.q}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 5: WHATSAPP NUMBER SETTINGS & QR BOOKING */}
      <div className="bg-[#181715] border border-stone-800 rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1e3324] text-[#7de39b] border border-[#2d5236] flex items-center justify-center">
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7de39b] font-mono">
                05 • PENGATURAN WHATSAPP & QRIS
              </h3>
              <p className="text-[11px] text-stone-400">
                Nomor WhatsApp yang tertera di seluruh pamflet & pop-up QR live stream
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              onUpdateSettings({ ...settings, showQrPopup: !settings.showQrPopup })
            }
            className={`text-xs px-3 py-1.5 rounded-lg font-mono font-bold flex items-center gap-1.5 transition-colors ${
              settings.showQrPopup
                ? 'bg-[#4a1818] text-[#f8a8a8] border border-[#802a2a]'
                : 'bg-[#27462e] text-[#7de39b] border border-[#3e6f4a]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{settings.showQrPopup ? 'Tutup Pop-up QR di OBS' : 'Tampilkan QR di OBS'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="text-[10px] text-stone-400 font-mono block mb-1">
              Nomor WhatsApp Booking
            </label>
            <input
              type="text"
              value={settings.waNumber}
              onChange={(e) =>
                onUpdateSettings({ ...settings, waNumber: e.target.value })
              }
              className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#7de39b] font-bold focus:outline-none focus:border-[#7de39b]"
            />
          </div>

          <div>
            <label className="text-[10px] text-stone-400 font-mono block mb-1">
              Nama Admin Travel
            </label>
            <input
              type="text"
              value={settings.waAdminName}
              onChange={(e) =>
                onUpdateSettings({ ...settings, waAdminName: e.target.value })
              }
              className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-[#f5ebd9] focus:outline-none focus:border-[#7de39b]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[10px] text-stone-400 font-mono block mb-1">
              Teks Berjalan Running Text di Layar OBS
            </label>
            <input
              type="text"
              value={settings.runningText}
              onChange={(e) =>
                onUpdateSettings({ ...settings, runningText: e.target.value })
              }
              className="w-full bg-[#12110f] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 font-mono focus:outline-none focus:border-[#7de39b]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 6: CAMERA INPUT SOURCE */}
      <div className="bg-[#181715] border border-stone-800 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-stone-300">
          <Camera className="w-3.5 h-3.5 text-[#7de39b]" />
          <span className="font-mono text-[11px]">Input Kamera:</span>
          {availableVideoDevices.length > 0 ? (
            <select
              value={settings.selectedCameraDeviceId}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  selectedCameraDeviceId: e.target.value,
                  useSimulatedCamera: false,
                })
              }
              className="bg-[#12110f] border border-stone-700 rounded px-2 py-1 text-xs text-[#f4efe6] focus:outline-none font-mono"
            >
              <option value="">Default Webcam Eksternal</option>
              {availableVideoDevices.map((d, i) => (
                <option key={d.deviceId || i} value={d.deviceId}>
                  {d.label || `Kamera ${i + 1}`}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-stone-400 font-mono text-[11px]">Webcam Sistem Otomatis</span>
          )}
        </div>

        <button
          onClick={() =>
            onUpdateSettings({
              ...settings,
              useSimulatedCamera: !settings.useSimulatedCamera,
            })
          }
          className="text-[11px] text-stone-400 hover:text-stone-200 underline font-mono"
        >
          {settings.useSimulatedCamera
            ? 'Beralih ke Kamera Asli'
            : 'Gunakan Gambar Simulasi'}
        </button>
      </div>

      {/* Trip Editor Modal */}
      <TripEditorModal
        isOpen={isEditorOpen}
        trips={trips}
        onSaveTrips={(newTrips) => {
          onUpdateTrips(newTrips);
        }}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
};
