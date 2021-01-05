//Electron Loader
import "dotenv/config";
import { winstonLogger } from "./winstonLoggerSystem";

const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const menuTemplate = require('./view/menuTemplate');

//BOT Loader
const puppeteer = require('puppeteer');
const nodeStorage = require('node-persist');

let electronWindow: any; // window object for Electron

var hostRoomConfig: HostRoomConfig; // Configuration data for Room Host
var isOpenHeadless: boolean = false; // option for open chromium in headless mode

var isBotLaunched: boolean = false; // flag for check whether the bot is running
var puppeteerContainer: any; // puppeteer page object

var puppeteerCustomArgs: string[] = ['--no-sandbox', '--disable-setuid-sandbox'];
if (process.env.TWEAKS_WEBRTCANOYM && JSON.parse(process.env.TWEAKS_WEBRTCANOYM.toLowerCase()) === false) { // tweak by .env
    puppeteerCustomArgs.push('--disable-features=WebRtcHideLocalIpsWithMdns');
}

const MenuItemSwitch = {
    announceMsg: false,
    superAdminKey: false
};

var superKeyList: string;

var botConsoleLineCount: number = 0;

function createWindow() {
    // create the Electron browser window
    electronWindow = new BrowserWindow({
        title: "Haxbotron",
        resizable: true,
        useContentSize: true,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        } //TODO: try to new theme for great visual
    });

    // and load the index.html of the app.
    electronWindow.loadFile('../index.html');

    nodeStorageInit(); // init nodeStorage

    // When the window is closed
    electronWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        electronWindow = null;
    });
}

// get room host information and launch the bot
ipcMain.on('room-make-action', (event: any, arg: any) => { // webRender.js
    // Event emitter for sending asynchronous messages
    //event.sender.send('asynchronous-reply', 'async pong');
    if(arg.password == "") {
        arg.password = null;
    }
    hostRoomConfig = arg;
    if (process.env.TWEAKS_WEBRTCANOYM && JSON.parse(process.env.TWEAKS_WEBRTCANOYM.toLowerCase()) === true) { // tweak by .env
        hostRoomConfig.geo = {
            code: process.env.TWEAKS_GEOLOCATIONOVERRIDE_CODE || "KR"
            , lat: parseFloat(process.env.TWEAKS_GEOLOCATIONOVERRIDE_LAT || "37.5665")
            , lon: parseFloat(process.env.TWEAKS_GEOLOCATIONOVERRIDE_LON || "126.978")
        }
    }
    hostRoomConfig.maxPlayers = parseInt(arg.maxPlayers, 10); // do type casting because conveyed maxPlayers value is string type
    if(isBotLaunched != true) {
        if(Menu.getApplicationMenu().getMenuItemById('headlessModeMenuItem').checked == true) { // if headless mode checkbox is checked
            isOpenHeadless = true;
        } else { // or not checked
            isOpenHeadless = false;
        }
        puppeteerContainer = bot(JSON.stringify(hostRoomConfig));

        Menu.getApplicationMenu().getMenuItemById('startMenuItem').enabled = false;
        Menu.getApplicationMenu().getMenuItemById('stopMenuItem').enabled = true;
        Menu.getApplicationMenu().getMenuItemById('headlessModeMenuItem').enabled = false;
        Menu.getApplicationMenu().getMenuItemById('announceCommandMenuItem').enabled = true;
        electronWindow.webContents.executeJavaScript(`
            document.getElementById('roomSettingDiv').style.display = "none";
            document.getElementById('announcementDiv').style.display = "none";
            document.getElementById('superAdminKeyDiv').style.display = "none";
            document.getElementById('botConsoleDiv').style.display = "block";
            document.getElementById('roomInformationDiv').style.display = "block";
            document.getElementById('roomTitleIndicator').innerHTML = "Title : " + document.getElementById('roomTitle').value;
            document.getElementById('roomPasswordIndicator').innerHTML = "Password : " + document.getElementById('roomPassword').value;
            document.getElementById('roomIndicator').innerHTML = "BOT IS RUNNING NOW";
        `);
        isBotLaunched = true;
    } else {
        dialog.showErrorBox("You can launch only one bot.", "The bot was launched already. You can't launch other bot on this process.");
        winstonLogger.error("The bot was launched already");
    }
});
// send chat message toward the game room
ipcMain.on('msg-send-action', (event: any, arg: any) => { // webRender.js
    // Event emitter for sending asynchronous messages
    //event.sender.send('asynchronous-reply', 'async pong');
    if(isBotLaunched == true) { // only when the bot is running
        puppeteerContainer.then((page: any) => {
            page.evaluate((msgString: any) => {
                window.sendRoomChat(msgString, null); // send chat toward game
            }, arg);
        });
    }
});
// get and store the login key for super admin permission, and send to the bot.
ipcMain.on('super-key-action', (event: any, arg: any) => { // webRender.js
    // Event emitter for sending asynchronous messages
    //event.sender.send('asynchronous-reply', 'async pong');
    if(arg != null) {
        superKeyList = arg;
        nodeStorage.setItem('_SuperAdminKeys', superKeyList); // save into node-persist storage
        if(isBotLaunched == true) { // and if the bot is running
            puppeteerContainer.then((page: any) => {
                page.evaluate((keys: any) => { // also save into localStorage on puppeteer
                    localStorage.setItem('_SuperAdminKeys', keys);
                }, superKeyList);
            });
        }
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', (electronWindow: any) => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electronWindow === null) {
        createWindow();
    }
});

