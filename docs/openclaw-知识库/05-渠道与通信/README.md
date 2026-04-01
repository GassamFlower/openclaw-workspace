# 05 - 渠道与通信

> 配置各种聊天软件，让 OpenClaw 支持多渠道

## 📱 支持的渠道列表

| 渠道 | 状态 | 配置难度 | 推荐度 |
|------|------|----------|--------|
| **Telegram** | ✅ 完整 | 🟢 简单 | ⭐⭐⭐⭐⭐ |
| **WhatsApp** | ✅ 完整 | 🟡 中等 | ⭐⭐⭐⭐ |
| **Discord** | ✅ 完整 | 🟡 中等 | ⭐⭐⭐⭐ |
| **iMessage** | ✅ 完整 | 🟠 较难 | ⭐⭐⭐ |
| **Slack** | ✅ 完整 | 🟡 中等 | ⭐⭐⭐ |
| **Signal** | ✅ 完整 | 🟠 较难 | ⭐⭐ |
| **BlueBubbles** | ✅ 完整 | 🟡 中等 | ⭐⭐⭐ |
| **Feishu** | ✅ 完整 | 🟡 中等 | ⭐⭐⭐ |
| **Google Chat** | ✅ 完整 | 🟡 中等 | ⭐⭐⭐ |
| **IRC** | ✅ 完整 | 🟢 简单 | ⭐⭐ |
| **Matrix** | ✅ 完整 | 🟡 中等 | ⭐⭐⭐ |
| **Mattermost** | ✅ 插件 | 🟠 较难 | ⭐⭐⭐ |
| **Microsoft Teams** | ✅ 完整 | 🟡 中等 | ⭐⭐ |
| **QQ Bot** | ✅ 完整 | 🟠 较难 | ⭐⭐⭐ |
| **LINE** | ✅ 完整 | 🟠 较难 | ⭐⭐ |
| **Twitter/X** | ✅ 完整 | 🟡 中等 | ⭐⭐ |
| **WebChat** | ✅ 完整 | 🟢 简单 | ⭐⭐⭐ |

---

## 🎯 快速配置（Telegram - 推荐）

### 步骤 1：创建 Telegram Bot

1. 打开 Telegram
2. 搜索 `@BotFather`
3. 发送 `/newbot`
4. 按提示创建一个机器人

### 步骤 2：获取 Token

`@BotFather` 会给你一个 Token，类似：`123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`

### 步骤 3：配置 OpenClaw

```bash
openclaw config set channels.telegram.token "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
openclaw gateway restart
```

### 步骤 4：测试

在 Telegram 找到你的机器人，发送 "你好"

---

## 🔵 WhatsApp 配置

### 前置条件

- WhatsApp Business 账号
- 电脑端 WhatsApp（Mac/Windows）
- 手机保持联网

### 配置

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "phone": "+1234567890",
      "webhook": "http://localhost:18789/api/whatsapp"
    }
  }
}
```

### 注意事项

- ⚠️ 需要注册 Meta Business Portal
- ⚠️ 免费版有消息限制
- ⚠️ 建议使用 WhatsApp Business API

---

## 🟢 Discord 配置

### 步骤 1：创建 Bot

1. 打开 Discord 开发者门户 https://discord.com/developers/applications
2. 创建应用
3. 添加 Bot
4. 生成 Token

### 步骤 2：邀请到服务器

在 OAuth2 → URL Generator 中设置：
- Scopes: `bot`
- Bot Permissions: `Read Messages/View Channels`, `Send Messages`, `Embed Links`

生成 URL 后在浏览器打开，选择服务器

### 步骤 3：配置

```bash
openclaw config set channels.discord.botToken "MTAxNz..."
openclaw config set channels.discord.botPrefix "/"
openclaw gateway restart
```

---

## 🍎 iMessage 配置

### 前置条件

- macOS 12+
- iCloud 账号
- 端口 12345 开放

### 配置

```json
{
  "channels": {
    "imessage": {
      "enabled": true,
      "appleId": "your@email.com",
      "password": "your-password"
    }
  }
}
```

### 注意事项

- ⚠️ 需要手动验证设备
- ⚠️ 不支持群聊
- ⚠️ 调试模式更稳定

---

## 🔒 Signal 配置

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "phone": "+1234567890",
      "signalPhone": "+1234567890"
    }
  }
}
```

---

## 📋 通用配置选项

### 群聊设置

```json
{
  "channels": {
    "telegram": {
      "groups": {
        "*": {
          "requireMention": true,  // 群聊必须 @openclaw
          "mentionPatterns": ["@openclaw", "/openclaw"]
        },
        "work-chat": {
          "requireMention": false
        }
      }
    }
  }
}
```

### 消息过滤

```json
{
  "channels": {
    "whatsapp": {
      "filters": {
        "blockNumbers": ["+1234567890"],
        "allowGroups": ["*"]
      }
    }
  }
}
```

### 广播组

```json
{
  "channels": {
    "telegram": {
      "broadcastGroups": ["123456789", "987654321"]
    }
  }
}
```

---

## 🔄 路由配置

### 按渠道路由

```json
{
  "channelRouting": {
    "telegram": "claude",
    "whatsapp": "gpt4",
    "default": "pi"
  }
}
```

### 按时间段路由

```json
{
  "channelRouting": {
    "whatsapp": {
      "schedule": {
        "workHours": ["gpt4"],
        "night": ["pi"]
      }
    }
  }
}
```

---

## 📊 管理多个渠道

### 查看活跃渠道

```bash
openclaw gateway status --channels
```### 启用/禁用渠道

```bash
# 禁用 WhatsApp
openclaw config set channels.whatsapp.enabled false
openclaw gateway restart

# 启用
openclaw config set channels.whatsapp.enabled true
openclaw gateway restart
```---

## 🔍 常见问题

### Q: Telegram 机器人不响应？

**A**: 检查：
- Gateway 是否运行：`openclaw gateway status`
- Token 是否正确
- 网络是否通畅

### Q: 如何测试渠道是否正常？

**A**:
```bash
# 测试 WhatsApp
curl -X POST http://localhost:18789/api/whatsapp/test

# 测试 Telegram
curl -X POST http://localhost:18789/api/telegram/test
```---

## 下一步？

- 📱 [移动端配置](../09-移动端/README.md)
- ⚙️ [配置指南](../04-配置指南/README.md)
- 🔧 [故障排查](../12-故障排查/README.md)

---

*本章节基于 docs.openclaw.ai/channels/* 等文档*