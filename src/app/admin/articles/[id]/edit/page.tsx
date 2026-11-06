'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleForm from '@/components/admin/ArticleForm';
import { ArrowLeft } from 'lucide-react';

export default function EditArticlePage() {
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/articles/${id}`).then((res) => res.json()),
      fetch('/api/categories').then((res) => res.json()),
    ])
      .then(([artData, catData]) => {
        setArticle(artData.article);
        setCategories(catData.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading || !article) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[#0084FF] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 rounded-xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 hover:border-[#0084FF] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              Edit Article: {article.titleEn || article.titleSo}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Update content, translations, media and publish status.
            </p>
          </div>
        </div>

        <ArticleForm
          initialData={{
            id: article.id,
            slug: article.slug,
            categoryId: article.categoryId,
            featuredImage: article.featuredImage,
            imageCaption: article.imageCaption || '',
            status: article.status,
            isFeatured: article.isFeatured,
            isBreaking: article.isBreaking,
            isEditorPick: article.isEditorPick,
            authorName: article.authorName,
            authorAvatar: article.authorAvatar || '',
            titleSo: article.titleSo || '',
            subtitleSo: article.subtitleSo || '',
            contentSo: article.contentSo || '',
            titleEn: article.titleEn || '',
            subtitleEn: article.subtitleEn || '',
            contentEn: article.contentEn || '',
            tags: article.tags || '',
          }}
          categories={categories}
          isEditing={true}
        />
      </div>
    </AdminLayout>
  );
}

