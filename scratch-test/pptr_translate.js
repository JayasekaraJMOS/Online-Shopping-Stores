const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    console.log("Navigating to localhost...");
    await page.goto('http://localhost:5173');

    // Wait for the app to load
    await new Promise(r => setTimeout(r, 2000));

    // Get current language text
    console.log("Clicking language switcher...");
    // Find the language button (it contains 'English' usually, inside NavBar)
    const buttons = await page.$$('button');
    let langBtn = null;
    for (const border of buttons) {
        const text = await border.evaluate(el => el.textContent);
        if (text && (text.includes('English') || text.includes('Sinhala') || text.includes('Tamil'))) {
            const hasGlobe = await border.evaluate(el => el.innerHTML.includes('svg')); // roughly
            if (hasGlobe) langBtn = border;
        }
    }

    if (langBtn) {
        await langBtn.click();
        await new Promise(r => setTimeout(r, 500));
        
        // Find the 'Sinhala' option and click it
        const options = await page.$$('button');
        let siOpt = null;
        for (const o of options) {
            const text = await o.evaluate(el => el.textContent);
            if (text && text.includes('Sinhala')) {
                siOpt = o;
            }
        }
        if (siOpt) {
            console.log("Switching to Sinhala...");
            await siOpt.click();
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    // Now extract product titles
    console.log("Extracting product titles...");
    const titles = await page.$$eval('.line-clamp-2', els => els.map(el => el.textContent.trim()));

    console.log("\n====== PRODUCT TITLES ======");
    for (const title of titles) {
        console.log("- " + title);
    }
    console.log("=============================\n");

    await browser.close();
})();
