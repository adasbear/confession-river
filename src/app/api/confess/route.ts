import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getOrCreateGhostId, rateLimit } from '@/lib/ghost';
import { confession, ghostUser } from '@/lib/schema';

const client = createClient({
  url: process.env.DATABASE_URL!,
});

const db = drizzle(client);

export async function POST(request: NextRequest) {
  try {
    const userId = await getOrCreateGhostId(request);

    // Check if user exists, create if not
    const existingUser = await db
      .select()
      .from(ghostUser)
      .where(eq(ghostUser.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      await db.insert(ghostUser).values({
        id: userId,
        createdAt: new Date(),
      });
    }

    // Check rate limit
    const isRateLimited = await rateLimit(userId);
    if (isRateLimited) {
      return NextResponse.json(
        { ok: false, message: 'Rate limit exceeded. Maximum 5 confessions per 24 hours.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { body: confessionBody } = body;

    if (!confessionBody || typeof confessionBody !== 'string' || confessionBody.trim().length === 0) {
      return NextResponse.json(
        { ok: false, message: 'Confession body is required' },
        { status: 400 }
      );
    }

    // Insert confession
    const confessionId = nanoid(12);
    await db.insert(confession).values({
      id: confessionId,
      body: confessionBody.trim(),
      approved: 1,
      userId,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true, approved: true });
  } catch (error) {
    console.error('Error creating confession:', error);
    return NextResponse.json(
      { ok: false, message: 'Failed to create confession' },
      { status: 500 }
    );
  }
}

