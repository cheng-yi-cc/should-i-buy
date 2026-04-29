'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLabel from '@/components/PageLabel';
import QuestionCard from '@/components/QuestionCard';
import ProgressDots from '@/components/ProgressDots';
import { useStore } from '@/store/useStore';
import { getAISettings } from '@/lib/storage';
import { getSystemPrompt, buildUserMessage } from '@/lib/ai/prompt';
import { generateDecision } from '@/lib/ai/providers';

export default function DecidePage() {
  const router = useRouter();
  const { questions, currentQuestionIndex, addAnswer, input, answers, setIsGenerating, setVerdict, appendEssay, setError } = useStore();

  // If no questions set, redirect home
  useEffect(() => {
    if (questions.length === 0) {
      router.replace('/');
    }
  }, [questions.length, router]);

  if (questions.length === 0) {
    return null;
  }

  const isLast = currentQuestionIndex >= questions.length - 1;
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelect = useCallback(async (answer: string) => {
    addAnswer({
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      answer,
    });

    if (isLast) {
      // All questions answered — start AI generation
      setIsGenerating(true);
      router.push('/result');

      try {
        const settings = getAISettings();
        if (!settings.apiKey) {
          setError('请先在设置页面配置 API Key');
          setIsGenerating(false);
          return;
        }

        const systemPrompt = getSystemPrompt();
        const allAnswers = [...answers, { questionId: currentQuestion.id, question: currentQuestion.text, answer }];
        const userMessage = buildUserMessage(input, allAnswers);

        await generateDecision(settings, systemPrompt, userMessage, (chunk) => {
          appendEssay(chunk);
        });

        // Extract verdict from the first line of the essay
        const fullEssay = useStore.getState().essay;
        const firstLine = fullEssay.trim().split('\n')[0];
        if (firstLine.includes('买') && !firstLine.includes('不买')) {
          setVerdict('买');
        } else {
          setVerdict('不买');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '生成失败，请检查 API Key 和网络');
      } finally {
        setIsGenerating(false);
      }
    }
  }, [currentQuestion, isLast, addAnswer, answers, input, router, setIsGenerating, setVerdict, appendEssay, setError]);

  return (
    <section className="min-h-screen flex flex-col items-center px-6 pt-32 pb-20">
      <PageLabel text="追问" />

      <div className="text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-black mb-2">回答几个问题</h2>
        <p className="text-sm text-text-muted">蔡叔说，纠结的本质是你没想清楚自己要什么</p>
      </div>

      <ProgressDots total={questions.length} current={currentQuestionIndex} />

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onSelect={handleSelect}
      />
    </section>
  );
}
