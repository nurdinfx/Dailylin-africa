import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { slugify, estimateReadingTime } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const status = searchParams.get('status') || undefined;
    const featured = searchParams.get('featured') === 'true';
    const breaking = searchParams.get('breaking') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = { slug: category };
    }

    if (featured) {
      where.isFeatured = true;
    }

    if (breaking) {
      where.isBreaking = true;
    }

    if (q && q.trim()) {
      const term = q.trim();
      where.OR = [
        { titleSo: { contains: term } },
        { titleEn: { contains: term } },
        { subtitleSo: { contains: term } },
        { subtitleEn: { contains: term } },
        { contentSo: { contains: term } },
        { contentEn: { contains: term } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip,
        include: {
          category: {
            select: { id: true, nameSo: true, nameEn: true, slug: true, color: true },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Articles GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      titleSo,
      titleEn,
      subtitleSo,
      subtitleEn,
      contentSo,
      contentEn,
      categoryId,
      featuredImage,
      imageCaption,
      status = 'PUBLISHED',
      isFeatured = false,
      isBreaking = false,
      isEditorPick = false,
      authorName = session.name || 'Dailylink Africa Editorial',
      authorAvatar,
      customSlug,
      videoUrl,
      tags,
    } = body;

    if (!titleSo && !titleEn) {
      return NextResponse.json(
        { error: 'At least one title (Somali or English) is required' },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const baseTitle = titleEn || titleSo || 'article';
    const computedSlug = customSlug ? slugify(customSlug) : slugify(baseTitle);

    // Ensure slug uniqueness
    let uniqueSlug = computedSlug;
    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${computedSlug}-${counter}`;
      counter++;
    }

    const readTimeMin = estimateReadingTime(contentSo || contentEn || '');

    const article = await prisma.article.create({
      data: {
        slug: uniqueSlug,
        titleSo: titleSo || '',
        titleEn: titleEn || '',
        subtitleSo: subtitleSo || '',
        subtitleEn: subtitleEn || '',
        contentSo: contentSo || '',
        contentEn: contentEn || '',
        categoryId,
        featuredImage: (featuredImage && featuredImage.trim()) || '/logo.png',
        imageCaption: imageCaption || null,
        status,
        isFeatured: Boolean(isFeatured),
        isBreaking: Boolean(isBreaking),
        isEditorPick: Boolean(isEditorPick),
        authorName,
        authorAvatar: authorAvatar || null,
        readTimeMin,
        videoUrl: videoUrl || null,
        tags: tags || null,
        publishedAt: status === 'PUBLISHED' ? new Date() : new Date(),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, article }, { status: 201 });
  } catch (error) {
    console.error('Create article error:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

