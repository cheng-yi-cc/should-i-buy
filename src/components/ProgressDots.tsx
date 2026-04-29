'use client';

interface ProgressDotsProps {
  total: number;
  current: number;
}

export default function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`
            rounded-full transition-all duration-300
            ${i === current
              ? 'w-6 h-2 bg-gold'
              : i < current
                ? 'w-2 h-2 bg-text-muted'
                : 'w-2 h-2 bg-border'
            }
          `}
        />
      ))}
    </div>
  );
}
