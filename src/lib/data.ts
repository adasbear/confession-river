import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq, asc, count } from 'drizzle-orm';
import { confession, like, comment } from '@/lib/schema';

const client = createClient({
  url: process.env.DATABASE_URL!,
});

const db = drizzle(client);

export async function getConfessions() {
  const confessions = await db
    .select()
    .from(confession)
    .where(eq(confession.approved, 1))
    .orderBy(asc(confession.createdAt));

  const confessionsWithCounts = await Promise.all(
    confessions.map(async (conf) => {
      const [likesResult, commentsResult] = await Promise.all([
        db
          .select({ count: count() })
          .from(like)
          .where(eq(like.confessionId, conf.id)),
        db
          .select({ count: count() })
          .from(comment)
          .where(eq(comment.confessionId, conf.id)),
      ]);

      return {
        id: conf.id,
        body: conf.body,
        approved: conf.approved,
        userId: conf.userId,
        createdAt: conf.createdAt.toISOString(),
        likesCount: likesResult[0]?.count ?? 0,
        commentsCount: commentsResult[0]?.count ?? 0,
      };
    })
  );

  return { confessions: confessionsWithCounts };
}

