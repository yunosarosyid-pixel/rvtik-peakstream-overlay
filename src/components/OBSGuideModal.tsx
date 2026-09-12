import React from 'react';
import {
  X,
  Tv,
  Smartphone,
  CheckCircle,
  ExternalLink,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  Sliders,
  Check,
  Copy,
} from 'lucide-react';
import { useState } from 'react';

interface OBSGuideModalProps {
  onClose: () => void;
}

export function OBSGuideModal({ onClose }: OBSGuideModalProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const overlayUrl = `${window.location.origin}${window.location.pathname}?view=overlay`;
  const controllerUrl = `${window.location.origin}${window.location.pathname}?view=controller`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div
      id="obs-guide-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto"
    >
      <div
        id="obs-guide-dialog"
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-5 md:p-7 text-white shadow-2xl flex flex-col max-h-[92vh] my-auto space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-white">
                Solusi Tampilan OBS & Panduan Remote HP
              </h3>
              <p className="text-xs text-slate-400">
                Jawaban masalah tampilan terpotong, remot tidak gerak, dan cara custom overlay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-obs-guide"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 pr-1 text-xs text-slate-300">
          {/* Section: Jawaban Kenapa Tampilan OBS Seperti di Screenshot */}
          <div className="bg-amber-500/10 border-2 border-amber-400/50 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>1. Mengapa Tampilan di OBS Kotak Hitam di Tengah & Terpotong?</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-200 leading-relaxed pl-1">
              <li>
                <strong>Ukuran Browser Source di OBS:</strong> OBS secara bawaan mengisi resolusi <em>Width: 800, Height: 600</em>. Karena kanvas TikTok Live Anda berukuran <strong>1080x1920 (9:16)</strong>, overlay jadi berada di tengah dan menyisakan sisa 808px di atas dan 302px di bawah.
              </li>
              <li>
                <strong>Tulisan "Webcam Belum Terhubung":</strong> Sebelumnya overlay mencoba meminta izin kamera web browser sendiri. Padahal Anda sudah memiliki kamera fisik langsung di OBS! Kami sudah menonaktifkan layer webcam bawaan ini sehingga <strong>tidak ada lagi kotak hitam yang menutupi wajah Anda</strong>.
              </li>
              <li>
                <strong>Background Transparan (HUD):</strong> Sekarang latar belakang overlay dibuat <strong>100% transparan</strong>. Kamera dan flyer "GUNUNG SINDORO" yang Anda pasang di OBS akan terlihat tembus dengan jernih, dan overlay hanya menampilkan informasi trip, promo, & running text.
              </li>
            </ul>
          </div>

          {/* Section: Jawaban Kenapa Remot Sebelumnya Tidak Bergerak */}
          <div className="bg-cyan-500/10 border-2 border-cyan-400/50 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-black text-xs uppercase tracking-wide">
              <Smartphone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>2. Mengapa Saat Klik Remot Sebelumnya Tidak Terjadi Apa-apa?</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-relaxed">
              Sebelumnya sistem hanya menggunakan memori lokal browser (<em>localStorage</em>). OBS Studio di PC dan browser di HP berjalan di perangkat/aplikasi yang terpisah, sehingga sinyal klik dari HP tidak sampai ke OBS.
            </p>
            <p className="text-[11px] text-emerald-300 font-bold bg-emerald-950/60 p-2 rounded-xl border border-emerald-500/30">
              ✓ SUDAH DIPERBAIKI: Kami telah membangun <strong>Server Real-Time Synchronization (SSE Engine)</strong>. Sekarang setiap kali Anda menekan tombol di HP (ganti gunung, ubah kuota slot, pasang stempel promo), OBS di PC Anda langsung ter-update secara otomatis dalam hitungan milidetik!
            </p>
          </div>

          {/* Section: Cara Pasang di OBS dengan Ukuran yang Benar */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-extrabold text-xs uppercase">
                <Tv className="w-4 h-4 text-amber-400" />
                <span>3. Pengaturan Wajib di OBS Studio (Source Browser):</span>
              </div>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-[11px] text-slate-300 pl-1 leading-relaxed">
              <li>
                Buka OBS Studio, klik kanan pada source <strong>Rvtk ot</strong> &gt; pilih <strong>Properties</strong>.
              </li>
              <li>
                Masukkan link Overlay berikut pada kolom <strong>URL</strong>:
                <div className="flex items-center gap-2 mt-1">
                  <div className="p-2 bg-slate-950 rounded-xl font-mono text-[11px] text-amber-300 border border-slate-700 select-all flex-1 truncate">
                    {overlayUrl}
                  </div>
                  <button
                    onClick={() => copyToClipboard(overlayUrl, 'overlay')}
                    className="px-3 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-amber-300"
                  >
                    {copiedType === 'overlay' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Salin</span>
                  </button>
                </div>
              </li>
              <li>
                <strong>WAJIB:</strong> Ganti angka Width dan Height di OBS menjadi:
                <div className="grid grid-cols-2 gap-2 mt-1 font-mono text-center">
                  <div className="bg-slate-950 p-2 rounded-xl border border-emerald-500/40 text-emerald-400 font-bold">
                    Width: <strong>1080</strong>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-emerald-500/40 text-emerald-400 font-bold">
                    Height: <strong>1920</strong>
                  </div>
                </div>
              </li>
              <li>
                Pastikan kolom <strong>Custom CSS</strong> berisi:
                <div className="p-2 bg-slate-950 rounded-xl font-mono text-[10px] text-cyan-300 border border-slate-700 mt-1 select-all">
                  body {'{ background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }'}
                </div>
              </li>
              <li>
                Centang opsi: <em>"Shutdown source when not visible"</em> dan <em>"Refresh browser when scene becomes active"</em>. Lalu klik <strong>OK</strong>.
              </li>
              <li className="bg-amber-400/20 text-amber-200 p-2.5 rounded-xl border border-amber-400/40">
                <strong>💡 Agar Pas 100% di Layar:</strong> Klik kanan source <strong>Rvtk ot</strong> di OBS &gt; <strong>Transform</strong> &gt; pilih <strong>Fit to screen</strong> (atau tekan <strong>Ctrl + F</strong> pada keyboard). Seketika kotak merah akan pas 100% vertikal 9:16 mengisi seluruh kanvas TikTok Live Anda!
              </li>
            </ol>
          </div>

          {/* Section: Cara Pakai Remote di Smartphone */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-extrabold text-xs uppercase">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>4. Link Remote Handphone (Stream Deck Nirkabel):</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300">
              Buka link di bawah ini di browser smartphone Anda (Chrome / Safari di HP):
            </p>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-950 rounded-xl font-mono text-[11px] text-cyan-300 border border-slate-700 select-all flex-1 truncate">
                {controllerUrl}
              </div>
              <button
                onClick={() => copyToClipboard(controllerUrl, 'controller')}
                className="px-3 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-cyan-300"
              >
                {copiedType === 'controller' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Salin</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              💡 Tip: Simpan ke Home Screen HP Anda (<em>Add to Home Screen</em>) agar bisa dipakai seperti aplikasi Stream Deck fisik!
            </p>
          </div>

          {/* Section: Cara Kustomisasi */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase">
              <Sliders className="w-4 h-4" />
              <span>5. Cara Kustomisasi Sesuai Keinginan Sendiri:</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Klik menu <strong>"Kustomisasi Tampilan Overlay"</strong> di Virtual Stream Deck untuk:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300 pl-1">
              <li>Memilih <strong>posisi kartu</strong> (Bawah, Tengah, Atas, atau Sembunyikan).</li>
              <li>Mengubah <strong>transparansi background</strong> (100% Transparan, Kaca, atau Gelap).</li>
              <li>Mengubah <strong>stempel promo</strong> dan posisinya (Flash Sale, Kuota Menipis, Early Bird).</li>
              <li>Menghidupkan/mematikan running text, banner atas, stempel promo, atau badge siaran.</li>
              <li>Mengedit teks berjalan & judul promo secara langsung.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition"
          >
            Tutup Panduan & Mulai Siaran
          </button>
        </div>
      </div>
    </div>
  );
}
