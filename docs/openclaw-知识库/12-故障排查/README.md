# 12 - 故障排查

> 遇到问题时，从这里找答案

## 🔍 快速诊断

### 运行完整诊断

```bash
# 一键诊断
openclaw doctor
```### 分步诊断

```bash
# 1. 检查安装
openclaw --version

# 2. 检查 Gateway 状态
openclaw gateway status

# 3. 查看日志
openclaw gateway logs --tail=50

# 4. 验证配置
openclaw config validate

# 5. 测试网络
curl http://localhost:18789/
```---

## ❌ Gateway 问题

### Gateway 无法启动

**症状**：启动失败或无法运行

**检查**：

```bash
# 检查端口占用
netstat -tuln | grep 18789

# 检查配置文件
cat ~/.openclaw/openclaw.json

# 查看详细日志
openclaw gateway logs -f
```**解决**：

```bash
# 1. 停止 Gateway
openclaw gateway stop

# 2. 重新启动
openclaw gateway start

# 3. 查看启动日志
openclaw gateway logs -f
```### Gateway 响应慢

**症状**：发送消息后很久才有回复

**检查**：

```bash
# 1. 查看日志
openclaw gateway logs | grep "slow"

# 2. 检查模型响应
curl http://localhost:18789/api/models/status

# 3. 检查网络
ping api.openai.com
```**解决**：

```bash
# 1. 增加超时时间
openclaw config set gateway.timeout 120

# 2. 使用本地模型
openclaw config set models.default ollama/glm4

# 3. 重启 Gateway
openclaw gateway restart
```---

## 📱 渠道问题

### Telegram 不响应

**症状**：发送消息没有回复

**检查**：

```bash
# 1. Gateway 是否运行
openclaw gateway status

# 2. 配置是否正确
openclaw config get channels.telegram

# 3. 查看日志
openclaw gateway logs | grep telegram
```**解决**：

```bash
# 1. 检查 Token
openclaw config edit channels.telegram.token

# 2. 重启 Gateway
openclaw gateway restart

# 3. 测试 Webhook
curl -X POST http://localhost:18789/api/telegram/test
```### WhatsApp 发送失败

**症状**：发送图片/语音失败

**检查**：

- Meta Business Portal 连接状态
- 网络连接
- 配额是否用尽

**解决**：

1. 检查 Meta 账户状态
2. 更换网络
3. 联系 Meta 技术支持

### Discord 机器人无反应

**症状**：@机器人 不回复

**检查**：

```bash
# 1. 检查 Bot Token
openclaw config get channels.discord.botToken

# 2. 检查权限
# 在 Discord 开发者门户确认 Bot 有所需权限

# 3. 查看日志
openclaw gateway logs | grep discord
```**解决**：

```bash
# 1. 更新 Token
openclaw config edit channels.discord.botToken

# 2. 重新授权到服务器
# 在 Discord 网页版重新邀请 Bot

# 3. 重启 Gateway
openclaw gateway restart
```---

## 🤖 Agent 问题

### Agent 不响应

**症状**：发送消息没有回复

**检查**：

```bash
# 1. Agent 是否启用
openclaw config get agents.claude.enabled

# 2. 模型 API Key 是否正确
openclaw config get models.claude.apiKey

# 3. 查看日志
openclaw gateway logs | grep claude
```**解决**：

```bash
# 1. 检查 API Key
openclaw config edit models.claude.apiKey

# 2. 检查模型配置
openclaw config get models.default

# 3. 重启 Gateway
openclaw gateway restart
```### 模型调用失败

**症状**：Agent 报错 "Model failed"

**检查**：

```bash
# 1. API Key 是否有效
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer sk-xxx"

# 2. 检查额度
# 登录 API 提供商控制台

# 3. 查看错误日志
openclaw gateway logs | grep error
```**解决**：

```bash
# 1. 更新 API Key
openclaw config edit models.claude.apiKey

# 2. 更换模型
openclaw config set models.default gpt-3.5-turbo

# 3. 重试
openclaw gateway restart
```---

## 💻 工具问题

### Exec 工具执行失败

**症状**：执行命令时失败

**检查**：

```bash
# 1. 沙箱是否启用
openclaw config get tools.exec.sandbox

# 2. 命令是否在允许列表
openclaw config get tools.exec.allowedCommands

# 3. 查看错误
openclaw gateway logs | grep exec
```**解决**：

```bash
# 1. 检查命令权限
openclaw config edit tools.exec.allowedCommands

# 2. 禁用沙箱（测试用）
openclaw config set tools.exec.sandbox false

# 3. 重启
openclaw gateway restart
```### Web Search 不工作

**症状**：搜索无结果或超时

**检查**：

```bash
# 1. 搜索引擎是否正常
curl "https://duckduckgo.com/"

# 2. API Key 是否正确
openclaw config get tools.web.apiKey

# 3. 查看日志
openclaw gateway logs | grep web
```**解决**：

