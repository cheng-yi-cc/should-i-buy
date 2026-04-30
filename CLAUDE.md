@AGENTS.md

# 消费决策网站 Agent Notes

## 项目定位

这是一个纯前端消费决策网站。用户输入商品信息，回答 5 个追问，浏览器端调用用户配置的 AI Provider，生成蔡叔风格的买 / 不买分析。

## 技术栈

- Next.js 16.2.4 App Router + React 19
- TypeScript
- Tailwind CSS v4
- Zustand
- localStorage
- 静态导出：`next.config.ts` 使用 `output: 'export'`

## 目录结构

```text
src/
  app/              # /, /decide, /result, /history, /settings
  components/       # 页面 UI 和配置弹窗
  lib/
    ai/             # Provider 调用、Prompt、AI 路由
    questions.ts    # 7 题题库，按商品名 hash 选 5 题
    storage.ts      # localStorage 封装和 AI 设置迁移
    types.ts        # 共享类型
  store/useStore.ts # Zustand 流程状态
```

## AI 设置模型

- 所有 AI 设置从 `src/lib/storage.ts` 的 `getAISettings` / `saveAISettings` 读写，不要直接读写 raw localStorage。
- localStorage key 是 `should-i-buy-ai-settings`。
- `AISettings.provider` 表示当前使用的 provider。
- `AISettings.providerConfigs` 按 `claude` / `openai` / `deepseek` / `custom` 分别保存 `apiKey`、`model`、`baseUrl`。
- `normalizeAISettings` 会迁移旧版单 provider 配置：旧的 `apiKey/model/baseUrl` 只进入当时选中的 provider，不复制到其他 provider。
- 默认模型：Claude `claude-sonnet-4-6`，OpenAI `gpt-5.5`，DeepSeek `deepseek-v4-pro`，自定义为空。

## 运行流程

1. `ClientGate` 包住应用主体，`SetupGate` 检查当前 provider 是否有 API Key。
2. 未配置时显示配置弹窗；已配置时渲染站点。
3. 首页提交后，`selectQuestions` 从 7 题中选出 5 题。
4. `/decide` 收集答案；最后一题后跳转 `/result` 并调用 `generateDecision`。
5. `/result` 流式展示 AI 输出，并从第一行提取判决：含「买」且不含「不买」为买，否则为不买。
6. 结果保存到 `should-i-buy-history`。

## 常用命令

```bash
npm run dev
npm run build
npm run lint
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test tests\ai-settings.test.mjs
```

## 已知质量事项

- `npm run build` 可作为构建验证。
- `tests/ai-settings.test.mjs` 覆盖 provider 配置隔离和旧设置迁移。
- 截至 2026-04-30，`npm run lint` 有既有源码 lint 债务，主要在 hook 顺序、effect 内同步 setState、`<a>` 页面导航、未使用变量和 `any` 类型。修复这些问题前，不要把完整 lint 当作绿色门禁。

## 约束

- 不要硬编码 API Key 或任何密钥。
- AI 调用在浏览器端完成；项目没有后端、数据库或 server-side secret 存储。
- 修改 Next.js 相关代码前，遵守 `AGENTS.md`：先读 `node_modules/next/dist/docs/` 里的对应 Next 16 文档。
- 修改 UI 时保持现有「侘寂札记」视觉：暖深棕背景、衬线中文、朱红强调、金色配置按钮。
