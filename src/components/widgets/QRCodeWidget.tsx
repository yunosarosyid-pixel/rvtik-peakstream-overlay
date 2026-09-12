import React from 'react';
import { MessageCircle, Scan, Sparkles } from 'lucide-react';

interface QRCodeWidgetProps {
  waNumber?: string;
  mountainName?: string;
  callout?: string;
}

export const QRCodeWidget: React.FC<QRCodeWidgetProps> = ({
  waNumber = '6281234567890',
  mountainName = 'Open Trip Gunung',
  callout = 'SCAN UNTUK BOOKING LANGSUNG'
}) => {
  const cleanNumber = waNumber.replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    `Halo Admin, saya mau booking slot promo live untuk ${mountainName}!`
  )}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    waUrl
  )}&bgcolor=ffffff&color=0f172a&margin=1`;

  return (
    <div className="w-full h-full flex items-center justify-center p-3 bg-transparent select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-[280px] rounded-3xl border-2 border-emerald-500/80 bg-slate-950/95 p-4 shadow-[0_0_35px_rgba(16,185,129,0.3)] backdrop-blur-xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-emerald-400 mb-2">
          <Scan className="w-4 h-4" />
          <span>{callout}</span>
        </div>

        {/* QR Image Box */}
        <div className="p-2.5 bg-white rounded-2xl shadow-xl border-2 border-emerald-400 relative">
          <img
            src={qrImageUrl}
            alt={`QR Code Booking ${mountainName}`}
            className="w-36 h-36 rounded-lg object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <MessageCircle className="w-4 h-4 fill-current" />
            </div>
          </div>
        </div>

        {/* Mountain Name badge */}
        <div className="mt-3 w-full">
          <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
            {mountainName}
          </span>
          <div className="flex items-center justify-center gap-1 text-xs font-black text-amber-300 mt-0.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Fast Respon Admin Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};
