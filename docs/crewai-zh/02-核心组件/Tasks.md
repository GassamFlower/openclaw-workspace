# Tasks - Tasks 任务管理完全指南

> CrewAI Tasks 是 Crew 中的基本工作单元

## 🎯 什么是 Tasks?

### 简单理解

**Tasks = 工作描述**

每个 Task 定义了:
- Agent 负责什么
- 需要完成什么工作
- 工作的详细描述

---

## 💻 创建 Task

### 基础 Task

```python
from crewai import Agent, Task

# 创建 Agent
researcher = Agent(
    role="研究员",
    goal="收集信息",
)

# 创建 Task
research_task = Task(
    description="收集关于 {topic} 的最新信息",
    agent=researcher,
)

# 使用
crew = Crew(
    agents=[researcher],
    tasks=[research_task],
)
`````

---

## 🛠️ Task 属性详解

### 1. description

```python
task = Task(
    description="详细描述任务内容",
    agent=researcher
)
````

### 2. agent

```python
task = Task(
    description="收集信息",
    agent=researcher,  # 指定 Agent
)
````

### 3. expected_output

```python
task = Task(
    description="收集信息",
    agent=researcher,
    expected_output="一份包含 5 个关键要点的报告"
)
`````

### 4. async_execution

```python
task = Task(
    description="收集信息",
    agent=researcher,
    async_execution=True  # 异步执行
)
````

### 5. context

```python
task = Task(
    description="收集信息",
    agent=researcher,
    context=[previous_task]  # 依赖的任务
)
`````

### 6. tools

```python
from crewai_tools import SerperDevTool

task = Task(
    description="收集信息",
    agent=researcher,
    tools=[SerperDevTool()]  # 指定工具
)
`````

---

## 🎮 实战示例

### 示例 1: 内容创作任务流

```python
from crewai import Agent, Task, Crew

# Agents
researcher = Agent(role="研究员", goal="收集信息")
writer = Agent(role="写作者", goal="撰写文章")
editor = Agent(role="编辑", goal="编辑内容")

# Tasks
research_task = Task(
    description="收集关于 {topic} 的最新信息",
    agent=researcher,
    expected_output="包含 5 个关键要点的信息列表"
)

writing_task = Task(
    description="根据收集的信息写一篇文章",
    agent=writer,
    expected_output="一篇完整的文章"
)

editing_task = Task(
    description="编辑文章,确保质量",
    agent=editor,
    expected_output="编辑后的文章"
)

# Crew
crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, writing_task, editing_task],
    process="sequential"
)

# 运行
result = crew.kickoff(inputs={"topic": "人工智能"})
``````

---

## 💡 Task 设计技巧

### 技巧 1: 清晰的描述

```python
# ✅ 清晰的描述
task = Task(
    description="收集关于 AI 的最新信息,包括发展历程、主要技术、应用场景",
    agent=researcher
)

# ❌ 模糊的描述
task = Task(
    description="收集信息",
    agent=researcher
)
`````

### 技巧 2: 明确的预期输出

```python
# ✅ 明确的预期输出
task = Task(
    description="收集信息",
    agent=researcher,
    expected_output="一份包含 5 个关键要点的报告,格式为 JSON"
)
`````

### 技巧 3: 合理的工具使用

```python
# ✅ 精简的工具
task = Task(
    description="搜索信息",
    agent=researcher,
    tools=[SerperDevTool()]
)

# ❌ 工具过多
task = Task(
    description="搜索信息",
    agent=researcher,
    tools=[tool1, tool2, tool3, tool4, tool5, ...]
)
``````

---

## 🚀 进阶用法

### 1. Task 依赖

```python
# Task 依赖: writing_task 依赖 research_task
research_task = Task(
    description="收集信息",
    agent=researcher
)

writing_task = Task(
    description="撰写文章",
    agent=writer,
    context=[research_task]  # 依赖前面的任务
)
``````

### 2. 条件任务

```python
# 根据条件添加任务
if need_review:
    review_task = Task(
        description="审核内容",
        agent=reviewer
    )
    tasks = [research_task, writing_task, review_task]
else:
    tasks = [research_task, writing_task]

crew = Crew(agents=agents, tasks=tasks)
``````

### 3. Task 组

```python
# 创建 Task 组
content_tasks = [
    Task(description="收集信息", agent=researcher),
    Task(description="撰写文章", agent=writer),
    Task(description="编辑内容", agent=editor),
]

crew = Crew(agents=[researcher, writer, editor], tasks=content_tasks)
`````

---

## 🎯 Task 应用场景

### 1. 内容创作

```
研究 → 撰写 → 编辑 → 发布
````

### 2. 数据分析

```
收集数据 → 清洗数据 → 分析数据 → 生成报告
``````

### 3. 客服流程

```
接待 → 处理 → 追踪
`````

---

**下一篇**: [Tools](./Tools.md) - 工具使用详解