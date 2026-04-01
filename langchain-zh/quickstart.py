#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LangChain 快速开始示例

运行前请确保：
1. 已安装 LangChain: pip install langchain langchain-openai
2. 配置了 API Key: 复制 .env.example 为 .env 并填入 Key
3. 安装依赖: pip install -r requirements.txt
"""

import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain.tools import tool

# ============ 步骤 1: 配置 LLM ============
print("🔧 步骤 1: 配置 LLM")

llm = ChatOpenAI(
    model=os.getenv("OPENAI_MODEL", "gpt-4"),
    temperature=0,
    api_key=os.getenv("OPENAI_API_KEY")
)
print(f"✅ LLM 已配置: {llm.model_name}")

# ============ 步骤 2: 定义工具 ============
print("\n🔧 步骤 2: 定义工具")

@tool
def search(query: str) -> str:
    """搜索相关信息"""
    return f"搜索结果：{query}"

@tool
def calculate(expression: str) -> str:
    """计算数学表达式"""
    try:
        result = eval(expression)
        return f"计算结果：{result}"
    except Exception as e:
        return f"计算失败：{str(e)}"

tools = [search, calculate]
print(f"✅ 已定义 {len(tools)} 个工具")

# ============ 步骤 3: 创建 Agent ============
print("\n🔧 步骤 3: 创建 Agent")

from langchain.agents import create_tool_calling_agent

agent = create_tool_calling_agent(llm, tools)
executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    handle_parsing_errors=True
)
print("✅ Agent 已创建")

# ============ 步骤 4: 使用 Agent ============
print("\n🔧 步骤 4: 开始对话\n")

def chat():
    """交互式对话"""
    print("🤖 智能助手已启动！输入 'exit' 或 'quit' 退出\n")
    print("=" * 50)

    while True:
        user_input = input("你: ").strip()

        if not user_input:
            continue

        if user_input.lower() in ['exit', 'quit', '退出', 'q']:
            print("\n👋 再见！")
            break

        try:
            result = executor.invoke({"input": user_input})
            print(f"\n助手: {result['output']}\n")
            print("=" * 50)

        except Exception as e:
            print(f"\n❌ 发生错误: {e}\n")
            print("=" * 50)

if __name__ == "__main__":
    try:
        chat()
    except KeyboardInterrupt:
        print("\n\n👋 程序已退出")
    except Exception as e:
        print(f"\n❌ 错误: {e}")
        print("\n💡 提示: 请检查 .env 文件中的 API Key 是否正确配置")