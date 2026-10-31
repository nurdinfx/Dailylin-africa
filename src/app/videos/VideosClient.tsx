'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Video as VideoIcon, Play, Clock, Eye } from 'lucide-react';
import VideoModal from '@/components/common/VideoModal';

export default function VideosClient({ videos }: { videos: any[] }) {
  const { language, t } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<any | null>(null);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '03:45';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-2.5 h-7 bg-[#FFC928] rounded-sm"></span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <VideoIcon className="w-7 h-7 text-[#FFC928]" />
          {t.videos}
        </h1>
      </div>
      <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl mb-10">
        {t.multimediaDesc}
      </p>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((vid) => {
          const title = language === 'so' ? vid.titleSo : vid.titleEn;
          const desc = language === 'so' ? vid.descriptionSo : vid.descriptionEn;

          return (
            <div
              key={vid.id}
              onClick={() => setActiveVideo(vid)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-52 bg-black overflow-hidden">
                <Image
                  src={vid.thumbnailUrl}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#FFC928] text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-black translate-x-0.5" />
                  </div>
                </div>

                {vid.category && (
                  <span className="absolute top-3 left-3 bg-black/80 backdrop-blur text-[#FFC928] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                    {vid.category}
                  </span>
                )}

                <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur text-white text-xs font-mono px-2 py-0.5 rounded">
                  {formatDuration(vid.durationSec)}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-[#FFC928] transition-colors leading-snug line-clamp-2">
                    {title}
                  </h3>
                  {desc && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                      {desc}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {vid.views || 1400} {language === 'so' ? 'daawo' : 'views'}
                  </span>
                  <span className="text-amber-800 dark:text-[#FFC928] font-bold">
                    {t.watchVideo} →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeVideo && (
        <VideoModal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          videoUrl={activeVideo.videoUrl}
          title={language === 'so' ? activeVideo.titleSo : activeVideo.titleEn}
        />
      )}
    </div>
  );
}

