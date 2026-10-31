import React from 'react';
import prisma from '@/lib/prisma';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PhotosClient from './PhotosClient';

export const revalidate = 0;

export default async function PhotosPage() {
  const [categories, galleries] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.photoGallery.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={categories} />
      <main className="flex-1 py-10 bg-white dark:bg-[#101010]">
        <PhotosClient galleries={galleries} />
      </main>
      <Footer categories={categories} />
    </div>
  );
}

