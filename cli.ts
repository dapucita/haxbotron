// Haxbotron CLI Launcher
// This is the load part of the bot

//import modules
import { winstonLogger } from "./winstonLoggerSystem";
import { tweaks_geoLocationOverride, tweaks_WebRTCAnoym } from "./tweaks";
import { RoomConfig } from "./model/RoomObject/RoomConfig";

// BOT Loader
const inquirer = require("inquirer")
const puppeteer = require('puppeteer');
const nodeStorage = require('node-persist');

var hostRoomConfig: RoomConfig; //room settings and information

var isOpenHeadless: boolean = true; // option for open chromium in headless mode
var isBotLaunched: boolean = false; // flag for check whether the bot is running
var puppeteerContainer: any; // puppeteer page object

var puppeteerCustomArgs: string[] = ['--no-sandbox', '--disable-setuid-sandbox'];
if (tweaks_WebRTCAnoym === false) { // tweaks_WebRTCAnoym : Local IP WebRTC Anonymization for the bot. MORE INFO : tweaks.ts
    puppeteerCustomArgs.push('--disable-features=WebRtcHideLocalIpsWithMdns');
}

// 여기에 hostRoomConfig에 데이터를 적용하는 코드를 작성
hostRoomConfig = { //default init
    roomName: "🤖 𝑯 𝒂 𝒙 𝒃 𝒐 𝒕 𝒓 𝒐 𝒏",
    playerName: "🤖",
    password: "",
    maxPlayers: 12,
    public: true,
    token: "", //token key from console input
    noPlayer: true
}

if (tweaks_geoLocationOverride.patch === true) { // tweaks_geoLocationOverride : GeoLocation overriding for the room. MORE INFO : tweaks.ts
    hostRoomConfig.geo = {
        code: tweaks_geoLocationOverride.code
        , lat: tweaks_geoLocationOverride.lat
        , lon: tweaks_geoLocationOverride.lon
    }
}

//bot open
nodeStorageInit(); // init nodeStorage

puppeteerContainer = makeBot(hostRoomConfig);
isBotLaunched = true;

// In this file you can include the rest of your app's specific main process code.
// You can also put them in separate files and require them here.
async function nodeStorageInit() {
    await nodeStorage.init();
}

async function makeBot(hostConfig: any) {
    winstonLogger.info("Haxbotron CLI starts now !!!");
    // input user custom config for room
    await inquirer
        .prompt([
            {
                name: "inputRoomName",
                type: "input",
                message: "Set your room Title",
            },
            {
                name: "inputRoomPassword",
                type: "input",
                message: "Set your room Password (if no password, just ENTER)",
            },
            {
                name: "inputRoomMaxPlayers",
                type: "number",
                message: "How many Max Players?",
            },
            {
                name: "inputRoomPublic",
                type: "confirm",
                message: "Is room Public?",
            },
            {
                name: "inputRoomTokenKey",
                type: "input",
                message: "Set your Token Key",
            },
            {
                name: "inputHeadlessModeSelect",
                type: "confirm",
                message: "Do you want Headless Mode?",
            }
        ])
        .then((answerConfig: any) => {
            hostConfig.roomName = answerConfig.inputRoomName;
            if (answerConfig.inputRoomPassword == "") {
                hostConfig.password = null;
            } else {
                hostConfig.password = answerConfig.inputRoomPassword;
            }
            hostConfig.maxPlayers = answerConfig.inputRoomMaxPlayers;
            hostConfig.public = answerConfig.inputRoomPublic;
            hostConfig.token = answerConfig.inputRoomTokenKey;
            isOpenHeadless = answerConfig.inputHeadlessModeSelect;
        });

    winstonLogger.info("Haxbotron has started.");
    //await nodeStorage.init();

    /*
    If you are hosting on a VPS using Chrome version 78 or greater it is required to disable the Local IP WebRTC Anonymization feature for the host to work.
    Run chrome with the command flag --disable-features=WebRtcHideLocalIpsWithMdns to disable the feature.
    */

    const browser = await puppeteer.launch({
        headless: isOpenHeadless,
        args: puppeteerCustomArgs
    });

    await browser.on('disconnected', () => {
        clearInterval(storageLoop);
        // browser.close();
        isBotLaunched = false;
        winstonLogger.info("Haxbotron is closed.");
        return;
    });

    const loadedPages = await browser.pages(); // get all pages (acutally it will be only one page in the first loading of puppeteer)
    const page = await loadedPages[0]; // target on empty, blank page

    // logging system --
    // https://stackoverflow.com/questions/47539043/how-to-get-all-console-messages-with-puppeteer-including-errors-csp-violations
    await page.on('console', (msg: any) => {
        switch(msg.type()) {
            case "log": {
                winstonLogger.info(msg.text());
                break;
            }
            case "info": {
                winstonLogger.info(msg.text());
                break;
            }
            case "error": {
                winstonLogger.error(msg.text());
                break;
            }
            case "warning": {
                winstonLogger.warn(msg.text());
                break;
            }
            default: {
                winstonLogger.info(msg.text());
                break;
            }
        }
    });
    await page.on('pageerror', (msg: any) => {
        winstonLogger.error(msg);
    });
    await page.on('requestfailed', (msg: any) => {
        winstonLogger.error(`${msg.failure().errorText} ${msg.url()}`);
    });
    // -- logging system

    await page.goto('https://www.haxball.com/headless', {
        waitUntil: 'networkidle2'
    });
    await page.setCookie({
        name: 'botConfig',
        value: JSON.stringify(hostConfig)
    }); // convey room host configuration via cookie

    await page.addScriptTag({
        path: './out/bot_bundle.js'
    });

    // load stored data from node-persist storage to puppeteer html5 localstorage
    await nodeStorage.forEach(async function (datum: any) { // async forEach(callback): This function iterates over each key/value pair and executes an asynchronous callback as well
        // usage: datum.key, datum.value
        if (datum.key != "_LaunchTime") { // except _LaunchTime
            await page.evaluate((tempKey: string, tempStr: string) => {
                localStorage.setItem(tempKey, tempStr);
            }, datum.key, datum.value);
        }
    });

    // get stored data from puppeteer html5 localstorage and copy them into node-persist storage
    var storageLoop = setInterval(async function () {
        // data from bot
        var localStorageData: any[] = await page.evaluate(() => {
            let jsonData: any = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key: string | null = localStorage.key(i);
                if (typeof key === "string" && key != "_SuperAdminKeys") { // not load _SuperAdminKeys from localStorage on puppeteer
                    jsonData[key] = localStorage.getItem(key);
                }
            }
            return jsonData;
        });

        // save data
        Object.keys(localStorageData).forEach(function (elementKey: any) {
            nodeStorage.setItem(elementKey, localStorageData[elementKey]);
        });
    }, 5000); // by each 5seconds

    /*
    await page.waitForFunction(() => window.roomURIlink !== undefined); // wait until window.roomURIlink is created. That object is made when room.onRoomLink event is called.
    var conveyedRoomLink: string = await page.evaluate(() => {
        return window.roomURIlink; // get the link
    });

    await console.log(`This room has a link now : ${conveyedRoomLink}`); // print the link
    */

    return page;
}