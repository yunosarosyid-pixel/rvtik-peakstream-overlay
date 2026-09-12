import { MessageSquare, Phone, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface WhatsAppQRCodeProps {
  phoneNumber: string;
  tripName: string;
  priceFormatted: string;
  customMessage?: string;
  onClose?: () => void;
}

export function WhatsAppQRCode({
  phoneNumber,
  tripName,
  priceFormatted,
  customMessage,
  onClose
}: WhatsAppQRCodeProps) {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(
    customMessage || `Halo Admin RVTik Adventure, saya mau booking slot promo Open Trip ${tripName} (${priceFormatted})!`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  // High quality QR Code image generated via quick reliable generator URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    waUrl
  )}&bgcolor=ffffff&color=0f172a&margin=2`;

  return (
    <div
      id="whatsapp-booking-pass-card"
      className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400/90 rounded-3xl p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-center animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Mountain Pass Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
              OFFICIAL VIP PASS
            </span>
            <h4 className="text-sm font-extrabold text-white leading-tight">
              Booking WhatsApp Admin
            </h4>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 animate-pulse">
          RESPON CEPAT
        </div>
      </div>

      {/* Target Trip Highlight */}
      <div className="bg-slate-800/80 rounded-xl p-3 border border-white/10 mb-4 text-left">
        <div className="flex justify-between items-center text-xs text-slate-400 mb-0.5">
          <span>Target Trip:</span>
          <span className="text-amber-400 font-bold">{priceFormatted}</span>
        </div>
        <div className="font-extrabold text-white text-base truncate">{tripName}</div>
      </div>

      {/* QR Code Container */}
      <div className="relative mx-auto w-52 h-52 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center border-4 border-emerald-500">
        <img
          src={qrCodeUrl}
          alt={`QR Booking WhatsApp ${tripName}`}
          className="w-full h-full object-contain"
          loading="eager"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
            <Phone className="w-5 h-5 fill-white" />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Arahkan Kamera HP ke Layar / Scan QR Sekarang</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-snug">
          Atau ketik <span className="text-amber-300 font-bold">"MAU TRIP {tripName.toUpperCase()}"</span> di kolom komentar live!
        </p>
      </div>

      {/* WhatsApp Number Pill */}
      <div className="mt-3 py-1.5 px-3 rounded-lg bg-slate-800/90 border border-slate-700 inline-flex items-center gap-2 text-xs text-slate-200">
        <Phone className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-mono font-bold tracking-wide">+{cleanPhone}</span>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          id="btn-close-qr-pass"
          className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
        >
          Tutup Pass
        </button>
      )}
    </div>
  );
}
