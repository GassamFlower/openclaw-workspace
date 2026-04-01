# 03 - Graph 开发

> Graph 的设计和实现

## 🎯 Graph 概述

Graph 是 LangGraph 的核心概念，由节点和边组成，描述了工作流的结构。

### Graph 组成

| 组成部分 | 说明 | 示例 |
|----------|------|------|
| **节点（Node）** | 执行单元（函数） | 处理消息、调用 API |
| **边（Edge）** | 节点间的连接 | node1 → node2 |
| **状态（State）** | 数据存储和传递 | 对话历史、上下文 |

---

## 📝 创建 Graph

### 基础 Graph

```python
from langgraph.graph import StateGraph, END

# 1. 定义 State
class State(dict):
    pass

# 2. 定义节点函数
def node1(state: State):
    print("执行节点1")
    state["output"] = "节点1"
    return state

def node2(state: State):
    print("执行节点2")
    state["output"] = "节点2"
    return state

# 3. 创建 Graph
workflow = StateGraph(State)

# 4. 添加节点
workflow.add_node("node1", node1)
workflow.add_node("node2", node2)

# 5. 设置入口点
workflow.set_entry_point("node1")

# 6. 添加边
workflow.add_edge("node1", "node2")
workflow.add_edge("node2", END)

# 7. 编译
app = workflow.compile()

# 8. 运行
result = app.invoke({})
print(result["output"])
```### 运行结果

```
执行节点1
执行节点2
节点2
```

---

## 🔗 节点设计

### 节点函数规范

```python
def my_node(state: State) -> State:
    """
    节点函数规范：
    - 输入：State（包含所有状态数据）
    - 输出：State（返回更新后的状态）
    - 必须返回 state
    """
    # 处理逻辑
    state["new_key"] = "new_value"

    return state
```### 节点类型

| 类型 | 说明 | 示例 |
|------|------|------|
| **数据处理** | 处理数据 | 解析输入、格式化输出 |
| **API 调用** | 调用外部服务 | 搜索、计算 |
| **LLM 调用** | 调用大语言模型 | 生成回复 |
| **条件判断** | 根据条件路由 | if/else |

---

## 🔧 边连接

### 基础边

```python
# 简单连接
workflow.add_edge("node1", "node2")

# 自动结束
workflow.add_edge("node2", END)
```### 条件边

```python
from typing import Literal

def should_continue(state: State) -> Literal["node1", "node2"]:
    """条件判断"""
    if state["condition"] == "continue":
        return "node2"
    return "node1"

workflow.add_conditional_edges(
    "node1",
    should_continue,
    {
        "node2": "node2",
        "end": END
    }
)
```### 自定义边

```python
# 使用 lambda
workflow.add_conditional_edges(
    "node1",
    lambda state: "node2" if state["counter"] > 1 else "end",
    {"node2": "node2", "end": END}
)
```---

## 🧪 测试 Graph

### 单元测试

```python
import pytest
from unittest.mock import Mock

def test_node1():
    """测试节点1"""
    state = {"output": ""}
    result = node1(state)
    assert result["output"] == "节点1"
```### 集成测试

```python
def test_workflow():
    """测试完整工作流"""
    workflow = StateGraph(State)
    workflow.add_node("node1", node1)
    workflow.add_edge("node1", END)
    app = workflow.compile()

    result = app.invoke({})
    assert "output" in result
```---

## 💡 最佳实践

### 1. 节点设计

✅ **应该做**
- 简单、专注
- 可复用
- 有清晰的输入输出

❌ **不应该做**
- 过于复杂的逻辑
- 直接调用外部 API
- 修改全局状态

### 2. 状态管理

✅ **应该做**
- 使用 TypedDict 明确类型
- 只修改必要的状态
- 返回完整的 state

❌ **不应该做**
- 在节点间传递复杂对象
- 不返回 state
- 直接修改传入的 state

### 3. 错误处理

```python
def safe_node(state: State) -> State:
    try:
        # 处理逻辑
        result = risky_operation(state)
        state["result"] = result
    except Exception as e:
        state["error"] = str(e)
        state["error_node"] = "safe_node"

    return state
```### 4. 调试技巧

```python
# 打印中间状态
def debug_node(state: State) -> State:
    print(f"输入: {state}")
    # 处理逻辑
    print(f"输出: {state}")
    return state
```---

## 📊 性能优化

### 1. 减少节点数量

✅ 合并相似节点
❌ 过度拆分

### 2. 使用缓存

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_operation(input_data):
    # 耗时的操作
    return result
```### 3. 并行处理

```python
# LangGraph 支持并行节点
workflow.add_edge("node1", "node2")
workflow.add_edge("node1", "node3")

# node2 和 node3 会并行执行
```---

## 📖 完整示例

### 聊天机器人 Graph

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, List
from operator import add

# 定义 State
class ChatState(TypedDict):
    messages: Annotated[List[dict], add]

# 定义节点
def process_input(state: ChatState) -> ChatState:
    """处理用户输入"""
    user_message = state["messages"][-1]["content"]

    # 简单分类
    if "天气" in user_message:
        state["intent"] = "weather"
    elif "时间" in user_message:
        state["intent"] = "time"
    else:
        state["intent"] = "general"

    return state

def generate_response(state: ChatState) -> ChatState:
    """生成回复"""
    intent = state.get("intent", "general")

    if intent == "weather":
        state["messages"].append({
            "role": "assistant",
            "content": "今天是晴天，23°C"
        })
    elif intent == "time":
        state["messages"].append({
            "role": "assistant",
            "content": "现在是 19:00"
        })
    else:
        state["messages"].append({
            "role": "assistant",
            "content": "我收到了你的消息"
        })

    return state

# 创建 Graph
workflow = StateGraph(ChatState)
workflow.add_node("process_input", process_input)
workflow.add_node("generate_response", generate_response)
workflow.set_entry_point("process_input")
workflow.add_edge("process_input", "generate_response")
workflow.add_edge("generate_response", END)

app = workflow.compile()

# 使用
result = app.invoke({
    "messages": [{"role": "user", "content": "今天天气怎么样？"}]
})
print(result["messages"][-1]["content"])
```---

## 常见问题

### Q: 如何查看 Graph 可视化？

**A**: 使用 LangSmith 或 LangGraph Canvas

### Q: 如何调试执行过程？

**A**: 添加日志或使用 LangSmith 跟踪

### Q: 节点之间如何传递数据？

**A**: 通过 State 字段传递

---

## 下一步？

- 📊 [State 管理](../04-State-管理/README.md)
- 🤖 [Agent 开发](../05-Agent 开发/README.md)
- 🐛 [故障排查](../09-故障排查/README.md)

---

*本章节基于 docs.langchain.com/docs/langgraph*