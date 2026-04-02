# LangSmith - 调试与监控工具

> LangSmith 是 LangChain 的官方调试和监控平台

## 🎯 什么是 LangSmith?

### 简单理解

**LangSmith** = AI 应用开发的"黑匣子"

就像飞机的飞行数据记录仪,LangSmith 记录:
- Agent 每一步的思考过程
- 调用了哪些工具
- 工具返回了什么结果
- 最终回答了什么

**类比**:
- 你开发 AI 应用
- 你想知道 Agent 为什么这样做
- 你想优化 Agent 的性能
- LangSmith 提供完整的执行追踪和可视化

---

## 📊 LangSmith 能做什么?

### 1. 追踪 (Tracing)

**记录完整的执行过程**:

```
用户输入: "帮我查旧金山天气"
    ↓
Agent 思考: 需要查天气,使用 search_weather 工具
    ↓
调用工具: search_weather.invoke("San Francisco")
    ↓
工具返回: "72°F"
    ↓
Agent 思考: 需要换算摄氏度,使用 calculator 工具
    ↓
调用工具: calculator.invoke("72°F to Celsius")
    ↓
工具返回: "22°C"
    ↓
最终回答: "旧金山天气 72°F,换算成摄氏度是 22°C"
```

### 2. 调试 (Debugging)

**查看 Agent 的决策过程**:

```python
# 在 LangSmith 控制台可以看到:
Agent 思考: "用户想查天气,我需要用 search_weather 工具"
→ 调用 search_weather("San Francisco")
→ 得到结果: "72°F"
→ 判断需要换算
→ 调用 calculator("72°F to Celsius")
→ 得到结果: "22°C"
→ 回答用户
```

### 3. 评估 (Evaluation)

**评估 Agent 的质量**:

```python
# LangSmith 可以:
- 对比不同 Agent 的回答质量
- 批量测试 Agent
- A/B 测试
- 自动评估指标
```

### 4. 监控 (Monitoring)

**生产环境监控**:

```python
# LangSmith 可以:
- 监控 API 调用次数
- 记录延迟
- 检测错误率
- 跟踪 Token 使用量
```

---

## 💻 如何使用 LangSmith

### 步骤 1: 安装

```bash
# 安装 LangSmith SDK
pip install langsmith

# 设置环境变量
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="your-api-key"
```

### 步骤 2: 在代码中启用

```python
import os
from langchain_openai import ChatOpenAI

# 设置 API Key
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "sk-xxx"
os.environ["LANGSMITH_PROJECT"] = "my-project"  # 项目名称

# 创建 LLM
llm = ChatOpenAI(model="gpt-4", temperature=0)

# 正常使用,所有执行都会被记录
response = llm.invoke("你好")
print(response.content)
```

### 步骤 3: 查看 Traces

1. 访问 LangSmith 控制台: https://smith.langchain.com
2. 登录并选择你的项目
3. 在 "Traces" 页面查看执行记录

---

## 🎮 LangSmith 界面介绍

### 1. Traces 页面

**查看所有执行记录**:

```
Traces 列表
┌─────────────────────────────────────────────────┐
│ Trace #12345  |  2026-04-02 15:00:00  | 2.3s  │
│ Trace #12344  |  2026-04-02 14:58:00  | 1.8s  │
│ Trace #12343  |  2026-04-02 14:56:00  | 0.5s  │
└─────────────────────────────────────────────────┘
```

点击某个 Trace 查看详情:

```
Trace 详情
┌─────────────────────────────────────────┐
│ 输入: "你好"                           │
│                                           │
│ 1. LLM 调用                             │
│    - Model: gpt-4                        │
│    - Tokens: 15/1024                    │
│    - Time: 1.2s                         │
│                                           │
│ 2. 工具调用                             │
│    - Tool: search_web                    │
│    - Input: "你好"                       │
│    - Output: "你好!"                      │
│    - Time: 0.5s                         │
│                                           │
│ 输出: "你好!有什么可以帮你的?"             │
└─────────────────────────────────────────┘
```

### 2. Runs 页面

**查看 Runs 列表**:

```
Runs 列表
┌─────┬───────────┬──────────┬──────────┬────────┐
│ ID  │ 名称      │ 类型     │ 状态     │ 耗时   │
├─────┼───────────┼──────────┼──────────┼────────┤
│ R1  │ Agent_1   │ Agent    │ 成功     │ 3.2s   │
│ R2  │ Agent_2   │ Chain    │ 成功     │ 1.1s   │
│ R3  │ RAG_App   │ Chain    │ 失败     │ 0.8s   │
└─────┴───────────┴──────────┴──────────┴────────┘
```

