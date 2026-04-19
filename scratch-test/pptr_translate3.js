const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('http://localhost:5173');
    await new Promise(r => setTimeout(r, 2000));

    // Force call translateDynamic in browser context
    await page.evaluate(() => {
        // Find language button
        const btns = Array.from(document.querySelectorAll('button'));
        const langBtn = btns.find(b => b.textContent.includes('English') || b.textContent.includes('Sinhala'));
        if(langBtn) langBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 500));
    
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const siBtn = btns.find(b => b.textContent.includes('Sinhala') && !b.textContent.includes('English'));
        if(siBtn) siBtn.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    // Scrape navigation strings or buttons globally
    const texts = await page.$$eval('*', els => {
        // Collect all text nodes
        let nodes = [];
        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let n;
        while(n = walk.nextNode()) {
            if (n.nodeValue.trim().length > 3) nodes.push(n.nodeValue.trim());
        }
        return Array.from(new Set(nodes));
    });

    console.log("SOME FOUND TEXTS AROUND:", texts.slice(0, 30));

    await browser.close();
})();
