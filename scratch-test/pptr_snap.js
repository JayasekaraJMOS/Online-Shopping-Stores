const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    await page.goto('http://localhost:5173');
    await new Promise(r => setTimeout(r, 2000));

    // Open language menu wrapper
    console.log("Opening language menu...");
    await page.evaluate(() => {
        const span = Array.from(document.querySelectorAll('span')).find(s => s.textContent.trim() === 'EN');
        if(span && span.parentElement) span.parentElement.click();
    });
    await new Promise(r => setTimeout(r, 500));
    
    // Check if dropdown elements exist
    const opts = await page.$$eval('button', els => els.map(b => b.textContent.trim().replace(/\s+/g, ' ')));
    console.log("Found buttons:", opts.filter(o => o.includes('Sinhala')));

    // Click Sinhala
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const siBtn = btns.find(b => b.textContent.includes('SI') && b.textContent.includes('Sinhala'));
        if(siBtn) siBtn.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    // Save screenshot
    await page.screenshot({ path: '../pptr_transl_home.png', fullPage: true });
    console.log("Screenshot saved.");

    await browser.close();
})();
