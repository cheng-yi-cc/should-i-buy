'use client';

import { useState } from 'react';
import type { DecisionInput } from '@/lib/types';

interface FormCardProps {
  onSubmit: (input: DecisionInput) => void;
}

export default function FormCard({ onSubmit }: FormCardProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), price: price.trim(), description: description.trim() });
  };

  return (
    <div className="relative bg-surface border border-border rounded-sm p-10">
      {/* Decorative label */}
      <span className="absolute top-3 left-4 font-mono text-[11px] text-gold tracking-[2px]">
        卷 · 壹
      </span>

      <div className="space-y-5 mt-4">
        {/* Item name */}
        <div>
          <label className="block text-[13px] text-text-muted mb-2 font-mono tracking-wider">
            想买什么
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="AirPods Pro 2"
            className="w-full bg-background border border-border rounded-sm px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-[13px] text-text-muted mb-2 font-mono tracking-wider">
            价格
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="¥1,899"
            className="w-full bg-background border border-border rounded-sm px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[13px] text-text-muted mb-2 font-mono tracking-wider">
            怎么纠结的
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="看了很多评测说好，但觉得有点贵..."
            rows={4}
            className="w-full bg-background border border-border rounded-sm px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-gold transition-colors resize-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-accent text-white font-bold tracking-[4px] py-3.5 rounded-sm hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(196,59,59,0.3)] transition-all duration-200 active:translate-y-0"
        >
          该不该买
        </button>
      </div>
    </div>
  );
}
