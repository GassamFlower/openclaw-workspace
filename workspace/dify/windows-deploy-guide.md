# Dify 本地 Windows 部署详细步骤

> 版本：2026-03-26
> 适用系统：Windows 10/11
> 部署方式：Docker + Docker Compose

---

## 📋 前置条件

在开始之前，确保你的系统满足以下要求：

### 必需条件
- ✅ Windows 10 或 Windows 11
- ✅ Docker Desktop 已安装
- ✅ 至少 4GB 可用内存
- ✅ 至少 10GB 可用磁盘空间

### 可选条件
- ✅ WSL2 已安装（推荐）
- ✅ Git 已安装
- ✅ 足够的权限（安装软件、运行 Docker）

---

## 🚀 安装 Docker Desktop

### 步骤1：下载 Docker Desktop

1. 访问 Docker 官网：https://www.docker.com/products/docker-desktop/
2. 点击 "Download for Windows" 下载安装包
3. 运行安装程序，按提示完成安装

### 步骤2：验证安装

打开 PowerShell 或 CMD，输入：
```bash
docker --version
docker-compose --version
```

**预期输出**：
```
Docker version 24.0.x, build xxx
Docker Compose version v2.x.x
```

---

## 📥 安装 Git（可选但推荐）

### 步骤1：下载 Git

1. 访问 https://git-scm.com/download/win
2. 下载并安装 Git for Windows
3. 安装向导全部使用默认设置

### 步骤2：验证安装

打开 PowerShell，输入：
```bash
git --version
```

---

## 🏃 运行 Dify（Windows 环境）

### ⚠️ 重要提示

**Dify 官方推荐在 Linux 环境运行**，Windows 可能会遇到一些兼容性问题。但我们可以使用 Docker 容器化部署，尽量保证兼容性。

---

## 方案A：使用 Docker Compose（推荐）

### 步骤1：创建工作目录

在任意位置创建 Dify 目录，例如：
```bash
cd C:\Users\你的用户名\Documents
mkdir dify
cd dify
```

### 步骤2：克隆 Dify 代码

```bash
git clone https://github.com/langgenius/dify.git .
```

**注意**：
- `.` 表示在当前目录克隆
- 如果没有 Git，请先安装 Git

### 步骤3：配置 Docker 环境

打开 `docker` 目录下的 `docker-compose.yml` 文件，确保环境变量配置正确。

**关键配置项**：

```yaml
services:
  # API
  api:
    image: langgenius/dify-api:latest
    ports:
      - "5001:5001"
    env_file:
      - .env
    depends_on:
      - db
      - redis
      - weaviate
    restart: always

  # Web App
  web:
    image: langgenius/dify-web:latest
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - api
    restart: always

  # Worker
  worker:
    image: langgenius/dify-worker:latest
    env_file:
      - .env
    depends_on:
      - api
      - redis
    restart: always

  # Crons
  cron:
    image: langgenius/dify-cron:latest
    env_file:
      - .env
    depends_on:
      - api
      - redis
    restart: always

  # PostgreSQL
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: dify
      POSTGRES_USER: dify
      POSTGRES_PASSWORD: dify
    volumes:
      - ./docker/db/data:/var/lib/postgresql/data
    restart: always

  # Redis
  redis:
    image: redis:6-alpine
    volumes:
      - ./docker/redis/data:/data
    restart: always

  # Weaviate（向量数据库）
  weaviate:
    image: cr.weaviate.io/weaviate/weaviate:1.19.0
    command: --host 0.0.0.0 --port 7687 --scheme http
    volumes:
      - ./docker/weaviate:/var/lib/weaviate
    environment:
      AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: 'true'
    restart: always

  # MinIO（对象存储）
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - ./docker/minio/data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    restart: always
```

### 步骤4：修改 .env 文件

在 `docker` 目录下有 `.env` 文件，可以根据需要修改：

```bash
# 编辑 .env 文件
notepad .env
```

**关键配置**：

```env
# API 配置
SECRET_KEY=你的随机密钥（建议用 openssl rand -base64 32 生成）
LOG_LEVEL=INFO

# 数据库配置
DB_USERNAME=dify
DB_PASSWORD=dify
DB_HOST=db
DB_PORT=5432

# Redis 配置
REDIS_HOST=redis
REDIS_PORT=6379

# Weaviate 配置
WEAVIATE_URL=http://weaviate:7687

# MinIO 配置
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
MINIO_ENDPOINT=http://minio:9000

# 应用配置
APP_WEB_URL=http://localhost:3000
APP_API_URL=http://localhost:5001
```

**生成 SECRET_KEY**：

