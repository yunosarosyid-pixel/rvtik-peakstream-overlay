import { TripPackage, StreamSettings, SyncMessage } from '../types';
import { DEFAULT_TRIPS, DEFAULT_SETTINGS } from '../data/defaultTrips';

const SETTINGS_STORAGE_KEY = 'peakstream_settings_v1';
const TRIPS_STORAGE_KEY = 'peakstream_trips_v1';
const CHANNEL_NAME = 'peakstream_sync_channel';

let channel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported', e);
}

export function loadSettings(): StreamSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: StreamSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    broadcastMessage({
      type: 'UPDATE_SETTINGS',
      payload: settings,
      timestamp: Date.now()
    });
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadTrips(): TripPackage[] {
  if (typeof window === 'undefined') return DEFAULT_TRIPS;
  try {
    const raw = localStorage.getItem(TRIPS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load trips', e);
  }
  return DEFAULT_TRIPS;
}

export function saveTrips(trips: TripPackage[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
    broadcastMessage({
      type: 'UPDATE_TRIPS',
      payload: trips,
      timestamp: Date.now()
    });
  } catch (e) {
    console.error('Failed to save trips', e);
  }
}

export function broadcastMessage(msg: SyncMessage) {
  if (channel) {
    channel.postMessage(msg);
  }
}

export function subscribeToSync(callback: (msg: SyncMessage) => void) {
  const handleBroadcast = (event: MessageEvent<SyncMessage>) => {
    if (event.data) {
      callback(event.data);
    }
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === SETTINGS_STORAGE_KEY && event.newValue) {
      callback({
        type: 'UPDATE_SETTINGS',
        payload: JSON.parse(event.newValue),
        timestamp: Date.now()
      });
    } else if (event.key === TRIPS_STORAGE_KEY && event.newValue) {
      callback({
        type: 'UPDATE_TRIPS',
        payload: JSON.parse(event.newValue),
        timestamp: Date.now()
      });
    }
  };

  if (channel) {
    channel.addEventListener('message', handleBroadcast);
  }
  window.addEventListener('storage', handleStorage);

  return () => {
    if (channel) {
      channel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener('storage', handleStorage);
  };
}
