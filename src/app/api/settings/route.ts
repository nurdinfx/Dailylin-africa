import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    let settings = await prisma.websiteSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.websiteSettings.create({
        data: { id: 'default' },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const settings = await prisma.websiteSettings.upsert({
      where: { id: 'default' },
      update: body,
      create: { id: 'default', ...body },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

