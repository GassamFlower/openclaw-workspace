# 07 - 部署运维

> LangGraph 应用的部署和运维

## 🚀 部署方式

| 方式 | 说明 | 适用场景 |
|------|------|----------|
| **Docker** | 容器化部署 | 快速部署、开发环境 |
| **Kubernetes** | K8s 部署 | 生产环境、高可用 |
| **云平台** | 一键部署 | Cloud、Render、Railway |

---

## 🐳 Docker 部署

### 基础 Dockerfile

```dockerfile
# Dockerfile
FROM python:3.10-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制代码
COPY . .

# 启动应用
CMD ["python", "app.py"]
```### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  langgraph:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=sk-xxx
      - DATABASE_URL=postgresql://user:password@db:5432/db
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```### 运行

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f langgraph

# 停止
docker-compose down
```---

## ☁️ 云平台部署

### Cloud Run (Google)

```bash
# gcloud 部署
gcloud run deploy langgraph \
  --source=. \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=1Gi \
  --cpu=1
```### Render

1. 连接 GitHub 仓库
2. 创建 Web Service
3. 添加环境变量
4. 部署

---

## 🔧 环境配置

### 必需环境变量

```bash
# OpenAI API Key
export OPENAI_API_KEY="sk-xxx"

# LangSmith (用于调试)
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="your-api-key"

# 数据库
export DATABASE_URL="postgresql://user:password@localhost/db"

# 检查点配置
export CHECKPOINT_TYPE="postgres"  # postgres, memory
```### 可选环境变量

```bash
# 模型配置
export OPENAI_MODEL="gpt-4"
export OPENAI_TEMPERATURE="0.7"

# 服务器配置
export PORT="8000"
export HOST="0.0.0.0"

# 日志配置
export LOG_LEVEL="info"
```---

## 📊 监控

### 日志查看

```bash
# 实时日志
docker logs -f langgraph

# 查看最近100行
docker logs --tail 100 langgraph
```### 健康检查

```python
# 健康检查端点
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy"}
```### Prometheus 指标

```python
from prometheus_client import Counter, Histogram

# 指标定义
request_counter = Counter('requests_total', 'Total requests')
request_duration = Histogram('request_duration_seconds', 'Request duration')

@app.get("/")
@request_duration.time()
def index():
    request_counter.inc()
    return {"message": "Hello"}
```---

## 🔍 调试

### LangSmith 集成

```python
import os

# 启用 LangSmith
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "your-api-key"
os.environ["LANGSMITH_PROJECT"] = "langgraph-app"
```### 调试节点

```python
def debug_node(state: State) -> State:
    import pprint
    print("\n=== 节点输入 ===")
    pprint.pprint(state)

    # 处理
    result = process(state)

    print("\n=== 节点输出 ===")
    pprint.pprint(result)

    return result
```### 断点续传

```python
from langgraph.checkpoint.postgres import PostgresSaver

# 使用持久化
checkpointer = PostgresSaver.from_conn_string("postgresql://...")
app = workflow.compile(checkpointer=checkpointer)

# 恢复执行
config = {"configurable": {"thread_id": "thread_123"}}
result = app.invoke({"messages": [...]}, config=config)
```---

## 💾 备份

### 数据库备份

```bash
# 备份数据库
docker exec langgraph-db pg_dump -U user dify > backup.sql

# 恢复数据库
docker exec -i langgraph-db psql -U user dify < backup.sql
```### 配置备份

```bash
# 备份配置文件
tar -czf langgraph-config-backup.tar.gz .env config/
```---

## 📈 性能优化

### 1. 缓存

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_function(param: str) -> str:
    # 耗时操作
    return result
```### 2. 连接池

```python
import psycopg2.pool

# 创建连接池
connection_pool = psycopg2.pool.SimpleConnectionPool(
    minconn=5,
    maxconn=20,
    dbname="db",
    user="user",
    password="password",
    host="localhost"
)

# 使用连接池
def query_with_pool(query: str):
    conn = connection_pool.getconn()
    try:
        cursor = conn.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        return result
    finally:
        connection_pool.putconn(conn)
```### 3. 异步处理

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

async def async_process():
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as executor:
        result = await loop.run_in_executor(
            executor, process_sync, data
        )
    return result
```---

## 🛡️ 安全

### API 密钥保护

```bash
# 使用环境变量
export OPENAI_API_KEY="sk-xxx"

# 不要提交到 Git
echo "OPENAI_API_KEY" >> .gitignore
```### HTTPS 配置

```nginx
# Nginx 配置
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8000;
    }
}
```### 访问控制

```python
from fastapi import Security, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

@app.get("/protected")
def protected_route(
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    if credentials.credentials != "your-secret-token":
        raise HTTPException(status_code=403)
    return {"message": "Access granted"}
```---

## 📊 常见问题

### Q: 容器无法启动？

**A**: 检查环境变量和依赖

### Q: 如何查看日志？

**A**: 使用 `docker logs` 或 LangSmith

---

## 下一步？

- 📊 [监控分析](../08-监控分析/README.md)
- 🐛 [故障排查](../09-故障排查/README.md)

---

*本章节基于 docs.langchain.com/docs/langgraph*