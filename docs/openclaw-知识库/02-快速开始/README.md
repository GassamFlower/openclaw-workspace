# 02 - 快速开始

> 5 分钟上手 OpenClaw，从安装到第一个消息

## 🎯 目标

在 5 分钟内运行起 OpenClaw，并从聊天软件收到第一条 AI 回复

## 📋 前置要求

- **Node.js**：v24（推荐）或 v22.14+
- **API Key**：从 AI 提供商获取（OpenAI、Claude、Ollama 等）
- **5 分钟**：不骗你，真的很快

---

## 步骤 1：安装 OpenClaw

```bash
# 全局安装最新版
npm install -g openclaw@latest
```

**验证安装**：
```bash
openclaw --version
```

---

## 步骤 2：初始化配置

```bash
# 快速配置向导
openclaw onboard
```

这个命令会引导你：
1. 选择聊天渠道（Telegram、Discord、WhatsApp 等）
2. 输入 API Key
3. 设置工作目录（默认：`~/.openclaw`）

> **💡 小提示**：如果只想快速体验，选 **Telegram**（最简单，不需要手机号）

---

## 步骤 3：启动 Gateway

```bash
# 启动服务
openclaw gateway start
```

**查看日志**：
```bash
openclaw gateway logs -f
```

看到 `Gateway ready` 就说明启动成功了！

---

## 步骤 4：打开控制面板

在浏览器打开：
```
http://127.0.0.1:18789/
```

你会看到一个简洁的 Dashboard，可以：
- 📱 查看所有会话消息
- ⚙️ 配置参数
- 📊 看系统状态

---

## 步骤 5：发送第一条消息

### 方式 A：通过聊天软件（推荐）

如果你配置了 Telegram：
1. 打开 Telegram
2. 找到 `@openclaw` 等机器人
3. 发送："你好"

### 方式 B：通过控制面板

1. 打开 http://127.0.0.1:18789/
2. 在输入框发送："你好"
3. 按回车

---

## ✅ 验证成功

如果 AI 回复你了，恭喜！🎉

- **第一次回复可能慢**：Gateway 需要初始化模型
- **看不到回复**：检查 Gateway 日志

---

## 📱 快速体验移动端（可选）

如果你有 iPhone 或 Android：

1. 下载对应 App（iOS/Android）
2. 扫描控制面板的二维码配对
3. 用手机发消息试试

---

## 常见问题

### Q: 为什么 Telegram 机器人不回复？

**A**: 检查：
- Gateway 是否在运行：`openclaw gateway status`
- API Key 是否正确
- 网络是否畅通（有些地区需要代理）

### Q: 能用手机号发消息吗？

**A**: 不直接支持。需要配置 Telegram、Discord、WhatsApp 等渠道。详见 [渠道配置](../05-渠道与通信/README.md)

### Q: 需要一直开着电脑吗？

**A**: 不需要！启动 Gateway 后可以关闭终端，Gateway 会作为系统服务运行（macOS/Windows 有图形界面版本）

---

## 下一步？

现在你已经跑起来了，想深入了解：

- 🔧 [详细安装](../03-安装部署/README.md)
- 📱 [移动端配置](../09-移动端/README.md)
- ⚙️ [配置说明](../04-配置指南/README.md)
- 🌐 [远程访问](../04-配置指南/README.md#远程访问)

---

*本章节基于 docs.openclaw.ai/start/* 等文档*