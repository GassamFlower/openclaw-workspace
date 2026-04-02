# CrewAI Agents - 智能体完全指南

> Agent 是 CrewAI 的核心 - 每个 Agent 都是一个 AI 专家

## 🎯 什么是 Agent?

### 简单理解

**Agent = AI 专家**

每个 Agent 都是一个独立的 AI,有自己的:
- 角色 (Role)
- 目标 (Goal)
- 背景故事 (Backstory)
- 技能 (Tools)
- 记忆 (Memory)

**类比**:
- 你组建一个研究团队
- 研究员 Agent = 专门做研究
- 写作 Agent = 专门写文章
- 编辑 Agent = 专门审核内容

---

## 💻 创建 Agent

### 基础 Agent

```python
from crewai import Agent

# 创建研究员 Agent
researcher = Agent(
    role="研究员",
    goal="收集和分析最新技术信息",
    backstory="""你是一位资深的科技研究员,拥有 10 年的研究经验。

    你擅长:
    - 快速查找和筛选信息
    - 分析技术趋势
    - 总结关键要点

    你的研究严谨、准确,总能找到最有价值的发现。""",
    verbose=True,
    memory=True,
    allow_delegation=False
)

# 创建写作 Agent
writer = Agent(
    role="写作专家",
    goal="撰写高质量的技术文章",
    backstory="""你是一位知名科技博客作家,写过超过 100 篇技术文章。

    你擅长:
    - 清晰表达复杂概念
    - 引人入胜的叙事
    - 专业的技术写作

    你的文章深受读者喜爱,阅读量屡创新高。""",
    verbose=True,
    memory=True,
    allow_delegation=False
)
```

### 高级 Agent

```python
from crewai import Agent

# 创建有特殊能力的 Agent
agent = Agent(
    role="数据分析师",
    goal="从数据中发现洞察",
    backstory="""你是一位数据科学专家,精通统计学和机器学习。

    你擅长:
    - 数据清洗和预处理
    - 统计分析
    - 可视化展示
    - 发现数据中的模式和趋势

    你总能从复杂的数据中提炼出有价值的见解。""",
    verbose=True,
    memory=True,
    allow_delegation=True,  # 可以委派任务
    tools=[...],  # 添加工具
    llm=...,  # 使用特定 LLM
    max_iter=10,  # 最大迭代次数
    backstory_template="你是一位{role},专注于{goal}...",  # 动态背景
    allow_code_execution=True,  # 允许执行代码
    context=[...]  # 提供上下文
)
```

---

## 🎨 Agent 属性详解

### 1. Role (角色)

```python
# 角色定义 Agent 的身份
role="研究员"  # Agent 是做什么的
role="数据分析师"  # Agent 的专业领域
role="客服助手"  # Agent 的服务对象
```

### 2. Goal (目标)

```python
# 目标定义 Agent 要达成什么
goal="收集最新技术信息"  # 具体的工作目标
goal="分析用户反馈数据"  # 分析任务
goal="优化产品用户体验"  # 改进任务
```

### 3. Backstory (背景故事)

```python
# 背景故事定义 Agent 的专业背景
backstory="""你是一位资深的科技研究员,拥有 10 年的研究经验。

你擅长:
- 快速查找和筛选信息
- 分析技术趋势
- 总结关键要点

你的研究严谨、准确,总能找到最有价值的发现。"""
```

**好的 backstory 特点**:
- ✅ 清晰的专业背景
- ✅ 具体的技能列表
- ✅ 行为准则
- ✅ 正向引导

### 4. Verbose (详细模式)

```python
# 显示 Agent 的思考过程
verbose=True  # 在控制台打印思考过程

# 输出示例:
# 🚀 Task Starting...
# [Thought] 用户想了解 AI,我应该先搜索最新信息
# [Action] search("AI 最新趋势")
# [Observation] AI 技术快速发展
# [Thought] 我应该总结这些信息
# [Action] summarize()
# [Final Answer] AI 技术正在快速发展...
```

### 5. Memory (记忆)

```python
# Agent 是否记住之前的对话
memory=True  # 启用记忆
memory=False  # 不记住

# 记忆类型:
# - Buffer Memory: 完整对话历史
# - Buffer Window Memory: 最近 N 轮对话
# - Summary Memory: 对话摘要
```

