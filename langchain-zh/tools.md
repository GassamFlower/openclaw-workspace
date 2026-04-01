# LangChain 工具集成指南

> 让你的 Agent 真正能干活

---

## 🎯 工具是什么？

**工具 = Agent 的能力**

Agent 本身只能聊天，要让它能：
- 搜索网页
- 查询数据库
- 发送邮件
- 调用 API
- 执行代码

就需要通过工具来实现。

---

## 📚 内置工具

### 1. 搜索工具

```python
from langchain.tools import DuckDuckGoSearchRun, GoogleSearchAPIWrapper

# DuckDuckGo 搜索（免费）
search = DuckDuckGoSearchRun()

# Google 搜索（需要 API Key）
google_search = GoogleSearchAPIWrapper()

# 使用
result = search.run("LangChain 最新动态")
```

### 2. Python 工具

```python
from langchain.tools import PythonREPL

# Python REPL（安全执行代码）
python_repl = PythonREPL()

# 使用
result = python_repl.run("""
import pandas as pd
df = pd.read_csv('data.csv')
df.describe()
""")
```

### 3. 文件系统工具

```python
from langchain_community.tools import FileSearchTool

# 文件搜索工具
search = FileSearchTool()
```

---

## 🔧 自定义工具

### 方式 1：装饰器（推荐）

```python
from langchain.tools import tool

@tool
def get_weather(city: str) -> str:
    """
    获取指定城市的天气信息

    Args:
        city: 城市名称

    Returns:
        天气信息
    """
    # 你的业务逻辑
    if city == "北京":
        return "北京今天晴，22°C"
    elif city == "上海":
        return "上海今天多云，18°C"
    else:
        return "暂不支持该城市"

# 添加到工具列表
tools = [get_weather]

# 使用 Agent
from langchain.agents import create_tool_calling_agent
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4")
agent = create_tool_calling_agent(llm, tools)

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True
)

result = agent_executor.invoke({
    "input": "北京天气怎么样？"
})
```

### 方式 2：继承 Tool 类

```python
from langchain.tools import BaseTool
from pydantic import BaseModel, Field

# 定义参数
class WeatherInput(BaseModel):
    city: str = Field(description="城市名称")

# 自定义工具
class WeatherTool(BaseTool):
    name = "weather"
    description = "获取指定城市的天气信息"
    args_schema = WeatherInput

    def _run(self, city: str) -> str:
        # 你的业务逻辑
        return f"{city} 的天气是晴天，25°C"

# 使用
tools = [WeatherTool()]
```

---

## 🛠️ 常见工具示例

### 示例 1：数据库查询

```python
from langchain.tools import tool
import sqlite3

@tool
def query_database(sql: str) -> str:
    """
    执行 SQL 查询

    Args:
        sql: SQL 查询语句

    Returns:
        查询结果
    """
    try:
        conn = sqlite3.connect('data.db')
        cursor = conn.cursor()
        cursor.execute(sql)
        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()

        # 格式化结果
        result = "\n".join([", ".join(str(r) for r in row) for row in rows])
        return f"查询成功：\n{result}"

    except Exception as e:
        return f"查询失败：{str(e)}"
    finally:
        conn.close()

tools = [query_database]

# Agent 可以查询数据库
result = agent_executor.invoke({
    "input": "查询 sales 表中销售额最高的产品"
})
```

### 示例 2：天气查询（调用 API）

```python
import requests
from langchain.tools import tool

@tool
def get_weather_api(city: str) -> str:
    """
    调用天气 API 获取实时天气

    Args:
        city: 城市名称

    Returns:
        天气信息
    """
    api_url = "http://api.weather.com/v1/weather"
    params = {"city": city, "units": "metric"}

    try:
        response = requests.get(api_url, params=params, timeout=5)
        data = response.json()
        return f"{city}：{data['temp']}°C，{data['condition']}"
    except Exception as e:
        return f"获取天气失败：{str(e)}"

tools = [get_weather_api]
```

### 示例 3：邮件发送

```python
import smtplib
from email.mime.text import MIMEText
from langchain.tools import tool

@tool
def send_email(to: str, subject: str, body: str) -> str:
    """
    发送电子邮件

    Args:
        to: 收件人邮箱
        subject: 邮件主题
        body: 邮件正文

    Returns:
        发送结果
    """
    # 配置邮箱（建议使用环境变量）
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "your-email@gmail.com"
    password = "your-password"

    try:
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = sender_email
        msg['To'] = to

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, password)
            server.send_message(msg)

        return f"邮件已发送到 {to}"
    except Exception as e:
        return f"发送失败：{str(e)}"

tools = [send_email]
```

### 示例 4：计算器

```python
from langchain.tools import tool

@tool
def calculate(expression: str) -> str:
    """
    计算数学表达式

    Args:
        expression: 数学表达式，如 "1 + 1 * 2"

    Returns:
        计算结果
    """
    try:
        result = eval(expression)
        return f"计算结果：{result}"
    except Exception as e:
        return f"计算失败：{str(e)}"

tools = [calculate]

# Agent 可以计算
result = agent_executor.invoke({
    "input": "计算 123 + 456 * 789"
})
```

