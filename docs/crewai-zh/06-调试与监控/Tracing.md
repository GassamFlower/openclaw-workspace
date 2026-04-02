# Tracing - 追踪

> 追踪 Agent 执行过程

## 🎯 追踪功能

- 执行流程
- 工具调用
- Agent 决策
- 错误日志

---

## 💻 使用示例

```python
# 启用详细输出
crew = Crew(
    agents=[agent],
    tasks=[task],
    verbose=True
)

# 运行
result = crew.kickoff()
```