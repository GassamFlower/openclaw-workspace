# 02 - 快速开始

> 10 分钟上手 LangGraph

## 🎯 目标

在 10 分钟内创建并运行第一个 LangGraph 应用

## 📋 前置要求

- Python 3.10+
- pip 包管理器
- 10 分钟时间

---

## 步骤 1：安装 LangGraph

```bash
# 安装 LangGraph
pip install langgraph

# 安装其他依赖
pip install langchain
pip install langchain-openai
```### 验证安装

```bash
python -c "import langgraph; print(langgraph.__version__)"
```---

## 步骤 2：创建第一个 Graph

```python
# hello_graph.py
from langgraph.graph import StateGraph, END

# 定义 State
class State(dict):
    pass

# 定义节点函数
def node1(state: State):
    print("执行节点1")
    state["output"] = "节点1完成"
    return state

def node2(state: State):
    print("执行节点2")
    state["output"] += "，节点2完成"
    return state

# 创建 Graph
workflow = StateGraph(State)

# 添加节点
workflow.add_node("node1", node1)
workflow.add_node("node2", node2)

# 添加边
workflow.set_entry_point("node1")
workflow.add_edge("node1", "node2")
workflow.add_edge("node2", END)

# 编译 Graph
app = workflow.compile()

# 运行
result = app.invoke({"output": ""})
print("最终结果:", result["output"])
```---

## 步骤 3：运行并测试

```bash
# 运行代码
python hello_graph.py

# 输出应该是：
# 执行节点1
# 执行节点2
# 最终结果: 节点1完成，节点2完成
```---

## 步骤 4：添加持久化

```python
# 持久化示例
from langgraph.checkpoint.postgres import PostgresSaver

# 使用 Checkpoint
checkpointer = PostgresSaver.from_conn_string("postgresql://user:password@localhost/db")

# 编译时传入 checkpointer
app = workflow.compile(checkpointer=checkpointer)

# 保存状态
config = {"configurable": {"thread_id": "1"}}
result = app.invoke({"output": ""}, config=config)
```---

## 🎉 成功！

现在你已经成功创建并运行了第一个 LangGraph 应用！

### 下一步

- 📚 学习如何设计更复杂的 Graph
- 🔧 添加更多节点和边
- 🤖 创建智能 Agent
- 📊 使用 State 管理数据
- 🔌 集成工具和外部 API

---

## 📖 完整示例

### 聊天机器人 Graph

```python
# chatbot.py
from langgraph.graph import StateGraph, END
from typing import Annotated, TypedDict
from operator import add

# 定义 State
class ChatState(TypedDict):
    messages: Annotated[list, add]

# 定义节点
def process_message(state: ChatState):
    messages = state["messages"]
    last_message = messages[-1]["content"]

    # 简单的响应逻辑
    response = f"你说：{last_message}，我收到了！"

    return {"messages": [{"role": "assistant", "content": response}]}

# 创建 Graph
workflow = StateGraph(ChatState)
workflow.add_node("process_message", process_message)
workflow.set_entry_point("process_message")
workflow.add_edge("process_message", END)

app = workflow.compile()

# 使用
result = app.invoke({"messages": [{"role": "user", "content": "你好"}]})
print(result["messages"][-1]["content"])
```---

## 常见问题

### Q: 安装失败？

**A**: 检查 Python 版本：
```bash
python --version
```### Q: 导入错误？

**A**: 确保安装了最新版本：
```bash
pip install --upgrade langgraph
```### Q: 如何调试？

**A**: 使用 LangSmith：
```python
import os
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "your-api-key"
```---

## 下一步？

- 🧩 [Graph 开发](../03-Graph-开发/README.md)
- 📊 [State 管理](../04-State-管理/README.md)
- 🤖 [Agent 开发](../05-Agent 开发/README.md)

---

*本章节基于 docs.langchain.com/docs/langgraph*