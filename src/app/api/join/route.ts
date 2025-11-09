import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import { getOrCreateGhostId } from '@/lib/ghost';
import { ghostUser } from '@/lib/schema';

const client = createClient({
  url: process.env.DATABASE_URL!,
});

const db = drizzle(client);

export async function POST(request: NextRequest) {
  const userId = await getOrCreateGhostId(request);

  // Check if user exists
  const existingUser = await db
    .select()
    .from(ghostUser)
    .where(eq(ghostUser.id, userId))
    .limit(1);

  // If new user, insert into ghostUser table
  if (existingUser.length === 0) {
    await db.insert(ghostUser).values({
      id: userId,
      createdAt: new Date(),
    });
  }

  return NextResponse.redirect(new URL('/feed#bottom', request.url), 303);
}

