'use client';

import { useState } from 'react';
import type { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onSelect: (answer: string) => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onSelect,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    onSelect(option);
  };

  return (
    <div className="space-y-6">
      {/* Question number */}
      <div className="font-mono text-[11px] text-gold tracking-[3px]">
        QUESTION {String(questionNumber).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
      </div>

      {/* Question text */}
      <p className="text-xl font-bold leading-relaxed text-text">
        {question.text}
      </p>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`
              w-full text-left px-5 py-4 rounded-sm border transition-all duration-200
              ${selected === option
                ? 'border-gold bg-gold/5 text-text'
                : 'border-border bg-background text-text hover:border-gold'
              }
            `}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
