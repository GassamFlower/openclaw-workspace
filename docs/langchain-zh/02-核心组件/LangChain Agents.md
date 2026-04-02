# LangChain Agents (智能体)

> Agent 是 LangChain 最强大的功能 - 让 AI 自主决策

## 🎯 什么是 Agent?

### 传统 Chain vs Agent

**Chain (链)**:
- 你告诉 AI 每一步做什么
- AI 只执行,不思考
- ❌ 缺乏灵活性

**Agent (智能体)**:
- 你告诉 AI 目标
- Agent 自主决定怎么做
- ✅ 灵活智能

```python
# ❌ Chain: 你指定每一步
chain = SequentialChain([
    ("生成标题", generate_title),
    ("生成内容", generate_content),
    ("生成摘要", generate_summary),
])

# ✅ Agent: 你只给目标
agent = create_agent(
    model="gpt-4",
    tools=[...],
    system_prompt="写一篇关于 Python 的文章",
)
# Agent 会: 决定先写大纲,再写正文,最后写摘要
```

---

## 🧠 Agent 工作原理

### Agent 思考流程

```
用户输入: "请帮我查一下旧金山今天的天气,再告诉我换算成摄氏度"
    ↓
[观察] 理解用户意图 - 需要查天气和计算
    ↓
[思考] 选择工具 - weather_tool, calculator
    ↓
[行动] 调用工具 - weather_tool.invoke("San Francisco")
    ↓
[观察] 获取结果 - "72°F"
    ↓
[行动] 调用工具 - calculator.invoke("72°F 转摄氏度")
    ↓
[观察] 获取结果 - "22°C"
    ↓
[思考] 综合信息 - 结合两次结果回答用户
    ↓
[回答] 返回最终结果
```

---

## 💻 创建 Agent

### 基础 Agent

```python
from langchain.agents import create_agent

# 创建 Agent
agent = create_agent(
    model="gpt-3.5-turbo",
    tools=[],  # 暂时不给工具
    system_prompt="你是一个有用的助手",
)

# 运行
result = agent.invoke({
    "messages": [{"role": "user", "content": "你好!"}]
})
```

### 带工具的 Agent

```python
from langchain.agents import create_agent
from langchain.tools import tool

# 定义工具
@tool
def search_weather(city: str) -> str:
    """查询指定城市的天气"""
    return f"{city} 今天是晴天,温度 25°C"

@tool
def calculate(expression: str) -> str:
    """计算数学表达式"""
    try:
        return str(eval(expression))
    except:
        return "计算错误"

# 创建 Agent
agent = create_agent(
    model="gpt-4",
    tools=[search_weather, calculate],
    system_prompt="你是一个全能助手",
)

# Agent 会自动使用工具
response = agent.invoke({
    "messages": [{"role": "user", "content": "旧金山多少度? 换算成摄氏度"}]
})
```

---

## 🛠️ 自定义工具

### 定义工具的三种方式

#### 方式 1: 装饰器 (推荐)

```python
from langchain.tools import tool

@tool
def get_user_age(user_id: str) -> str:
    """查询用户年龄"""
    # 你的业务逻辑
    return "年龄: 25岁"

# 使用工具
tools = [get_user_age]
```

#### 方式 2: 类

```python
from langchain.tools import BaseTool
from pydantic import BaseModel

class CalculatorInput(BaseModel):
    expression: str

class CalculatorTool(BaseTool):
    name = "calculator"
    description = "计算数学表达式"
    args_schema = CalculatorInput

    def _run(self, expression: str):
        return str(eval(expression))

tools = [CalculatorTool()]
```

#### 方式 3: LangChain 工具

```python
from langchain.tools import Tool

def multiply(a: int, b: int) -> int:
    return a * b

tools = [
    Tool(
        name="Multiply",
        func=multiply,
        description="将两个数字相乘"
    )
]
```

### 工具最佳实践

```python
@tool
def search_database(query: str) -> str:
    """在数据库中搜索信息。

    Args:
        query: 搜索关键词

    Returns:
        搜索结果字符串

    例子:
        >>> search_database("用户信息")
        返回: [用户1, 用户2, ...]
    """
    # 实现搜索逻辑
    return result
```

**要点**:
- ✅ 清晰的描述 (被 AI 看到就能理解用途)
- ✅ 明确的参数和返回值
- ✅ 提供使用示例
- ✅ 异常处理

---

## 🧩 Agent 常见类型

### 1. ConversationalAgent (对话型)

专注多轮对话,适合客服、聊天助手。

```python
from langchain.agents import create_agent

agent = create_agent(
    model="gpt-3.5-turbo",
    tools=[],
    system_prompt="你是一个友好的聊天助手,记住对话历史。",
)
```

### 2. ToolCallingAgent (工具调用型)

主动使用工具,适合数据处理、查询类任务。

