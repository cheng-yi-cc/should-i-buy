'use client';

import { useState } from 'react';
import type { AISettings, AIProvider } from '@/lib/types';

interface SettingsPanelProps {
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

const PROVIDERS: { key: AIProvider; label: string; defaultModel: string }[] = [
  { key: 'claude', label: 'Claude', defaultModel: 'claude-sonnet-4-6' },
  { key: 'openai', label: 'OpenAI', defaultModel: 'gpt-5.5' },
  { key: 'deepseek', label: 'DeepSeek', defaultModel: 'deepseek-v4-pro' },
  { key: 'custom', label: '自定义', defaultModel: '' },
];

export default function SettingsPanel({ settings, onSave }: SettingsPanelProps) {
  const [local, setLocal] = useState<AISettings>(settings);

  const handleProviderChange = (provider: AIProvider) => {
    const info = PROVIDERS.find((p) => p.key === provider);
    setLocal({
      ...local,
      provider,
      model: info?.defaultModel || '',
      baseUrl: provider === 'custom' ? local.baseUrl : '',
    });
  };

  const handleSave = () => {
    onSave(local);
  };

  const isConfigured = local.apiKey.trim().length > 0;

  return (
    <div className="bg-surface border border-border rounded-sm p-10 space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-text">AI 接入配置</h2>
        <p className="text-[13px] text-text-muted mt-2">
          选择你的 AI 服务，填入 API Key 即可使用。
        </p>
      </div>

      {/* Provider tabs */}
      <div className="flex border-b border-border">
        {PROVIDERS.map((p) => (
          <button
            key={p.key}
            onClick={() => handleProviderChange(p.key)}
            className={`
              px-4 py-2.5 text-sm font-mono transition-colors border-b-2 -mb-px
              ${local.provider === p.key
                ? 'border-gold text-gold'
                : 'border-transparent text-text-muted hover:text-text'
              }
            `}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom: Base URL */}
      {local.provider === 'custom' && (
        <div className="animate-[fadeUp_0.3s_forwards]">
          <label className="block text-[13px] text-text-muted mb-2 font-mono tracking-wider">
            接口地址
          </label>
          <input
            type="text"
            value={local.baseUrl}
            onChange={(e) => setLocal({ ...local, baseUrl: e.target.value })}
            placeholder="https://your-api.example.com"
            className="w-full bg-background border border-border rounded-sm px-4 py-2.5 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      )}

      {/* API Key */}
      <div>
        <label className="block text-[13px] text-text-muted mb-2 font-mono tracking-wider">
          API Key
        </label>
        <div className="flex gap-3">
          <input
            type="password"
            value={local.apiKey}
            onChange={(e) => setLocal({ ...local, apiKey: e.target.value })}
            placeholder="sk-..."
            className="flex-1 bg-background border border-border rounded-sm px-4 py-2.5 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-gold transition-colors"
          />
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-gold text-background font-bold text-sm rounded-sm hover:opacity-90 transition-opacity flex-shrink-0"
          >
            保存
          </button>
        </div>
      </div>

      {/* Model */}
      <div>
        <label className="block text-[13px] text-text-muted mb-2 font-mono tracking-wider">
          模型
        </label>
        <input
          type="text"
          value={local.model}
          onChange={(e) => setLocal({ ...local, model: e.target.value })}
          className="w-full bg-background border border-border rounded-sm px-4 py-2.5 text-text focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      {/* Status */}
      <div className="text-sm">
        {isConfigured ? (
          <span className="text-green-600 font-mono">✓ 已配置</span>
        ) : (
          <span className="text-text-muted font-mono">未配置</span>
        )}
      </div>
    </div>
  );
}
