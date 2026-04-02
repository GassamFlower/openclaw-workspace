# API 参考手册

## 📖 LangChain 核心 API

### 1. LLM (大语言模型)

```python
from langchain_openai import ChatOpenAI

# 创建 LLM
llm = ChatOpenAI(
    model="gpt-4",           # 模型名称
    temperature=0.7,        # 随机性 0-1
    max_tokens=1024,        # 最大输出 token
    api_key="sk-xxx",       # API Key
)

# 调用
response = llm.invoke("问题")
````

**参数**:
- `model`: 模型名称
- `temperature`: 温度参数 (0-1)
- `max_tokens`: 最大 token 数
- `api_key`: API 密钥
- `timeout`: 超时时间

---

### 2. Prompt (提示词)

```python
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate

# 创建模板
system_prompt = SystemMessagePromptTemplate.from_template(
    "你是一个{role}助手"
)

human_prompt = HumanMessagePromptTemplate.from_template(
    "{input}"
)

prompt = ChatPromptTemplate.from_messages([
    system_prompt,
    human_prompt
])
````

**方法**:
- `from_template()`: 从模板创建
- `format()`: 格式化
- `format_messages()`: 格式化消息

---

### 3. Chain (链)

```python
from langchain.chains import LLMChain

# 创建 Chain
chain = LLMChain(
    llm=llm,           # LLM 对象
    prompt=prompt,     # 提示词模板
    verbose=True,      # 是否显示详细输出
)
````

**方法**:
- `run()`: 运行并返回结果
- `invoke()`: 运行并返回详细结果
- `batch()`: 批量运行

---

### 4. Agent (智能体)

```python
from langchain.agents import create_tool_agent, AgentExecutor

# 创建 Agent
tools = [
    Tool(name="Search", func=search, description="搜索信息")
]

agent = create_tool_agent(llm=llm, tools=tools, prompt="你是一个搜索助手")

# 运行
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
result = executor.run("搜索 LangChain")
```

**方法**:
- `run()`: 运行 Agent
- `invoke()`: 运行 Agent (返回详细结果)
- `batch()`: 批量运行

---

### 5. Memory (记忆)

```python
from langchain.memory import ConversationBufferMemory

# 创建记忆
memory = ConversationBufferMemory(
    input_key="input",        # 输入变量名
    output_key="output",      # 输出变量名
    return_messages=True,     # 是否返回消息对象
)

# 创建对话链
from langchain.chains import ConversationChain

conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True,
)
```

**类型**:
- `ConversationBufferMemory`: 完整历史
- `ConversationBufferWindowMemory`: 窗口历史
- `ConversationSummaryMemory`: 摘要记忆

---

### 6. VectorStore (向量数据库)

```python
from langchain_community.vectorstores import FAISS, Chroma

# 创建向量数据库
vector_store = FAISS.from_texts(
    texts=documents,           # 文档列表
    embedding=OpenAIEmbeddings(),  # 嵌入模型
)

# 保存
vector_store.save_local("faiss_index")

# 加载
vector_store = FAISS.load_local(
    "faiss_index",
    OpenAIEmbeddings(),
    allow_dangerous_deserialization=True
)

# 创建检索器
retriever = vector_store.as_retriever(k=3)
```

**方法**:
- `similarity_search()`: 相似度搜索
- `as_retriever()`: 创建检索器
- `save_local()`: 保存
- `load_local()`: 加载

---

### 7. Tool (工具)

```python
from langchain.tools import Tool

# 创建工具
def search_function(query: str) -> str:
    """搜索信息"""
    return f"搜索: {query}"

tool = Tool(
    name="Search",            # 工具名称
    func=search_function,     # 函数
    description="搜索信息",   # 描述
)
```

**方法**:
- `invoke()`: 调用工具
- `run()`: 运行工具

---

### 8. RAG (检索增强生成)

```python
from langchain.chains import RetrievalQA

# 创建 RAG Chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,                          # LLM
    chain_type="stuff",               # Chain 类型
    retriever=retriever,              # 检索器
    return_source_documents=True,     # 是否返回源文档
    verbose=True,                     # 详细输出
)

# 运行
result = qa_chain.invoke("问题")
```

**Chain 类型**:
- `stuff`: 简单拼接
- `map_reduce`: 分块处理
- `map_rerank`: 重排序
- `refine`: 逐步完善

---

### 9. LangSmith (调试工具)

```python
import os

