# 每日提醒脚本
# 使用方法：在 PowerShell 中运行 .\scripts\daily-reminder.ps1

Write-Host "🔥 罗永贵的每日提醒系统" -ForegroundColor Cyan
Write-Host ""

$reminders = @(
    @{
        "time" = "10:00"
        "title" = "每日计划检查"
        "message" = "请回答以下问题：`n1. 今天早上制定了计划吗？`n2. 计划有哪些内容？`n3. 今天有按时执行吗？"
    },
    @{
        "time" = "9:30, 11:30, 13:30, 15:30"
        "title" = "刷手机提醒"
        "message" = "你已经工作一段时间了，该放下手机，起身活动一下。`n建议：做几个深蹲、看看窗外、喝口水、伸个懒腰。`n健康第一，效率第二。"
    },
    @{
        "time" = "17:00"
        "title" = "每日总结提醒"
        "message" = "请完成今日总结：`n1. 今天完成了哪些任务？`n2. 有学到什么新东西？`n3. 写了一篇文章或方案吗？`n4. 明天计划做什么？"
    }
)

foreach ($reminder in $reminders) {
    Write-Host "[$($reminder.time)] $($reminder.title)" -ForegroundColor Yellow
    Write-Host " $($reminder.message)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "💡 提示：复制以上提醒内容，在飞书发给 OpenClaw 机器人" -ForegroundColor Green