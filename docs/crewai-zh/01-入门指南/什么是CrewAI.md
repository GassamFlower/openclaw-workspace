# 什么是 CrewAI?

## 🎯 核心定义

**CrewAI** 是一个用于构建**多智能体系统**的 Python 框架。

### 简单理解

想象一个**科研团队**:
- **研究员**: 负责收集资料
- **分析师**: 负责分析数据
- **写作专家**: 负责撰写报告

CrewAI 就是管理这个团队的框架,让 AI Agent 之间协作完成任务。

---

## 🏗️ 架构设计理念

```
┌─────────────────────────────────────────────────────┐
│                    你的应用                           │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │           Crew (团队管理)                    │   │
│  │  • 分配任务                                  │   │
│  │  • 协调协作                                  │   │
│  │  • 控制流程                                  │   │
│  └─────────────────────────────────────────────┘   │
│                       │                             │
│         ┌─────────────┼─────────────┐              │
│         ▼             ▼             ▼              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  Agent 1 │  │  Agent 2 │  │  Agent N │         │
│  │  (研究员) │  │ (分析师)  │  │ (写作者)  │         │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘         │
│        │             │             │                │
│  ┌─────▼─────┐  ┌────▼────┐  ┌────▼────┐          │
│  │  Tools    │  │  Tools  │  │  Tools  │          │
│  │  (工具)    │  │ (工具)  │  │ (工具)  │          │
│  └───────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────┘
```

---

## 💡 为什么需要 CrewAI?

### 传统方式: 单个 LLM

```python
# ❌ 一个模型完成所有工作
llm = ChatOpenAI()
result = llm.invoke("写一篇科技文章并分析数据")
# 问题: LLM 不擅长多任务,容易出错
```

### 使用 CrewAI: 多智能体协作

```python
# ✅ 多个 Agent 专长分工
researcher = Agent("研究", tools=[search_tool])
analyst = Agent("分析", tools=[data_tool])
writer = Agent("写作", tools=[])

crew = Crew([researcher, analyst, writer])
crew.kickoff("写一篇科技分析报告")
# 优势: 每个 Agent 专注自己的专长
```

---

## 🎯 CrewAI 能做什么?

### 1. 多智能体协作

**核心能力**: 让多个 AI Agent 共同工作

```python
# 场景: 文章写作
researcher = Agent(
    role="研究员",
    goal="收集最新科技资讯",
    tools=[search_tool]
)

writer = Agent(
    role="写作专家",
    goal="撰写高质量文章",
)

crew = Crew([researcher, writer])
```

### 2. 任务分工

**核心能力**: 清晰定义任务,分配给合适的 Agent

```python
task1 = Task(
    description="收集 AI 最新进展",
    agent=researcher
)

task2 = Task(
    description="撰写分析文章",
    agent=writer
)

crew = Crew([researcher, writer], tasks=[task1, task2])
```

### 3. 流程控制

**核心能力**: 管理任务执行顺序和方式

```python
# Sequential: 顺序执行
crew = Crew([agent1, agent2, agent3], process="sequential")

# Hierarchical: 层级管理
crew = Crew([manager, worker1, worker2], process="hierarchical")
```

### 4. 工具集成

**核心能力**: Agent 可以调用各种工具

```python
@tool
def search(query: str):
    """搜索网页"""
    return results

researcher = Agent(tools=[search])
```

### 5. 记忆系统

**核心能力**: Agent 可以记住对话历史

```python
researcher = Agent(memory=True)
```

---

## 🆚 CrewAI vs LangChain

### 功能对比

| 特性 | LangChain | CrewAI |
|------|-----------|--------|
| **适用场景** | 单个 Agent/Chain | 多智能体协作 |
| **Agent 管理** | 基础 | 专业化 |
| **工作流编排** | Chain/LangGraph | Crews + Flows |
| **工具库** | 有限 | 40+ 内置工具 |
| **记忆系统** | 基础 | 统一记忆系统 |
| **知识库** | 独立实现 | 内置 Knowledge |
| **企业特性** | 基础 | 完整 AMP 平台 |

### 使用建议

**选择 LangChain 当你:**
- 需要快速构建单个 Agent
- 任务相对简单
- 不需要复杂的协作

