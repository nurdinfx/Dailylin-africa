import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { estimateReadingTime, slugify } from '@/lib/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Search by ID or by slug
    const article = await prisma.article.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Get article error:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

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
      status,
      isFeatured,
      isBreaking,
      isEditorPick,
      authorName,
      authorAvatar,
      customSlug,
      videoUrl,
      tags,
    } = body;

    const readTimeMin = estimateReadingTime(contentSo || contentEn || existing.contentSo);

    let updatedSlug = existing.slug;
    if (customSlug && customSlug !== existing.slug) {
      updatedSlug = slugify(customSlug);
      const duplicate = await prisma.article.findFirst({
        where: { slug: updatedSlug, id: { not: id } },
      });
      if (duplicate) {
        updatedSlug = `${updatedSlug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const updated = await prisma.article.update({
      where: { id },
      data: {
        slug: updatedSlug,
        titleSo: titleSo !== undefined ? titleSo : existing.titleSo,
        titleEn: titleEn !== undefined ? titleEn : existing.titleEn,
        subtitleSo: subtitleSo !== undefined ? subtitleSo : existing.subtitleSo,
        subtitleEn: subtitleEn !== undefined ? subtitleEn : existing.subtitleEn,
        contentSo: contentSo !== undefined ? contentSo : existing.contentSo,
        contentEn: contentEn !== undefined ? contentEn : existing.contentEn,
        categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
        featuredImage: featuredImage !== undefined ? featuredImage : existing.featuredImage,
        imageCaption: imageCaption !== undefined ? imageCaption : existing.imageCaption,
        status: status !== undefined ? status : existing.status,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        isBreaking: isBreaking !== undefined ? Boolean(isBreaking) : existing.isBreaking,
        isEditorPick: isEditorPick !== undefined ? Boolean(isEditorPick) : existing.isEditorPick,
        authorName: authorName !== undefined ? authorName : existing.authorName,
        authorAvatar: authorAvatar !== undefined ? authorAvatar : existing.authorAvatar,
        readTimeMin,
        videoUrl: videoUrl !== undefined ? videoUrl : existing.videoUrl,
        tags: tags !== undefined ? tags : existing.tags,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, article: updated });
  } catch (error) {
    console.error('Update article error:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}

