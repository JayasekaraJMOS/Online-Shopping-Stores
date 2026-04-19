const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    console.log("Navigating to localhost...");
    await page.goto('http://localhost:5173');

    // Wait for the app to load
    await new Promise(r => setTimeout(r, 5000)); // Wait longer

    // Take screenshot
    await page.screenshot({ path: 'debug.png', fullPage: true });
    console.log("Screenshot saved as debug.png");

    // Check page title
    const title = await page.title();
    console.log("Page title:", title);

    // Check if body has content
    const bodyText = await page.$eval('body', el => el.textContent?.slice(0, 200));
    console.log("Body text preview:", bodyText);

    // Wait for products to load - try multiple times
    let attempts = 0;
    while (attempts < 5) {
        const lineClamp = await page.$$eval('[class*="line-clamp"]', els => els.map(el => el.textContent?.trim()));
        if (lineClamp.length > 0) {
            console.log("Found line-clamp elements:", lineClamp.length);
            break;
        }
        console.log("Waiting for products... attempt", attempts + 1);
        await new Promise(r => setTimeout(r, 2000));
        attempts++;
    }

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
            await new Promise(r => setTimeout(r, 5000)); // Wait longer for translations
        }
    }

    // Now extract product titles
    console.log("Extracting product titles...");
    const titles = await page.$$eval('.line-clamp-2', els => els.map(el => el.textContent.trim()));
    console.log("Found", titles.length, "titles");
    titles.forEach((title, i) => console.log(`${i+1}: ${title}`));

    console.log("\n====== PRODUCT TITLES ======");
    for (const title of titles) {
        console.log("- " + title);
    }
    console.log("=============================\n");

    await browser.close();
})();
