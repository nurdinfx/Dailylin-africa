import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArticleCard from '@/components/articles/ArticleCard';
import CategoryHeaderClient from './CategoryHeaderClient';

export const revalidate = 0;

interface PageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    notFound();
  }

  const [categories, articles] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.article.findMany({
      where: {
        categoryId: category.id,
        status: 'PUBLISHED',
      },
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={categories} />

      <main className="flex-1 py-10 bg-white dark:bg-[#101010]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <CategoryHeaderClient category={category} count={articles.length} />

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {articles.map((art) => (
                <ArticleCard key={art.id} article={art} variant="standard" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 mt-8">
              <p className="text-zinc-500 text-sm">
                No articles published in this category yet.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer categories={categories} />
    </div>
  );
}

