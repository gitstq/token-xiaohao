# Token 面板

> 一个专门用于**消耗闲置 AI Token** 的在线网页工具。很多账号、代理站或兼容接口里的 token 用不完时，可以用 Token 面板在可控预算内批量消耗，并实时观察吞吐、请求状态与消耗曲线。

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-在线预览-5b62f4?style=for-the-badge&logo=github)](https://gitstq.github.io/token-xiaohao/)
[![Open Source](https://img.shields.io/badge/GitHub-开源地址-181717?style=for-the-badge&logo=github)](https://github.com/gitstq/token-xiaohao)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gitstq/token-xiaohao)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/gitstq/token-xiaohao)

![Token 面板桌面截图](assets/screenshot-desktop.png)

## ✨ 项目亮点

- 🔥 **核心用途明确**：就是为了在线消耗用不完的 token，适合额度清理、接口压测前的轻量验证和消耗曲线观察。
- 🎛️ **一个页面完成全部操作**：URL、KEY、模型、线程数、预算、轮次和输出上限都在同一页面内配置。
- 🚀 **兼容 GPT 与 Claude / CC**：内置 GPT Chat Completions 风格请求体，也支持 Claude Messages 风格接口。
- 🧩 **一键获取模型 ID**：填写 URL 和 KEY 后可点击「获取模型」，从兼容接口拉取模型列表并选择模型 ID。
- 📈 **实时数据监控**：总 Token、平均速度、请求状态和实时曲线同步刷新。
- 🛡️ **预算保护**：默认启用预算保护，达到 Token 预算后自动停止。
- ✅ **真实消耗**：不做模拟请求，启动前会校验 URL、KEY 和模型 ID，确认齐全后才会向接口发起真实请求。
- 🔐 **密钥不落盘**：KEY 只存在当前浏览器页面状态中，不会写入仓库或本地文件。
- 🎨 **简洁高级 UI**：参考网络面板风格，清爽浅色、核心指标优先、操作按钮醒目。

## 🖼️ 移动端效果

![Token 面板移动端截图](assets/screenshot-mobile.png)

## ⚙️ 使用方式

1. 打开在线页面或本地 `index.html`。
2. 选择接口类型：`GPT`、`Claude / CC` 或 `自定义`。
3. 填写兼容接口的 `URL` 和 `KEY`。
4. 展开「参数设置」，点击「获取模型」并从下拉框选择模型 ID。
5. 调整线程数、预算、轮次和输出上限。
6. 点击中间的播放按钮开始消耗，再次点击可停止。

> 页面只做真实请求，会调用你填写的接口并产生用量。若供应商拦截浏览器跨域请求，请填写支持 CORS 的兼容接口地址或自建转发 URL。最终计费以供应商后台为准。

## 🔌 接口兼容说明

| 类型 | 默认 URL | 鉴权方式 | 请求格式 |
| --- | --- | --- | --- |
| GPT | `https://api.openai.com/v1/chat/completions` | `Authorization: Bearer <KEY>` | Chat Completions |
| Claude / CC | `https://api.anthropic.com/v1/messages` | `x-api-key: <KEY>` | Messages |
| 自定义 | `https://example.com/v1/chat/completions` | `Authorization: Bearer <KEY>` | GPT 兼容 |

模型获取会根据当前 URL 自动推导模型接口，例如 `/v1/chat/completions` 会推导为 `/v1/models`。不同代理站的模型列表格式可能略有差异，页面会尽量兼容 `data`、`models` 或数组格式。

## 🚀 一键部署

你可以直接点击上方按钮部署到 Vercel 或 Netlify，也可以 Fork 后启用 GitHub Pages。本仓库已包含 `.github/workflows/pages.yml`，推送到 `main` 分支后会自动发布静态页面。

```bash
git clone https://github.com/gitstq/token-xiaohao.git
cd token-xiaohao
python -m http.server 5173
```

然后访问：

```text
http://127.0.0.1:5173/index.html
```

## 🧭 设计取向

Token 面板把复杂参数收纳在轻量设置区，把高频操作集中在一个主按钮上，把实时状态压缩为三张指标卡和一条曲线。它不是复杂后台，而是一个即开即用、干净利落的 Token 消耗面板。

UI 方向参考了 [ljxi/NetworkPanel](https://github.com/ljxi/NetworkPanel) 的网络面板式单屏体验：顶部状态、居中主卡片、核心指标优先、操作路径尽量短。
