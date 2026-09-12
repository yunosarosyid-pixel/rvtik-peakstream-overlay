import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Video, RefreshCw } from 'lucide-react';

interface WebcamStreamProps {
  deviceId?: string;
  isSimulated?: boolean;
  onDeviceChange?: (deviceId: string) => void;
  className?: string;
  isCircular?: boolean;
  spotlight?: boolean;
}

export function WebcamStream({
  deviceId,
  isSimulated = false,
  className = '',
  isCircular = false,
  spotlight = false,
}: WebcamStreamProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // List camera devices
  useEffect(() => {
    async function getDevices() {
      try {
        if (!navigator.mediaDevices?.enumerateDevices) return;
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        setAvailableDevices(videoInputs);
      } catch (err) {
        console.warn('Could not enumerate video devices', err);
      }
    }
    getDevices();
  }, [hasPermission]);

  // Start video stream
  useEffect(() => {
    if (isSimulated) {
      setStreamError(null);
      setIsInitializing(false);
      return;
    }

    let currentStream: MediaStream | null = null;
    let isCancelled = false;

    async function startCamera() {
      setIsInitializing(true);
      setStreamError(null);

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Browser tidak mendukung WebRTC Camera');
        }

        const constraints: MediaStreamConstraints = {
          video: deviceId
            ? { deviceId: { exact: deviceId } }
            : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (isCancelled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
        setIsInitializing(false);
      } catch (err: any) {
        if (!isCancelled) {
          console.warn('Gagal memuat kamera webcam:', err);
          setStreamError(err.message || 'Izin kamera ditolak atau perangkat tidak tersedia');
          setIsInitializing(false);
        }
      }
    }

    startCamera();

    return () => {
      isCancelled = true;
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [deviceId, isSimulated]);

  // Simulated host canvas animation when in simulation mode or camera error
  useEffect(() => {
    if (!isSimulated && !streamError) return;

    let animId: number;
    let t = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderSimulator = () => {
      t += 0.04;
      const w = canvas.width;
      const h = canvas.height;

      // Outdoor mountain sunrise gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#1a365d');
      bgGrad.addColorStop(0.4, '#2b6cb0');
      bgGrad.addColorStop(0.7, '#d69e2e');
      bgGrad.addColorStop(1, '#9b2c2c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Distant mountains
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.75);
      ctx.lineTo(w * 0.3, h * 0.5);
      ctx.lineTo(w * 0.65, h * 0.7);
      ctx.lineTo(w, h * 0.55);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Sun glow
      const sunY = h * 0.45 + Math.sin(t * 0.5) * 5;
      const sunGrad = ctx.createRadialGradient(w * 0.5, sunY, 10, w * 0.5, sunY, 120);
      sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      sunGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.4)');
      sunGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(w * 0.5, sunY, 120, 0, Math.PI * 2);
      ctx.fill();

      // Host silhouette with outdoor beanie & backpack
      ctx.fillStyle = '#0f172a';
      // Body / shoulders
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.92 + Math.sin(t) * 2, w * 0.28, h * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head / beanie
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.68 + Math.sin(t) * 2, w * 0.12, 0, Math.PI * 2);
      ctx.fill();

      // Beanie bobble
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.54 + Math.sin(t) * 2, w * 0.03, 0, Math.PI * 2);
      ctx.fill();

      // Microphone headset wire
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w * 0.5 + w * 0.12, h * 0.68 + Math.sin(t) * 2, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Audio waves on speech
      const waveCount = 5;
      for (let i = 0; i < waveCount; i++) {
        const waveH = 10 + Math.sin(t * 5 + i) * 12 + (i % 2 === 0 ? 8 : 2);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(w * 0.5 - 25 + i * 11, h * 0.94 - waveH / 2, 6, waveH);
      }

      animId = requestAnimationFrame(renderSimulator);
    };

    renderSimulator();
    return () => cancelAnimationFrame(animId);
  }, [isSimulated, streamError]);

  return (
    <div
      id="webcam-stream-container"
      className={`relative overflow-hidden ${
        isCircular ? 'rounded-full aspect-square shadow-2xl' : 'w-full h-full'
      } ${
        spotlight
          ? 'ring-4 ring-amber-400 ring-offset-4 ring-offset-black shadow-[0_0_50px_rgba(251,191,36,0.8)]'
          : ''
      } ${className}`}
    >
      {!isSimulated && !streamError ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          id="active-webcam-video"
          className="w-full h-full object-cover transform scale-x-[-1]"
        />
      ) : (
        <canvas
          ref={canvasRef}
          width={640}
          height={640}
          id="simulated-webcam-canvas"
          className="w-full h-full object-cover"
        />
      )}

      {/* Simulator or Live Cam indicator badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white uppercase tracking-wider z-10 pointer-events-none">
        <div
          className={`w-2 h-2 rounded-full ${
            isSimulated || streamError ? 'bg-amber-400' : 'bg-red-500 animate-pulse'
          }`}
        />
        {isSimulated || streamError ? 'Host Sim' : 'Webcam Live'}
      </div>

      {/* When camera has error, show small friendly notice */}
      {streamError && !isSimulated && (
        <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-3 text-center z-20">
          <CameraOff className="w-8 h-8 text-amber-400 mb-1" />
          <p className="text-white text-xs font-semibold">Webcam belum terhubung</p>
          <p className="text-slate-300 text-[10px] mt-0.5 max-w-[180px]">
            Menjalankan mode simulasi otomatis
          </p>
        </div>
      )}
    </div>
  );
}
