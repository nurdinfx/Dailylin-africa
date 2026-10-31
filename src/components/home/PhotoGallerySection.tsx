'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Camera, ArrowRight, Eye } from 'lucide-react';
import LightboxModal, { GalleryPhoto } from '../common/LightboxModal';

export interface PhotoGalleryData {
  id: string;
  titleSo: string;
  titleEn: string;
  descriptionSo?: string | null;
  descriptionEn?: string | null;
  coverImage: string;
  category?: string | null;
  photographer?: string | null;
  images: GalleryPhoto[];
}

interface PhotoGallerySectionProps {
  galleries: PhotoGalleryData[];
}

export default function PhotoGallerySection({ galleries }: PhotoGallerySectionProps) {
  const { language, t } = useLanguage();
  const [activeGallery, setActiveGallery] = useState<PhotoGalleryData | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!galleries || galleries.length === 0) return null;

  const currentGallery = galleries[0];

  const handleOpenPhoto = (gallery: PhotoGalleryData, index: number) => {
    setActiveGallery(gallery);
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-12 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-6 bg-[#FFC928] rounded-sm"></span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                <Camera className="w-6 h-6 text-[#D97706] dark:text-[#FFC928]" />
                {t.photoGalleries}
              </h2>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
              {t.photoGalleriesDesc}
            </p>
          </div>

          <Link
            href="/photos"
            className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-[#FFC928] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{language === 'so' ? 'Dhammaan Sawirrada' : 'All Photo Essays'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Gallery Visual Layout */}
        <div className="rounded-3xl bg-zinc-50 dark:bg-[#181818] p-5 sm:p-8 border border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              {currentGallery.category && (
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-[#FFC928]">
                  {currentGallery.category}
                </span>
              )}
              <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mt-1">
                {language === 'so' ? currentGallery.titleSo : currentGallery.titleEn}
              </h3>
              {currentGallery.photographer && (
                <p className="text-xs text-zinc-400 mt-1">
                  {language === 'so' ? 'Sawir-qaade' : 'Photography'}: {currentGallery.photographer}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleOpenPhoto(currentGallery, 0)}
              className="inline-flex items-center gap-2 bg-[#FFC928] hover:bg-[#E5B420] text-black font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm self-start md:self-auto"
            >
              <Eye className="w-4 h-4" />
              <span>{t.viewGallery} ({currentGallery.images?.length || 4} {t.photosCount})</span>
            </button>
          </div>

          {/* Photo Mosaic Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {currentGallery.images?.slice(0, 4).map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => handleOpenPhoto(currentGallery, idx)}
                className="group relative h-48 sm:h-64 rounded-xl overflow-hidden cursor-pointer bg-zinc-200 dark:bg-zinc-800 shadow"
              >
                <Image
                  src={img.imageUrl}
                  alt={language === 'so' ? img.captionSo || '' : img.captionEn || ''}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur text-black dark:text-white flex items-center justify-center shadow">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeGallery && (
        <LightboxModal
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={activeGallery.images}
          initialIndex={selectedPhotoIndex}
          galleryTitle={language === 'so' ? activeGallery.titleSo : activeGallery.titleEn}
        />
      )}
    </section>
  );
}

