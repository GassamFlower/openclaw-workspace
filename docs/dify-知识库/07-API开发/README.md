# 07 - API 开发

> Dify API 文档和集成指南

## 📡 API 端点总览

| 端点 | 说明 |
|------|------|
| `/v1/chat-messages` | 发送聊天消息 |
| `/v1/chat-completions` | 文本生成 |
| `/v1/workflows/run` | 运行工作流 |
| `/v1/documents` | 文档管理 |
| `/v1/knowledge-bases` | 知识库管理 |
| `/v1/users` | 用户管理 |

---

## 💬 发送聊天消息

### 基本用法

```bash
curl -X POST http://your-dify-instance/v1/chat-messages \
  -H "Authorization: Bearer YOUR-API-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "inputs": {},
    "query": "你好",
    "response_mode": "blocking",
    "conversation_id": ""
  }'
```### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `inputs` | object | ❌ | 输入参数 |
| `query` | string | ✅ | 用户问题 |
| `response_mode` | string | ✅ | 响应模式（blocking/streaming） |
| `conversation_id` | string | ❌ | 对话 ID |

### 返回示例

```json
{
  "task_id": "task_123",
  "conversation_id": "conv_abc",
  "answer": "你好！有什么我可以帮你的吗？",
  "message_id": "msg_123",
  "metadata": {
    "usage": {
      "tokens": 50,
      "units": 1
    }
  }
}
```---

## 📄 文档管理 API

### 创建文档

```bash
POST /v1/knowledge-bases/{knowledge_base_id}/documents
Content-Type: multipart/form-data

file: your-document.pdf
```### 查询文档

```bash
GET /v1/knowledge-bases/{knowledge_base_id}/documents
```### 删除文档

```bash
DELETE /v1/knowledge-bases/{knowledge_base_id}/documents/{document_id}
```---

## 📚 知识库管理 API

### 创建知识库

```bash
POST /v1/knowledge-bases
{
  "name": "我的知识库",
  "description": "用于 AI 应用",
  "permission": "only_me"
}
```### 查询知识库

```bash
GET /v1/knowledge-bases
```### 删除知识库

```bash
DELETE /v1/knowledge-bases/{knowledge_base_id}
```### 检索

```bash
POST /v1/knowledge-bases/{knowledge_base_id}/retrieve
{
  "query": "如何使用 Dify",
  "top_k": 5,
  "score_threshold": 0.7
}
```---

## 🔧 工作流 API

### 运行工作流

```bash
POST /v1/workflows/run
{
  "inputs": {
    "query": "测试问题"
  },
  "user": "user_id"
}
```### 获取运行结果

```bash
GET /v1/workflows/runs/{execution_id}
```### 停止运行

```bash
POST /v1/workflows/{workflow_id}/tasks/{task_id}/stop
```---

## 📋 完整 API 文档

- [Chat API](https://docs.dify.ai/api-reference/chat/)
- [Knowledge API](https://docs.dify.ai/api-reference/knowledge/)
- [Workflow API](https://docs.dify.ai/api-reference/workflow/)
- [Document API](https://docs.dify.ai/api-reference/documents/)
- [OpenAPI 规范](https://docs.dify.ai/openapi_knowledge.json)

---

## 🔑 API Key 获取

1. 进入应用设置
2. 选择 "API"
3. 复制 API Key

---

## 📖 集成示例

### Python 集成

```python
import requests

API_KEY = "your-api-key"
URL = "http://your-dify-instance/v1/chat-messages"

def ask_dify(query):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "inputs": {},
        "query": query,
        "response_mode": "blocking"
    }

    response = requests.post(URL, headers=headers, json=data)
    return response.json()

# 使用
result = ask_dify("你好")
print(result["answer"])
```### JavaScript 集成

```javascript
const API_KEY = 'your-api-key';
const URL = 'http://your-dify-instance/v1/chat-messages';

async function askDify(query) {
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: {},
      query: query,
      response_mode: 'blocking'
    })
  });

  const data = await response.json();
  return data.answer;
}

// 使用
askDify('你好').then(answer => console.log(answer));
```---

## 🔒 错误处理

### 常见错误

| 错误码 | 说明 |
|--------|------|
| `401 Unauthorized` | API Key 无效 |
| `403 Forbidden` | 权限不足 |
| `404 Not Found` | 资源不存在 |
| `429 Too Many Requests` | 请求过于频繁 |

### 错误响应

```json
{
  "code": "authentication_failed",
  "message": "Invalid API key",
  "status": 401
}
```---

## 💡 使用建议

1. **使用环境变量**：保护 API Key
2. **错误处理**：捕获异常
3. **限流**：避免请求过于频繁
4. **日志记录**：记录调用信息

---

## 📞 获取帮助

- 📖 [官方文档](https://docs.dify.ai)
- 💬 [社区论坛](https://forum.dify.ai)

---

*本章节基于 docs.dify.ai/api-reference/* 等文档*