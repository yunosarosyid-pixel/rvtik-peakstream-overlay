import React from 'react';
import { AnimatePresence } from 'motion/react';
import { TripPackage, StreamSettings } from '../types';
import { CameraStream } from './CameraStream';
import { MiniBannerSlider } from './MiniBannerSlider';
import { TripPamphlet } from './TripPamphlet';
import { FacilityPamphlet } from './FacilityPamphlet';
import { SocialNoticeOverlay } from './SocialNoticeOverlay';
import { QrBookingModal } from './QrBookingModal';
import { RunningTicker } from './RunningTicker';

interface ObsOverlayViewProps {
  settings: StreamSettings;
  trips: TripPackage[];
  onSelectTrip?: (tripId: string) => void;
  onCloseQr?: () => void;
  onDismissNotice?: () => void;
}

export const ObsOverlayView: React.FC<ObsOverlayViewProps> = ({
  settings,
  trips,
  onSelectTrip,
  onCloseQr,
  onDismissNotice,
}) => {
  const readyTrips = trips.filter((t) => t.isReady);
  const activeTrip = trips.find((t) => t.id === settings.activeTripId) || readyTrips[0] || trips[0];

  return (
    <div className="relative w-full h-full bg-stone-950 overflow-hidden select-none font-['Plus_Jakarta_Sans']">
      {/* 1. Camera Stream Layer (Background Full in Mode 1, Animated Floating Circle PiP in Mode 2 & 3) */}
      <CameraStream
        mode={settings.currentMode}
        deviceId={settings.selectedCameraDeviceId}
        useSimulatedCamera={settings.useSimulatedCamera}
        showNoticeSpotlight={settings.showNoticeSpotlight}
        noticeViewerName={settings.noticeViewerName}
      />

      {/* 2. Top Mini Banner Slider (Active in Mode 1) */}
      <AnimatePresence>
        {settings.currentMode === 'mode1_full' && (
          <MiniBannerSlider
            readyTrips={readyTrips}
            activeTripId={settings.activeTripId}
            onSelectTrip={onSelectTrip}
          />
        )}
      </AnimatePresence>

      {/* 3. Main Trip Pamphlet (Active in Mode 2) */}
      <AnimatePresence>
        {settings.currentMode === 'mode2_trip' && activeTrip && (
          <TripPamphlet
            key={`pamphlet-${activeTrip.id}`}
            trip={activeTrip}
            waNumber={settings.waNumber}
            quickStamp={settings.quickStamp}
            onOpenWhatsAppQr={onCloseQr}
          />
        )}
      </AnimatePresence>

      {/* 4. Facility Pamphlet: Include & Exclude (Active in Mode 3) */}
      <AnimatePresence>
        {settings.currentMode === 'mode3_facility' && activeTrip && (
          <FacilityPamphlet
            key={`facility-${activeTrip.id}`}
            trip={activeTrip}
            waNumber={settings.waNumber}
            onOpenWhatsAppQr={onCloseQr}
          />
        )}
      </AnimatePresence>

      {/* 5. Social Ninja Stream Chat Notice Spotlight */}
      <SocialNoticeOverlay
        isVisible={settings.showNoticeSpotlight}
        viewerName={settings.noticeViewerName}
        question={settings.noticeQuestion}
        onDismiss={onDismissNotice || (() => {})}
      />

      {/* 6. WhatsApp QR Booking Modal Pop-up */}
      <QrBookingModal
        isOpen={settings.showQrPopup}
        waNumber={settings.waNumber}
        waAdminName={settings.waAdminName}
        activeMountainName={activeTrip?.mountainName}
        onClose={onCloseQr || (() => {})}
      />

      {/* 7. Bottom Running Text Ticker */}
      <RunningTicker
        text={settings.runningText}
        waNumber={settings.waNumber}
      />
    </div>
  );
};
