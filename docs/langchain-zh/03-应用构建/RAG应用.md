# RAG 应用实战 - 从零构建 RAG 系统

> 手把手教你构建一个完整的 RAG 应用

## 🎯 什么是 RAG 应用?

### 完整工作流程

```
1. 数据准备
   原始文档 → 文档清洗 → 分块 → 向量化

2. 向量数据库
   向量化 → 存储到向量库

3. 检索
   用户问题 → 向量化 → 在向量库中搜索 → 返回相关文档

4. 生成
   问题 + 文档 → LLM 生成答案
```

---

## 💻 完整 RAG 应用示例

### 项目结构

```
rag_app/
├── data/                    # 数据目录
│   ├── docs.txt            # 文档文件
│   └── data.csv            # 数据文件
├── vector_store/           # 向量数据库
├── rag_chain.py            # RAG 应用
└── main.py                 # 主程序
```

### 步骤 1: 创建知识库

```python
# rag_chain.py

# 准备知识库
documents = [
    "LangChain 是一个用于开发 LLM 应用的 Python 框架",
    "LangChain 提供了多种组件,包括 Chain、Agent、Tool 等",
    "LangChain 支持与 OpenAI、Claude、Google 等多种 LLM 提供商集成",
    "LangChain 可以构建 RAG 应用,让 AI 基于知识库回答问题",
    "LangGraph 是 LangChain 的底层框架,用于编排复杂的 AI 工作流",
]

print("知识库准备完成!")
```

### 步骤 2: 创建向量数据库

```python
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

# 创建向量数据库
vector_store = FAISS.from_texts(
    texts=documents,
    embedding=OpenAIEmbeddings(),
)

# 保存向量数据库
vector_store.save_local("vector_store/faiss_index")

print("向量数据库创建并保存完成!")
```

### 步骤 3: 创建检索器

```python
# 创建检索器
retriever = vector_store.as_retriever(
    search_kwargs={"k": 3}  # 返回 3 个最相关文档
)

print("检索器创建完成!")
```

### 步骤 4: 创建 RAG Chain

```python
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA

# 创建 LLM
llm = ChatOpenAI(
    model="gpt-4",
    temperature=0
)

# 创建 RAG Chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True,  # 返回参考文档
    verbose=True
)

print("RAG Chain 创建完成!")
```

### 步骤 5: 问答

```python
# 用户问题
question = "LangChain 支持哪些功能?"

# 问答
result = qa_chain.invoke(question)

# 显示答案
print("\n问题:", question)
print("\n答案:", result["result"])

# 显示参考文档
print("\n参考文档:")
for i, doc in enumerate(result["source_documents"], 1):
    print(f"\n文档 {i}:")
    print(doc.page_content)
```

### 完整代码

```python
# rag_chain.py
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import RetrievalQA

# 1. 准备知识库
documents = [
    "LangChain 是一个用于开发 LLM 应用的 Python 框架",
    "LangChain 提供了多种组件,包括 Chain、Agent、Tool 等",
    "LangChain 支持与 OpenAI、Claude、Google 等多种 LLM 提供商集成",
    "LangChain 可以构建 RAG 应用,让 AI 基于知识库回答问题",
    "LangGraph 是 LangChain 的底层框架,用于编排复杂的 AI 工作流",
]

# 2. 创建向量数据库
vector_store = FAISS.from_texts(
    texts=documents,
    embedding=OpenAIEmbeddings(),
)

# 3. 创建检索器
retriever = vector_store.as_retriever(search_kwargs={"k": 3})

# 4. 创建 RAG Chain
llm = ChatOpenAI(model="gpt-4", temperature=0)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True,
    verbose=True
)

# 5. 问答
question = "LangChain 支持哪些功能?"
result = qa_chain.invoke(question)

# 显示结果
print("\n问题:", question)
print("\n答案:", result["result"])
print("\n参考文档:")
for i, doc in enumerate(result["source_documents"], 1):
    print(f"\n文档 {i}:")
    print(doc.page_content)
```

---

## 🎮 实战示例 1: 文档问答系统

### 应用场景
- 企业内部知识库问答
- 产品文档查询
- 技术文档问答

### 完整代码

```python
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains import RetrievalQA
import os

# 设置 API Key
os.environ["OPENAI_API_KEY"] = "your-api-key"

# 1. 创建知识库 (从文件)
def load_documents(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        documents = [f.read()]
    return documents

documents = load_documents("data/docs.txt")

# 2. 创建向量数据库
vector_store = FAISS.from_texts(
    texts=documents,
    embedding=OpenAIEmbeddings(),
)

# 3. 创建检索器
retriever = vector_store.as_retriever(search_kwargs={"k": 3})

# 4. 创建 RAG Chain
llm = ChatOpenAI(model="gpt-4", temperature=0)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True,
    verbose=True
)

# 5. 问答
while True:
    question = input("\n请输入问题 (输入 'exit' 退出): ")
    if question.lower() == 'exit':
        break

    result = qa_chain.invoke(question)

    print("\n" + "="*50)
    print("答案:", result["result"])
    print("\n参考文档:")
    for i, doc in enumerate(result["source_documents"], 1):
        print(f"\n文档 {i}:")
        print(doc.page_content[:200] + "...")
    print("\n" + "="*50)
```

