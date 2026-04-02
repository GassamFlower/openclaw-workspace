# Observability - 可观测性

> 监控 Agent 行为

## 🎯 监控指标

- 响应时间
- 错误率
- Token 使用
- 用户满意度

---

## 💻 使用示例

```python
# 使用 LangSmith 监控
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"

# 自动追踪所有调用
response = llm.invoke("问题")
```