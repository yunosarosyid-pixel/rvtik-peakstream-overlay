import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Flame } from 'lucide-react';
import { TripPackage } from '../types';

interface MiniBannerSliderProps {
  readyTrips: TripPackage[];
  activeTripId: string;
  onSelectTrip?: (tripId: string) => void;
}

export const MiniBannerSlider: React.FC<MiniBannerSliderProps> = ({
  readyTrips,
  activeTripId,
  onSelectTrip,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance banner every 6 seconds if there are multiple ready trips
  useEffect(() => {
    if (readyTrips.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % readyTrips.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [readyTrips.length]);

  if (readyTrips.length === 0) {
    return (
      <div className="absolute top-3 left-3 right-3 z-30 pointer-events-none">
        <div className="bg-[#171513]/90 border border-stone-800 rounded-xl p-2 text-center text-xs text-stone-400 font-mono">
          Status: Belum ada jadwal gunung yang ditandai 'Ready'
        </div>
      </div>
    );
  }

  const currentTrip = readyTrips[currentIndex % readyTrips.length];

  return (
    <div className="absolute top-3 left-3 right-3 z-30 pointer-events-auto select-none">
      <div className="bg-[#151412]/95 border border-stone-700/80 rounded-xl p-2.5 shadow-xl overflow-hidden relative">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-stone-800/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7de39b]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7de39b] font-mono">
              OPEN TRIP READY
            </span>
            <span className="text-[9px] text-stone-400 bg-[#211f1c] px-1.5 py-0.2 rounded font-mono">
              {currentIndex + 1}/{readyTrips.length}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-bold text-[#f8a855] bg-[#311f12] border border-[#6b3e1a] px-2 py-0.2 rounded">
            <Flame className="w-3 h-3 text-[#f8a855]" />
            <span>SISA {currentTrip.availableSlots} SLOT</span>
          </div>
        </div>

        {/* Sliding Card Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrip.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex items-center justify-between gap-2.5 cursor-pointer"
            onClick={() => onSelectTrip && onSelectTrip(currentTrip.id)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 border border-stone-700 bg-stone-900">
                <img
                  src={currentTrip.imageUrl}
                  alt={currentTrip.mountainName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono text-center text-[#7de39b]">
                  {currentTrip.elevationMdpl}m
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-[#f7f4ee] truncate font-['Outfit']">
                    {currentTrip.mountainName}
                  </h3>
                  {currentTrip.badgeTag && (
                    <span className="text-[8px] bg-[#3a2010] text-[#f8a855] border border-[#78461b] font-bold px-1 rounded uppercase tracking-wider">
                      {currentTrip.badgeTag}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mt-0.5 truncate font-mono">
                  <span className="flex items-center gap-1 text-[#7de39b]">
                    <Calendar className="w-2.5 h-2.5" />
                    {currentTrip.tripDates}
                  </span>
                  <span>•</span>
                  <span>{currentTrip.route}</span>
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="block text-[9px] text-stone-400 line-through font-mono">
                Rp {currentTrip.originalPrice.toLocaleString('id-ID')}
              </span>
              <span className="block text-xs font-black text-[#66e088] font-['Outfit']">
                Rp {currentTrip.promoPrice.toLocaleString('id-ID')}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators */}
        {readyTrips.length > 1 && (
          <div className="flex justify-center gap-1 mt-1.5">
            {readyTrips.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-0.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-4 bg-[#7de39b]' : 'w-1 bg-stone-700'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
