import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import prisma from '@/lib/prisma';

export default async function PrivacyPage() {
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
            Privacy Policy & Data Protection
          </h1>
          <p className="text-sm text-zinc-500">Last updated: October 2026</p>
          <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 space-y-4 text-sm leading-relaxed">
            <p>
              Dailylink Africa (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting the privacy and rights of our readers and media partners across Somalia, Kenya, Ethiopia, and globally.
            </p>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mt-4">1. Information We Collect</h2>
            <p>
              We prioritize privacy-by-design. Public visitors can access news without creating an account. We collect anonymized article readership metrics and telemetry solely to improve our coverage and system performance.
            </p>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mt-4">2. Cookies and Local Storage</h2>
            <p>
              We use local storage exclusively to save your language preference (Somali or English), theme preference (Dark or Light), and local bookmarks.
            </p>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mt-4">3. Newsroom Protection</h2>
            <p>
              Information submitted to our newsroom is handled under recognized journalistic confidentiality protocols.
            </p>
          </div>
        </div>
      </main>
      <Footer categories={categories} />
    </div>
  );
}

