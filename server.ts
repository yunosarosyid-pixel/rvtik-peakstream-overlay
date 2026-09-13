import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const TRIPS_FILE = path.join(DATA_DIR, 'trips.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache & file persistence helpers
function loadTrips(): any[] {
  try {
    if (fs.existsSync(TRIPS_FILE)) {
      const raw = fs.readFileSync(TRIPS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load trips.json:', err);
  }
  return [];
}

function persistTrips(trips: any[]): void {
  try {
    fs.writeFileSync(TRIPS_FILE, JSON.stringify(trips, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write trips.json:', err);
  }
}

function loadSettings(): any {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load settings.json:', err);
  }
  return {};
}

function persistSettings(settings: any): void {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write settings.json:', err);
  }
}

let cachedTrips = loadTrips();
let cachedSettings = loadSettings();

// SSE (Server-Sent Events) for OBS & Browser clients real-time synchronization
let sseClients: Response[] = [];

function broadcast(type: string, data: any) {
  const message = `data: ${JSON.stringify({ type, data, timestamp: Date.now() })}\n\n`;
  sseClients = sseClients.filter((client) => {
    try {
      client.write(message);
      return true;
    } catch (e) {
      return false;
    }
  });
}

// Keep SSE alive every 25 seconds
setInterval(() => {
  sseClients.forEach((client) => {
    try {
      client.write(': ping\n\n');
    } catch (e) {}
  });
}, 25000);

// Express middlewares
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// CORS headers for OBS Studio CEF
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ==========================================
// REAL-TIME API ROUTES
// ==========================================

// SSE Stream
app.get('/api/events', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  // Immediately send initial state to the connecting client (e.g. OBS)
  res.write(
    `data: ${JSON.stringify({
      type: 'INIT',
      data: {
        trips: cachedTrips,
        settings: cachedSettings,
      },
      timestamp: Date.now(),
    })}\n\n`
  );

  sseClients.push(res);

  req.on('close', () => {
    sseClients = sseClients.filter((c) => c !== res);
  });
});

// Get all trips
app.get('/api/trips', (req: Request, res: Response) => {
  res.json({ success: true, trips: cachedTrips });
});

// Save / Upsert Trip
app.post('/api/trips', (req: Request, res: Response) => {
  const tripData = req.body;
  if (!tripData || !tripData.name) {
    return res.status(400).json({ success: false, error: 'Nama destinasi wajib diisi.' });
  }

  if (!tripData.id) {
    tripData.id = 'trip-' + Date.now();
  }

  const index = cachedTrips.findIndex((t: any) => t.id === tripData.id);
  if (index >= 0) {
    cachedTrips[index] = { ...cachedTrips[index], ...tripData };
  } else {
    tripData.order_index = cachedTrips.length;
    cachedTrips.push(tripData);
  }

  persistTrips(cachedTrips);
  broadcast('TRIPS_UPDATE', cachedTrips);

  res.json({ success: true, trip: tripData, trips: cachedTrips });
});

// Update Slot remaining (+1 or -1 or specific value)
app.post('/api/trips/:id/slot', (req: Request, res: Response) => {
  const { id } = req.params;
  const { delta, slot } = req.body;

  const trip = cachedTrips.find((t: any) => t.id === id);
  if (!trip) {
    return res.status(404).json({ success: false, error: 'Trip tidak ditemukan.' });
  }

  if (typeof slot === 'number') {
    trip.slot_remaining = Math.max(0, slot);
  } else if (typeof delta === 'number') {
    trip.slot_remaining = Math.max(0, (trip.slot_remaining || 0) + delta);
  }

  if (trip.slot_remaining === 0) {
    trip.badge_text = 'KUOTA HABIS';
  } else if (trip.slot_remaining <= 3) {
    trip.badge_text = 'LIMITED SEAT';
  }

  persistTrips(cachedTrips);
  broadcast('TRIPS_UPDATE', cachedTrips);

  res.json({ success: true, trip, trips: cachedTrips });
});

// Delete a trip
app.delete('/api/trips/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  cachedTrips = cachedTrips.filter((t: any) => t.id !== id);
  persistTrips(cachedTrips);
  broadcast('TRIPS_UPDATE', cachedTrips);

  res.json({ success: true, trips: cachedTrips });
});

// Get settings
app.get('/api/settings', (req: Request, res: Response) => {
  res.json({ success: true, settings: cachedSettings });
});

// Update settings
app.post('/api/settings', (req: Request, res: Response) => {
  const newSettings = req.body;
  cachedSettings = {
    ...cachedSettings,
    ...newSettings,
    updated_at: new Date().toISOString(),
  };

  persistSettings(cachedSettings);
  broadcast('SETTINGS_UPDATE', cachedSettings);

  res.json({ success: true, settings: cachedSettings });
});

// Change active slide
app.post('/api/slide', (req: Request, res: Response) => {
  const { index } = req.body;
  const slideIdx = typeof index === 'number' ? index : 0;
  cachedSettings.active_trip_index = slideIdx;
  persistSettings(cachedSettings);
  broadcast('SLIDE_CHANGE', slideIdx);

  res.json({ success: true, index: slideIdx });
});

// Reset data to defaults
app.post('/api/reset', (req: Request, res: Response) => {
  // Re-read default trips from disk or initialize
  cachedTrips = loadTrips();
  cachedSettings = loadSettings();
  broadcast('TRIPS_UPDATE', cachedTrips);
  broadcast('SETTINGS_UPDATE', cachedSettings);
  res.json({ success: true });
});

// ==========================================
// VITE INTEGRATION
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Realtime OBS Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
