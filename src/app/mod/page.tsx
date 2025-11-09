export const dynamic = 'force-dynamic';

import { revalidatePath } from 'next/cache';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { desc, eq } from 'drizzle-orm';
import { confession } from '@/lib/schema';
import { DeleteConfessionButton } from '@/components/client/delete-confession-button';

const client = createClient({
  url: process.env.DATABASE_URL!,
});

const db = drizzle(client);

async function deleteConfession(id: string) {
  'use server';
  await db.delete(confession).where(eq(confession.id, id));
  revalidatePath('/mod');
  revalidatePath('/feed');
}

async function getAllConfessions() {
  const confessions = await db
    .select()
    .from(confession)
    .orderBy(desc(confession.createdAt));

  return confessions;
}

function truncateBody(body: string, maxLength: number = 200): string {
  if (body.length <= maxLength) {
    return body;
  }
  return body.substring(0, maxLength) + '...';
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface ModPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function ModPage({ searchParams }: ModPageProps) {

  const confessions = await getAllConfessions();

  return (
    <div className="min-h-screen bg-black p-8" style={{ fontFamily: 'Fira Code, monospace' }}>
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold text-[#FFD700]">Moderation Panel</h1>
        <div className="overflow-x-auto rounded-lg border border-[#FFD700]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#FFD700] bg-[#121212]">
                <th className="border-r border-[#FFD700] px-4 py-3 text-left text-sm font-bold text-[#FFD700]">
                  #
                </th>
                <th className="border-r border-[#FFD700] px-4 py-3 text-left text-sm font-bold text-[#FFD700]">
                  Body
                </th>
                <th className="border-r border-[#FFD700] px-4 py-3 text-left text-sm font-bold text-[#FFD700]">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-[#FFD700]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {confessions.map((confession, index) => (
                <tr key={confession.id} data-confession-id={confession.id} className="border-b border-[#FFD700]/50 bg-[#121212]">
                  <td className="border-r border-[#FFD700]/50 px-4 py-3 text-sm text-white">
                    {String(index + 1).padStart(4, '0')}
                  </td>
                  <td className="border-r border-[#FFD700]/50 px-4 py-3 text-sm text-white">
                    {truncateBody(confession.body, 200)}
                  </td>
                  <td className="border-r border-[#FFD700]/50 px-4 py-3 text-sm text-white">
                    {formatDate(confession.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <DeleteConfessionButton confessionId={confession.id} deleteConfession={deleteConfession} />
                  </td>
                </tr>
              ))}
              {confessions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-white/50">
                    No confessions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