---

## 🎮 实战示例 2: 聊天机器人

### 应用场景
- 客服机器人
- 智能助手
- 问答系统

### 完整代码

```python
from langchain_community.vectorstores import Chroma
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

# 1. 创建知识库
documents = [
    "你好!我是智能助手,可以回答你的问题。",
    "我可以帮你查询信息、写文章、写代码。",
    "如果你有问题,可以直接问我。",
]

# 2. 创建向量数据库
vector_store = Chroma.from_texts(
    texts=documents,
    embedding=OpenAIEmbeddings(),
    persist_directory="./chatbot_vector_store"
)

# 3. 创建记忆
memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

# 4. 创建聊天机器人
llm = ChatOpenAI(model="gpt-4", temperature=0)

qa_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=vector_store.as_retriever(),
    memory=memory,
    verbose=True
)

# 5. 聊天
print("聊天机器人已启动! (输入 'exit' 退出)")
print("="*50)

while True:
    user_input = input("\n你: ")
    if user_input.lower() == 'exit':
        break

    result = qa_chain({"question": user_input})

    print("\n助手:", result["answer"])
    print("="*50)
```

---

## 📊 RAG 性能优化

### 1. 文档分块

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

# 创建文本分割器
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,  # 每块 1000 字
    chunk_overlap=200,  # 重叠 200 字
    separators=["\n\n", "\n", ". ", " "]
)

# 分割文档
texts = text_splitter.split_text("你的长文档...")

# 创建向量数据库
vector_store = FAISS.from_texts(
    texts=texts,
    embedding=OpenAIEmbeddings(),
)
```

### 2. 使用更好的向量数据库

```python
from langchain_community.vectorstores import Chroma

# Chroma 支持持久化
vector_store = Chroma.from_documents(
    documents=documents,
    embedding=OpenAIEmbeddings(),
    persist_directory="./chroma_db"  # 持久化到目录
)

# 下次直接加载
vector_store = Chroma(
    persist_directory="./chroma_db",
    embedding_function=OpenAIEmbeddings()
)
```

### 3. 优化检索参数

```python
# 调整 k 值
retriever = vector_store.as_retriever(
    search_kwargs={
        "k": 3,  # 返回 3 个文档
        "score_threshold": 0.7  # 相似度阈值
    }
)
```

---

## 🎯 RAG 应用场景

### 1. 企业知识库

```python
# 问答系统
# 场景: 员工询问公司政策
documents = [
    "公司考勤制度: 9:00-18:00,迟到扣半天工资",
    "年假政策: 每年 15 天年假",
    "加班政策: 工作日加班有 1.5 倍工资",
]

# 应用: 员工问"年假几天?"
# LLM 基于文档回答
```

### 2. 客服系统

```python
# 智能客服
# 场景: 用户询问产品信息
documents = [
    "产品 A: 500元,功能包括...",
    "产品 B: 800元,功能包括...",
    "产品 C: 1000元,功能包括...",
]

# 应用: 用户问"产品 A 怎么样?"
# LLM 基于文档回答
```

### 3. 教育平台

```python
# 知识问答
# 场景: 学生询问课程内容
documents = [
    "课程 1: 计算机基础,包含编程、数据结构...",
    "课程 2: 网络安全,包含加密、防火墙...",
    "课程 3: 人工智能,包含机器学习、深度学习...",
]

# 应用: 学生问"课程 2 是什么?"
# LLM 基于文档回答
```

---

## 🚀 部署 RAG 应用

### Flask 部署

```python
from flask import Flask, request, jsonify
from rag_chain import qa_chain

app = Flask(__name__)

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    question = data.get('question', '')

    if not question:
        return jsonify({"error": "请提供问题"}), 400

    try:
        result = qa_chain.invoke(question)
        return jsonify({
            "answer": result["result"],
            "sources": [doc.page_content for doc in result["source_documents"]]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
```

---

## 💡 最佳实践

### 1. 数据准备

```python
# ✅ 好的数据准备
documents = load_and_clean_documents()
documents = split_documents(documents)
documents = add_metadata(documents)

# ❌ 糟糕的数据准备
documents = raw_text.split()
```

### 2. 向量数据库选择

```python
# ✅ 根据需求选择
# FAISS: 轻量级,本地使用
# Chroma: 持久化,简单
# Pinecone: 云端,企业级
```

### 3. 检索优化

```python
# ✅ 优化检索参数
retriever = vector_store.as_retriever(
    search_kwargs={
        "k": 3,  # 适中的 k 值
        "score_threshold": 0.7  # 设置阈值
    }
)
```

---

## 🎓 学习建议

### 初学者

1. 理解 RAG 工作流程
2. 跑通基础示例
3. 尝试不同的向量数据库

### 进阶者

1. 优化文档分块
2. 实现自定义检索器
3. 性能优化

### 专家

1. 高级 RAG 技术
2. 企业级部署
3. A/B 测试

---

**下一篇**: [聊天机器人](../03-应用构建/聊天机器人.md) - 完整聊天机器人示例