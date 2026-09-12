# RVTik PeakStream Studio 🏔️🎥
### Live Streaming Overlay & Virtual Stream Deck (Open Trip Pendakian Gunung)

Aplikasi overlay interaktif dan Virtual Stream Deck untuk siaran live streaming promosi **Open Trip Pendakian Gunung** via **OBS Studio** (TikTok Live / Shopee Live / YouTube Live).

---

## ❓ Kenapa Sebelumnya Tidak Berjalan Saat Di-Clone Dari GitHub?

Jika sebelumnya aplikasi tampak kosong / blank putih saat dijalankan dari GitHub, hal tersebut disebabkan oleh:
1. **File `src/App.tsx` sebelumnya masih kosongan (`return <div></div>;`)** tanpa komponen siaran.
2. **Dependensi belum terpasang** (`npm install` belum dijalankan di folder hasil clone).
3. **Port dan host dev server**: Aplikasi ini berjalan menggunakan Vite pada port `3000`.

Sekarang seluruh kode sumber telah diimplementasikan secara lengkap dan siap digunakan!

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

Ikuti 3 langkah mudah ini di Terminal / Command Prompt:

```bash
# 1. Masuk ke folder proyek
cd rvtik-peakstream-studio

# 2. Pasang semua dependensi (hanya perlu sekali di awal)
npm install

# 3. Jalankan development server
npm run dev
```

Buka browser di alamat:
👉 **`http://localhost:3000`**

---

## 🌟 3 Mode Siaran Utama

1. **Mode 1 (Full Facecam + Top Banner Slider):**
   - Kamera webcam eksternal tampil layar penuh.
   - Di bagian atas layar terdapat *Top Banner Slider* otomatis yang menampilkan gunung-gunung dengan status **Ready** (MDPL, harga promo, sisa slot).

2. **Mode 2 (Pamflet Trip Gunung):**
   - Kamera secara otomatis mengecil dan bertransisi mulus menjadi lingkaran (*PIP / Picture-in-Picture*) di pojok bawah.
   - Layar utama menampilkan pamflet detail gunung: MDPL, rute, tanggal, durasi, harga promo vs normal, stempel promo, dan indikator sisa slot.

3. **Mode 3 (Fasilitas Include & Exclude):**
   - Kamera tetap berada di pojok.
   - Layar menampilkan rincian fasilitas **INCLUDE** (tenda, simaksi, makan, guide & porter) vs **EXCLUDE** (transportasi asal, perlengkapan pribadi).

---

## 🎮 Fitur Virtual Stream Deck (Remote)

- **Tombol Instan Gunung Ready:** Tombol cepat hanya menampilkan gunung yang sedang aktif untuk dipromosikan.
- **Kontrol Kuota Real-time:** Tombol `[-] 1 Slot` (saat ada yang order di chat/WA) dan `[+] 1 Slot` untuk memicu urgensi penonton.
- **Stempel Promo Instan:** Pilihan badge live: *FLASH SALE*, *SISA 2 SLOT*, *BEST SELLER*, *EARLY BIRD*, *PROMO LIVE*, dll.
- **Social Ninja Chat Notice Spotlight:** Host dapat menyorot pertanyaan penonton di chat dengan lampu spotlight dan kartu pertanyaan animasi.
- **Tiket / Pass QR WhatsApp:** Memunculkan pop-up kode QR booking langsung ke WhatsApp admin.
- **Running Text Ticker:** Teks berjalan di bagian bawah layar yang dapat diubah teksnya secara real-time.
- **Dukungan Webcam Eksternal:** Deteksi perangkat kamera USB / webcam / capture card via browser, serta mode simulator host jika webcam fisik tidak tersedia.
- **Menu Kelola Gunung:** Tambah gunung baru, ubah harga, tanggal, kuota, atau ubah status *Ready / Off*.

---

## 📺 Cara Pasang di OBS Studio (TikTok / Shopee Live)

1. Buka **OBS Studio** di laptop/komputer Anda.
2. Di panel **Sources (Sumber)**, klik tanda **+** lalu pilih **Browser**.
3. Beri nama (misal: `Overlay Open Trip`).
4. Masukkan URL:
   ```text
   http://localhost:3000/?view=overlay
   ```
   *(Atau masukkan URL deploy Anda yang berakhiran `?view=overlay`)*
5. Atur ukuran resolusi (Rasio Vertikal 9:16):
   - **Width**: `1080`
   - **Height**: `1920`
   - **FPS**: `60`
6. Klik **OK**.

---

## 📱 Menggunakan HP Sebagai Stream Deck Nirkabel

1. Sambungkan HP dan laptop ke jaringan yang sama (atau gunakan URL hosting publik).
2. Buka link ini di browser HP:
   ```text
   http://localhost:3000/?view=controller
   ```
3. Tekan tombol mode siaran atau tombol gunung di HP Anda — tampilan di OBS Studio di laptop Anda akan berganti secara seketika (*real-time sync* via `BroadcastChannel` dan `localStorage`)!

---

## 🛠️ Lisensi & Teknologi

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Ikon:** Lucide React
- **Animasi:** CSS Keyframes & Motion Transitions
