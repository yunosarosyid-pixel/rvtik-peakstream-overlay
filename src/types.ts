export type BroadcastMode = 'mode1_facecam' | 'mode2_flyer' | 'mode3_facilities';

export type StampType =
  | 'NONE'
  | 'FLASH_SALE'
  | 'SISA_2_SLOT'
  | 'BEST_SELLER'
  | 'HARGA_EARLY_BIRD'
  | 'KUOTA_HAMPIR_HABIS'
  | 'PROMO_LIVE_HARI_INI'
  | 'GRATIS_BUFF_STIKER';

export interface MountainTrip {
  id: string;
  name: string;
  elevation: number; // MDPL
  route: string;
  date: string;
  duration: string;
  price: number; // IDR
  normalPrice: number; // IDR
  slotsAvailable: number;
  totalSlots: number;
  isReady: boolean;
  level: 'Pemula' | 'Sedang' | 'Tantangan';
  imageUrl: string;
  includes: string[];
  excludes: string[];
  tags: string[];
  basecampLocation: string;
}

export interface ChatNotice {
  active: boolean;
  sender: string;
  question: string;
  timestamp: number;
}

export interface StreamState {
  mode: BroadcastMode;
  activeMountainId: string;
  stamp: StampType;
  tickerText: string;
  tickerEnabled: boolean;
  chatSpotlight: ChatNotice | null;
  qrModalActive: boolean;
  whatsappNumber: string;
  whatsappMessage: string;
  isLive: boolean;
  cameraSimulated: boolean;
  selectedCameraDeviceId: string;
  pipPosition: 'bottom-right' | 'bottom-left' | 'top-right';
}
