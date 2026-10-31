'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Plus, Search, Edit, Trash2, Eye, Flame, 
  Star, ExternalLink, Filter, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let query = `/api/articles?limit=50`;
      if (searchTerm) query += `&q=${encodeURIComponent(searchTerm)}`;
      if (selectedCategory) query += `&category=${selectedCategory}`;
      if (selectedStatus) query += `&status=${selectedStatus}`;

      const res = await fetch(query);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));

    fetchArticles();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete: "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles(articles.filter((a) => a.id !== id));
        setFeedback('Article deleted successfully');
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch {
      alert('Failed to delete article');
    }
  };

  const toggleFlag = async (id: string, field: 'isBreaking' | 'isFeatured', currentValue: boolean) => {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !currentValue }),
      });
      if (res.ok) {
        setArticles(
          articles.map((a) => (a.id === id ? { ...a, [field]: !currentValue } : a))
        );
      }
    } catch {
      // ignore
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              News Articles ({articles.length})
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Create, edit, feature, and translate news coverage.
            </p>
          </div>

          <Link
            href="/admin/articles/create"
            className="inline-flex items-center gap-2 bg-[#FFC928] hover:bg-[#E5B420] text-black font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-md self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Article</span>
          </Link>
        </div>

        {feedback && (
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/60 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Somali or English keywords..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-zinc-900 dark:bg-zinc-700 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-black transition-colors"
            >
              Filter
            </button>
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.nameEn}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>
        </div>

        {/* Articles Table */}
        <div className="rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-zinc-400 text-sm">
              <div className="w-6 h-6 border-2 border-[#FFC928] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span>Loading articles...</span>
            </div>
          ) : articles.length === 0 ? (
            <div className="p-12 text-center text-zinc-400 text-sm">
              No articles match the criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-[#202020] border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Headline / Translations</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Breaking</th>
                    <th className="py-3.5 px-4 text-center">Featured</th>
                    <th className="py-3.5 px-4">Views</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                  {articles.map((art) => (
                    <tr
                      key={art.id}
                      className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="flex items-start gap-3">
                          <img
                            src={art.featuredImage}
                            alt=""
                            className="w-12 h-10 rounded-lg object-cover bg-zinc-200 dark:bg-zinc-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 text-sm">
                              {art.titleEn || art.titleSo}
                            </span>
                            {art.titleSo && art.titleEn && (
                              <span className="text-[11px] text-zinc-400 line-clamp-1">
                                SO: {art.titleSo}
                              </span>
                            )}
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400">
                              <span>By {art.authorName}</span>
                              <span>•</span>
                              <span>{formatDate(art.publishedAt, 'en')}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
                          {art.category?.nameEn || 'General'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            art.status === 'PUBLISHED'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleFlag(art.id, 'isBreaking', art.isBreaking)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            art.isBreaking
                              ? 'bg-black text-[#FFC928] border-[#FFC928]'
                              : 'text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                          }`}
                          title="Toggle Breaking News"
                        >
                          <Flame className="w-4 h-4" />
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleFlag(art.id, 'isFeatured', art.isFeatured)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            art.isFeatured
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-[#FFC928] border-amber-400'
                              : 'text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                          }`}
                          title="Toggle Lead Featured Story"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-500 font-mono">
                        {art.views.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/articles/${art.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white"
                            title="View Public Story"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/admin/articles/${art.id}/edit`}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white"
                            title="Edit Article"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(art.id, art.titleEn || art.titleSo)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 hover:text-red-700"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

