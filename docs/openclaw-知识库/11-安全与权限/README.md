# 11 - 安全与权限

> 配置安全策略，保护你的数据和安全

## 🔐 核心安全原则

| 原则 | 说明 |
|------|------|
| **最小权限** | 只授予必要的权限 |
| **默认拒绝** | 除非明确允许，否则拒绝 |
| **数据隐私** | 数据存储在自己的机器上 |
| **定期审计** | 定期检查安全配置 |

---

## 🔑 API Key 管理

### 环境变量配置

```bash
# 设置环境变量
export OPENAI_API_KEY="sk-xxx"
export CLAUDE_API_KEY="sk-ant-xxx"
export OLLAMA_HOST="http://localhost:11434"
```### 配置文件

```json
{
  "security": {
    "apiKeys": {
      "openai": "sk-xxx",
      "claude": "sk-ant-xxx"
    }
  }
}
```### 保密建议

- ✅ 使用环境变量
- ✅ 配置文件权限：600
- ✅ 不要提交到 Git
- ❌ 不要在聊天中分享

---

## 🛡️ 访问控制

### IP 限制

```json
{
  "security": {
    "allowedIPs": ["127.0.0.1", "10.0.0.0/8", "192.168.1.0/24"],
    "denyIPs": ["0.0.0.0/0"]
  }
}
```### 请求限流

```json
{
  "security": {
    "rateLimit": {
      "enabled": true,
      "requestsPerMinute": 60,
      "burst": 10,
      "perIP": true
    }
  }
}
```### 认证要求

```json
{
  "security": {
    "requireAuth": true,
    "authMethods": ["apikey", "jwt"]
  }
}
```---

## 🧱 沙箱模式

### 启用沙箱

```json
{
  "security": {
    "sandbox": {
      "enabled": true,
      "allowCommands": [
        "ls", "cat", "echo",
        "curl", "wget", "git",
        "python", "node", "npm"
      ],
      "denyCommands": [
        "rm", "rm -rf",
        "sudo", "chmod",
        "chown"
      ]
    }
  }
}
```### 沙箱规则

| 命令 | 允许 | 说明 |
|------|------|------|
| `ls` | ✅ | 列出文件 |
| `cat` | ✅ | 读取文件 |
| `rm` | ❌ | 删除文件 |
| `sudo` | ❌ | 超级用户 |
| `curl` | ✅ | HTTP 请求 |
| `python` | ✅ | Python 执行 |

---

## 📁 文件系统安全

### 工作目录权限

```json
{
  "security": {
    "workspace": {
      "path": "/path/to/workspace",
      "permissions": "700",
      "maxSize": 1GB
    }
  }
}
```### 文件访问限制

```json
{
  "security": {
    "fileAccess": {
      "allowPaths": ["/home/user/documents"],
      "denyPaths": ["/etc", "/root", "/proc"]
    }
  }
}
```### 敏感文件保护

```bash
# 设置文件权限
chmod 600 ~/.openclaw/openclaw.json

# 禁止写入
chmod 400 ~/.openclaw/config
```---

## 🔒 会话安全

### 会话加密

```json
{
  "security": {
    "session": {
      "encrypt": true,
      "encryptionKey": "your-256-bit-key"
    }
  }
}
```### 会话过期

```json
{
  "security": {
    "session": {
      "maxAge": 86400,      // 24 小时
      "idleTimeout": 3600,  // 1 小时不活动
      "prune": true
    }
  }
}
```### 会话隔离

```json
{
  "security": {
    "sessionIsolation": {
      "enabled": true,
      "perUser": true,
      "perAgent": true
    }
  }
}
```---

## 🌐 网络安全

### HTTPS 配置

```bash
# 使用 Nginx + Let's Encrypt
certbot --nginx -d your-domain.com
```### 防火墙规则

```bash
# UFW（Ubuntu）
ufw default deny incoming
ufw allow ssh
ufw allow 18789/tcp
ufw enable

# iptables
iptables -A INPUT -p tcp --dport 18789 -j DROP
iptables -A INPUT -s 10.0.0.0/8 -p tcp --dport 18789 -j ACCEPT
```### Tailscale 安全

```bash
# 使用 Tailscale 端口
tailscale up --advertise-routes=10.0.0.0/24
```---

## 🔍 日志与审计

### 日志级别

```json
{
  "security": {
    "logging": {
      "level": "info",
      "logToFile": true,
      "logRetention": 30,  // 天
      "audit": true
    }
  }
}
```### 审计日志

```json
{
  "security": {
    "audit": {
      "enabled": true,
      "events": [
        "login",
        "config_change",
        "file_access",
        "command_execution"
      ],
      "export": true
    }
  }
}
```---

## 👥 权限管理

### Agent 权限

```json
{
  "security": {
    "agents": {
      "pi": {
        "permissions": ["read", "write", "search"],
        "denyCommands": ["exec"]
      },
      "admin": {
        "permissions": ["*"],
        "allowCommands": ["*"]
      }
    }
  }
}
```### 用户权限

```json
{
  "security": {
    "users": {
      "admin": {
        "permissions": ["*"]
      },
      "viewer": {
        "permissions": ["read", "search"],
        "denyCommands": ["write", "exec"]
      }
    }
  }
}
```---

## 🛠️ 安全工具

### 运行安全检查

```bash
# 安全诊断
openclaw doctor --security

# 查看安全日志
openclaw gateway logs --security

# 验证配置
openclaw config validate --security
```### 定期安全扫描

```json
{
  "security": {
    "scans": {
      "enabled": true,
      "schedule": "0 3 * * *",  // 每天凌晨 3 点
      "autoFix": true
    }
  }
}
```---

## 🔴 常见安全风险

| 风险 | 说明 | 防护措施 |
|------|------|----------|
| **API Key 泄露** | 配置文件公开 | 使用环境变量 |
| **未授权访问** | 谁能访问 Gateway | 配置 IP 限制 |
| **恶意命令** | Agent 执行危险操作 | 启用沙箱 |
| **数据泄露** | 敏感数据传到外部 | 本地部署 |
| **会话劫持** | 中间人攻击 | 启用 HTTPS |

---

## 📋 安全检查清单

### 安装前

- [ ] 修改默认端口
- [ ] 配置防火墙
- [ ] 设置强密码

### 运行时

- [ ] 定期更新
- [ ] 检查日志
- [ ] 审计权限

### 数据备份

- [ ] 定期备份配置
- [ ] 测试恢复流程
- [ ] 安全存储备份

---

## 🔐 高级安全

### 私有网络

```json
{
  "gateway": {
    "network": {
      "private": true,
      "tunnel": "tailscale"
    }
  }
}
```### 多因素认证

```bash
# 配置 JWT
export JWT_SECRET="your-secret"
export JWT_EXPIRE="24h"
```### 加密存储

```json
{
  "security": {
    "encryption": {
      "enabled": true,
      "algorithm": "AES-256",
      "keyRotation": true
    }
  }
}
```---

## 🐛 安全问题处理

### 1. 发现漏洞

立即：
1. 暂停服务
2. 分析问题
3. 修复并测试
4. 恢复服务

### 2. 数据泄露

1. 立即断开网络
2. 备份证据
3. 通知相关人员
4. 清理日志

### 3. 权限滥用

1. 回滚操作
2. 审查权限
3. 加强控制

---

## 下一步？

- 📊 [故障排查](../12-故障排查/README.md)
- ⚙️ [配置指南](../04-配置指南/README.md)
- 🌐 [远程访问](../04-配置指南/远程访问.md)

---

*本章节基于 docs.openclaw.ai/security/* 等文档*