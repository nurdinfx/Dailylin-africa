'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  FileText, FolderKanban, Eye, Video, Camera, 
  TrendingUp, Plus, ArrowRight, Flame, Clock, Sparkles 
} from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

interface DashboardStats {
  totalArticles: number;
  totalDrafts: number;
  totalCategories: number;
  totalVideos: number;
  totalGalleries: number;
  totalMedia: number;
  totalViews: number;
  topArticles: Array<{
    id: string;
    slug: string;
    titleSo: string;
    titleEn: string;
    views: number;
    publishedAt: string;
    category?: { nameSo: string; nameEn: string };
  }>;
  recentArticles: Array<{
    id: string;
    slug: string;
    titleSo: string;
    titleEn: string;
    status: string;
    isBreaking: boolean;
    isFeatured: boolean;
    createdAt: string;
    category?: { nameSo: string; nameEn: string };
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('dailylink_token') : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/stats', { headers, credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) {
          console.warn('Stats fetch returned', res.status);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[#0084FF] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh] text-zinc-500">
          <p>Unable to load dashboard data. Please refresh or re-login.</p>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Published Articles',
      value: stats.totalArticles,
      icon: FileText,
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      change: '+12% this month',
    },
    {
      title: 'Draft Articles',
      value: stats.totalDrafts,
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      change: 'Awaiting editorial review',
    },
    {
      title: 'Total Reader Views',
      value: (stats.totalViews ?? 0).toLocaleString(),
      icon: Eye,
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      change: 'Real-time database counter',
    },
    {
      title: 'News Categories',
      value: stats.totalCategories,
      icon: FolderKanban,
      color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      change: 'Bilingual taxonomy',
    },
    {
      title: 'Multimedia Videos',
      value: stats.totalVideos,
      icon: Video,
      color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      change: 'Video broadcasts',
    },
    {
      title: 'Photo Galleries',
      value: stats.totalGalleries,
      icon: Camera,
      color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      change: 'Editorial visual essays',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Newsroom Dashboard
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Real-time editorial metrics and multi-language publishing control.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/articles/create"
              className="inline-flex items-center gap-2 bg-[#0084FF] hover:bg-[#006ED6] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Compose Story</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start justify-between"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {card.title}
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                    {card.value}
                  </p>
                  <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-2 block">
                    {card.change}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Performance & Views Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0084FF]" />
              <h2 className="font-black text-base uppercase tracking-tight text-zinc-900 dark:text-white">
                Readership & Engagement Trend
              </h2>
            </div>
            <span className="text-xs font-semibold text-zinc-400">Past 7 Days</span>
          </div>

          {/* Interactive Responsive Bar Chart */}
          <div className="h-44 flex items-end gap-3 sm:gap-6 pt-6 border-b border-zinc-200 dark:border-zinc-800">
            {[
              { day: 'Mon', views: 420, height: '45%' },
              { day: 'Tue', views: 680, height: '62%' },
              { day: 'Wed', views: 890, height: '80%' },
              { day: 'Thu', views: 560, height: '54%' },
              { day: 'Fri', views: 1120, height: '95%' },
              { day: 'Sat', views: 790, height: '72%' },
              { day: 'Sun', views: 940, height: '88%' },
            ].map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-[10px] font-bold text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.views}
                </span>
                <div
                  style={{ height: item.height }}
                  className="w-full bg-zinc-200 dark:bg-zinc-800 group-hover:bg-[#0084FF] rounded-t-lg transition-all duration-300 relative"
                />
                <span className="text-xs font-semibold text-zinc-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Two-column layout: Top Performing Articles & Recent Publications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Viewed Articles */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0084FF]" />
                Top Performing Articles
              </h3>
              <Link href="/admin/articles" className="text-xs font-bold text-[#0084FF] dark:text-[#38BDF8] hover:underline">
                View All
              </Link>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {stats.topArticles.map((art, idx) => (
                <div key={art.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-black text-sm text-zinc-400 w-5">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/articles/${art.slug}`}
                        target="_blank"
                        className="text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:text-[#0084FF] dark:hover:text-[#38BDF8] transition-colors truncate block"
                      >
                        {art.titleEn || art.titleSo}
                      </Link>
                      <span className="text-[11px] text-zinc-400">
                        {art.category?.nameEn || 'News'}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-[#002B66]/60 text-[#0084FF] dark:text-[#38BDF8] shrink-0">
                    {(art.views ?? 0).toLocaleString()} views
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Publications */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                Recent Publishing Activity
              </h3>
              <Link href="/admin/articles" className="text-xs font-bold text-[#0084FF] dark:text-[#38BDF8] hover:underline">
                Manage
              </Link>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {stats.recentArticles.map((art) => (
                <div key={art.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {art.isBreaking && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-black text-[#0084FF] rounded">
                          BREAKING
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-zinc-400">
                        {formatTimeAgo(art.createdAt, 'en')}
                      </span>
                    </div>
                    <Link
                      href={`/admin/articles/${art.id}/edit`}
                      className="text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:text-[#0084FF] dark:hover:text-[#38BDF8] transition-colors truncate block"
                    >
                      {art.titleEn || art.titleSo}
                    </Link>
                  </div>

                  <Link
                    href={`/admin/articles/${art.id}/edit`}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-white shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

