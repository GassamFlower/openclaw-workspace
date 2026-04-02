# 什么是 LangChain?

## 🎯 简单理解

LangChain 是一个 **AI 应用开发框架**。它的作用就像搭积木的说明书:

- 你想用 ChatGPT、Claude 这些大模型做点什么?
- LangChain 告诉你 **怎么搭**、**用什么搭**、**搭起来能干嘛**。

想象一下:
- 你有一台很强大的电脑(大模型)
- 但不知道怎么用它来做具体的事情
- LangChain 就是那个 **说明书和工具箱**

## 📦 LangChain 能做什么?

LangChain 主要帮你解决以下问题:

### 1. 连接各种大模型
| 模型提供商 | LangChain 的支持 |
|-----------|------------------|
| OpenAI | ✅ 完全支持 |
| Anthropic | ✅ 完全支持 |
| Google | ✅ 完全支持 |
| 本地模型 | ✅ 完全支持 |

### 2. 让 LLM 拥有"手和脚" - 工具调用
```python
# 普通 LLM: 只会说话
llm = ChatOpenAI()
llm.invoke("帮我查一下今天天气")

# LangChain Agent: 会说话 + 会用工具
agent = create_agent(
    model="gpt-4",
    tools=[search_weather, get_news],  # 赋予工具
)
agent.invoke("帮我查一下旧金山的天气")
# Agent 会自动决定: 先用 search_weather,再把结果告诉用户
```

### 3. 让 LLM 记住上下文 - 对话记忆
```python
# 第1次对话: "我的名字叫小明"
# 第2次对话: Agent 记得上次你叫小明
# 第3次对话: Agent 记得你的名字叫小明,还知道你喜欢吃苹果
```

### 4. 让 LLM 读懂数据 - 检索增强生成(RAG)
```python
# 给 LLM 读取公司文档、产品手册
# 让它基于这些数据回答问题
rag = create_rag_chain(
    knowledge_base=pdf_documents,
    model="gpt-4",
)
rag.invoke("根据文档,公司的退款政策是什么?")
```

## 🏗️ LangChain 的架构

```
┌─────────────────────────────────────────────┐
│              你的应用代码                     │
│  (调用 LangChain 创建的 Agent/Chain)         │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│         LangChain 核心组件                    │
│  • Prompts (提示词模板)                       │
│  • Chains (链 - 把步骤串联起来)               │
│  • Agents (智能体 - 自主决策)                 │
│  • Tools (工具 - 调用外部服务)                 │
│  • Memory (记忆 - 对话历史)                    │
│  • Retrievers (检索器 - 查找相关知识)         │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│           LLM 提供商                          │
│  OpenAI / Anthropic / Google / 本地模型...    │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│        工具和数据源                          │
│  数据库 / API / 文件 / 网页搜索...            │
└─────────────────────────────────────────────┘
```

## 💡 为什么要用 LangChain?

### 问题场景: 不用 LangChain 怎么做?

```python
# ❌ 没有 LangChain,你要自己写很多代码
import openai

# 1. 构建提示词
prompt = f"用户问: {user_query}\n\n请根据以下知识库回答: {context}"

# 2. 调用 LLM
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": prompt}]
)

# 3. 解析结果
answer = response.choices[0].message.content

# 4. 如果需要查资料,再写代码查数据库
# 5. 如果需要记忆,写代码存历史
# 6. 如果需要工具,写代码调用 API
# ... N 多代码
```

### 解决方案: 用了 LangChain

```python
# ✅ 有 LangChain,简单清晰
from langchain.agents import create_agent

agent = create_agent(
    model="gpt-4",
    tools=[search_database],  # 直接给工具
)

answer = agent.invoke(user_query)  # 一句话搞定
```

## 🎮 LangChain vs 传统编程

| 特性 | 传统 Python 开发 | LangChain 开发 |
|------|------------------|----------------|
| 代码量 | 大量样板代码 | 简洁优雅 |
| LLM 集成 | 手动封装 API | 开箱即用 |
| 工具调用 | 手动判断逻辑 | Agent 自动决策 |
| 对话记忆 | 手动管理状态 | 自动处理历史 |
| 调试困难 | 黑盒调试 | LangSmith 可视化 |

## 🔍 实际应用场景

### 1. 智能客服
- 自动查询订单状态
- 解答常见问题
- 协调售后流程

### 2. 知识助手
- 基于公司文档回答问题
- 技术文档查询
- 竞品分析报告

### 3. 数据分析
- 自然语言查询 SQL
- 生成可视化图表
- 解释数据趋势

### 4. 内容创作
- 自动写文章
- 生成营销文案
- 翻译本地化

## 📚 核心概念速览

| 概念 | 英文 | 一句话解释 |
|------|------|-----------|
| 模型 | Model | LLM 本身 |
| 提示词 | Prompt | 告诉 LLM 做什么的文本 |
| 链 | Chain | 把多个步骤串起来 |
| 智能体 | Agent | 会自主决策的 Agent |
| 工具 | Tool | Agent 可以调用的外部功能 |
| 检索器 | Retriever | 从数据中查找相关信息 |
| 记忆 | Memory | 记住对话历史 |
| 检查点 | Checkpoint | Agent 状态保存点 |

## 🚀 下一步

看完这个,你对 LangChain 有初步认识了。接下来可以:

1. 阅读核心概念,了解术语
2. 运行快速开始示例
3. 构建你的第一个 Agent

---

**建议阅读顺序**:
1. 本篇 → 核心概念 → 快速开始
2. 然后根据兴趣选择方向: RAG / 聊天机器人 / LangGraph