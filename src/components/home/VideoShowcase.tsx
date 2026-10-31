'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Play, Video as VideoIcon, Clock, ArrowRight } from 'lucide-react';
import VideoModal from '../common/VideoModal';

export interface VideoItem {
  id: string;
  titleSo: string;
  titleEn: string;
  descriptionSo?: string | null;
  descriptionEn?: string | null;
  videoUrl: string;
  thumbnailUrl: string;
  durationSec?: number;
  category?: string | null;
  views?: number;
}

interface VideoShowcaseProps {
  videos: VideoItem[];
}

export default function VideoShowcase({ videos }: VideoShowcaseProps) {
  const { language, t } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  if (!videos || videos.length === 0) return null;

  const leadVideo = videos[0];
  const sideVideos = videos.slice(1);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '03:45';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section className="py-12 bg-zinc-900 text-white border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-6 bg-[#FFC928] rounded-sm"></span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <VideoIcon className="w-6 h-6 text-[#FFC928]" />
                {t.multimediaShowcase}
              </h2>
            </div>
            <p className="text-sm text-zinc-400 max-w-xl">
              {t.multimediaDesc}
            </p>
          </div>

          <Link
            href="/videos"
            className="text-xs font-bold uppercase tracking-wider text-[#FFC928] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{language === 'so' ? 'Dhammaan Muuqaallada' : 'All Videos'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Video Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Large Video Player Card (7 cols) */}
          <div className="lg:col-span-7">
            <div
              onClick={() => setActiveVideo(leadVideo)}
              className="group relative w-full h-[280px] sm:h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-2xl bg-black border border-zinc-800"
            >
              <Image
                src={leadVideo.thumbnailUrl}
                alt={language === 'so' ? leadVideo.titleSo : leadVideo.titleEn}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Big Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FFC928] text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-black translate-x-0.5" />
                </div>
              </div>

              {/* Badges & Meta */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                {leadVideo.category && (
                  <span className="bg-black/80 backdrop-blur-md text-[#FFC928] text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-[#FFC928]/30">
                    {leadVideo.category}
                  </span>
                )}
                <span className="bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#FFC928]" />
                  {formatDuration(leadVideo.durationSec)}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#FFC928] transition-colors leading-tight">
                  {language === 'so' ? leadVideo.titleSo : leadVideo.titleEn}
                </h3>
                {(language === 'so' ? leadVideo.descriptionSo : leadVideo.descriptionEn) && (
                  <p className="text-xs sm:text-sm text-zinc-300 mt-2 line-clamp-2">
                    {language === 'so' ? leadVideo.descriptionSo : leadVideo.descriptionEn}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Secondary Video List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {sideVideos.map((vid) => {
              const title = language === 'so' ? vid.titleSo : vid.titleEn;
              return (
                <div
                  key={vid.id}
                  onClick={() => setActiveVideo(vid)}
                  className="group flex items-center gap-4 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition-all"
                >
                  <div className="relative w-32 h-20 shrink-0 rounded-lg overflow-hidden bg-black">
                    <Image
                      src={vid.thumbnailUrl}
                      alt={title}
                      fill
                      sizes="140px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#FFC928]/90 text-black flex items-center justify-center">
                        <Play className="w-4 h-4 fill-black translate-x-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1.5 py-0.5 rounded text-white font-mono">
                      {formatDuration(vid.durationSec)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {vid.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFC928]">
                        {vid.category}
                      </span>
                    )}
                    <h4 className="text-sm font-bold text-white group-hover:text-[#FFC928] transition-colors line-clamp-2 mt-0.5 leading-snug">
                      {title}
                    </h4>
                    <span className="text-[11px] text-zinc-400 mt-1 block">
                      {vid.views || 1200} {language === 'so' ? 'daawo' : 'views'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <VideoModal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          videoUrl={activeVideo.videoUrl}
          title={language === 'so' ? activeVideo.titleSo : activeVideo.titleEn}
        />
      )}
    </section>
  );
}

