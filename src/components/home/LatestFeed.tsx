'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import ArticleCard, { ArticleCardData } from '../articles/ArticleCard';
import { Flame, ArrowRight, Grid, ListFilter, Newspaper } from 'lucide-react';

interface CategoryItem {
  id: string;
  slug: string;
  nameSo: string;
  nameEn: string;
}

interface LatestFeedProps {
  articles: ArticleCardData[];
  categories: CategoryItem[];
}

export default function LatestFeed({ articles, categories }: LatestFeedProps) {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewCount, setViewCount] = useState<number>(6);

  const filtered = activeCategory === 'all'
    ? articles
    : articles.filter((a) => a.category?.slug === activeCategory);

  const displayedArticles = filtered.slice(0, viewCount);
  const hasMore = viewCount < filtered.length;

  return (
    <section id="latest" className="py-12 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#0084FF] rounded-sm"></span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              {t.latestNews}
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-[#0084FF] text-white shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {t.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat.slug
                    ? 'bg-[#0084FF] text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {language === 'so' ? cat.nameSo : cat.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid */}
        {displayedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="standard" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="w-14 h-14 rounded-full bg-[#0084FF]/10 flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-7 h-7 text-[#0084FF]" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
              {language === 'so' ? 'Qolka Wararka Hadda Waa Diyaar' : 'Newsroom Is Ready'}
            </h3>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">
              {language === 'so'
                ? 'Wali ma jiraan warar la daabacay. Isticmaal nidaamka maamulka (CMS) si aad u daabacdo wararkii ugu horreeyay.'
                : 'No published articles yet. Log in to the CMS to publish the first story.'}
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setViewCount((prev) => prev + 6)}
              className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-800 hover:bg-black text-white dark:hover:bg-zinc-700 px-6 py-3 rounded-full text-sm font-bold transition-all shadow hover:shadow-md"
            >
              <span>{language === 'so' ? 'Soo Bandhig Warar Kale' : 'Load More Stories'}</span>
              <ArrowRight className="w-4 h-4 text-[#38BDF8]" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

