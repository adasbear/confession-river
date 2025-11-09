"use client";

import { useState } from "react";
import PostSheet from "@/components/post-sheet";
import { FeedContent } from "./feed-content";

interface Confession {
  id: string;
  body: string;
  approved: number;
  userId: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
}

interface FeedClientProps {
  confessions: Confession[];
}

export function FeedClient({ confessions }: FeedClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Convert ISO strings back to Date objects for FeedContent
  const confessionsWithDates = confessions.map((conf) => ({
    ...conf,
    createdAt: new Date(conf.createdAt),
  }));

  return (
    <>
      <FeedContent confessions={confessionsWithDates} />
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-[#D4AF37] bg-[#B00020] text-white shadow-lg transition-transform hover:scale-105"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <PostSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

