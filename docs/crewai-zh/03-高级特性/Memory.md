# Memory - 记忆系统

> Agent 记住之前的对话

## 🎯 什么是 Memory?

Memory = Agent 的记忆功能
Agent 可以记住之前的对话内容

---

## 💻 使用记忆

```python
from crewai import Agent, Task, Crew

# 创建 Agent 时启用记忆
agent = Agent(
    role="助手",
    goal="帮助用户",
    memory=True  # 启用记忆
)
`````

---

## 🛠️ 记忆类型

### Buffer Memory
保存所有对话历史

### Window Memory
只保存最近 N 轮对话

### Summary Memory
保存对话摘要

---

## 💡 最佳实践

1. 长对话用 Window Memory
2. 需要完整历史用 Buffer Memory
3. 非常长对话用 Summary Memory

---

**下一篇**: [Knowledge](./Knowledge.md)