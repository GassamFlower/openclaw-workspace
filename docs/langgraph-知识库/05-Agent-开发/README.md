# 05 - Agent 开发

> 创建智能 Agent

## 🎯 Agent 概述

Agent 是能够自主使用工具、做出决策的智能体。

### Agent 特性

- 🤖 自主决策
- 🔧 工具调用
- 📚 知识检索
- 🔄 多步骤任务
- 💬 对话能力

---

## 📝 创建 Agent

### 基础 Agent

```python
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

# 定义 State
class AgentState(TypedDict):
    messages: list

# 定义节点
def agent_node(state: AgentState) -> AgentState:
    """Agent 节点"""
    llm = ChatOpenAI(model="gpt-4")

    messages = state["messages"]
    response = llm.invoke(messages)

    state["messages"].append(response)
    return state

# 创建 Graph
workflow = StateGraph(AgentState)
workflow.add_node("agent", agent_node)
workflow.set_entry_point("agent")
workflow.add_edge("agent", END)

app = workflow.compile()

# 使用
result = app.invoke({
    "messages": [{"role": "user", "content": "你好"}]
})
print(result["messages"][-1].content)
```### 使用 Agent 框架

```python
from langgraph.prebuilt import create_agent

def get_weather(city: str) -> str:
    """天气工具"""
    return f"{city}的天气是晴天，23°C"

def search(query: str) -> str:
    """搜索工具"""
    return f"搜索结果: {query}"

# 创建 Agent
agent = create_agent(
    model="gpt-4",
    tools=[get_weather, search]
)

# 使用
response = agent.invoke(
    "北京的天气怎么样？"
)
print(response)
```---

## 🔧 工具调用

### 定义工具

```python
from langchain.tools import tool

@tool
def search_web(query: str) -> str:
    """搜索网页内容

    Args:
        query: 搜索关键词
    """
    return f"搜索: {query}"

@tool
def calculate(expression: str) -> float:
    """计算表达式

    Args:
        expression: 数学表达式
    """
    return eval(expression)
```### 工具注册

```python
from langchain_openai import ChatOpenAI

# 创建 LLM
llm = ChatOpenAI(model="gpt-4", temperature=0)

# 注册工具
llm_with_tools = llm.bind_tools([search_web, calculate])

# 调用
response = llm_with_tools.invoke(
    "帮我搜索一下Python的最新版本"
)
print(response.tool_calls)
```---

## 🤖 多 Agent 协作

### Agent 路由

```python
class MultiAgentState(TypedDict):
    messages: list
    agent_type: str

def routing_agent(state: MultiAgentState) -> MultiAgentState:
    """路由 Agent"""
    message = state["messages"][-1]["content"]

    if "天气" in message:
        state["agent_type"] = "weather_agent"
    elif "代码" in message:
        state["agent_type"] = "code_agent"
    else:
        state["agent_type"] = "general_agent"

    return state

def weather_agent(state: MultiAgentState) -> MultiAgentState:
    """天气 Agent"""
    # 天气处理逻辑
    state["messages"].append({
        "role": "assistant",
        "content": "天气信息已获取"
    })
    return state

def code_agent(state: MultiAgentState) -> MultiAgentState:
    """代码 Agent"""
    # 代码处理逻辑
    state["messages"].append({
        "role": "assistant",
        "content": "代码已生成"
    })
    return state

def general_agent(state: MultiAgentState) -> MultiAgentState:
    """通用 Agent"""
    # 通用处理逻辑
    state["messages"].append({
        "role": "assistant",
        "content": "消息已处理"
    })
    return state

# 创建 Graph
workflow = StateGraph(MultiAgentState)
workflow.add_node("routing_agent", routing_agent)
workflow.add_node("weather_agent", weather_agent)
workflow.add_node("code_agent", code_agent)
workflow.add_node("general_agent", general_agent)

workflow.set_entry_point("routing_agent")
workflow.add_conditional_edges(
    "routing_agent",
    lambda state: state["agent_type"],
    {
        "weather_agent": "weather_agent",
        "code_agent": "code_agent",
        "general_agent": "general_agent"
    }
)
workflow.add_edge("*", END)

app = workflow.compile()

# 使用
result = app.invoke({
    "messages": [{"role": "user", "content": "北京的天气怎么样？"}]
})
print(result["messages"][-1]["content"])
```---

## 📊 Agent 监控

### 调试 Agent

```python
import os
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "your-api-key"

# LangSmith 会自动追踪 Agent 调用
response = agent.invoke("你好")
```### 查看执行日志

```python
# 在节点中添加日志
def debug_agent(state: AgentState) -> AgentState:
    print(f"输入消息: {state['messages']}")

    # 处理
    response = process(state["messages"])

    print(f"输出消息: {response}")

    state["messages"].append(response)
    return state
```---

## 💡 最佳实践

### 1. Agent 设计

✅ **应该做**
- 明确 Agent 的职责
- 使用适当的工具
- 设置合理的超时

❌ **不应该做**
- 过度复杂
- 直接访问数据库
- 修改全局状态

### 2. 工具设计

```python
@tool
def my_tool(param: str) -> str:
    """工具描述

    Args:
        param: 参数说明

    Returns:
        返回值说明
    """
    # 实现
    return result
```### 3. 错误处理

```python
def robust_agent(state: AgentState) -> AgentState:
    try:
        # 处理
        response = agent.invoke(state["messages"])

        if response.error:
            state["messages"].append({
                "role": "assistant",
                "content": "抱歉，出错了：" + response.error
            })
        else:
            state["messages"].append(response)

    except Exception as e:
        state["messages"].append({
            "role": "assistant",
            "content": "抱歉，系统出错：" + str(e)
        })

    return state
```---

## 📖 完整示例

### 智能助手 Agent

```python
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain.tools import tool

# 定义工具
@tool
def search(query: str) -> str:
    """搜索信息"""
    return f"搜索结果: {query}"

@tool
def calculator(expression: str) -> float:
    """计算表达式"""
    return eval(expression)

# 定义 State
class AssistantState(TypedDict):
    messages: list
    tools_used: list

# 定义节点
def process_message(state: AssistantState) -> AssistantState:
    """处理消息"""
    messages = state["messages"]
    last_message = messages[-1]["content"]

    # 根据内容决定使用工具
    if any(word in last_message for word in ["搜索", "查找"]):
        tool_name = "search"
        result = search.invoke(last_message)
    elif any(word in last_message for word in ["计算", "加", "减"]):
        tool_name = "calculator"
        result = calculator.invoke(last_message)
    else:
        tool_name = None
        result = "我需要更多信息"

    # 记录工具使用
    if tool_name:
        state["tools_used"].append(tool_name)

    state["messages"].append({
        "role": "assistant",
        "content": result
    })

    return state

# 创建 Graph
workflow = StateGraph(AssistantState)
workflow.add_node("process_message", process_message)
workflow.set_entry_point("process_message")
workflow.add_edge("process_message", END)

app = workflow.compile()

# 使用
result = app.invoke({
    "messages": [{"role": "user", "content": "帮我计算 123 + 456"}]
})
print(result["messages"][-1]["content"])
print(f"工具使用: {result['tools_used']}")
```---

## 常见问题

### Q: Agent 调用工具失败？

**A**: 检查工具实现和错误处理

### Q: Agent 不知道该用什么工具？

**A**: 使用合适的提示词和工具描述

---

## 下一步？

- 🔌 [工具集成](../06-工具集成/README.md)
- 📊 [监控分析](../08-监控分析/README.md)
- 🐛 [故障排查](../09-故障排查/README.md)

---

*本章节基于 docs.langchain.com/docs/langgraph*