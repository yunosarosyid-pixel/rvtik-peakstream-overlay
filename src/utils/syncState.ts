import { StreamState, MountainTrip } from '../types';
import { INITIAL_MOUNTAINS } from '../data/initialMountains';

const STREAM_STATE_KEY = 'rvtik_peakstream_state_v1';
const MOUNTAINS_KEY = 'rvtik_peakstream_mountains_v1';

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
  pipPosition: 'bottom-right'
};

// Create a BroadcastChannel for instantaneous cross-tab communication
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('rvtik_peakstream_channel');
  }
} catch {
  // broadcastChannel not supported
}

export function loadSavedStreamState(): StreamState {
  try {
    const raw = localStorage.getItem(STREAM_STATE_KEY);
    if (raw) {
      return { ...DEFAULT_STREAM_STATE, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Error loading stream state', e);
  }
  return DEFAULT_STREAM_STATE;
}

export function saveStreamState(state: StreamState) {
  try {
    localStorage.setItem(STREAM_STATE_KEY, JSON.stringify(state));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'STATE_UPDATED', state });
    }
  } catch (e) {
    console.warn('Error saving stream state', e);
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
}

export function subscribeToSync(
  onStateUpdate: (state: StreamState) => void,
  onMountainsUpdate: (mountains: MountainTrip[]) => void
) {
  const channelListener = (event: MessageEvent) => {
    if (event.data?.type === 'STATE_UPDATED' && event.data.state) {
      onStateUpdate(event.data.state);
    }
    if (event.data?.type === 'MOUNTAINS_UPDATED' && event.data.mountains) {
      onMountainsUpdate(event.data.mountains);
    }
  };

  const storageListener = (event: StorageEvent) => {
    if (event.key === STREAM_STATE_KEY && event.newValue) {
      try {
        onStateUpdate(JSON.parse(event.newValue));
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

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', channelListener);
  }
  window.addEventListener('storage', storageListener);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', channelListener);
    }
    window.removeEventListener('storage', storageListener);
  };
}
