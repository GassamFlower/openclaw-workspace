# LangChain 快速参考卡片

> 常用代码片段，一查即用

---

## 📦 安装

```bash
pip install langchain langchain-openai langchain-community
```

**完整安装：**
```bash
pip install langchain[all]  # 包含所有常见集成
```

---

## 🔗 基础 LLM 使用

```python
from langchain_openai import ChatOpenAI

# 创建实例
llm = ChatOpenAI(
    model="gpt-4",
    temperature=0,
    api_key="your-api-key"
)

# 调用
response = llm.invoke("你好")
print(response.content)
```

---

## 🧠 Memory（记忆）

```python
from langchain.memory import ConversationBufferMemory

# 简单记忆
memory = ConversationBufferMemory(return_messages=True)

# 基于向量库的记忆
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

vectorstore = FAISS.from_texts(
    texts=["知识1", "知识2"],
    embedding=OpenAIEmbeddings()
)

memory = VectorStoreRetrieverMemory(
    retriever=vectorstore.as_retriever()
)
```

---

## 🛠️ Tools（工具）

```python
from langchain.tools import tool

@tool
def my_tool(param: str) -> str:
    """工具描述"""
    return f"结果：{param}"

tools = [my_tool]
```

---

## 🤖 Agent 构建

### 方式 1：最简单

```python
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4")
agent = create_agent(llm, tools)
result = agent.invoke({"messages": [{"role": "user", "content": "问题"}]})
```

### 方式 2：函数调用

```python
from langchain.agents import create_tool_calling_agent, AgentExecutor

llm = ChatOpenAI(model="gpt-4")
agent = create_tool_calling_agent(llm, tools)
executor = AgentExecutor(agent=agent, tools=tools)

result = executor.invoke({"input": "问题"})
```

### 方式 3：AgentExecutor

```python
from langchain.agents import initialize_agent, AgentType

llm = ChatOpenAI(model="gpt-4")
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

result = agent.run("问题")
```

---

## 📄 文档加载与问答

```python
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain.chains import RetrievalQA

# 加载文档
loader = TextLoader("document.txt")
documents = loader.load()

# 创建向量库
vectorstore = FAISS.from_documents(
    documents,
    OpenAIEmbeddings()
)

# 问答
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4"),
    retriever=vectorstore.as_retriever()
)

result = qa_chain.invoke("问题")
```

---

## 🔍 搜索工具

```python
from langchain.tools import DuckDuckGoSearchRun

search = DuckDuckGoSearchRun()

# 搜索
result = search.run("关键词")
```

---

## 🗄️ 数据库工具

```python
from langchain.utilities import SQLDatabase

# 创建数据库连接
db = SQLDatabase.from_uri("sqlite:///data.db")

# 查询
result = db.run("SELECT * FROM users")
```

---

## 💰 Token 使用统计

```python
from langchain.callbacks import get_openai_callback

with get_openai_callback() as cb:
    result = llm.invoke("问题")
    print(f"Token: {cb.total_tokens}")
    print(f"成本: ${cb.total_cost}")
```

---

## 📊 LangSmith 配置

```python
import os

# 环境变量
os.environ["LANGSMITH_API_KEY"] = "your-key"
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_PROJECT"] = "my-project"
```

---

## 📚 常用模型

| 模型 | 说明 |
|------|------|
| `gpt-3.5-turbo` | 便宜快速，适合简单任务 |
| `gpt-4` | 强大，适合复杂任务 |
| `claude-3-opus` | 长上下文，多语言优秀 |
| `gemini-pro` | Google 模型 |
| `ollama/mistral` | 本地模型 |

---

## 🔧 常用参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `temperature` | 创造性 (0-1) | 0.7 |
| `max_tokens` | 最大输出 Token | 1024 |
| `top_p` | 核采样 | 1.0 |
| `frequency_penalty` | 重复惩罚 | 0.0 |
| `presence_penalty` | 存在惩罚 | 0.0 |

---

## 🎯 常用链

```python
from langchain.chains import (
    ConversationChain,
    LLMChain,
    RetrievalQA,
    StuffDocumentsChain,
    MapReduceDocumentsChain,
    RefineDocumentsChain
)
```

---

