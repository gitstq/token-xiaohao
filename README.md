# Token 在线消耗器

> 一个专门用于**消耗闲置 AI Token** 的在线网页工具。很多账号、代理站或兼容接口里的 token 用不完时，可以用 Token 面板在可控预算内批量消耗，并实时观察吞吐、请求状态与消耗曲线。

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-在线预览-5b62f4?style=for-the-badge&logo=github)](https://gitstq.github.io/token-xiaohao/)
[![Open Source](https://img.shields.io/badge/GitHub-开源地址-181717?style=for-the-badge&logo=github)](https://github.com/gitstq/token-xiaohao)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gitstq/token-xiaohao)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/gitstq/token-xiaohao)

![Token 面板桌面截图](assets/screenshot-desktop.png)

## ✨ 功能亮点

- 🔥 **核心用途明确**：就是为了在线消耗用不完的 token，适合额度清理、接口压测前的轻量验证和消耗曲线观察。
- 🎛️ **一个页面完成全部操作**：URL、KEY、模型、线程数、预算、轮次、输出上限和主题切换都在同一页面内完成。
- 🚀 **兼容 OpenAI 与 Anthropic**：内置 OpenAI Chat Completions 风格请求体，也支持 Anthropic Messages 风格接口。
- 🧩 **一键获取模型 ID**：填写 URL 和 KEY 后可点击「获取模型」，从兼容接口拉取模型列表并选择模型 ID。
- 📈 **实时数据监控**：总 Token、平均速度、请求状态和 ECharts 实时图表同步刷新。
- 🛡️ **预算保护**：默认启用预算保护，达到 Token 预算后自动停止。
- 🌙 **深浅色模式**：支持右上角手动切换，并自动适配系统主题。
- 🖥️ **保持后台运行**：支持浏览器 Screen Wake Lock，运行时尽量避免设备休眠。
- 🔁 **本地代理回退**：接口未开放浏览器 CORS 时，可通过本地代理使用当前电脑网络环境转发请求。
- ✅ **真实消耗**：不做模拟请求，启动前会校验 URL、KEY 和模型 ID，确认齐全后才会向接口发起真实请求。
- 🔐 **密钥不落盘**：KEY 只存在当前浏览器页面状态中，不会写入仓库或本地文件。
- 🎨 **NetworkPanel 风格 UI**：对齐 `ljxi/NetworkPanel` 的面板布局、开关、滑条、ECharts 图表和中央启动按钮风格。

## 🖼️ 移动端效果

![Token 面板移动端截图](assets/screenshot-mobile.png)

## 🌐 在线使用

打开在线页面：

```text
https://gitstq.github.io/token-xiaohao/
```

使用步骤：

1. 选择接口类型：`OpenAI`、`Anthropic` 或 `自定义`。
2. 填写接口地址和 KEY。
3. 点击「获取模型」，从「模型 ID」下拉框选择模型。
4. 设置线程数、预算保护、Token 预算和高级参数。
5. 点击中央播放按钮开始消耗，再次点击可停止。
6. 点击右下角图表按钮可展开 Token 图表；图表展开后页面区域支持滚动查看。

> 页面只做真实请求，会调用你填写的接口并产生用量。若供应商拦截浏览器跨域请求，请填写支持 CORS 的兼容接口地址或自建转发 URL。最终计费以供应商后台为准。

## 💻 本地启动教程

### 1. 准备环境

本项目是静态页面，本地预览只需要 Python 或任意静态文件服务器。
如果要使用本地代理，需要安装 Node.js 18 或更高版本。

检查环境：

```powershell
python --version
node --version
```

### 2. 启动网页

```powershell
git clone https://github.com/gitstq/token-xiaohao.git
cd token-xiaohao
python -m http.server 5173
```

浏览器访问：

```text
http://127.0.0.1:5173/index.html
```

### 3. 启动本地代理

如果你的接口不支持浏览器 CORS，点击「获取模型」可能会失败。
可以另开一个 PowerShell 终端，在项目目录运行：

```powershell
node local-proxy.js
```

代理默认监听：

```text
http://127.0.0.1:8787
```

页面里仍然填写原始接口地址，例如：

```text
https://你的接口域名
```

页面会先尝试直连；如果浏览器 CORS 拦截失败，会自动走本地代理，由本机网络环境转发请求。

### 4. 常见本地启动问题

- `请先启动本地代理：node local-proxy.js`：说明接口被 CORS 拦截，并且本地代理没有运行。
- `端口 5173 被占用`：换一个端口，例如 `python -m http.server 5174`。
- `端口 8787 被占用`：用 `PORT` 指定代理端口，例如 `$env:PORT=8788; node local-proxy.js`，同时页面代码里的代理地址也需要对应调整。
- 获取模型成功但启动失败：确认已选择模型 ID，并检查接口类型是否与请求体兼容。

## 🔌 接口兼容说明

| 类型 | 默认接口 | 鉴权方式 | 请求格式 |
| --- | --- | --- | --- |
| OpenAI | `https://api.openai.com/v1` | `Authorization: Bearer <KEY>` | Chat Completions |
| Anthropic | `https://api.anthropic.com/v1` | `x-api-key: <KEY>` | Messages |
| 自定义 | 任意兼容 `/v1` 地址 | `Authorization: Bearer <KEY>` | OpenAI 兼容 |

模型获取会根据当前 URL 自动推导模型接口，例如 `/v1/chat/completions` 会推导为 `/v1/models`。不同代理站的模型列表格式可能略有差异，页面会尽量兼容 `data`、`models` 或数组格式。

## 🔁 CORS 与代理说明

浏览器请求带有 `Authorization`、`x-api-key` 等请求头时，会触发 CORS 预检。
如果接口服务端没有正确处理 `OPTIONS` 请求，页面会看到 `Failed to fetch` 或「接口未开放浏览器 CORS」。

解决方式：

- 本地使用：启动 `node local-proxy.js`。
- 线上使用：部署一个公网代理服务，例如 Cloudflare Worker、Vercel Functions 或自己的服务器反代。
- 服务端修复：让目标接口正确返回 CORS 响应头。

需要允许的请求头通常包括：

```text
authorization
content-type
x-api-key
anthropic-version
```

`OPTIONS` 预检请求应直接返回 `200` 或 `204`，不要要求鉴权。

## ☁️ 线上部署

### GitHub Pages

Fork 本仓库后，在 GitHub Pages 中选择 `main` 分支发布即可。
当前仓库的线上地址：

```text
https://gitstq.github.io/token-xiaohao/
```

### Vercel / Netlify

可以直接点击 README 顶部的一键部署按钮，也可以手动导入仓库。
这是纯静态项目，不需要构建命令，发布目录为仓库根目录。

### 线上代理

线上页面不能使用访问者电脑上的 `127.0.0.1:8787` 作为公共代理。
如果要让所有访问者都能稳定跨域请求，需要部署公网代理，并将页面中的代理地址改成你的公网代理地址。

安全建议：

- 不要把 KEY 写进代理代码。
- 不要记录 `Authorization`、`x-api-key` 等敏感请求头。
- 建议限制允许访问的前端域名。
- 真实消耗会产生费用，最终以接口供应商后台为准。

## 🗂️ 项目结构

```text
token-xiaohao/
├─ index.html          # 主页面，所有 UI 与请求逻辑
├─ local-proxy.js      # 本地 CORS 转发代理
├─ README.md           # 项目文档
└─ assets/             # 截图资源
```

## 🧭 设计取向

Token 在线消耗器把复杂参数收纳在轻量设置区，把高频操作集中在一个主按钮上，把实时状态压缩为三张指标卡和一条 ECharts 曲线。它不是复杂后台，而是一个即开即用、干净利落的 Token 消耗面板。
