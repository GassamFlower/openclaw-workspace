# Planning - 规划功能

> Agent 自动规划任务

## 🎯 什么是 Planning?

Planning = Agent 自动规划任务步骤
Agent 会分析任务并分解为多个步骤

---

## 💻 使用规划

```python
agent = Agent(
    role="助手",
    goal="完成复杂任务",
    planning=True  # 启用规划
)
``````

---

## 💡 最佳实践

1. 复杂任务启用规划
2. 简单任务不需要规划
3. 规划过程要可追踪

---

**下一篇**: [Skills](./Skills.md)