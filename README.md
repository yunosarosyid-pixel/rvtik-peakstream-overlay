# RVTik PeakStream Studio (Open Trip Stream Overlay & Virtual Deck)

Aplikasi overlay interaktif dan Virtual Stream Deck untuk siaran live streaming promosi **Open Trip Pendakian Gunung** via **OBS Studio** (TikTok Live / Shopee Live / YouTube).

---

## 🌟 Fitur Utama

1. **3 Mode Siaran Utama (Transisi Halus):**
   - **Mode 1 (Full Facecam + Top Banner Slider):** Kamera webcam eksternal tampil penuh dengan slider pamflet mini otomatis di bagian atas untuk trip yang berstatus *Ready*.
   - **Mode 2 (Pamflet Trip Gunung):** Kamera otomatis mengecil menjadi lingkaran di pojok, layar menampilkan poster trip lengkap (MDPL, rute, tanggal, durasi, harga promo, kuota slot).
   - **Mode 3 (Fasilitas Include & Exclude):** Kamera tetap berada di pojok, layar menampilkan rincian fasilitas *Include* vs *Exclude*.

2. **Dukungan Webcam Eksternal:**
   - Deteksi otomatis perangkat webcam eksternal via browser, tanpa perlu potong (*crop*) manual di OBS.
   - Mode simulasi tersedia untuk pengujian tanpa webcam fisik.

3. **Tombol Instan Gunung yang Berstatus "Ready":**
   - Tombol cepat pada Stream Deck hanya memunculkan gunung yang sedang siap dipromosikan.
   - Dilengkapi menu **Kelola Gunung** untuk menambah gunung baru atau mengatur ketersediaan (*Ready/Off*).

4. **Social Ninja Chat Notice Spotlight:**
   - Tombol notice untuk pertanyaan serius penonton chat. Kamera host akan mendapat spotlight dan kartu pertanyaan penonton muncul langsung di siaran.

5. **Tiket / Pass QR Booking WhatsApp:**
   - Pop-up QR code pemesanan dengan nomor WhatsApp admin yang dapat dikonfigurasi langsung dari remote deck.

6. **Kontrol Kuota Real-time & Stempel Promo:**
   - Tombol `+1` dan `-1` slot untuk memperbarui kuota secara langsung saat siaran.
   - Tombol stempel cepat: *FLASH SALE*, *SISA 2 SLOT*, *BEST SELLER*, dll.
   - Teks berjalan (*running text ticker*) di bagian bawah layar siaran.

---

## 🚀 Cara Menjalankan Secara Lokal

```bash
# 1. Clone repository
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME

# 2. Install dependensi
npm install

# 3. Jalankan development server
npm run dev
```

Akses aplikasi di browser pada: `http://localhost:3000`

---

## 📺 Cara Penggunaan di OBS Studio

1. Buka OBS Studio.
2. Pada panel **Sources**, klik tanda **+** lalu pilih **Browser**.
3. Beri nama (misalnya: `Overlay Open Trip`).
4. Pada kolom **URL**, masukkan:
   ```text
   http://localhost:3000/?view=overlay
   ```
   *(Atau gunakan URL deploy Google AI Studio Anda dengan akhiran `?view=overlay`)*
5. Atur ukuran resolusi:
   - **Width**: `1080`
   - **Height**: `1920` (Rasio potret 9:16)
6. Buka aplikasi di HP atau tab samping dengan mode **Remote Deck (HP)**:
   ```text
   http://localhost:3000/?view=controller
   ```
7. Klik tombol mode siaran dan tombol gunung di HP Anda, tampilan di OBS Studio akan berubah secara real-time!
