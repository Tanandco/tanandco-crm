# בדיקת שליחת הודעת WhatsApp
# שימוש: .\test-whatsapp.ps1 -PhoneNumber "972501234567"

param(
    [string]$PhoneNumber = "972501234567"
)

# Token מ-Cloud Run
# ⚠️ החלף בערך האמיתי מ-Cloud Run או מ-Replit
$WHATSAPP_ACCESS_TOKEN = "YOUR_WHATSAPP_ACCESS_TOKEN_HERE"

# Phone Number ID
$PHONE_NUMBER_ID = "699582612923896"

# API Version
$API_VERSION = "v18.0"

Write-Host "📱 שולח הודעת בדיקה ל-WhatsApp..." -ForegroundColor Cyan
Write-Host "📞 למספר: $PhoneNumber" -ForegroundColor Yellow
Write-Host ""

$url = "https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages"

$body = @{
    messaging_product = "whatsapp"
    to = $PhoneNumber
    type = "text"
    text = @{
        body = "בדיקה - Tan & Co מחובר בהצלחה! 🎉"
    }
} | ConvertTo-Json -Depth 10

$headers = @{
    "Authorization" = "Bearer $WHATSAPP_ACCESS_TOKEN"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ContentType "application/json"
    
    Write-Host "✅ הודעה נשלחה בהצלחה!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ שגיאה בשליחת הודעה:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host "Details:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
    }
}

