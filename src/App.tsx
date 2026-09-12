import { useState, useEffect } from 'react';
import { MountainTrip, StreamState } from './types';
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
} from 'lucide-react';

export default function App() {
  const [streamState, setStreamState] = useState<StreamState>(() => loadSavedStreamState());
  const [mountains, setMountains] = useState<MountainTrip[]>(() => loadSavedMountains());
  const [isMountainManagerOpen, setIsMountainManagerOpen] = useState(false);
  const [isOBSGuideOpen, setIsOBSGuideOpen] = useState(false);
  const [isOverlayCustomizerOpen, setIsOverlayCustomizerOpen] = useState(false);

  // Read view mode from URL params: ?view=overlay | ?view=controller
  const [viewParam, setViewParam] = useState<'studio' | 'overlay' | 'controller'>('studio');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'overlay') {
      setViewParam('overlay');
    } else if (view === 'controller') {
      setViewParam('controller');
    } else {
      setViewParam('studio');
    }
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
  // VIEW MODE 1: OBS OVERLAY ONLY (?view=overlay)
  // Clean 9:16 vertical overlay for OBS Browser Source without any controls
  // ---------------------------------------------------------------------------
  if (viewParam === 'overlay') {
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
  if (viewParam === 'controller') {
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

          {/* Quick View Mode Links */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('view');
                window.history.pushState({}, '', url);
                setViewParam('studio');
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dual Studio</span>
            </button>

            <a
              href="?view=overlay"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition hover:bg-slate-700"
              title="Buka Overlay khusus OBS Browser Source di tab baru"
            >
              <Tv className="w-3.5 h-3.5 text-amber-400" />
              <span>OBS Layar (9:16)</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href="?view=controller"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition hover:bg-slate-700"
              title="Buka Remote Controller di tab baru atau HP"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Remote HP</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
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
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Panduan OBS</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
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
