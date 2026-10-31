import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      totalArticles,
      totalDrafts,
      totalCategories,
      totalVideos,
      totalGalleries,
      totalMedia,
      topArticles,
      recentArticles,
      allArticlesViews,
    ] = await Promise.all([
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.article.count({ where: { status: 'DRAFT' } }),
      prisma.category.count(),
      prisma.video.count(),
      prisma.photoGallery.count(),
      prisma.media.count(),
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { views: 'desc' },
        take: 5,
        select: {
          id: true,
          slug: true,
          titleSo: true,
          titleEn: true,
          views: true,
          publishedAt: true,
          category: { select: { nameSo: true, nameEn: true } },
        },
      }),
      prisma.article.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          slug: true,
          titleSo: true,
          titleEn: true,
          status: true,
          isBreaking: true,
          isFeatured: true,
          createdAt: true,
          category: { select: { nameSo: true, nameEn: true } },
        },
      }),
      prisma.article.aggregate({
        _sum: { views: true },
      }),
    ]);

    return NextResponse.json({
      totalArticles,
      totalDrafts,
      totalCategories,
      totalVideos,
      totalGalleries,
      totalMedia,
      totalViews: allArticlesViews._sum.views || 0,
      topArticles,
      recentArticles,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard metrics' }, { status: 500 });
  }
}

