# LangChain 项目结构说明

> 如何组织你的 LangChain 项目

---

## 📁 推荐项目结构

```
my-langchain-project/
├── .env                      # 环境变量（不要提交到 Git）
├── README.md                 # 项目说明
├── requirements.txt          # Python 依赖
├── config/
│   └── settings.py          # 配置文件
├── src/
│   ├── __init__.py
│   ├── models.py            # LLM 配置
│   ├── tools.py             # 自定义工具
│   ├── agents.py            # Agent 配置
│   ├── chains.py            # 链配置
│   └── utils.py             # 通用工具函数
├── data/
│   ├── input/               # 输入数据
│   │   └── documents.txt
│   └── output/              # 输出结果
├── docs/                    # 文档
│   └── api/                 # API 文档
├── tests/                   # 测试文件
│   ├── test_agent.py
│   └── test_tools.py
├── scripts/
│   ├── train.py             # 训练脚本
│   └── deploy.py            # 部署脚本
└── .gitignore
```

---

## 📝 文件说明

### 1. 环境变量文件（.env）

```bash
# OpenAI API
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
OPENAI_MODEL=gpt-4

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# LangSmith
LANGSMITH_API_KEY=ls-xxxxxxxxxxxxx
LANGSMITH_TRACING=true
LANGSMITH_PROJECT=my-project

# 数据库
DATABASE_URL=postgresql://user:pass@localhost/db

# SMTP 邮件
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**重要：**
- ✅ `.env` 不要提交到 Git
- ✅ 使用 `.gitignore` 排除
- ✅ 敏感信息不要硬编码

### 2. 配置文件（config/settings.py）

```python
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """应用配置"""

    # OpenAI
    openai_api_key: str = ""
    openai_model: str = "gpt-4"

    # Anthropic
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-3-opus"

    # LangSmith
    langsmith_api_key: str = ""
    langsmith_tracing: bool = True
    langsmith_project: str = "default"

    # 数据库
    database_url: str = "sqlite:///data.db"

    # 其他
    temperature: float = 0.7
    max_tokens: int = 1024

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
```

### 3. 模型配置（src/models.py）

```python
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from src.config.settings import settings

def get_openai_model():
    """获取 OpenAI 模型"""
    return ChatOpenAI(
        model=settings.openai_model,
        temperature=settings.temperature,
        api_key=settings.openai_api_key
    )

def get_anthropic_model():
    """获取 Anthropic 模型"""
    return ChatAnthropic(
        model=settings.anthropic_model,
        temperature=settings.temperature,
        api_key=settings.anthropic_api_key
    )
```

### 4. 工具配置（src/tools.py）

```python
from langchain.tools import tool
from src.config.settings import settings

@tool
def search_tool(query: str) -> str:
    """搜索工具"""
    # 实现搜索逻辑
    return f"搜索结果：{query}"

@tool
def database_query_tool(sql: str) -> str:
    """数据库查询工具"""
    # 实现查询逻辑
    return f"查询结果：{sql}"

# 工具列表
TOOLS = [
    search_tool,
    database_query_tool
]
```

### 5. Agent 配置（src/agents.py）

```python
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_openai import ChatOpenAI
from src.models import get_openai_model
from src.tools import TOOLS

def create_agent():
    """创建 Agent"""
    llm = get_openai_model()
    agent = create_tool_calling_agent(llm, TOOLS)

    executor = AgentExecutor(
        agent=agent,
        tools=TOOLS,
        verbose=True,
        handle_parsing_errors=True
    )

    return executor
```

### 6. 链配置（src/chains.py）

```python
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from src.models import get_openai_model

def create_qa_chain(vectorstore):
    """创建问答链"""
    llm = get_openai_model()
    return RetrievalQA.from_chain_type(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        return_source_documents=True
    )
```

### 7. 主程序（main.py）

```python
import os
from dotenv import load_dotenv
from src.config.settings import settings
from src.agents import create_agent
from src.utils import setup_logging

# 加载环境变量
load_dotenv()

# 设置日志
setup_logging()

# 初始化 Agent
agent = create_agent()

