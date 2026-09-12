import { X, Tv, Smartphone, CheckCircle, ExternalLink, HelpCircle, AlertTriangle, Play, Sparkles } from 'lucide-react';

interface OBSGuideModalProps {
  onClose: () => void;
}

export function OBSGuideModal({ onClose }: OBSGuideModalProps) {
  const overlayUrl = `${window.location.origin}${window.location.pathname}?view=overlay`;
  const controllerUrl = `${window.location.origin}${window.location.pathname}?view=controller`;

  return (
    <div
      id="obs-guide-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="obs-guide-dialog"
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-5 md:p-7 text-white shadow-2xl flex flex-col max-h-[90vh] my-auto space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-white">
                Panduan Pasang di OBS Studio & HP Remote
              </h3>
              <p className="text-xs text-slate-400">
                Solusi & tutorial penggunaan siaran live Open Trip Pendakian Gunung
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
          {/* Section: Penjelasan Kenapa Sebelumnya Tidak Berjalan */}
          <div className="bg-amber-500/10 border border-amber-400/40 rounded-2xl p-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Kenapa Sebelumnya Tidak Berjalan Saat Di-Repo ke GitHub?</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Sebelumnya file <code>src/App.tsx</code> masih berstatus kosong (hanya berisi <code>&lt;div&gt;&lt;/div&gt;</code>) dan dependensi belum terkonfigurasi untuk tampilan siaran. Sekarang seluruh sistem <strong>RVTik PeakStream Studio</strong> telah dibangun lengkap dengan 3 mode siaran, dukungan webcam, dan sinkronisasi nirkabel real-time.
            </p>
          </div>

          {/* Step 1: Pasang di OBS Studio */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-white font-extrabold text-sm">
              <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                1
              </div>
              <span>Langkah Pasang di OBS Studio (Laptop / PC):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1 leading-relaxed">
              <li>Buka aplikasi <strong>OBS Studio</strong> di laptop/PC Anda.</li>
              <li>Pada panel <strong>Sources (Sumber)</strong>, klik tombol <strong>+</strong> lalu pilih <strong>Browser</strong>.</li>
              <li>Beri nama sumber, misal: <strong className="text-amber-300">Overlay Open Trip</strong>.</li>
              <li>
                Pada kolom URL, masukkan tautan overlay:
                <div className="mt-1 p-2 bg-slate-950 rounded-xl font-mono text-[11px] text-amber-300 border border-slate-700 select-all break-all">
                  {overlayUrl}
                </div>
              </li>
              <li>
                Atur resolusi sesuai layar potret TikTok / Shopee Live:
                <div className="flex gap-4 font-mono text-[11px] text-emerald-400 mt-1">
                  <span>Width: <strong>1080</strong></span>
                  <span>Height: <strong>1920</strong></span>
                  <span>FPS: <strong>60</strong></span>
                </div>
              </li>
              <li>Centang opsi <em>"Shutdown source when not visible"</em> dan <em>"Refresh browser when scene becomes active"</em> jika perlu.</li>
            </ol>
          </div>

          {/* Step 2: Gunakan Smartphone Sebagai Remote Deck */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-white font-extrabold text-sm">
              <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center">
                2
              </div>
              <span>Gunakan HP Sebagai Virtual Stream Deck (Remote Nirkabel):</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Buka link di bawah ini di browser HP Anda (Chrome / Safari):
            </p>
            <div className="p-2 bg-slate-950 rounded-xl font-mono text-[11px] text-cyan-300 border border-slate-700 select-all break-all">
              {controllerUrl}
            </div>
            <p className="text-slate-400 text-[11px]">
              Setiap kali Anda menekan tombol mode siaran, tombol gunung, atau tombol kuota slot di HP, tampilan di OBS Studio akan berubah seketika secara sinkron!
            </p>
          </div>

          {/* Step 3: Cara Menjalankan Secara Lokal Dari Repo GitHub */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-white font-extrabold text-sm">
              <div className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center">
                3
              </div>
              <span>Cara Jalankan dari Repository GitHub:</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl font-mono text-[11px] text-slate-200 border border-slate-700 space-y-1">
              <div># 1. Masuk ke folder repo</div>
              <div className="text-amber-300">cd nama-repo-anda</div>
              <div># 2. Pasang dependensi npm</div>
              <div className="text-amber-300">npm install</div>
              <div># 3. Jalankan server lokal</div>
              <div className="text-amber-300">npm run dev</div>
            </div>
            <p className="text-slate-400 text-[11px]">
              Aplikasi akan berjalan di <code>http://localhost:3000</code> siap pakai untuk OBS!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow transition"
          >
            Mengerti & Mulai Siaran
          </button>
        </div>
      </div>
    </div>
  );
}
