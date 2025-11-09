interface ConfessionCardProps {
  confession: {
    id: string;
    body: string;
    approved: number;
    userId: string;
    createdAt: string;
    likesCount: number;
    commentsCount: number;
  };
  number: string;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
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

export function ConfessionCard({ confession, number }: ConfessionCardProps) {
  const relativeTime = formatRelativeTime(confession.createdAt);

  return (
    <div className="flex flex-col rounded-lg border border-[#FFD700]/50 bg-black/30 shadow-lg">
      <div className="p-6">
        <p className="font-fira-code text-xs font-bold text-[#DC2626]">#{number}</p>
        <p className="font-fira-code mt-2 flex-grow text-base leading-relaxed text-white">
          {confession.body}
        </p>
      </div>
      <div className="border-t border-[#FFD700]/50 px-6 py-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-[#FFD700]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">favorite</span>
              <span>{confession.likesCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">chat_bubble</span>
              <span>{confession.commentsCount}</span>
            </div>
          </div>
          <p className="font-medium text-[#FFD700]/70">{relativeTime}</p>
        </div>
      </div>
    </div>
  );
}

