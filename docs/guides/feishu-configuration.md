# OpenClaw 飞书机器人配置指南

## 概述

本文档记录了如何从零开始配置 OpenClaw 的飞书集成。

## 配置步骤

### 1. 创建飞书应用

1. 访问 [飞书开放平台](https://open.feishu.cn/app)
2. 创建企业应用
3. 复制 App ID 和 App Secret

### 2. 配置权限

在飞书开放平台「权限管理」中添加：

```json
{
  "scopes": {
    "tenant": [
      "aily:file:read",
      "aily:file:write",
      "application:application.app_message_stats.overview:readonly",
      "application:application:self_manage",
      "application:bot.menu:write",
      "cardkit:card:read",
      "cardkit:card:write",
      "contact:user.employee_id:readonly",
      "corehr:file:download",
      "event:ip_list",
      "im:chat.access_event.bot_p2p_chat:read",
      "im:chat.members:bot_access",
      "im:message",
      "im:message.group_at_msg:readonly",
      "im:message.p2p_msg:readonly",
      "im:message:readonly",
      "im:message:send",
      "im:message:send_as_bot",
      "im:resource"
    ]
  }
}
```

### 3. 启用 Bot 能力

在「应用能力」→「Bot」中：
- 启用 Bot
- 设置 Bot 名称

### 4. 配置事件订阅

在「事件订阅」中：
- 选择「使用长连接接收事件」
- 添加事件：`im.message.receive_v1`

### 5. 发布应用

创建版本并提交审核。

### 6. 配置 OpenClaw

编辑 `openclaw.json`：

```json5
{
  "channels": {
    "feishu": {
      "enabled": true,
      "dmPolicy": "pairing",
      "allowFrom": ["*"],
      "accounts": {
        "main": {
          "appId": "cli_xxx",
          "appSecret": "xxx",
          "name": "OpenClaw 助手"
        }
      }
    }
  }
}
```

### 7. 重启 Gateway

```powershell
openclaw gateway restart
```

## 常见问题

### Q: 机器人不回复消息
A: 检查是否添加了 `im:message:send` 和 `im:message:send_as_bot` 权限。

### Q: Gateway 日志显示 blocked unauthorized sender
A: 检查飞书权限配置是否完整。

## 参考资料

- [OpenClaw 飞书文档](https://docs.openclaw.ai/channels/feishu.md)
- [飞书开放平台](https://open.feishu.cn/app)