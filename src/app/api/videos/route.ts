import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Videos GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
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
      descriptionSo,
      descriptionEn,
      videoUrl,
      thumbnailUrl,
      durationSec = 180,
      category = 'General',
      isFeatured = false,
    } = body;

    if (!titleSo || !titleEn || !videoUrl) {
      return NextResponse.json(
        { error: 'Titles and video URL are required' },
        { status: 400 }
      );
    }

    // Format youtube embed URL if full watch link is pasted
    let finalVideoUrl = videoUrl;
    let finalThumbnailUrl = thumbnailUrl;

    if (videoUrl.includes('youtube.com/watch?v=')) {
      const vidId = videoUrl.split('v=')[1]?.split('&')[0];
      finalVideoUrl = `https://www.youtube.com/embed/${vidId}`;
      if (!finalThumbnailUrl && vidId) {
        finalThumbnailUrl = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
      }
    } else if (videoUrl.includes('youtu.be/')) {
      const vidId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      finalVideoUrl = `https://www.youtube.com/embed/${vidId}`;
      if (!finalThumbnailUrl && vidId) {
        finalThumbnailUrl = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
      }
    }

    if (!finalThumbnailUrl) {
      finalThumbnailUrl = '/logo.png';
    }

    const video = await prisma.video.create({
      data: {
        titleSo,
        titleEn,
        descriptionSo,
        descriptionEn,
        videoUrl: finalVideoUrl,
        thumbnailUrl: finalThumbnailUrl,
        durationSec: Number(durationSec),
        category,
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json({ success: true, video }, { status: 201 });
  } catch (error) {
    console.error('Create video error:', error);
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await prisma.video.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}

