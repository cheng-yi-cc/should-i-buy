'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLabel from '@/components/PageLabel';
import HistoryItem from '@/components/HistoryItem';
import EssayCard from '@/components/EssayCard';
import VerdictStamp from '@/components/VerdictStamp';
import { getHistory, deleteDecision } from '@/lib/storage';
import type { Decision } from '@/lib/types';

export default function HistoryPage() {
  const router = useRouter();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [selected, setSelected] = useState<Decision | null>(null);

  useEffect(() => {
    setDecisions(getHistory());
  }, []);

  if (selected) {
    return (
      <section className="min-h-screen flex flex-col items-center px-6 pt-32 pb-20">
        <PageLabel text="记录" />
        <button
          onClick={() => setSelected(null)}
          className="mb-8 text-sm text-text-muted hover:text-text transition-colors font-mono tracking-wider"
        >
          ← 返回列表
        </button>
        <VerdictStamp
          verdict={selected.verdict}
          itemName={selected.input.name}
          price={selected.input.price}
        />
        <EssayCard essay={selected.essay} isGenerating={false} />
        <p className="mt-6 text-xs text-text-muted font-mono">
          {new Date(selected.createdAt).toLocaleString('zh-CN')}
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center px-6 pt-32 pb-20">
      <PageLabel text="记录" />

      <div className="text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-black mb-2">过往决策</h2>
        <p className="text-sm text-text-muted">看看你之前的判断，对了几次</p>
      </div>

      {decisions.length === 0 ? (
        <div className="bg-surface border border-border rounded-sm p-10 max-w-lg text-center">
          <p className="text-text-muted mb-4">还没有任何决策记录</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-accent text-white font-bold rounded-sm hover:brightness-110 transition-all tracking-wider"
          >
            开始第一次决策
          </button>
        </div>
      ) : (
        <div className="w-full max-w-[580px]">
          {decisions.map((d) => (
            <HistoryItem
              key={d.id}
              decision={d}
              onClick={() => setSelected(d)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
