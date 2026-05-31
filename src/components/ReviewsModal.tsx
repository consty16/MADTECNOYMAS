import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play } from 'lucide-react';
import { REEL_VIDEOS } from '../constants';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewsModal({ isOpen, onClose }: ReviewsModalProps) {
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
            className="relative max-w-6xl w-full max-h-[90vh] bg-surface-container rounded-3xl border border-primary/20 shadow-[0_0_50px_rgba(86,241,224,0.15)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b border-primary/10 bg-surface-container-low">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(86,241,224,0.2)]">
                  <Play size={20} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-primary tracking-tight">REVIEWS EN ACCIÓN</h3>
                  <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">Videos de nuestros productos</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-primary/20 rounded-full transition-colors text-primary"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8 no-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {REEL_VIDEOS.map((reel) => (
                  <motion.div
                    key={reel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-primary/10 bg-black relative group"
                  >
                    <video
                      src={reel.url}
                      className="w-full h-full object-cover transition-opacity"
                      loop
                      playsInline
                      controls
                    />
                    <div className="absolute bottom-16 left-0 right-0 p-6 bg-gradient-to-t from-black/20 via-black/10 to-transparent pointer-events-none">
                      <h4 className="text-white font-bold text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{reel.title}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-surface-container-low border-t border-primary/10 text-center">
              <p className="text-on-surface-variant text-[10px] uppercase tracking-[0.2em] font-bold">
                Usa los controles del video para reproducir, pausar y ajustar el volumen
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
