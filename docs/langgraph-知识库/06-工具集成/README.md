# 06 - 工具集成

> 工具和外部服务集成

## 🎯 工具概述

LangGraph 支持多种工具集成方式。

### 集成类型

| 类型 | 说明 | 示例 |
|------|------|------|
| **LLM 工具** | LLM 调用 | ChatOpenAI |
| **自定义工具** | 自定义函数 | @tool 装饰器 |
| **API 集成** | HTTP 请求 | requests, httpx |
| **数据库** | 数据库操作 | PostgreSQL, MongoDB |

---

## 📝 定义工具

### 使用 @tool 装饰器

```python
from langchain.tools import tool

@tool
def search_web(query: str) -> str:
    """搜索网页内容

    Args:
        query: 搜索关键词

    Returns:
        搜索结果
    """
    # 实现逻辑
    return f"搜索: {query}"

# 使用
result = search_web.invoke({"query": "Python 教程"})
print(result)
```### Lambda 工具

```python
@tool
def hello(name: str) -> str:
    """问候工具"""
    return f"你好，{name}！"

# 或者使用 lambda
def hello_func(name: str) -> str:
    return f"你好，{name}！"

hello = tool(hello_func)
```### 复杂工具

```python
@tool
def complex_tool(
    param1: str,
    param2: int,
    param3: bool = False
) -> dict:
    """复杂工具示例

    Args:
        param1: 必需参数
        param2: 数字参数
        param3: 布尔参数，默认 False

    Returns:
        包含结果的字典
    """
    result = {
        "param1": param1,
        "param2": param2,
        "param3": param3,
        "status": "success"
    }
    return result

# 使用
result = complex_tool.invoke({
    "param1": "测试",
    "param2": 42
})
```---

## 🔌 API 集成

### 使用 requests

```python
import requests
from langchain.tools import tool

@tool
def get_weather(city: str) -> str:
    """获取天气信息

    Args:
        city: 城市
    """
    # 调用 API
    response = requests.get(
        f"https://api.weather.com/v1/weather?city={city}"
    )
    return response.json()

# 使用
result = get_weather.invoke({"city": "北京"})
```### 使用 httpx

```python
import httpx
from langchain.tools import tool

@tool
async def async_search(query: str) -> str:
    """异步搜索工具"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.search.com?q={query}"
        )
        return response.text

# 使用
result = await async_search.invoke({"query": "测试"})
```---

## 🗄️ 数据库集成

### PostgreSQL

```python
import psycopg2
from langchain.tools import tool

@tool
def query_database(query: str) -> str:
    """查询数据库

    Args:
        query: SQL 查询语句
    """
    conn = psycopg2.connect(
        dbname="mydb",
        user="user",
        password="password",
        host="localhost"
    )
    cursor = conn.cursor()
    cursor.execute(query)
    result = cursor.fetchall()
    conn.close()
    return str(result)

# 使用
result = query_database.invoke({"query": "SELECT * FROM users"})
```### MongoDB

```python
from pymongo import MongoClient
from langchain.tools import tool

@tool
def query_mongodb(collection: str, query: dict) -> list:
    """查询 MongoDB

    Args:
        collection: 集合名称
        query: 查询条件
    """
    client = MongoClient("mongodb://localhost:27017/")
    db = client["mydb"]
    collection = db[collection]
    results = list(collection.find(query))
    client.close()
    return results

# 使用
result = query_mongodb.invoke({
    "collection": "users",
    "query": {"name": "张三"}
})
```---

## 🌐 外部服务集成

### Slack 集成

```python
import slack_sdk
from langchain.tools import tool

@tool
def send_slack_message(channel: str, text: str) -> str:
    """发送 Slack 消息

    Args:
        channel: 频道
        text: 消息内容
    """
    client = slack_sdk.WebClient(token="xoxb-your-token")
    client.chat_postMessage(channel=channel, text=text)
    return "消息已发送"
```### Email 集成

