'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Flame, ArrowUpRight } from 'lucide-react';

export interface BreakingArticle {
  id: string;
  slug: string;
  titleSo: string;
  titleEn: string;
}

interface BreakingNewsTickerProps {
  articles?: BreakingArticle[];
  customTextSo?: string | null;
  customTextEn?: string | null;
  enabled?: boolean;
}

export default function BreakingNewsTicker({
  articles = [],
  customTextSo,
  customTextEn,
  enabled = true,
}: BreakingNewsTickerProps) {
  const { language, t } = useLanguage();

  if (!enabled) return null;

  const hasArticles = articles && articles.length > 0;
  const customText = language === 'so' ? customTextSo : customTextEn;

  if (!hasArticles && !customText) return null;

  return (
    <div className="bg-gradient-to-r from-[#002B66] via-[#003B8C] to-[#0084FF] text-white border-y border-[#002B66] shadow-sm select-none">
      <div className="max-w-7xl mx-auto flex items-center overflow-hidden">
        {/* Urgent Badge */}
        <div className="flex-shrink-0 bg-[#001E47] text-[#38BDF8] font-black text-xs sm:text-sm uppercase tracking-wider py-2.5 px-3.5 sm:px-5 flex items-center gap-1.5 shadow-md z-10 border-r border-[#002B66]/60">
          <Flame className="w-4 h-4 animate-bounce text-[#38BDF8]" />
          <span>{t.breakingNews}</span>
        </div>

        {/* Scrolling Ticker Line */}
        <div className="relative flex-1 overflow-hidden py-2 px-3">
          <div className="animate-ticker inline-flex items-center space-x-8 text-xs sm:text-sm font-semibold text-white">
            {customText && (
              <span className="flex items-center gap-2 hover:text-[#38BDF8] transition-colors cursor-pointer">
                <span>{customText}</span>
                <span className="text-blue-300 font-normal">●</span>
              </span>
            )}

            {articles.map((item) => {
              const title = language === 'so' ? item.titleSo : item.titleEn;
              return (
                <Link
                  key={item.id}
                  href={`/articles/${item.slug}`}
                  className="flex items-center gap-2 hover:text-[#38BDF8] transition-colors whitespace-nowrap group"
                >
                  <span className="group-hover:underline">{title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#38BDF8]" />
                  <span className="text-blue-200/60 font-normal ml-3">●</span>
                </Link>
              );
            })}

            {/* Repeat loop for continuous smooth animation */}
            {articles.map((item) => {
              const title = language === 'so' ? item.titleSo : item.titleEn;
              return (
                <Link
                  key={`repeat-${item.id}`}
                  href={`/articles/${item.slug}`}
                  className="flex items-center gap-2 hover:text-[#38BDF8] transition-colors whitespace-nowrap group"
                >
                  <span className="group-hover:underline">{title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#38BDF8]" />
                  <span className="text-blue-200/60 font-normal ml-3">●</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
