# LangSmith 调试与监控指南

> 让你的 LLM 应用更可靠、更易调试

---

## 🎯 为什么需要 LangSmith？

**开发 LLM 应用就像开发一个黑盒：**
- 输入 → 模型 → 输出
- 中间的思考过程不可见
- 错误原因难以排查

**LangSmith 帮你：**
- 📊 可视化 Agent 的决策过程
- 🔍 调试中间步骤
- 📈 评估和优化性能
- 💾 追踪完整的调用链

---

## 🚀 快速开始

### 1. 安装并配置

```bash
pip install langsmith
```

```python
import os

# 设置 API Key（环境变量）
os.environ["LANGSMITH_API_KEY"] = "your-api-key"
os.environ["LANGSMITH_TRACING"] = "true"

# 可选：设置项目名称
os.environ["LANGSMITH_PROJECT"] = "my-project"
```

### 2. 基础使用

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4")

# LangSmith 会自动追踪这个调用
response = llm.invoke("你好，介绍一下 LangChain")
print(response)
```

现在在 [LangSmith](https://smith.langchain.com/) 控制台就能看到调用记录。

---

## 📊 查看调用链

### Agent 调用追踪

```python
from langchain.agents import create_tool_calling_agent
from langchain.agents import AgentExecutor
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4", temperature=0)

# 创建 Agent
agent = create_tool_calling_agent(llm, tools)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# 执行查询
result = executor.invoke({
    "input": "北京天气怎么样？"
})
```

**在 LangSmith 中可以看到：**
1. 用户输入
2. Agent 的思考过程
3. 调用的工具
4. 工具的返回结果
5. 最终输出

---

## 🔍 调试技巧

### 1. 启用详细日志

```python
executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,  # 控制台输出
    handle_parsing_errors=True,  # 自动处理解析错误
    max_iterations=5,  # 最大迭代次数
    early_stopping_method="generate"  # 提前停止策略
)
```

### 2. 检查 Agent 状态

```python
result = executor.invoke({
    "input": "查询天气",
    "config": {
        "run_name": "天气查询任务",
        "tags": ["production", "weather"],
        "metadata": {
            "user_id": "123",
            "project": "assistant"
        }
    }
})
```

### 3. 查看中间步骤

```python
from langchain.callbacks import get_openai_callback

with get_openai_callback() as cb:
    result = executor.invoke({
        "input": "查询北京天气"
    })

    print(f"总 Token 数：{cb.total_tokens}")
    print(f"总成本：${cb.total_cost}")
    print(f"调用次数：{cb.call_count}")
```

---

## 📈 性能评估

### 1. 基础指标

```python
from langchain.sm.evaluation import run_evaluator

# 评估回答质量
evaluator = run_evaluator(
    prompt="用户问题：{input}\n模型回答：{output}",
    criteria={
        "准确性": "回答是否准确",
        "相关性": "回答是否相关",
        "有帮助性": "是否有帮助"
    }
)
```

### 2. 对比不同模型

```python
models = ["gpt-3.5-turbo", "gpt-4", "claude-3-opus"]
results = {}

for model in models:
    llm = ChatOpenAI(model=model, temperature=0)
    response = llm.invoke("解释量子计算")
    results[model] = response

# 在 LangSmith 中对比不同模型的表现
```

### 3. A/B 测试

```python
from langchain.sm import compare

# 对比两个不同的提示词
comparison = compare(
    prompt_a="简洁回答",
    prompt_b="详细解释",
    inputs=["什么是人工智能？", "如何学习 Python？"]
)
```

---

## 🎨 可视化分析

### 1. 查看调用时间分布

```python
from langchain.sm import trace_analysis

# 分析调用链的时间
analysis = trace_analysis(
    trace_id="your-trace-id",
    metrics=["latency", "token_count", "tool_calls"]
)
```

### 2. 查看错误模式

```python
from langchain.sm import error_analysis

# 分析错误频率
errors = error_analysis(
    project="my-project",
    error_type="agent_execution_error"
)
```

---

## 💾 导出数据

### 1. 导出 Trace

```python
from langchain.sm import export_traces

# 导出所有 trace 到 JSON
traces = export_traces(
    project="my-project",
    format="json",
    output_path="./traces.json"
)
```

### 2. 导出统计数据

```python
from langchain.sm import export_stats

