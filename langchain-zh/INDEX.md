# LangChain 中文知识库

> 通俗易懂的 LLM 应用开发指南

---

## 📚 知识库目录

### 📖 文档列表

| 文档 | 说明 | 适用人群 |
|------|------|----------|
| [README.md](./README.md) | 入门指南 | 新手入门 |
| [tools.md](./tools.md) | 工具集成 | 需要集成外部工具的开发者 |
| [langsmith.md](./langsmith.md) | 调试监控 | 生产环境部署者 |
| [cheatsheet.md](./cheatsheet.md) | 快速参考 | 日常开发参考 |
| [PROJECT.md](./PROJECT.md) | 项目结构 | 项目开发者 |

---

## 🎯 如何选择文档

### 新手入门路径

```
1. 阅读 README.md
   → 了解 LangChain 是什么
   → 掌握基础概念

2. 阅读 cheatsheet.md
   → 快速上手
   → 常用代码一查即用

3. 开始实践
   → 创建第一个 Agent
   → 完成简单项目
```

### 进阶开发者路径

```
1. 阅读 tools.md
   → 掌握工具集成
   → 自定义工具开发

2. 阅读 langsmith.md
   → 学习调试技巧
   → 配置监控方案

3. 实战项目
   → 部署生产环境
   → 性能优化
```

### 项目开发者路径

```
1. 阅读 PROJECT.md
   → 了解项目结构
   → 建立规范

2. 阅读 cheatsheet.md
   → 熟悉常用模式

3. 开发项目
   → 按照规范组织代码
   → 实现功能
```

---

## 📚 核心知识点

### 1. LangChain 基础

- **LLM 集成**：统一接口，随时切换模型
- **Memory**：让 Agent 记住上下文
- **Tools**：调用外部功能
- **Agents**：智能决策和工作流

### 2. 开发技巧

- **快速上手**：10 行代码创建 Agent
- **工具集成**：支持搜索、数据库、API 等
- **调试监控**：LangSmith 可视化追踪
- **最佳实践**：避免常见坑

### 3. 实战场景

- 🤖 智能助手
- 📝 文档问答
- 📊 数据分析
- 🔍 信息搜索
- 💬 聊天机器人

---

## 🚀 快速开始

### 最简单的 Agent

```python
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4")
agent = create_agent(llm, tools)
result = agent.invoke({"messages": [{"role": "user", "content": "你好"}]})
```

**就这么简单！**

---

## 📖 学习路线图

### 阶段 1：基础入门（1-2 周）

- [x] 阅读 README.md
- [x] 了解基础概念
- [ ] 运行第一个示例
- [ ] 理解 LLM、Chain、Agent

### 阶段 2：进阶开发（2-3 周）

- [x] 阅读 cheatsheet.md
- [ ] 掌握 Memory 管理
- [ ] 学习工具集成
- [ ] 完成实战项目

### 阶段 3：高级应用（3-4 周）

- [x] 阅读 tools.md
- [ ] 自定义工具开发
- [ ] 使用 LangSmith 调试
- [ ] 优化性能

### 阶段 4：项目实战（持续）

- [x] 阅读 PROJECT.md
- [ ] 建立项目结构
- [ ] 部署生产环境
- [ ] 持续优化

---

## 🎯 常见问题

### Q: LangChain 和 LangGraph 有什么区别？

**A:** LangChain 更适合快速开发，LangGraph 更适合复杂工作流编排。新手从 LangChain 开始。

### Q: 如何选择 Memory？

**A:**
- 简单聊天：`ConversationBufferMemory`
- 长期记忆：`VectorStoreRetrieverMemory`
- 临时缓存：`SummaryBufferMemory`

### Q: Agent 总是循环怎么办？

**A:** 增加 `max_iterations` 参数，设置 `early_stopping_method`。

### Q: 如何优化成本？

**A:**
1. 使用 LangSmith 监控
2. 优化提示词
3. 使用缓存
4. 选择合适的模型

---

## 💡 使用建议

### ✅ 推荐做法

1. **从简单开始**
   - 先跑通示例
   - 再扩展功能

2. **边学边做**
   - 每个概念都实践
   - 记录学习笔记

3. **善用工具**
   - LangSmith 调试
   - 快速参考卡片

4. **持续学习**
   - 关注官方文档
   - 参与社区讨论

### ❌ 避免坑

1. 不要一上来就做复杂项目
2. 不要硬编码 API Key
3. 不要忽略错误处理
4. 不要过度依赖 AI

---

## 🔗 相关资源

### 官方资源

- 📖 [Python LangChain 文档](https://python.langchain.com/docs/)
- 🔍 [LangSmith 调试工具](https://docs.langchain.com/langsmith/home)
- 🐙 [GitHub 仓库](https://github.com/langchain-ai/langchain)
- 💬 [Discord 社区](https://discord.com/invite/clawd)

### 示例项目

- [LangChain Cookbook](https://github.com/langchain-ai/langchain/tree/master/cookbook)
- [LangGraph Examples](https://github.com/langchain-ai/langgraph/tree/main/examples)

### 学习资料

- [OpenAI API 文档](https://platform.openai.com/docs/)
- [Anthropic API 文档](https://docs.anthropic.com/)
- [LangChain 中文博客](https://python.langchain.com/docs/)（需要梯子）

---

## 🎓 知识库结构

```
langchain-zh/
├── README.md              # 入门指南
├── tools.md               # 工具集成详解
├── langsmith.md           # 调试监控指南
├── cheatsheet.md          # 快速参考卡片
├── PROJECT.md             # 项目结构说明
└── INDEX.md              # 本文档
```

---

## 📊 知识库统计

| 文档 | 字数 | 适合 | 难度 |
|------|------|------|------|
| README.md | ~7000 | 新手 | ⭐⭐ |
| tools.md | ~8000 | 开发者 | ⭐⭐⭐ |
| langsmith.md | ~6000 | 部署者 | ⭐⭐⭐⭐ |
| cheatsheet.md | ~6000 | 日常 | ⭐⭐ |
| PROJECT.md | ~7000 | 项目者 | ⭐⭐⭐⭐ |

---

## 🎉 开始学习

**现在就开始你的 LangChain 学习之旅吧！**

1. 阅读最简单的 README.md
2. 运行第一个示例
3. 逐步掌握进阶概念
4. 完成自己的项目

**记住：实践出真知！** 🚀

---

## 📝 更新日志

### 2026-04-01
- ✅ 创建完整的中文知识库
- ✅ 包含入门、进阶、实战内容
- ✅ 添加快速参考和项目规范

---

## 🤝 贡献

如果你发现错误或希望添加内容，欢迎改进！

---

## 📄 许可证

本知识库采用 MIT 许可证。

---

*最后更新：2026-04-01*

**祝你学习愉快！有问题随时查阅文档！** 📚✨