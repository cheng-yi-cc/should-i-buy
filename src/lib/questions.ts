import type { DecisionInput, Question } from '@/lib/types';

export const questions: Question[] = [
  {
    id: 'hesitation-duration',
    text: '这个东西你纠结多久了？',
    options: ['不到一天', '一到三天', '三到七天', '超过一周'],
    model: '纠结超一天就买',
  },
  {
    id: 'substitute-satisfaction',
    text: '手头现有的替代品能满足你多少需求？',
    options: ['完全没有', '能凑合用但体验差', '能用但想要更好的', '其实还行就是想要'],
    model: '资产视角',
  },
  {
    id: 'usage-frequency',
    text: '买回来你大概多久用一次？',
    options: ['每天', '每周几次', '偶尔', '不确定'],
    model: '时间密度',
  },
  {
    id: 'need-vs-want',
    text: '这个东西对你来说是刚需还是想要？',
    options: ['没有它会很不方便', '有了会明显提升体验', '纯粹想要', '说不清'],
    model: '三种差',
  },
  {
    id: 'income-ratio',
    text: '这个价格大概占你月收入的多少？',
    options: ['不到5%', '5%到15%', '15%到30%', '超过30%', '不方便说'],
    model: '成本收益',
  },
  {
    id: 'alternatives',
    text: '有没有更便宜的替代方案你了解过？',
    options: ['了解过，这个是最优选', '了解过但没这个好', '没了解过', '没有替代品'],
    model: '信息差',
  },
  {
    id: 'consequence',
    text: '如果不买，你会怎样？',
    options: ['其实也没什么影响', '会一直惦记', '会找别的替代', '工作或生活会受影响'],
    model: '上行概率',
  },
];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function selectQuestions(input: DecisionInput): Question[] {
  // Always include: question 0 (hesitation-duration) and question 3 (need-vs-want)
  const alwaysIncluded = [questions[0], questions[3]];

  // Remaining candidates: indices 1, 2, 4, 5, 6
  const candidates = [questions[1], questions[2], questions[4], questions[5], questions[6]];

  // Use hash of product name to pick 3 from 5 candidates
  const hash = simpleHash(input.name);
  const selected: Question[] = [];

  // Rotate through candidates based on hash
  for (let i = 0; i < 3; i++) {
    const index = (hash + i) % candidates.length;
    selected.push(candidates[index]);
  }

  // Deduplicate in case hash + i mod length collides (won't happen for 3 from 5, but safety)
  const unique = [...new Map(selected.map((q) => [q.id, q])).values()];

  // If dedup reduced count, fill from remaining candidates
  while (unique.length < 3) {
    for (const c of candidates) {
      if (!unique.find((q) => q.id === c.id)) {
        unique.push(c);
        break;
      }
    }
  }

  return [...alwaysIncluded, ...unique.slice(0, 3)];
}
