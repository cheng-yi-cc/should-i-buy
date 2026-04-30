import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { getAISettings, saveAISettings } from '../src/lib/storage.ts';

const AI_SETTINGS_KEY = 'should-i-buy-ai-settings';

class MemoryStorage {
  #items = new Map();

  getItem(key) {
    return this.#items.get(key) ?? null;
  }

  setItem(key, value) {
    this.#items.set(key, value);
  }

  clear() {
    this.#items.clear();
  }
}

const storage = new MemoryStorage();

beforeEach(() => {
  globalThis.window = globalThis;
  globalThis.localStorage = storage;
  storage.clear();
});

test('migrates a legacy DeepSeek key without copying it to other providers', () => {
  localStorage.setItem(
    AI_SETTINGS_KEY,
    JSON.stringify({
      provider: 'deepseek',
      apiKey: 'ds-key',
      model: 'deepseek-chat',
      baseUrl: '',
    }),
  );

  const settings = getAISettings();

  assert.ok(settings.providerConfigs);
  assert.equal(settings.provider, 'deepseek');
  assert.equal(settings.apiKey, 'ds-key');
  assert.equal(settings.providerConfigs.deepseek.apiKey, 'ds-key');
  assert.equal(settings.providerConfigs.openai.apiKey, '');
  assert.equal(settings.providerConfigs.claude.apiKey, '');
  assert.equal(settings.providerConfigs.custom.apiKey, '');
});

test('switching the active provider uses that provider config only', () => {
  saveAISettings({
    provider: 'openai',
    apiKey: 'openai-key',
    model: 'gpt-5.5',
    baseUrl: '',
    providerConfigs: {
      claude: { apiKey: '', model: 'claude-sonnet-4-6', baseUrl: '' },
      openai: { apiKey: 'openai-key', model: 'gpt-5.5', baseUrl: '' },
      deepseek: { apiKey: 'ds-key', model: 'deepseek-chat', baseUrl: '' },
      custom: { apiKey: '', model: '', baseUrl: '' },
    },
  });

  const openAISettings = getAISettings();
  assert.equal(openAISettings.apiKey, 'openai-key');
  assert.equal(openAISettings.model, 'gpt-5.5');

  saveAISettings({ ...openAISettings, provider: 'deepseek' });

  const deepSeekSettings = getAISettings();
  assert.equal(deepSeekSettings.apiKey, 'ds-key');
  assert.equal(deepSeekSettings.model, 'deepseek-chat');
});
