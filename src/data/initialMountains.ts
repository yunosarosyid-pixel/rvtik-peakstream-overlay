import { MountainTrip } from '../types';

export const INITIAL_MOUNTAINS: MountainTrip[] = [
  {
    id: 'rinjani',
    name: 'Gunung Rinjani',
    elevation: 3726,
    route: 'Via Sembalun - Torean',
    date: '24 - 27 Okt 2026',
    duration: '4 Hari 3 Malam',
    price: 1650000,
    normalPrice: 1950000,
    slotsAvailable: 3,
    totalSlots: 14,
    isReady: true,
    level: 'Tantangan',
    imageUrl: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80',
    basecampLocation: 'Lombok Timur, NTB',
    tags: ['Puncak Anjani 3726M', 'Danau Segara Anak', 'Air Panas Aik Kalak'],
    includes: [
      'Simaksi Resmi TNGR & Asuransi',
      'Tenda Dome Kapasitas 4 (isi 3 orang)',
      'Makan 9x selama durasi pendakian',
      'Porter Tim (Bawa tenda & logistik)',
      'Guide Berlisensi & Porter Kompak',
      'Alat Masak, Makan & Matras Spon',
      'Dokumentasi Foto & Video Drone',
      'P3K Standar + Oksigen Portabel'
    ],
    excludes: [
      'Tiket transportasi ke Lombok/Bandara',
      'Perlengkapan pribadi (SB, Jaket, Sepatu)',
      'Porter pribadi (bawa tas pribadi)',
      'Tips sukarela guide/porter',
      'Uang jajan pribadi di luar paket'
    ]
  },
  {
    id: 'prau',
    name: 'Gunung Prau',
    elevation: 2565,
    route: 'Via Patakbanteng Dieng',
    date: '12 - 13 Okt 2026',
    duration: '2 Hari 1 Malam',
    price: 499000,
    normalPrice: 650000,
    slotsAvailable: 2,
    totalSlots: 12,
    isReady: true,
    level: 'Pemula',
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
    basecampLocation: 'Wonosobo, Jawa Tengah',
    tags: ['Golden Sunrise Terbaik', 'Bukit Teletubbies', 'Ramah Pemula'],
    includes: [
      'Simaksi & Asuransi Pendakian',
      'Tenda Kelompok nyaman (isi 3-4)',
      'Makan 3x (Malam, Pagi, Siang)',
      'Guide Pendaki Berpengalaman',
      'Porter Kelompok (Logistik & Alat)',
      'Peralatan Masak & Teh/Kopi Hangat',
      'Dokumentasi Kamera Mirrorless'
    ],
    excludes: [
      'Transportasi dari kota asal ke Basecamp',
      'Perlengkapan pribadi (Sleeping Bag dll)',
      'Camilan & Pengeluaran pribadi'
    ]
  },
  {
    id: 'merbabu',
    name: 'Gunung Merbabu',
    elevation: 3145,
    route: 'Via Selo Boyolali',
    date: '18 - 19 Okt 2026',
    duration: '2 Hari 1 Malam',
    price: 685000,
    normalPrice: 850000,
    slotsAvailable: 4,
    totalSlots: 15,
    isReady: true,
    level: 'Sedang',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    basecampLocation: 'Boyolali, Jawa Tengah',
    tags: ['Sabana 1 & 2', 'Puncak Kenteng Songo', 'View Merapi Gagah'],
    includes: [
      'Tiket Simaksi Booking Online Resmi',
      'Tenda Dome Standar Gunung (isi 3)',
      'Makan 3x hangat di camp',
      'Guide Pemandu Jalur Selo',
      'Porter Tim (Bawa alat masak & tenda)',
      'Matras kelompok & alat makan',
      'Dokumentasi tim cinematic'
    ],
    excludes: [
      'Ojek basecamp (opsional)',
      'Sleeping bag pribadi',
      'Headlamp & baterai cadangan',
      'Biaya parkir kendaraan pribadi'
    ]
  },
  {
    id: 'gede',
    name: 'Gunung Gede Pangrango',
    elevation: 2958,
    route: 'Via Putri - Cibodas',
    date: '03 - 04 Okt 2026',
    duration: '2 Hari 1 Malam',
    price: 590000,
    normalPrice: 750000,
    slotsAvailable: 1,
    totalSlots: 10,
    isReady: true,
    level: 'Sedang',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    basecampLocation: 'Cianjur, Jawa Barat',
    tags: ['Alun-Alun Surya Kencana', 'Edelweiss Abadi', 'Kawah Gede'],
    includes: [
      'Simaksi TNGGP & Cek Medis Basecamp',
      'Tenda Dome Windproof (isi 3)',
      'Makan 3x di Surken',
      'Guide & Porter Tim',
      'Welcome Drink & Snack pendakian',
      'Dokumentasi Konten Reels/TikTok'
    ],
    excludes: [
      'Ongkos kendaraan ke basecamp Putri',
      'Peralatan pribadi (SB & Matras)',
      'Porter barang bawaan pribadi'
    ]
  },
  {
    id: 'semeru',
    name: 'Gunung Semeru / Bromo',
    elevation: 3676,
    route: 'Via Ranu Pane / Tosari',
    date: '10 - 12 Nov 2026',
    duration: '3 Hari 2 Malam',
    price: 1350000,
    normalPrice: 1600000,
    slotsAvailable: 6,
    totalSlots: 16,
    isReady: false,
    level: 'Tantangan',
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    basecampLocation: 'Lumajang / Malang, Jawa Timur',
    tags: ['Ranu Kumbolo', 'Tanjakan Cinta', 'Mahameru 3676M'],
    includes: [
      'Simaksi TNBTS & Asuransi',
      'Jeep 4x4 PP Basecamp',
      'Tenda Dome & Matras spon',
      'Makan 6x lengkap selama trip',
      'Guide & Porter logistik',
      'Dokumentasi Drone & Kamera'
    ],
    excludes: [
      'Tiket kereta/pesawat ke Malang',
      'Perlengkapan pribadi',
      'Porter pribadi'
    ]
  },
  {
    id: 'lawu',
    name: 'Gunung Lawu',
    elevation: 3265,
    route: 'Via Candi Cetho',
    date: '15 - 16 Nov 2026',
    duration: '2 Hari 1 Malam',
    price: 650000,
    normalPrice: 790000,
    slotsAvailable: 5,
    totalSlots: 12,
    isReady: true,
    level: 'Sedang',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    basecampLocation: 'Karanganyar, Jawa Tengah',
    tags: ['Warung Mbok Yem Tertinggi', 'Pos 5 Bulak Peperangan', 'Mistis & Indah'],
    includes: [
      'Simaksi & Registrasi Candi Cetho',
      'Tenda Camping (isi 3 orang)',
      'Makan 3x + Mampir Warung Mbok Yem',
      'Guide bersertifikasi APGI',
      'Porter Tim (Tenda & Logistik)',
      'Dokumentasi High Res'
    ],
    excludes: [
      'Transportasi stasiun Solo ke Basecamp',
      'Jajan pecel Mbok Yem tambahan',
      'Sleeping bag pribadi'
    ]
  }
];
