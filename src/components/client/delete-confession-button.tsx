'use client';

import { useState, useTransition } from 'react';

interface DeleteConfessionButtonProps {
  confessionId: string;
  deleteConfession: (id: string) => Promise<void>;
}

export function DeleteConfessionButton({ confessionId, deleteConfession }: DeleteConfessionButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setConfirmText('');
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confirmText.trim() !== 'DELETE') {
      return;
    }

    // Find the row by confessionId - look for the row containing this button
    const row = document.querySelector(`tr[data-confession-id="${confessionId}"]`) as HTMLTableRowElement | null;
    
    // Optimistic delete: hide the row immediately
    if (row) {
      row.style.display = 'none';
    }

    setShowConfirm(false);
    setConfirmText('');

    startTransition(async () => {
      try {
        await deleteConfession(confessionId);
        // Revalidation will handle the actual removal - React will re-render without this row
        // No need to manually remove the DOM node
      } catch (error) {
        // Revert optimistic update on error
        if (row) {
          row.style.display = '';
        }
        console.error('Error deleting confession:', error);
      }
    });
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="rounded-lg border border-[#FFD700] bg-[#121212] p-6 max-w-md w-full mx-4">
          <h2 className="text-lg font-bold text-[#FFD700] mb-4">Confirm Deletion</h2>
          <p className="text-sm text-white mb-4">
            Are you sure you want to delete this confession? Type <span className="text-[#DC2626] font-bold">DELETE</span> to confirm.
          </p>
          <form onSubmit={handleConfirm}>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-3 py-2 mb-4 bg-black border border-[#FFD700]/50 rounded text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700]"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded border border-[#FFD700] bg-transparent px-4 py-2 text-sm text-[#FFD700] hover:bg-[#FFD700]/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={confirmText.trim() !== 'DELETE'}
                className="rounded border border-[#DC2626] bg-transparent px-4 py-2 text-sm text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDeleteClick}
      className="rounded border border-[#DC2626] bg-transparent px-3 py-1 text-sm text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors"
    >
      Delete
    </button>
  );
}

