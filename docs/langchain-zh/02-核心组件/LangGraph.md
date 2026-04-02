# LangGraph - Agent 编程框架

> LangGraph 是 LangChain 的底层框架,用于编排复杂的 Agent 工作流

## 🎯 什么是 LangGraph?

### LangChain vs LangGraph

| 特性 | LangChain | LangGraph |
|------|-----------|-----------|
| 侧重 | 快速构建 Agent | 编排复杂工作流 |
| 复杂度 | 简单 | 复杂 |
| 学习曲线 | 低 | 中等 |
| 适用场景 | 快速原型 | 生产级应用 |

**类比**:
- LangChain = 现成的工具箱,拿起来就能用
- LangGraph = 编程框架,可以定制一切

---

## 📊 为什么需要 LangGraph?

### 问题场景: 复杂工作流

```
用户输入
    ↓
判断意图
    ↓
┌─────┴─────┐
│           │
简单查询    复杂任务
│           │
查看天气    生成报告
│           │
    ↓       ↓
    └───┬───┘
        ↓
    整合结果
```

用 LangChain Agent:
- ✅ 可以实现
- ❌ 但不够灵活

用 LangGraph:
- ✅ 完美支持
- ✅ 可控性强
- ✅ 可视化调试

---

## 🧩 LangGraph 核心概念

### 1. 图 (Graph)

LangGraph 用图来表示工作流:

```
┌─────┐    ┌─────┐    ┌─────┐
│ 节点1 │ → │ 节点2 │ → │ 节点3 │
└─────┘    └─────┘    └─────┘
    ↑            │
    └────────────┘
    (循环/分支)
```

### 2. 节点 (Node)

节点 = 一个函数,执行具体任务

```python
def human_input(state):
    """等待人类输入"""
    return state

def process_data(state):
    """处理数据"""
    return state
```

### 3. 边 (Edge)

边 = 决定流程走向

```python
# 简单边: 按顺序执行
graph.add_edge("start", "process")
graph.add_edge("process", "end")

# 条件边: 根据状态决定走向
graph.add_conditional_edges(
    "decision",
    should_continue,  # 决策函数
    {
        "yes": "branch1",
        "no": "branch2",
    }
)
```

---

## 💻 LangGraph 基础示例

### 最简单的图

```python
from langgraph.graph import StateGraph, END

# 1. 定义状态 (共享数据)
class State:
    messages: list

# 2. 定义节点
def node1(state: State) -> State:
    print("执行节点1")
    return {"messages": [f"节点1: {state['messages'][0]}"]}

def node2(state: State) -> State:
    print("执行节点2")
    return {"messages": [f"节点2: {state['messages'][0]}"]}

# 3. 构建图
graph = StateGraph(State)

# 4. 添加节点
graph.add_node("node1", node1)
graph.add_node("node2", node2)

# 5. 添加边
graph.set_entry_point("node1")
graph.add_edge("node1", "node2")
graph.add_edge("node2", END)

# 6. 编译图
app = graph.compile()

# 7. 运行
result = app.invoke({"messages": ["hello"]})
print(result)
````

---

## 🔀 条件分支

### 根据条件决定流程

```python
def check_input(state: State) -> str:
    """判断输入类型"""
    if "天气" in state["messages"][0]:
        return "weather"
    else:
        return "default"

def handle_weather(state: State) -> State:
    """处理天气查询"""
    return {"messages": ["天气查询"]}

def handle_default(state: State) -> State:
    """处理其他请求"""
    return {"messages": ["普通请求"]}

# 构建图
graph = StateGraph(State)
graph.add_node("check", check_input)
graph.add_node("weather", handle_weather)
graph.add_node("default", handle_default)

# 条件边
graph.add_conditional_edges(
    "check",
    check_input,
    {
        "weather": "weather",
        "default": "default",
    }
)

# 连接
graph.add_edge("weather", END)
graph.add_edge("default", END)

# 编译并运行
app = graph.compile()
result = app.invoke({"messages": ["今天天气如何?"]})
```

---

## 🔄 循环与记忆

### 多轮对话

```python
from langgraph.checkpoint.memory import MemorySaver

# 创建检查点存储
memory = MemorySaver()

# 构建图
graph = StateGraph(State)
graph.add_node("user_input", user_input_node)
graph.add_node("llm_response", llm_node)

# 添加边
graph.add_edge("user_input", "llm_response")
graph.add_edge("llm_response", "user_input")  # 循环

