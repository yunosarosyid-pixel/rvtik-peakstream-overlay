import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, PhoneCall, X, ShieldCheck, CheckCircle2, Compass, Sparkles } from 'lucide-react';

interface QrBookingModalProps {
  isOpen: boolean;
  waNumber: string;
  waAdminName: string;
  activeMountainName?: string;
  onClose: () => void;
}

export const QrBookingModal: React.FC<QrBookingModalProps> = ({
  isOpen,
  waNumber,
  waAdminName,
  activeMountainName,
  onClose,
}) => {
  const cleanWaNumber = waNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWaNumber.startsWith('0') ? '62' + cleanWaNumber.slice(1) : cleanWaNumber}?text=${encodeURIComponent(
    `Halo ${waAdminName || 'Admin'}, saya mau booking slot open trip ${activeMountainName || 'pendakian'} yang di live stream!`
  )}`;

  // High contrast clean QR with warm parchment card
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    waUrl
  )}&margin=8&color=1c1917`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-stone-950/88 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-[340px] bg-[#1a1815] border border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden text-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Military/Outdoor Stamped Bar */}
            <div className="bg-[#24211d] px-4 py-2.5 border-b border-stone-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-900/60 border border-emerald-600/60 flex items-center justify-center text-emerald-400">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-wider uppercase text-emerald-400 font-['Outfit'] block leading-none">
                    PASS BOOKING LIVE
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium">
                    {activeMountainName ? `Trip ${activeMountainName}` : 'Open Trip Pendakian'}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-stone-800/80 text-stone-400 hover:text-stone-100 hover:bg-stone-700 flex items-center justify-center transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col items-center">
              {/* Scan Card (Warm Sand / Field Expedition Ticket instead of blinding AI white) */}
              <div className="w-full bg-[#f4eee4] text-stone-900 rounded-xl p-3.5 shadow-md border border-stone-300 relative flex flex-col items-center">
                {/* Perforated ticket edge effect */}
                <div className="flex items-center justify-between w-full mb-2 pb-1.5 border-b border-dashed border-stone-400 text-[10px] font-mono font-bold text-stone-700">
                  <span className="flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-emerald-800" />
                    SCAN VIA WHATSAPP
                  </span>
                  <span className="bg-emerald-800 text-stone-100 px-1.5 py-0.5 rounded text-[9px] font-mono">
                    DP AMAN
                  </span>
                </div>

                {/* QR Display */}
                <div className="w-44 h-44 bg-white p-2 rounded-lg border border-stone-300 shadow-inner flex items-center justify-center">
                  <img
                    src={qrCodeUrl}
                    alt="QR WhatsApp Admin"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="mt-2 text-center">
                  <span className="text-[11px] font-bold text-stone-800 block">
                    Arahkan kamera HP ke QR Code
                  </span>
                  <span className="text-[10px] text-stone-600 block mt-0.5">
                    Otomatis chat WhatsApp admin dengan format booking
                  </span>
                </div>
              </div>

              {/* Contact Detail Bar */}
              <div className="w-full mt-3 bg-[#131210] border border-stone-800 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-semibold uppercase tracking-wider">
                      Nomor WA Resmi Admin:
                    </span>
                    <span className="text-sm font-extrabold text-stone-100 font-mono tracking-wide block">
                      {waNumber}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-1 rounded font-medium border border-stone-700">
                  {waAdminName}
                </span>
              </div>

              {/* Fast guarantee bullets */}
              <div className="w-full mt-3 space-y-1.5 text-left text-[11px] text-stone-300 bg-[#1e1c19] p-2.5 rounded-xl border border-stone-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Kirim screenshot siaran live ini untuk klaim promo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Kunci slot langsung dengan DP minimal</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