# 主函数
def main():
    print("欢迎使用智能助手！")
    while True:
        user_input = input("你：")
        if user_input.lower() in ['exit', 'quit', '退出']:
            break
        result = agent.invoke({"input": user_input})
        print("助手：", result['output'])

if __name__ == "__main__":
    main()
```

---

## 🚀 快速启动

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env，填入你的 API Key
```

### 3. 运行

```bash
python main.py
```

---

## 📦 requirements.txt

```txt
# LangChain
langchain>=0.1.0
langchain-openai>=0.0.5
langchain-anthropic>=0.1.0
langchain-community>=0.0.10

# 向量数据库
chromadb>=0.4.0
faiss-cpu>=1.7.0

# 数据库
sqlalchemy>=2.0.0

# 工具
python-dotenv>=1.0.0
requests>=2.31.0

# 开发工具
pytest>=7.0.0
black>=23.0.0
flake8>=6.0.0
```

---

## 🔧 最佳实践

### 1. 环境隔离

```bash
# 开发环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 生产环境
pip install -r requirements.txt
```

### 2. 配置管理

```python
# config/settings.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    env_file = ".env"
    class Config:
        env_file_encoding = "utf-8"
```

### 3. 日志记录

```python
# src/utils.py
import logging

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('app.log'),
            logging.StreamHandler()
        ]
    )
```

### 4. 错误处理

```python
try:
    result = agent.invoke({"input": user_input})
except Exception as e:
    logging.error(f"执行错误：{e}")
    result = "抱歉，我出错了。"
```

---

## 📊 项目管理

### Git 提交规范

```bash
# 提交信息格式
feat: 添加新的工具
fix: 修复 Agent 循环问题
docs: 更新 README
test: 添加测试用例
refactor: 重构代码结构
```

### 版本控制

```bash
# 打标签
git tag -a v1.0.0 -m "First release"
git push origin v1.0.0
```

---

## 🎯 模块化开发

### 1. 按功能分模块

```
src/
├── models/        # 模型配置
├── tools/         # 工具定义
├── agents/        # Agent 逻辑
├── chains/        # 链配置
├── memory/        # 记忆管理
├── retrieval/     # 检索逻辑
└── utils/         # 通用工具
```

### 2. 单一职责

每个模块只做一件事：
- `models.py` - 只负责模型配置
- `tools.py` - 只负责工具定义
- `agents.py` - 只负责 Agent 逻辑

---

## 📚 文档规范

### README.md

```markdown
# 项目名称

简短描述项目功能

## 安装

## 配置

## 使用

## API 参考

## 许可证
```

### 代码注释

```python
def create_agent():
    """
    创建智能 Agent

    返回：
        AgentExecutor: 配置好的 Agent 执行器
    """
    # 实现
```

---

## 🧪 测试

### 测试示例（tests/test_agent.py）

```python
import pytest
from src.agents import create_agent

def test_agent_basic():
    """测试 Agent 基础功能"""
    agent = create_agent()
    result = agent.invoke({"input": "测试问题"})
    assert result is not None
    assert "output" in result
```

---

## 📈 监控

### LangSmith 集成

```python
import os
from src.config.settings import settings

# 在代码开始处
if settings.langsmith_tracing:
    os.environ["LANGSMITH_API_KEY"] = settings.langsmith_api_key
    os.environ["LANGSMITH_TRACING"] = "true"
    os.environ["LANGSMITH_PROJECT"] = settings.langsmith_project
```

---

## 💡 进阶优化

### 1. 使用 FastAPI 提供服务

```python
from fastapi import FastAPI
from src.agents import create_agent

app = FastAPI()
agent = create_agent()

@app.post("/chat")
async def chat(input: str):
    result = agent.invoke({"input": input})
    return {"output": result['output']}
```

### 2. 使用 Docker 部署

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "main.py"]
```

---

## 📖 参考资源

- [LangChain 文档](https://python.langchain.com/docs/)
- [项目结构最佳实践](https://github.com/langchain-ai/langchain/tree/master/examples)
- [Python 项目模板](https://github.com/realpython/python-project-template)

---

*最后更新：2026-04-01*