export async function streamOpenAI(
  baseUrl: string,
  apiKey: string,
  model: string,
  system: string,
  user: string,
  onChunk: (text: string) => void,
): Promise<void> {
  const res = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      stream: true,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${errorBody}`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const json = line.slice(6).trim();
      if (json === '[DONE]') return;
      if (!json) continue;

      let parsed: any;
      try {
        parsed = JSON.parse(json);
      } catch {
        continue;
      }

      const text = parsed.choices?.[0]?.delta?.content;
      if (text) onChunk(text);
    }
  }
}
