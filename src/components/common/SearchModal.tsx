'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Search, X, Clock, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  slug: string;
  titleSo: string;
  titleEn: string;
  category?: {
    nameSo: string;
    nameEn: string;
  };
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dailylink_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or trigger
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/articles?q=${encodeURIComponent(query)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.articles || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const saveRecentSearch = (text: string) => {
    if (!text.trim()) return;
    const updated = [text, ...recentSearches.filter((s) => s !== text)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('dailylink_recent_searches', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSelectArticle = (slug: string) => {
    saveRecentSearch(query);
    onClose();
    router.push(`/articles/${slug}`);
  };

  const handleFullSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveRecentSearch(query);
    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('dailylink_recent_searches');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#1B1B1B] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleFullSearch} className="flex items-center px-4 sm:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none text-base sm:text-lg"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 text-xs font-semibold px-2"
          >
            ESC
          </button>
        </form>

        {/* Content Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-8 text-zinc-400 text-sm">
              <div className="w-5 h-5 border-2 border-[#FFC928] border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>{t.loading}</span>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-2">
                {language === 'so' ? 'Wararka la Helay' : 'Matching Articles'}
              </span>
              <div className="space-y-1">
                {results.map((art) => {
                  const title = language === 'so' ? art.titleSo : art.titleEn;
                  const catName = art.category
                    ? language === 'so'
                      ? art.category.nameSo
                      : art.category.nameEn
                    : '';
                  return (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => handleSelectArticle(art.slug)}
                      className="w-full text-left p-3 rounded-xl hover:bg-amber-50 dark:hover:bg-zinc-800/80 flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-4 h-4 text-[#FFC928] shrink-0" />
                        <div>
                          <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-amber-800 dark:group-hover:text-[#FFC928]">
                            {title}
                          </p>
                          {catName && (
                            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                              {catName}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#FFC928] group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleFullSearch}
                  className="text-xs font-bold text-amber-700 dark:text-[#FFC928] hover:underline"
                >
                  {language === 'so' ? 'Arag dhammaan natiijooyinka →' : 'View all search results →'}
                </button>
              </div>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-8">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                {t.noResultsFound}
              </p>
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {t.recentSearches}
                </span>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-[11px] text-zinc-400 hover:text-red-500"
                >
                  {t.clearHistory}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                {recentSearches.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(s);
                    }}
                    className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-[#FFC928] hover:text-black transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Editorial Quick Topics */}
          {!query && (
            <div className="pt-2 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" />
                {language === 'so' ? 'Mowduucyada Taagan' : 'Trending Topics'}
              </span>
              <div className="flex flex-wrap gap-2">
                {['FinTech', 'Horn of Africa', 'Port Logistics', 'Solar Energy', 'Mogadishu', 'Technology'].map(
                  (topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setQuery(topic)}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-[#FFC928] border border-transparent transition-all"
                    >
                      #{topic}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

