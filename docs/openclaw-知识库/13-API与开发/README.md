# 13 - API 与开发

> OpenClaw 的 API 文档和开发者指南

## 📡 API 端点总览

| 端点 | 方法 | 说明 |
|------|------|------|
| `/` | GET | 健康检查 |
| `/api/messages` | POST | 发送消息 |
| `/api/sessions` | GET/POST | 会话管理 |
| `/api/agents` | GET/POST | Agent 管理 |
| `/api/tools/*` | POST | 工具调用 |
| `/api/config` | GET/PUT | 配置管理 |
| `/api/webhooks` | POST | Webhook 管理 |
| `/api/cron` | POST | Cron 管理 |

---

## 📝 发送消息

### 基本用法

```bash
curl -X POST http://localhost:18789/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "sessionKey": "your-session-key",
    "text": "Hello, OpenClaw!",
    "channel": "telegram"
  }'
```### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `sessionKey` | string | ✅ | 会话标识 |
| `text` | string | ✅ | 消息内容 |
| `channel` | string | ❌ | 渠道标识 |
| `agent` | string | ❌ | 指定 Agent |

### 返回示例

```json
{
  "success": true,
  "messageId": "msg_abc123",
  "timestamp": "2026-04-01T08:00:00Z",
  "response": {
    "text": "Hello! How can I help you today?",
    "agent": "pi"
  }
}
```---

## 📊 会话管理 API

### 创建会话

```bash
curl -X POST http://localhost:18789/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "coding-task",
    "agent": "claude"
  }'
```### 返回示例

```json
{
  "sessionKey": "session_xyz789",
  "name": "coding-task",
  "agent": "claude",
  "createdAt": "2026-04-01T08:00:00Z"
}
```### 查看会话

```bash
curl http://localhost:18789/api/sessions/session_xyz789
```### 删除会话

```bash
curl -X DELETE http://localhost:18789/api/sessions/session_xyz789
```---

## 🤖 Agent API

### 列出所有 Agent

```bash
curl http://localhost:18789/api/agents
```### 调用特定 Agent

```bash
curl -X POST http://localhost:18789/api/agents/pi/message \
  -H "Content-Type: application/json" \
  -d '{
    "text": "写一个 Python 脚本"
  }'
```### 创建 Agent

```bash
curl -X POST http://localhost:18789/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-agent",
    "model": "gpt-4",
    "description": "自定义 Agent"
  }'
```---

## 🔧 工具 API

### 调用工具

```bash
curl -X POST http://localhost:18789/api/tools/exec/run \
  -H "Content-Type: application/json" \
  -d '{
    "command": "ls -la"
  }'
```### 返回示例

```json
{
  "success": true,
  "output": "total 12\ndrwxr-xr-x  2 user user 4096 Apr  1 08:00 .\ndrwxr-xr-x 15 root root 4096 Apr  1 07:00 ..",
  "exitCode": 0,
  "duration": 1250
}
```### Web Search

```bash
curl -X POST http://localhost:18789/api/tools/web/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Python 3.12 新特性"
  }'
```---

## ⚙️ 配置 API

### 获取配置

```bash
curl http://localhost:18789/api/config
```### 更新配置

```bash
curl -X PUT http://localhost:18789/api/config \
  -H "Content-Type: application/json" \
  -d '{
    "models": {
      "default": "claude-3-5-sonnet"
    }
  }'
```---

## 🔄 Webhook API

### 注册 Webhook

```bash
curl -X POST http://localhost:18789/api/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-server.com/webhook",
    "events": ["message.created", "message.updated"],
    "secret": "your-secret-key"
  }'
```### 列出 Webhooks

```bash
curl http://localhost:18789/api/webhooks
```### 删除 Webhook

```bash
curl -X DELETE http://localhost:18789/api/webhooks/webhook-id
```---

## 🕐 Cron API

### 添加 Cron 任务

```bash
curl -X POST http://localhost:18789/api/cron \
  -H "Content-Type: application/json" \
  -d '{
    "schedule": "0 9 * * *",
    "text": "reminder: 每天早上9点提醒"
  }'
```### 列出任务

```bash
curl http://localhost:18789/api/cron
```---

## 🔐 认证

### API Key 认证

```bash
# 使用 API Key 头
curl -X POST http://localhost:18789/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{"text": "Hello"}'
```### JWT 认证

```bash
# 获取 JWT Token
curl -X POST http://localhost:18789/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user",
    "password": "password"
  }'

# 使用 JWT
curl -X POST http://localhost:18789/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{"text": "Hello"}'
```---

## 📊 模型 API

### 列出模型

```bash
curl http://localhost:18789/api/models
```### 查看模型状态

```bash
curl http://localhost:18789/api/models/status
```### 测试模型

```bash
curl -X POST http://localhost:18789/api/models/test \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "message": "Hello"
  }'
```---

## 🐛 错误码

| 错误码 | 说明 |
|--------|------|
| `200 OK` | 请求成功 |
| `400 Bad Request` | 参数错误 |
| `401 Unauthorized` | 未授权 |
| `403 Forbidden` | 禁止访问 |
| `404 Not Found` | 资源不存在 |
| `429 Too Many Requests` | 请求过于频繁 |
| `500 Internal Server Error` | 服务器错误 |

### 错误响应示例

```json
{
  "error": "bad_request",
  "message": "Invalid parameter: sessionKey is required",
  "details": {
    "field": "sessionKey",
    "expected": "string"
  }
}
```---

## 🧩 开发指南

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# 安装依赖
npm install

# 启动开发环境
npm run dev

# 访问 API
http://localhost:18789/
```### 编写插件

详见 [插件开发文档](../15-参考文档/Plugin-Development.md)

### 添加自定义工具

```javascript
// tools/my-tool.js
module.exports = {
  name: "my-tool",
  description: "My custom tool",
  execute: async (params) => {
    // 实现
    return { result: "success" };
  }
};
```---

## 📖 完整文档

- [OpenAPI 规范](https://docs.openclaw.ai/api-reference/openapi.json)
- [GitHub](https://github.com/openclaw/openclaw)
- [Discord 社区](https://discord.com/invite/clawd)

---

*本章节基于 docs.openclaw.ai/gateway/* 等文档*