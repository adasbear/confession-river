import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq, and, gte, count } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { confession } from './schema';

const client = createClient({
  url: process.env.DATABASE_URL!,
});

const db = drizzle(client);

export async function getOrCreateGhostId(
  request: NextRequest
): Promise<string> {
  const cookie = request.cookies.get('ghost');
  
  if (cookie?.value) {
    return cookie.value;
  }

  const ghostId = nanoid(12);
  const cookieStore = await cookies();
  
  cookieStore.set('ghost', ghostId, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
    secure: process.env.NODE_ENV === 'production',
  });

  return ghostId;
}

export async function rateLimit(userId: string): Promise<boolean> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const result = await db
    .select({ count: count() })
    .from(confession)
    .where(
      and(
        eq(confession.userId, userId),
        gte(confession.createdAt, twentyFourHoursAgo)
      )
    );

  return (result[0]?.count ?? 0) >= 5;
}

