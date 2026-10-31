'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface GalleryPhoto {
  id: string;
  imageUrl: string;
  captionSo?: string | null;
  captionEn?: string | null;
}

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryPhoto[];
  initialIndex?: number;
  galleryTitle?: string;
}

export default function LightboxModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  galleryTitle,
}: LightboxModalProps) {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const caption = language === 'so' ? currentImage.captionSo : currentImage.captionEn;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none animate-fade-in"
      onClick={onClose}
    >
      {/* Top Header */}
      <div 
        className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between text-white z-20 bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {galleryTitle && (
            <h4 className="text-sm sm:text-base font-bold text-zinc-200">
              {galleryTitle}
            </h4>
          )}
          <span className="text-xs text-zinc-400 font-mono">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-[#FFC928] text-white hover:text-black transition-colors z-20 shadow-lg"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-[#FFC928] text-white hover:text-black transition-colors z-20 shadow-lg"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image View */}
      <div 
        className="relative max-w-6xl max-h-[80vh] w-full h-full flex flex-col items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[65vh] flex items-center justify-center">
          <Image
            src={currentImage.imageUrl}
            alt={caption || galleryTitle || 'Photo'}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Caption */}
        {caption && (
          <div className="mt-4 px-6 py-2.5 rounded-lg bg-black/70 backdrop-blur text-center text-sm text-zinc-200 max-w-2xl border border-zinc-800">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}

