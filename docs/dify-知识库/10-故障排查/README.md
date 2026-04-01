# 10 - 故障排查

> 常见问题和解决方法

## 🔍 快速诊断

### 查看日志

```bash
# 容器日志
docker logs dify

# 实时日志
docker logs -f dify
```### 健康检查

```bash
# 检查容器状态
docker ps

# 测试 API
curl http://localhost/health
```---

## ❌ 常见问题

### 应用无法启动

**症状**：容器启动失败

**解决方法**：
1. 检查环境变量
2. 查看日志
3. 确认端口未被占用

### AI 不回复

**症状**：发送消息后无回复

**解决方法**：
1. 检查 LLM 配置
2. 验证 API Key
3. 查看节点错误

### 知识库检索失败

**症状**：检索结果不准确

**解决方法**：
1. 检查文档状态
2. 调整分块策略
3. 优化检索参数

---

## 🐛 Docker 问题

### 容器无法启动

```bash
# 查看日志
docker logs dify

# 重新构建
docker-compose up --build -d
```### 数据丢失

```bash
# 检查卷挂载
docker inspect dify

# 确认数据卷存在
ls -la ./data
```---

## 🔌 API 问题

### 401 错误

**原因**：API Key 无效

**解决方法**：
1. 检查 API Key
2. 确认权限

### 429 错误

**原因**：请求过于频繁

**解决方法**：
1. 添加限流
2. 增加等待时间

---

## 💾 数据库问题

### 连接失败

```bash
# 检查数据库容器
docker ps | grep postgres

# 查看日志
docker logs dify-db
```### 数据损坏

```bash
# 备份数据
docker exec dify-db pg_dump -U dify dify > backup.sql

# 恢复数据
docker exec -i dify-db psql -U dify dify < backup.sql
```---

## 📞 获取帮助

- 📖 [官方文档](https://docs.dify.ai)
- 💬 [社区论坛](https://forum.dify.ai)
- 🐛 [GitHub Issues](https://github.com/langgenius/dify/issues)

---

*本章节基于 docs.dify.ai/troubleshooting/* 等文档*