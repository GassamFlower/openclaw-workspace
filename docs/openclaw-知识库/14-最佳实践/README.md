# 14 - 最佳实践

> 生产环境部署和使用 OpenClaw 的建议

## 🎯 核心原则

| 原则 | 说明 |
|------|------|
| **安全第一** | 保护 API Key，限制访问 |
| **可观测性** | 记录日志，监控运行状态 |
| **自动化** | 配置自动化，减少人工操作 |
| **备份** | 定期备份数据 |
| **文档化** | 记录配置和流程 |

---

## 🔐 安全配置

### 1. API Key 管理

```bash
# ✅ 使用环境变量
export OPENAI_API_KEY="sk-xxx"
export CLAUDE_API_KEY="sk-ant-xxx"

# ✅ 配置文件权限
chmod 600 ~/.openclaw/openclaw.json

# ❌ 不要
# - 提交到 Git
# - 在聊天中分享
# - 明文存储
```### 2. 访问控制

```json
{
  "security": {
    "allowedIPs": ["127.0.0.1", "10.0.0.0/8", "192.168.1.0/24"],
    "rateLimit": {
      "requestsPerMinute": 60,
      "burst": 10
    },
    "requireAuth": true
  }
}
```### 3. 沙箱配置

```json
{
  "security": {
    "sandbox": {
      "enabled": true,
      "allowedCommands": [
        "ls", "cat", "echo",
        "curl", "wget", "git",
        "python", "node", "npm"
      ],
      "denyCommands": ["rm", "sudo", "chmod"]
    }
  }
}
```### 4. 日志加密

```json
{
  "security": {
    "logging": {
      "encrypt": true,
      "logRetention": 90,
      "audit": true
    }
  }
}
```---

## 📊 监控与日志

### 1. 日志级别

```json
{
  "gateway": {
    "logLevel": "info",
    "logToFile": true,
    "logPath": "/var/log/openclaw",
    "rotate": true,
    "maxSize": 100MB,
    "maxFiles": 10
  }
}
```### 2. 关键指标监控

```bash
# 监控 Gateway 状态
openclaw gateway status

# 监控会话数量
openclaw session stats

# 监控 Agent 使用
openclaw agents list
```### 3. 日志聚合

```bash
# 使用 ELK/EFK
# - Elasticsearch: 存储日志
# - Logstash: 处理日志
# - Kibana: 可视化

# 或使用简单方案
# - 文件滚动日志
# - 云存储（AWS S3、GCS）
# - 日志分析工具
```---

## 🔄 备份与恢复

### 1. 配置备份

```bash
# 定期备份脚本
#!/bin/bash
BACKUP_DIR="/backup/openclaw"
DATE=$(date +%Y%m%d)

# 备份配置
tar -czf $BACKUP_DIR/config-$DATE.tar.gz ~/.openclaw

# 备份会话
tar -czf $BACKUP_DIR/sessions-$DATE.tar.gz ~/.openclaw/sessions

# 备份日志
tar -czf $BACKUP_DIR/logs-$DATE.tar.gz ~/.logs
```### 2. 自动备份

```json
{
  "cron": {
    "jobs": [
      {
        "name": "backup-config",
        "schedule": "0 2 * * *",
        "payload": {
          "kind": "systemEvent",
          "text": "backup: 备份配置"
        }
      }
    ]
  }
}
```### 3. 恢复流程

```bash
# 1. 停止服务
systemctl stop openclaw

# 2. 恢复配置
tar -xzf config-backup.tar.gz

# 3. 重启服务
systemctl start openclaw

# 4. 验证
openclaw --version
openclaw gateway status
```---

## 🚀 性能优化

### 1. 资源配置

```json
{
  "gateway": {
    "maxConnections": 100,
    "maxMemory": 2GB,
    "maxCpu": 2,
    "keepAlive": true
  }
}
```### 2. 缓存配置

```json
{
  "gateway": {
    "cache": {
      "enabled": true,
      "ttl": 3600,
      "maxSize": 1GB,
      "strategy": "LRU"
    }
  }
}
```### 3. 模型选择

| 场景 | 推荐模型 |
|------|----------|
| **开发** | Claude 3.5 Sonnet / GPT-4 |
| **日常** | GPT-3.5 Turbo / GPT-4o |
| **成本敏感** | 本地模型（Ollama） |
| **搜索** | Perplexity / Exa |

### 4. 会话管理

```json
{
  "session": {
    "maxAge": 86400,      // 24 小时
    "maxHistory": 50,
    "pruning": true,
    "autoSave": true
  }
}
```---

## 📱 移动端配置

### 1. 权限管理

- ✅ 只授予必要权限
- ✅ 定期检查权限使用
- ✅ 不使用时关闭应用

