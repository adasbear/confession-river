'use client';

import { useEffect } from 'react';

interface Confession {
  id: string;
  body: string;
  approved: number;
  userId: string;
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
}

interface FeedContentProps {
  confessions: Confession[];
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return `${Math.floor(diffDays / 7)}w ago`;
  }
}

export function FeedContent({ confessions }: FeedContentProps) {
  useEffect(() => {
    const bottomElement = document.getElementById('bottom');
    if (bottomElement) {
      bottomElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0A0A1A]">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-center border-b border-[#D4AF37]/50 bg-[#0A0A1A]/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="flex w-full max-w-4xl items-center justify-start">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#D4AF37]">Confession River</h1>
          </div>
        </div>
      </header>
      <main className="flex justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl space-y-6">
          {confessions.map((confession, index) => {
            const number = String(index + 1).padStart(4, '0');
            const relativeTime = formatRelativeTime(confession.createdAt);

            return (
              <div
                key={confession.id}
                className="flex flex-col rounded-lg border border-[#D4AF37]/50 bg-black/30 shadow-lg"
              >
                <div className="p-6">
                  <p className="font-fira-code text-xs font-bold text-[#B00020]">#{number}</p>
                  <p className="font-fira-code mt-2 flex-grow text-base leading-relaxed text-[#F0F0F0]">
                    {confession.body}
                  </p>
                </div>
                <div className="border-t border-[#D4AF37]/50 px-6 py-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4 text-[#D4AF37]">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">favorite</span>
                        <span>{confession.likesCount}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">chat_bubble</span>
                        <span>{confession.commentsCount}</span>
                      </div>
                    </div>
                    <p className="font-medium text-[#D4AF37]/70">{relativeTime}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div id="bottom" />
        </div>
      </main>
    </div>
  );
}

