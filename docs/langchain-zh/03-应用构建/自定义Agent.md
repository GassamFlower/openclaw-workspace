# 自定义 Agent 开发

> 手把手教你创建自己的 Agent

## 🎯 什么是自定义 Agent?

### 简单理解

**自定义 Agent = 根据你的需求定制的 AI 助手**

你不需要满足于通用的 Agent,可以:
- 创建专门领域的 Agent (如: 法律助手、医疗助手)
- 定义特定的行为和规则
- 集成特定的工具和数据源

**类比**:
- 通用 Agent = 通用的客服助手
- 自定义 Agent = 专门的法律咨询助手

---

## 💻 自定义 Agent 创建方法

### 方法 1: 使用 create_tool_agent

```python
from langchain.agents import create_tool_agent
from langchain_openai import ChatOpenAI

# 定义工具
from langchain.tools import Tool

def search_database(query: str) -> str:
    """搜索数据库"""
    return f"搜索结果: {query}"

tools = [
    Tool(
        name="Search",
        func=search_database,
        description="搜索数据库"
    )
]

# 创建 Agent
llm = ChatOpenAI(model="gpt-4")

agent = create_tool_agent(
    llm=llm,
    tools=tools,
    prompt="你是一个搜索助手"
)

# 使用
result = agent.invoke({"messages": [{"role": "user", "content": "搜索点什么?"}]})
````

### 方法 2: 创建自定义 Agent 类

```python
from langchain.agents import Agent
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from langchain.tools import Tool

class CustomAgent(Agent):
    def __init__(self, llm, tools, system_prompt):
        super().__init__()
        self.llm = llm
        self.tools = tools
        self.memory = ConversationBufferMemory()
        self.system_prompt = system_prompt

    def invoke(self, input_data):
        # 1. 加载记忆
        memory = self.memory.load_memory_variables(input_data)

        # 2. 构建提示词
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}")
        ])

        # 3. 创建 Chain
        chain = prompt | self.llm | self.memory

        # 4. 运行
        return chain.invoke(input_data)

# 使用
agent = CustomAgent(
    llm=ChatOpenAI(model="gpt-4"),
    tools=[search_tool],
    system_prompt="你是一个专业的客服助手"
)

result = agent.invoke({"input": "你好"})
````

### 方法 3: 使用 LangChain Expression Language (LCEL)

```python
from langchain_openai import ChatOpenAI
from langchain.tools import Tool
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

# 定义工具
search_tool = Tool(
    name="Search",
    func=lambda x: f"搜索: {x}",
    description="搜索信息"
)

# 创建 Agent Chain
llm = ChatOpenAI(model="gpt-4")

def run_agent(query):
    # 1. 调用工具
    tool_result = search_tool.invoke(query)

    # 2. 构建提示词
    prompt = ChatPromptTemplate.from_messages([
        ("system", "你是一个助手,根据工具结果回答问题"),
        ("user", f"问题: {query}\n工具结果: {tool_result}")
    ])

    # 3. 生成回答
    return prompt | llm

# 使用
agent_chain = run_agent
result = agent_chain("搜索 LangChain")
````

---

## 🎮 自定义 Agent 示例

### 示例 1: 法律咨询 Agent

```python
from langchain_openai import ChatOpenAI
from langchain.tools import Tool
from langchain.memory import ConversationBufferMemory

# 法律知识库
legal_knowledge = """
1. 合同法: 合同是平等主体的自然人、法人或者其他组织设立、变更、终止民事权利义务关系的协议。
2. 劳动法: 用人单位应当建立劳动规章制度,保障劳动者合法权益。
3. 消费者权益保护法: 消费者享有知情权、选择权等权利。
"""

# 创建法律知识检索工具
def search_legal(query: str) -> str:
    """搜索法律知识"""
    if "合同" in query:
        return legal_knowledge.split("1.")[1].split("2.")[0]
    elif "劳动" in query:
        return legal_knowledge.split("2.")[1].split("3.")[0]
    elif "消费者" in query:
        return legal_knowledge.split("3.")[1]
    else:
        return "抱歉,我不确定这个法律问题。"

# 创建工具
tools = [Tool(
    name="SearchLegal",
    func=search_legal,
    description="搜索法律知识"
)]

# 创建 Agent
llm = ChatOpenAI(model="gpt-4", temperature=0)

