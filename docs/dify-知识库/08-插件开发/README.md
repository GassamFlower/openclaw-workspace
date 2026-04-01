# 08 - 插件开发

> 开发自定义插件扩展 Dify 功能

## 🧩 插件类型

| 类型 | 说明 |
|------|------|
| **Model Provider** | 添加新的 AI 模型提供商 |
| **Data Source** | 添加数据源（Notion、网站等） |
| **Tool** | 工具插件 |
| **Trigger** | 触发器插件 |
| **Agent Strategy** | Agent 策略插件 |

---

## 🚀 快速开始

### 1. 安装开发工具

```bash
npm install -g dify-plugin-cli
```### 2. 创建项目

```bash
dify-plugin create my-plugin
cd my-plugin
```### 3. 编写插件

详见下方各类型说明

### 4. 打包

```bash
dify-plugin package
```### 5. 安装

```bash
# 本地安装
dify-plugin install ./my-plugin.difypkg

# 发布到 Marketplace
dify-plugin publish
```---

## 🎯 Model Provider 插件

### 项目结构

```
my-plugin/
├── dify-plugin.json
├── providers/
│   └── my-provider/
│       ├── provider.ts
│       ├── models/
│       │   └── my-model.ts
│       └── utils.ts
└── README.md
```### Provider 配置

```json
{
  "name": "My Provider",
  "type": "model-provider",
  "models": ["my-model"]
}
```### Provider 实现

```typescript
import { AIModelProvider } from 'dify-plugin-sdk';

export class MyProvider implements AIModelProvider {
  async generate(inputs: any, config: any) {
    // 调用 API
    const response = await fetch('https://api.example.com/chat', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${config.apiKey}` },
      body: JSON.stringify(inputs)
    });

    return response.json();
  }
}
```---

## 🛠️ Tool 插件

### 项目结构

```
my-plugin/
├── dify-plugin.json
└── tools/
    └── my-tool/
        ├── tool.ts
        └── README.md
```### Tool 实现

```typescript
import { ToolPlugin } from 'dify-plugin-sdk';

export class MyTool implements ToolPlugin {
  name = 'My Tool';
  description = '我的工具描述';

  async invoke(inputs: any) {
    // 工具逻辑
    return {
      output: '工具结果'
    };
  }
}
```---

## 🎨 Trigger 插件

### 项目结构

```
my-plugin/
├── dify-plugin.json
└── triggers/
    └── my-trigger/
        ├── trigger.ts
        └── README.md
```### Trigger 实现

```typescript
import { TriggerPlugin } from 'dify-plugin-sdk';

export class MyTrigger implements TriggerPlugin {
  name = 'My Trigger';
  description = '我的触发器描述';

  async execute() {
    // 触发逻辑
    return {
      inputs: { /* 输入参数 */ }
    };
  }
}
```---

## 📋 完整文档

- [插件开发指南](https://docs.dify.ai/en/develop-plugin/)
- [开发者速查表](https://docs.dify.ai/en/develop-plugin/dev-guides-and-walkthroughs/cheatsheet.md)
- [发布指南](https://docs.dify.ai/en/develop-plugin/publishing/)

---

## 💡 开发建议

1. **遵循规范**：按照文档要求编写
2. **错误处理**：提供友好的错误信息
3. **测试充分**：充分测试各种场景
4. **文档完整**：清晰的 README

---

## 📞 获取帮助

- 💬 [社区论坛](https://forum.dify.ai)
- 🐛 [GitHub Issues](https://github.com/langgenius/dify/issues)

---

*本章节基于 docs.dify.ai/develop-plugin/* 等文档*