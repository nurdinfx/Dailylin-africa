import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import prisma from '@/lib/prisma';

export default async function TermsPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={categories} />
      <main className="flex-1 py-12 bg-white dark:bg-[#101010]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
            Terms of Service & Editorial Code
          </h1>
          <p className="text-sm text-zinc-500">Effective Date: October 2026</p>
          <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 space-y-4 text-sm leading-relaxed">
            <p>
              Welcome to Dailylink Africa. By browsing our website, watching our multimedia, or using our services, you agree to these terms.
            </p>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mt-4">1. Copyright & Intellectual Property</h2>
            <p>
              All journalism, investigative articles, photographs, and video features produced by Dailylink Africa are protected under intellectual property legislation. Republication requires proper attribution and written consent.
            </p>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mt-4">2. Editorial Independence</h2>
            <p>
              Our journalism operates independently of commercial sponsors or political factions. We reserve full discretion over editorial judgment, headline formulation, and breaking news alerts.
            </p>
          </div>
        </div>
      </main>
      <Footer categories={categories} />
    </div>
  );
}

