# RAG 应用 - RAG 应用

> 使用 CrewAI 构建 RAG 应用

## 🎯 应用场景

- 企业知识库
- 客服系统
- 文档查询

---

## 💻 基础示例

```python
from crewai import Agent, Task, Crew
from crewai_tools import SerperDevTool

# 创建 Agent
agent = Agent(
    role="助手",
    goal="回答问题",
    tools=[SerperDevTool()]
)

# 创建 Task
task = Task(
    description="回答问题: {question}",
    agent=agent
)

# 创建 Crew
crew = Crew(agents=[agent], tasks=[task])

# 运行
result = crew.kickoff(inputs={"question": "LangChain 是什么?"})
```