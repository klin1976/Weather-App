const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--allow-file-access-from-files']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 412, height: 915 }); // Pixel 7 viewport

    const htmlPath = 'file:///' + 'd:/klin/Antigravity/Weather/index.html';
    console.log(`Navigating to ${htmlPath}`);

    // Navigate and wait for network idle to ensure resources are loaded
    await page.goto(htmlPath, { waitUntil: 'networkidle0' });

    // Ensure we wait for any initial weather fetching
    await new Promise(r => setTimeout(r, 4000));

    const screenshotsDir = 'd:\\klin\\Antigravity\\Weather\\play-store-assets\\screenshots';

    // 1. Light theme
    console.log('Taking light theme screenshot...');
    await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
    });
    await new Promise(r => setTimeout(r, 1000)); // wait for transition
    await page.screenshot({ path: path.join(screenshotsDir, '1_light_theme.png') });

    // 2. Dark theme
    console.log('Taking dark theme screenshot...');
    await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(screenshotsDir, '2_dark_theme.png') });

    // 3. AQI and UV section scrolled down
    console.log('Taking AQI section screenshot...');
    await page.evaluate(() => {
        window.scrollBy(0, 600); // Scroll down to reveal AQI / Details
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(screenshotsDir, '3_aqi_details.png') });

    // 4. Multi-city/Search view
    console.log('Taking search/multi-city screenshot...');
    await page.evaluate(() => {
        window.scrollTo(0, 0); // Scroll back to top
        const searchInput = document.getElementById('search-input') || document.querySelector('input');
        if (searchInput) {
            searchInput.focus();
        }
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(screenshotsDir, '4_multi_city.png') });

    console.log('Closing browser...');
    await browser.close();
    console.log('Screenshots completed successfully.');
})().catch(err => {
    console.error('Error generating screenshots:', err);
    process.exit(1);
});
