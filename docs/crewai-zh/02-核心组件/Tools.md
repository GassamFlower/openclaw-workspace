# Tools - 工具使用详解

> Agent 可以调用的外部功能

## 🎯 什么是 Tools?

Tools = Agent 的"手和脚"
Agent 通过 Tools 调用外部功能

---

## 💻 创建工具

### 基础工具

```python
from crewai_tools import SerperDevTool

# 创建搜索工具
search_tool = SerperDevTool()

# 使用
result = search_tool.run("LangChain")
````

### 自定义工具

```python
from crewai import Tool

def search_database(query: str) -> str:
    """搜索数据库"""
    return f"搜索: {query}"

tool = Tool(
    name="SearchDatabase",
    func=search_database,
    description="搜索数据库信息"
)
````

---

## 🛠️ 常用工具

- SerperDevTool: 搜索
- CodeInterpreter: 执行代码
- FileReadTool: 读取文件
- DalleTool: 生成图像

---

## 💡 最佳实践

1. 清晰的工具描述
2. 精简工具数量 (3-5 个)
3. 合理的工具分配

---

**下一篇**: [Processes](./Processes.md) - 流程编排