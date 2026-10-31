import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

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
    const { nameSo, nameEn, slug, descriptionSo, descriptionEn, color, order, isActive } = body;

    const data: any = {};
    if (nameSo !== undefined) data.nameSo = nameSo;
    if (nameEn !== undefined) data.nameEn = nameEn;
    if (slug !== undefined) data.slug = slugify(slug);
    if (descriptionSo !== undefined) data.descriptionSo = descriptionSo;
    if (descriptionEn !== undefined) data.descriptionEn = descriptionEn;
    if (color !== undefined) data.color = color;
    if (order !== undefined) data.order = Number(order);
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
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
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