```python
agent = create_agent(
    model="gpt-4",
    tools=[calculator, search, database],
    system_prompt="你是一个工具助手,遇到问题先查询工具。",
)
```

### 3. MultiAgentAgent (多智能体)

多个 Agent 协作完成复杂任务。

```python
from langchain.agents import create_agent

# 专用 Agent
researcher = create_agent(model="gpt-4", tools=[search])
writer = create_agent(model="gpt-4", tools=[])

# 协作
result = multi_agent_workflow.invoke({
    "topic": "人工智能",
    "agents": [researcher, writer]
})
```

---

## 🎮 Agent 控制选项

### temperature 控制创造性

```python
agent = create_agent(
    model="gpt-3.5-turbo",
    tools=[...],
    temperature=0.0,  # 严格遵循指令
)
```

### 系统提示词 (System Prompt)

```python
system_prompt = """
你是一个专业助手。

规则:
1. 回答要简洁,不超过 100 字
2. 遇到不确定的问题要诚实说明
3. 优先使用工具查询信息
"""

agent = create_agent(
    model="gpt-4",
    tools=[...],
    system_prompt=system_prompt,
)
```

---

## 📊 Agent 决策过程

### 查看思考过程

```python
# 启用详细模式
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_CALLBACKS"] = "langsmith"

agent = create_agent(
    model="gpt-4",
    tools=[...],
)

# Agent 会显示每一步
response = agent.invoke({"messages": [{"role": "user", "content": "计算 123 * 456"}]})
```

在 LangSmith 中可以看到:
- 思考过程 (Thought)
- 工具调用 (Action)
- 工具结果 (Observation)
- 最终答案 (Final Answer)

---

## 🎯 实战示例

### 示例 1: 财务助手

```python
from langchain.agents import create_agent
from langchain.tools import tool
from langchain.memory import ConversationBufferMemory

@tool
def get_balance(account_id: str) -> str:
    """查询账户余额"""
    return f"账户 {account_id} 余额: 10,000 元"

@tool
def transfer_money(from_id: str, to_id: str, amount: float) -> str:
    """转账"""
    return f"成功从 {from_id} 转账 {amount} 元到 {to_id}"

agent = create_agent(
    model="gpt-4",
    tools=[get_balance, transfer_money],
    system_prompt="你是财务助手,管理账户和转账。",
)

memory = ConversationBufferMemory()

print(agent.invoke({
    "messages": [{"role": "user", "content": "查一下我的余额"}]
}, memory=memory))

print(agent.invoke({
    "messages": [{"role": "user", "content": "转 1000 到账户 002"}]
}, memory=memory))
```

### 示例 2: 学习助手

```python
@tool
def search_lesson(topic: str) -> str:
    """搜索课程内容"""
    lessons = {
        "python": "Python 简介",
        "java": "Java 基础",
        "ai": "人工智能概论",
    }
    return lessons.get(topic, "未找到相关课程")

@tool
def practice_questions(topic: str) -> str:
    """获取练习题"""
    return f"{topic} 相关练习题..."

agent = create_agent(
    model="gpt-3.5-turbo",
    tools=[search_lesson, practice_questions],
    system_prompt="你是学习助手,帮助用户学习和练习。",
)

# 用户: 我想学 Python
response1 = agent.invoke({
    "messages": [{"role": "user", "content": "我想学 Python"}]
})

# 用户: 给我 Python 练习题
response2 = agent.invoke({
    "messages": [{"role": "user", "content": "给我 Python 练习题"}]
})
```

---

## 🔧 常见问题

### Q: Agent 总是报错?

**原因**: 工具描述不清楚,Agent 不知道如何使用。

**解决**: 改进工具描述
```python
# ❌ 不好的描述
@tool
def search(): ...

# ✅ 好的描述
@tool
def search_database(query: str) -> str:
    """在数据库中搜索用户信息。
    Args:
        query: 搜索关键词
    Returns:
        搜索结果列表
    """
    ...
```

### Q: Agent 重复调用工具?

**原因**: Agent 没有正确理解工具结果。

**解决**: 确保工具返回清晰的信息

### Q: Agent 调用速度慢?

**原因**: 每次都重新思考。

**解决**: 使用 LangSmith 监控优化

---

## 📈 Agent 性能优化

### 1. 限制工具数量

不要给 Agent 太多工具,保持 3-5 个核心工具。

### 2. 使用专业工具

让 Agent 专注于擅长的事情:
- 查询用搜索工具
- 计算用计算器
- 分析用 LLM

### 3. 优化工具描述

简洁清晰的描述让 Agent 更高效。

---

## 🎓 学习建议

1. **入门**: 用基础 Agent 理解工作原理
2. **进阶**: 自定义工具,扩展 Agent 能力
3. **实战**: 构建一个完整的应用
4. **优化**: 使用 LangSmith 调试改进

---

**下一篇**: [LangGraph](./LangGraph.md) - Agent 编程框架