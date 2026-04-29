'use client';

import { useState, useEffect } from 'react';
import PageLabel from '@/components/PageLabel';
import SettingsPanel from '@/components/SettingsPanel';
import { getAISettings, saveAISettings } from '@/lib/storage';
import type { AISettings } from '@/lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getAISettings());
  }, []);

  function handleSave(newSettings: AISettings) {
    saveAISettings(newSettings);
    setSettings(newSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!settings) return null;

  return (
    <section className="min-h-screen flex flex-col items-center px-6 pt-32 pb-20">
      <PageLabel text="配置" />
      <SettingsPanel settings={settings} onSave={handleSave} />
      {saved && (
        <div className="mt-4 text-sm text-gold font-mono animate-[fadeUp_0.3s_forwards]">
          ✓ 已保存
        </div>
      )}
    </section>
  );
}
