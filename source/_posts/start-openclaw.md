---
title: OpenClaw 快速开始
date: 2026-06-22 00:00:00
tags:
  - OpenClaw
  - AI
  - Agent
  - 本地部署
  - Node.js
  - Docker
  - 由AI生成
categories:
  - 教程
cover: /images/startopenclaw.jpg

---

> 适用平台：Windows / macOS / Linux | 更新时间：2026-06

---

## 一、什么是 OpenClaw

OpenClaw 是一个本地 AI Agent 运行时。安装后可以通过 CLI（终端命令）、Web 控制台、或各种聊天平台（微信、Telegram、Discord 等）与 AI 对话，支持文件读写、命令执行、联网搜索、定时任务等工具。

核心组件：

| 组件 | 说明 |
|------|------|
| **Gateway** | 核心服务，管理会话、路由消息、执行工具 |
| **Control UI** | 浏览器控制台，`http://127.0.0.1:18789` |
| **Channels** | 消息渠道（微信/Telegram/Discord/Slack 等） |
| **Skills** | 社区能力模块，可安装扩展功能 |

---

## 二、准备工作

### 2.1 系统要求

- 推荐**Node.js 24** 最低支持Node.js 22.19+
- 操作系统：Windows 10 / Windows 11 / macOS 12 Monterey 或更新版本 / Linux
- 一个模型供应商的 API Key（见 2.2）

查看 Node 版本：
```bash
node --version
```

