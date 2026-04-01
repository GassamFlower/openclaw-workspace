# 10 - 云服务部署

> 在各种云平台部署 OpenClaw，从 Docker 到 Kubernetes

## 🌐 支持的云平台

| 平台 | 难度 | 推荐 | 特点 |
|------|------|------|------|
| **Docker** | 🟢 简单 | ⭐⭐⭐⭐⭐ | 最简单，最灵活 |
| **Kubernetes** | 🟠 中等 | ⭐⭐⭐⭐ | 高可用，企业级 |
| **DigitalOcean** | 🟢 简单 | ⭐⭐⭐ | 价格实惠 |
| **Render** | 🟢 简单 | ⭐⭐⭐⭐ | 自动 HTTPS |
| **Railway** | 🟢 简单 | ⭐⭐⭐⭐ | 开发友好 |
| **AWS** | 🟡 中等 | ⭐⭐⭐ | 功能全面 |
| **GCP** | 🟡 中等 | ⭐⭐⭐ | Google 生态 |
| **Azure** | 🟡 中等 | ⭐⭐⭐ | 微软生态 |
| **Hetzner** | 🟢 简单 | ⭐⭐⭐⭐⭐ | 性价比高 |
| **Fly.io** | 🟢 简单 | ⭐⭐⭐⭐ | 全球部署 |

---

## 🐳 Docker 部署

### 基础用法

```bash
# 拉取镜像
docker pull openclaw/openclaw:latest

# 运行
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v ~/.openclaw:/root/.openclaw \
  openclaw/openclaw:latest

# 查看日志
docker logs -f openclaw
```### 生产环境配置

```bash
docker run -d \
  --name openclaw \
  --restart unless-stopped \
  -p 18789:18789 \
  -v /data/openclaw/config:/root/.openclaw \
  -v /data/openclaw/logs:/root/.logs \
  -e OPENAI_API_KEY=sk-xxx \
  -e NODE_ENV=production \
  openclaw/openclaw:latest
```### Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  openclaw:
    image: openclaw/openclaw:latest
    container_name: openclaw
    restart: unless-stopped
    ports:
      - "18789:18789"
    volumes:
      - ./config:/root/.openclaw
      - ./logs:/root/.logs
    environment:
      - OPENAI_API_KEY=sk-xxx
      - NODE_ENV=production
    networks:
      - openclaw-net

networks:
  openclaw-net:
    driver: bridge
```启动：
```bash
docker-compose up -d
```---

## 🚀 DigitalOcean 部署

### 步骤

1. 注册 DigitalOcean 账号
2. 创建 Droplet（推荐 2GB RAM 起）
3. SSH 连接服务器
4. 执行安装脚本

### 安装

```bash
# SSH 连接
ssh root@your-digitalocean-ip

# 安装
curl -sSL https://docs.openclaw.ai/install/digitalocean.md | bash
```### 验证

```bash
openclaw --version
openclaw gateway status
```### 访问控制面板

```bash
# SSH 端口转发
ssh -L 18789:localhost:18789 root@your-digitalocean-ip

# 浏览器打开
http://localhost:18789/
```### 自动启动

```bash
# 设置开机自启
systemctl enable openclaw
systemctl start openclaw
```---

## 🎨 Render 部署

### 步骤

1. 注册 Render 账号
2. 连接 GitHub 仓库
3. 创建 Web Service
4. 添加环境变量
5. 部署

### 配置

**Service Details:**
- Name: `openclaw-gateway`
- Runtime: `Node`

**Environment:**
- `OPENAI_API_KEY`: `sk-xxx`
- `NODE_ENV`: `production`

**Advanced:**
- Max Memory: 2GB
- Max Instances: 1

### 特点

- ✅ 自动 HTTPS
- ✅ 自动备份
- ✅ 零配置部署
- ✅ 免费层可用

---

## 🎪 Railway 部署

### 步骤

1. 注册 Railway 账号
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择 OpenClaw 仓库
4. 添加环境变量
5. 部署

### 配置

```yaml
# railway.yaml
services:
  - name: openclaw
    build:
      dockerfilePath: Dockerfile
      dockerContext: .
    env:
      - OPENAI_API_KEY=sk-xxx
      - NODE_ENV=production
    envFile:
      - .env
    plan: starter
```---

## ☁️ AWS 部署

### EC2 部署

1. 创建 EC2 实例（t3.medium 起）
2. 配置安全组（开放 18789 端口）
3. SSH 连接
4. 安装 OpenClaw

### 安装

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs

# 安装 OpenClaw
npm install -g openclaw@latest

# 启动
openclaw gateway start
```### 使用 CloudFormation