class LegalAgent:
    def __init__(self):
        self.llm = llm
        self.tools = tools
        self.memory = ConversationBufferMemory()

    def chat(self, user_input):
        # 构建提示词
        prompt = f"""
        你是一个专业的法律咨询助手。

        规则:
        1. 使用 SearchLegal 工具查询法律知识
        2. 回答要准确、专业
        3. 遇到不懂的问题要诚实说明

        用户问题: {user_input}
        """

        # 调用 LLM
        response = self.llm.invoke(prompt)
        return response.content

# 使用
legal_agent = LegalAgent()
answer = legal_agent.chat("劳动合同要注意什么?")
print(answer)
````

### 示例 2: 代码助手 Agent

```python
from langchain_openai import ChatOpenAI
from langchain.tools import Tool
from langchain.memory import ConversationBufferMemory

# 代码库
code_library = """
Python:
def hello():
    print("Hello")

def add(a, b):
    return a + b

JavaScript:
function hello() {
    console.log("Hello");
}

React:
const App = () => {
    return <div>Hello</div>;
}
"""

# 代码搜索工具
def search_code(query: str) -> str:
    """搜索代码"""
    if "python" in query:
        return code_library.split("Python:")[1]
    elif "javascript" in query:
        return code_library.split("JavaScript:")[1]
    elif "react" in query:
        return code_library.split("React:")[1]
    else:
        return "没有找到相关代码"

# 创建工具
tools = [Tool(
    name="SearchCode",
    func=search_code,
    description="搜索代码示例"
)]

# 创建代码助手
llm = ChatOpenAI(model="gpt-4", temperature=0)

class CodeAssistant:
    def __init__(self):
        self.llm = llm
        self.tools = tools
        self.memory = ConversationBufferMemory()

    def assist(self, query):
        prompt = f"""
        你是一个编程助手。

        工具: SearchCode - 搜索代码示例

        规则:
        1. 先使用 SearchCode 工具搜索代码
        2. 根据搜索结果回答问题
        3. 提供完整的代码示例

        用户问题: {query}
        """

        response = self.llm.invoke(prompt)
        return response.content

# 使用
code_assistant = CodeAssistant()
answer = code_assistant.assist("Python 如何求和?")
print(answer)
````

### 示例 3: 医疗咨询 Agent

```python
from langchain_openai import ChatOpenAI
from langchain.tools import Tool
from langchain.memory import ConversationBufferMemory

# 医疗知识库
medical_knowledge = """
1. 体温: 正常体温是 36.5-37.5°C
2. 血压: 正常血压是 120/80 mmHg
3. 糖尿病: 典型症状是多尿、多饮、多食
4. 咳嗽: 咳嗽的原因包括感冒、肺炎、哮喘等
"""

# 医疗知识搜索
def search_medical(query: str) -> str:
    """搜索医疗知识"""
    for item in medical_knowledge.split("\n"):
        if query.lower() in item.lower():
            return item
    return "没有找到相关信息"

# 创建工具
tools = [Tool(
    name="SearchMedical",
    func=search_medical,
    description="搜索医疗知识"
)]

# 创建医疗助手
llm = ChatOpenAI(model="gpt-4", temperature=0)

class MedicalAssistant:
    def __init__(self):
        self.llm = llm
        self.tools = tools
        self.memory = ConversationBufferMemory()

    def consult(self, symptoms):
        prompt = f"""
        你是一个医疗咨询助手。

        工具: SearchMedical - 搜索医疗知识

        规则:
        1. 使用 SearchMedical 工具搜索症状相关信息
        2. 提供准确的信息和建议
        3. 遇到严重症状要建议就医

        症状: {symptoms}
        """

        response = self.llm.invoke(prompt)
        return response.content

# 使用
medical_assistant = MedicalAssistant()
answer = medical_assistant.consult("持续发烧")
print(answer)
````

---

## 🛠️ Agent 高级配置

### 1. 工具调用配置

```python
# 启用工具调用
llm = ChatOpenAI(
    model="gpt-4",
    temperature=0,
    tool_calling=True  # 启用工具调用
)

# 或使用旧版 API
llm = ChatOpenAI(
    model="gpt-4",
    temperature=0,
    model_kwargs={"tools": tools}
)
````

### 2. 记忆配置

```python
# 短期记忆 (最近 N 轮)
from langchain.memory import ConversationBufferWindowMemory
memory = ConversationBufferWindowMemory(k=4)

# 长期记忆 (摘要)
from langchain.memory import ConversationSummaryMemory
memory = ConversationSummaryMemory(llm=ChatOpenAI(model="gpt-4"))