```bash
openssl rand -base64 32
```

### 步骤5：启动 Dify

```bash
cd docker
docker-compose up -d
```

**说明**：
- `up -d` 表示后台运行
- 如果第一次启动，需要下载镜像，会比较慢，请耐心等待

### 步骤6：查看启动状态

```bash
docker-compose ps
```

**预期输出**：

```
NAME                 IMAGE                          STATUS
dify_api             langgenius/dify-api:latest     Up (healthy)
dify_web             langgenius/dify-web:latest     Up
dify_worker          langgenius/dify-worker:latest  Up
dify_cron            langgenius/dify-cron:latest    Up
dify_db              postgres:15                    Up
dify_redis           redis:6-alpine                 Up
dify_weaviate        cr.weaviate.io/weaviate:latest  Up
dify_minio           minio/minio:latest             Up
```

**如果所有容器状态都是 "Up"，说明启动成功！**

---

## 🔍 访问 Dify

### 打开浏览器访问

访问：**http://localhost:3000**

**默认账号**：
- 邮箱：`demo@dify.ai`
- 密码：`dify`

**注意**：
- 第一次登录后会提示修改密码
- 默认密码仅供测试使用，建议修改

---

## 🧹 常用命令

### 查看日志
```bash
docker-compose logs -f api
docker-compose logs -f web
```

### 重启服务
```bash
docker-compose restart
```

### 停止服务
```bash
docker-compose stop
```

### 启动服务
```bash
docker-compose start
```

### 完全停止并删除容器
```bash
docker-compose down
```

### 更新到最新版本
```bash
git pull
docker-compose up -d --build
```

---

## ❓ 常见问题

### 问题1：Docker Desktop 未运行

**错误信息**：`Cannot connect to the Docker daemon`

**解决方法**：
1. 打开 Docker Desktop 应用
2. 等待 Docker 引擎启动
3. 重新运行命令

---

### 问题2：端口已被占用

**错误信息**：`Bind for 0.0.0.0:3000 failed: port is already allocated`

**解决方法**：

修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "8080:3000"  # 改为 8080 端口
```

然后访问：**http://localhost:8080**

---

### 问题3：容器启动失败

**解决方法**：

1. 查看日志：
   ```bash
   docker-compose logs api
   ```

2. 检查环境变量是否配置正确

3. 确保所有端口没有被占用

4. 检查磁盘空间是否充足

---

### 问题4：网络连接问题

**错误信息**：`Error while fetching server API: connection refused`

**解决方法**：

检查网络连接，确保可以访问 Docker Hub（https://hub.docker.com）

---

## 🎯 验证部署成功

### 测试1：访问 Web 界面

1. 打开浏览器访问 http://localhost:3000
2. 使用默认账号登录
3. 应该能看到 Dify 的界面

### 测试2：创建知识库

1. 点击左侧菜单 "知识库"
2. 点击 "创建知识库"
3. 上传一个测试文档（PDF、Word 等）
4. 等待解析完成

### 测试3：测试问答功能

1. 创建一个对话应用
2. 选择刚创建的知识库
3. 上传文档
4. 输入问题测试

---

## 📊 性能优化建议

### 1. 使用 WSL2（推荐）

如果遇到性能问题，建议安装 WSL2：

```powershell
# 在 PowerShell（管理员）中运行
wsl --install
```

然后在 WSL2 中运行 Docker Compose：

```bash
# 在 WSL2 终端中
cd /mnt/c/Users/你的用户名/Documents/dify
docker-compose up -d
```

### 2. 调整 Docker 资源限制

打开 Docker Desktop：
- Settings → Resources
- 调整 CPU、内存、磁盘的限制

### 3. 使用国内镜像（可选）

如果下载 Docker 镜像慢，可以配置镜像加速：

```bash
# 在 Docker Desktop 中配置
Settings → Docker Engine
```

添加：
```json
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://dockerproxy.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```

---

## 🎉 完成！

恭喜！你现在已经在 Windows 上成功部署了 Dify。

**下一步**：

1. ✅ 测试知识库功能
2. ✅ 创建第一个知识库
3. ✅ 学习 Dify 的 API 接口
4. ✅ 开始开发微信小程序接入

**记住**：

- 开发阶段可以使用 localhost 调试
- 正式上云后再修改为 VPS 域名
- 善用 Dify 的 API 文档：https://docs.dify.ai/

---

## 📚 参考资源

- [Dify 官方文档](https://docs.dify.ai/)
- [Dify GitHub](https://github.com/langgenius/dify)
- [Docker 官方文档](https://docs.docker.com/)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)

---

**祝开发顺利！** 🚀