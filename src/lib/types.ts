export interface DecisionInput {
  name: string;
  price: string;
  description: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  model: string;
}

export interface Answer {
  questionId: string;
  question: string;
  answer: string;
}

export interface Decision {
  id: string;
  input: DecisionInput;
  answers: Answer[];
  verdict: '买' | '不买';
  essay: string;
  createdAt: string;
  provider: string;
}

export type AIProvider = 'claude' | 'openai' | 'deepseek' | 'custom';

export interface AIProviderConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
}

export type AIProviderConfigs = Record<AIProvider, AIProviderConfig>;

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseUrl: string;
  providerConfigs: AIProviderConfigs;
}