### 示例 5：调用第三方 API

```python
import requests
from langchain.tools import tool
from typing import TypedDict

class ApiRequest(TypedDict):
    url: str
    method: str
    headers: dict
    body: dict

@tool
def call_api(request: ApiRequest) -> str:
    """
    调用第三方 API

    Args:
        request: API 请求信息

    Returns:
        API 响应
    """
    try:
        response = requests.request(
            method=request["method"],
            url=request["url"],
            headers=request.get("headers"),
            json=request.get("body"),
            timeout=10
        )
        return f"状态码：{response.status_code}\n响应：{response.text}"
    except Exception as e:
        return f"请求失败：{str(e)}"

tools = [call_api]

# Agent 可以调用 API
result = agent_executor.invoke({
    "input": "调用 https://api.example.com/user，获取用户信息"
})
```

---

## 🎪 工具组合使用

### 场景：智能问答助手

```python
from langchain.tools import (
    DuckDuckGoSearchRun,
    PythonREPL,
    query_database
)

# 多个工具
search = DuckDuckGoSearchRun()
python_repl = PythonREPL()
db_tool = query_database

tools = [search, python_repl, db_tool]

# 创建 Agent
from langchain.agents import create_openai_functions_agent
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4", temperature=0)
agent = create_openai_functions_agent(llm, tools)

executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# Agent 可以：
# 1. 搜索信息
result = executor.invoke({"input": "最近 AI 行业有什么新闻？"})
# 2. 执行代码分析
result = executor.invoke({"input": "分析 data.csv 的销售数据"})
# 3. 查询数据库
result = executor.invoke({"input": "查询用户表的数据"})
```

---

## ⚠️ 安全注意事项

### 1. 验证输入

```python
@tool
def safe_divide(a: float, b: float) -> str:
    """安全除法"""
    if b == 0:
        return "除数不能为零"
    result = a / b
    return f"结果：{result}"

# ❌ 不安全（直接 eval 用户输入）
@tool
def unsafe_exec(code: str) -> str:
    return eval(code)

# ✅ 安全（限制范围）
@tool
def safe_calc(expression: str) -> str:
    # 只允许数学运算
    import re
    if not re.match(r'^[\d+\-*/().\s]+$', expression):
        return "只支持数学运算"
    try:
        return str(eval(expression))
    except:
        return "计算失败"
```

### 2. 使用环境变量

```python
import os
from langchain.tools import tool

@tool
def send_email_secure(to: str, subject: str, body: str) -> str:
    """发送邮件"""
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    sender_email = os.getenv("EMAIL_USER")
    password = os.getenv("EMAIL_PASSWORD")

    if not all([smtp_server, smtp_port, sender_email, password]):
        return "邮箱配置不完整"

    # ... 发送逻辑
```

### 3. 限制执行时间

```python
import signal
from contextlib import contextmanager

@contextmanager
def time_limit(seconds):
    def signal_handler(sig, frame):
        raise TimeoutError("执行超时")
    signal.signal(signal.SIGALRM, signal_handler)
    signal.alarm(seconds)
    try:
        yield
    finally:
        signal.alarm(0)

@tool
def limited_execution(code: str) -> str:
    """限制执行时间的代码工具"""
    try:
        with time_limit(5):  # 最多 5 秒
            exec(code)
    except TimeoutError:
        return "执行超时"
```

---

## 📊 工具性能优化

### 1. 工具缓存

```python
from functools import lru_cache

@tool
@lru_cache(maxsize=100)
def get_city_weather(city: str) -> str:
    """获取城市天气（带缓存）"""
    # 实际 API 调用
    return f"{city}：晴天，25°C"
```

### 2. 批量处理

```python
@tool
def batch_query(query: str, ids: list) -> str:
    """批量查询"""
    results = []
    for id in ids:
        results.append(f"查询 {id}: {query} -> 结果")
    return "\n".join(results)
```

---

## 🎯 最佳实践

### ✅ 推荐做法

1. **清晰的描述**
   ```python
   @tool
   def search_weather(city: str) -> str:
       """搜索指定城市的天气信息"""
       # ...
   ```

2. **明确的参数类型**
   ```python
   def send_message(to: str, subject: str, body: str) -> str:
       # ...
   ```

3. **错误处理**
   ```python
   @tool
   def safe_operation() -> str:
       try:
           # 业务逻辑
           return "成功"
       except Exception as e:
           return f"失败：{str(e)}"
   ```

4. **使用环境变量**
   - API Keys
   - 数据库连接
   - SMTP 配置

### ❌ 避免

1. 不要暴露敏感信息
2. 不要让 Agent 调用危险命令
3. 不要使用不安全的 eval/exec
4. 不要忽略错误处理

---

## 📖 学习资源

- [LangChain 官方文档 - Tools](https://python.langchain.com/docs/modules/tools/)
- [内置工具列表](https://python.langchain.com/docs/integrations/tools/)
- [创建自定义工具](https://python.langchain.com/docs/how_to/custom_tools/)

---

*最后更新：2026-04-01*