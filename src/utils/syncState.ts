import { StreamState, MountainTrip, OverlayCustomization } from '../types';
import { INITIAL_MOUNTAINS } from '../data/initialMountains';

const STREAM_STATE_KEY = 'rvtik_peakstream_state_v2';
const MOUNTAINS_KEY = 'rvtik_peakstream_mountains_v2';

export const DEFAULT_OVERLAY_CUSTOMIZATION: OverlayCustomization = {
  bgMode: 'transparent',
  showWebcamLayer: false, // Default false: streamer uses their real OBS camera!
  showTopBanner: true,
  showTripCard: true,
  cardPosition: 'bottom', // 'bottom' allows streamer webcam & existing top banner in OBS to show through
  cardSize: 'compact',
  cardTheme: 'amber-gold',
  cardOpacity: 92,
  showStamp: true,
  stampPosition: 'top-right',
  showTicker: true,
  showLiveBadge: true,
  showTapNotice: true,
  showChatNotice: true,
  showQRPass: false,
  customHeadline: 'OPEN TRIP GUNUNG SIAP BERANGKAT',
  customCallout: 'TANYA JALUR & BOOKING VIA CHAT!',
  preset: 'transparent_hud'
};

export const DEFAULT_STREAM_STATE: StreamState = {
  mode: 'mode1_facecam',
  activeMountainId: 'rinjani',
  stamp: 'FLASH_SALE',
  tickerText: '🔥 PROMO LIVE HARI INI: DAPATKAN POTONGAN SPESIAL & MERCHANDISE RESMI UNTUK SETIAP BOOKING TRIP! HUBUNGI ADMIN SEKARANG! 🔥',
  tickerEnabled: true,
  chatSpotlight: null,
  qrModalActive: false,
  whatsappNumber: '6281234567890',
  whatsappMessage: 'Halo Admin RVTik Adventure, saya mau info & booking slot Open Trip Gunung ini!',
  isLive: true,
  cameraSimulated: false,
  selectedCameraDeviceId: '',
  pipPosition: 'bottom-right',
  customization: DEFAULT_OVERLAY_CUSTOMIZATION,
  lastUpdated: Date.now()
};

// Create a BroadcastChannel for local cross-tab communication
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('rvtik_peakstream_channel_v2');
  }
} catch {
  // broadcastChannel not supported
}

let lastSyncedTimestamp = 0;

export function loadSavedStreamState(): StreamState {
  try {
    const raw = localStorage.getItem(STREAM_STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STREAM_STATE,
        ...parsed,
        customization: {
          ...DEFAULT_OVERLAY_CUSTOMIZATION,
          ...(parsed.customization || {})
        }
      };
    }
  } catch (e) {
    console.warn('Error loading stream state', e);
  }
  return DEFAULT_STREAM_STATE;
}

export function saveStreamState(state: StreamState) {
  const updatedState = { ...state, lastUpdated: Date.now() };
  try {
    localStorage.setItem(STREAM_STATE_KEY, JSON.stringify(updatedState));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'STATE_UPDATED', state: updatedState });
    }
  } catch (e) {
    console.warn('Error saving stream state to local storage', e);
  }

  // Push to backend server for OBS Browser Source / Smartphone real-time sync
  if (typeof window !== 'undefined') {
    fetch('/api/sync/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedState)
    }).catch(err => {
      // Offline / dev fallback
      console.debug('Server sync state notice:', err);
    });
  }
}

export function loadSavedMountains(): MountainTrip[] {
  try {
    const raw = localStorage.getItem(MOUNTAINS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading mountains', e);
  }
  return INITIAL_MOUNTAINS;
}

export function saveMountains(mountains: MountainTrip[]) {
  try {
    localStorage.setItem(MOUNTAINS_KEY, JSON.stringify(mountains));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'MOUNTAINS_UPDATED', mountains });
    }
  } catch (e) {
    console.warn('Error saving mountains', e);
  }

  // Push to backend server
  if (typeof window !== 'undefined') {
    fetch('/api/sync/mountains', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mountains)
    }).catch(err => {
      console.debug('Server sync mountains notice:', err);
    });
  }
}