### 3. 调试面板

**实时查看执行过程**:

```python
# 启用详细模式
import os
os.environ["LANGSMITH_TRACING_V2"] = "true"
os.environ["LANGSMITH_CALLBACKS"] = "langsmith"

agent = create_agent(...)
result = agent.invoke("查询天气")
# 在控制台实时显示执行细节
```

---

## 🔍 Traces 示例

### 示例 1: 简单 Agent

```python
from langchain.agents import create_agent

agent = create_agent(
    model="gpt-4",
    tools=[...],
)

# 在 LangSmith 中可以看到:
# 1. 用户输入
# 2. Agent 思考
# 3. 工具调用
# 4. 工具结果
# 5. 最终回答
```

### 示例 2: RAG 应用

```python
from langchain.agents import create_agent

# 创建 RAG Agent
agent = create_agent(
    model="gpt-4",
    tools=[retriever],  # 使用检索器
)

# 在 LangSmith 中可以看到:
# 1. 用户提问
# 2. 检索相关文档
# 3. 阅读文档
# 4. 思考如何回答
# 5. 生成最终答案
```

---

## 📊 常用功能

### 1. 过滤和搜索

```python
# 在 LangSmith 控制台:
# - 按项目过滤
# - 按时间范围过滤
# - 按关键词搜索
# - 按状态过滤
```

### 2. 导出数据

```python
# 导出 Traces 到 JSON
from langsmith import trace

trace.export_to_json("output.json")
```

### 3. 批量测试

```python
# 使用 LangSmith 测试集
from langsmith import evaluate

dataset = [
    {"input": "天气如何?", "expected": "..."},
    {"input": "时间?", "expected": "..."},
]

results = evaluate(agent, dataset=dataset)
```

---

## 💡 使用技巧

### 技巧 1: 设置项目名称

```python
# 不同项目使用不同名称,方便管理
os.environ["LANGSMITH_PROJECT"] = "research-project"
os.environ["LANGSMITH_PROJECT"] = "customer-support"
```

### 技巧 2: 设置环境变量

```bash
# 使用 .env 文件
echo "LANGSMITH_TRACING=true" >> .env
echo "LANGSMITH_API_KEY=sk-xxx" >> .env
```

### 技巧 3: 查看 Token 使用

```python
# LangSmith 自动记录 Token 使用
# 在控制台可以看到:
# - 总 Token 数
# - 按模型统计
# - 按项目统计
```

### 技巧 4: 错误追踪

```python
# 查看所有失败的 Runs
# 分析失败原因
# 优化 Agent
```

---

## 🎓 最佳实践

### 1. 开发阶段

```python
# ✅ 启用详细追踪
os.environ["LANGSMITH_TRACING_V2"] = "true"

# ✅ 设置项目名称
os.environ["LANGSMITH_PROJECT"] = "dev"

# ✅ 定期查看 Traces
# 发现问题,优化 Agent
```

### 2. 测试阶段

```python
# ✅ 使用测试集
dataset = [...]

# ✅ 运行评估
evaluate(agent, dataset=dataset)

# ✅ 对比不同版本
```

### 3. 生产阶段

```python
# ✅ 监控关键指标
# - 延迟
# - 成功率
# - Token 使用

# ✅ 设置告警
# - 错误率过高
# - 延迟过长

# ✅ 定期优化
# - 根据数据优化 Prompt
# - 优化工具使用
```

---

## 🆚 LangSmith vs 其他工具

| 特性 | LangSmith | Other Tools |
|------|-----------|-------------|
| **深度集成** | ✅ 原生支持 | ❌ 需要手动集成 |
| **可视化** | ✅ 强大的可视化 | ⚠️ 功能有限 |
| **评估** | ✅ 内置评估 | ❌ 需要额外工具 |
| **成本** | ⚠️ 有免费额度 | 免费/不同收费 |
| **易用性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🚀 快速开始

```python
# 1. 安装
pip install langsmith

# 2. 设置环境变量
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="sk-xxx"

# 3. 使用 Agent
from langchain.agents import create_agent

agent = create_agent(model="gpt-4", tools=[...])
result = agent.invoke("查询天气")

# 4. 查看结果
# 访问 https://smith.langchain.com
# 查看 Traces 页面
```

---

## 📚 推荐阅读

- [LangSmith 官方文档](https://docs.langchain.com/langsmith)
- [Tracing 指南](https://docs.langchain.com/langsmith/tracing)
- [评估指南](https://docs.langchain.com/langsmith/evaluation)
- [监控指南](https://docs.langchain.com/langsmith/monitoring)

---

**下一篇**: [模型集成](./模型集成.md) - 各种 LLM 提供商使用