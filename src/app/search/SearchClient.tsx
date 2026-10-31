'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Filter, BookOpen, Clock } from 'lucide-react';
import ArticleCard, { ArticleCardData } from '@/components/articles/ArticleCard';

export default function SearchClient({ categories }: { categories: any[] }) {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQ = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [articles, setArticles] = useState<ArticleCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalFound, setTotalFound] = useState(0);

  const performSearch = async (term: string, cat: string) => {
    if (!term.trim() && !cat) {
      setArticles([]);
      setTotalFound(0);
      return;
    }

    setLoading(true);
    try {
      let url = `/api/articles?limit=30`;
      if (term) url += `&q=${encodeURIComponent(term)}`;
      if (cat) url += `&category=${cat}`;

      const res = await fetch(url);
      const data = await res.json();
      setArticles(data.articles || []);
      setTotalFound(data.total || 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQ) {
      setSearchTerm(initialQ);
      performSearch(initialQ, selectedCategory);
    }
  }, [initialQ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    performSearch(searchTerm, selectedCategory);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2.5 h-7 bg-[#FFC928] rounded-sm"></span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
            {t.search}
          </h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {language === 'so'
            ? 'Ka raadi xogaha iyo wararka Dailylink Africa adigoo isticmaalaya ereyo kooban.'
            : 'Search the verified reporting and multimedia database of Dailylink Africa.'}
        </p>
      </div>

      {/* Search Input Box & Filter */}
      <form onSubmit={handleSubmit} className="mb-10 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPrompt}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-50 dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 text-base text-zinc-900 dark:text-white focus:outline-none focus:border-[#FFC928] shadow-sm"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              performSearch(searchTerm, e.target.value);
            }}
            className="px-4 py-3.5 rounded-2xl bg-zinc-50 dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none"
          >
            <option value="">{t.allCategories}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {language === 'so' ? c.nameSo : c.nameEn}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-[#FFC928] hover:bg-[#E5B420] text-black font-bold px-7 py-3.5 rounded-2xl text-sm transition-all shadow-md shrink-0"
          >
            {t.search}
          </button>
        </div>
      </form>

      {/* Results Meta */}
      {searchTerm && (
        <div className="mb-6 flex items-center justify-between text-xs text-zinc-500 pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <span>
            {totalFound} {t.articlesFound} for &quot;<strong className="text-zinc-900 dark:text-white">{searchTerm}</strong>&quot;
          </span>
        </div>
      )}

      {/* Results Grid */}
      {loading ? (
        <div className="text-center py-20 text-zinc-400">
          <div className="w-8 h-8 border-4 border-[#FFC928] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <span>{t.loading}</span>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art) => (
            <ArticleCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      ) : searchTerm ? (
        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500 text-sm">{t.noResultsFound}</p>
        </div>
      ) : null}
    </div>
  );
}

