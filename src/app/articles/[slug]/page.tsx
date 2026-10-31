import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArticleReader from '@/components/articles/ArticleReader';

export const revalidate = 0;

interface PageProps {
  params: { slug: string };
}

// Generate dynamic bilingual SEO metadata for Google & social discovery
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!article) {
    return { title: 'Article Not Found' };
  }

  const title = article.titleEn || article.titleSo;
  const description = article.subtitleEn || article.subtitleSo || 'Read the full coverage on Dailylink Africa.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.publishedAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.authorName],
      section: article.category?.nameEn || 'News',
      images: [
        {
          url: article.featuredImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [article.featuredImage],
    },
    alternates: {
      canonical: `/articles/${article.slug}`,
      languages: {
        'so': `/articles/${article.slug}?lang=so`,
        'en': `/articles/${article.slug}?lang=en`,
      },
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!article) {
    notFound();
  }

  const [categories, relatedArticles, latestArticles, prevArticle, nextArticle] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.article.findMany({
      where: {
        categoryId: article.categoryId,
        id: { not: article.id },
        status: 'PUBLISHED',
      },
      take: 3,
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.article.findMany({
      where: {
        id: { not: article.id },
        status: 'PUBLISHED',
      },
      take: 5,
      include: { category: true },
      orderBy: { views: 'desc' },
    }),
    prisma.article.findFirst({
      where: {
        publishedAt: { lt: article.publishedAt },
        status: 'PUBLISHED',
      },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, titleSo: true, titleEn: true },
    }),
    prisma.article.findFirst({
      where: {
        publishedAt: { gt: article.publishedAt },
        status: 'PUBLISHED',
      },
      orderBy: { publishedAt: 'asc' },
      select: { slug: true, titleSo: true, titleEn: true },
    }),
  ]);

  // Schema.org NewsArticle Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.titleEn || article.titleSo,
    image: [article.featuredImage],
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: [
      {
        '@type': 'Person',
        name: article.authorName,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Dailylink Africa',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dailylink.africa/icon.png',
      },
    },
    description: article.subtitleEn || article.subtitleSo || '',
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header categories={categories} />

      <main className="flex-1">
        <ArticleReader
          article={article}
          relatedArticles={relatedArticles}
          latestArticles={latestArticles}
          prevArticle={prevArticle}
          nextArticle={nextArticle}
        />
      </main>

      <Footer categories={categories} />
    </div>
  );
}

