'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Camera, Eye, ArrowRight } from 'lucide-react';
import LightboxModal from '@/components/common/LightboxModal';

export default function PhotosClient({ galleries }: { galleries: any[] }) {
  const { language, t } = useLanguage();
  const [activeGallery, setActiveGallery] = useState<any | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleOpenPhoto = (gallery: any, index: number) => {
    setActiveGallery(gallery);
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-2.5 h-7 bg-[#0084FF] rounded-sm"></span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <Camera className="w-7 h-7 text-[#0084FF] dark:text-[#38BDF8]" />
          {t.photoGalleries}
        </h1>
      </div>
      <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl mb-10">
        {t.photoGalleriesDesc}
      </p>

      {/* Galleries List */}
      <div className="space-y-12">
        {galleries.map((gal) => {
          const title = language === 'so' ? gal.titleSo : gal.titleEn;
          const desc = language === 'so' ? gal.descriptionSo : gal.descriptionEn;

          return (
            <div
              key={gal.id}
              className="rounded-3xl bg-zinc-50 dark:bg-[#181818] p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  {gal.category && (
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0084FF] dark:text-[#38BDF8]">
                      {gal.category}
                    </span>
                  )}
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
                    {title}
                  </h2>
                  {desc && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-2xl">
                      {desc}
                    </p>
                  )}
                  {gal.photographer && (
                    <p className="text-xs text-zinc-400 mt-2 font-medium">
                      {language === 'so' ? 'Sawir-qaade' : 'Photographer'}: {gal.photographer}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenPhoto(gal, 0)}
                  className="inline-flex items-center gap-2 bg-[#0084FF] hover:bg-[#006ED6] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm self-start md:self-auto shrink-0"
                >
                  <Eye className="w-4 h-4" />
                  <span>
                    {t.viewGallery} ({gal.images?.length || 1} {t.photosCount})
                  </span>
                </button>
              </div>

              {/* Photos Mosaic */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gal.images?.map((img: any, idx: number) => (
                  <div
                    key={img.id || idx}
                    onClick={() => handleOpenPhoto(gal, idx)}
                    className="group relative h-48 sm:h-64 rounded-xl overflow-hidden cursor-pointer bg-zinc-200 dark:bg-zinc-800 shadow"
                  >
                    <Image
                      src={img.imageUrl?.trim() ? img.imageUrl : '/logo.png'}
                      alt={language === 'so' ? img.captionSo || '' : img.captionEn || ''}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur text-black dark:text-white flex items-center justify-center shadow">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {activeGallery && (
        <LightboxModal
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={activeGallery.images}
          initialIndex={selectedIndex}
          galleryTitle={language === 'so' ? activeGallery.titleSo : activeGallery.titleEn}
        />
      )}
    </div>
  );
}

