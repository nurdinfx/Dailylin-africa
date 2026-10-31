'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { formatTimeAgo } from '@/lib/utils';
import { Clock, User, ArrowRight, Sparkles, Flame } from 'lucide-react';
import { ArticleCardData } from '../articles/ArticleCard';

interface HeroSectionProps {
  leadStory: ArticleCardData;
  secondaryStories: ArticleCardData[];
}

export default function HeroSection({ leadStory, secondaryStories }: HeroSectionProps) {
  const { language, t } = useLanguage();

  if (!leadStory) return null;

  const leadTitle = language === 'so' ? leadStory.titleSo : leadStory.titleEn;
  const leadSubtitle = language === 'so' ? leadStory.subtitleSo : leadStory.subtitleEn;
  const leadCategory = leadStory.category
    ? language === 'so'
      ? leadStory.category.nameSo
      : leadStory.category.nameEn
    : '';

  return (
    <section className="py-6 sm:py-8 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Heading Tag */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#FFC928] rounded-sm"></span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              {t.topStories}
            </h2>
          </div>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest hidden sm:inline">
            {language === 'so' ? 'Daabacaadda Maanta' : "Today's Edition"}
          </span>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Lead Feature (7 cols) */}
          <div className="lg:col-span-7 group flex flex-col justify-between">
            <Link
              href={`/articles/${leadStory.slug}`}
              className="relative w-full h-[320px] sm:h-[440px] rounded-2xl overflow-hidden block bg-zinc-900 shadow-md"
            >
              <Image
                src={leadStory.featuredImage}
                alt={leadTitle}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                {leadStory.isBreaking && (
                  <span className="bg-black text-[#FFC928] text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-lg flex items-center gap-1.5 border border-[#FFC928]/40">
                    <Flame className="w-3.5 h-3.5 text-[#FFC928]" />
                    {t.breakingNews}
                  </span>
                )}
                <span className="bg-[#FFC928] text-black text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {t.featuredStory}
                </span>
              </div>

              {/* Bottom Overlay Text on Mobile/Tablet */}
              <div className="absolute bottom-4 left-4 right-4 sm:hidden text-white z-10">
                {leadCategory && (
                  <span className="text-xs font-bold text-[#FFC928] uppercase tracking-wider mb-1 block">
                    {leadCategory}
                  </span>
                )}
                <h3 className="text-lg font-bold leading-tight drop-shadow">
                  {leadTitle}
                </h3>
              </div>
            </Link>

            {/* Desktop Headline & Lead Excerpt */}
            <div className="mt-5 hidden sm:block">
              <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mb-2.5">
                {leadCategory && (
                  <Link
                    href={`/category/${leadStory.category?.slug}`}
                    className="font-bold text-amber-800 dark:text-[#FFC928] uppercase tracking-wider hover:underline"
                  >
                    {leadCategory}
                  </Link>
                )}
                <span>•</span>
                <span>{formatTimeAgo(leadStory.publishedAt, language)}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {leadStory.readTimeMin || 4} {t.minRead}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white leading-tight group-hover:text-amber-800 dark:group-hover:text-[#FFC928] transition-colors">
                <Link href={`/articles/${leadStory.slug}`}>{leadTitle}</Link>
              </h3>

              {leadSubtitle && (
                <p className="mt-3 text-base text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                  {leadSubtitle}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  {leadStory.authorAvatar ? (
                    <div className="relative w-7 h-7 rounded-full overflow-hidden">
                      <Image
                        src={leadStory.authorAvatar}
                        alt={leadStory.authorName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <User className="w-4 h-4 text-zinc-400" />
                  )}
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {leadStory.authorName}
                  </span>
                </div>

                <Link
                  href={`/articles/${leadStory.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FFC928] hover:bg-[#E5B420] text-black px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  <span>{t.readMore}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Secondary Spotlight Stories (5 cols) */}
          <div className="lg:col-span-5 flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
            {secondaryStories.slice(0, 3).map((item, idx) => {
              const itemTitle = language === 'so' ? item.titleSo : item.titleEn;
              const itemCategory = item.category
                ? language === 'so'
                  ? item.category.nameSo
                  : item.category.nameEn
                : '';

              return (
                <article
                  key={item.id}
                  className={`group py-4 first:pt-0 last:pb-0 flex items-start gap-4 transition-colors`}
                >
                  <span className="font-serif font-black text-3xl sm:text-4xl text-zinc-300 dark:text-zinc-700 select-none w-6 shrink-0">
                    0{idx + 2}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {itemCategory && (
                        <Link
                          href={`/category/${item.category?.slug}`}
                          className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-[#FFC928] hover:underline"
                        >
                          {itemCategory}
                        </Link>
                      )}
                      <span className="text-[11px] text-zinc-400">•</span>
                      <span className="text-[11px] text-zinc-400">
                        {formatTimeAgo(item.publishedAt, language)}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-amber-800 dark:group-hover:text-[#FFC928] transition-colors line-clamp-2">
                      <Link href={`/articles/${item.slug}`}>{itemTitle}</Link>
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2">
                      <span className="truncate max-w-[150px]">{item.authorName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.readTimeMin || 3} {language === 'so' ? 'daq' : 'min'}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/articles/${item.slug}`}
                    className="relative w-24 h-20 sm:w-28 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm"
                  >
                    <Image
                      src={item.featuredImage}
                      alt={itemTitle}
                      fill
                      sizes="120px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

