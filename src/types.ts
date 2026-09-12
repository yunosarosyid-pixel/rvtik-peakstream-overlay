export type DisplayMode = 'mode1_full' | 'mode2_trip' | 'mode3_facility';

export interface TripPackage {
  id: string;
  mountainName: string;
  subtitle: string;
  route: string;
  elevationMdpl: number;
  tripDates: string;
  duration: string;
  meetingPoint: string;
  originalPrice: number;
  promoPrice: number;
  availableSlots: number;
  totalSlots: number;
  isReady: boolean;
  imageUrl: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  badgeTag?: string;
}

export interface StreamSettings {
  currentMode: DisplayMode;
  activeTripId: string;
  waNumber: string;
  waAdminName: string;
  brandName: string;
  runningText: string;
  showQrPopup: boolean;
  showNoticeSpotlight: boolean;
  noticeViewerName: string;
  noticeQuestion: string;
  quickStamp: string | null;
  selectedCameraDeviceId: string;
  useSimulatedCamera: boolean;
  audioMuted: boolean;
  isNightModeOverlay: boolean;
}

export interface SyncMessage {
  type: 'UPDATE_SETTINGS' | 'UPDATE_TRIPS' | 'TRIGGER_STAMP' | 'TRIGGER_NOTICE' | 'RESET_STATE';
  payload: any;
  timestamp: number;
}
