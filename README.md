# 该不该买

蔡叔（蔡垒磊）认知框架驱动的 AI 消费决策辅助工具。

输入商品信息，回答 5 个追问问题，应用会用蔡叔风格生成一篇买 / 不买的分析文章，并把结果保存在浏览器本地。

## 快速开始

```bash
npm install
npm run dev
```

打开 http://localhost:3000。

## 使用流程

1. 首页输入商品名称、价格和纠结描述。
2. 回答 5 个追问问题。
3. AI 生成分析文章和买 / 不买判决。
4. 决策自动保存到历史记录。

## AI 配置

首次打开网站，或清空浏览器里的 `should-i-buy-ai-settings` 后，应用会弹出配置页。也可以在「设置」页面修改配置。

支持的 provider：

| Provider | 默认模型 |
| --- | --- |
| Claude | `claude-sonnet-4-6` |
| OpenAI | `gpt-5.5` |
| DeepSeek | `deepseek-v4-pro` |
| 自定义 | 留空 |

每个 provider 的 API Key、模型和 Base URL 独立保存；切换当前使用模型时不会把一个 provider 的 Key 显示到另一个 provider 里。配置存储在浏览器 `localStorage`，不会上传到项目服务器。

## 常用命令

```bash
npm run dev      # 本地开发
npm run build    # Next 静态导出构建
npm run lint     # ESLint
```

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Zustand
- localStorage

## 项目文档

- [架构说明](docs/architecture.md)
- [运行手册](docs/runbook.md)
