# 04 - State 管理

> State 的管理和持久化

## 🎯 State 概述

State 是 LangGraph 中所有数据的容器，在工作流的不同节点间传递和更新。

### State 作用

- 🔐 存储上下文信息
- 🔄 在节点间传递数据
- 💾 持久化状态（Checkpoint）
- 📊 调试和追踪

---

## 📝 定义 State

### 基础 State

```python
from typing import TypedDict

# 使用 TypedDict 定义 State
class State(TypedDict):
    messages: list
    output: str
    counter: int
```### 带默认值的 State

```python
class State(TypedDict):
    messages: list = []
    output: str = ""
    counter: int = 0
```### 使用 Annotated 添加操作

```python
from typing import Annotated
from operator import add

class State(TypedDict):
    # messages 会自动相加（累积）
    messages: Annotated[list, add]

# 使用
state = {"messages": [{"role": "user", "content": "你好"}]}
result = app.invoke(state)
# result["messages"] = [{"role": "user", "content": "你好"}, {"role": "assistant", "content": "你好！"}]
```### 使用 Pydantic 定义

```python
from pydantic import BaseModel

class State(BaseModel):
    messages: List[dict] = []
    output: str = ""
    counter: int = 0
```---

## 🔄 更新 State

### 在节点中更新

```python
def update_state(state: State) -> State:
    # 1. 读取现有状态
    messages = state["messages"]
    counter = state.get("counter", 0)

    # 2. 更新数据
    messages.append({"role": "assistant", "content": "新消息"})
    counter += 1

    # 3. 返回新状态
    return {
        "messages": messages,
        "counter": counter
    }
```### 使用 .update()

```python
def update_state(state: State) -> State:
    # 创建新状态
    new_state = state.copy()
    new_state["counter"] += 1
    new_state["output"] = "已更新"

    return new_state
```---

## 💾 持久化

### 使用 Postgres Checkpoint

```python
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.graph import CompiledGraph

# 创建 Checkpoint
checkpointer = PostgresSaver.from_conn_string(
    "postgresql://user:password@localhost/db"
)

# 编译时传入 checkpointer
workflow = StateGraph(State)
workflow.add_node("node1", node1)
workflow.add_node("node2", node2)
workflow.add_edge("node1", "node2")
workflow.add_edge("node2", END)

app = workflow.compile(checkpointer=checkpointer)

# 使用
config = {"configurable": {"thread_id": "user_1"}}
result = app.invoke({"output": ""}, config=config)
```### 使用内存 Checkpoint

```python
from langgraph.checkpoint.memory import MemorySaver

# 内存存储（重启后丢失）
checkpointer = MemorySaver()
app = workflow.compile(checkpointer=checkpointer)
```### 使用自定义 Checkpoint

```python
from langgraph.checkpoint.base import BaseCheckpointSaver

class CustomCheckpoint(BaseCheckpointSaver):
    """自定义 Checkpoint 实现"""

    async def aget(self, config):
        # 获取状态
        pass

    async def aput(self, config, state):
        # 保存状态
        pass

checkpointer = CustomCheckpoint()
app = workflow.compile(checkpointer=checkpointer)
```---

## 🔍 管理状态

### 读取 State

```python
# 在节点中读取
def read_state(state: State) -> State:
    print("当前 counter:", state["counter"])
    print("当前消息:", state["messages"])
    return state

# 从外部读取
config = {"configurable": {"thread_id": "user_1"}}
state = app.get_state(config)
print(state.values["output"])
```### 更新 State

```python
# 使用 update_state
config = {"configurable": {"thread_id": "user_1"}}
app.update_state(config, {"output": "新状态"})
```### 删除 State

```python
# 删除状态
app.update_state(config, {"messages": []})
```### 历史状态

```python
# 获取历史状态
config = {"configurable": {"thread_id": "user_1"}}

# 获取所有检查点
for i, checkpoint in enumerate(app.get_state_history(config)):
    print(f"检查点 {i}: {checkpoint.values}")
```---

## 🎯 State 模式

### 1. 累积模式

```python
from typing import Annotated
from operator import add

class State(TypedDict):
    # 消息累积
    messages: Annotated[list, add]

# 每次调用会追加消息
result = app.invoke({"messages": [{"role": "user", "content": "你好"}]})
# result["messages"] = [..., {"role": "user", "content": "你好"}]
```### 2. 覆盖模式

```python
class State(TypedDict):
    # 消息替换
    messages: list
    output: str
```### 3. 条件模式

```python
class State(TypedDict):
    # 根据条件更新
    processed: bool
    output: str
```---

## 📊 最佳实践

### 1. State 设计

✅ **应该做**
- 使用 TypedDict 明确类型
- 只存储必要的数据
- 避免存储大文件

❌ **不应该做**
- 存储敏感信息
- 存储不相关数据
- 直接修改传入的 state

### 2. 性能优化

```python
# 只更新必要字段
def efficient_node(state: State) -> State:
    new_state = state.copy()
    # 只更新变化的字段
    new_state["counter"] += 1

    return new_state
```### 3. 错误处理

```python
def safe_node(state: State) -> State:
    try:
        # 读取状态
        counter = state.get("counter", 0)

        # 更新状态
        return {"counter": counter + 1}

    except Exception as e:
        # 错误处理
        return {"error": str(e)}
```### 4. 调试技巧

```python
def debug_node(state: State) -> State:
    print(f"节点输入: {state}")

    # 处理
    result = process(state)

    print(f"节点输出: {result}")
    return result
```---

## 🔧 实用示例

### 对话历史管理

```python
class ChatState(TypedDict):
    messages: Annotated[list, add]
    session_id: str
    context: dict

def chat_node(state: ChatState) -> ChatState:
    # 获取上下文
    context = state["context"]

    # 处理消息
    response = generate_response(state["messages"], context)

    # 更新状态
    state["messages"].append({
        "role": "assistant",
        "content": response
    })

    return state

# 使用
app.invoke({
    "messages": [{"role": "user", "content": "你好"}],
    "session_id": "123",
    "context": {"language": "zh"}
})
```---

## 常见问题

### Q: State 在哪里存储？

**A**: 取决于 Checkpoint 实现（Postgres、内存、自定义）

### Q: 如何清除 State？

**A**: 使用 `app.update_state(config, {})`

### Q: State 限制大小？

**A**: 取决于数据库和 Checkpoint 实现

---

## 下一步？

- 🤖 [Agent 开发](../05-Agent 开发/README.md)
- 🔌 [工具集成](../06-工具集成/README.md)
- 🐛 [故障排查](../09-故障排查/README.md)

---

*本章节基于 docs.langchain.com/docs/langgraph*