# 自定义记忆
class CustomMemory(ConversationBufferMemory):
    def save_context(self, inputs, outputs):
        # 自定义保存逻辑
        super().save_context(inputs, outputs)
        # 保存到数据库
        save_to_database(inputs, outputs)
````

### 3. 提示词模板

```python
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate

system_prompt = ChatPromptTemplate.from_template("""
你是一个{role}助手。

规则:
1. {rule1}
2. {rule2}

知识库:
{knowledge}
""")

human_prompt = ChatPromptTemplate.from_template("{input}")

messages = [
    SystemMessagePromptTemplate.from_template(system_prompt),
    HumanMessagePromptTemplate.from_template(human_prompt),
]

prompt = ChatPromptTemplate.from_messages(messages)
````

---

## 💡 Agent 设计技巧

### 技巧 1: 明确角色定位

```python
# ✅ 明确的角色
system_prompt = "你是一个专业的法律咨询助手"

# ❌ 模糊的角色
system_prompt = "你是一个助手"
````

### 技巧 2: 提供知识库

```python
# ✅ 提供知识库
system_prompt = """
你是一个医疗助手。

知识库:
- 体温: 正常体温 36.5-37.5°C
- 血压: 正常 120/80 mmHg
"""

# ❌ 没有知识库
system_prompt = "你是一个医疗助手"
````

### 技巧 3: 限制输出范围

```python
# ✅ 限制输出
system_prompt = """
回答要:
1. 简洁清晰
2. 不超过 200 字
3. 只提供建议,不开药方
"""

# ❌ 没有限制
system_prompt = "你是一个医疗助手"
````

### 技巧 4: 错误处理

```python
def chat(self, user_input):
    try:
        response = self.llm.invoke(prompt)
        return response.content
    except Exception as e:
        logger.error(f"Agent 错误: {e}")
        return "抱歉,出了点问题,请稍后再试"
````

---

## 🎯 Agent 应用场景

### 1. 行业助手
- 法律咨询
- 医疗咨询
- 财务顾问

### 2. 编程助手
- 代码生成
- 代码审查
- Bug 修复

### 3. 客服助手
- 产品咨询
- 订单查询
- 投诉处理

### 4. 教育助手
- 知识问答
- 学习辅导
- 作业批改

---

## 🚀 Flask 部署

```python
from flask import Flask, request, jsonify
from custom_agent import LegalAgent, CodeAssistant, MedicalAssistant

app = Flask(__name__)

# 创建 Agent 实例
legal_agent = LegalAgent()
code_assistant = CodeAssistant()
medical_assistant = MedicalAssistant()

@app.route('/legal', methods=['POST'])
def legal():
    data = request.json
    answer = legal_agent.chat(data['question'])
    return jsonify({"answer": answer})

@app.route('/code', methods=['POST'])
def code():
    data = request.json
    answer = code_assistant.assist(data['query'])
    return jsonify({"answer": answer})

if __name__ == '__main__':
    app.run(port=5000)
````

---

## 💡 最佳实践

### 1. 知识库管理

```python
# ✅ 分离知识库
def load_knowledge():
    with open("knowledge_base.txt", "r") as f:
        return f.read()

# ✅ 更新知识库
def update_knowledge(new_data):
    with open("knowledge_base.txt", "w") as f:
        f.write(new_data)

# ❌ 硬编码
medical_knowledge = "..."
````

### 2. 工具设计

```python
# ✅ 清晰的工具描述
Tool(
    name="SearchMedical",
    func=search_medical,
    description="搜索医疗知识,用于回答医疗相关问题"
)

# ❌ 模糊的工具描述
Tool(
    name="Search",
    func=search_medical,
    description="搜索"
)
````

### 3. 记忆管理

```python
# ✅ 定期清理记忆
def clean_memory(self):
    # 只保留最近 10 轮
    self.memory.clear()

# ✅ 持久化记忆
def save_memory(self):
    self.memory.save_context(inputs, outputs)
    save_to_db(self.memory)

# ❌ 无限增长
# 记忆不断增长,不清理
````

---

## 🎓 学习建议

### 初学者

1. 理解 Agent 的基本结构
2. 使用简单工具创建 Agent
3. 尝试不同的领域

### 进阶者

1. 设计复杂的 Agent
2. 优化性能和用户体验
3. 实现自定义记忆

### 专家

1. 企业级 Agent
2. 高级功能集成
3. 性能优化和监控

---

**下一篇**: [评估系统](../04-调试与监控/评估系统.md) - 模型评估和 A/B 测试