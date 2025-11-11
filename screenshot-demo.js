import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 }
  });
  
  console.log('📸 פותח את דף ההדמיה...');
  await page.goto('http://localhost:5000/social-demo', { waitUntil: 'networkidle' });
  
  console.log('📸 צילום 1: מסך ההתחלה');
  await page.screenshot({ path: 'demo-screenshot-1-start.png', fullPage: true });
  
  console.log('📸 לוחץ על כפתור התחל הדמיה...');
  await page.click('button:has-text("התחל הדמיה אוטומטית")');
  await page.waitForTimeout(2000);
  
  console.log('📸 צילום 2: בחירת עמוד אינסטגרם');
  await page.screenshot({ path: 'demo-screenshot-2-page-select.png', fullPage: true });
  await page.waitForTimeout(3000);
  
  console.log('📸 צילום 3: העלאת תמונה');
  await page.screenshot({ path: 'demo-screenshot-3-image-upload.png', fullPage: true });
  await page.waitForTimeout(3000);
  
  console.log('📸 צילום 4: כתיבת טקסט');
  await page.screenshot({ path: 'demo-screenshot-4-text.png', fullPage: true });
  await page.waitForTimeout(3000);
  
  console.log('📸 צילום 5: פרסום הפוסט');
  await page.screenshot({ path: 'demo-screenshot-5-publish.png', fullPage: true });
  await page.waitForTimeout(3000);
  
  console.log('📸 צילום 6: הצלחה');
  await page.screenshot({ path: 'demo-screenshot-6-success.png', fullPage: true });
  
  await browser.close();
  
  console.log('✅ סיימתי! 6 צילומי מסך נשמרו');
  console.log('📁 הקבצים: demo-screenshot-1-start.png עד demo-screenshot-6-success.png');
})();
