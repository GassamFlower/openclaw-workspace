# 07 - 工具与插件

> 使用内置工具和自定义插件扩展 OpenClaw 的功能

## 🛠️ 内置工具列表

| 工具 | 功能 | 使用场景 |
|------|------|----------|
| **Web Search** | 网页搜索 | 获取最新信息 |
| **Web Fetch** | 网页抓取 | 抓取特定页面 |
| **Exec** | 执行命令 | 运行脚本、Shell |
| **PDF** | PDF 处理 | 读取 PDF 文件 |
| **TTS** | 文字转语音 | 语音输出 |
| **Image Generation** | 图片生成 | 创建视觉内容 |
| **DuckDuckGo Search** | 搜索 | 快速查找 |
| **Exa Search** | 高级搜索 | 精准信息检索 |
| **Perplexity Search** | AI 搜索 | 智能搜索 |

---

## 🔍 搜索工具

### Web Search（网页搜索）

```json
{
  "tools": {
    "web": {
      "provider": "duckduckgo",
      "count": 5,
      "safeSearch": "moderate"
    }
  }
}
```### 使用示例

Agent 自动调用：
- "搜索最新的 Python 版本" → 调用 Web Search

手动调用（通过 API）：
```bash
curl -X POST http://localhost:18789/api/tools/web/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Python 3.12 新特性"}'
```### DuckDuckGo Search（快速搜索）

```json
{
  "tools": {
    "duckduckgo": {
      "count": 3
    }
  }
}
```### Exa Search（高级搜索）

```json
{
  "tools": {
    "exa": {
      "apiKey": "exa-api-key",
      "count": 5
    }
  }
}
```### Perplexity Search（AI 搜索）

```json
{
  "tools": {
    "perplexity": {
      "apiKey": "pplx-api-key",
      "model": "llama-3-sonar-small-online"
    }
  }
}
```---

## 💻 执行工具（Exec）

### 基本用法

```json
{
  "tools": {
    "exec": {
      "enabled": true,
      "sandbox": true,
      "allowedCommands": ["ls", "cat", "echo", "curl", "git"],
      "timeout": 30000
    }
  }
}
```### 使用示例

Agent 自动执行：
- "列出当前目录的文件" → 调用 `exec` 工具

手动调用：
```bash
# 执行命令
curl -X POST http://localhost:18789/api/tools/exec/run \
  -H "Content-Type: application/json" \
  -d '{"command": "ls -la"}'

# 执行脚本
curl -X POST http://localhost:18789/api/tools/exec/run \
  -H "Content-Type: application/json" \
  -d '{"script": "echo hello && sleep 2"}'
```### 安全限制

```json
{
  "tools": {
    "exec": {
      "sandbox": true,  // 沙箱模式
      "allowedCommands": [
        "ls", "cat", "echo", "grep",
        "curl", "wget", "git",
        "python", "node", "npm"
      ],
      "denyCommands": ["rm", "rm -rf", "sudo"],
      "maxExecutionTime": 60
    }
  }
}
```---

## 📄 文件工具

### PDF 工具

```bash
# 读取 PDF
curl -X POST http://localhost:18789/api/tools/pdf/read \
  -H "Content-Type: application/json" \
  -d '{"path": "/path/to/file.pdf"}'
```### 文件操作

```bash
# 读取文件
openclaw tools read --path /path/to/file.txt

# 写入文件
openclaw tools write --path /path/to/file.txt --content "Hello"
```---

## 🔊 文字转语音（TTS）

```json
{
  "tools": {
    "tts": {
      "provider": "elevenlabs",
      "voice": "nova",
      "speed": 1.0
    }
  }
}
```### 使用示例

```bash
# 转语音
curl -X POST http://localhost:18789/api/tools/tts/generate \
  -H "Content-Type: application/json" \
  -d '{"text": "你好，这是一个测试", "voice": "nova"}'
```### ElevenLabs

需要 API Key：
```json
{
  "tools": {
    "tts": {
      "provider": "elevenlabs",
      "apiKey": "your-elevenlabs-api-key",
      "voice": "nova"
    }
  }
}
```---

## 🎨 图片生成

```json
{
  "tools": {
    "image-generation": {
      "provider": "openai",
      "model": "dall-e-3"
    }
  }
}
```### 使用示例

```bash
# 生成图片
curl -X POST http://localhost:18789/api/tools/image/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "一只可爱的猫", "size": "1024x1024"}'
```### 提供商

- **OpenAI** (DALL-E 3)
- **Stability AI**
- **Midjourney**（通过 API）

---

## 🧩 插件系统

### 插件概览

OpenClaw 支持自定义插件：

| 类型 | 说明 |
|------|------|
| **Channel Plugin** | 新增聊天渠道 |
| **Provider Plugin** | 新增 AI 提供商 |
| **Tool Plugin** | 新增工具 |
| **Skill Plugin** | 自定义技能 |

### 插件目录

```
~/.openclaw/plugins/
├── channels/           # 渠道插件
├── providers/         # 提供商插件
├── tools/             # 工具插件
└── skills/            # 技能插件
```### 安装社区插件

```bash
# 从 ClawHub 安装
openclaw plugin install @openclaw/mattermost

# 列出已安装插件
openclaw plugin list

# 卸载插件
openclaw plugin uninstall @openclaw/mattermost
```### 编写插件（简述）

详见 [插件开发](../15-参考文档/Plugin-Development.md)

---

## 🔗 Skills 技能系统

### 什么是 Skills？

Skills 是预定义的、可重用的任务模板，方便 Agent 快速使用工具。

### 内置 Skills

- **Web Search**：搜索信息
- **File Operations**：文件操作
- **Code Execution**：代码运行

### 创建自定义 Skill

```json
{
  "skills": {
    "weather-report": {
      "description": "获取天气信息",
      "tools": ["web-search"],
      "prompt": "搜索当前天气，并生成简洁报告"
    }
  }
}
```### 使用 Skill

```bash
# 通过 API 调用
curl -X POST http://localhost:18789/api/skills/execute \
  -H "Content-Type: application/json" \
  -d '{"skill": "weather-report"}'
```---

## 📊 工具配置

### 全局工具设置

```json
{
  "tools": {
    "enabled": true,
    "maxUsagePerTurn": 5,
    "timeout": 30000,
    "rateLimit": 60
  }
}
```### 按模型配置

```json
{
  "tools": {
    "gpt4": {
      "maxUsage": 10,
      "enabledTools": ["web-search", "exec"]
    },
    "gpt3": {
      "maxUsage": 5,
      "enabledTools": ["web-search"]
    }
  }
}
```---

## 🐛 调试工具

### 测试工具调用

```bash
# 测试 Web Search
curl -X POST http://localhost:18789/api/tools/web/search/test \
  -H "Content-Type: application/json" \
  -d '{"query": "测试"}'
```### 查看工具调用日志

```bash
# 查看 Gateway 日志
openclaw gateway logs -f | grep "tool"
```---

## 常见问题

### Q: Exec 工具执行失败？

**A**: 检查：
- 命令是否在允许列表中
- 沙箱模式是否启用
- 超时时间是否足够

### Q: 工具调用频率限制？

**A**: 调整 rateLimit 配置

---

## 下一步？

- 🧩 [插件开发](../15-参考文档/Plugin-Development.md)
- 📖 [完整工具列表](../15-参考文档/Tools-Reference.md)
- 🐛 [故障排查](../12-故障排查/README.md)

---

*本章节基于 docs.openclaw.ai/tools/* 等文档*