import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const galleries = await prisma.photoGallery.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });
    return NextResponse.json({ galleries });
  } catch (error) {
    console.error('Galleries GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch galleries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { titleSo, titleEn, descriptionSo, descriptionEn, coverImage, category, photographer, images = [] } = body;

    if (!titleSo || !titleEn || !coverImage) {
      return NextResponse.json(
        { error: 'Titles and cover image are required' },
        { status: 400 }
      );
    }

    const gallery = await prisma.photoGallery.create({
      data: {
        titleSo,
        titleEn,
        descriptionSo: descriptionSo || null,
        descriptionEn: descriptionEn || null,
        coverImage,
        category: category || 'General',
        photographer: photographer || 'Dailylink Africa Staff',
        images: {
          create: images.map((img: any, idx: number) => ({
            imageUrl: img.imageUrl,
            captionSo: img.captionSo || null,
            captionEn: img.captionEn || null,
            order: idx + 1,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ success: true, gallery }, { status: 201 });
  } catch (error) {
    console.error('Create gallery error:', error);
    return NextResponse.json({ error: 'Failed to create gallery' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await prisma.photoGallery.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gallery' }, { status: 500 });
  }
}

