import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import { confession } from '@/lib/schema';

const client = createClient({
  url: process.env.DATABASE_URL!,
});

const db = drizzle(client);

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  return password === process.env.MOD_PASS;
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const formData = await request.formData();
    const id = formData.get('id');

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { ok: false, message: 'Confession ID is required' },
        { status: 400 }
      );
    }

    await db
      .update(confession)
      .set({ approved: 1 })
      .where(eq(confession.id, id));

    return NextResponse.redirect(new URL('/mod', request.url), 303);
  } catch (error) {
    console.error('Error approving confession:', error);
    return NextResponse.json(
      { ok: false, message: 'Failed to approve confession' },
      { status: 500 }
    );
  }
}

