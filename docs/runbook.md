# 运行手册

## 本地开发

```bash
npm install
npm run dev
```

打开 http://localhost:3000。

## 构建

```bash
npm run build
```

构建使用 Next.js 静态导出，输出目录是 `out/`。

## 测试

Provider 配置隔离测试：

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test tests\ai-settings.test.mjs
```

这个测试覆盖：

- 旧版单 provider 设置迁移后，API Key 只落到当时选中的 provider。
- 切换当前 provider 时，读取对应 provider 的 API Key 和模型。

## Lint

```bash
npm run lint
```

截至 2026-04-30，完整 lint 会报告既有源码问题：

- `src/app/decide/page.tsx`：`useCallback` 在 early return 之后调用。
- `src/app/history/page.tsx`、`src/app/settings/page.tsx`、`src/components/SetupGate.tsx`：effect 内同步 setState。
- `src/app/layout.tsx`：页面内导航使用 `<a>`，Next lint 要求 `Link`。
- `src/app/page.tsx`、`src/components/VerdictStamp.tsx`：未使用变量。
- `src/lib/ai/openai.ts`、`src/lib/ai/claude.ts`：显式 `any`。

目标文件的局部 lint 可用作设置改动验证：

```bash
npx eslint src\components\SettingsPanel.tsx src\lib\storage.ts src\lib\types.ts
```

## AI 配置排查

设置存储在浏览器 localStorage 的 `should-i-buy-ai-settings`。如果要重走首次配置流程，在浏览器开发者工具里删除这个 key。

当前 provider 由 `AISettings.provider` 决定；当前 provider 的实际配置来自 `AISettings.providerConfigs[provider]`。不要手工把一个 provider 的 key 复制到其他 provider。

## 历史记录排查

历史记录存储在 `should-i-buy-history`。删除这个 key 会清空历史决策，不影响 AI 设置。

## 部署

仓库可连接 Vercel。`next.config.ts` 使用 `output: 'export'`，构建结果是静态站点。
