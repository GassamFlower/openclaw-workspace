# 09 - 故障排查

> 常见问题和解决方法

## 🔍 快速诊断

### 查看日志

```bash
# 容器日志
docker logs langgraph

# 实时日志
docker logs -f langgraph

# 最近100行
docker logs --tail 100 langgraph
```### 健康检查

```python
@app.get("/health")
def health_check():
    try:
        # 测试数据库连接
        db.ping()

        # 测试 API 连接
        requests.get("https://api.openai.com/v1/models")

        return {"status": "healthy"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}
```---

## ❌ 常见问题

### 安装问题

**症状**：安装 LangGraph 失败

**解决方法**：
```bash
# 检查 Python 版本
python --version

# 确保版本 >= 3.10
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 重新安装
pip uninstall langgraph
pip install langgraph
```### 导入错误

**症状**：`ImportError: cannot import name 'langgraph'`

**解决方法**：
```bash
# 检查是否安装
pip list | grep langgraph

# 更新到最新版本
pip install --upgrade langgraph

# 检查依赖
pip install langchain langchain-openai
```---

### Graph 错误

**症状**：Graph 运行失败

**解决方法**：
```python
def safe_node(state: State) -> State:
    try:
        # 处理逻辑
        result = process(state)
        return result

    except Exception as e:
        # 错误处理
        print(f"节点错误: {e}")
        return {"error": str(e)}
```### 边连接错误

**症状**：`RuntimeError: Cycle detected`

**解决方法**：
- 检查循环边
- 确保 Graph 有入口点和出口点
- 验证节点函数签名

---

### State 错误

**症状**：State 更新失败

**解决方法**：
```python
# 检查 State 类型
def my_node(state: State) -> State:
    # 确保返回 State
    return {
        "messages": state.get("messages", []),
        "output": state.get("output", "")
    }
```### Checkpoint 错误

**症状**：持久化失败

**解决方法**：
```python
# 检查数据库连接
checkpointer = PostgresSaver.from_conn_string("postgresql://user:password@localhost/db")

# 测试连接
try:
    checkpointer.get({"configurable": {"thread_id": "test"}})
except Exception as e:
    print(f"Checkpoint 错误: {e}")
```---

### Agent 错误

**症状**：Agent 不调用工具

**解决方法**：
```python
# 检查工具注册
llm = ChatOpenAI(model="gpt-4")
llm_with_tools = llm.bind_tools([tool1, tool2])

# 测试工具调用
response = llm_with_tools.invoke("你好")
print(response.tool_calls)
```### 工具错误

**症状**：工具调用失败

**解决方法**：
```python
@tool
def safe_tool(param: str) -> str:
    """安全工具"""
    try:
        result = risky_operation(param)
        return result

    except Exception as e:
        # 返回友好的错误信息
        return f"工具执行失败: {str(e)}"
```---

## 🐛 调试技巧

### 添加调试信息

```python
def debug_node(state: State) -> State:
    import inspect

    # 打印节点信息
    print(f"执行节点: {inspect.currentframe().f_code.co_name}")
    print(f"输入: {state}")

    # 处理
    result = process(state)

    print(f"输出: {result}")

    return result
```### 使用断点

```python
# 在节点中添加断点
import pdb; pdb.set_trace()

def my_node(state: State) -> State:
    # 调试代码
    result = process(state)
    return result
```### 查看中间状态

```python
# 使用 LangSmith
import os
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "your-api-key"

# 在 LangSmith 控制台查看详细执行过程
```---

## 💡 最佳实践

### 1. 错误处理

```python
def robust_node(state: State) -> State:
    try:
        return safe_operation(state)

    except ConnectionError:
        return {"error": "网络连接失败"}

    except TimeoutError:
        return {"error": "请求超时"}

    except Exception as e:
        return {"error": f"未知错误: {str(e)}"}
```### 2. 日志记录

```python
import logging

logger = logging.getLogger(__name__)

def logged_node(state: State) -> State:
    logger.info(f"开始处理: {state}")

    try:
        result = process(state)
        logger.info(f"处理成功")
        return result

    except Exception as e:
        logger.error(f"处理失败: {e}")
        raise
```### 3. 回滚机制

```python
def safe_workflow(state: State) -> State:
    original_state = state.copy()

    try:
        # 处理
        result = process(state)
        return result

    except Exception as e:
        # 回滚
        print(f"发生错误，回滚状态")
        return original_state
```---

## 📊 性能问题

### 响应慢

**可能原因**：
- 网络延迟
- LLM 调用慢
- 数据库查询慢

**解决方法**：
```python
# 使用缓存
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_operation(input_data: str) -> str:
    # 耗时操作
    return result

# 使用流式输出
from langchain.schema import StreamingStdOutCallbackHandler

streaming_handler = StreamingStdOutCallbackHandler()
response = llm.invoke(
    "问题",
    callbacks=[streaming_handler]
)
```### 内存占用高

**解决方法**：
```python
# 定期清理 State
def cleanup_node(state: State) -> State:
    # 限制消息数量
    if len(state["messages"]) > 100:
        state["messages"] = state["messages"][-100:]

    # 清理临时数据
    if "temp_data" in state:
        del state["temp_data"]

    return state
```---

## 🔧 修复步骤

### 问题诊断流程

1. **查看日志**
   ```bash
   docker logs langgraph
   ```

2. **检查环境变量**
   ```bash
   echo $OPENAI_API_KEY
   echo $DATABASE_URL
   ```

3. **测试连接**
   ```python
   import requests
   requests.get("https://api.openai.com/v1/models")
   ```

4. **简化测试**
   ```python
   # 最简单的 Graph 测试
   workflow = StateGraph(State)
   workflow.add_node("test", lambda state: state)
   workflow.set_entry_point("test")
   workflow.add_edge("test", END)
   app = workflow.compile()
   result = app.invoke({})
   ```

5. **查看 LangSmith**
   - 访问控制台
   - 选择项目
   - 查看详细日志

---

## 📞 获取帮助

### 资源

- 📖 [官方文档](https://docs.langchain.com/docs/langgraph)
- 💬 [社区论坛](https://langchain.com/community)
- 🐛 [GitHub Issues](https://github.com/langchain-ai/langgraph/issues)
- 📧 [技术支持](https://langchain.com/support)

### 常见错误码

| 错误码 | 说明 | 解决方法 |
|--------|------|----------|
| `ImportError` | 导入失败 | 检查安装 |
| `RuntimeError` | 运行时错误 | 检查 Graph 配置 |
| `KeyError` | State 键不存在 | 检查 State 定义 |
| `ConnectionError` | 连接失败 | 检查网络和配置 |
| `TimeoutError` | 超时 | 增加超时时间 |

---

## 下一步？

- 🚀 [快速开始](../02-快速开始/README.md)
- 🎯 [核心概念](../01-核心概念/README.md)

---

*本章节基于 docs.langchain.com/docs/langgraph*