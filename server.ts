import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initial State Cache
let currentStreamState: any = {
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
  customization: {
    bgMode: 'transparent',
    showWebcamLayer: false,
    showTopBanner: true,
    showTripCard: true,
    cardPosition: 'bottom',
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
  },
  lastUpdated: Date.now()
};

let currentMountains: any[] = [];

// SSE (Server-Sent Events) clients set for real-time OBS & Smartphone synchronization
const sseClients = new Set<express.Response>();

function broadcast(eventData: any) {
  const payload = `data: ${JSON.stringify(eventData)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    connectedClients: sseClients.size,
    lastUpdated: currentStreamState.lastUpdated
  });
});

// SSE endpoint: OBS Browser Source & Smartphone stream deck subscribe here
app.get('/api/sync/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send current state on connection
  const initialPayload = `data: ${JSON.stringify({
    type: 'INIT',
    state: currentStreamState,
    mountains: currentMountains,
    connectedClients: sseClients.size + 1
  })}\n\n`;
  res.write(initialPayload);

  sseClients.add(res);

  // Heartbeat to prevent timeouts
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

// Get latest synced state
app.get('/api/sync/state', (req, res) => {
  res.json({
    state: currentStreamState,
    mountains: currentMountains,
    connectedClients: sseClients.size,
    lastUpdated: currentStreamState.lastUpdated
  });
});

// Update stream state (from Remote or Studio)
app.post('/api/sync/state', (req, res) => {
  const incoming = req.body;
  if (!incoming || typeof incoming !== 'object') {
    return res.status(400).json({ error: 'Invalid state payload' });
  }

  currentStreamState = {
    ...currentStreamState,
    ...incoming,
    customization: {
      ...(currentStreamState.customization || {}),
      ...(incoming.customization || {})
    },
    lastUpdated: Date.now()
  };

  broadcast({
    type: 'STATE_UPDATED',
    state: currentStreamState,
    lastUpdated: currentStreamState.lastUpdated
  });

  res.json({ ok: true, state: currentStreamState });
});

// Update mountains list
app.post('/api/sync/mountains', (req, res) => {
  const incoming = req.body;
  if (Array.isArray(incoming)) {
    currentMountains = incoming;
    broadcast({
      type: 'MOUNTAINS_UPDATED',
      mountains: currentMountains,
      lastUpdated: Date.now()
    });
    return res.json({ ok: true, count: currentMountains.length });
  }
  res.status(400).json({ error: 'Expected array of mountains' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PeakStream OBS Sync Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