### 6. Allow Delegation (委派权限)

```python
# Agent 是否可以委派任务给其他 Agent
allow_delegation=True  # 可以委派
allow_delegation=False  # 不能委派

# 使用场景:
# Manager Agent: allow_delegation=True
# Worker Agents: allow_delegation=False
```

### 7. Tools (工具)

```python
# Agent 可以使用的工具
tools=[
    SerperDevTool(),  # 搜索工具
    CalculatorTool(),  # 计算工具
    DalleTool(),  # DALL-E 生成图像
]

# Agent 会根据需要自动选择工具
```

### 8. LLM (大语言模型)

```python
# Agent 使用的 LLM
llm=ChatOpenAI(model="gpt-4", temperature=0.7)

# 选择策略:
# - GPT-4: 复杂任务
# - GPT-3.5: 简单任务
# - 本地模型: 隐私考虑
```

### 9. Max Iterations (最大迭代次数)

```python
# Agent 最多尝试几次完成任务
max_iter=10  # 最多 10 次
max_iter=5  # 更严格的限制

# 防止 Agent 无限循环
```

---

## 🛠️ Agent 能力扩展

### 1. 使用 Tools

```python
from crewai_tools import SerperDevTool

# 创建 Agent 并使用工具
agent = Agent(
    role="研究员",
    goal="研究信息",
    tools=[SerperDevTool()],  # 搜索工具
    verbose=True
)
```

### 2. 使用 MCPs

```python
# 连接 MCP 服务器
from crewai import Agent

agent = Agent(
    role="智能助手",
    goal="完成各种任务",
    mcps=["mcp://github", "mcp://slack"],  # 连接 GitHub 和 Slack
    verbose=True
)
```

### 3. 使用 Skills

```python
# 使用技能包
from crewai import Agent

agent = Agent(
    role="编程专家",
    goal="编写代码",
    skills=["python", "javascript", "sql"],  # 编程技能
    verbose=True
)
```

### 4. 使用 Knowledge

```python
# 访问知识库
from crewai import Agent

agent = Agent(
    role="文档助手",
    goal="回答问题",
    knowledge=["company_docs", "tech_docs"],  # 知识库
    verbose=True
)
```

### 5. 使用 Apps

```python
# 调用应用程序
from crewai import Agent

agent = Agent(
    role="助手",
    goal="完成任务",
    apps=["slack", "gmail"],  # 调用 Slack 和 Gmail
    verbose=True
)
```

---

## 🎮 Agent 设计技巧

### 技巧 1: 清晰的角色定义

```python
# ❌ 不好的定义
agent = Agent(
    role="助手",
    goal="帮忙",
)

# ✅ 好的定义
agent = Agent(
    role="电商客服",
    goal="帮助顾客解决问题并提升购物体验",
    backstory="""你是一位经验丰富的电商客服,擅长处理各种顾客问题。

    你的优势:
    - 快速响应
    - 专业知识
    - 同理心

    你总是耐心倾听,提供准确的帮助。""",
)
```

### 技巧 2: 具体的目标

```python
# ❌ 模糊的目标
agent = Agent(
    role="研究员",
    goal="研究一些东西",
)

# ✅ 具体的目标
agent = Agent(
    role="研究员",
    goal="收集 3 个最新的 AI 技术信息并总结",
)
```

### 技巧 3: 丰富的背景故事

```python
# ❌ 简单的背景
agent = Agent(
    backstory="你很聪明",
)

# ✅ 丰富的背景
agent = Agent(
    backstory="""你是一位资深的金融分析师,拥有硕士学位和 CFA 证书。

    你在华尔街工作过 5 年,熟悉各种投资策略和金融市场分析。

    你的分析严谨、准确,总能找到投资机会。

    你特别擅长:
    - 市场趋势分析
    - 风险评估
    - 投资组合优化

    你的建议深受客户信赖。""",
)
```

### 技巧 4: 合理的工具选择

```python
# ❌ 工具过多
agent = Agent(
    tools=[
        search_tool, calculator, db_tool, api_tool,
        file_tool, email_tool, calendar_tool, ...
    ]
)

# ✅ 工具精简
agent = Agent(
    tools=[
        search_tool,  # 必需
        db_tool,      # 必需
    ]
)
```