### 2. 电池优化

- Android: 添加到电池优化豁免
- iOS: 在后台刷新中允许

### 3. 网络连接

- 使用 Wi-Fi 而非移动数据
- 考虑使用 VPN/Tailscale

---

## 🌐 部署最佳实践

### 1. Docker 部署

```bash
# ✅ 使用 Docker Compose
version: '3.8'
services:
  openclaw:
    image: openclaw/openclaw:latest
    restart: unless-stopped
    ports:
      - "18789:18789"
    volumes:
      - ./config:/root/.openclaw
    environment:
      - OPENAI_API_KEY=sk-xxx
```### 2. 云平台

- **DigitalOcean**: 性价比高
- **Render**: 自动 HTTPS，易用
- **Railway**: 开发友好
- **Hetzner**: 成本极低

### 3. Kubernetes

```bash
# ✅ 使用 Helm
helm install openclaw openclaw/openclaw

# ✅ 配置资源限制
resources:
  limits:
    memory: 2Gi
    cpu: 1000m
  requests:
    memory: 1Gi
    cpu: 500m
```---

## 🛠️ 工具使用

### 1. Exec 工具

```json
{
  "tools": {
    "exec": {
      "sandbox": true,         // ✅ 启用沙箱
      "timeout": 30000,        // ✅ 设置超时
      "allowedCommands": [     // ✅ 明确允许的命令
        "ls", "cat", "echo",
        "curl", "git"
      ]
    }
  }
}
```### 2. Web Search

```json
{
  "tools": {
    "web": {
      "provider": "duckduckgo",  // ✅ 免费
      "count": 5,                // ✅ 限制结果数
      "safeSearch": "moderate"  // ✅ 内容过滤
    }
  }
}
```---

## 🧩 插件管理

### 1. 社区插件

- 从官方仓库安装
- 检查评价和活跃度
- 定期更新

### 2. 自定义插件

- 严格审查代码
- 测试沙箱行为
- 文档化 API

### 3. 插件卸载

```bash
# 移除插件
openclaw plugin uninstall @plugin-name

# 清理残留
rm -rf ~/.openclaw/plugins/@plugin-name
```---

## 📊 监控与告警

### 1. 健康检查

```json
{
  "gateway": {
    "healthCheck": {
      "enabled": true,
      "interval": 60,
      "timeout": 30
    }
  }
}
```### 2. 告警配置

```bash
# Cron 任务监控
openclaw cron add \
  --schedule "every:5m" \
  --text "healthcheck: 检查系统健康状态"
```### 3. 日志告警

```bash
# 监控错误日志
tail -f /var/log/openclaw/error.log | grep ERROR
```---

## 🔄 迁移与升级

### 1. 数据迁移

```bash
# 1. 备份当前数据
tar -czf backup.tar.gz ~/.openclaw

# 2. 停止服务
systemctl stop openclaw

# 3. 升级 OpenClaw
npm install -g openclaw@latest

# 4. 恢复配置
tar -xzf backup.tar.gz

# 5. 重启服务
systemctl start openclaw
```### 2. 版本兼容

- 查看迁移指南
- 在测试环境验证
- 备份后再升级

---

## 📚 文档化

### 1. 配置文档

```markdown
# OpenClaw 配置文档

## 环境
- Node.js: 24.0.0
- OS: Ubuntu 22.04

## 配置
- Gateway 端口: 18789
- 默认模型: Claude 3.5 Sonnet

## 使用
- 渠道: Telegram, Discord
- Agent: Claude, GPT-4

## 维护
- 备份: 每天凌晨 2 点
- 更新: 每月 1 号
```### 2. 流程文档

- 安装流程
- 故障排查流程
- 恢复流程

---

## 🎓 学习与成长

### 1. 社区参与

- 🎤 Discord: https://discord.com/invite/clawd
- 📖 GitHub: https://github.com/openclaw/openclaw
- 📝 文档: https://docs.openclaw.ai

### 2. 持续学习

- 关注更新日志
- 阅读文档
- 参与讨论

---

## ✅ 检查清单

### 部署前

- [ ] 安全配置完成
- [ ] API Key 安全存储
- [ ] 权限设置正确
- [ ] 日志配置完成
- [ ] 备份策略制定

### 运行中

- [ ] 日志正常
- [ ] 系统健康
- [ ] 定期备份
- [ ] 版本更新
- [ ] 监控运行

### 优化

- [ ] 性能监控
- [ ] 资源优化
- [ ] 安全审计
- [ ] 文档更新

---

## 📞 支持

### 获取帮助

- 官方文档
- GitHub Issues
- Discord 社区

---

*本章节基于 docs.openclaw.ai/* 等文档的最佳实践*