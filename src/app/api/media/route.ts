import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get('folder');
    const q = searchParams.get('q');

    const where: any = {};
    if (folder) where.folder = folder;
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { altTextSo: { contains: q } },
        { altTextEn: { contains: q } },
      ];
    }

    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ media });
  } catch (error) {
    console.error('Media GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle JSON URL registration
    if (contentType.includes('application/json')) {
      const { name, url, fileType = 'image/jpeg', altTextSo, altTextEn, folder = 'general' } = await req.json();
      if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
      }

      const media = await prisma.media.create({
        data: {
          name: name || 'Remote Image',
          url,
          fileType,
          altTextSo: altTextSo || null,
          altTextEn: altTextEn || null,
          folder,
          sizeBytes: 150000,
        },
      });
      return NextResponse.json({ success: true, media });
    }

    // Handle Multipart form-data file upload
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'uploads';
    const altTextSo = formData.get('altTextSo') as string;
    const altTextEn = formData.get('altTextEn') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let publicUrl = '';
    try {
      // Try saving locally to public/uploads
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      const safeName = `${Date.now()}-${file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
      const filePath = path.join(uploadDir, safeName);
      await writeFile(filePath, buffer);

      publicUrl = `/uploads/${safeName}`;
    } catch (fsError) {
      console.warn('Filesystem read-only or unavailable (e.g. serverless). Falling back to data URI:', fsError);
      const mime = file.type || 'image/jpeg';
      const base64 = buffer.toString('base64');
      publicUrl = `data:${mime};base64,${base64}`;
    }

    const media = await prisma.media.create({
      data: {
        name: file.name,
        url: publicUrl,
        fileType: file.type || 'image/jpeg',
        sizeBytes: file.size,
        altTextSo: altTextSo || null,
        altTextEn: altTextEn || null,
        folder,
      },
    });

    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Media delete error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}