```yaml
Resources:
  OpenClawInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0abcdef1234567890
      InstanceType: t3.medium
      SecurityGroupIds:
        - sg-0123456789abcdef0
      UserData:
        Fn::Base64: !Sub |
          #!/bin/bash
          curl -sSL https://docs.openclaw.ai/install/azure.md | bash
```---

## 🌍 Fly.io 部署

### 步骤

1. 注册 Fly.io 账号
2. 安装 Fly CLI：`curl -L https://fly.io/install.sh | sh`
3. 登录：`fly auth login`
4. 部署：`fly deploy`

### 配置 `fly.toml`

```toml
app = "openclaw-gateway"

[env]
OPENAI_API_KEY = "sk-xxx"
NODE_ENV = "production"

[[services]]
http_port = 18789
process_type = "gateway"

[[services.ports]]
port = 18789
handlers = ["http"]
```### 特点

- ✅ 全球边缘网络
- ✅ 自动扩容
- ✅ 免费层慷慨

---

## 🖥️ Hetzner 部署

### 步骤

1. 注册 Hetzner 账号
2. 创建 Server（CX11 或更高）
3. SSH 连接
4. 安装

### 安装

```bash
# 安装 OpenClaw
curl -sSL https://docs.openclaw.ai/install/hetzner.md | bash

# 配置
nano ~/.openclaw/openclaw.json

# 启动
systemctl start openclaw
systemctl enable openclaw
```### 特点

- ✅ 性价比极高
- ✅ 可选 IPv6
- ✅ 管理面板

---

## 📊 Kubernetes 部署

### Helm Chart

```bash
# 添加 Helm 仓库
helm repo add openclaw https://openclaw.github.io/openclaw/

# 安装
helm install openclaw openclaw/openclaw \
  --namespace openclaw \
  --create-namespace

# 查看状态
helm status openclaw -n openclaw
```### 自定义配置

```bash
helm install openclaw openclaw/openclaw \
  --namespace openclaw \
  --set gateway.port=18789 \
  --set gateway.replicaCount=2 \
  --set persistence.enabled=true
```### 生产配置

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - namespace.yaml
  - gateway-deployment.yaml
  - gateway-service.yaml
  - configmap.yaml
  - secret.yaml
```---

## 🔒 安全建议

### 1. 使用 SSH 端口转发

```bash
# 安全访问远程控制面板
ssh -L 18789:localhost:18789 user@your-server
```### 2. 配置防火墙

```bash
# 只开放必要端口
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP（如果需要）
ufw deny 18789/tcp  # 拒绝外部访问
```### 3. 启用 HTTPS

使用反向代理（Nginx）：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:18789;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```### 4. 定期更新

```bash
# Docker
docker pull openclaw/openclaw:latest
docker stop openclaw
docker rm openclaw
# 重新运行新镜像
```---

## 🐛 常见问题

### Q: 云服务器访问慢？

**A**:
- 使用 CDN 加速
- 检查网络延迟
- 考虑本地部署

### Q: 如何备份数据？

**A**:
```bash
# 备份配置
tar -czf openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw

# 定期备份（Cron）
0 2 * * * tar -czf /backup/openclaw-$(date +\%Y\%m\%d).tar.gz ~/.openclaw
```### Q: 如何恢复数据？

**A**:
```bash
# 解压备份
tar -xzf openclaw-backup.tar.gz

# 重启 Gateway
systemctl restart openclaw
```---

## 📈 性能优化

### 1. 资源配置

```json
{
  "gateway": {
    "maxConnections": 100,
    "maxMemory": 2GB,
    "maxCpu": 2
  }
}
```### 2. 缓存配置

```json
{
  "gateway": {
    "cache": {
      "enabled": true,
      "ttl": 3600,
      "maxSize": 100MB
    }
  }
}
```### 3. 日志管理

```json
{
  "gateway": {
    "logging": {
      "level": "info",
      "rotate": true,
      "maxSize": 50MB,
      "maxFiles": 10
    }
  }
}
```---

## 下一步？

- 🔐 [安全设置](../11-安全与权限/README.md)
- ⚙️ [配置指南](../04-配置指南/README.md)
- 🐛 [故障排查](../12-故障排查/README.md)

---

*本章节基于 docs.openclaw.ai/install/* 等文档*