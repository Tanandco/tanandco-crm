import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  
  const context = await browser.newContext({
    recordVideo: {
      dir: './videos/',
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  console.log('פותח את דף ההדמיה...');
  await page.goto('http://localhost:5000/social-demo');
  
  console.log('ממתין לטעינת הדף...');
  await page.waitForTimeout(2000);
  
  console.log('לוחץ על כפתור התחל הדמיה...');
  await page.click('button:has-text("התחל הדמיה אוטומטית")');
  
  console.log('ממתין להדמיה להסתיים (15 שניות)...');
  await page.waitForTimeout(17000);
  
  console.log('סוגר דפדפן ושומר וידאו...');
  await context.close();
  await browser.close();
  
  console.log('✅ וידאו נשמר בתיקייה: ./videos/');
})();