---

## 🎯 常见 Agent 类型

### 1. 研究型 Agent

```python
researcher = Agent(
    role="研究员",
    goal="收集和分析信息",
    backstory="你是一位资深的科技研究员,擅长快速查找和总结信息",
    tools=[search_tool],
    verbose=True
)
```

### 2. 分析型 Agent

```python
analyst = Agent(
    role="数据分析师",
    goal="从数据中发现洞察",
    backstory="你是一位数据科学专家,精通统计学和可视化",
    tools=[db_tool, calculator],
    verbose=True
)
```

### 3. 创作型 Agent

```python
writer = Agent(
    role="写作专家",
    goal="撰写高质量内容",
    backstory="你是一位知名作家,擅长将复杂概念简单化",
    tools=[...],
    verbose=True
)
```

### 4. 编程型 Agent

```python
coder = Agent(
    role="编程专家",
    goal="编写和调试代码",
    backstory="你是一位资深开发者,精通多种编程语言",
    tools=[code_tool],
    allow_code_execution=True,
    verbose=True
)
```

### 5. 客服型 Agent

```python
customer_service = Agent(
    role="客服助手",
    goal="解决顾客问题",
    backstory="你是一位耐心的客服,擅长处理各种问题",
    tools=[knowledge_tool, search_tool],
    verbose=True
)
```

---

## 💡 Agent 最佳实践

### 1. 角色专业化

```python
# ✅ 每个 Agent 专注一个领域
researcher = Agent(role="研究员", goal="研究信息")
writer = Agent(role="写作者", goal="撰写内容")
editor = Agent(role="编辑", goal="审核内容")

# ❌ Agent 功能混杂
general_agent = Agent(role="助手", goal="什么都做")
```

### 2. 工具精简

```python
# ✅ 每个 Agent 只用必要的工具
agent = Agent(tools=[search_tool, calculator])

# ❌ 给 Agent 很多不相关的工具
agent = Agent(tools=[search, calc, db, api, email, calendar, ...])
```

### 3. 背景故事指导行为

```python
# ✅ 通过背景故事引导 Agent
backstory="你注重效率和准确性,从不拖延"

# ❌ 没有背景故事
```

### 4. 适当的委派权限

```python
# ✅ Manager 可以委派,Worker 不能
manager = Agent(allow_delegation=True)
worker = Agent(allow_delegation=False)

# ❌ 所有人都能委派
```

### 5. 合理的迭代次数

```python
# ✅ 根据任务复杂度设置
simple_task_agent = Agent(max_iter=3)
complex_task_agent = Agent(max_iter=10)

# ❌ 所有任务都用同一个迭代次数
```

---

## 🚀 进阶用法

### 1. 条件 Agent

```python
from crewai import Agent, Task

# 根据任务类型选择不同的 Agent
def select_agent(task_type: str):
    if task_type == "research":
        return researcher
    elif task_type == "analysis":
        return analyst
    else:
        return general_agent

# 使用
agent = select_agent("research")
```

### 2. 动态 Agent

```python
from crewai import Agent

# 根据 LLM 选择
agent = Agent(
    role="助手",
    goal="完成任务",
    llm=ChatOpenAI(model="gpt-4", temperature=0.7)
)
```

### 3. 多 Agent 协作

```python
# 创建专门的 Manager Agent
manager = Agent(
    role="项目经理",
    goal="协调团队完成目标",
    backstory="你擅长管理和协调",
    allow_delegation=True,
    verbose=True
)

# Worker Agents
analyst = Agent(...)
writer = Agent(...)

# 使用 Manager 协调
crew = Crew([manager, analyst, writer], process="hierarchical")
```

---

## 🎓 学习建议

### 初学者

1. 理解 Agent 的基本属性
2. 创建简单的 Agent
3. 尝试不同的工具

### 进阶者

1. 优化 Agent 设计
2. 创建专业化的 Agent
3. 实现复杂的 Agent 协作

### 专家

1. Agent 专业化
2. 高级 Agent 特性
3. 企业级 Agent 管理

---

**下一篇**: [Crews](./Crews.md) - 团队管理详解