#!/bin/bash

# LangChain 知识库同步到 GitHub 脚本
# 使用方法：./sync-to-github.sh

set -e  # 遇到错误立即退出

echo "🚀 开始同步 LangChain 知识库到 GitHub..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 添加所有更改
echo "📋 步骤 1: 添加文件..."
git add langchain-zh/
echo -e "${GREEN}✅ 文件已添加${NC}"
echo ""

# 2. 提交更改
echo "📝 步骤 2: 创建提交..."
COMMIT_MESSAGE="feat: 添加完整的 LangChain 中文知识库

- 新增入门指南 README.md
- 添加工具集成详解 tools.md
- 包含调试监控指南 langsmith.md
- 提供快速参考卡片 cheatsheet.md
- 详细的项目结构说明 PROJECT.md
- 完整的知识库目录和学习路径 INDEX.md
- 附带快速开始脚本和配置文件

总字数：约 40,000 字
代码示例：50+ 个
适用人群：从新手到进阶开发者"

git commit -m "$COMMIT_MESSAGE"
echo -e "${GREEN}✅ 提交完成${NC}"
echo ""

# 3. 推送到远程
echo "📤 步骤 3: 推送到 GitHub..."
git push origin master
echo -e "${GREEN}✅ 推送完成${NC}"
echo ""

echo "🎉 同步成功！"
echo ""
echo "📚 LangChain 知识库已成功同步到 GitHub"
echo "📝 提交信息："
echo "$COMMIT_MESSAGE"
echo ""