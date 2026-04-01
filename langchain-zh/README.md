# LangChain 中文知识库

> 通俗易懂的 LLM 应用开发指南

---

## 📚 目录

1. [LangChain 是什么](#langchain-是什么)
2. [核心概念](#核心概念)
3. [快速开始](#快速开始)
4. [核心组件](#核心组件)
5. [实战指南](#实战指南)
6. [最佳实践](#最佳实践)
7. [常见问题](#常见问题)

---

## LangChain 是什么

**一句话解释：**
LangChain 是一个让 LLM（大语言模型）更容易开发应用的框架。

### 为什么要用 LangChain？

想象一下：
- ❌ **不用 LangChain：** 每次调用不同的 LLM，都要重新写代码适配各种 API
- ✅ **用 LangChain：** 统一的接口，随时切换不同的 LLM，一行代码搞定

**核心价值：**
- 🎯 标准化的模型接口（OpenAI、Anthropic、Google 等）
- 🚀 快速搭建 Agent 应用
- 🔗 完善的生态系统（数据库、搜索引擎、文件系统等集成）
- 📊 强大的调试和监控工具

---

## 核心概念

### 1. LLM（大语言模型）
- 就是一个超强的聊天机器人
- LangChain 只是一个"翻译器"，让它更容易用

### 2. Chain（链）
- 把多个步骤串起来
- 比如先查资料 → 再总结 → 再回答

### 3. Agent（智能体）
- **能自己决定下一步做什么**的智能程序
- 可以调用工具、查询数据库、搜索网页等

### 4. Memory（记忆）
- 让 Agent 记住之前的对话
- 可以是简单的历史记录，也可以是向量数据库

### 5. Tools（工具）
- Agent 可以调用的外部功能
- 例如：搜索、计算器、数据库查询、发送邮件等

---

## 快速开始

### 安装

```bash
pip install langchain
```

### 最简单的 Agent 示例

```python
from langchain.agents import create_agent

def get_weather(city: str) -> str:
    """获取城市天气"""
    return f"{city} 今天天气很好！"

# 创建 Agent
agent = create_agent(
    model="claude-sonnet-4-6",
    tools=[get_weather],
    system_prompt="你是一个有用的助手",
)

# 使用
agent.invoke({
    "messages": [{"role": "user", "content": "北京天气怎么样？"}]
})
```

**只需要 10 行代码，就能让 Agent 工作！**

---

## 核心组件

### 🧩 LLM（大语言模型集成）

```python
from langchain_openai import ChatOpenAI

# 统一接口，随时切换模型
llm = ChatOpenAI(model="gpt-4", temperature=0.7)
response = llm.invoke("你好，请介绍一下自己")
```

**支持的模型：**
- OpenAI（GPT-4, GPT-3.5）
- Anthropic（Claude 系列）
- Google（Gemini）
- HuggingFace
- 自定义模型

### 📊 Memory（记忆管理）

**简单内存（保留最近 N 条对话）：**
```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(return_messages=True)
```

**向量数据库记忆（智能检索）：**
```python
from langchain.memory import VectorStoreRetrieverMemory

from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

vectorstore = Chroma(
    embedding_function=OpenAIEmbeddings(),
    persist_directory="./memory"
)
memory = VectorStoreRetrieverMemory(
    retriever=vectorstore.as_retriever()
)
```

### 🔧 Tools（工具集成）

```python
from langchain.tools import tool

@tool
def search(query: str) -> str:
    """搜索相关信息"""
    # 实际的搜索逻辑
    return f"搜索结果：{query}"

tools = [search]
```

### 🤖 Agent 构建

```python
from langchain.agents import create_tool_calling_agent
from langchain.agents import AgentExecutor
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4")

agent = create_tool_calling_agent(llm, tools)

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True
)

result = agent_executor.invoke({
    "input": "帮我查一下最近天气如何"
})
```

---

## 实战指南

### 场景 1：聊天机器人

```python
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory

llm = ChatOpenAI(model="gpt-4")
memory = ConversationBufferMemory(return_messages=True)

conversation = ConversationChain(
    llm=llm,
    memory=memory
)

# 多轮对话
print(conversation.predict("我叫小明"))
print(conversation.predict("我住在北京"))
print(conversation.predict("我叫什么名字？"))
```

### 场景 2：智能问答（带搜索）

```python
from langchain.tools import DuckDuckGoSearchRun
from langchain.agents import create_openai_functions_agent
from langchain_openai import ChatOpenAI

# 工具
search = DuckDuckGoSearchRun()

# Agent
llm = ChatOpenAI(model="gpt-4")
agent = create_openai_functions_agent(llm, [search])

executor = AgentExecutor(agent=agent, tools=[search])

result = executor.invoke({
    "input": "最近有什么科技新闻？"
})
print(result["output"])
```

### 场景 3：文档问答

```python
from langchain_community.document_loaders import TextLoader
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA

# 加载文档
loader = TextLoader("company_manual.txt")
documents = loader.load()

# 创建向量数据库
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

vectorstore = FAISS.from_documents(
    documents,
    OpenAIEmbeddings()
)

# 问答链
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4"),
    retriever=vectorstore.as_retriever()
)

query = "公司的工作时间是多少？"
result = qa_chain.invoke(query)
print(result["result"])
```

### 场景 4：数据分析

```python
import pandas as pd
from langchain.tools import Tool
from langchain.agents import create_agent

def analyze_sales(data_path: str) -> str:
    """分析销售数据"""
    df = pd.read_csv(data_path)
    return f"销售额最高的产品：{df['product'].max()}"

tools = [Tool(
    name="销售分析",
    func=analyze_sales,
    description="分析销售数据的工具"
)]

agent = create_agent(
    model="gpt-4",
    tools=tools,
    system_prompt="你是销售数据分析师"
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "分析 sales.csv"}]
})
print(result["output"])
```

---

## 最佳实践

### ✅ 推荐做法

1. **使用 LangSmith 调试**
   ```bash
   export LANGSMITH_TRACING=true
   export LANGSMITH_API_KEY="your-key"
   ```

2. **合理使用 Memory**
   - 简单对话：`ConversationBufferMemory`
   - 长期记忆：`VectorStoreRetrieverMemory`
   - 定期清理：避免上下文膨胀

3. **选择合适的 Agent 类型**
   - 快速原型：`create_agent` / `create_tool_calling_agent`
   - 复杂工作流：考虑 `LangGraph`

4. **工具命名和描述**
   ```python
   @tool
   def get_weather(city: str) -> str:
       """获取指定城市的天气信息"""
       # 实现
   ```
   **描述要清晰，方便 Agent 理解何时调用**

### ❌ 避免坑

1. **不要把 Agent 当作万能药**
   - 如果只是简单问答，直接用 LLM 更高效
   - Agent 适用于需要调用外部工具的场景

2. **避免过长的上下文**
   - Memory 容量有限
   - 重要信息可以存储到数据库

3. **不要硬编码 API Key**
   ```python
   # ❌ 不好的做法
   llm = ChatOpenAI(api_key="sk-xxx")

   # ✅ 好的做法
   import os
   llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
   ```

---

## 常见问题

### Q1: LangChain 和 LangGraph 有什么区别？

**简单说：**
- **LangChain：** 快速构建 Agent，开箱即用
- **LangGraph：** 更底层的编排框架，适合复杂工作流

**选择建议：**
- 新手/快速开发 → LangChain
- 复杂工作流/自定义编排 → LangGraph

### Q2: 如何选择合适的 Memory？

**场景 1：简单聊天**
```python
from langchain.memory import ConversationBufferMemory
```

**场景 2：需要长期记忆**
```python
from langchain.memory import VectorStoreRetrieverMemory
```

**场景 3：需要临时缓存**
```python
from langchain.memory import SummaryBufferMemory
```

### Q3: Agent 调用工具失败怎么办？

```python
from langchain.agents import AgentExecutor

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    handle_parsing_errors=True,  # 允许错误处理
    verbose=True
)

try:
    result = executor.invoke({"input": "查询天气"})
except Exception as e:
    print(f"错误：{e}")
    # 处理错误
```

### Q4: 如何优化 Agent 性能？

1. **减少工具数量**
2. **使用工具缓存**
3. **合理设置 temperature**
4. **使用 LangSmith 监控性能**

### Q5: LangChain 支持哪些数据库？

| 数据库 | 集成方式 |
|--------|----------|
| PostgreSQL | `SQLDatabaseChain` |
| MongoDB | `MongoDB Atlas` |
| SQLite | `SQLDatabase.from_uri` |
| MySQL | `SQLDatabase.from_uri` |
| Redis | `Redis` |
| 文件系统 | `DirectoryLoader` |

---

## 📖 进阶学习

### 推荐资源

1. **官方文档**
   - [Python LangChain 文档](https://python.langchain.com/docs/)
   - [LangSmith 调试工具](https://docs.langchain.com/langsmith/home)

2. **实战项目**
   - 聊天机器人
   - 文档问答系统
   - 智能助手
   - 数据分析 Agent

3. **社区资源**
   - GitHub: [langchain-ai/langchain](https://github.com/langchain-ai/langchain)
   - Discord: [discord.gg/clawd](https://discord.com/invite/clawd)

### 下一步

1. 理解基础概念
2. 完成一个简单 Agent
3. 学习 Memory 管理
4. 掌握 Tools 集成
5. 使用 LangSmith 调试
6. 尝试 LangGraph 复杂工作流

---

## 🎯 总结

**记住这三点：**
1. LangChain 是让 LLM 更好用的框架
2. Agent = LLM + Tools + Memory
3. 从简单开始，逐步进阶

**开始你的 LLM 应用开发之旅吧！** 🚀

---

*最后更新：2026-04-01*