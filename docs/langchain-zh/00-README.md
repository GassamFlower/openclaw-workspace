# LangChain 中文知识库

> 本知识库基于 LangChain 官方文档整理,以通俗易懂的方式介绍 LangChain 框架的使用方法。

## 📚 目录结构

```
langchain-zh/
├── 00-README.md                    # 本文件 - 知识库导航
├── 01-入门指南/
│   ├── 什么是LangChain.md
│   ├── 核心概念.md
│   ├── 快速开始.md
│   └── 安装配置.md
├── 02-核心组件/
│   ├── LangChain Agents.md
│   ├── LangGraph.md
│   ├── 模型集成.md
│   ├── 工具与插件.md
│   └── 检索器.md
├── 03-应用构建/
│   ├── RAG应用.md
│   ├── 聊天机器人.md
│   ├── 工作流编排.md
│   └── 自定义Agent.md
├── 04-调试与监控/
│   ├── LangSmith基础.md
│   ├── 追踪与调试.md
│   ├── 评估系统.md
│   └── 性能优化.md
├── 05-部署与扩展/
│   ├── 部署指南.md
│   ├── 自托管部署.md
│   ├── 高级配置.md
│   └── 生产环境.md
└── 06-参考资料/
    ├── 常见问题.md
    ├── API参考.md
    └── 最佳实践.md
```

## 🎯 什么是 LangChain?

LangChain 是一个用于开发由大语言模型(LLM)驱动的应用程序的框架。它的核心价值:

1. **简单易用** - 用不到 10 行代码就能连接各种 LLM 提供商
2. **高度灵活** - 既可以快速构建简单 Agent,也可以深度定制复杂应用
3. **生态系统完善** - 与多种模型、工具、数据库无缝集成

### LangChain vs LangGraph vs Deep Agents

| 框架 | 适用场景 | 特点 |
|------|---------|------|
| **Deep Agents** | 快速构建复杂 Agent | 开箱即用,功能全面 |
| **LangChain** | 自定义 Agent 和应用 | 灵活性高,可深度定制 |
| **LangGraph** | 高级工作流编排 | 低级控制,支持复杂流程 |

## 💡 核心优势

### 1. 统一模型接口
不同 LLM 提供商有各自 API,LangChain 统一了调用方式,方便切换。

### 2. 内置 Agent 抽象
简单几行代码就能创建 Agent,但保留足够灵活性。

### 3. 基于 LangGraph 构建
Agent 运行在 LangGraph 之上,支持持久化、流式输出、人机协作等。

### 4. 强大的调试工具
使用 LangSmith 可以追踪请求、调试 Agent 行为、评估输出。

## 🚀 快速上手

### 最简示例 - 创建一个天气查询 Agent

```python
from langchain.agents import create_agent

def get_weather(city: str) -> str:
    """查询指定城市的天气"""
    return f"{city} 今天总是晴朗的!"

agent = create_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[get_weather],
    system_prompt="你是一个有用的助手",
)

# 运行 Agent
agent.invoke({
    "messages": [{"role": "user", "content": "旧金山的天气怎么样?"}]
})
```

## 📖 学习路径

1. **入门阶段** - 阅读入门指南,理解核心概念
2. **实践阶段** - 跟着示例构建第一个 RAG 应用
3. **进阶阶段** - 学习 LangGraph 编排复杂工作流
4. **精通阶段** - 使用 LangSmith 进行调试和优化

## 🔗 相关资源

- [官方文档](https://docs.langchain.com/)
- [LangSmith](https://langchain.com/langsmith) - 调试和监控平台
- [GitHub](https://github.com/langchain-ai/langchain) - 源代码
- [社区 Discord](https://discord.com/invite/clawd) - 技术交流

---

**最后更新**: 2026-04-02
**版本**: v1.0