const appMenu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(appMenu);
Menu.getApplicationMenu().getMenuItemById('startMenuItem').click = function() { // add click event handler on the menu item.
    // simulate onClick event like press the button.
    electronWindow.webContents.executeJavaScript(`document.getElementById('launchButton').click();`);
}
Menu.getApplicationMenu().getMenuItemById('stopMenuItem').click = function() { // add click event handler on the menu item.
    // close the headless browser
    puppeteerContainer.then((page: any) => { page.close(); }); // close the puppeteer browser (the single page will be closed actually)
}
Menu.getApplicationMenu().getMenuItemById('superAdminLoginKeyMenuItem').click = function() { // add click event handler on the menu item.
    if(MenuItemSwitch.superAdminKey == false) { // if this menu is not activated
        MenuItemSwitch.superAdminKey = true; // switch and open
        // and load super admin keys onto textarea
        electronWindow.webContents.executeJavaScript(`document.getElementById('superAdminKeyDiv').style.display = "block";`);
        electronWindow.webContents.executeJavaScript("document.getElementById('superKeyList').value = '" + (superKeyList?.replace(/\n|\r\n|\r/g,'\\n') ?? '') + "';");
    } else { // if this menu is activated
        MenuItemSwitch.superAdminKey = false; // switch and close
        electronWindow.webContents.executeJavaScript(`document.getElementById('superAdminKeyDiv').style.display = "none";`);
    }
}
Menu.getApplicationMenu().getMenuItemById('announceCommandMenuItem').click = function() { // add click event handler on the menu item.
    if(MenuItemSwitch.announceMsg == false) {// if this menu is not activated
        MenuItemSwitch.announceMsg = true; // switch and open
        electronWindow.webContents.executeJavaScript(`document.getElementById('announcementDiv').style.display = "block";`);
    } else { // if this menu is activated
        MenuItemSwitch.announceMsg = false; // switch and close
        electronWindow.webContents.executeJavaScript(`document.getElementById('announcementDiv').style.display = "none";`);
    }
}


// In this file you can include the rest of your app's specific main process code.
// You can also put them in separate files and require them here.
async function nodeStorageInit() {
    await nodeStorage.init();
    superKeyList = await nodeStorage.getItem('_SuperAdminKeys');
}

async function bot(hostConfig: string) {
    winstonLogger.info("Haxbotron has started.");

    const browser = await puppeteer.launch({
        headless: isOpenHeadless,
        args: puppeteerCustomArgs
    });
    await browser.on('disconnected', () => {
        isBotLaunched = false;
        Menu.getApplicationMenu().getMenuItemById('startMenuItem').enabled = true;
        Menu.getApplicationMenu().getMenuItemById('stopMenuItem').enabled = false;
        Menu.getApplicationMenu().getMenuItemById('headlessModeMenuItem').enabled = true;
        Menu.getApplicationMenu().getMenuItemById('announceCommandMenuItem').enabled = false;
        electronWindow.webContents.executeJavaScript(`
            document.getElementById('roomSettingDiv').style.display = "block";
            document.getElementById('announcementDiv').style.display = "none";
            document.getElementById('superAdminKeyDiv').style.display = "none";
            document.getElementById('botConsoleDiv').style.display = "none";
            document.getElementById('roomInformationDiv').style.display = "none";
            document.getElementById('roomIndicator').innerHTML = "NOT LAUNCHED YET";
            document.getElementById('roomLinkIndicator').innerHTML = "link";
            document.getElementById('botConsole').value = "";
        `);
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
        botConsoleLineCount++;
        electronWindow.webContents.executeJavaScript("document.getElementById('botConsole').value = \`[" + botConsoleLineCount+ "] " + msg.text() + '\\r\\n' + "\` + document.getElementById('botConsole').value;");
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
        value: hostConfig
    }); // convey room host configuration via cookie

    await page.addScriptTag({
        path: './out/bot_bundle.js'
    });

    // inject functions for uploda data on node-persist storage into puppeteer 
    await page.exposeFunction('uploadStorageData', (key: string, stringfiedData: string) => {
        nodeStorage.setItem(key, stringfiedData);
    });
    await page.exposeFunction('clearStorageData', (key: string) => {
        nodeStorage.removeItem(key);
    });

    // load stored data from node-persist storage to puppeteer html5 localstorage
    await nodeStorage.forEach(async function (datum: any) { // async forEach(callback): This function iterates over each key/value pair and executes an asynchronous callback as well
        // usage: datum.key, datum.value
        if(datum.key != "_LaunchTime") { // except _LaunchTime
            await page.evaluate((tempKey: string, tempStr: string) => {
                localStorage.setItem(tempKey, tempStr);
            }, datum.key, datum.value);
        }
    });

    await page.waitForFunction(() => window.roomURIlink !== undefined); // wait until window.roomURIlink is created. That object is made when room.onRoomLink event is called.
    var conveyedRoomLink: string = await page.evaluate(() => {
        return window.roomURIlink; // get the link
    });
    await electronWindow.webContents.executeJavaScript(`document.getElementById('roomLinkIndicator').innerHTML = "Link : ${conveyedRoomLink}";`); // display the link

    return page;
}

interface HostRoomConfig { // same as RoomConfig. Do not change the structure alone.
    // The name for the room.
    roomName?: string;
    // The name for the host player.
    playerName?: string;
    // The password for the room (no password if ommited).
    password?: string;
    // Max number of players the room accepts.
    maxPlayers?: number;
    // If true the room will appear in the room list.
    public?: boolean;
    // GeoLocation override for the room.
    geo?: {
        "code": string,
        "lat": number,
        "lon": number
    };
    // token doesn't need if the bot is started from Headless page, not standalone.
    token?: string;
    // If set to true the room player list will be empty, the playerName setting will be ignored.
    // Default value is false for backwards compatibility reasons but it's recommended to set this to true.
    noPlayer?: boolean;
}