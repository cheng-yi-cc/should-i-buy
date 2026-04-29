import { create } from 'zustand';
import type { DecisionInput, Answer, Question } from '@/lib/types';

interface StoreState {
  // State
  input: DecisionInput;
  answers: Answer[];
  currentQuestionIndex: number;
  questions: Question[];
  verdict: '买' | '不买' | null;
  essay: string;
  isGenerating: boolean;
  error: string | null;

  // Actions
  setInput: (input: DecisionInput) => void;
  setQuestions: (questions: Question[]) => void;
  addAnswer: (answer: Answer) => void;
  setVerdict: (verdict: '买' | '不买') => void;
  appendEssay: (text: string) => void;
  setEssay: (essay: string) => void;
  setIsGenerating: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

const initialState = {
  input: { name: '', price: '', description: '' },
  answers: [],
  currentQuestionIndex: 0,
  questions: [],
  verdict: null,
  essay: '',
  isGenerating: false,
  error: null,
};

export const useStore = create<StoreState>((set) => ({
  ...initialState,

  setInput: (input) => set({ input }),

  setQuestions: (questions) => set({ questions }),

  addAnswer: (answer) =>
    set((state) => ({
      answers: [...state.answers, answer],
      currentQuestionIndex: state.currentQuestionIndex + 1,
    })),

  setVerdict: (verdict) => set({ verdict }),

  appendEssay: (text) =>
    set((state) => ({ essay: state.essay + text })),

  setEssay: (essay) => set({ essay }),

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
