export async function streamClaude(
  baseUrl: string,
  apiKey: string,
  model: string,
  system: string,
  user: string,
  onChunk: (text: string) => void,
): Promise<void> {
  const res = await fetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system,
      messages: [{ role: 'user', content: user }],
      stream: true,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Claude API error ${res.status}: ${errorBody}`);
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
      if (!json) continue;

      let parsed: any;
      try {
        parsed = JSON.parse(json);
      } catch {
        continue;
      }

      if (parsed.type === 'content_block_delta') {
        const text = parsed.delta?.text;
        if (text) onChunk(text);
      }

      if (parsed.type === 'message_stop') {
        return;
      }
    }
  }
}
