import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Categories GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { nameSo, nameEn, slug, descriptionSo, descriptionEn, color, order } = await req.json();

    if (!nameSo || !nameEn) {
      return NextResponse.json({ error: 'Somali and English names are required' }, { status: 400 });
    }

    const computedSlug = slug ? slugify(slug) : slugify(nameEn);

    const category = await prisma.category.create({
      data: {
        nameSo,
        nameEn,
        slug: computedSlug,
        descriptionSo: descriptionSo || null,
        descriptionEn: descriptionEn || null,
        color: color || '#0084FF',
        order: Number(order) || 0,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

