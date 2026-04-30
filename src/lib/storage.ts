import type {
  AIProvider,
  AIProviderConfig,
  AIProviderConfigs,
  AISettings,
  Decision,
} from '@/lib/types';

const HISTORY_KEY = 'should-i-buy-history';
const AI_SETTINGS_KEY = 'should-i-buy-ai-settings';

export const AI_PROVIDER_OPTIONS: {
  key: AIProvider;
  label: string;
  defaultModel: string;
  apiKeyPlaceholder: string;
  baseUrlPlaceholder: string;
}[] = [
  {
    key: 'claude',
    label: 'Claude',
    defaultModel: 'claude-sonnet-4-6',
    apiKeyPlaceholder: 'sk-ant-...',
    baseUrlPlaceholder: 'https://api.anthropic.com',
  },
  {
    key: 'openai',
    label: 'OpenAI',
    defaultModel: 'gpt-5.5',
    apiKeyPlaceholder: 'sk-...',
    baseUrlPlaceholder: 'https://api.openai.com',
  },
  {
    key: 'deepseek',
    label: 'DeepSeek',
    defaultModel: 'deepseek-v4-pro',
    apiKeyPlaceholder: 'sk-...',
    baseUrlPlaceholder: 'https://api.deepseek.com',
  },
  {
    key: 'custom',
    label: '自定义',
    defaultModel: '',
    apiKeyPlaceholder: 'sk-...',
    baseUrlPlaceholder: 'https://api.example.com',
  },
];

const AI_PROVIDER_KEYS = AI_PROVIDER_OPTIONS.map((provider) => provider.key);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAIProvider(value: unknown): value is AIProvider {
  return typeof value === 'string' && AI_PROVIDER_KEYS.includes(value as AIProvider);
}

function getDefaultProviderConfig(provider: AIProvider): AIProviderConfig {
  const option = AI_PROVIDER_OPTIONS.find((item) => item.key === provider);

  return {
    apiKey: '',
    model: option?.defaultModel ?? '',
    baseUrl: '',
  };
}

function normalizeProviderConfig(
  provider: AIProvider,
  value: unknown,
): AIProviderConfig {
  const fallback = getDefaultProviderConfig(provider);

  if (!isRecord(value)) {
    return fallback;
  }

  return {
    apiKey: typeof value.apiKey === 'string' ? value.apiKey : fallback.apiKey,
    model: typeof value.model === 'string' ? value.model : fallback.model,
    baseUrl: typeof value.baseUrl === 'string' ? value.baseUrl : fallback.baseUrl,
  };
}

function createDefaultProviderConfigs(): AIProviderConfigs {
  return {
    claude: getDefaultProviderConfig('claude'),
    openai: getDefaultProviderConfig('openai'),
    deepseek: getDefaultProviderConfig('deepseek'),
    custom: getDefaultProviderConfig('custom'),
  };
}

export function normalizeAISettings(value?: unknown): AISettings {
  const raw = isRecord(value) ? value : {};
  const provider = isAIProvider(raw.provider) ? raw.provider : 'claude';
  const providerConfigs = createDefaultProviderConfigs();
  const savedProviderConfigs = raw.providerConfigs;

  if (isRecord(savedProviderConfigs)) {
    for (const providerKey of AI_PROVIDER_KEYS) {
      providerConfigs[providerKey] = normalizeProviderConfig(
        providerKey,
        savedProviderConfigs[providerKey],
      );
    }
  } else {
    providerConfigs[provider] = normalizeProviderConfig(provider, raw);
  }

  const activeConfig = providerConfigs[provider];

  return {
    provider,
    apiKey: activeConfig.apiKey,
    model: activeConfig.model,
    baseUrl: activeConfig.baseUrl,
    providerConfigs,
  };
}

export function getProviderConfig(
  settings: AISettings,
  provider: AIProvider = settings.provider,
): AIProviderConfig {
  return settings.providerConfigs[provider] ?? getDefaultProviderConfig(provider);
}

export function updateProviderConfig(
  settings: AISettings,
  provider: AIProvider,
  patch: Partial<AIProviderConfig>,
): AISettings {
  const currentConfig = getProviderConfig(settings, provider);

  return normalizeAISettings({
    ...settings,
    providerConfigs: {
      ...settings.providerConfigs,
      [provider]: {
        ...currentConfig,
        ...patch,
      },
    },
  });
}

export function isActiveProviderConfigured(settings: AISettings): boolean {
  return getProviderConfig(settings, settings.provider).apiKey.trim().length > 0;
}

export function getConfiguredProviderCount(settings: AISettings): number {
  return AI_PROVIDER_KEYS.filter(
    (provider) => getProviderConfig(settings, provider).apiKey.trim().length > 0,
  ).length;
}

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
  if (typeof window === 'undefined') return normalizeAISettings();
  try {
    const raw = localStorage.getItem(AI_SETTINGS_KEY);
    if (!raw) return normalizeAISettings();
    return normalizeAISettings(JSON.parse(raw));
  } catch {
    return normalizeAISettings();
  }
}

export function saveAISettings(settings: AISettings): void {
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(normalizeAISettings(settings)));
}
