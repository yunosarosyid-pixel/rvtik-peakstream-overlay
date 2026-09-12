import { TripPackage, StreamSettings } from '../types';

export const DEFAULT_TRIPS: TripPackage[] = [
  {
    id: 'merbabu-selo',
    mountainName: 'Gunung Merbabu',
    subtitle: 'Negeri di Atas Awan & Sabana Terbaik Jawa Tengah',
    route: 'Jalur Selo, Boyolali',
    elevationMdpl: 3142,
    tripDates: '26 - 28 September 2026',
    duration: '3D2N (Weekend Trip)',
    meetingPoint: 'Basecamp Selo / Stasiun Solo Balapan',
    originalPrice: 850000,
    promoPrice: 699000,
    availableSlots: 4,
    totalSlots: 15,
    isReady: true,
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
    badgeTag: 'BEST SELLER',
    highlights: [
      'Pemandangan Sabana 1 & 2 yang ikonik',
      'Sunrise memukau dengan latar Merapi aktif',
      'Camping ground nyaman dan teduh',
      'Dokumentasi drone & foto ciamik'
    ],
    includes: [
      'Tenda Dome Double Layer (kapasitas 4 isi 3 orang)',
      'Matras spons tebal per peserta',
      'Makan 5x bergizi & hangat selama di gunung',
      'Peralatan masak tim (kompor, nesting, gas)',
      'Porter tim untuk bawa tenda & logistik bersama',
      'Tiket Simaksi resmi & Asuransi TN Gunung Merbabu',
      'Guide berpengalaman & berlisensi APGI',
      'Standar Medis P3K & Tabung Oksigen Portabel'
    ],
    excludes: [
      'Transportasi menuju Meeting Point (bisa diantar jemput)',
      'Carrier / tas ransel pribadi',
      'Jaket polar / windbreaker pribadi',
      'Sleeping bag pribadi (bisa sewa di basecamp)',
      'Peralatan mandi & obat-obatan pribadi',
      'Tips sukarela untuk guide & porter'
    ]
  },
  {
    id: 'rinjani-sembalun',
    mountainName: 'Gunung Rinjani',
    subtitle: 'The Royal Summit & Segara Anak Paradise',
    route: 'Sembalun - Torean (Lombok)',
    elevationMdpl: 3726,
    tripDates: '15 - 19 Oktober 2026',
    duration: '5D4N (Paket Eksklusif)',
    meetingPoint: 'Bandara Internasional Lombok (LOP)',
    originalPrice: 2850000,
    promoPrice: 2490000,
    availableSlots: 2,
    totalSlots: 12,
    isReady: true,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    badgeTag: 'SISA 2 SLOT',
    highlights: [
      'Puncak 3726 Mdpl atap pulau Lombok',
      'Danau Segara Anak & Sumber Air Panas Alami',
      'Jalur eksotis sungai purba Torean',
      'Termasuk antar jemput bandara Lombok PP'
    ],
    includes: [
      'Transportasi AC Bandara Lombok - Basecamp PP',
      'Homestay 1 malam sebelum pendakian',
      'Tenda premium kapasitas 4 isi 2 (lebih lega)',
      'Matras angin / inflatable sleeping pad tebal',
      'Makan 3x sehari fresh menu nusantara di gunung',
      'Piring, gelas, kursi & meja santai camping',
      'Porter kelompok bawa seluruh tenda & makanan',
      'Tiket masuk TN Gunung Rinjani & asuransi',
      'Guide lokal berpengalaman Sembalun'
    ],
    excludes: [
      'Tiket pesawat dari kota asal ke Lombok',
      'Porter pribadi (jika ingin barang bawaan dibawakan)',
      'Headlamp & baterai cadangan pribadi',
      'Pakaian ganti & trekking pole pribadi',
      'Pengeluaran pribadi di luar program'
    ]
  },
  {
    id: 'prau-dieng',
    mountainName: 'Gunung Prau',
    subtitle: 'Golden Sunrise Terindah Se-Asia Tenggara',
    route: 'Jalur Patakbanteng / Dieng',
    elevationMdpl: 2565,
    tripDates: '3 - 4 Oktober 2026',
    duration: '2D1N (Ramah Pemula)',
    meetingPoint: 'Terminal / Stasiun Purwokerto & Wonosobo',
    originalPrice: 650000,
    promoPrice: 499000,
    availableSlots: 6,
    totalSlots: 20,
    isReady: true,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    badgeTag: 'RAMAH PEMULA',
    highlights: [
      'Golden sunrise spektakuler bukit teletubbies',
      'Waktu tempuh pendakian hanya 3-4 jam',
      'Sangat cocok untuk first-timer / pemula',
      'Bonus mampir wisata kawah Dieng Plateau'
    ],
    includes: [
      'Tenda Dome Double Layer (kapasitas 4 isi 3)',
      'Matras tidur per orang',
      'Makan 3x hangat di gunung',
      'Welcome drink & snack hangat di camp',
      'Porter tim & peralatan masak',
      'Tiket Simaksi resmi Dieng',
      'Guide & fasilitator pendakian',
      'P3K darurat'
    ],
    excludes: [
      'Transportasi dari kota asal ke Wonosobo',
      'Ojek basecamp ke pintu rimba (opsional 25k)',
      'Sleeping bag & jaket pribadi',
      'Keperluan jajan pribadi'
    ]
  },
  {
    id: 'sumbing-bowongso',
    mountainName: 'Gunung Sumbing',
    subtitle: 'Puncak Rajawali & Eksotisme Jalur Savana',
    route: 'Jalur Bowongso / Garung',
    elevationMdpl: 3371,
    tripDates: '10 - 12 Oktober 2026',
    duration: '3D2N',
    meetingPoint: 'Basecamp Bowongso, Wonosobo',
    originalPrice: 900000,
    promoPrice: 750000,
    availableSlots: 5,
    totalSlots: 14,
    isReady: false,
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    badgeTag: 'OPEN TRIP',
    highlights: [
      'Lautan awan luas di puncak Rajawali',
      'Jalur pendakian yang asri dan tidak terlalu ramai',
      'Pemandangan megah Gunung Sindoro di seberang'
    ],
    includes: [
      'Tenda dome kapasitas 4 isi 3',
      'Matras, makan 5x & air minum',
      'Porter tim logistik',
      'Simaksi & Guide'
    ],
    excludes: [
      'Ojek menuju pos 1',
      'Perlengkapan pribadi & sleeping bag'
    ]
  },
  {
    id: 'lawu-cetho',
    mountainName: 'Gunung Lawu',
    subtitle: 'Mistis & Magis Sabana Gupakan Menjangan',
    route: 'Jalur Candi Cetho, Karanganyar',
    elevationMdpl: 3265,
    tripDates: '23 - 25 Oktober 2026',
    duration: '3D2N',
    meetingPoint: 'Stasiun Solo Jebres / Balapan',
    originalPrice: 850000,
    promoPrice: 720000,
    availableSlots: 3,
    totalSlots: 15,
    isReady: false,
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    badgeTag: 'JALUR VIRAL',
    highlights: [
      'Start dari pelataran Candi Cetho bernuansa Bali',
      'Savana Gupakan Menjangan yang sangat luas',
      'Mampir sarapan di Warung Mbok Yem legendaris'
    ],
    includes: [
      'Tenda dome kapasitas 4 isi 3',
      'Matras & makan 5x',
      'Porter tim & tiket simaksi',
      'Guide APGI & dokumentasi'
    ],
    excludes: [
      'Transport kota asal ke Solo',
      'Perlengkapan pribadi'
    ]
  }
];

export const DEFAULT_SETTINGS: StreamSettings = {
  currentMode: 'mode1_full',
  activeTripId: 'merbabu-selo',
  waNumber: '0812-3456-7890',
  waAdminName: 'Admin Open Trip (Kak Yuno)',
  brandName: 'PEAKVENTURE ADVENTURE',
  runningText: '🔥 DISKON DP RP 50.000 KHUSUS YANG BOOKING SELAMA LIVE INI BERLANGSUNG! CHAT WA UNTUK KUNCI SLOT. KUOTA TERBATAS 🔥',
  showQrPopup: false,
  showNoticeSpotlight: false,
  noticeViewerName: '@pendaki_santai',
  noticeQuestion: 'Kak untuk Merbabu tendanya bawa sendiri atau sudah dapat dari panitia?',
  quickStamp: null,
  selectedCameraDeviceId: '',
  useSimulatedCamera: false,
  audioMuted: false,
  isNightModeOverlay: false
};