# 配置
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-key"
os.environ["LANGCHAIN_PROJECT"] = "my-project"

# 自动追踪
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4")

# 自动追踪所有调用
response = llm.invoke("问题")
```

**方法**:
- 访问 LangSmith Dashboard
- 查看调用历史
- 分析性能

---

### 10. Embeddings (嵌入模型)

```python
from langchain_openai import OpenAIEmbeddings

# 创建嵌入模型
embeddings = OpenAIEmbeddings()

# 获取嵌入
vector = embeddings.embed_query("文本")

# 批量嵌入
vectors = embeddings.embed_documents(["文本1", "文本2"])
```

**方法**:
- `embed_query()`: 嵌入单个查询
- `embed_documents()`: 批量嵌入文档

---

## 📚 常用 API 组合

### 1. Agent + Tool

```python
from langchain.agents import create_tool_agent, AgentExecutor
from langchain.tools import Tool

# 创建工具
tools = [
    Tool(name="Search", func=search, description="搜索信息")
]

# 创建 Agent
agent = create_tool_agent(llm=llm, tools=tools, prompt="你是一个搜索助手")

# 运行
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
result = executor.run("搜索 LangChain")
`````

### 2. Chain + Memory

```python
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory

# 创建记忆
memory = ConversationBufferMemory()

# 创建对话链
conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True
)

# 聊天
response1 = conversation.predict(input="你好")
response2 = conversation.predict(input="我叫什么名字?")
`````

### 3. RAG + Memory

```python
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

# 创建记忆
memory = ConversationBufferMemory()

# 创建 RAG Chain
qa_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    memory=memory,
    verbose=True
)

# 问答
result = qa_chain({"question": "LangChain 是什么?"})
result = qa_chain({"question": "它支持哪些模型?"})
`````

---

## 🚀 高级 API

### 1. LangGraph (图编排)

```python
from langgraph.graph import StateGraph, END

# 创建图
workflow = StateGraph()

# 添加节点
workflow.add_node("agent", agent_node)
workflow.add_node("tools", tools_node)
workflow.add_node("summary", summary_node)

# 添加边
workflow.add_edge("agent", "tools")
workflow.add_conditional_edges("tools", should_continue, {
    "continue": "agent",
    "end": END
})

# 编译
app = workflow.compile()
`````

### 2. 自定义 Agent

```python
from langchain.agents import Agent

class CustomAgent(Agent):
    def __init__(self, llm, tools, system_prompt):
        super().__init__()
        self.llm = llm
        self.tools = tools
        self.memory = ConversationBufferMemory()
        self.system_prompt = system_prompt

    def invoke(self, input_data):
        prompt = self.system_prompt + f"\n\n{input_data}"
        result = self.llm.invoke(prompt)
        self.memory.save_context({"input": input_data}, {"output": result})
        return result
`````

### 3. 自定义工具

```python
from langchain.tools import Tool

class CustomTool:
    def __init__(self):
        self.name = "CustomTool"
        self.description = "自定义工具描述"

    def invoke(self, input_data):
        # 自定义逻辑
        return result

tool = Tool(
    name=self.name,
    func=self.invoke,
    description=self.description
)
`````

---

## 💡 API 使用技巧

### 1. 使用 LCEL (LangChain Expression Language)

```python
from langchain_core.runnables import RunnablePassthrough

# 使用 LCEL
chain = prompt | llm | output_parser
result = chain.invoke(input="data")
`````

### 2. 批量处理

```python
# 批量运行
results = llm.batch([
    "问题1",
    "问题2",
    "问题3",
])
`````

### 3. 流式输出

```python
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

llm = ChatOpenAI(
    streaming=True,
    callbacks=[StreamingStdOutCallbackHandler()]
)
`````

---

## 📚 更多资源

- [LangChain API 文档](https://python.langchain.com/api_reference/)
- [LangChain 提示词模板](https://python.langchain.com/api_reference/python/langchain.prompts.html)
- [LangChain 工具](https://python.langchain.com/api_reference/python/langchain.tools.html)

---

**更新日期**: 2026-04-02
**版本**: v1.0
**状态**: ✅ 已创建