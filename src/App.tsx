import { useState, useEffect } from 'react';
import { MountainTrip, StreamState, StampType } from './types';
import {
  loadSavedMountains,
  loadSavedStreamState,
  saveMountains,
  saveStreamState,
  subscribeToSync,
} from './utils/syncState';
import { OBSOverlayView } from './components/OBSOverlayView';
import { VirtualStreamDeck } from './components/VirtualStreamDeck';
import { MountainManagerModal } from './components/MountainManagerModal';
import { OBSGuideModal } from './components/OBSGuideModal';
import { OverlayCustomizerModal } from './components/OverlayCustomizerModal';
import { WidgetHub } from './components/WidgetHub';
import { RunningTextWidget } from './components/widgets/RunningTextWidget';
import { WhatsAppWidget } from './components/widgets/WhatsAppWidget';
import { PromoBadgeWidget } from './components/widgets/PromoBadgeWidget';
import { FacilitiesWidget } from './components/widgets/FacilitiesWidget';
import { MountainTripWidget } from './components/widgets/MountainTripWidget';
import { QRCodeWidget } from './components/widgets/QRCodeWidget';
import {
  Flame,
  Tv,
  Smartphone,
  ExternalLink,
  Settings,
  HelpCircle,
  Eye,
  Layers,
  Sliders,
  Link,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [streamState, setStreamState] = useState<StreamState>(() => loadSavedStreamState());
  const [mountains, setMountains] = useState<MountainTrip[]>(() => loadSavedMountains());
  const [isMountainManagerOpen, setIsMountainManagerOpen] = useState(false);
  const [isOBSGuideOpen, setIsOBSGuideOpen] = useState(false);
  const [isOverlayCustomizerOpen, setIsOverlayCustomizerOpen] = useState(false);

  // Active top tab in Studio mode: 'hub' (Widget Hub Links) | 'dual' (Classic Dual Studio)
  const [studioTab, setStudioTab] = useState<'hub' | 'dual'>('hub');

  // Read view or widget mode from URL params
  const [urlParams, setUrlParams] = useState<{
    view?: string | null;
    widget?: string | null;
    params: URLSearchParams;
  }>({
    view: null,
    widget: null,
    params: new URLSearchParams(),
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const widget = params.get('widget');
    setUrlParams({ view, widget, params });
  }, []);

  // Subscribe to real-time state synchronization across tabs/OBS
  useEffect(() => {
    const unsubscribe = subscribeToSync(
      newState => {
        setStreamState(newState);
      },
      newMountains => {
        setMountains(newMountains);
      }
    );

    // Listen to custom window event from slot modifier
    const handleUpdateAllMountains = (e: any) => {
      if (e.detail) {
        setMountains(e.detail);
        saveMountains(e.detail);
      }
    };
    window.addEventListener('UPDATE_ALL_MOUNTAINS', handleUpdateAllMountains);

    return () => {
      unsubscribe();
      window.removeEventListener('UPDATE_ALL_MOUNTAINS', handleUpdateAllMountains);
    };
  }, []);

  // State update helper
  const handleUpdateStreamState = (partial: Partial<StreamState>) => {
    const nextState = { ...streamState, ...partial };
    setStreamState(nextState);
    saveStreamState(nextState);
  };

  // Save mountains helper
  const handleSaveMountains = (updatedList: MountainTrip[]) => {
    setMountains(updatedList);
    saveMountains(updatedList);
  };

  // ---------------------------------------------------------------------------
  // WIDGET DIRECT RENDER MODES (Pusat Link OBS Mandiri)
  // ---------------------------------------------------------------------------
  if (urlParams.widget) {
    const { widget, params } = urlParams;

    // 1. Running text widget
    if (widget === 'running-text') {
      const text = params.get('text') || undefined;
      const speed = (params.get('speed') as any) || 'normal';
      const theme = (params.get('theme') as any) || 'amber';
      const prefix = params.get('prefix') || undefined;
      return (
        <div className="w-screen h-screen bg-transparent overflow-hidden flex items-center justify-center">
          <RunningTextWidget text={text} speed={speed} theme={theme} prefix={prefix} />
        </div>
      );
    }

    // 2. WhatsApp booking widget
    if (widget === 'whatsapp') {
      const waNumber = params.get('wa') || streamState.whatsappNumber;
      const adminName = params.get('admin') || undefined;
      const ctaText = params.get('cta') || undefined;
      const theme = (params.get('theme') as any) || 'green';
      return (
        <div className="w-screen h-screen bg-transparent overflow-hidden flex items-center justify-center">
          <WhatsAppWidget waNumber={waNumber} adminName={adminName} ctaText={ctaText} theme={theme} />
        </div>
      );
    }

    // 3. Promo badge widget
    if (widget === 'promo-badge') {
      const type = (params.get('type') as StampType) || 'FLASH_SALE';
      const customText = params.get('text') || undefined;
      const size = (params.get('size') as any) || 'normal';
      const animation = (params.get('animation') as any) || 'bounce';
      return (
        <div className="w-screen h-screen bg-transparent overflow-hidden flex items-center justify-center">
          <PromoBadgeWidget type={type} customText={customText} size={size} animation={animation} />
        </div>
      );
    }

    // 4. Trip Card per Mountain widget
    if (widget === 'trip-card') {
      const mountainId = params.get('mountain') || 'rinjani';
      const targetMountain = mountains.find(m => m.id === mountainId) || mountains[0];
      const theme = (params.get('theme') as any) || 'amber';
      const layout = (params.get('layout') as any) || 'card';
      return (
        <div className="w-screen h-screen bg-transparent overflow-hidden flex items-center justify-center">
          <MountainTripWidget mountain={targetMountain} theme={theme} layout={layout} />
        </div>
      );
    }

    // 5. Facilities Include vs Exclude widget
    if (widget === 'facilities') {
      const mountainId = params.get('mountain') || 'rinjani';
      const targetMountain = mountains.find(m => m.id === mountainId) || mountains[0];
      const theme = (params.get('theme') as any) || 'amber';
      return (
        <div className="w-screen h-screen bg-transparent overflow-hidden flex items-center justify-center">
          <FacilitiesWidget mountain={targetMountain} theme={theme} />
        </div>
      );
    }

    // 6. QR Code widget
    if (widget === 'qr-code') {
      const waNumber = params.get('wa') || streamState.whatsappNumber;
      const mountainName = params.get('mountain') || undefined;
      const callout = params.get('callout') || undefined;
      return (
        <div className="w-screen h-screen bg-transparent overflow-hidden flex items-center justify-center">
          <QRCodeWidget waNumber={waNumber} mountainName={mountainName} callout={callout} />
        </div>
      );
    }
  }

  // ---------------------------------------------------------------------------
  // VIEW MODE 1: OBS OVERLAY ONLY (?view=overlay)
  // Clean 9:16 vertical overlay for OBS Browser Source without any controls
  // ---------------------------------------------------------------------------
  if (urlParams.view === 'overlay') {
    return (
      <div id="obs-standalone-view" className="w-screen h-screen bg-transparent overflow-hidden">
        <OBSOverlayView
          state={streamState}
          mountains={mountains}
          onToggleQR={() => handleUpdateStreamState({ qrModalActive: !streamState.qrModalActive })}
          isStandaloneOverlay={true}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW MODE 2: REMOTE CONTROLLER ONLY (?view=controller)
  // Handheld Stream Deck for smartphone / tablet
  // ---------------------------------------------------------------------------
  if (urlParams.view === 'controller') {
    return (
      <div
        id="remote-controller-view"
        className="min-h-screen bg-slate-950 p-3 md:p-6 text-white max-w-2xl mx-auto"
      >
        <header className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-base font-black tracking-tight text-white">
              HP Stream Deck Remote
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOverlayCustomizerOpen(true)}
              className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Kustom Overlay</span>
            </button>
            <a
              href="?"
              className="text-xs text-slate-400 font-bold hover:text-white transition"
            >
              Mode PC →
            </a>
          </div>
        </header>

        <VirtualStreamDeck
          state={streamState}
          mountains={mountains}
          onUpdateState={handleUpdateStreamState}
          onOpenMountainManager={() => setIsMountainManagerOpen(true)}
          onOpenOBSGuide={() => setIsOBSGuideOpen(true)}
          onOpenOverlayCustomizer={() => setIsOverlayCustomizerOpen(true)}
        />

        {isOverlayCustomizerOpen && (
          <OverlayCustomizerModal
            customization={streamState.customization}
            onUpdateCustomization={(updated) => {
              handleUpdateStreamState({
                customization: {
                  ...streamState.customization,
                  ...updated,
                },
              });
            }}
            onClose={() => setIsOverlayCustomizerOpen(false)}
          />
        )}

        {isMountainManagerOpen && (
          <MountainManagerModal
            mountains={mountains}
            onSaveMountains={handleSaveMountains}
            onClose={() => setIsMountainManagerOpen(false)}
          />
        )}

        {isOBSGuideOpen && (
          <OBSGuideModal onClose={() => setIsOBSGuideOpen(false)} />
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // DEFAULT: STUDIO WORKSPACE (DUAL VIEW: OBS PREVIEW + STREAM DECK)
  // ---------------------------------------------------------------------------
  return (
    <div
      id="studio-workspace-container"
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]"
    >
      {/* Navigation Bar */}
      <header
        id="studio-header-nav"
        className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-4 py-3 sticky top-0 z-30 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Flame className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-white">
                RVTik PeakStream Studio
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-extrabold text-[10px] uppercase">
                Customizable OBS Overlay
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Virtual Stream Deck & Interactive Pamflet Overlay untuk OBS Studio (TikTok / Shopee Live)
            </p>
          </div>
        </div>

        {/* View Switchers & Guide */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOverlayCustomizerOpen(true)}
            id="btn-nav-customizer"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Kustom Overlay</span>
          </button>

          {/* Tab Switchers: Widget Hub vs Dual Studio */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-2xl border border-slate-700 shadow-inner">
            <button
              onClick={() => setStudioTab('hub')}
              id="tab-btn-widget-hub"
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                studioTab === 'hub'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span>Link Widget OBS</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-300">
                Baru
              </span>
            </button>

            <button
              onClick={() => setStudioTab('dual')}
              id="tab-btn-dual-studio"
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                studioTab === 'dual'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dual Studio OBS</span>
            </button>
          </div>

          <button
            onClick={() => setIsMountainManagerOpen(true)}
            id="btn-nav-manage-mountains"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Kelola Gunung</span>
          </button>

          <button
            onClick={() => setIsOBSGuideOpen(true)}
            id="btn-nav-obs-guide"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-black border border-amber-500/40 flex items-center gap-1.5 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Panduan OBS</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      {studioTab === 'hub' ? (
        <WidgetHub
          mountains={mountains}
          whatsappNumber={streamState.whatsappNumber}
          onOpenMountainManager={() => setIsMountainManagerOpen(true)}
          onOpenFullOBSGuide={() => setIsOBSGuideOpen(true)}
        />
      ) : (
        /* Main Dual Workspace Layout */
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: OBS Live Monitor (9:16 Aspect) */}
        <section
          id="obs-live-monitor-section"
          className="lg:col-span-5 flex flex-col items-center gap-2"
        >
          <div className="w-full flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Monitor Live OBS (1080 x 1920)
              </span>
            </div>
            <button
              onClick={() => setIsOverlayCustomizerOpen(true)}
              className="text-[10px] font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <Sliders className="w-3 h-3" />
              <span>Ubah Posisi / Transparan</span>
            </button>
          </div>

          {/* The OBS Overlay Component in true 9:16 vertical smartphone frame */}
          <div className="w-full flex justify-center py-1">
            <div className="w-full max-w-[370px] aspect-[9/16] rounded-[2.5rem] p-2.5 bg-slate-900 border-4 border-slate-700/80 shadow-2xl relative flex flex-col shrink-0">
              {/* Top phone camera / speaker pill */}
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center gap-2 border border-slate-800 pointer-events-none shadow-inner">
                <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                <span className="w-10 h-1 rounded-full bg-slate-800"></span>
              </div>

              {/* Inner 9:16 Canvas */}
              <div className="w-full h-full rounded-[2rem] overflow-hidden relative flex flex-col bg-slate-950">
                <OBSOverlayView
                  state={streamState}
                  mountains={mountains}
                  onToggleQR={() =>
                    handleUpdateStreamState({ qrModalActive: !streamState.qrModalActive })
                  }
                  isStandaloneOverlay={false}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Format Layar: <strong className="text-amber-300 font-extrabold">9:16 Vertikal (1080 × 1920)</strong></span>
          </div>
        </section>

        {/* Right Column: Virtual Stream Deck & Controls */}
        <section
          id="stream-deck-controller-section"
          className="lg:col-span-7 flex flex-col gap-4"
        >
          <VirtualStreamDeck
            state={streamState}
            mountains={mountains}
            onUpdateState={handleUpdateStreamState}
            onOpenMountainManager={() => setIsMountainManagerOpen(true)}
            onOpenOBSGuide={() => setIsOBSGuideOpen(true)}
            onOpenOverlayCustomizer={() => setIsOverlayCustomizerOpen(true)}
          />
        </section>
      </main>
      )}

      {/* Modals */}
      {isOverlayCustomizerOpen && (
        <OverlayCustomizerModal
          customization={streamState.customization}
          onUpdateCustomization={(updated) => {
            handleUpdateStreamState({
              customization: {
                ...streamState.customization,
                ...updated,
              },
            });
          }}
          onClose={() => setIsOverlayCustomizerOpen(false)}
        />
      )}

      {isMountainManagerOpen && (
        <MountainManagerModal
          mountains={mountains}
          onSaveMountains={handleSaveMountains}
          onClose={() => setIsMountainManagerOpen(false)}
        />
      )}

      {isOBSGuideOpen && (
        <OBSGuideModal onClose={() => setIsOBSGuideOpen(false)} />
      )}
    </div>
  );
}
