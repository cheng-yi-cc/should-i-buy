import type { Decision, AISettings } from '@/lib/types';

const HISTORY_KEY = 'should-i-buy-history';
const AI_SETTINGS_KEY = 'should-i-buy-ai-settings';

const defaultAISettings: AISettings = {
  provider: 'claude',
  apiKey: '',
  model: 'claude-sonnet-4-20250514',
  baseUrl: '',
};

export function getHistory(): Decision[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Decision[];
  } catch {
    return [];
  }
}

export function saveDecision(decision: Decision): void {
  const history = getHistory();
  history.unshift(decision);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function deleteDecision(id: string): void {
  const history = getHistory().filter((d) => d.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getAISettings(): AISettings {
  if (typeof window === 'undefined') return defaultAISettings;
  try {
    const raw = localStorage.getItem(AI_SETTINGS_KEY);
    if (!raw) return defaultAISettings;
    return { ...defaultAISettings, ...JSON.parse(raw) };
  } catch {
    return defaultAISettings;
  }
}

export function saveAISettings(settings: AISettings): void {
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
}
