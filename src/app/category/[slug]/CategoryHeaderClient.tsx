'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronRight, FolderKanban } from 'lucide-react';

export default function CategoryHeaderClient({ category, count }: { category: any; count: number }) {
  const { language, t } = useLanguage();

  const title = language === 'so' ? category.nameSo : category.nameEn;
  const description = language === 'so' ? category.descriptionSo : category.descriptionEn;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-zinc-500 mb-4">
        <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
          {t.home}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
          {t.categories}
        </span>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <span className="text-[#D97706] dark:text-[#FFC928] font-bold">
          {title}
        </span>
      </nav>

      <div className="flex items-center gap-3">
        <span
          style={{ backgroundColor: category.color || '#FFC928' }}
          className="w-3 h-8 rounded-sm shrink-0"
        />
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
          {title}
        </h1>
        <span className="ml-2 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-500">
          {count} {t.articlesFound}
        </span>
      </div>

      {description && (
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

