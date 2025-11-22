# 🔧 תיקון פורט 3001 תפוס
# ============================================

Write-Host "`n🔧 תיקון פורט 3001 תפוס" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

# מצא תהליכים על פורט 3001
Write-Host "📋 שלב 1: חיפוש תהליכים על פורט 3001" -ForegroundColor Yellow
$connections = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue

if ($connections) {
    Write-Host "`n⚠️  נמצאו תהליכים על פורט 3001:" -ForegroundColor Yellow
    
    $processesToStop = @()
    foreach ($conn in $connections) {
        $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "   PID: $($proc.Id) - $($proc.ProcessName)" -ForegroundColor Gray
            if ($proc.ProcessName -eq "node") {
                $processesToStop += $proc
            }
        }
    }
    
    if ($processesToStop.Count -gt 0) {
        Write-Host "`n🛑 עוצר תהליכי node..." -ForegroundColor Yellow
        foreach ($proc in $processesToStop) {
            Write-Host "   עוצר PID: $($proc.Id)..." -ForegroundColor Gray
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
        Write-Host "`n✅ התהליכים נעצרו" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  לא נמצאו תהליכי node לעצירה" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ פורט 3001 פנוי" -ForegroundColor Green
}

# בדוק שוב
Write-Host "`n📋 שלב 2: בדיקה סופית" -ForegroundColor Yellow
Start-Sleep -Seconds 2
$finalCheck = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue

if ($finalCheck) {
    Write-Host "⚠️  עדיין יש תהליך על פורט 3001" -ForegroundColor Yellow
    Write-Host "`n💡 נסה לעצור ידנית:" -ForegroundColor Cyan
    Write-Host "   Get-NetTCPConnection -LocalPort 3001 | ForEach-Object { Stop-Process -Id `$_.OwningProcess -Force }" -ForegroundColor White
} else {
    Write-Host "✅ פורט 3001 פנוי ומוכן לשימוש!" -ForegroundColor Green
    Write-Host "`n🚀 עכשיו אפשר להריץ:" -ForegroundColor Cyan
    Write-Host "   npm run server" -ForegroundColor White
}

