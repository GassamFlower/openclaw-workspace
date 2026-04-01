# 06 - 自动化工作流

> 使用定时任务、Webhook、自动化脚本让 OpenClaw 自动化

## 🤖 自动化概览

OpenClaw 支持多种自动化方式：

| 功能 | 说明 | 使用场景 |
|------|------|----------|
| **Cron Jobs** | 定时任务 | 每天提醒、定时报告 |
| **Webhooks** | HTTP 回调 | 外部系统触发 |
| **Hooks** | 自定义钩子 | 特定事件触发 |
| **Background Tasks** | 后台任务 | 长时间运行的任务 |

---

## ⏰ Cron Jobs 定时任务

### 基本用法

```bash
# 添加定时任务（每天 9:00 AM）
openclaw cron add --schedule "0 9 * * *" \
  --text "reminder: 每天早上9点提醒我查看邮件"

# 列出所有任务
openclaw cron list

# 查看任务运行历史
openclaw cron runs <job-id>

# 立即运行任务
openclaw cron run <job-id>

# 禁用/启用任务
openclaw cron update <job-id> --enabled false

# 删除任务
openclaw cron remove <job-id>
```### 高级配置

```json
{
  "cron": {
    "jobs": [
      {
        "name": "daily-report",
        "schedule": "0 9 * * *",
        "payload": {
          "kind": "systemEvent",
          "text": "reminder: 每天早上9点提醒我查看日报"
        },
        "enabled": true
      },
      {
        "name": "weekly-summary",
        "schedule": {
          "kind": "cron",
          "expr": "0 9 * * 1",
          "tz": "Asia/Shanghai"
        },
        "payload": {
          "kind": "systemEvent",
          "text": "summary: 本周工作总结"
        }
      }
    ]
  }
}
```### 每隔一段时间执行

```bash
# 每 1 小时执行一次
openclaw cron add --schedule "every:1h" \
  --text "healthcheck: 检查系统健康状态"
```---

## 🔗 Webhooks

### 创建 Webhook

```bash
# 添加 Webhook
openclaw webhook add \
  --url "https://your-server.com/webhook" \
  --events "message,reaction" \
  --secret "your-secret-key"

# 列出所有 Webhooks
openclaw webhook list

# 测试 Webhook
openclaw webhook test <webhook-id>
```### 配置示例

```json
{
  "webhooks": {
    "message-processor": {
      "url": "https://api.example.com/submit",
      "events": ["message.created", "message.updated"],
      "secret": "webhook-secret",
      "headers": {
        "Authorization": "Bearer xxx"
      }
    }
  }
}
```### 接收 Webhook 回调

OpenClaw Gateway 提供 API 端点：

```bash
# 接收消息 Webhook
curl -X POST http://localhost:18789/api/webhooks/message \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello", "channel":"telegram"}'
```---

## 🎣 Hooks 自定义钩子

### 注册 Hook

```bash
# 注册本地 Hook 脚本
openclaw hook add \
  --name "on-message" \
  --path "/path/to/hook.js" \
  --events "message.received"

# 列出 Hooks
openclaw hook list
```### Hook 脚本示例

```javascript
// on-message.js
module.exports = async (event) => {
  console.log('收到消息:', event.text);

  // 发送回复
  await fetch('http://localhost:18789/api/message', {
    method: 'POST',
    body: JSON.stringify({
      sessionKey: event.sessionKey,
      text: `我收到了你的消息: ${event.text}`
    })
  });
};
```---

## 🔄 Background Tasks 后台任务

### 创建后台任务

```bash
# 运行长时间任务
openclaw task run \
  --name "backup-database" \
  --command "pg_dump database > backup.sql" \
  --timeout 3600 \
  --auto-restart
```### 任务管理

```bash
# 列出运行中的任务
openclaw task list

# 停止任务
openclaw task stop <task-id>

# 查看任务日志
openclaw task logs <task-id>
```---

## 📧 Gmail 集成

### 设置 PubSub

```bash
# 启用 Gmail PubSub
openclaw cron add \
  --schedule "every:5m" \
  --text "gmail: 检查未读邮件"
```### 配置示例

```json
{
  "automation": {
    "gmail": {
      "pubsub": {
        "subscription": "projects/myproject/subscriptions/gmail-sub"
      }
    }
  }
}
```---

## 📊 Polls 轮询任务

### 轮询外部 API

```bash
# 每 10 分钟轮询一次状态
openclaw cron add \
  --schedule "every:10m" \
  --text "poll: 检查系统状态"
```### 轮询配置

```json
{
  "polls": {
    "server-status": {
      "url": "https://api.example.com/status",
      "interval": 600000,  // 10 分钟
      "retry": 3
    }
  }
}
```---

## ⚙️ Standing Orders 常规指令

### 设置默认行为

```bash
# 设置默认回复方式
openclaw config set standing-orders.reply "always"
```### 配置示例

```json
{
  "standingOrders": {
    "reply": {
      "always": true,
      "typingIndicators": true
    }
  }
}
```---

## 🔍 调试自动化

### 查看 Cron 运行日志

```bash
# 实时查看 Cron 日志
openclaw cron runs <job-id> --follow
```### 测试任务

```bash
# 手动触发测试
openclaw cron run <job-id> --dry-run
```---

## 常见问题

### Q: Cron 任务不执行？

**A**: 检查：
- Gateway 是否运行：`openclaw gateway status`
- 任务是否启用：`openclaw cron list`
- 日志查看：`openclaw cron runs <job-id>`

### Q: Webhook 收不到回调？

**A**: 检查：
- Gateway 日志
- URL 是否可访问
- 网络连接

---

## 下一步？

- 🕐 [Cron vs Heartbeat](cron-vs-heartbeat.md)
- 🔗 [Webhook API](../13-API与开发/Webhook-API.md)
- 🐛 [故障排查](../12-故障排查/README.md)

---

*本章节基于 docs.openclaw.ai/automation/* 等文档*