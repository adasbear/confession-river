export const dynamic = 'force-dynamic';

import { getConfessions } from "@/lib/data";
import { ConfessionCard } from "@/components/confession-card";
import { FeedClient } from "./feed-client";

export default async function FeedPage() {
  const { confessions } = await getConfessions();

  return (
    <FeedClient>
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
