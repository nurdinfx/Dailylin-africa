import React from 'react';
import prisma from '@/lib/prisma';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VideosClient from './VideosClient';

export const revalidate = 0;

export default async function VideosPage() {
  const [categories, videos] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={categories} />
      <main className="flex-1 py-10 bg-white dark:bg-[#101010]">
        <VideosClient videos={videos} />
      </main>
      <Footer categories={categories} />
    </div>
  );
}

