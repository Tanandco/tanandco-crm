# 🚀 פריסה לפרודקשן - Tan & Co CRM
# ============================================

Write-Host "`n🚀 Tan & Co CRM - פריסה לפרודקשן" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

Write-Host "✅ מה מוכן:" -ForegroundColor Green
Write-Host "   • הקוד ב-GitHub (branch: main)" -ForegroundColor Gray
Write-Host "   • Dockerfile מוכן" -ForegroundColor Gray
Write-Host "   • כל הקבצים מעודכנים" -ForegroundColor Gray

Write-Host "`n📋 שלבים לפריסה:" -ForegroundColor Yellow
Write-Host "`n1️⃣  פתח Google Cloud Console" -ForegroundColor Cyan
Write-Host "   קישור: https://console.cloud.google.com/run?project=tanandco-crm" -ForegroundColor Gray

Write-Host "`n2️⃣  בחר או צור Service" -ForegroundColor Cyan
Write-Host "   • אם יש service קיים: לחץ עליו" -ForegroundColor Gray
Write-Host "   • אם אין: לחץ 'Create Service'" -ForegroundColor Gray

Write-Host "`n3️⃣  הגדר Continuous Deployment" -ForegroundColor Cyan
Write-Host "   • Container: 'Continuously deploy from source repository'" -ForegroundColor Gray
Write-Host "   • Repository: Tanandco/tanandco-crm" -ForegroundColor Gray
Write-Host "   • Branch: main" -ForegroundColor Gray
Write-Host "   • Build type: Dockerfile" -ForegroundColor Gray
Write-Host "   • Port: 5000" -ForegroundColor Gray
Write-Host "   • Authentication: Allow unauthenticated ✅" -ForegroundColor Gray

Write-Host "`n4️⃣  הוסף משתני סביבה" -ForegroundColor Cyan
Write-Host "   • NODE_ENV=production" -ForegroundColor Gray
Write-Host "   • PORT=5000" -ForegroundColor Gray
Write-Host "   • APP_BASE_URL=https://tanandco.co.il" -ForegroundColor Gray
Write-Host "   • DATABASE_URL=..." -ForegroundColor Gray
Write-Host "   • WA_PHONE_NUMBER_ID=..." -ForegroundColor Gray
Write-Host "   • CLOUD_API_ACCESS_TOKEN=..." -ForegroundColor Gray
Write-Host "   • ועוד... (ראה DEPLOY_VIA_CONSOLE_STEP_BY_STEP.md)" -ForegroundColor Gray

Write-Host "`n5️⃣  לחץ 'Deploy' והמתן 2-5 דקות" -ForegroundColor Cyan

Write-Host "`n💡 אחרי הפריסה:" -ForegroundColor Yellow
Write-Host "   • תקבל URL כמו: https://tanandco-crm-xxxxx-xx.a.run.app" -ForegroundColor Gray
Write-Host "   • תוכל לחבר את זה ל-DNS של tanandco.co.il" -ForegroundColor Gray

Write-Host "`n🌐 פותח Google Cloud Console..." -ForegroundColor Cyan
Start-Process "https://console.cloud.google.com/run?project=tanandco-crm"

Write-Host "`n📖 מדריך מפורט:" -ForegroundColor Yellow
Write-Host "   • DEPLOY_VIA_CONSOLE_STEP_BY_STEP.md" -ForegroundColor Gray
Write-Host "   • FINAL_DEPLOYMENT_INSTRUCTIONS.md" -ForegroundColor Gray

Write-Host "`n✅ הכל מוכן! עקוב אחרי ההוראות בקונסול." -ForegroundColor Green

