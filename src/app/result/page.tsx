'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLabel from '@/components/PageLabel';
import VerdictStamp from '@/components/VerdictStamp';
import EssayCard from '@/components/EssayCard';
import LoadingScreen from '@/components/LoadingScreen';
import { useStore } from '@/store/useStore';
import { saveDecision } from '@/lib/storage';

export default function ResultPage() {
  const router = useRouter();
  const { input, answers, verdict, essay, isGenerating, error } = useStore();

  // Save to history when generation completes
  useEffect(() => {
    if (verdict && essay && !isGenerating) {
      const decision = {
        id: Date.now().toString(),
        input,
        answers,
        verdict,
        essay,
        createdAt: new Date().toISOString(),
        provider: 'ai',
      };
      saveDecision(decision);
    }
  }, [verdict, essay, isGenerating, input, answers]);

  // Redirect if no input
  useEffect(() => {
    if (!input.name && !isGenerating) {
      router.replace('/');
    }
  }, [input.name, isGenerating, router]);

  if (!input.name && !isGenerating) {
    return null;
  }

  if (isGenerating && !essay) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
        <PageLabel text="判决" />
        <div className="bg-surface border border-border rounded-sm p-10 max-w-lg text-center">
          <div className="text-accent text-2xl mb-4">出错了</div>
          <p className="text-text-muted mb-6">{error}</p>
          <button
            onClick={() => router.push('/settings')}
            className="px-6 py-3 bg-gold text-background font-bold rounded-sm hover:brightness-110 transition-all"
          >
            去配置 API Key
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center px-6 pt-32 pb-20">
      <PageLabel text="判决" />

      {verdict && (
        <VerdictStamp
          verdict={verdict}
          itemName={input.name}
          price={input.price}
        />
      )}

      <EssayCard essay={essay} isGenerating={isGenerating} />

      <div className="section-divider w-[60px] h-px bg-border mx-auto mt-16 relative before:content-['◆'] before:absolute before:top-[-6px] before:left-1/2 before:-translate-x-1/2 before:text-[8px] before:text-text-muted before:bg-background before:px-2" />
    </section>
  );
}
