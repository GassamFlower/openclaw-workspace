# 08 - Agent 与会话

> 管理多个 AI Agent 和会话，实现专业化分工

## 🤖 Agent 概述

### 什么是 Agent？

Agent 是一个独立的 AI 智能体，有自己的：
- 会话上下文
- 工作空间
- 工具访问权限
- 模型配置

### 为什么需要多个 Agent？

| 场景 | Agent 类型 | 说明 |
|------|------------|------|
| **开发任务** | Code Agent | 专注于编程、调试 |
| **写作任务** | Writer Agent | 专注文案、报告 |
| **搜索任务** | Research Agent | 专注信息收集 |
| **日常助手** | Personal Agent | 日常提醒、日程管理 |

---

## 📊 Agent 配置示例

```json
{
  "agents": {
    "pi": {
      "name": "Pi",
      "description": "通用 AI 助手",
      "model": "openai/gpt-4",
      "enabled": true
    },
    "claude": {
      "name": "Claude",
      "description": "擅长编程",
      "model": "claude/claude-3-5-sonnet",
      "enabled": true,
      "workspace": "/path/to/workspace/claude"
    },
    "local": {
      "name": "Local",
      "description": "本地模型",
      "model": "ollama/glm4",
      "enabled": false
    }
  }
}
```### 启用/禁用 Agent

```bash
# 启用 Claude Agent
openclaw config set agents.claude.enabled true
openclaw gateway restart

# 禁用本地模型
openclaw config set agents.local.enabled false
openclaw gateway restart
```---

## 🔄 多 Agent 路由

### 按名称路由

```json
{
  "multiAgent": {
    "routing": {
      "byName": {
        "claude": "claude",
        "pi": "pi",
        "code": "claude"
      }
    }
  }
}
```### 按内容路由

```json
{
  "multiAgent": {
    "routing": {
      "byContent": {
        "programming": "claude",
        "writing": "gpt4",
        "general": "pi"
      }
    }
  }
}
```### 按时间段路由

```json
{
  "multiAgent": {
    "routing": {
      "bySchedule": {
        "workHours": "claude",    // 9:00-18:00
        "night": "pi"             // 18:00-9:00
      }
    }
  }
}
```### 按渠道路由

```json
{
  "multiAgent": {
    "routing": {
      "byChannel": {
        "telegram": "pi",
        "whatsapp": "claude",
        "discord": "gpt4"
      }
    }
  }
}
```### 混合路由策略

```json
{
  "multiAgent": {
    "routing": {
      "strategies": [
        "byName",
        "byContent",
        "byChannel"
      ]
    }
  }
}
```---

## 📝 会话管理

### 创建会话

```bash
# 创建新会话
openclaw session create --name "coding-task"

# 列出所有会话
openclaw session list
```### 会话配置

```json
{
  "sessions": {
    "coding-task": {
      "agent": "claude",
      "workspace": "/path/to/coding-project",
      "maxHistory": 100,
      "autoSave": true
    }
  }
}
```### 会话状态

```bash
# 查看会话详情
openclaw session show <session-key>

# 删除会话
openclaw session delete <session-key>

# 清空会话历史
openclaw session clear <session-key>
```---

## 🧹 会话清理

### 自动清理

```json
{
  "session": {
    "pruning": {
      "enabled": true,
      "maxAge": 86400,      // 24 小时
      "maxHistory": 50,
      "schedule": "0 0 * * *"
    }
  }
}
```### 手动清理

```bash
# 清理过期会话
openclaw session prune --age 86400

# 清理历史过长的会话
openclaw session prune --history 50
```### 清理策略

```json
{
  "session": {
    "pruning": {
      "keep": [
        "important-session",
        "work-session"
      ],
      "ageThreshold": 86400,
      "historyThreshold": 50
    }
  }
}
```---

## 💾 会话持久化

### 自动保存

```json
{
  "session": {
    "autoSave": true,
    "saveInterval": 300000,  // 5 分钟
    "saveOnClose": true
  }
}
```### 备份会话

```bash
# 备份所有会话
openclaw session backup --output /backup/sessions.json

# 恢复会话
openclaw session restore /backup/sessions.json
```---

## 🔗 Agent 通信

### Agent 间通信

```json
{
  "multiAgent": {
    "communication": {
      "enabled": true,
      "allowCrossAgent": true
    }
  }
}
```### 通过 API 调用其他 Agent

```bash
# 调用 Claude Agent
curl -X POST http://localhost:18789/api/agents/claude/message \
  -H "Content-Type: application/json" \
  -d '{"text": "帮我写个脚本"}'
```---

## 🎯 会话工具

### 会话专属工具

```json
{
  "sessionTools": {
    "coding": {
      "tools": ["exec", "git", "read-file", "write-file"],
      "allowedCommands": ["git", "node", "python"]
    },
    "writing": {
      "tools": ["web-search", "write-file"],
      "allowedCommands": []
    }
  }
}
```---

## 📊 Agent 监控

### 查看活跃 Agent

```bash
# 列出所有 Agent
openclaw agents list

# 查看特定 Agent 状态
openclaw agent status <agent-id>
```### 查看会话统计

```bash
# 查看会话消息统计
openclaw session stats <session-key>
```### 调试模式

```json
{
  "agent": {
    "debug": true,
    "logTools": true,
    "showThoughts": true
  }
}
```---

## 🔒 权限管理

### Agent 权限

```json
{
  "agents": {
    "admin": {
      "permissions": ["*"]  // 所有权限
    },
    "code": {
      "permissions": ["exec", "write", "delete"],
      "denyCommands": ["rm -rf"]
    },
    "viewer": {
      "permissions": ["read", "search"],
      "denyCommands": ["exec"]
    }
  }
}
```---

## 📖 Agent 配置参考

### 完整配置示例

```json
{
  "agents": {
    "pi": {
      "name": "Pi",
      "description": "通用 AI 助手",
      "model": "openai/gpt-4",
      "enabled": true,
      "workspace": "~/.openclaw/agents/pi",
      "tools": ["*"],
      "permissions": ["read", "write", "exec"],
      "maxHistory": 50,
      "autoSave": true
    }
  }
}
```---

## 常见问题

### Q: Agent 不响应？

**A**: 检查：
- Agent 是否启用：`openclaw config get agents.xxx.enabled`
- 模型 API Key 是否正确
- Gateway 日志

### Q: 如何切换 Agent？

**A**: 通过渠道路由配置，或直接在控制面板选择

---

## 下一步？

- 🧠 [Agent 原理](../01-核心概念/Agent-Architecture.md)
- 🌐 [远程访问](../04-配置指南/远程访问.md)
- 🐛 [故障排查](../12-故障排查/README.md)

---

*本章节基于 docs.openclaw.ai/concepts/* 等文档*