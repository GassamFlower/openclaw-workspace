# 08 - 监控分析

> LangGraph 应用的监控和分析

## 📊 监控概述

LangGraph 提供多种监控和分析工具。

### 监控功能

- 🔍 调试执行
- 📈 性能分析
- 📝 日志管理
- 📊 数据分析

---

## 🔍 LangSmith 集成

### 启用 Tracing

```python
import os

# 启用 LangSmith
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "your-api-key"
os.environ["LANGSMITH_PROJECT"] = "my-project"

# 现在所有调用都会被追踪
from langgraph.graph import StateGraph
app = workflow.compile()
```### 查看 Traces

1. 访问 LangSmith 控制台
2. 选择项目 "my-project"
3. 查看所有执行记录

---

## 📝 日志管理

### 基础日志

```python
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 在节点中使用
def my_node(state: State) -> State:
    logger.info(f"处理状态: {state}")

    # 处理
    result = process(state)

    logger.info(f"结果: {result}")
    return result
```### 结构化日志

```python
import json
import logging

class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }
        return json.dumps(log_data)

# 配置
handler = logging.StreamHandler()
handler.setFormatter(JsonFormatter())
logger.addHandler(handler)
```---

## 📊 性能分析

### 指标收集

```python
import time
from prometheus_client import Counter, Histogram, Gauge

# 定义指标
request_count = Counter('app_requests_total', 'Total requests')
request_duration = Histogram('app_request_duration_seconds', 'Request duration')
active_connections = Gauge('app_active_connections', 'Active connections')

# 使用
@app.get("/")
@request_duration.time()
def index():
    active_connections.inc()
    try:
        request_count.inc()
        return {"message": "Hello"}
    finally:
        active_connections.dec()
```### 节点执行时间

```python
import time
from functools import wraps

def measure_execution(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        duration = time.time() - start

        print(f"{func.__name__} 执行时间: {duration:.4f}秒")
        return result
    return wrapper

@measure_execution
def my_expensive_node(state: State) -> State:
    # 耗时操作
    time.sleep(1)
    return state
```### 数据库查询分析

```python
import time

def query_with_timing(query: str) -> list:
    start = time.time()
    result = execute_query(query)
    duration = time.time() - start

    print(f"查询耗时: {duration:.4f}秒, 结果数: {len(result)}")
    return result
```---

## 📈 用户反馈

### 反馈收集

```python
from fastapi import APIRouter

router = APIRouter()

@router.post("/feedback")
def submit_feedback(
    rating: int,
    comment: str,
    run_id: str
):
    """提交用户反馈"""
    # 保存反馈
    save_feedback(rating, comment, run_id)

    return {"status": "success"}

# 在应用中使用
from langchain_core.messages import BaseMessage

def process_with_feedback(state: State) -> State:
    # 处理
    response = agent.invoke(state["messages"])

    # 保存反馈接口
    return state
```---

## 🔧 调试工具

### 调试节点

```python
def debug_node(state: State) -> State:
    import pprint

    print("\n" + "="*50)
    print(f"节点: {inspect.currentframe().f_code.co_name}")
    print("="*50)

    print("\n输入 State:")
    pprint.pprint(state)

    print("\n处理中...")

    # 处理
    result = process(state)

    print("\n输出 State:")
    pprint.pprint(result)

    print("="*50 + "\n")

    return result
```### 断点续传

```python
from langgraph.checkpoint.postgres import PostgresSaver

checkpointer = PostgresSaver.from_conn_string("postgresql://...")

# 恢复执行
config = {"configurable": {"thread_id": "thread_123"}}
result = app.invoke({"messages": [...]}, config=config)

# 查看历史
for i, checkpoint in enumerate(app.get_state_history(config)):
    print(f"检查点 {i}: {checkpoint.values}")
```---

## 💾 日志备份

### 日志轮转

```python
import logging
from logging.handlers import RotatingFileHandler

# 文件日志轮转
handler = RotatingFileHandler(
    'app.log',
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5
)
logger = logging.getLogger()
logger.addHandler(handler)
```---

## 📊 数据分析

### 统计分析

```python
import json
from collections import defaultdict

def analyze_logs(log_file: str):
    """分析日志"""
    stats = {
        "total_requests": 0,
        "errors": 0,
        "avg_duration": 0,
        "by_node": defaultdict(int)
    }

    with open(log_file) as f:
        for line in f:
            log = json.loads(line)

            stats["total_requests"] += 1

            if log.get("level") == "ERROR":
                stats["errors"] += 1

            stats["by_node"][log.get("node", "unknown")] += 1

    return stats
```---

## 📖 完整示例

### 监控 Agent 执行

```python
import time
from langgraph.graph import StateGraph, END

class MonitoringState(TypedDict):
    messages: list
    metrics: dict

def monitored_agent(state: MonitoringState) -> MonitoringState:
    """带监控的 Agent"""

    # 记录开始时间
    start_time = time.time()

    # 处理
    response = agent.invoke(state["messages"])

    # 记录耗时
    duration = time.time() - start_time

    # 更新指标
    if "metrics" not in state:
        state["metrics"] = {}

    state["metrics"]["last_duration"] = duration
    state["metrics"]["total_calls"] = state["metrics"].get("total_calls", 0) + 1

    # 保存消息
    state["messages"].append(response)
    state["metrics"]["last_message"] = response.content

    return state

# 创建 Graph
workflow = StateGraph(MonitoringState)
workflow.add_node("monitored_agent", monitored_agent)
workflow.set_entry_point("monitored_agent")
workflow.add_edge("monitored_agent", END)

app = workflow.compile()

# 使用
result = app.invoke({
    "messages": [{"role": "user", "content": "你好"}],
    "metrics": {}
})
print(f"执行耗时: {result['metrics']['last_duration']:.2f}秒")
```---

## 常见问题

### Q: 如何查看执行历史？

**A**: 使用 LangSmith 控制台

### Q: 日志在哪里？

**A**: 配置文件、控制台或日志文件

---

## 下一步？

- 🐛 [故障排查](../09-故障排查/README.md)
- 🚀 [快速开始](../02-快速开始/README.md)

---

*本章节基于 docs.langchain.com/docs/langgraph*