import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATALOG_IMAGES } from '../constants';

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export function CatalogModal({ isOpen, onClose, initialIndex = 0 }: CatalogModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % CATALOG_IMAGES.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + CATALOG_IMAGES.length) % CATALOG_IMAGES.length);
  };

  // Reset index when opening
  React.useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full aspect-[3/4] md:aspect-video bg-surface-container rounded-2xl border border-primary/20 shadow-[0_0_50px_rgba(86,241,224,0.15)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-background/80 to-transparent">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Catálogo Digital - {currentIndex + 1} / {CATALOG_IMAGES.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-primary/20 rounded-full transition-colors text-primary"
              >
                <X size={24} />
              </button>
            </div>

            {/* Image Container */}
            <div className="flex-grow relative flex items-center justify-center bg-black/40">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={CATALOG_IMAGES[currentIndex]}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-h-full max-w-full object-contain"
                  alt={`Catálogo página ${currentIndex + 1}`}
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 p-3 bg-background/40 hover:bg-primary/20 border border-primary/20 rounded-full text-primary backdrop-blur-sm transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 p-3 bg-background/40 hover:bg-primary/20 border border-primary/20 rounded-full text-primary backdrop-blur-sm transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Thumbnails / Progress */}
            <div className="p-4 bg-surface-container-low border-t border-primary/10 flex justify-center gap-2 overflow-x-auto no-scrollbar">
              {CATALOG_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentIndex === idx ? 'bg-primary w-6' : 'bg-primary/20'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
