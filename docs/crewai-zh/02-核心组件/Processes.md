# Processes - 流程编排

> Crew 的执行方式

## 🎯 Process 类型

### Sequential (顺序执行)
任务按顺序执行: task1 → task2 → task3

### Hierarchical (层级执行)
上级 Agent 委派任务: manager → worker

### Mixed (混合执行)
根据任务类型选择执行方式

---

## 💻 使用示例

```python
# 顺序执行
crew = Crew(
    agents=[agent1, agent2],
    tasks=[task1, task2],
    process="sequential"
)

# 层级执行
crew = Crew(
    agents=[manager, worker],
    tasks=[task1, task2],
    process="hierarchical"
)
`````

---

## 💡 最佳实践

1. 简单任务用 Sequential
2. 复杂任务用 Hierarchical
3. 根据场景选择

---

**下一篇**: [高级特性](../03-高级特性/)