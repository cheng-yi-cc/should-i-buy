import type { AISettings, AIProvider } from '@/lib/types';
import { streamClaude } from './claude';
import { streamOpenAI } from './openai';
import { streamDeepSeek } from './deepseek';

export async function generateDecision(
  settings: AISettings,
  systemPrompt: string,
  userMessage: string,
  onChunk: (text: string) => void,
): Promise<void> {
  const baseUrl = settings.baseUrl || getProviderBaseUrl(settings.provider);
  const model = settings.model || getDefaultModel(settings.provider);

  switch (settings.provider) {
    case 'claude':
      return streamClaude(baseUrl, settings.apiKey, model, systemPrompt, userMessage, onChunk);
    case 'openai':
      return streamOpenAI(baseUrl, settings.apiKey, model, systemPrompt, userMessage, onChunk);
    case 'deepseek':
      return streamDeepSeek(baseUrl, settings.apiKey, model, systemPrompt, userMessage, onChunk);
    case 'custom':
      // Custom providers default to OpenAI-compatible format
      return streamOpenAI(baseUrl, settings.apiKey, model, systemPrompt, userMessage, onChunk);
    default:
      throw new Error(`Unknown provider: ${settings.provider}`);
  }
}

export function getProviderBaseUrl(provider: AIProvider): string {
  switch (provider) {
    case 'claude':
      return 'https://api.anthropic.com';
    case 'openai':
      return 'https://api.openai.com';
    case 'deepseek':
      return 'https://api.deepseek.com';
    case 'custom':
      return '';
  }
}

export function getDefaultModel(provider: AIProvider): string {
  switch (provider) {
    case 'claude':
      return 'claude-sonnet-4-6';
    case 'openai':
      return 'gpt-4.1';
    case 'deepseek':
      return 'deepseek-v4-flash';
    case 'custom':
      return '';
  }
}
