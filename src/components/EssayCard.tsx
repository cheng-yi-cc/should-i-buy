'use client';

interface EssayCardProps {
  essay: string;
  isGenerating: boolean;
}

export default function EssayCard({ essay, isGenerating }: EssayCardProps) {
  const paragraphs = essay.split('\n\n').filter(Boolean);

  return (
    <div className="relative bg-surface border border-border rounded-sm p-12">
      {/* Decorative label */}
      <span className="absolute top-4 right-5 text-accent text-sm font-bold tracking-[4px] select-none">
        判
      </span>

      {/* Essay body */}
      <div className="text-base leading-8 text-text">
        {paragraphs.map((p, i) => (
          <p key={i} className="mb-4">
            {p}
          </p>
        ))}
        {isGenerating && (
          <span
            className="inline-block w-0.5 h-5 bg-text ml-0.5 align-middle"
            style={{ animation: 'blink 1s step-end infinite' }}
          />
        )}
      </div>

      {/* Divider & signature */}
      {!isGenerating && essay.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <p className="font-mono text-xs text-text-muted">
            &mdash;&mdash; 基于蔡叔认知框架 · AI 分析
          </p>
        </div>
      )}
    </div>
  );
}
