# 06 - 部署运维

> 在各种环境下部署 Dify

## 🌐 部署方式

| 方式 | 说明 | 适用场景 |
|------|------|----------|
| **Docker** | 最简单、最灵活 | 个人使用、开发 |
| **Docker Compose** | 包含完整环境 | 生产环境 |
| **云平台** | 一键部署 | 快速开始 |
| **自托管** | 从源码部署 | 高度定制 |

---

## 🐳 Docker 部署

### 基础部署

```bash
# 拉取镜像
docker run -d \
  --name dify \
  -p 80:3000 \
  -v dify-data:/app/data \
  langgenius/dify-api:latest

# 访问 http://localhost
```### Docker Compose（推荐）

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  api:
    image: langgenius/dify-api:latest
    container_name: dify-api
    restart: unless-stopped
    ports:
      - "80:3000"
    volumes:
      - ./data:/app/data
    environment:
      - SECRET_KEY=your-secret-key
      - OPENAI_API_KEY=sk-xxx

  worker:
    image: langgenius/dify-worker:latest
    container_name: dify-worker
    restart: unless-stopped
    depends_on:
      - api
```启动：
```bash
docker-compose up -d
```---

## ☁️ 云平台部署

### AWS

1. EC2 创建实例（t3.medium 起）
2. 安装 Docker
3. 运行 Docker Compose

### DigitalOcean

```bash
# 一键部署
curl -sSL https://docs.dify.ai/install/digitalocean.md | bash
```### Render

1. 连接 GitHub 仓库
2. 创建 Web Service
3. 添加环境变量
4. 部署

---

## 📦 本地开发

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/langgenius/dify.git
cd dify

# 安装依赖
docker-compose -f docker-compose.dev.yml up -d
```---

## 🔧 环境配置

### 必需环境变量

```bash
SECRET_KEY=your-secret-key
DB_HOST=postgresql
DB_PORT=5432
DB_USERNAME=dify
DB_PASSWORD=your-db-password
DB_DATABASE=dify
REDIS_HOST=redis
REDIS_PASSWORD=your-redis-password
CELERY_BROKER_URL=redis://redis:6379/1
CELERY_RESULT_BACKEND=redis://redis:6379/2
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
```

### 可选环境变量

```bash
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
OLLAMA_HOST=http://localhost:11434
```---

## 📊 数据持久化

### Docker Compose

```yaml
volumes:
  - ./data:/app/data
  - ./logs:/app/logs
```### 云平台

- 持久化磁盘（EBS、Block Storage）
- 定期备份
- 监控存储使用

---

## 🔍 监控与日志

### 查看日志

```bash
# 实时日志
docker logs -f dify

# 特定容器
docker logs -f dify-worker
```### 健康检查

```bash
# 检查容器状态
docker ps

# 测试 API
curl http://localhost/health
```---

## 🔄 更新升级

### Docker

```bash
# 停止容器
docker stop dify

# 拉取新镜像
docker pull langgenius/dify-api:latest

# 启动容器
docker start dify
```### Docker Compose

```bash
# 停止服务
docker-compose down

# 拉取新镜像
docker-compose pull

# 启动服务
docker-compose up -d
```---

## 💾 备份恢复

### 备份

```bash
# 备份数据目录
tar -czf dify-backup-$(date +%Y%m%d).tar.gz ./data

# 备份数据库
docker exec dify-db pg_dump -U dify dify > backup.sql
```### 恢复

```bash
# 恢复数据
tar -xzf dify-backup.tar.gz

# 恢复数据库
docker exec -i dify-db psql -U dify dify < backup.sql
```---

## 🔒 安全配置

### 1. 网络安全

```bash
# 使用防火墙
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw deny 3000/tcp   # 拒绝直接访问
```### 2. HTTPS

使用 Nginx + Let's Encrypt：

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}
```### 3. API Key 保护

- 使用环境变量
- 不要提交到 Git
- 定期轮换

---

## 🐛 常见问题

### Q: 容器启动失败？

**A**: 检查：
- 端口是否被占用
- 环境变量是否正确
- 日志：`docker logs dify`

### Q: 数据库连接失败？

**A**: 检查：
- 数据库容器是否运行
- 环境变量配置
- 网络连接

### Q: 如何迁移数据？

**A**:
1. 停止服务
2. 备份数据
3. 更新配置
4. 启动服务

---

## 📞 获取帮助

- 📖 [官方文档](https://docs.dify.ai)
- 💬 [社区论坛](https://forum.dify.ai)
- 🐛 [GitHub Issues](https://github.com/langgenius/dify/issues)

---

## 下一步？

- 🚀 [应用开发](../03-应用开发/README.md)
- 📚 [知识库管理](../04-知识库管理/README.md)
- 🔧 [工作流设计](../05-工作流/README.md)

---

*本章节基于 docs.dify.ai/self-host/* 等文档*