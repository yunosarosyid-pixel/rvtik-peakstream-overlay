import React from 'react';
import {
  OverlayCustomization,
  OverlayBackgroundMode,
  CardPosition,
  CardSize,
  CardTheme,
  StampPosition,
  OverlayPreset,
} from '../types';
import {
  X,
  Sliders,
  Sparkles,
  Eye,
  Layout,
  Palette,
  Check,
  RotateCcw,
  Layers,
  Camera,
  Tv,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { DEFAULT_OVERLAY_CUSTOMIZATION } from '../utils/syncState';

interface OverlayCustomizerModalProps {
  customization: OverlayCustomization;
  onUpdateCustomization: (updated: Partial<OverlayCustomization>) => void;
  onClose: () => void;
}

export function OverlayCustomizerModal({
  customization,
  onUpdateCustomization,
  onClose,
}: OverlayCustomizerModalProps) {
  const custom = { ...DEFAULT_OVERLAY_CUSTOMIZATION, ...customization };

  // Apply preset
  const handleApplyPreset = (preset: OverlayPreset) => {
    if (preset === 'transparent_hud') {
      onUpdateCustomization({
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
      });
    } else if (preset === 'full_presentation') {
      onUpdateCustomization({
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
      });
    } else if (preset === 'minimal_ticker') {
      onUpdateCustomization({
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
      });
    } else {
      onUpdateCustomization({ preset: 'custom' });
    }
  };

  return (
    <div
      id="overlay-customizer-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto"
    >
      <div
        id="overlay-customizer-dialog"
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-5 md:p-6 text-white shadow-2xl flex flex-col max-h-[92vh] my-auto space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-white">
                Kustomisasi Tampilan Overlay OBS
              </h3>
              <p className="text-xs text-slate-400">
                Atur transparansi latar belakang, posisi kartu, stempel, dan elemen siaran
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-overlay-customizer"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-5 pr-1 text-xs text-slate-300">
          {/* 1. PRESET CEPAT 1-KLIK */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-400 tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>1. PILIH PRESET TAMPILAN CEPAT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Preset 1: Transparent HUD */}
              <button
                type="button"
                onClick={() => handleApplyPreset('transparent_hud')}
                className={`p-3 rounded-2xl border text-left transition relative ${
                  custom.preset === 'transparent_hud'
                    ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-white">🌟 Transparan HUD</span>
                  {custom.preset === 'transparent_hud' && (
                    <Check className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  <strong>Rekomendasi OBS:</strong> Kamera streamer tembus jernih, kartu trip di bawah, banner atas & running text.
                </p>
                <span className="inline-block mt-2 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                  Anti Kotak Hitam
                </span>
              </button>

              {/* Preset 2: Full Presentation */}
              <button
                type="button"
                onClick={() => handleApplyPreset('full_presentation')}
                className={`p-3 rounded-2xl border text-left transition ${
                  custom.preset === 'full_presentation'
                    ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-white">🏔️ Presentasi Penuh</span>
                  {custom.preset === 'full_presentation' && (
                    <Check className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Latar foto gunung HD solid, kartu pamflet di tengah untuk menjelaskan rute & fasilitas.
                </p>
              </button>

              {/* Preset 3: Minimal Flash Sale */}
              <button
                type="button"
                onClick={() => handleApplyPreset('minimal_ticker')}
                className={`p-3 rounded-2xl border text-left transition ${
                  custom.preset === 'minimal_ticker'
                    ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-white">⚡ Minimal Ticker</span>
                  {custom.preset === 'minimal_ticker' && (
                    <Check className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Hanya running text bawah dan stempel promo. Layar 95% terbuka untuk kamera OBS.
                </p>
              </button>
            </div>
          </div>

          {/* 2. LATAR BELAKANG (TRANSPARANSI) */}
          <div className="bg-slate-800/50 rounded-2xl p-3.5 border border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Latar Belakang Layar (Transparansi OBS)
              </span>
              <span className="text-[10px] text-amber-400 font-semibold">
                {custom.bgMode === 'transparent' ? '✓ Kamera OBS Tembus 100%' : custom.bgMode}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => onUpdateCustomization({ bgMode: 'transparent', preset: 'custom' })}
                className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs transition ${
                  custom.bgMode === 'transparent'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                🏁 100% Transparan
              </button>

              <button
                type="button"
                onClick={() => onUpdateCustomization({ bgMode: 'glass', preset: 'custom' })}
                className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs transition ${
                  custom.bgMode === 'glass'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                🪟 Kaca Semi-Gelap
              </button>

              <button
                type="button"
                onClick={() => onUpdateCustomization({ bgMode: 'solid_dark', preset: 'custom' })}
                className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs transition ${
                  custom.bgMode === 'solid_dark'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                ⬛ Hitam Gelap Solid
              </button>

              <button
                type="button"
                onClick={() => onUpdateCustomization({ bgMode: 'image_backdrop', preset: 'custom' })}
                className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs transition ${
                  custom.bgMode === 'image_backdrop'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                🏔️ Foto Gunung HD
              </button>
            </div>

            {/* Webcam Layer Toggle */}
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Layer Kamera Bawaan Web</span>
                <span className="text-[10px] text-slate-400">
                  Matikan agar TIDAK muncul pesan "Webcam belum terhubung" di OBS (karena kamera dihandle OBS).
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  onUpdateCustomization({
                    showWebcamLayer: !custom.showWebcamLayer,
                    preset: 'custom',
                  })
                }
                className={`px-3 py-1 rounded-full font-extrabold text-xs transition ${
                  custom.showWebcamLayer
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {custom.showWebcamLayer ? 'NYALA' : 'MATI (DISARANKAN)'}
              </button>
            </div>
          </div>

          {/* 3. POSISI & UKURAN KARTU TRIP */}
          <div className="bg-slate-800/50 rounded-2xl p-3.5 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-amber-400" />
                Posisi Kartu Informasi Trip
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() =>
                  onUpdateCustomization({
                    cardPosition: 'bottom',
                    showTripCard: true,
                    preset: 'custom',
                  })
                }
                className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition ${
                  custom.cardPosition === 'bottom' && custom.showTripCard
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                ⬇️ Bawah (Recommended)
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateCustomization({
                    cardPosition: 'center',
                    showTripCard: true,
                    preset: 'custom',
                  })
                }
                className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition ${
                  custom.cardPosition === 'center' && custom.showTripCard
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                ⏺️ Tengah Layar
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateCustomization({
                    cardPosition: 'top',
                    showTripCard: true,
                    preset: 'custom',
                  })
                }
                className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition ${
                  custom.cardPosition === 'top' && custom.showTripCard
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                ⬆️ Atas Layar
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateCustomization({
                    cardPosition: 'hidden',
                    showTripCard: false,
                    preset: 'custom',
                  })
                }
                className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition ${
                  !custom.showTripCard || custom.cardPosition === 'hidden'
                    ? 'bg-red-500/20 border-red-400 text-red-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                🚫 Sembunyikan
              </button>
            </div>

            {/* Ukuran & Opasitas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/60">
              <div>
                <span className="font-bold text-white block mb-1">Ukuran Kartu</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['compact', 'normal', 'minimal'] as CardSize[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onUpdateCustomization({ cardSize: size, preset: 'custom' })}
                      className={`py-1.5 px-2 rounded-lg font-bold text-[11px] border capitalize transition ${
                        custom.cardSize === size
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">Kegelapan Kartu (Opacity)</span>
                  <span className="font-mono text-amber-400 font-bold">{custom.cardOpacity || 90}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={custom.cardOpacity || 90}
                  onChange={(e) =>
                    onUpdateCustomization({
                      cardOpacity: parseInt(e.target.value, 10),
                      preset: 'custom',
                    })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 4. TEMA WARNA & POSISI STEMPEL */}
          <div className="bg-slate-800/50 rounded-2xl p-3.5 border border-slate-700/80 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Tema Warna */}
              <div>
                <span className="font-bold text-white flex items-center gap-1.5 mb-1.5">
                  <Palette className="w-3.5 h-3.5 text-pink-400" />
                  Tema Warna
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'amber-gold', name: '🟡 Amber Emas' },
                    { id: 'emerald-green', name: '🟢 Hijau Rimba' },
                    { id: 'neon-red', name: '🔴 Merah Flash' },
                    { id: 'cyber-blue', name: '🔵 Biru Cyber' },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() =>
                        onUpdateCustomization({
                          cardTheme: theme.id as CardTheme,
                          preset: 'custom',
                        })
                      }
                      className={`py-1.5 px-2 rounded-lg font-bold text-[11px] border transition ${
                        custom.cardTheme === theme.id
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Posisi Stempel */}
              <div>
                <span className="font-bold text-white flex items-center gap-1.5 mb-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  Posisi Stempel Flash Sale
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'top-right', name: 'Kanan Atas' },
                    { id: 'top-left', name: 'Kiri Atas' },
                    { id: 'center', name: 'Tengah' },
                    { id: 'bottom-right', name: 'Kanan Bwh' },
                    { id: 'bottom-left', name: 'Kiri Bwh' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() =>
                        onUpdateCustomization({
                          stampPosition: pos.id as StampPosition,
                          showStamp: true,
                          preset: 'custom',
                        })
                      }
                      className={`py-1.5 px-1 rounded-lg font-bold text-[10px] border truncate transition ${
                        custom.stampPosition === pos.id && custom.showStamp
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {pos.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 5. TOGGLE ON/OFF INDIVIDUAL ELEMEN */}
          <div className="bg-slate-800/50 rounded-2xl p-3.5 border border-slate-700/80 space-y-2">
            <span className="font-bold text-white block mb-1">
              Toggle On/Off Elemen Overlay:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { key: 'showTopBanner', label: 'Top Slider Banner' },
                { key: 'showTripCard', label: 'Kartu Trip Aktif' },
                { key: 'showStamp', label: 'Stempel Promo' },
                { key: 'showTicker', label: 'Running Text Bawah' },
                { key: 'showLiveBadge', label: 'Badge LIVE & RVTik' },
                { key: 'showTapNotice', label: 'Badge Tap 2x Layar' },
              ].map((item) => {
                const isActive = (custom as any)[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      onUpdateCustomization({
                        [item.key]: !isActive,
                        preset: 'custom',
                      })
                    }
                    className={`py-2 px-2.5 rounded-xl border font-bold text-[11px] flex items-center justify-between transition ${
                      isActive
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? 'bg-emerald-400' : 'bg-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. EDIT TEKS LANGSUNG */}
          <div className="bg-slate-800/50 rounded-2xl p-3.5 border border-slate-700/80 space-y-2">
            <span className="font-bold text-white block">Teks Kustom Banner & Callout:</span>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">
                  Judul Banner Atas:
                </label>
                <input
                  type="text"
                  value={custom.customHeadline || ''}
                  onChange={(e) => onUpdateCustomization({ customHeadline: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-amber-400 outline-none"
                  placeholder="OPEN TRIP SIAP BERANGKAT"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">
                  Teks Callout Samping Tombol WA:
                </label>
                <input
                  type="text"
                  value={custom.customCallout || ''}
                  onChange={(e) => onUpdateCustomization({ customCallout: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-amber-400 outline-none"
                  placeholder="TANYA JALUR & BOOKING VIA CHAT"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleApplyPreset('transparent_hud')}
            className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Default HUD</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition"
          >
            Selesai Kustomisasi
          </button>
        </div>
      </div>
    </div>
  );
}
