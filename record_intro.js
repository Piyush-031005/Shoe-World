const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Starting Playwright to record 1080p intro...');
  
  // Ensure video directory exists
  const videoDir = path.join(__dirname, 'public', 'previews');
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const browser = await chromium.launch({ 
    headless: true,
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1920, height: 1080 }
    },
    // No cursor
    hasTouch: false,
  });
  
  const page = await context.newPage();
  
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000');
  
  console.log('Recording 17 seconds of cinematic intro...');
  // 17 seconds ensures the 15-second intro finishes and settles on the UI
  await page.waitForTimeout(17000);
  
  console.log('Closing browser and saving video...');
  await context.close();
  await browser.close();
  
  // Playwright generates a random hash for the video name. Let's rename it to something clean.
  const files = fs.readdirSync(videoDir);
  const webmFile = files.find(f => f.endsWith('.webm'));
  if (webmFile) {
    const oldPath = path.join(videoDir, webmFile);
    const newPath = path.join(videoDir, 'cinematic-intro-v7.webm');
    if (fs.existsSync(newPath)) fs.unlinkSync(newPath); // Clean old if exists
    fs.renameSync(oldPath, newPath);
    console.log(`\n✅ Video successfully exported to: public/previews/cinematic-intro-v7.webm`);
  }
})();