**选择 CrewAI 当你:**
- 需要多个 Agent 协作
- 任务需要专业分工
- 工作流程复杂
- 需要企业级部署和监控

---

## 🎮 实际应用场景

### 场景 1: 内容创作团队

**需求**: 写一篇深度分析文章

```
Researcher Agent
    ↓ 收集资料
    ↓
Analyst Agent
    ↓ 分析数据
    ↓
Writer Agent
    ↓ 撰写文章
    ↓
Editor Agent
    ↓ 修改润色
    ↓
Final Article
```

### 场景 2: 客服系统

**需求**: 自动处理客户问题

```
Customer Agent
    ↓ 理解问题
    ↓
Classification Agent
    ↓ 分类问题类型
    ↓
Resolution Agent
    ↓ 解决问题
    ↓
Escalation Agent
    ↓ 转人工
```

### 场景 3: 数据分析流水线

**需求**: 分析销售数据

```
Data Collector
    ↓ 抓取数据
    ↓
Data Processor
    ↓ 数据清洗
    ↓
Data Analyst
    ↓ 统计分析
    ↓
Report Generator
    ↓ 生成报告
```

---

## 🚀 快速对比: 单 Agent vs 多 Agent

### 单 Agent 方式 (LangChain)

```python
from langchain.agents import create_agent

agent = create_agent(
    model="gpt-4",
    tools=[search, calculate, write],
)

result = agent.invoke("研究 AI 行业,分析数据,写报告")
# Agent 自己决定怎么完成所有步骤
# 可能出现: 查了很多资料但没分析,分析完忘记写报告
```

### 多 Agent 方式 (CrewAI)

```python
from crewai import Agent, Task, Crew

researcher = Agent(
    role="研究员",
    tools=[search],
)

analyst = Agent(
    role="分析师",
    tools=[calculate],
)

writer = Agent(
    role="写作者",
    tools=[],
)

task1 = Task("研究 AI 行业", agent=researcher)
task2 = Task("分析数据", agent=analyst)
task3 = Task("写报告", agent=writer)

crew = Crew([researcher, analyst, writer], tasks=[task1, task2, task3])
crew.kickoff()
# 每个 Agent 专注自己的任务,质量更高
```

---

## 🎓 学习建议

### 初学者路径

1. **理解概念**: 本篇 - 了解 CrewAI 是什么
2. **核心概念**: 学习 Agent/Task/Crew
3. **快速开始**: 跑通第一个示例
4. **实践**: 构建简单团队

### 进阶路径

1. **高级特性**: Memory, Knowledge, Planning
2. **工具集成**: 理解如何使用和扩展工具
3. **Flows**: 学习高级工作流编排
4. **实战**: 构建复杂系统

### 企业路径

1. **部署**: 本地 → 云端 → CrewAI AMP
2. **监控**: Observability, Tracing
3. **评估**: A/B 测试,性能优化
4. **团队**: 多人协作,权限管理

---

## 📚 核心术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| Agent | Agent | 智能体,每个 AI 专家 |
| Task | Task | 任务,Agent 需要完成的工作 |
| Crew | Crew | 团队,多个 Agent 的集合 |
| Process | Process | 流程,任务执行的方式 |
| Tool | Tool | 工具,Agent 可以调用的功能 |
| Memory | Memory | 记忆,Agent 的上下文记忆 |
| Knowledge | Knowledge | 知识库,Agent 可以访问的信息 |
| Flow | Flow | 工作流,复杂流程编排 |
| AMP | AMP | CrewAI Platform,企业级平台 |

---

## 🎉 下一步

看完这个,你对 CrewAI 有初步认识了。接下来可以:

1. 阅读 [核心概念](./核心概念.md) - 了解术语详解
2. 运行 [快速开始](./快速开始.md) - 跑通第一个示例
3. 学习 [Agents](../02-核心组件/Agents.md) - 创建你的第一个 Agent

---

**建议阅读顺序**:
1. 本篇 → 核心概念 → 快速开始
2. Agents → Tasks → Crews
3. 然后根据兴趣选择高级特性

> 想了解更多?访问 [官方文档](https://docs.crewai.com/)