如果未安装或版本过低，从 [nodejs.org](https://nodejs.org) 下载安装。

### 2.2 API Key

OpenClaw 本身不提供模型服务，需要接入第三方模型 API。常用选项：

| 供应商(主流模型) | 获取方式 |
|--------|----------|
| **DeepSeek(DeepSeek V4)** | [platform.deepseek.com](https://platform.deepseek.com) → API Keys |
| **豆包(Doubao-Seed-2.0)**|[console.volcengine.com](https://console.volcengine.com)→ 登录|
| **Anthropic(Claude Opus 4.6)** | [console.anthropic.com](https://console.anthropic.com) → API Keys |
| **OpenAI(GPT-5.2)** | [platform.openai.com](https://platform.openai.com) → API Keys |
| **Google(Gemini)** | [ai.google.dev](https://ai.google.dev) → API Key |


---

## 三、安装 OpenClaw

### 3.1 Windows（PowerShell）

打开 PowerShell（管理员权限），执行：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

安装脚本会自动检测系统、安装 Node（如未安装）、安装 OpenClaw 并启动初次配置向导。

或者手动通过 npm 安装：

```powershell
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

### 3.2 macOS / Linux / WSL2

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### 3.3 Docker（服务器部署）

```bash
docker run -d --name openclaw \
  -v ~/.openclaw:/root/.openclaw \
  -p 18789:18789 \
  ghcr.io/openclaw/openclaw:latest
```

---

## 四、初始化配置（Onboarding）

安装完成后运行：

```bash
openclaw onboard --install-daemon
```

向导会依次询问：

1. **选择模型供应商** — 输入 `deepseek` / `anthropic` / `openai` 等
2. **输入 API Key** — 粘贴你的 API Key
3. **选择默认模型** — 如 `deepseek-v4-flash`
4. **设置 Gateway 端口** — 默认 `18789`
5. **配置自动启动** — 推荐设为开机自启

`--install-daemon` 参数会将 Gateway 注册为系统服务（macOS LaunchAgent / Linux systemd / Windows Scheduled Task），实现开机自启。

---

## 五、验证安装

```bash
# 确认 CLI 可用
openclaw --version

# 检查 Gateway 状态
openclaw gateway status

# 打开控制台
openclaw dashboard
```

浏览器访问 `http://127.0.0.1:18789`，看到 Control UI 界面即为安装成功。

在聊天框发送第一条消息，如果收到 AI 回复，说明模型连接正常。

---

## 六、连接聊天渠道

Control UI 适合桌面端调试，日常使用建议连接手机上的聊天应用。

### 6.1 微信

需要安装 [OpenClaw 微信插件](https://github.com/Tencent/openclaw-weixin)。


快速开始：
```终端
npx -y @tencent-weixin/openclaw-weixin-cli install
```

扫码登录：
```终端
openclaw channels login --channel openclaw-weixin
```

详见[README.CN.md](https://github.com/Tencent/openclaw-weixin/blob/main/README.zh_CN.md)

### 6.2 Telegram

1. 在 [@BotFather](https://t.me/BotFather) 创建 Bot，获取 Token
2. 配置：

```json5
{
  channels: {
    telegram: {
      enabled: true,
      botToken: "123456:ABC-DEF1234ghikl",
      allowFrom: ["@你的用户名"]
    }
  }
}
```

### 6.3 Discord

1. 在 [Discord Developer Portal](https://discord.com/developers) 创建 Bot
2. 配置 Token 并邀请 Bot 到服务器
3. 配置：

```json5
{
  channels: {
    discord: {
      enabled: true,
      token: "你的Bot Token"
    }
  }
}
```

---

## 七、基础配置

配置文件位于 `~/.openclaw/openclaw.json`（JSON5 格式，支持注释和尾逗号）。

### 7.1 工作区路径

```json5
{
  agents: {
    defaults: {
      workspace: "~/.openclaw/workspace"
    }
  }
}
```

### 7.2 调整模型

```json5
{
  agents: {
    defaults: {
      model: "deepseek/deepseek-v4-flash"
    }
  }
}
```

### 7.3 启用网络搜索

```json5
{
  plugins: {
    entries: {
      brave: {
        config: {
          webSearch: {
            apiKey: "你的API Key"
          }
        }
      }
    }
  }
}
```

### 7.4 运行定时任务

```bash
# 设置每天 8:00 的提醒
openclaw cron add \
  --schedule "0 8 * * *" \
  --tz "Asia/Shanghai" \
  --message "提醒晨：现在该吃药了"
```

---

## 八、常用命令

| 命令 | 说明 |
|------|------|
| `openclaw gateway status` | 查看 Gateway 状态 |
| `openclaw gateway restart` | 重启 Gateway |
| `openclaw gateway stop` | 停止 Gateway |
| `openclaw dashboard` | 打开控制台 |
| `openclaw config get <字段>` | 读取配置 |
| `openclaw config set <字段> <值>` | 写入配置 |
| `openclaw doctor` | 诊断检查 |
| `openclaw onboard` | 重新运行配置向导 |
| `openclaw update` | 更新 OpenClaw |

---

## 九、安装 Skills（可选）

Skills 是社区能力模块。在 Control UI 的 Skills 页面浏览安装，或通过 CLI：

```bash
# 列出可用 Skills
openclaw skills list

# 安装指定 Skill
openclaw skills install <skill名称>
```

---

## 十、故障排查

### `openclaw: command not found`

npm 全局 bin 目录未在 PATH 中。解决：

**Windows：** 将 `%APPDATA%\npm` 添加到系统环境变量 PATH 中。

**macOS / Linux：**
```bash
echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Gateway 启动失败

```bash
openclaw doctor          # 诊断问题
openclaw gateway logs    # 查看日志
```

常见原因：
- 端口 18789 被占用：修改 `gateway.port` 配置
- API Key 无效：检查 `openclaw onboard` 中的配置
- Node 版本过低：升级到 Node 22.19+

### 模型不回复

1. 确认 API Key 正确且未过期
2. 确认账户余额充足
3. 检查 `~/.openclaw/openclaw.json` 中 `agents.defaults.model` 配置是否正确
4. 查看日志：`openclaw gateway logs`

---

## 进阶参考

- [官方文档](https://docs.openclaw.ai)
- [GitHub 仓库](https://github.com/openclaw/openclaw)
- [配置参考](https://docs.openclaw.ai/gateway/configuration-reference)
- [所有支持的渠道](https://docs.openclaw.ai/channels)
- [安全指南](https://docs.openclaw.ai/security)
