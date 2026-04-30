'use client';

import { useState } from 'react';
import type { AISettings, AIProvider } from '@/lib/types';
import {
  AI_PROVIDER_OPTIONS,
  getConfiguredProviderCount,
  getProviderConfig,
  isActiveProviderConfigured,
  normalizeAISettings,
  updateProviderConfig,
} from '@/lib/storage';

interface SettingsPanelProps {
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

export default function SettingsPanel({ settings, onSave }: SettingsPanelProps) {
  const [local, setLocal] = useState<AISettings>(() => normalizeAISettings(settings));

  const handleProviderChange = (provider: AIProvider) => {
    setLocal((current) => normalizeAISettings({ ...current, provider }));
  };

  const handleSave = () => {
    onSave(normalizeAISettings(local));
  };

  const activeProvider = AI_PROVIDER_OPTIONS.find((provider) => provider.key === local.provider);
  const activeConfig = getProviderConfig(local, local.provider);
  const isConfigured = isActiveProviderConfigured(local);
  const configuredCount = getConfiguredProviderCount(local);

  const updateActiveConfig = (patch: Parameters<typeof updateProviderConfig>[2]) => {
    setLocal((current) => updateProviderConfig(current, current.provider, patch));
  };

  return (
    <div className="bg-surface border border-border rounded-sm p-10 space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-text">AI 接入配置</h2>
        <p className="text-[13px] text-text-muted mt-2">
          配置你的 AI 服务，用于生成消费决策分析。
        </p>
      </div>

      {/* Provider switcher */}
      <div>
        <label className="block text-[13px] text-text-muted mb-3 font-mono tracking-wider">
          当前使用模型
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {AI_PROVIDER_OPTIONS.map((provider) => {
            const providerConfig = getProviderConfig(local, provider.key);
            const providerConfigured = providerConfig.apiKey.trim().length > 0;
            const active = local.provider === provider.key;

            return (
              <button
                key={provider.key}
                onClick={() => handleProviderChange(provider.key)}
                className={`
                  min-h-[72px] px-3 py-3 text-left font-mono transition-colors border rounded-sm
                  ${active
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-border bg-background/40 text-text-muted hover:text-text hover:border-text-muted'
                  }
                `}
              >
                <span className="block text-sm">{provider.label}</span>
                <span className={`mt-2 block text-[11px] ${providerConfigured ? 'text-green-600' : 'text-text-muted/70'}`}>
                  {active ? '使用中' : providerConfigured ? '已配置' : '未配置'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* API Key */}
      <div>
        <label className="block text-[13px] text-text-muted mb-2 font-mono tracking-wider">
          {activeProvider?.label ?? 'AI'} API Key
        </label>
        <div className="flex gap-3">
          <input
            type="password"
            value={activeConfig.apiKey}
            onChange={(e) => updateActiveConfig({ apiKey: e.target.value })}
            placeholder={activeProvider?.apiKeyPlaceholder ?? 'sk-...'}
            className="flex-1 bg-background border border-border rounded-sm px-4 py-2.5 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>

      {/* Model */}
      <div>
        <label className="block text-[13px] text-text-muted mb-2 font-mono tracking-wider">
          模型 ID
        </label>
        <input
          type="text"
          value={activeConfig.model}
          onChange={(e) => updateActiveConfig({ model: e.target.value })}
          placeholder={activeProvider?.defaultModel}
          className="w-full bg-background border border-border rounded-sm px-4 py-2.5 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      {local.provider === 'custom' && (
        <div>
          <label className="block text-[13px] text-text-muted mb-2 font-mono tracking-wider">
            Base URL
          </label>
          <input
            type="url"
            value={activeConfig.baseUrl}
            onChange={(e) => updateActiveConfig({ baseUrl: e.target.value })}
            placeholder={activeProvider?.baseUrlPlaceholder}
            className="w-full bg-background border border-border rounded-sm px-4 py-2.5 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      )}

      {/* Status */}
      <div className="flex flex-col gap-1 text-sm md:flex-row md:items-center md:justify-between">
        {isConfigured ? (
          <span className="text-green-600 font-mono">当前模型已配置</span>
        ) : (
          <span className="text-text-muted font-mono">当前模型未配置</span>
        )}
        <span className="text-text-muted font-mono text-xs">
          已保存 {configuredCount} 个配置
        </span>
      </div>

      <button
        onClick={handleSave}
        className="w-full px-5 py-3 bg-gold text-background font-bold text-sm rounded-sm hover:opacity-90 transition-opacity"
      >
        保存配置
      </button>
    </div>
  );
}
