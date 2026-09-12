import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquareQuote, User, X, Sparkles } from 'lucide-react';

interface SocialNoticeOverlayProps {
  isVisible: boolean;
  viewerName: string;
  question: string;
  onDismiss: () => void;
}

export const SocialNoticeOverlay: React.FC<SocialNoticeOverlayProps> = ({
  isVisible,
  viewerName,
  question,
  onDismiss,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="absolute bottom-16 left-3 right-3 z-40 select-none"
        >
          <div className="relative bg-[#1c1813]/98 border border-[#78461b] rounded-xl p-3 shadow-2xl text-stone-200">
            {/* Header / Notice Tag */}
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#362415]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#f8a855] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#f8a855] bg-[#3a2010] border border-[#6b3e1a] px-2 py-0.5 rounded font-mono">
                  LIVE CHAT NOTICE
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#f5ebd9] flex items-center gap-1 font-mono">
                  <User className="w-3 h-3 text-[#f8a855]" />
                  {viewerName || '@penonton'}
                </span>
                <button
                  onClick={onDismiss}
                  className="w-5 h-5 rounded bg-stone-800 text-stone-400 hover:text-stone-100 flex items-center justify-center transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Question Box */}
            <div className="flex items-start gap-2.5 bg-[#12100d] rounded-lg p-2.5 border border-stone-800">
              <MessageSquareQuote className="w-4 h-4 text-[#f8a855] flex-shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-[#f5ebd9] leading-relaxed">
                "{question}"
              </p>
            </div>

            {/* Sub-label */}
            <div className="flex justify-between items-center mt-1.5 px-0.5 text-[9px] text-stone-400 font-mono">
              <span>Host sedang menjawab langsung di live</span>
              <span className="text-[#f8a855] font-semibold">Social Ninja Stream</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
