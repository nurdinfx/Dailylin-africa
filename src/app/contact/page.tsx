import React from 'react';
import prisma from '@/lib/prisma';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactClient from './ContactClient';

export default async function ContactPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={categories} />
      <main className="flex-1 py-12 bg-white dark:bg-[#101010]">
        <ContactClient />
      </main>
      <Footer categories={categories} />
    </div>
  );
}

