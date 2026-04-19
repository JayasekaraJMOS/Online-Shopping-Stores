const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    console.log("Navigating to localhost...");
    await page.goto('http://localhost:5173');

    console.log("Opening chat box...");
    await page.waitForSelector('button.w-16.h-16.rounded-full');
    await page.click('button.w-16.h-16.rounded-full');

    await new Promise(r => setTimeout(r, 1000));

    console.log("Clicking 'Track Order'...");
    
    // Instead of pseudo-selector, iterate through buttons:
    const buttons = await page.$$('button');
    let trackButton = null;
    for (const b of buttons) {
        const text = await b.evaluate(el => el.textContent);
        if (text && text.includes('Track Order')) {
            trackButton = b;
            break;
        }
    }
    
    if (trackButton) {
        await trackButton.click();
    } else {
        console.log("Could not find Track Order button!");
    }

    console.log("Waiting for bot to reply...");
    await new Promise(r => setTimeout(r, 4000));

    // Type the order number
    console.log("Typing order number '123456'...");
    await page.waitForSelector('input[placeholder="Type your question..."]');
    await page.type('input[placeholder="Type your question..."]', '123456');
    await page.keyboard.press('Enter');

    console.log("Waiting for final bot reply...");
    await new Promise(r => setTimeout(r, 4000));

    const messages = await page.$$eval('.max-w-\\[85\\%\\]', els => els.map(el => {
        const isUser = el.classList.contains('text-white') && el.classList.contains('bg-[#2563EB]');
        return (isUser ? "USER: " : "BOT: ") + el.textContent.trim().replace(/\s+/g, ' ');
    }));

    console.log("\n====== CHAT TRANSCRIPT ======");
    for (const msg of messages) {
        console.log("- " + msg);
    }
    console.log("=============================\n");

    await browser.close();
})();
