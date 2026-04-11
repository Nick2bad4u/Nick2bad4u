const { firefox } = require('playwright');
const path = require('path');

(async () => {
    const browser = await firefox.launch();
    const page = await browser.newPage();

    // Set viewport to exact dimensions, although CSS also controls it
    await page.setViewportSize({ width: 1200, height: 630 });

    const templatePath = path.resolve(__dirname, 'template.html');
    await page.goto(`file://${templatePath}`);

    // Select all the cards and loop through them
    for (let i = 1; i <= 8; i++) {
        const cardSelector = `#card${i}`;
        const cardElement = await page.$(cardSelector);

        if (cardElement) {
            // Scroll element into view and take the screenshot of just that element
            await cardElement.scrollIntoViewIfNeeded();
            await cardElement.screenshot({ path: path.join(__dirname, `style${i}.png`) });
            console.log(`Generated style${i}.png`);
        } else {
            console.error(`Card ${cardSelector} not found.`);
        }
    }

    await browser.close();
})();
