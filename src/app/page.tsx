import React from 'react';
import prisma from '@/lib/prisma';
import Header from '@/components/layout/Header';
import BreakingNewsTicker from '@/components/layout/BreakingNewsTicker';
import HeroSection from '@/components/home/HeroSection';
import LatestFeed from '@/components/home/LatestFeed';
import VideoShowcase from '@/components/home/VideoShowcase';
import PhotoGallerySection from '@/components/home/PhotoGallerySection';
import Footer from '@/components/layout/Footer';

// Revalidate page dynamically or on request
export const revalidate = 0;

export default async function HomePage() {
  const [
    categories,
    settings,
    breakingArticles,
    featuredArticles,
    allArticles,
    videos,
    galleries,
  ] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.websiteSettings.findUnique({
      where: { id: 'default' },
    }),
    prisma.article.findMany({
      where: { isBreaking: true, status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 5,
      select: { id: true, slug: true, titleSo: true, titleEn: true },
    }),
    prisma.article.findMany({
      where: { isFeatured: true, status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 4,
      include: { category: true },
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 12,
      include: { category: true },
    }),
    prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    prisma.photoGallery.findMany({
      orderBy: { createdAt: 'desc' },
      take: 2,
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    }),
  ]);

  // Lead hero story
  const leadStory = featuredArticles[0] || allArticles[0];
  const secondaryStories = featuredArticles.length > 1 
    ? featuredArticles.slice(1) 
    : allArticles.slice(1, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={categories} />

      <BreakingNewsTicker
        articles={breakingArticles}
        customTextSo={settings?.breakingCustomTextSo}
        customTextEn={settings?.breakingCustomTextEn}
        enabled={settings?.breakingNewsEnabled ?? true}
      />

      <main className="flex-1">
        {leadStory && (
          <HeroSection
            leadStory={leadStory}
            secondaryStories={secondaryStories}
          />
        )}

        <LatestFeed
          articles={allArticles}
          categories={categories}
        />

        <VideoShowcase videos={videos} />

        <PhotoGallerySection galleries={galleries} />
      </main>

      <Footer categories={categories} />
    </div>
  );
}

