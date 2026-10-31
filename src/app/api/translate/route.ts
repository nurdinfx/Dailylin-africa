import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { translateContent } from '@/lib/ai-translator';

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { text, from, to } = await req.json();

    if (!text || !from || !to) {
      return NextResponse.json(
        { error: 'Text, source language (from), and target language (to) are required' },
        { status: 400 }
      );
    }

    if (from !== 'so' && from !== 'en') {
      return NextResponse.json({ error: 'Supported languages are "so" and "en"' }, { status: 400 });
    }

    const result = await translateContent(text, from, to);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Translation route error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}

