import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Compass } from 'lucide-react';
import { DisplayMode } from '../types';

interface CameraStreamProps {
  mode: DisplayMode;
  deviceId?: string;
  useSimulatedCamera: boolean;
  showNoticeSpotlight: boolean;
  noticeViewerName?: string;
  onDeviceListChange?: (devices: MediaDeviceInfo[]) => void;
}

export const CameraStream: React.FC<CameraStreamProps> = ({
  mode,
  deviceId,
  useSimulatedCamera,
  showNoticeSpotlight,
  noticeViewerName,
  onDeviceListChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let isCancelled = false;

    async function initCamera() {
      if (useSimulatedCamera) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
        setIsLiveCameraActive(false);
        setCameraError(null);
        return;
      }

      try {
        setCameraError(null);
        const constraints: MediaStreamConstraints = {
          video: deviceId
            ? { deviceId: { exact: deviceId } }
            : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (isCancelled) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        activeStream = mediaStream;
        setStream(mediaStream);
        setIsLiveCameraActive(true);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        if (onDeviceListChange && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter((d) => d.kind === 'videoinput');
          onDeviceListChange(videoDevices);
        }
      } catch (err: any) {
        console.warn('Webcam not accessible or permission pending:', err);
        setCameraError(err.message || 'Kamera eksternal belum diizinkan atau tidak terdeteksi');
        setIsLiveCameraActive(false);
      }
    }

    initCamera();

    return () => {
      isCancelled = true;
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [deviceId, useSimulatedCamera]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const isPipCircle = mode === 'mode2_trip' || mode === 'mode3_facility';

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      className={`absolute z-20 overflow-hidden ${
        isPipCircle
          ? `top-3 right-3 w-32 h-32 md:w-36 md:h-36 rounded-full border-2 ${
              showNoticeSpotlight ? 'border-[#f8a855] shadow-lg' : 'border-[#376943] shadow-md'
            } bg-[#141312]`
          : 'inset-0 w-full h-full rounded-none'
      }`}
    >
      {/* Live Webcam Stream or Aesthetic Outdoor Feed Fallback */}
      {isLiveCameraActive && !cameraError ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        <div className="relative w-full h-full bg-[#141311] flex flex-col items-center justify-center text-stone-200 overflow-hidden">
          {/* Simulated Outdoor Streamer Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-65"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0c] via-[#121110]/50 to-[#0e0d0c]/70" />

          {isPipCircle ? (
            <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center">
              <div className="w-10 h-10 rounded-full bg-[#1e3324] border border-[#2d5236] flex items-center justify-center mb-1">
                <Camera className="w-5 h-5 text-[#7de39b]" />
              </div>
              <span className="text-[9px] font-mono font-bold text-stone-300 uppercase tracking-wider">
                HOST
              </span>
            </div>
          ) : (
            <div className="relative z-10 text-center px-6 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#1e3324] border border-[#2d5236] text-[#7de39b] text-xs font-mono mb-3">
                <span className="w-2 h-2 rounded-full bg-[#7de39b]" />
                Webcam Eksternal Live
              </div>
              <h2 className="text-xl font-black text-[#f7f4ee] tracking-wide mb-1 font-['Outfit']">
                KAMERA LIVE HOST
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                Webcam Anda tampil penuh di layar ini pada Mode 1, dan otomatis beralih menjadi lingkaran di pojok saat pamflet dibuka.
              </p>
              {cameraError && (
                <div className="text-[11px] bg-[#1a1714] text-[#f8a855] border border-[#6b3e1a] px-3 py-1.5 rounded inline-block font-mono">
                  Info: {cameraError}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Viewfinder Overlay Elements for Circular Mode */}
      {isPipCircle && (
        <div className="absolute inset-0 pointer-events-none rounded-full flex flex-col justify-between p-2">
          <div className="flex justify-between items-center px-1">
            <span className="w-2 h-2 rounded-full bg-[#c53030] shadow" />
            <span className="text-[8px] font-mono font-bold tracking-widest text-[#7de39b] bg-[#121110]/90 px-1 rounded">
              REC
            </span>
          </div>

          <div className="text-center pb-0.5">
            <div className="inline-block bg-[#121110]/90 border border-stone-700 text-[#f5ebd9] text-[8px] font-mono px-2 py-0.5 rounded">
              HOST
            </div>
          </div>
        </div>
      )}

      {/* Notice Indicator Tag on Camera */}
      {showNoticeSpotlight && isPipCircle && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-[#f8a855] text-stone-950 text-[8px] font-black px-1.5 py-0.2 rounded shadow font-mono uppercase tracking-wider">
          NOTICED
        </div>
      )}
    </motion.div>
  );
};
