# Crews - Crews 团队管理完全指南

> CrewAI Crews 是核心组件,用于管理和协调多个 Agent

## 🎯 什么是 Crews?

### 简单理解

**Crews = Agent 团队管理器**

一个 Crew 包含多个 Agent,它们可以协同工作完成复杂任务。

**类比**:
- Agent = 团队成员 (研究员、写作者、编辑)
- Crew = 项目经理
- 任务 = 项目目标

---

## 💻 创建 Crew

### 基础 Crew

```python
from crewai import Agent, Task, Crew

# 创建 Agents
researcher = Agent(
    role="研究员",
    goal="收集信息",
    backstory="你是一位资深的科技研究员",
    verbose=True
)

writer = Agent(
    role="写作者",
    goal="撰写文章",
    backstory="你是一位知名作家",
    verbose=True
)

# 创建 Tasks
research_task = Task(
    description="收集关于 {topic} 的最新信息",
    agent=researcher
)

writing_task = Task(
    description="根据收集的信息写一篇文章",
    agent=writer
)

# 创建 Crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    verbose=True
)

# 运行
result = crew.kickoff(inputs={"topic": "AI"})
print(result)
`````

---

## 🛠️ Crews 属性详解

### 1. agents

```python
# 定义 Crew 中的 Agents
crew = Crew(
    agents=[
        Agent(
            role="研究员",
            goal="收集信息",
        ),
        Agent(
            role="写作者",
            goal="撰写文章",
        ),
        Agent(
            role="编辑",
            goal="审核内容",
        ),
    ]
)
`````

### 2. tasks

```python
# 定义 Crew 中的 Tasks
crew = Crew(
    agents=[researcher, writer],
    tasks=[
        Task(description="收集信息", agent=researcher),
        Task(description="撰写文章", agent=writer),
    ]
)
````

### 3. process

```python
# 顺序执行
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process="sequential"  # 默认值
)

# 层级执行
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process="hierarchical"  # 层级管理
)
`````

### 4. memory

```python
# 启用记忆
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    memory=True
)
````

### 5. verbose

```python
# 显示详细输出
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    verbose=True
)
`````

### 6. max_iter

```python
# 最大迭代次数
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    max_iter=10  # 最多 10 次迭代
)
`````

---

## 🎮 实战示例

### 示例 1: 新闻编辑团队

```python
from crewai import Agent, Task, Crew

# 创建 Agents
reporter = Agent(
    role="记者",
    goal="收集新闻素材",
    backstory="你是一位经验丰富的记者",
    tools=[...]
)

editor = Agent(
    role="编辑",
    goal="编辑新闻稿",
    backstory="你是一位资深编辑",
    tools=[...]
)

proofreader = Agent(
    role="校对",
    goal="校对稿件",
    backstory="你是一位严格的校对员",
    tools=[...]
)

# 创建 Tasks
collect_news = Task(
    description="收集关于 {topic} 的最新新闻",
    agent=reporter
)

edit_news = Task(
    description="编辑新闻稿,确保准确性和流畅性",
    agent=editor
)

proofread_news = Task(
    description="校对新闻稿,检查错误",
    agent=proofreader
)

# 创建 Crew
news_crew = Crew(
    agents=[reporter, editor, proofreader],
    tasks=[collect_news, edit_news, proofread_news],
    process="sequential"
)

# 运行
result = news_crew.kickoff(inputs={"topic": "人工智能"})
`````

### 示例 2: 产品开发团队

```python
# 创建 Agents
product_manager = Agent(
    role="产品经理",
    goal="定义产品需求",
    backstory="你是一位经验丰富的产品经理"
)

designer = Agent(
    role="设计师",
    goal="设计产品界面",
    backstory="你是一位优秀的设计师"
)

developer = Agent(
    role="开发者",
    goal="实现功能",
    backstory="你是一位资深开发者"
)

# 创建 Tasks
define_requirements = Task(
    description="定义产品需求和功能",
    agent=product_manager
)

design_interface = Task(
    description="设计产品界面",
    agent=designer
)

implement_features = Task(
    description="实现产品功能",
    agent=developer
)

# 创建 Crew
dev_crew = Crew(
    agents=[product_manager, designer, developer],
    tasks=[define_requirements, design_interface, implement_features],
    process="hierarchical"  # 层级管理
)

# 运行
result = dev_crew.kickoff(inputs={"product": "AI助手"})
`````

