// Haxbotron CLI Launcher
// This is the load part of the bot

//import modules
import "dotenv/config";
import * as dbUtilityInject from "./injection/function/db.utility";
import { winstonLogger } from "./winstonLoggerSystem";
import { RoomConfig } from "./model/RoomObject/RoomConfig";


// BOT Loader
const inquirer = require("inquirer")
const puppeteer = require('puppeteer');

var hostRoomConfig: RoomConfig; // room settings and information
var roomUID: string = "haxbotron-room-default-1"; // unique identifier for game room

var isOpenHeadless: boolean = true; // option for open chromium in headless mode
var isBotLaunched: boolean = false; // flag for check whether the bot is running
var puppeteerContainer: any; // puppeteer page object
var puppeteerCustomArgs: string[] = ['--no-sandbox', '--disable-setuid-sandbox'];

if (process.env.TWEAKS_WEBRTCANOYM && JSON.parse(process.env.TWEAKS_WEBRTCANOYM.toLowerCase()) === false) { // tweak by .env
    puppeteerCustomArgs.push('--disable-features=WebRtcHideLocalIpsWithMdns');
}

hostRoomConfig = { //default init
    roomName: "Haxball Play 𝘸𝘪𝘵𝘩 𝙃𝙖𝙭𝙗𝙤𝙩𝙧𝙤𝙣🤖",
    playerName: "🤖",
    password: "",
    maxPlayers: 12,
    public: true,
    token: "", //token key from console input
    noPlayer: true
}

if (process.env.TWEAKS_WEBRTCANOYM && JSON.parse(process.env.TWEAKS_WEBRTCANOYM.toLowerCase()) === true) { // tweak by .env
    hostRoomConfig.geo = {
        code: process.env.TWEAKS_GEOLOCATIONOVERRIDE_CODE || "KR"
        , lat: parseFloat(process.env.TWEAKS_GEOLOCATIONOVERRIDE_LAT || "37.5665")
        , lon: parseFloat(process.env.TWEAKS_GEOLOCATIONOVERRIDE_LON || "126.978")
    }
}

//bot open

puppeteerContainer = makeBot(hostRoomConfig);
isBotLaunched = true;

// In this file you can include the rest of your app's specific main process code.
// You can also put them in separate files and require them here.

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
            },
            {
                name: "inputRoomUID",
                type: "input",
                message: "Set your UID of new room",
            }
        ])
        .then((answerConfig: any) => {
            hostConfig.roomName = answerConfig.inputRoomName;
            if (answerConfig.inputRoomPassword == "") {
                hostConfig.password = null;
            } else {
                hostConfig.password = answerConfig.inputRoomPassword;
            }
            if (answerConfig.inputRoomUID == "") {
                roomUID = "haxbotron-room-default-1";
            } else {
                roomUID = answerConfig.inputRoomUID;
            }
            hostConfig.maxPlayers = answerConfig.inputRoomMaxPlayers;
            hostConfig.public = answerConfig.inputRoomPublic;
            hostConfig.token = answerConfig.inputRoomTokenKey;
            isOpenHeadless = answerConfig.inputHeadlessModeSelect;
        });

    winstonLogger.info("Haxbotron has started.");

    /*
    If you are hosting on a VPS using Chrome version 78 or greater it is required to disable the Local IP WebRTC Anonymization feature for the host to work.
    Run chrome with the command flag --disable-features=WebRtcHideLocalIpsWithMdns to disable the feature.
    */

    const browser = await puppeteer.launch({
        headless: isOpenHeadless,
        args: puppeteerCustomArgs
    });

    await browser.on('disconnected', () => {
        isBotLaunched = false;
        winstonLogger.info("Haxbotron is closed.");
        return;
    });

    const loadedPages = await browser.pages(); // get all pages (acutally it will be only one page in the first loading of puppeteer)
    const page = await loadedPages[0]; // target on empty, blank page

    // logging system --
    // https://stackoverflow.com/questions/47539043/how-to-get-all-console-messages-with-puppeteer-including-errors-csp-violations
    await page.on('console', (msg: any) => {
        switch (msg.type()) {
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
    await page.setCookie(
        {
            name: 'botConfig',
            value: JSON.stringify(hostConfig)
        },
        {
            name: 'botRoomUID',
            value: roomUID // default value (//TODO: it will be able to change in the future.....)
        }
    ); // convey room host configuration via cookie

    await page.addScriptTag({
        path: './out/bot_bundle.js'
    });

    // inject functions for do CRUD with DB Server ====================================
    await page.exposeFunction('createSuperadminDB', dbUtilityInject.createSuperadminDB);
    await page.exposeFunction('readSuperadminDB', dbUtilityInject.readSuperadminDB);
    //await page.exposeFunction('updateSuperadminDB', dbUtilityInject.updateSuperadminDB); //this function is not implemented.
    await page.exposeFunction('deleteSuperadminDB', dbUtilityInject.deleteSuperadminDB);

    await page.exposeFunction('createPlayerDB', dbUtilityInject.createPlayerDB);
    await page.exposeFunction('readPlayerDB', dbUtilityInject.readPlayerDB);
    await page.exposeFunction('updatePlayerDB', dbUtilityInject.updatePlayerDB);
    await page.exposeFunction('deletePlayerDB', dbUtilityInject.deletePlayerDB);
    
    await page.exposeFunction('createBanlistDB', dbUtilityInject.createBanlistDB);
    await page.exposeFunction('readBanlistDB', dbUtilityInject.readBanlistDB);
    await page.exposeFunction('updateBanlistDB', dbUtilityInject.updateBanlistDB);
    await page.exposeFunction('deleteBanlistDB', dbUtilityInject.deleteBanlistDB);
    // ================================================================================
    return page;
}