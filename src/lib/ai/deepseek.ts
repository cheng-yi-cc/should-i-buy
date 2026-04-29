import { streamOpenAI } from './openai';

export async function streamDeepSeek(
  baseUrl: string,
  apiKey: string,
  model: string,
  system: string,
  user: string,
  onChunk: (text: string) => void,
): Promise<void> {
  return streamOpenAI(baseUrl, apiKey, model, system, user, onChunk);
}