---

## 📊 Process 类型详解

### 1. Sequential (顺序执行)

```python
# 任务按顺序执行
crew = Crew(
    agents=[agent1, agent2, agent3],
    tasks=[task1, task2, task3],
    process="sequential"
)

# 执行顺序: task1 → task2 → task3
`````

### 2. Hierarchical (层级执行)

```python
# 层级管理,上级 Agent 可以委派任务
crew = Crew(
    agents=[manager, worker1, worker2],
    tasks=[task1, task2, task3],
    process="hierarchical"
)

# 执行顺序: manager → worker1 → worker2
````

### 3. Mixed (混合执行)

```python
# 混合执行方式
crew = Crew(
    agents=[agent1, agent2, agent3],
    tasks=[task1, task2, task3],
    process="mixed"
)

# 根据任务类型选择执行方式
`````

---

## 💡 Crew 设计技巧

### 技巧 1: 合理的 Agent 数量

```python
# ✅ 3-5 个 Agent
crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[task1, task2, task3]
)

# ❌ Agent 过多
crew = Crew(
    agents=[agent1, agent2, agent3, agent4, agent5, agent6],
    tasks=[task1, task2, task3]
)
`````

### 技巧 2: 明确的任务分配

```python
# ✅ 每个 Task 只分配给一个 Agent
task1 = Task(description="收集信息", agent=researcher)
task2 = Task(description="撰写文章", agent=writer)

# ❌ Task 分配混乱
task1 = Task(description="收集信息", agent=writer)
task2 = Task(description="撰写文章", agent=writer)
````

### 技巧 3: 清晰的角色定义

```python
# ✅ 明确的角色
researcher = Agent(
    role="研究员",
    goal="收集信息",
    backstory="你是一位资深的科技研究员"
)

# ❌ 模糊的角色
general_agent = Agent(
    role="助手",
    goal="帮助",
)
`````

---

## 🚀 进阶用法

### 1. 动态 Agent 选择

```python
from crewai import Agent, Task, Crew

class DynamicCrew:
    def __init__(self):
        self.agents = {
            "research": research_agent,
            "writing": writing_agent,
            "coding": coding_agent,
        }

    def select_agent(self, task_type):
        return self.agents[task_type]

# 使用
crew = Crew(
    agents=[self.select_agent("research")],
    tasks=[task1]
)
`````

### 2. 条件任务执行

```python
from crewai import Agent, Task, Crew

# 根据条件决定是否执行某个任务
if need_review:
    review_task = Task(
        description="审核内容",
        agent=reviewer
    )

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task, review_task] if need_review else [research_task, writing_task]
)
`````

### 3. Agent 依赖关系

```python
from crewai import Agent, Task, Crew

# 定义 Agent 依赖
researcher = Agent(role="研究员")
writer = Agent(role="写作者", depends_on=researcher)

# 创建 Crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task]
)
`````

---

## 🎯 Crew 应用场景

### 1. 内容创作团队

```
研究员 → 写作者 → 编辑 → 校对
````

### 2. 产品开发团队

```
产品经理 → 设计师 → 开发者 → 测试员
````

### 3. 客服团队

```
接待员 → 技术员 → 经理
`````

---

## 💡 最佳实践

### 1. 清晰的团队结构

```python
# ✅ 明确的团队角色
team = [
    Agent(role="项目经理"),
    Agent(role="技术负责人"),
    Agent(role="开发人员"),
    Agent(role="测试人员"),
]
````

### 2. 合理的任务分配

```python
# ✅ 每个 Agent 有明确的任务
agent1 = Agent(role="研究员", goal="收集信息")
task1 = Task(description="收集信息", agent=agent1)
````

### 3. 适当的委派权限

```python
# ✅ Manager 可以委派,Worker 不能
manager = Agent(allow_delegation=True)
worker = Agent(allow_delegation=False)
`````

---

## 🎓 学习建议

### 初学者

1. 理解 Crew 的基本概念
2. 创建简单的 Crew
3. 尝试不同的 Process 类型

### 进阶者

1. 设计复杂的团队
2. 实现动态 Agent 选择
3. 优化团队协作

### 专家

1. 高级团队设计
2. 企业级应用
3. 性能优化

---

**下一篇**: [Tasks](./Tasks.md) - Tasks 任务管理