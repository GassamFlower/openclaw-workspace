# 04 - 知识库管理

> 配置和管理知识库，让 AI 能够从文档中学习

## 📚 知识库概览

Dify 的知识库功能让 AI 能够：

- 📄 上传文档（PDF、TXT、DOCX 等）
- 🧩 自动分块和向量化
- 🔍 智能检索相关内容
- 📊 管理文档状态

---

## 🎯 快速创建知识库

### 步骤

1. 点击 "知识库"
2. 点击 "创建知识库"
3. 输入名称（如 "公司文档"）
4. 选择索引方法（详见下方）
5. 点击 "创建"

---

## 📤 上传文档

### 支持的格式

| 格式 | 说明 |
|------|------|
| **PDF** | PDF 文档 |
| **TXT** | 纯文本 |
| **DOCX** | Word 文档 |
| **Markdown** | Markdown 文件 |
| **HTML** | 网页 |

### 上传步骤

1. 选择文档类型
2. 上传文件
3. 等待处理
4. 测试检索

> **💡 提示**：大文件会自动分块处理

---

## 🧩 文档分块

### 分块策略

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| **自动分块** | 按字符数自动分割 | 通用文档 |
| **自定义分块** | 指定分块大小 | 特定需求 |
| **层次分块** | 支持父子块 | 结构化文档 |

### 分块配置

```json
{
  "chunk_method": "automatic",
  "chunk_size": 500,
  "chunk_overlap": 50
}
```### 分块示例

**原文**：
> Dify 是一个开源的 AI 应用开发平台。它让你能够快速创建、部署和管理 AI 应用。Dify 支持可视化工作流设计、知识库管理和多模型集成。

**分块后**：
```
1. Dify 是一个开源的 AI 应用开发平台。它让你能够快速创建、部署和管理 AI 应用。
2. Dify 支持可视化工作流设计、知识库管理和多模型集成。
```---

## 🔍 检索配置

### 检索策略

| 策略 | 说明 |
|------|------|
| **相似度** | 基于向量相似度 |
| **混合检索** | 向量 + 关键词 |
| **关键词** | 纯关键词匹配 |

### 检索参数

```json
{
  "top_k": 3,              // 返回前 3 个结果
  "score_threshold": 0.7,  // 相似度阈值
  "similarity_threshold": 0.7
}
```### 测试检索

1. 点击 "测试检索"
2. 输入问题
3. 查看返回的文档片段

---

## 📊 管理文档

### 文档状态

| 状态 | 说明 |
|------|------|
| **索引中** | 正在处理 |
| **已完成** | 处理完成 |
| **失败** | 处理失败 |
| **已归档** | 已归档 |

### 文档操作

```bash
# 删除文档
DELETE /v1/knowledge-bases/{knowledge_base_id}/documents/{document_id}

# 更新文档
PUT /v1/knowledge-bases/{knowledge_base_id}/documents/{document_id}

# 查看文档详情
GET /v1/knowledge-bases/{knowledge_base_id}/documents/{document_id}
```---

## 🔐 权限管理

### 访问控制

```json
{
  "permissions": {
    "read": true,
    "write": false,
    "delete": false
  }
}
```### 标签管理

```bash
# 创建标签
POST /v1/knowledge-bases/{id}/tags

# 绑定标签
POST /v1/knowledge-bases/{id}/tag-bindings

# 解绑标签
DELETE /v1/knowledge-bases/{id}/tag-bindings/{tag_id}
```---

## 📖 导入数据

### 从 Notion

1. 配置 Notion API
2. 选择数据源
3. 映射字段
4. 导入

### 从网站

1. 输入 URL
2. 配置抓取规则
3. 导入数据

### 从文本

1. 粘贴文本
2. 配置格式
3. 导入

---

## 🧪 优化建议

### 1. 文档质量

- ✅ 文档清晰、准确
- ✅ 避免过于简短的内容
- ✅ 保持一致性

### 2. 分块策略

- ✅ 根据文档类型选择策略
- ✅ 合理的分块大小（500-1000 字）
- ✅ 适当的重叠（50-100 字）

### 3. 检索设置

- ✅ 调整 top_k 值
- ✅ 设置合适的阈值
- ✅ 定期测试检索效果

### 4. 元数据

```json
{
  "metadata": {
    "author": "张三",
    "date": "2026-01-01",
    "category": "文档"
  }
}
```---

## 📋 API 使用

### 创建知识库

```bash
POST /v1/knowledge-bases
{
  "name": "我的知识库",
  "description": "用于 AI 应用",
  "permission": "only_me"
}
```### 添加文档

```bash
POST /v1/knowledge-bases/{id}/documents
Content-Type: multipart/form-data
file: your-document.pdf
```### 检索

```bash
POST /v1/knowledge-bases/{id}/retrieve
{
  "query": "如何使用 Dify",
  "top_k": 5,
  "score_threshold": 0.7
}
```---

## 常见问题

### Q: 文档处理失败？

**A**: 检查：
- 文件格式是否支持
- 文件大小是否过大
- 网络连接

### Q: 检索结果不准确？

**A**: 优化：
- 调整分块策略
- 提高相似度阈值
- 优化文档内容

### Q: 如何更新文档？

**A**: 上传新版本，系统会自动重新处理

---

## 下一步？

- 🔧 [工作流设计](../05-工作流/README.md)
- 🚀 [应用开发](../03-应用开发/README.md)
- 🐛 [故障排查](../10-故障排查/README.md)

---

*本章节基于 docs.dify.ai/knowledge/* 等文档*