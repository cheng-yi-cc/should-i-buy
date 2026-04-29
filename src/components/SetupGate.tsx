'use client';

import { useState, useEffect } from 'react';
import { getAISettings, saveAISettings } from '@/lib/storage';
import type { AISettings } from '@/lib/types';
import SettingsPanel from './SettingsPanel';

export default function SetupGate({ children }: { children: React.ReactNode }) {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [exiting, setExiting] = useState(false);
  const [settings, setSettings] = useState<AISettings | null>(null);

  useEffect(() => {
    const s = getAISettings();
    setSettings(s);
    setConfigured(s.apiKey.trim().length > 0);
  }, []);

  function handleSave(newSettings: AISettings) {
    saveAISettings(newSettings);
    setSettings(newSettings);
    if (newSettings.apiKey.trim().length > 0) {
      setExiting(true);
      setTimeout(() => setConfigured(true), 700);
    }
  }

  // Still loading
  if (configured === null || settings === null) return null;

  // Already configured — render children directly
  if (configured) return <>{children}</>;

  // First-time setup overlay
  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center px-6 transition-all duration-700 ${
        exiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
      style={{ background: 'var(--color-background)' }}
    >
      {/* Decorative top seal */}
      <div className="mb-10 opacity-0 animate-[fadeUp_0.8s_0.1s_forwards]">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-accent/20 animate-pulse" />
          <div className="absolute inset-1 rounded-full bg-accent flex items-center justify-center">
            <span className="text-background text-2xl font-black">买</span>
          </div>
        </div>
        <p className="text-text-muted text-xs font-mono tracking-[4px] uppercase text-center">
          初次见面
        </p>
      </div>

      {/* Title */}
      <div className="text-center mb-10 opacity-0 animate-[fadeUp_0.8s_0.3s_forwards]">
        <h1 className="text-3xl md:text-4xl font-black text-text mb-3">
          打开这本札记之前
        </h1>
        <p className="text-text-muted text-base leading-relaxed max-w-[380px]">
          蔡叔说，工具再好，也得先磨刀。<br />
          接入你的 AI，我才能替你想清楚。
        </p>
      </div>

      {/* Settings form */}
      <div className="w-full max-w-[480px] opacity-0 animate-[fadeUp_0.8s_0.5s_forwards]">
        <SettingsPanel settings={settings} onSave={handleSave} />
      </div>

      {/* Skip hint */}
      <p className="mt-8 text-text-muted/40 text-xs font-mono tracking-wider opacity-0 animate-[fadeUp_0.8s_0.7s_forwards]">
        你也可以稍后在「设置」中修改
      </p>
    </div>
  );
}
