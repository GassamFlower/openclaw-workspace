# AI ML 工具 - AI 工具使用

> Agent 可以使用的 AI 工具

## 🎯 常用工具

- CodeInterpreter: 执行代码
- DalleTool: 生成图像
- WhisperTool: 语音识别
- TTS: 文本转语音

---

## 💻 使用示例

```python
from crewai_tools import CodeInterpreter

# 创建工具
tool = CodeInterpreter()

# 使用
result = tool.run("计算 1+2")
````