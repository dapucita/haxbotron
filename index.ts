//BOT Loader
const readline = require("readline");
const puppeteer = require('puppeteer');

var isOpenHeadless: boolean = false; //option for open chrome in headless mode
var isBotLaunched: boolean = false;
var isTokenEmpty: boolean = true;
var headlessToken: string = '';
var pageContainer:any;

async function bot() {
    const browser = await puppeteer.launch({
        headless: isOpenHeadless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    /*await page.on('console', (msg: any) => {
        //output messages come from puppeteer console
        for (let i = 0; i < msg.args().length; ++i) {
            console.log(`[PUPPETEER] ${msg.args()[i]}`); //args example: console.log('hello', 5, {foo: 'bar'}) on JS injected in puppeteer
        }
    });*/
    await page.goto('https://www.haxball.com/headless', {
        waitUntil: 'networkidle2'
    });
    await page.setCookie({name: 'botToken', value: headlessToken}); //auth token for headless-api page
    await page.addScriptTag({
        path: './out/bot_bundle.js'
    });
    return page;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("================================================================================");
console.log('\x1b[32m%s\x1b[0m', "H a x b o t r o n"); //green color
console.log("Haxbotron Command Line Interface - type 'help' command.");
console.log("You can get token for headless host on https://www.haxball.com/headlesstoken");
console.log("================================================================================");

rl.setPrompt("Haxbotron@localhost > ");

rl.prompt();
rl.on("line", (inputData: string) => {
    var data: string[] = inputData.split(" ");
    switch (data[0]) {
        case "start":
            if (isBotLaunched) {
                console.log("Bot already has been launched.")
            } else {
                if(isTokenEmpty) { // if headless token not setted yet
                    console.log("error: you need to set headless token for starting bot. use token command.");
                } else {
                    //bot();
                    pageContainer = bot();
                    isBotLaunched = true;
                    console.log("Bot loaded.");
                }
            }
            break;
        case "token":
            if(data[1] === undefined || data[1] == '') {
                console.log("error: token key field should not be empty.");
            } else {
                console.log(`token key is saved. (${data[1]})`);
                headlessToken = data[1];
                isTokenEmpty = false;
            }
            break;
        case "exit":
            process.exit(0);
            break;
        case "ping":
            if(isBotLaunched) {
                //pageContainer.then( ( page:any ) => { page.setCookie({name: 'ping', value: 'ping from main launcher'}); } );
                
            } else {
                console.log("error: you can do ping only when the bot is launched.");
            }
            break;
        case "help":
            console.log("Haxbotron CLI | Available commands : start, exit, token, help");
            break;
        default:
            console.log(`error: ${data} is wrong command.`);
    }
    rl.prompt();
});

/* puppeteer cookie usage
https://stackoverflow.com/questions/50584770/passing-multiple-cookies-to-puppeteer
await page.setCookie(...cookies);
const cookiesSet = await page.cookies(url);
console.log(JSON.stringify(cookiesSet));
*/