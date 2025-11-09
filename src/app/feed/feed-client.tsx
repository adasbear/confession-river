"use client";

import { useState, useEffect, ReactNode } from "react";
import PostSheet from "@/components/post-sheet";

interface FeedClientProps {
  children: ReactNode;
  onSent?: () => void;
}

export function FeedClient({ children, onSent }: FeedClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const bottomElement = document.getElementById('bottom');
    if (bottomElement) {
      bottomElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0A0A1A]">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-center border-b border-[#FFD700]/50 bg-[#0A0A1A]/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="flex w-full max-w-4xl items-center justify-start">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#FFD700]" style={{ fontFamily: 'Fira Code, monospace' }}>
              Confession River
            </h1>
          </div>
        </div>
      </header>
      <main className="flex justify-center px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-[#FFD700] bg-[#DC2626] text-white shadow-lg transition-transform hover:scale-105"
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
      <PostSheet isOpen={isOpen} onClose={() => setIsOpen(false)} onSent={onSent} />
    </div>
  );
}

