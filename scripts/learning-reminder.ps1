# 边做边学每日提醒脚本
# 使用方法：在 PowerShell 中运行 .\scripts\learning-reminder.ps1

Write-Host "📚 罗永贵的边做边学提醒系统" -ForegroundColor Cyan
Write-Host ""

$reminders = @(
    @{
        "time" = "10:00"
        "title" = "⏰ 边做边学提醒"
        "message" = "【今日学习回顾】`n`n1. 今天学到了什么？`n   - 技术点1：[填写]`n   - 技术点2：[填写]`n`n2. 遇到的问题`n   - 问题1：[填写] -> 解决方案：[填写]`n`n3. 明天改进`n   - 改进点1：[填写]`n`n【学习资源】`n- 学习方法论：学习方法论.md`n- 快速执行：快速执行指南.md`n`n💡 记住：能记录的不要记在脑子里！"
    }
)

foreach ($reminder in $reminders) {
    Write-Host "[$($reminder.time)] $($reminder.title)" -ForegroundColor Yellow
    Write-Host " $($reminder.message)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "💡 提示：将以上提醒内容，在飞书发给 OpenClaw 机器人，或记录到 memory/YYYY-MM-DD.md" -ForegroundColor Green
Write-Host ""