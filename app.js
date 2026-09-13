/**
 * OBS OPEN TRIP REAL-TIME ENGINE (app.js)
 * Standalone browser file for /app.js
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OpenTripSync = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DEFAULT_TRIPS = [
    {
      id: 'sindoro-01',
      name: 'GUNUNG SINDORO',
      via: 'VIA WATU LUNYU',
      slogan: 'Yuk Ikut Mendaki...',
      mdpl: 3153,
      date_range: '5 Hari 4 Malam',
      duration: '5 Hari 4 Malam',
      price: 'IDR 950.000',
      meeting_point: 'Jakarta - Solo - Madiun - Banyuwangi',
      mountain_info: 'Watu Play Mountain',
      slot_remaining: 6,
      slot_total: 15,
      brand_handle: '@KITA ADVENTURE INDONESIA',
      image_url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80',
      badge_text: 'POPULAR',
      order_index: 0,
      is_active: true
    },
    {
      id: 'rinjani-02',
      name: 'GUNUNG RINJANI',
      via: 'VIA SEMBALUN',
      slogan: 'Yuk Ikut Mendaki...',
      mdpl: 3726,
      date_range: '4 Hari 3 Malam',
      duration: '4 Hari 3 Malam',
      price: 'IDR 2.450.000',
      meeting_point: 'Bandara Lombok - Mataram',
      mountain_info: 'Danau Segara Anak',
      slot_remaining: 3,
      slot_total: 12,
      brand_handle: '@KITA ADVENTURE INDONESIA',
      image_url: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1000&q=80',
      badge_text: 'LIMITED SEAT',
      order_index: 1,
      is_active: true
    },
    {
      id: 'prau-03',
      name: 'GUNUNG PRAU',
      via: 'VIA PATAKBANTENG',
      slogan: 'Yuk Ikut Mendaki...',
      mdpl: 2565,
      date_range: '2 Hari 1 Malam',
      duration: '2 Hari 1 Malam',
      price: 'IDR 550.000',
      meeting_point: 'Stasiun Purwokerto - Wonosobo',
      mountain_info: 'Sunrise Camp Bukit Teletubbies',
      slot_remaining: 8,
      slot_total: 20,
      brand_handle: '@KITA ADVENTURE INDONESIA',
      image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
      badge_text: 'BEST SELLER',
      order_index: 2,
      is_active: true
    },
    {
      id: 'merbabu-04',
      name: 'GUNUNG MERBABU',
      via: 'VIA SUWANTING',
      slogan: 'Yuk Ikut Mendaki...',
      mdpl: 3142,
      date_range: '3 Hari 2 Malam',
      duration: '3 Hari 2 Malam',
      price: 'IDR 850.000',
      meeting_point: 'Solo - Yogyakarta - Semarang',
      mountain_info: 'Sabana Indah & Triangulasi',
      slot_remaining: 5,
      slot_total: 16,
      brand_handle: '@KITA ADVENTURE INDONESIA',
      image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      badge_text: 'PROMO LIVE',
      order_index: 3,
      is_active: true
    },
    {
      id: 'bromo-05',
      name: 'BROMO SUNRISE',
      via: 'VIA CEMORO LAWANG',
      slogan: 'Yuk Ikut Mendaki...',
      mdpl: 2329,
      date_range: '2 Hari 1 Malam',
      duration: '2 Hari 1 Malam',
      price: 'IDR 450.000',
      meeting_point: 'Stasiun Malang - Surabaya',
      mountain_info: 'Penanjakan & Pasir Berbisik',
      slot_remaining: 10,
      slot_total: 25,
      brand_handle: '@KITA ADVENTURE INDONESIA',
      image_url: 'https://images.unsplash.com/photo-1602153508753-4ace888c10a0?auto=format&fit=crop&w=1000&q=80',
      badge_text: 'WEEKEND TRIP',
      order_index: 4,
      is_active: true
    },
    {
      id: 'ijen-06',
      name: 'KAWAH IJEN',
      via: 'VIA PALTUDING',
      slogan: 'Yuk Ikut Mendaki...',
      mdpl: 2799,
      date_range: '3 Hari 2 Malam',
      duration: '3 Hari 2 Malam',
      price: 'IDR 950.000',
      meeting_point: 'Surabaya - Banyuwangi',
      mountain_info: 'Blue Fire & Sunrise Kawah',
      slot_remaining: 4,
      slot_total: 18,
      brand_handle: '@KITA ADVENTURE INDONESIA',
      image_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=80',
      badge_text: 'BLUE FIRE',
      order_index: 5,
      is_active: true
    }
  ];

  const DEFAULT_SETTINGS = {
    id: 'stream_settings',
    running_text: '⛰️ OPEN TRIP GUNUNG NUSANTARA SPESIAL LIVE STREAMING • BOOKING SEKARANG HUBUNGI WHATSAPP DI BIO • SISA SEAT TERBATAS SIAPA CEPAT DIA DAPAT! • FASILITAS LENGKAP & GUIDE BERPENGALAMAN',
    active_trip_index: 0,
    auto_slide: true,
    slide_interval_seconds: 8,
    wa_number: '081234567890 / 081234567890',
    booking_title: 'BOOKING OPEN TRIP',
    brand_handle: '@KITA ADVENTURE INDONESIA',
    qris_image_url: '',
    cta_headline: 'BOOKING OPEN TRIP',
    cta_subtext: '081234567890 / 081234567890',
    theme_preset: 'white-alpine', // white-alpine (video style), cyber-gold, emerald-nature
    animation_style: 'smooth-3d', // smooth-3d, cinematic-zoom, card-flip, slide-drift
    updated_at: new Date().toISOString()
  };

  const STORAGE_KEYS = {
    CONFIG: 'obs_opentrip_supabase_config',
    TRIPS: 'obs_opentrip_local_trips',
    SETTINGS: 'obs_opentrip_local_settings',
    CURRENT_SLIDE: 'obs_opentrip_current_slide'
  };

  let broadcastChannel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannel = new BroadcastChannel('obs_open_trip_sync_channel');
    }
  } catch (e) {
    console.warn('BroadcastChannel not supported:', e);
  }

  let supabaseClient = null;
  let isSupabaseConnected = false;

  const tripsListeners = new Set();
  const settingsListeners = new Set();
  const slideListeners = new Set();
  const connectionListeners = new Set();

  let cachedTrips = [];
  let cachedSettings = { ...DEFAULT_SETTINGS };
  let currentActiveIndex = 0;

  function loadLocalData() {
    try {
      const savedTrips = localStorage.getItem(STORAGE_KEYS.TRIPS);
      if (savedTrips) {
        const parsed = JSON.parse(savedTrips);
        cachedTrips = Array.isArray(parsed) && parsed.length > 0 
          ? parsed.map((t, idx) => ({
              ...t,
              via: t.via || 'VIA WATU LUNYU',
              slogan: t.slogan || 'Yuk Ikut Mendaki...',
              meeting_point: t.meeting_point || 'Jakarta - Solo - Madiun - Banyuwangi',
              mountain_info: t.mountain_info || (t.mdpl ? t.mdpl + ' MDPL' : 'Puncak Indah'),
              brand_handle: t.brand_handle || '@KITA ADVENTURE INDONESIA'
            }))
          : [...DEFAULT_TRIPS];
      } else {
        cachedTrips = [...DEFAULT_TRIPS];
        saveLocalTrips(cachedTrips);
      }
    } catch (e) {
      cachedTrips = [...DEFAULT_TRIPS];
    }

    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        const parsedSt = JSON.parse(savedSettings);
        cachedSettings = { 
          ...DEFAULT_SETTINGS, 
          ...parsedSt,
          theme_preset: parsedSt.theme_preset || 'white-alpine',
          booking_title: parsedSt.booking_title || 'BOOKING OPEN TRIP',
          wa_number: parsedSt.wa_number || '081234567890 / 081234567890'
        };
      } else {
        cachedSettings = { ...DEFAULT_SETTINGS };
        saveLocalSettings(cachedSettings);
      }
      currentActiveIndex = cachedSettings.active_trip_index || 0;
    } catch (e) {
      cachedSettings = { ...DEFAULT_SETTINGS };
    }
  }

  function generateUuid() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      try { return crypto.randomUUID(); } catch (e) {}
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function saveLocalTrips(trips) {
    cachedTrips = [...trips];
    try {
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(cachedTrips));
    } catch (e) {
      console.warn('LocalStorage quota warning, trying lightweight payload:', e);
      try {
        // If quota exceeded due to heavy base64 images, compress or fallback
        const sanitized = cachedTrips.map(t => ({
          ...t,
          image_url: (t.image_url && t.image_url.startsWith('data:image') && t.image_url.length > 250000)
            ? 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
            : t.image_url
        }));
        localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(sanitized));
      } catch (err2) {
        console.error('LocalStorage critical error:', err2);
      }
    }
  }

  function saveLocalSettings(settings) {
    cachedSettings = { ...cachedSettings, ...settings, updated_at: new Date().toISOString() };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(cachedSettings));
    } catch (e) {}
  }

  function broadcast(type, payload) {
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type, payload, timestamp: Date.now() });
      } catch (e) {}
    }
  }

  if (broadcastChannel) {
    broadcastChannel.onmessage = function (event) {
      const { type, payload } = event.data || {};
      if (type === 'TRIPS_UPDATE') {
        cachedTrips = payload;
        notifyTrips();
      } else if (type === 'SETTINGS_UPDATE') {
        cachedSettings = payload;
        if (typeof payload.active_trip_index === 'number') {
          currentActiveIndex = payload.active_trip_index;
          notifySlide();
        }
        notifySettings();
      } else if (type === 'SLIDE_CHANGE') {
        currentActiveIndex = payload.index;
        notifySlide();
      }
    };
  }

  function notifyTrips() {
    tripsListeners.forEach(fn => {
      try { fn(cachedTrips); } catch (e) { console.error(e); }
    });
  }

  function notifySettings() {
    settingsListeners.forEach(fn => {
      try { fn(cachedSettings); } catch (e) { console.error(e); }
    });
  }

  function notifySlide() {
    slideListeners.forEach(fn => {
      try { fn(currentActiveIndex, cachedTrips[currentActiveIndex]); } catch (e) { console.error(e); }
    });
  }

  function notifyConnection(status) {
    connectionListeners.forEach(fn => {
      try { fn(status); } catch (e) { console.error(e); }
    });
  }

  function initSupabase(url, key) {
    const supabaseLib = window.supabase;
    if (!supabaseLib || !url || !key) {
      isSupabaseConnected = false;
      notifyConnection({ connected: false, mode: 'local' });
      return false;
    }

    try {
      supabaseClient = supabaseLib.createClient(url, key);
      isSupabaseConnected = true;
      notifyConnection({ connected: true, mode: 'supabase' });
      syncFromSupabase();
      subscribeSupabaseRealtime();
      return true;
    } catch (err) {
      console.error('Failed to init Supabase:', err);
      isSupabaseConnected = false;
      notifyConnection({ connected: false, mode: 'local', error: err.message });
      return false;
    }
  }

  async function syncFromSupabase() {
    if (!supabaseClient) return;
    try {
      const { data: tripsData, error: tripsErr } = await supabaseClient
        .from('trips')
        .select('*')
        .order('order_index', { ascending: true });

      if (!tripsErr && tripsData) {
        if (tripsData.length > 0) {
          // Identify any trips created locally that are not yet in Supabase
          const supabaseIds = new Set(tripsData.map(t => t.id));
          const localOnlyTrips = cachedTrips.filter(t => t && t.id && !supabaseIds.has(t.id));

          // Retain local trips and try to upload them to Supabase
          if (localOnlyTrips.length > 0) {
            for (const localTrip of localOnlyTrips) {
              tripsData.push(localTrip);
              try {
                await supabaseClient.from('trips').upsert(localTrip);
              } catch (e) {}
            }
          }

          cachedTrips = tripsData.map(t => ({
            ...t,
            via: t.via || 'VIA STANDAR',
            slogan: t.slogan || 'Yuk Ikut Mendaki...',
            meeting_point: t.meeting_point || t.date_range || '',
            mountain_info: t.mountain_info || (t.mdpl ? t.mdpl + ' MDPL' : ''),
            brand_handle: t.brand_handle || '@KITA ADVENTURE INDONESIA'
          }));
          cachedTrips.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
          saveLocalTrips(cachedTrips);
          notifyTrips();
        } else if (tripsData.length === 0 && cachedTrips.length > 0) {
          // Supabase table is empty: seed local trips to Supabase instead of wiping local data!
          for (const t of cachedTrips) {
            try { await supabaseClient.from('trips').upsert(t); } catch (e) {}
          }
        }
      }

      const { data: settingsData, error: settingsErr } = await supabaseClient
        .from('settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!settingsErr && settingsData) {
        cachedSettings = { ...DEFAULT_SETTINGS, ...settingsData };
        saveLocalSettings(cachedSettings);
        currentActiveIndex = cachedSettings.active_trip_index || 0;
        notifySettings();
        notifySlide();
      }
    } catch (e) {
      console.warn('Sync from Supabase failed, using local cache:', e);
    }
  }

  function subscribeSupabaseRealtime() {
    if (!supabaseClient) return;
    try {
      supabaseClient
        .channel('trips_realtime_channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'trips' },
          (payload) => handleRealtimeTripChange(payload)
        )
        .subscribe();

      supabaseClient
        .channel('settings_realtime_channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'settings' },
          (payload) => handleRealtimeSettingsChange(payload)
        )
        .subscribe();
    } catch (e) {
      console.warn('Supabase realtime subscription error:', e);
    }
  }

  function handleRealtimeTripChange(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    let updated = [...cachedTrips];

    if (eventType === 'INSERT') {
      const existsIndex = updated.findIndex(t => t.id === newRecord.id);
      if (existsIndex >= 0) {
        updated[existsIndex] = newRecord;
      } else {
        updated.push(newRecord);
      }
    } else if (eventType === 'UPDATE') {
      const idx = updated.findIndex(t => t.id === newRecord.id);
      if (idx >= 0) {
        updated[idx] = newRecord;
      } else {
        updated.push(newRecord);
      }
    } else if (eventType === 'DELETE') {
      updated = updated.filter(t => t.id !== oldRecord.id);
    }

    updated.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
    saveLocalTrips(updated);
    broadcast('TRIPS_UPDATE', updated);
    notifyTrips();
    notifySlide();
  }

  function handleRealtimeSettingsChange(payload) {
    const { new: newRecord } = payload;
    if (newRecord) {
      cachedSettings = { ...cachedSettings, ...newRecord };
      saveLocalSettings(cachedSettings);
      if (typeof newRecord.active_trip_index === 'number') {
        currentActiveIndex = newRecord.active_trip_index;
        notifySlide();
      }
      broadcast('SETTINGS_UPDATE', cachedSettings);
      notifySettings();
    }
  }

  const api = {
    init: function () {
      loadLocalData();

      const params = new URLSearchParams(window.location.search);
      const paramUrl = params.get('sb_url');
      const paramKey = params.get('sb_key');

      let config = null;
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
        if (stored) config = JSON.parse(stored);
      } catch (e) {}

      const supabaseUrl = paramUrl || (config && config.url) || '';
      const supabaseKey = paramKey || (config && config.key) || '';

      if (supabaseUrl && supabaseKey) {
        initSupabase(supabaseUrl, supabaseKey);
      } else {
        notifyConnection({ connected: false, mode: 'local' });
      }

      setTimeout(() => {
        notifyTrips();
        notifySettings();
        notifySlide();
      }, 50);

      return this;
    },

    getTrips: function () {
      return [...cachedTrips];
    },

    getSettings: function () {
      return { ...cachedSettings };
    },

    getCurrentSlideIndex: function () {
      return currentActiveIndex;
    },

    onTripsChange: function (callback) {
      tripsListeners.add(callback);
      if (cachedTrips.length > 0) callback(cachedTrips);
      return () => tripsListeners.delete(callback);
    },

    onSettingsChange: function (callback) {
      settingsListeners.add(callback);
      callback(cachedSettings);
      return () => settingsListeners.delete(callback);
    },

    onSlideChange: function (callback) {
      slideListeners.add(callback);
      callback(currentActiveIndex, cachedTrips[currentActiveIndex]);
      return () => slideListeners.delete(callback);
    },

    onConnectionChange: function (callback) {
      connectionListeners.add(callback);
      callback({ connected: isSupabaseConnected, mode: isSupabaseConnected ? 'supabase' : 'local' });
      return () => connectionListeners.delete(callback);
    },

    adjustSlot: async function (tripId, delta) {
      const idx = cachedTrips.findIndex(t => t.id === tripId);
      if (idx === -1) return;

      const trip = { ...cachedTrips[idx] };
      const newSlot = Math.max(0, (trip.slot_remaining || 0) + delta);
      trip.slot_remaining = newSlot;

      if (newSlot <= 2 && newSlot > 0) {
        trip.badge_text = `SISA ${newSlot} SLOT!`;
      } else if (newSlot === 0) {
        trip.badge_text = 'KUOTA HABIS';
      }

      cachedTrips[idx] = trip;
      saveLocalTrips(cachedTrips);
      broadcast('TRIPS_UPDATE', cachedTrips);
      notifyTrips();
      notifySlide();

      if (isSupabaseConnected && supabaseClient) {
        try {
          await supabaseClient
            .from('trips')
            .update({ slot_remaining: newSlot, badge_text: trip.badge_text })
            .eq('id', tripId);
        } catch (e) {
          console.error('Supabase slot update error:', e);
        }
      }
    },

    saveTrip: async function (tripData) {
      let updated = [...cachedTrips];
      let finalTrip = { ...tripData };

      if (!finalTrip.id || String(finalTrip.id).trim() === '') {
        finalTrip.id = generateUuid();
      }

      const idx = updated.findIndex(t => t.id === finalTrip.id);
      if (idx >= 0) {
        updated[idx] = finalTrip;
      } else {
        finalTrip.order_index = updated.length;
        updated.push(finalTrip);
      }

      saveLocalTrips(updated);
      broadcast('TRIPS_UPDATE', updated);
      notifyTrips();
      notifySlide();

      if (isSupabaseConnected && supabaseClient) {
        try {
          const res = await supabaseClient.from('trips').upsert(finalTrip);
          if (res.error) {
            console.warn('Supabase upsert warning, retrying with core columns:', res.error);
            // Fallback for tables that don't yet have via, slogan, meeting_point, mountain_info, brand_handle columns
            const coreTrip = {
              id: finalTrip.id,
              name: finalTrip.name,
              mdpl: finalTrip.mdpl || 0,
              date_range: finalTrip.date_range || finalTrip.meeting_point || '',
              duration: finalTrip.duration || '3H2M',
              price: finalTrip.price || '',
              slot_remaining: finalTrip.slot_remaining !== undefined ? finalTrip.slot_remaining : 5,
              slot_total: finalTrip.slot_total || 15,
              image_url: finalTrip.image_url || '',
              badge_text: finalTrip.badge_text || 'HOT DEAL',
              order_index: finalTrip.order_index || 0,
              is_active: finalTrip.is_active !== undefined ? finalTrip.is_active : true
            };
            const retry = await supabaseClient.from('trips').upsert(coreTrip);
            if (retry.error) {
              console.error('Supabase fallback upsert error:', retry.error);
              return { success: false, error: res.error.message || retry.error.message };
            }
          }
          return { success: true };
        } catch (e) {
          console.error('Supabase save trip error:', e);
          return { success: false, error: e.message };
        }
      }
      return { success: true };
    },

    deleteTrip: async function (tripId) {
      const updated = cachedTrips.filter(t => t.id !== tripId);
      saveLocalTrips(updated);
      if (currentActiveIndex >= updated.length) {
        currentActiveIndex = Math.max(0, updated.length - 1);
      }
      broadcast('TRIPS_UPDATE', updated);
      notifyTrips();
      notifySlide();

      if (isSupabaseConnected && supabaseClient) {
        try {
          await supabaseClient.from('trips').delete().eq('id', tripId);
        } catch (e) {
          console.error('Supabase delete trip error:', e);
        }
      }
    },

    updateRunningText: async function (text) {
      return this.updateSettings({ running_text: text });
    },

    setActiveSlide: async function (index) {
      if (cachedTrips.length === 0) return;
      const safeIndex = ((index % cachedTrips.length) + cachedTrips.length) % cachedTrips.length;
      currentActiveIndex = safeIndex;

      cachedSettings.active_trip_index = safeIndex;
      saveLocalSettings(cachedSettings);

      broadcast('SLIDE_CHANGE', { index: safeIndex });
      broadcast('SETTINGS_UPDATE', cachedSettings);
      notifySlide();

      if (isSupabaseConnected && supabaseClient) {
        try {
          await supabaseClient
            .from('settings')
            .update({ active_trip_index: safeIndex })
            .eq('id', cachedSettings.id || 'stream_settings');
        } catch (e) {
          console.error('Supabase slide update error:', e);
        }
      }
    },

    nextSlide: function () {
      return this.setActiveSlide(currentActiveIndex + 1);
    },

    prevSlide: function () {
      return this.setActiveSlide(currentActiveIndex - 1);
    },

    updateSettings: async function (newFields) {
      cachedSettings = { ...cachedSettings, ...newFields, updated_at: new Date().toISOString() };
      saveLocalSettings(cachedSettings);
      broadcast('SETTINGS_UPDATE', cachedSettings);
      notifySettings();

      if (isSupabaseConnected && supabaseClient) {
        try {
          await supabaseClient
            .from('settings')
            .update(newFields)
            .eq('id', cachedSettings.id || 'stream_settings');
        } catch (e) {
          console.error('Supabase update settings error:', e);
        }
      }
    },

    getSupabaseConfig: function () {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
        return stored ? JSON.parse(stored) : { url: '', key: '' };
      } catch (e) {
        return { url: '', key: '' };
      }
    },

    saveSupabaseConfig: function (url, key) {
      const cleanUrl = (url || '').trim();
      const cleanKey = (key || '').trim();
      try {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify({ url: cleanUrl, key: cleanKey }));
      } catch (e) {}

      if (cleanUrl && cleanKey) {
        return initSupabase(cleanUrl, cleanKey);
      } else {
        isSupabaseConnected = false;
        notifyConnection({ connected: false, mode: 'local' });
        return false;
      }
    },

    testConnection: async function (url, key) {
      const supabaseLib = window.supabase;
      if (!supabaseLib) return { success: false, message: 'Supabase JS library belum dimuat.' };
      if (!url || !key) return { success: false, message: 'URL & Anon Key wajib diisi.' };

      try {
        const testClient = supabaseLib.createClient(url, key);
        const { data, error } = await testClient.from('trips').select('id').limit(1);
        if (error) {
          return { success: false, message: 'Koneksi gagal: ' + error.message };
        }
        return { success: true, message: 'Koneksi Berhasil! Database Supabase siap digunakan.' };
      } catch (err) {
        return { success: false, message: 'Error koneksi: ' + err.message };
      }
    },

    resetToDefault: function () {
      cachedTrips = [...DEFAULT_TRIPS];
      cachedSettings = { ...DEFAULT_SETTINGS };
      currentActiveIndex = 0;
      saveLocalTrips(cachedTrips);
      saveLocalSettings(cachedSettings);
      broadcast('TRIPS_UPDATE', cachedTrips);
      broadcast('SETTINGS_UPDATE', cachedSettings);
      broadcast('SLIDE_CHANGE', { index: 0 });
      notifyTrips();
      notifySettings();
      notifySlide();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
      api.init();
    });
  }

  return api;
});