export function subscribeToSync(
  onStateUpdate: (state: StreamState) => void,
  onMountainsUpdate: (mountains: MountainTrip[]) => void,
  onConnectionChange?: (connected: boolean) => void
) {
  // 1. Listen via BroadcastChannel (for same browser)
  const channelListener = (event: MessageEvent) => {
    if (event.data?.type === 'STATE_UPDATED' && event.data.state) {
      if (event.data.state.lastUpdated && event.data.state.lastUpdated <= lastSyncedTimestamp) {
        return;
      }
      lastSyncedTimestamp = event.data.state.lastUpdated || Date.now();
      onStateUpdate(event.data.state);
    }
    if (event.data?.type === 'MOUNTAINS_UPDATED' && event.data.mountains) {
      onMountainsUpdate(event.data.mountains);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', channelListener);
  }

  // 2. Storage event listener
  const storageListener = (event: StorageEvent) => {
    if (event.key === STREAM_STATE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (parsed.lastUpdated && parsed.lastUpdated <= lastSyncedTimestamp) return;
        lastSyncedTimestamp = parsed.lastUpdated || Date.now();
        onStateUpdate(parsed);
      } catch {
        // ignore
      }
    }
    if (event.key === MOUNTAINS_KEY && event.newValue) {
      try {
        onMountainsUpdate(JSON.parse(event.newValue));
      } catch {
        // ignore
      }
    }
  };
  window.addEventListener('storage', storageListener);

  // 3. Real-time Server-Sent Events (SSE) connection
  // Critical for OBS Browser Source & Smartphone remote across devices!
  let eventSource: EventSource | null = null;
  let sseActive = false;

  const initSSE = () => {
    try {
      if (typeof window !== 'undefined' && 'EventSource' in window) {
        eventSource = new EventSource('/api/sync/events');

        eventSource.onopen = () => {
          sseActive = true;
          if (onConnectionChange) onConnectionChange(true);
        };

        eventSource.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data.type === 'INIT' || data.type === 'STATE_UPDATED') {
              if (data.state) {
                const ts = data.state.lastUpdated || 0;
                if (ts > lastSyncedTimestamp) {
                  lastSyncedTimestamp = ts;
                  onStateUpdate(data.state);
                }
              }
              if (data.mountains && data.mountains.length > 0) {
                onMountainsUpdate(data.mountains);
              }
            } else if (data.type === 'MOUNTAINS_UPDATED' && data.mountains) {
              onMountainsUpdate(data.mountains);
            }
          } catch (err) {
            console.warn('Error parsing SSE event', err);
          }
        };

        eventSource.onerror = () => {
          sseActive = false;
          if (onConnectionChange) onConnectionChange(false);
          // Auto-reconnect handled by browser EventSource
        };
      }
    } catch (err) {
      console.warn('SSE init failed, using polling fallback', err);
    }
  };

  initSSE();

  // 4. Polling Fallback (ensures sync even if OBS CEF disconnects SSE or blocks it)
  const pollInterval = setInterval(async () => {
    try {
      const res = await fetch('/api/sync/state');
      if (res.ok) {
        const data = await res.json();
        if (data.lastUpdated && data.lastUpdated > lastSyncedTimestamp) {
          lastSyncedTimestamp = data.lastUpdated;
          if (data.state) onStateUpdate(data.state);
          if (data.mountains && data.mountains.length > 0) onMountainsUpdate(data.mountains);
        }
        if (!sseActive && onConnectionChange) {
          onConnectionChange(true);
        }
      }
    } catch {
      // silent
    }
  }, 1000);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', channelListener);
    }
    window.removeEventListener('storage', storageListener);
    if (eventSource) {
      eventSource.close();
    }
    clearInterval(pollInterval);
  };
}
