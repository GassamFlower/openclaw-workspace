# 03 - 安装部署

> 在各种环境下安装 OpenClaw，从本地到云平台

## 📋 总览

OpenClaw 支持多种安装方式：

| 环境 | 推荐 | 文档 |
|------|------|------|
| **Windows/macOS** | 图形界面 App | [macOS](../09-移动端/macOS-App.md) / [Windows](../09-移动端/Windows.md) |
| **Linux (桌面)** | 命令行 | 本文档 |
| **Docker** | 容器化部署 | [Docker](#docker) |
| **Kubernetes** | 云原生 | [K8s](#kubernetes) |
| **云平台** | 一键部署 | AWS、GCP、DigitalOcean 等 |
| **本地模型** | Ollama | [本地模型](../07-工具与插件/LLM-Task.md#本地模型) |

---

## 方式 1：NPM 安装（推荐）

### Linux/macOS

```bash
# 全局安装
npm install -g openclaw@latest

# 或者指定版本
npm install -g openclaw@1.0.0
```

### Windows

```powershell
# PowerShell
npm install -g openclaw@latest

# 或用 Chocolatey
choco install openclaw
```

---

## 方式 2：Docker（最方便）

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
```

### 生产环境（持久化数据）

```bash
docker run -d \
  --name openclaw \
  --restart unless-stopped \
  -p 18789:18789 \
  -v /path/to/config:/root/.openclaw \
  -v /path/to/logs:/root/.logs \
  -e OPENAI_API_KEY="sk-xxx" \
  openclaw/openclaw:latest
```

### Docker Compose

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
```

启动：
```bash
docker-compose up -d
```

---

## 方式 3：Kubernetes（K8s）

### 简单部署（Helm）

```bash
# 添加 Helm 仓库
helm repo add openclaw https://openclaw.github.io/openclaw/

# 安装
helm install openclaw openclaw/openclaw

# 查看状态
helm status openclaw
```

### 自定义配置

```bash
helm install openclaw openclaw/openclaw \
  --set gateway.port=18789 \
  --set gateway.apiKey=your-key \
  --set persistence.enabled=true \
  --set replicaCount=2
```

---

## 方式 4：云平台一键部署

### DigitalOcean

```bash
# 通过 SSH 部署
ssh root@your-digitalocean-ip
cd ~
curl -sSL https://docs.openclaw.ai/install/digitalocean.md | bash
```

### Render

1. 访问 https://render.com
2. 创建新 Web Service
3. 连接 GitHub 仓库
4. 设置环境变量：
   - `OPENAI_API_KEY` = 你的 API Key
5. 部署

### Railway

1. 访问 https://railway.app
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择 OpenClaw 仓库
4. 添加环境变量
5. 等待部署完成

### AWS/GCP/Azure

详细步骤见各平台文档：
- [AWS](https://docs.openclaw.ai/install/azure.md)
- [GCP](https://docs.openclaw.ai/install/gcp.md)
- [Azure](https://docs.openclaw.ai/install/azure.md)

---

## 方式 5：本地模型（Ollama）

适合不想用 API Key 的场景：

```bash
# 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 下载模型
ollama pull glm4

# 运行 OpenClaw（使用本地模型）
openclaw gateway start --model=ollama/glm4
```

在配置文件中设置：
```json
{
  "models": {
    "default": "ollama/glm4"
  }
}
```

---

## 方式 6：从源码构建

```bash
# 克隆仓库
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# 安装依赖
npm install

# 构建
npm run build

# 运行
npm start
```

---

## 卸载

### NPM 安装

```bash
npm uninstall -g openclaw
```

### Docker

```bash
docker stop openclaw
docker rm openclaw
```

### 云平台

在平台控制面板中删除服务

---

## 验证安装

```bash
# 检查版本
openclaw --version

# 检查 Gateway 状态
openclaw gateway status

# 启动 Gateway
openclaw gateway start

# 访问控制面板
# 浏览器打开 http://127.0.0.1:18789/
```

---

## 常见问题

### Q: Node.js 版本要求？

**A**：Node.js v24（推荐）或 v22.14+ LTS

### Q: Docker 容器启动失败？

**A**：检查：
- 端口 18789 是否被占用
- 环境变量是否正确
- 日志：`docker logs openclaw`

### Q: 如何查看安装日志？

**A**：
```bash
# NPM 安装
npm install -g openclaw --loglevel=verbose

# Docker
docker logs openclaw
```

---

## 下一步？

- 🚀 [快速开始](../02-快速开始/README.md)
- ⚙️ [配置说明](../04-配置指南/README.md)
- 🔐 [安全设置](../11-安全与权限/README.md)

---

*本章节基于 docs.openclaw.ai/install/* 等文档*