'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormCard from '@/components/FormCard';
import PageLabel from '@/components/PageLabel';
import { useStore } from '@/store/useStore';
import { selectQuestions } from '@/lib/questions';
import type { DecisionInput } from '@/lib/types';

export default function Home() {
  const router = useRouter();
  const { setInput, setQuestions } = useStore();

  function handleSubmit(input: DecisionInput) {
    setInput(input);
    const questions = selectQuestions(input);
    setQuestions(questions);
    router.push('/decide');
  }

  return (
    <>
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-20">
        <div className="font-mono text-[11px] tracking-[6px] uppercase text-text-muted mb-6 opacity-0 animate-[fadeUp_0.8s_0.2s_forwards]">
          蔡叔认知框架 · 消费决策引擎
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-center leading-tight mb-3 opacity-0 animate-[fadeUp_0.8s_0.4s_forwards]">
          这个东西<br />
          <em className="not-italic text-accent relative after:content-[''] after:absolute after:bottom-1 after:left-0 after:right-0 after:h-[3px] after:bg-accent/40">
            该不该买
          </em>
          ？
        </h1>

        <p className="text-base text-text-muted text-center max-w-[420px] leading-relaxed mb-12 opacity-0 animate-[fadeUp_0.8s_0.6s_forwards]">
          你纠结，说明你买得起但怕不值。<br />说白了，问题不在价格，在于你没想清楚。
        </p>

        <div className="opacity-0 animate-[fadeUp_0.8s_0.8s_forwards] w-full flex justify-center">
          <FormCard onSubmit={handleSubmit} />
        </div>
      </section>

      {/* Section divider */}
      <div className="w-[60px] h-px bg-border mx-auto relative z-[1] before:content-['◆'] before:absolute before:top-[-6px] before:left-1/2 before:-translate-x-1/2 before:text-[8px] before:text-text-muted before:bg-background before:px-2" />
    </>
  );
}