```python
import smtplib
from email.message import EmailMessage
from langchain.tools import tool

@tool
def send_email(to: str, subject: str, body: str) -> str:
    """发送邮件

    Args:
        to: 收件人
        subject: 主题
        body: 内容
    """
    msg = EmailMessage()
    msg.set_content(body)
    msg["Subject"] = subject
    msg["To"] = to

    with smtplib.SMTP("smtp.example.com", 587) as server:
        server.starttls()
        server.login("user@example.com", "password")
        server.send_message(msg)

    return "邮件已发送"
```---

## 🧪 工具测试

### 单元测试

```python
import pytest
from unittest.mock import Mock

def test_search_web():
    """测试搜索工具"""
    result = search_web.invoke({"query": "测试"})
    assert "搜索: 测试" in result
```### 集成测试

```python
def test_api_tool():
    """测试 API 工具"""
    # 模拟 API 响应
    with patch('requests.get') as mock_get:
        mock_get.return_value.json.return_value = {
            "weather": "晴天"
        }

        result = get_weather.invoke({"city": "北京"})
        assert "晴天" in result
```---

## 💡 最佳实践

### 1. 工具设计

✅ **应该做**
- 简单明了
- 有清晰的文档
- 添加错误处理

❌ **不应该做**
- 工具过于复杂
- 直接调用敏感 API
- 不处理异常

### 2. 安全性

```python
@tool
def safe_query_database(query: str) -> str:
    """安全的数据库查询

    Args:
        query: SQL 查询（必须以 SELECT 开头）
    """
    if not query.upper().startswith("SELECT"):
        raise ValueError("只能执行 SELECT 查询")

    # 执行查询
    return execute_query(query)
```### 3. 性能优化

```python
from functools import lru_cache

@tool
@lru_cache(maxsize=100)
def expensive_operation(input_data: str) -> str:
    """缓存昂贵的操作"""
    # 耗时操作
    return process(input_data)
```---

## 📖 完整示例

### 多工具集成

```python
from langgraph.graph import StateGraph, END
from langchain.tools import tool
import requests

# 定义工具
@tool
def search_web(query: str) -> str:
    """搜索网页"""
    response = requests.get(
        f"https://api.search.com?q={query}"
    )
    return response.text

@tool
def send_email(to: str, subject: str, body: str) -> str:
    """发送邮件"""
    # 邮件发送逻辑
    return f"邮件已发送给 {to}"

@tool
def save_to_db(data: dict) -> str:
    """保存到数据库"""
    # 数据库保存逻辑
    return "数据已保存"

# 定义 State
class ToolState(TypedDict):
    messages: list
    result: str

# 定义节点
def process_with_tools(state: ToolState) -> ToolState:
    """使用工具处理"""
    messages = state["messages"]
    last_message = messages[-1]["content"]

    # 根据内容选择工具
    if "@" in last_message:
        # 解析邮件
        parts = last_message.split("@")
        state["result"] = send_email.invoke({
            "to": parts[1].split()[0],
            "subject": "新消息",
            "body": parts[0]
        })
    elif "搜索" in last_message:
        state["result"] = search_web.invoke({
            "query": last_message
        })
    else:
        state["result"] = "无法处理"

    return state

# 创建 Graph
workflow = StateGraph(ToolState)
workflow.add_node("process_with_tools", process_with_tools)
workflow.set_entry_point("process_with_tools")
workflow.add_edge("process_with_tools", END)

app = workflow.compile()

# 使用
result = app.invoke({
    "messages": [{"role": "user", "content": "搜索 Python 教程"}],
    "result": ""
})
print(result["result"])
```---

## 常见问题

### Q: 工具调用失败？

**A**: 检查工具实现和 API 配置

### Q: 如何测试工具？

**A**: 使用 mock 或实际调用测试

---

## 下一步？

- 📊 [监控分析](../08-监控分析/README.md)
- 🐛 [故障排查](../09-故障排查/README.md)
- 🚀 [部署运维](../07-部署运维/README.md)

---

*本章节基于 docs.langchain.com/docs/langgraph*