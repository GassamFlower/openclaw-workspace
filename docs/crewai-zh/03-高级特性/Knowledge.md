# Knowledge - 知识库

> Agent 访问知识库

## 🎯 什么是 Knowledge?

Knowledge = Agent 可以访问的知识库
Agent 从知识库中获取信息

---

## 💻 使用知识库

```python
from crewai import Agent, Task, Crew

# 创建 Agent 时添加知识库
agent = Agent(
    role="助手",
    goal="帮助用户",
    knowledge=["知识库1", "知识库2"]
)
``````

---

## 💡 最佳实践

1. 知识库内容要相关
2. 知识库要定期更新
3. 知识库要有权限控制

---

**下一篇**: [Planning](./Planning.md)