stats = export_stats(
    project="my-project",
    start_date="2026-01-01",
    end_date="2026-03-31",
    metrics=["tokens", "cost", "success_rate"]
)
```

---

## 🔧 自定义追踪

### 1. 添加自定义指标

```python
from langchain.tracing import trace

@trace(name="custom_tool", metadata={"category": "external"})
def my_custom_tool():
    # 业务逻辑
    return result
```

### 2. 添加标签和注释

```python
result = executor.invoke({
    "input": "查询天气",
    "tags": ["production", "urgent"],
    "metadata": {
        "user": "test_user",
        "session": "session_123"
    }
})
```

### 3. 手动创建 Run

```python
from langchain.tracing import create_run

run = create_run(
    project="my-project",
    name="手动追踪",
    input={"query": "测试查询"},
    tags=["manual"]
)

# 完成追踪
run.complete(
    output="测试结果",
    metadata={"cost": 0.01}
)
```

---

## 🚨 常见问题排查

### 问题 1：Agent 卡在循环中

**症状：** Agent 不断重复调用工具，没有进展

**解决：**
```python
executor = AgentExecutor(
    agent=agent,
    tools=tools,
    max_iterations=5,  # 限制最大迭代次数
    early_stopping_method="generate"  # 自动停止
)
```

### 问题 2：工具调用失败

**症状：** Agent 调用工具后报错

**解决：**
```python
executor = AgentExecutor(
    agent=agent,
    tools=tools,
    handle_parsing_errors=True,  # 捕获错误
    verbose=True  # 查看详细日志
)
```

### 问题 3：响应质量差

**症状：** Agent 回答不准确或无用

**解决：**
1. 在 LangSmith 中查看调用链
2. 检查 Agent 的系统提示词
3. 优化工具描述
4. 使用更好的模型

---

## 📊 实用指标

### 关键指标

| 指标 | 说明 | 目标值 |
|------|------|--------|
| 成功率 | 成功完成的调用比例 | > 95% |
| 平均延迟 | 调用平均耗时 | < 5s |
| Token 成本 | 平均每次调用成本 | < $0.01 |
| 错误率 | 出错的调用比例 | < 5% |

### 监控设置

```python
from langchain.sm import alert_on_failure

# 配置告警
alert_on_failure(
    project="my-project",
    threshold=0.1,  # 错误率超过 10%
    alert_channel="slack"
)
```

---

## 🎯 最佳实践

### ✅ 推荐做法

1. **始终启用 LangSmith**
   - 生产环境必须追踪
   - 开发阶段也要使用

2. **添加项目标签**
   - 按功能模块、环境、用户分组
   - 便于分析和对比

3. **定期分析数据**
   - 每周查看错误报告
   - 优化低效的调用链

4. **成本监控**
   - 设置成本预算
   - 监控异常增长

### ❌ 避免坑

1. **不要收集敏感信息**
   - 不要追踪用户数据
   - 使用数据脱敏

2. **不要忽略错误**
   - 查看错误日志
   - 修复常见问题

3. **不要过度追踪**
   - 只追踪关键调用
   - 避免隐私泄露

---

## 📖 学习资源

- [LangSmith 官方文档](https://docs.langchain.com/langsmith/home)
- [使用 LangSmith 调试](https://docs.langchain.com/langsmith/debug)
- [LangSmith 监控指南](https://docs.langchain.com/langsmith/monitor)
- [LangSmith 评估](https://docs.langchain.com/langsmith/evaluation)

---

## 💡 实战示例

### 完整的监控方案

```python
import os
from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor

# 配置 LangSmith
os.environ["LANGSMITH_API_KEY"] = os.getenv("LANGSMITH_API_KEY")
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_PROJECT"] = "my-assistant"

# 创建 LLM
llm = ChatOpenAI(model="gpt-4", temperature=0)

# 创建 Agent
agent = create_tool_calling_agent(llm, tools)
executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    handle_parsing_errors=True,
    max_iterations=5
)

# 执行并追踪
result = executor.invoke({
    "input": "查询天气",
    "tags": ["production", "assistant"]
})

# 查看统计数据
from langchain.sm import get_run_stats
stats = get_run_stats(project="my-assistant")
print(f"今日调用：{stats['total_runs']}")
print(f"平均成本：${stats['avg_cost']}")
```

---

*最后更新：2026-04-01*