# API 参考 - API 文档

## 📚 核心 API

### Agent
```python
from crewai import Agent

agent = Agent(
    role="助手",
    goal="帮助用户",
    backstory="你是一位资深的助手",
    tools=[tool1, tool2],
    memory=True
)
`````

### Task
```python
from crewai import Task

task = Task(
    description="完成任务",
    agent=agent,
    expected_output="预期结果"
)
`````

### Crew
```python
from crewai import Crew

crew = Crew(
    agents=[agent1, agent2],
    tasks=[task1, task2],
    process="sequential",
    verbose=True
)

result = crew.kickoff()
```

---

## 📚 常用工具

### SerperDevTool
```python
from crewai_tools import SerperDevTool
tool = SerperDevTool()
result = tool.run("搜索")
```

### FileReadTool
```python
from crewai_tools import FileReadTool
tool = FileReadTool()
result = tool.run("文件路径")
```

---

**更新日期**: 2026-04-02