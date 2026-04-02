# CrewAI 中文知识库

> 本知识库基于 CrewAI 官方文档整理,以通俗易懂的方式介绍 CrewAI 框架的使用方法。

## 📚 目录结构

```
crewai-zh/
├── 00-README.md                    # 本文件 - 知识库导航
├── 00-进度报告.md                   # 整理进度、完成情况
├── 01-入门指南/
│   ├── 什么是CrewAI.md
│   ├── 核心概念.md
│   ├── 安装配置.md
│   └── 快速开始.md
├── 02-核心组件/
│   ├── Agents.md
│   ├── Crews.md
│   ├── Tasks.md
│   ├── Tools.md
│   ├── Flows.md
│   └── Processes.md
├── 03-高级特性/
│   ├── Memory.md
│   ├── Knowledge.md
│   ├── Planning.md
│   ├── Reasoning.md
│   └── Skills.md
├── 04-工具集成/
│   ├── AI ML工具.md
│   ├── 数据库工具.md
│   ├── 文件处理工具.md
│   ├── 网页抓取工具.md
│   └── 第三方集成.md
├── 05-应用构建/
│   ├── 多智能体系统.md
│   ├── RAG应用.md
│   ├── 工作流编排.md
│   └── 企业级应用.md
├── 06-调试与监控/
│   ├── Observability.md
│   ├── Tracing.md
│   └── 评估系统.md
├── 07-部署与扩展/
│   ├── 本地部署.md
│   ├── 云端部署.md
│   ├── CrewAI AMP.md
│   └── 生产环境.md
├── 08-参考资料/
│   ├── 常见问题.md
│   ├── 最佳实践.md
│   └── API参考.md
└── 目录结构.txt                     # 快速跳转指南
```

## 🎯 什么是 CrewAI?

### 简单理解

**CrewAI** 是一个构建**多智能体系统**的框架。

**类比**:
- 你有一群专家
- 每个专家有自己的技能和工具
- 你指挥他们一起完成任务
- CrewAI 帮你管理这群专家的协作

**核心理念**:
> "让多个 AI Agent 协作,解决更复杂的问题"

---

## 🚀 快速上手

### 最简单的 Crew

```python
from crewai import Agent, Task, Crew

# 创建 Agent
researcher = Agent(
    role="研究员",
    goal="研究科技新闻",
    backstory="你是一位科技专家",
    verbose=True
)

# 创建 Task
task = Task(
    description="总结最新的 AI 新闻",
    agent=researcher
)

# 创建 Crew
crew = Crew(
    agents=[researcher],
    tasks=[task],
    verbose=True
)

# 运行
result = crew.kickoff()
```

---

## 💡 CrewAI 核心概念

### 1. Agent (智能体)

每个 AI Agent 就像一个**专家**:
- 有自己的角色
- 有特定的目标
- 有自己的技能
- 有记忆能力

### 2. Task (任务)

每个 Agent 需要完成的**工作**:
- 清晰的描述
- 分配给谁做
- 期望的输出

### 3. Crew (团队)

多个 Agent 组成的**团队**:
- 分配任务
- 协调工作
- 管理流程

### 4. Process (流程)

团队工作的**方式**:
- Sequential (顺序执行)
- Hierarchical (层级管理)
- Hybrid (混合模式)

---

## 🎮 Agent 的能力扩展

CrewAI Agent 可以通过 5 种方式扩展能力:

| 扩展方式 | 说明 | 示例 |
|---------|------|------|
| **Tools** | 使用外部工具 | 搜索工具、计算器 |
| **MCPs** | 连接 MCP 服务器 | 模型上下文协议 |
| **Apps** | 调用应用程序 | Slack、Gmail 集成 |
| **Skills** | 文件系统技能包 | 自定义指令集 |
| **Knowledge** | 知识库 | 文档、数据库 |

---

## 🏗️ CrewAI vs LangChain

| 特性 | LangChain | CrewAI |
|------|-----------|--------|
| 侧重点 | 通用 LLM 应用框架 | 专注多智能体协作 |
| 复杂度 | 中等 | 中等 |
| Agent 管理 | 基础 | 专业化 |
| 工作流编排 | Chain/LangGraph | Crews + Flows |
| 内置工具 | 有限 | 40+ 工具 |
| 企业特性 | 基础 | 完善 (AMP 平台) |

**选择建议**:
- 快速构建单个 Agent 应用 → LangChain
- 构建多智能体协作系统 → CrewAI
- 企业级部署和监控 → CrewAI AMP

---

## 📖 学习路径

### 第 1 天: 入门
1. 本篇文档
2. 核心概念
3. 快速开始

### 第 2-3 天: 基础构建
1. Agents 完全指南
2. Tasks 和 Crews
3. Processes 流程

### 第 4-7 天: 高级特性
1. Memory 记忆系统
2. Knowledge 知识库
3. Tools 工具集成

### 第 2 周: 实战
1. 多智能体系统
2. RAG 应用
3. Flows 工作流

### 第 3 周+: 生产
1. 部署与监控
2. 评估优化
3. 企业应用

---

## 🔗 相关资源

- [官方文档](https://docs.crewai.com/)
- [官网](https://crewai.com/)
- [GitHub](https://github.com/crewAIInc/crewAI)
- [社区论坛](https://community.crewai.com)

---

## 💼 实际应用场景

### 1. 内容创作
- 多 Agent 协作写文章
- 研究员 + 写作专家 + 编辑

### 2. 数据分析
- 数据分析师 Agent
- 质量检查 Agent
- 报告生成 Agent

### 3. 客服系统
- 知识查询 Agent
- 问题分类 Agent
- 转人工 Agent

### 4. 自动化工作流
- 邮件处理
- 数据抓取
- 自动报告

---

**最后更新**: 2026-04-02
**版本**: v1.0

> 本知识库持续更新,欢迎反馈建议!