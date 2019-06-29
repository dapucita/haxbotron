//BOT Loader
const puppeteer = require('puppeteer');
async function bot () {
    const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto('https://www.haxball.com/headless', {waitUntil: 'networkidle2'});
    await page.addScriptTag({path: './dist/bot_bundle.js'});
}
bot();
console.log('Bot loaded');