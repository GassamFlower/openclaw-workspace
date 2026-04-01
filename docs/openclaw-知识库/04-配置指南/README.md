# 04 - 配置指南

> 配置 OpenClaw 的各种选项，从基础到高级

## 📍 配置文件位置

| 环境 | 配置文件路径 |
|------|--------------|
| **默认** | `~/.openclaw/openclaw.json` |
| **Docker** | `/root/.openclaw/openclaw.json` |
| **自定义** | 启动时指定：`openclaw gateway start -c /path/to/config.json` |

---

## 📝 基础配置示例

```json
{
  "gateway": {
    "port": 18789,
    "host": "0.0.0.0",
    "logLevel": "info"
  },
  "channels": {
    "whatsapp": {
      "enabled": true,
      "phone": "+1234567890"
    }
  },
  "models": {
    "default": "openai/gpt-4"
  }
}
```

---

## 🔑 1. Gateway 配置

### 端口和访问

```json
{
  "gateway": {
    "port": 18789,              // 控制面板端口
    "host": "0.0.0.0",          // 允许远程访问
    "logLevel": "debug"         // 日志级别：error/warn/info/debug
  }
}
```

### 启动模式

```json
{
  "gateway": {
    "mode": "daemon",           // daemon/systemd（后台运行）
    "autoStart": true           // 自动启动
  }
}
```

---

## 📱 2. 渠道配置

### WhatsApp

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "phone": "+1234567890",
      "groups": {
        "*": {
          "requireMention": true  // 群聊必须 @openclaw
        }
      }
    }
  }
}
```

### Telegram

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
    }
  }
}
```

### Discord

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "botToken": "MTAxNz...",
      "guildId": "123456789",
      "botPrefix": "/"
    }
  }
}
```

---

## 🤖 3. 模型配置

### 使用 OpenAI

```json
{
  "models": {
    "default": "openai/gpt-4",
    "fallback": "openai/gpt-3.5-turbo",
    "openai": {
      "apiKey": "sk-xxx",
      "baseURL": "https://api.openai.com/v1"
    }
  }
}
```

### 使用 Claude

```json
{
  "models": {
    "claude": {
      "apiKey": "sk-ant-xxx",
      "default": "claude-3-5-sonnet"
    }
  }
}
```

### 使用本地模型

```json
{
  "models": {
    "ollama": {
      "host": "http://localhost:11434",
      "default": "glm4"
    }
  }
}
```

---

## 🔐 4. 安全配置

### API Key 保护

```json
{
  "security": {
    "protectApiKey": true,
    "requireAuth": true,
    "allowedIPs": ["127.0.0.1", "10.0.0.0/8"]
  }
}
```

### 请求限流

```json
{
  "security": {
    "rateLimit": {
      "enabled": true,
      "requestsPerMinute": 60,
      "burst": 10
    }
  }
}
```

---

## 🌐 5. 远程访问

### Tailscale

```json
{
  "gateway": {
    "tailscale": {
      "enabled": true,
      "authKey": "tskey-auth-xxx"
    }
  }
}
```

### SSH 端口转发

```bash
ssh -L 18789:localhost:18789 user@your-server
```访问：http://localhost:18789/

---

## 📊 6. 高级配置

### Agent 工作目录

```json
{
  "agent": {
    "workspace": "/path/to/workspace",
    "autoCreate": true
  }
}
```

### 会话管理

```json
{
  "session": {
    "maxAge": 86400,           // 会话最大保留时间（秒）
    "maxHistory": 50,          // 每个会话最多保留消息数
    "pruning": {
      "enabled": true,
      "schedule": "0 0 * * *"  // 每天凌晨执行
    }
  }
}
```

### 媒体处理

```json
{
  "media": {
    "maxFileSize": 10,         // 最大文件大小（MB）
    "allowedTypes": ["image", "audio", "pdf"],
    "storage": "/path/to/media"
  }
}
```

---

## 📋 配置检查

### 运行诊断

```bash
# 检查配置
openclaw doctor

# 验证配置文件
openclaw config validate
```

### 查看当前配置

```bash
# 显示所有配置
openclaw config list

# 显示特定配置
openclaw config get gateway.port
```

---

## 🔧 7. 调试配置

```json
{
  "debug": {
    "logLevel": "debug",
    "logToFile": true,
    "logPath": "/var/log/openclaw",
    "traceTools": true
  }
}
```

---

## 📖 常用命令

```bash
# 查看所有配置
openclaw config --all

# 编辑配置
openclaw config edit

# 重启 Gateway
openclaw gateway restart

# 应用新配置
openclaw gateway reload
```

---

## 下一步？

- 📱 [渠道详细配置](../05-渠道与通信/README.md)
- 🤖 [Agent 配置](../08-Agent与会话/README.md)
- 🔐 [安全设置](../11-安全与权限/README.md)

---

*本章节基于 docs.openclaw.ai/gateway/configuration* 等文档*