## 📋 检查点（Checkpointer）

```python
from langgraph.checkpoint.memory import MemorySaver

# 内存检查点
memory = MemorySaver()

# 在 AgentExecutor 中使用
from langchain.agents import AgentExecutor

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    memory=memory  # 可持久化
)
```

---

## 🎨 系统提示词模板

```python
from langchain.prompts import PromptTemplate

template = """
你是一个专业的 {role}。

任务：{task}

用户问题：{input}

请回答：
"""

prompt = PromptTemplate(
    input_variables=["role", "task", "input"],
    template=template
)

# 使用
response = llm.invoke(prompt.format(
    role="数据分析师",
    task="分析销售数据",
    input="找出销售最高的产品"
))
```

---

## 🚀 批量处理

```python
from langchain.schema import Document

# 批量处理
texts = ["文本1", "文本2", "文本3"]
documents = [Document(page_content=text) for text in texts]

# 创建向量库
vectorstore = FAISS.from_documents(
    documents,
    OpenAIEmbeddings()
)

# 检索
results = vectorstore.similarity_search("查询", k=3)
```

---

## 📊 数据集评估

```python
from langchain.sm import evaluate

# 评估回答质量
evaluator = evaluate(
    prompts=["问题1", "问题2"],
    answers=["回答1", "回答2"]
)

# 获取评分
for q, a, score in evaluator:
    print(f"{q} -> {score}")
```

---

## 🔧 错误处理

```python
from langchain.schema import BaseLLMError

try:
    response = llm.invoke("问题")
except BaseLLMError as e:
    print(f"LLM 错误：{e}")
except Exception as e:
    print(f"其他错误：{e}")
```

---

## 📦 常见集成

### 文件系统

```python
from langchain_community.document_loaders import (
    TextLoader,
    PyPDFLoader,
    CSVLoader,
    ExcelLoader
)
```

### 数据库

```python
from langchain_community.utilities import SQLDatabase

db = SQLDatabase.from_uri("postgresql://user:pass@host/db")
```

### 向量数据库

```python
from langchain_community.vectorstores import (
    FAISS,
    Chroma,
    Pinecone,
    Weaviate
)
```

---

## 💡 性能优化技巧

1. **使用缓存**
   ```python
   from langchain.cache import InMemoryCache

   llm = ChatOpenAI(cache=InMemoryCache())
   ```

2. **批量请求**
   ```python
   from langchain.prompts import ChatPromptTemplate

   prompt = ChatPromptTemplate.from_messages([
       ("system", "你是助手"),
       ("user", "{input}")
   ])

   chain = prompt | llm
   results = chain.batch([{"input": "问题1"}, {"input": "问题2"}])
   ```

3. **流式输出**
   ```python
   for chunk in llm.stream("问题"):
       print(chunk.content, end="", flush=True)
   ```

---

## 🎯 快速决策树

```
需要使用 LangChain 吗？
├─ 否：直接用 LLM API
└─ 是：什么场景？
    ├─ 简单问答 → 直接调用 LLM
    ├─ 需要记忆 → 添加 Memory
    ├─ 需要工具 → 添加 Tools
    ├─ 需要多步骤 → 使用 Chain
    ├─ 需要智能决策 → 使用 Agent
    └─ 需要可视化 → 添加 LangSmith
```

---

## 📚 学习路径

1. **入门**：基础 LLM 使用
2. **进阶**：Memory + Tools
3. **高级**：Agent + Chain
4. **专家**：LangSmith + LangGraph

---

## 🆘 常见问题速查

| 问题 | 解决方案 |
|------|----------|
| API Key 错误 | 检查环境变量 |
| 模型调用失败 | 检查网络和 API 配额 |
| Agent 循环 | 增加 max_iterations |
| 记忆丢失 | 使用 Checkpointer |
| 成本过高 | 检查 LangSmith 追踪，优化提示词 |

---

## 🔗 参考资源

- 官方文档：https://python.langchain.com/docs/
- 示例库：https://github.com/langchain-ai/langchain/tree/master/cookbook
- LangSmith：https://smith.langchain.com/

---

*最后更新：2026-04-01*

**💡 提示：把这张卡片保存到本地，随时查阅！**