```bash
# 1. 更新 API Key
openclaw config edit tools.web.apiKey

# 2. 重启
openclaw gateway restart
```---

## 📊 配置问题

### 配置不生效

**症状**：修改配置后不生效

**检查**：

```bash
# 1. 配置文件路径
ls -la ~/.openclaw/

# 2. 验证配置
openclaw config validate

# 3. 查看当前配置
openclaw config --all
```**解决**：

```bash
# 1. 修改配置
openclaw config edit

# 2. 重启 Gateway
openclaw gateway restart

# 3. 检查日志
openclaw gateway logs | grep config
```---

## 🔌 插件问题

### 插件加载失败

**症状**：启动时报错 "Plugin failed"

**检查**：

```bash
# 1. 查看日志
openclaw gateway logs | grep plugin

# 2. 检查插件文件
ls -la ~/.openclaw/plugins/

# 3. 验证插件
openclaw plugin list
```**解决**：

```bash
# 1. 卸载插件
openclaw plugin uninstall @plugin-name

# 2. 从源码安装
cd ~/.openclaw/plugins
git clone https://github.com/plugin/repo.git

# 3. 重启 Gateway
openclaw gateway restart
```---

## 🚀 部署问题

### Docker 容器无法启动

**症状**：Docker 容器退出

**检查**：

```bash
# 1. 查看容器状态
docker ps -a

# 2. 查看日志
docker logs openclaw

# 3. 检查端口
docker port openclaw
```**解决**：

```bash
# 1. 检查配置
docker exec openclaw cat /root/.openclaw/openclaw.json

# 2. 查看资源限制
docker stats openclaw

# 3. 重新运行
docker restart openclaw
```---

## 📱 移动端问题

### iOS App 无法配对

**症状**：配对失败或超时

**检查**：

- Gateway 是否运行
- 二维码是否正确
- 网络连接

**解决**：

1. 确保 Gateway 正在运行
2. 重新生成二维码
3. 检查网络
4. 更新 iOS App

### Android 后台任务不工作

**症状**：App 退出后不执行任务

**解决**：

```bash
# 1. 在电池优化中添加豁免
# 设置 → 应用 → OpenClaw → 电池优化 → 不优化

# 2. 允许后台运行
# 设置 → 应用 → OpenClaw → 允许后台数据

# 3. 强制停止并重启 App
```---

## 🌐 网络问题

### 无法连接 Gateway

**症状**：控制面板打不开

**检查**：

```bash
# 1. Gateway 是否运行
openclaw gateway status

# 2. 端口是否监听
netstat -tuln | grep 18789

# 3. 本地连接测试
curl http://localhost:18789/
```**解决**：

```bash
# 1. 启动 Gateway
openclaw gateway start

# 2. 检查防火墙
sudo ufw allow 18789

# 3. 测试远程连接
curl http://your-server-ip:18789/
```---

## 📞 获取帮助

### 查看文档

- 官方文档：https://docs.openclaw.ai
- GitHub Issues：https://github.com/openclaw/openclaw/issues
- Discord 社区：https://discord.com/invite/clawd

### 收集诊断信息

```bash
# 创建诊断报告
{
  "timestamp": "2026-04-01T08:00:00Z",
  "version": "openclaw --version",
  "gatewayStatus": "openclaw gateway status",
  "logs": "openclaw gateway logs --tail=100"
}
```### 报告问题

在 GitHub Issue 中包含：

1. 系统信息（操作系统、Node 版本）
2. 错误日志
3. 重现步骤
4. 期望行为

---

## 🎯 常见错误码

| 错误码 | 说明 | 解决方法 |
|--------|------|----------|
| `ECONNREFUSED` | 无法连接 | 检查 Gateway 是否运行 |
| `EADDRINUSE` | 端口被占用 | 更改端口或停止占用进程 |
| `AUTH_FAILED` | 认证失败 | 检查 API Key |
| `MODEL_ERROR` | 模型错误 | 检查 API Key 和额度 |
| `PLUGIN_ERROR` | 插件错误 | 卸载插件或更新 |
| `TIMEOUT` | 超时 | 增加超时时间或更换模型 |

---

## 💡 预防建议

1. **定期更新**：保持 OpenClaw 和依赖最新
2. **备份数据**：定期备份配置
3. **监控日志**：定期检查日志
4. **安全配置**：配置 IP 限制和沙箱
5. **压力测试**：测试不同场景

---

## 下一步？

- 📖 [完整文档](../01-核心概念/README.md)
- ⚙️ [配置指南](../04-配置指南/README.md)
- 🤖 [Agent 管理](../08-Agent与会话/README.md)

---

*本章节基于 docs.openclaw.ai/help/* 等文档*