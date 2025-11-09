export const dynamic = 'force-dynamic';

import { revalidatePath } from 'next/cache';
import { getConfessions } from "@/lib/data";
import { ConfessionCard } from "@/components/confession-card";
import { FeedClient } from "./feed-client";

async function revalidateFeed() {
  'use server';
  revalidatePath('/feed');
}

export default async function FeedPage() {
  const { confessions } = await getConfessions();

  return (
    <FeedClient onSent={revalidateFeed}>
      <div className="w-full max-w-4xl space-y-6">
        {confessions.map((confession, index) => {
          const number = String(index + 1).padStart(4, '0');
          return (
            <ConfessionCard
              key={confession.id}
              confession={confession}
              number={number}
            />
          );
        })}
        <div id="bottom" />
      </div>
    </FeedClient>
  );
}
