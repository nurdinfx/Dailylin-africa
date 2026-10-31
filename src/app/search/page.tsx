import React from 'react';
import prisma from '@/lib/prisma';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchClient from './SearchClient';

export const revalidate = 0;

export default async function SearchPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={categories} />
      <main className="flex-1 py-10 bg-white dark:bg-[#101010]">
        <SearchClient categories={categories} />
      </main>
      <Footer categories={categories} />
    </div>
  );
}

