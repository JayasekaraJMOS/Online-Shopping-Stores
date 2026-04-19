const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('http://localhost:5173');
    await new Promise(r => setTimeout(r, 2000));

    // Force call translateDynamic in browser context
    const res = await page.evaluate(() => {
        // Find language button
        const btns = Array.from(document.querySelectorAll('button'));
        const langBtn = btns.find(b => b.textContent.includes('English') || b.textContent.includes('Sinhala'));
        if(langBtn) langBtn.click();
        return "Clicked button";
    });
    
    await new Promise(r => setTimeout(r, 500));
    
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const siBtn = btns.find(b => b.textContent.includes('Sinhala'));
        if(siBtn) siBtn.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    const titles = await page.$$eval('.line-clamp-2', els => els.map(el => el.textContent.trim()));
    console.log("Titles after switch:", titles.slice(0, 5));

    await browser.close();
})();
