import React, { useState, useEffect } from 'react';
import {
  loadSettings,
  saveSettings,
  loadTrips,
  saveTrips,
  subscribeToSync,
} from './services/streamSync';
import { TripPackage, StreamSettings, DisplayMode } from './types';
import { ObsOverlayView } from './components/ObsOverlayView';
import { StreamDeckController } from './components/StreamDeckController';
import {
  Monitor,
  Tv,
  HelpCircle,
  ExternalLink,
  Mountain,
  Smartphone,
  Compass
} from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<StreamSettings>(loadSettings);
  const [trips, setTrips] = useState<TripPackage[]>(loadTrips);
  const [activeTab, setActiveTab] = useState<'studio' | 'overlay' | 'controller'>('studio');
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [showObsGuide, setShowObsGuide] = useState(false);

  // Parse URL query parameter for dedicated OBS view or Controller view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'overlay') {
        setActiveTab('overlay');
      } else if (viewParam === 'controller') {
        setActiveTab('controller');
      }
    }
  }, []);

  // Listen to cross-window or cross-device state updates via BroadcastChannel & localStorage
  useEffect(() => {
    const unsubscribe = subscribeToSync((msg) => {
      if (msg.type === 'UPDATE_SETTINGS') {
        setSettings(msg.payload);
      } else if (msg.type === 'UPDATE_TRIPS') {
        setTrips(msg.payload);
      } else if (msg.type === 'TRIGGER_STAMP') {
        setSettings((prev) => ({ ...prev, quickStamp: msg.payload }));
      }
    });

    // Enumerate video devices (webcam)
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoInputs = devices.filter((d) => d.kind === 'videoinput');
          setAvailableDevices(videoInputs);
        })
        .catch((err) => console.warn('Device enumeration error', err));
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Update Settings handler
  const handleUpdateSettings = (newSettings: StreamSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Update Trips handler
  const handleUpdateTrips = (newTrips: TripPackage[]) => {
    setTrips(newTrips);
    saveTrips(newTrips);
  };

  // Stamp trigger
  const handleTriggerStamp = (stamp: string | null) => {
    const updated = { ...settings, quickStamp: stamp };
    handleUpdateSettings(updated);
  };

  // PURE OBS OVERLAY VIEW (For OBS Studio Browser Source)
  if (activeTab === 'overlay') {
    return (
      <div className="w-screen h-screen bg-transparent overflow-hidden flex items-center justify-center">
        <div className="w-full h-full max-w-[1080px] max-h-[1920px] aspect-[9/16] relative overflow-hidden">
          <ObsOverlayView
            settings={settings}
            trips={trips}
            onSelectTrip={(tripId) => handleUpdateSettings({ ...settings, activeTripId: tripId })}
            onCloseQr={() => handleUpdateSettings({ ...settings, showQrPopup: false })}
            onDismissNotice={() => handleUpdateSettings({ ...settings, showNoticeSpotlight: false })}
          />
        </div>
      </div>
    );
  }

  // PURE STREAM DECK CONTROLLER (Optimized for Mobile Phone / Side Monitor)
  if (activeTab === 'controller') {
    return (
      <div className="min-h-screen bg-[#11100e] text-[#f4efe6] p-2 sm:p-4">
        {/* Simple top back-to-studio link */}
        <div className="max-w-4xl mx-auto flex items-center justify-between px-2 py-1 mb-2 text-xs text-stone-400 font-mono">
          <span className="font-bold text-[#7de39b]">
            RVTik PeakStream Remote Deck
          </span>
          <button
            onClick={() => setActiveTab('studio')}
            className="text-[11px] text-stone-300 hover:text-white underline"
          >
            Studio Dual View
          </button>
        </div>

        <StreamDeckController
          settings={settings}
          trips={trips}
          onUpdateSettings={handleUpdateSettings}
          onUpdateTrips={handleUpdateTrips}
          onTriggerStamp={handleTriggerStamp}
          availableVideoDevices={availableDevices}
        />
      </div>
    );
  }

  // DEFAULT STUDIO MODE (Side-by-side: 9:16 OBS Screen on Left + Stream Deck on Right)
  return (
    <div className="min-h-screen bg-[#11100e] text-[#f4efe6] flex flex-col font-['Plus_Jakarta_Sans']">
      {/* Top Navbar */}
      <header className="bg-[#181715] border-b border-stone-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1e3324] border border-[#2d5236] flex items-center justify-center text-[#7de39b]">
            <Mountain className="w-4 h-4 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-[#f7f4ee] font-['Outfit']">
                RVTik PeakStream Studio
              </h1>
              <span className="text-[9px] bg-[#1a2e20] text-[#7de39b] border border-[#2d5236] font-mono px-1.5 py-0.2 rounded uppercase">
                Open Trip
              </span>
            </div>
            <p className="text-[10.5px] text-stone-400 font-mono">
              OBS Overlay & Stream Deck Controller
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1.5 bg-[#12110f] p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'studio'
                ? 'bg-[#1e3324] text-[#7de39b] border border-[#2d5236]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Studio Dual View</span>
          </button>

          <button
            onClick={() => setActiveTab('controller')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'controller'
                ? 'bg-[#1e3324] text-[#7de39b] border border-[#2d5236]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remote Deck (HP)</span>
          </button>

          <button
            onClick={() => {
              window.open(`${window.location.origin}${window.location.pathname}?view=overlay`, '_blank');
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-mono text-stone-400 hover:text-[#f8a855] flex items-center gap-1.5 transition-colors"
            title="Buka Layar OBS di Tab Baru untuk Browser Source"
          >
            <Tv className="w-3.5 h-3.5 text-[#f8a855]" />
            <span className="hidden sm:inline">Pop-out OBS</span>
            <ExternalLink className="w-3 h-3 text-stone-500" />
          </button>

          <button
            onClick={() => setShowObsGuide(!showObsGuide)}
            className="p-1 text-stone-400 hover:text-[#7de39b] transition-colors"
            title="Panduan Pasang di OBS Studio"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* OBS Studio Integration Guide Banner (Expandable) */}
      {showObsGuide && (
        <div className="bg-[#181714] border-b border-stone-800 p-3.5 text-xs text-stone-300">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[#7de39b] font-mono font-bold uppercase tracking-wider block">
                PANDUAN MEMASANG DI OBS STUDIO:
              </span>
              <p className="leading-relaxed text-stone-300 font-mono text-[11px]">
                1. Di OBS Studio, tambahkan <b>Browser Source</b> di panel Sources.<br />
                2. Masukkan URL: <code className="bg-black px-1.5 py-0.5 rounded text-[#7de39b] border border-stone-800">{window.location.origin}{window.location.pathname}?view=overlay</code><br />
                3. Atur Width: <b>1080</b> dan Height: <b>1920</b> (potret 9:16).<br />
                4. Buka aplikasi ini di HP dengan mode Remote Deck untuk mengontrol secara live!
              </p>
            </div>
            <button
              onClick={() => setShowObsGuide(false)}
              className="bg-[#24211d] hover:bg-stone-700 text-stone-300 px-2.5 py-1 rounded text-xs font-mono font-bold"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Workspace: Left OBS Screen Preview, Right Stream Deck */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: 9:16 Vertical OBS Screen Live Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c53030]" />
              <span className="text-xs font-mono font-bold text-[#f7f4ee] uppercase tracking-wider">
                LAYAR SIARAN OBS (1080 x 1920)
              </span>
            </div>
            <span className="text-[10px] text-stone-400 bg-[#171614] border border-stone-800 px-2 py-0.5 rounded font-mono">
              Live Preview
            </span>
          </div>

          {/* Phone Screen Mockup Frame for Live Vertical Stream */}
          <div className="relative w-full max-w-[360px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-stone-800 shadow-2xl bg-black">
            <ObsOverlayView
              settings={settings}
              trips={trips}
              onSelectTrip={(tripId) => handleUpdateSettings({ ...settings, activeTripId: tripId })}
              onCloseQr={() => handleUpdateSettings({ ...settings, showQrPopup: false })}
              onDismissNotice={() => handleUpdateSettings({ ...settings, showNoticeSpotlight: false })}
            />
          </div>

          <p className="text-[11px] text-stone-400 font-mono text-center mt-2 max-w-xs">
            Perubahan dari panel kontrol langsung tersinkronisasi ke layar OBS ini.
          </p>
        </div>

        {/* Right Column: Virtual Stream Deck Remote Controller */}
        <div className="lg:col-span-7">
          <StreamDeckController
            settings={settings}
            trips={trips}
            onUpdateSettings={handleUpdateSettings}
            onUpdateTrips={handleUpdateTrips}
            onTriggerStamp={handleTriggerStamp}
            availableVideoDevices={availableDevices}
          />
        </div>
      </main>
    </div>
  );
}
