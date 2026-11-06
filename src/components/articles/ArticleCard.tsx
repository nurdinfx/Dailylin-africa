'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { formatTimeAgo, estimateReadingTime } from '@/lib/utils';
import { Clock, User, Flame, Bookmark } from 'lucide-react';

export interface ArticleCardData {
  id: string;
  slug: string;
  featuredImage: string;
  category?: {
    nameSo: string;
    nameEn: string;
    slug: string;
    color?: string | null;
  };
  authorName: string;
  authorAvatar?: string | null;
  publishedAt: string | Date;
  readTimeMin?: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
  titleSo: string;
  subtitleSo?: string | null;
  contentSo?: string;
  titleEn: string;
  subtitleEn?: string | null;
  contentEn?: string;
}

interface ArticleCardProps {
  article: ArticleCardData;
  variant?: 'standard' | 'compact' | 'horizontal' | 'hero-side';
}

export default function ArticleCard({ article, variant = 'standard' }: ArticleCardProps) {
  const { language, t } = useLanguage();

  const title = language === 'so' ? article.titleSo : article.titleEn;
  const subtitle = language === 'so' ? article.subtitleSo : article.subtitleEn;
  const categoryName = article.category
    ? language === 'so'
      ? article.category.nameSo
      : article.category.nameEn
    : '';

  const readingTime = article.readTimeMin || 3;
  const timeAgo = formatTimeAgo(article.publishedAt, language);

  const imageSrc = article.featuredImage?.trim() ? article.featuredImage : '/logo.png';

  if (variant === 'compact') {
    return (
      <article className="group flex items-start gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800/80 last:border-0">
        <Link href={`/articles/${article.slug}`} className="relative w-24 h-20 sm:w-28 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="120px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="flex-1 min-w-0">
          {categoryName && (
            <Link
              href={`/category/${article.category?.slug}`}
              className="text-[11px] font-bold uppercase tracking-wider text-[#0084FF] dark:text-[#38BDF8] hover:underline"
            >
              {categoryName}
            </Link>
          )}
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2 mt-0.5 group-hover:text-[#0084FF] dark:group-hover:text-[#38BDF8] transition-colors">
            <Link href={`/articles/${article.slug}`}>{title}</Link>
          </h4>
          <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1.5">
            <span>{timeAgo}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readingTime} {language === 'so' ? 'daq' : 'min'}
            </span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className="group grid grid-cols-1 md:grid-cols-12 gap-5 p-4 rounded-2xl bg-zinc-50/60 dark:bg-[#181818] border border-zinc-200/80 dark:border-zinc-800/80 hover:shadow-lg transition-all duration-300">
        <div className="md:col-span-5 relative h-52 md:h-full min-h-[180px] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {article.isBreaking && (
            <span className="absolute top-2.5 left-2.5 bg-[#002B66] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow flex items-center gap-1 border border-[#0084FF]/40">
              <Flame className="w-3 h-3 text-[#38BDF8]" />
              {t.breakingNews}
            </span>
          )}
        </div>

        <div className="md:col-span-7 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              {categoryName && (
                <Link
                  href={`/category/${article.category?.slug}`}
                  className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-[#002B66]/60 text-[#0084FF] dark:text-[#38BDF8] border border-blue-200/60 dark:border-blue-900/60"
                >
                  {categoryName}
                </Link>
              )}
              <span className="text-xs text-zinc-400">{timeAgo}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-[#0084FF] dark:group-hover:text-[#38BDF8] transition-colors">
              <Link href={`/articles/${article.slug}`}>{title}</Link>
            </h3>

            {subtitle && (
              <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2 mt-2 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 opacity-70" />
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {article.authorName}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {readingTime} {t.minRead}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard vertical grid card
  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-[#1B1B1B] border border-zinc-200/90 dark:border-zinc-800/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Link href={`/articles/${article.slug}`} className="relative w-full h-52 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {article.isBreaking && (
          <span className="absolute top-3 left-3 bg-[#002B66] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow flex items-center gap-1 border border-[#0084FF]/40">
            <Flame className="w-3 h-3 text-[#38BDF8]" />
            {t.breakingNews}
          </span>
        )}

        {categoryName && (
          <span className="absolute bottom-3 left-3 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#002B66]/90 backdrop-blur-md text-white border border-[#0084FF]/40 shadow-sm">
            {categoryName}
          </span>
        )}
      </Link>

      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span>{timeAgo}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readingTime} {language === 'so' ? 'daq' : 'min'}
            </span>
          </div>

          <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-[#0084FF] dark:group-hover:text-[#38BDF8] transition-colors line-clamp-2">
            <Link href={`/articles/${article.slug}`}>{title}</Link>
          </h3>

          {subtitle && (
            <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2 mt-2 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[180px]">
            {article.authorName}
          </span>
          <Link
            href={`/articles/${article.slug}`}
            className="text-[#0084FF] dark:text-[#38BDF8] font-bold text-xs hover:underline"
          >
            {t.readMore} →
          </Link>
        </div>
      </div>
    </article>
  );
}

