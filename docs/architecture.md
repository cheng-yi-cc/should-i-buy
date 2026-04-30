# 架构说明

## 概览

这是一个静态导出的 Next.js 16 前端应用。所有业务数据都存在浏览器端：

- 决策流程状态：Zustand store
- 决策历史：`localStorage`
- AI 设置：`localStorage`
- AI API 调用：浏览器直接请求用户选择的 provider

项目不包含后端服务、数据库、API Route 或 server-side secret 存储。

## 路由

| 路由 | 文件 | 职责 |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | 商品输入，生成 5 个追问 |
| `/decide` | `src/app/decide/page.tsx` | 展示追问，收集答案，触发 AI 生成 |
| `/result` | `src/app/result/page.tsx` | 流式展示分析文章，保存历史 |
| `/history` | `src/app/history/page.tsx` | 查看历史决策 |
| `/settings` | `src/app/settings/page.tsx` | 管理 AI provider 配置 |

`src/components/ClientGate.tsx` 在应用主体外包了一层 `SetupGate`，用于在没有当前 provider API Key 时显示配置弹窗。

## AI 设置数据模型

类型定义在 `src/lib/types.ts`：

```ts
export type AIProvider = 'claude' | 'openai' | 'deepseek' | 'custom';

export interface AIProviderConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
}

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseUrl: string;
  providerConfigs: Record<AIProvider, AIProviderConfig>;
}
```

`provider` 是当前使用的 provider。`providerConfigs` 分别保存四个 provider 的配置，避免一个 provider 的 API Key 出现在其他 provider 面板里。

`apiKey`、`model` 和 `baseUrl` 仍保留在顶层，作为当前 provider 的兼容字段。调用 AI 时，现有代码继续读取顶层字段。

## 设置迁移

`src/lib/storage.ts` 的 `normalizeAISettings` 负责统一入口：

- 无设置时返回默认 provider 配置。
- 已有 `providerConfigs` 时逐个 provider 归一化。
- 旧版只有顶层 `apiKey/model/baseUrl` 时，只把这些值放进当前 `provider` 对应的配置。

这保证旧用户只配置 DeepSeek 时，OpenAI、Claude 和自定义 provider 不会显示 DeepSeek 的 key。

## 决策流程

1. 首页表单提交 `DecisionInput`。
2. `selectQuestions` 固定包含「纠结多久」和「刚需还是想要」，再根据商品名 hash 从剩余 5 题中选 3 题。
3. `/decide` 逐题收集答案。
4. 最后一题后调用 `getAISettings`，检查当前 provider 的 API Key。
5. `generateDecision` 根据 provider 分发到 Claude、OpenAI、DeepSeek 或 OpenAI-compatible 自定义 provider。
6. `/result` 用流式 chunk 拼接文章，并从第一行推断买 / 不买判决。
7. 生成完成后写入 `should-i-buy-history`。

## localStorage Keys

| Key | 内容 |
| --- | --- |
| `should-i-buy-ai-settings` | 当前 provider 和四个 provider 的独立配置 |
| `should-i-buy-history` | 决策历史列表 |
