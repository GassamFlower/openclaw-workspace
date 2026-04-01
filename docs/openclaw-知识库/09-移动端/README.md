# 09 - 移动端

> iOS、Android、macOS 应用配置和使用

## 📱 支持的平台

| 平台 | 版本要求 | 状态 | 功能完整度 |
|------|----------|------|------------|
| **iOS** | iOS 16+ | ✅ | ⭐⭐⭐⭐⭐ |
| **Android** | Android 8+ | ✅ | ⭐⭐⭐⭐ |
| **macOS** | macOS 12+ | ✅ | ⭐⭐⭐⭐⭐ |
| **Windows** | Windows 10+ | ✅ | ⭐⭐⭐ |

---

## 🔵 iOS App 配置

### 安装

- App Store 搜索：OpenClaw
- 或直接下载：https://github.com/openclaw/openclaw-app/releases

### 配对步骤

1. 打开 iOS App
2. 选择 "配对新节点"
3. 在控制面板扫描二维码
4. 输入配对码
5. 完成配对

### 功能

- ✅ 摄像头拍照/录像
- ✅ 位置信息
- ✅ 语音唤醒
- ✅ 通知接收
- ✅ 远程控制

### 注意事项

- ⚠️ 需要持续网络连接
- ⚠️ iOS 需要授予权限（相机、位置、通知）
- ⚠️ 建议使用 iPhone 12+ 以获得最佳体验

---

## 🟢 Android App 配置

### 安装

- APK 下载：https://github.com/openclaw/openclaw-app/releases
- 或通过 F-Droid（如果有）

### 配对步骤

1. 打开 Android App
2. 选择 "配对新节点"
3. 扫描控制面板二维码
4. 输入配对码
5. 完成配对

### 功能

- ✅ 摄像头
- ✅ 位置
- ✅ 语音唤醒
- ✅ 通知
- ✅ 远程控制

### 注意事项

- ⚠️ 需要授予权限
- ⚠️ 后台运行需要电池优化豁免
- ⚠️ Android 8+ 才支持后台任务

---

## 🍎 macOS App 配置

### 安装

- Mac App Store：OpenClaw
- 或 DMG 安装包

### 核心功能

- ✅ 图形界面管理
- ✅ 系统托盘图标
- ✅ 菜单栏快捷操作
- ✅ Canvas 集成
- ✅ 语音唤醒

### Dashboard 访问

- 系统托盘 → 右键 → 打开 Dashboard
- 或快捷键：`Cmd + Option + D`

### 菜单栏功能

- 启动/停止 Gateway
- 查看状态
- 快速配置
- 日志查看

### 注意事项

- ⚠️ 需要 macOS 12+
- ⚠️ 需要授予屏幕录制权限（用于 Canvas）

---

## 🪟 Windows 配置

### 安装

- 安装包：.exe
- 下载：https://github.com/openclaw/openclaw-app/releases

### 功能

- ✅ 图形界面
- ✅ 系统托盘
- ✅ Gateway 管理

### 注意事项

- ⚠️ Windows 10+
- ⚠️ 需要授予麦克风权限（语音唤醒）

---

## 📸 摄像头功能

### iOS/Android

```json
{
  "node": {
    "camera": {
      "enabled": true,
      "captureMode": "photo",  // photo/video
      "resolution": "1080p"
    }
  }
}
```### 使用示例

1. 在聊天中发送："拍张照给我看看"
2. App 会自动拍照并上传
3. AI 收到图片进行分析

---

## 📍 位置功能

### 配置

```json
{
  "node": {
    "location": {
      "enabled": true,
      "interval": 300000  // 5 分钟
    }
  }
}
```### 使用场景

- 什么时候到达办公室
- 附近有什么餐厅
- 发送当前位置给 AI

---

## 🔊 语音唤醒

### 配置

```json
{
  "node": {
    "voiceWake": {
      "enabled": true,
      "keyword": "OpenClaw",
      "sensitivity": "high"
    }
  }
}
```### 使用方法

1. 说出唤醒词："OpenClaw"
2. 等待提示音
3. 直接说话："给我看天气"

---

## 🔔 通知功能

### 配置

```json
{
  "node": {
    "notifications": {
      "enabled": true,
      "sound": true,
      "vibrate": true
    }
  }
}
```### 收到消息通知

- 🔔 听到提示音
- 💫 震动（Android）
- 📋 在通知中心查看

---

## 🌐 远程访问

### iOS/Android

```bash
# 在控制面板生成远程访问 URL
# 会通过 Tailscale 或公网 IP
```### 注意事项

- ⚠️ 确保网络可访问
- ⚠️ 使用加密连接
- ⚠️ 定期更新 App

---

## 🐛 常见问题

### Q: iOS App 无法配对？

**A**: 检查：
- Gateway 是否运行
- 二维码是否正确
- 网络连接

### Q: Android 后台任务不工作？

**A**: 在电池优化中添加豁免

### Q: macOS Canvas 不工作？

**A**: 授予屏幕录制权限

---

## 📊 平台对比

| 功能 | iOS | Android | macOS | Windows |
|------|-----|---------|-------|---------|
| 图形界面 | ✅ | ✅ | ✅ | ✅ |
| 系统托盘 | ❌ | ✅ | ✅ | ✅ |
| 摄像头 | ✅ | ✅ | ❌ | ❌ |
| 位置 | ✅ | ✅ | ❌ | ❌ |
| 语音唤醒 | ✅ | ✅ | ✅ | ✅ |
| Canvas | ✅ | ❌ | ✅ | ❌ |
| 通知 | ✅ | ✅ | ❌ | ❌ |

---

## 📚 相关文档

- [移动端安装](#)
- [Android App](../15-参考文档/Android-App.md)
- [iOS App](../15-参考文档/iOS-App.md)
- [macOS App](../15-参考文档/macOS-App.md)

---

*本章节基于 docs.openclaw.ai/platforms/* 等文档*