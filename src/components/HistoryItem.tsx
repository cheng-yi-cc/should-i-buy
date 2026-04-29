'use client';

import type { Decision } from '@/lib/types';

interface HistoryItemProps {
  decision: Decision;
  onClick: () => void;
}

export default function HistoryItem({ decision, onClick }: HistoryItemProps) {
  const isBuy = decision.verdict === '买';
  const date = new Date(decision.createdAt).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 bg-surface border border-border px-5 py-4 rounded-sm hover:border-gold hover:translate-x-1 transition-all duration-200 text-left group"
    >
      {/* Mini stamp */}
      <div
        className={`
          w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0
          ${isBuy ? 'border-green-600 text-green-600' : 'border-accent text-accent'}
        `}
      >
        <span className="text-sm font-bold">{decision.verdict}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-text truncate">{decision.input.name}</p>
        <p className="text-xs text-text-muted font-mono mt-0.5">{date}</p>
      </div>

      {/* Price */}
      <span className="font-mono text-sm text-text-muted flex-shrink-0">
        {decision.input.price}
      </span>
    </button>
  );
}