# 编译 (启用检查点)
app = graph.compile(checkpointer=memory)

# 运行
config = {"configurable": {"thread_id": "123"}}
app.invoke({"messages": ["你好"]}, config=config)
app.invoke({"messages": ["我是谁"]}, config=config)  # 记得上一轮
```

---

## 🎨 可视化

### 查看图结构

```python
# 保存图结构到文件
app.get_graph().draw_mermaid_png(
    output_file_path="graph.png"
)
```

生成:
```
user_input → llm_response → user_input
```

---

## 📊 LangGraph vs LangChain Agent 对比

### 场景: 电商订单处理

**LangChain Agent**:
```python
agent = create_agent(
    model="gpt-4",
    tools=[check_order, update_order],
)
result = agent.invoke("订单坏了,帮我退款")
```

**LangGraph**:
```python
graph = StateGraph(OrderState)
graph.add_node("check_order", check_order)
graph.add_node("check_refund_policy", check_refund_policy)
graph.add_node("update_order", update_order)
graph.add_node("notify_user", notify_user)

graph.add_conditional_edges(
    "check_order",
    lambda s: s["refundable"],
    {"yes": "update_order", "no": "notify_user"}
)
```

**选择建议**:
- 简单任务 → LangChain Agent
- 复杂流程 → LangGraph

---

## 🚀 高级特性

### 1. 子图 (Subgraph)

复杂任务可以拆分成子图

### 2. 中断 (Interrupt)

暂停执行,等待人工介入

```python
def human_approval(state: State) -> State:
    """需要人工批准"""
    print("需要人工批准")
    return state

# 图中插入中断
graph.add_node("approval", human_approval)
# 执行到这里会暂停
```

### 3. 工具调用

在节点中使用工具

```python
from langchain.tools import tool

@tool
def search_web(query: str):
    """搜索网页"""
    ...

def research_node(state: State) -> State:
    # 在节点中调用工具
    result = search_web.invoke("关键词")
    return {"data": result}
```

---

## 📝 完整示例: 智能客服流程

```python
from langgraph.graph import StateGraph, END

class TicketState:
    messages: list
    status: str  # new, processing, closed

def user_input_node(state: State) -> State:
    """接收用户输入"""
    user_msg = state["messages"][-1]
    print(f"用户: {user_msg}")

    # 自动分类
    if "退款" in user_msg:
        state["status"] = "refund"
    elif "问题" in user_msg:
        state["status"] = "problem"
    else:
        state["status"] = "general"

    return state

def route_ticket(state: State) -> str:
    """路由到不同处理流程"""
    return state["status"]

def refund_node(state: State) -> State:
    """退款处理"""
    print("处理退款...")
    return {"messages": ["退款已处理"]}

def problem_node(state: State) -> State:
    """问题排查"""
    print("排查问题...")
    return {"messages": ["问题已解决"]}

def general_node(state: State) -> State:
    """通用回复"""
    print("回复通用问题...")
    return {"messages": ["感谢您的咨询"]}

def human_reply_node(state: State) -> State:
    """人工回复"""
    print("人工客服回复")
    return state

# 构建图
graph = StateGraph(TicketState)

# 添加节点
graph.add_node("user_input", user_input_node)
graph.add_node("refund", refund_node)
graph.add_node("problem", problem_node)
graph.add_node("general", general_node)
graph.add_node("human_reply", human_reply_node)

# 添加边
graph.set_entry_point("user_input")
graph.add_conditional_edges(
    "user_input",
    route_ticket,
    {
        "refund": "refund",
        "problem": "problem",
        "general": "general",
    }
)
graph.add_edge("refund", END)
graph.add_edge("problem", END)
graph.add_edge("general", END)

# 添加异常处理
graph.add_edge("user_input", "human_reply")

# 编译
app = graph.compile()

# 运行
app.invoke({"messages": ["我要退款"]})
```

---

## 🎓 学习路径

1. **基础**: StateGraph, 节点, 边
2. **进阶**: 条件分支, 循环
3. **高级**: 检查点, 子图, 中断
4. **实战**: 构建复杂应用

---

## 📚 推荐资源

- [LangGraph 官方文档](https://docs.langchain.com/langgraph)
- [LangGraph Python SDK](https://docs.langchain.com/langsmith/langgraph-python-sdk.md)
- [LangGraph 示例](https://github.com/langchain-ai/langgraph/tree/main/examples)

---

**下一篇**: [LangSmith](./LangSmith.md) - 调试与监控