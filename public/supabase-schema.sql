-- ==============================================================================
-- SKEMA TABEL SUPABASE: OBS OVERLAY OPEN TRIP REAL-TIME (TIKTOK LIVE STREAM)
-- ==============================================================================
-- Petunjuk:
-- 1. Buka Dashboard Supabase Anda: https://supabase.com/dashboard
-- 2. Pilih project Anda -> Masuk ke menu "SQL Editor" di bilah sisi kiri.
-- 3. Klik "New Query", paste seluruh kode SQL di bawah ini, lalu klik "RUN".
-- ==============================================================================

-- 1. Buat Tabel 'trips' (Daftar Destinasi Open Trip)
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    mdpl INTEGER NOT NULL DEFAULT 0,
    date_range TEXT NOT NULL,
    duration TEXT NOT NULL DEFAULT '3H2M',
    price TEXT NOT NULL,
    slot_remaining INTEGER NOT NULL DEFAULT 5,
    slot_total INTEGER NOT NULL DEFAULT 15,
    image_url TEXT NOT NULL,
    badge_text TEXT DEFAULT 'HOT DEAL',
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Buat Tabel 'settings' (Pengaturan Running Text, Slide Aktif, & CTA)
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'stream_settings',
    running_text TEXT NOT NULL,
    active_trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
    active_trip_index INTEGER DEFAULT 0,
    auto_slide BOOLEAN DEFAULT true,
    slide_interval_seconds INTEGER DEFAULT 8,
    wa_number TEXT NOT NULL DEFAULT '0812-3456-7890',
    qris_image_url TEXT DEFAULT '',
    cta_headline TEXT NOT NULL DEFAULT 'CARA BOOKING PROMO LIVE:',
    cta_subtext TEXT NOT NULL DEFAULT '1. Screenshot card promo • 2. Klik WA di bio profil • 3. Kirim bukti DP QRIS',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 4. Buat Policy agar OBS Browser Source & Admin dapat Membaca & Mengubah Data (Anon Key)
DROP POLICY IF EXISTS "Public can view trips" ON public.trips;
CREATE POLICY "Public can view trips" ON public.trips
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert trips" ON public.trips;
CREATE POLICY "Public can insert trips" ON public.trips
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update trips" ON public.trips;
CREATE POLICY "Public can update trips" ON public.trips
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can delete trips" ON public.trips;
CREATE POLICY "Public can delete trips" ON public.trips
    FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public can view settings" ON public.settings;
CREATE POLICY "Public can view settings" ON public.settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can update settings" ON public.settings;
CREATE POLICY "Public can update settings" ON public.settings
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can insert settings" ON public.settings;
CREATE POLICY "Public can insert settings" ON public.settings
    FOR INSERT WITH CHECK (true);

-- 5. Aktifkan Fitur SUPABASE REALTIME untuk Kedua Tabel
-- Ini memungkinkan OBS overlay langsung berubah seketika tanpa refresh!
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'trips'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
  END IF;
END $$;

-- 6. Insert Data Awal (Seed Data Destinasi Gunung Indonesia)
INSERT INTO public.trips (name, mdpl, date_range, duration, price, slot_remaining, slot_total, image_url, badge_text, order_index, is_active)
VALUES
    ('GUNUNG RINJANI', 3726, '18 - 22 Okt 2025', '4H3M', 'Rp 2.450.000', 3, 15, 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=900&q=80', 'SISA 3 SLOT!', 0, true),
    ('GUNUNG SEMERU', 3676, '05 - 08 Nov 2025', '4H3M', 'Rp 1.850.000', 5, 18, 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=900&q=80', 'BEST SELLER', 1, true),
    ('GUNUNG PRAU (VIA DIENG)', 2565, '25 - 26 Okt 2025', '2H1M', 'Rp 650.000', 2, 20, 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80', 'SISA 2 SLOT!', 2, true),
    ('GUNUNG BROMO SUNRISE', 2329, 'Setiap Akhir Pekan', '2H1M', 'Rp 450.000', 8, 25, 'https://images.unsplash.com/photo-1602153508753-4ace888c10a0?auto=format&fit=crop&w=900&q=80', 'PROMO LIVE', 3, true),
    ('GUNUNG MERBABU (SUWANTING)', 3142, '12 - 14 Des 2025', '3H2M', 'Rp 850.000', 4, 16, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80', 'LIMITED SEAT', 4, true),
    ('KAWAH IJEN BLUE FIRE', 2799, '20 - 22 Nov 2025', '3H2M', 'Rp 950.000', 6, 20, 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=900&q=80', 'POPULAR', 5, true)
ON CONFLICT DO NOTHING;

-- 7. Insert Data Awal Tabel Settings
INSERT INTO public.settings (id, running_text, active_trip_index, auto_slide, slide_interval_seconds, wa_number, cta_headline, cta_subtext)
VALUES (
    'stream_settings',
    '🔥 PROMO LIVE STREAMING OPEN TRIP SPESIAL BULAN INI! DISKON DP 50% HANYA SAAT LIVE BERLANGSUNG • HUBUNGI WHATSAPP DI BIO • SISA KUOTA TERBATAS SIAPA CEPAT DIA DAPAT! • FASILITAS LENGKAP: TENDA, PORTER, LOGISTIK MAKAN 3X SEHARI & T-SHIRT EKSKLUSIF! 🔥',
    0,
    true,
    8,
    '0812-3456-7890',
    'CARA BOOKING PROMO LIVE:',
    '1. Screenshot card promo • 2. Klik WA di bio profil • 3. Kirim bukti DP QRIS'
)
ON CONFLICT (id) DO UPDATE 
SET running_text = EXCLUDED.running_text,
    wa_number = EXCLUDED.wa_number;
