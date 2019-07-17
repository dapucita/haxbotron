import { async } from "q";

//Electron Loader
const {
    app,
    BrowserWindow,
    Menu,
    dialog,
    ipcMain
} = require('electron');
const menuTemplate = require('./view/menuTemplate');

//BOT Loader
const puppeteer = require('puppeteer');
const nodeStorage = require('node-persist');

let electronWindow: any; // window object for Electron

var hostRoomConfig: HostRoomConfig; // Configuration data for Room Host
var isOpenHeadless: boolean = false; // option for open chromium in headless mode

var isBotLaunched: boolean = false; // flag for check whether the bot is running
var puppeteerContainer: any; // puppeteer page object

function createWindow() {
    // create the Electron browser window
    electronWindow = new BrowserWindow({
        title: "Haxbotron",
        resizable: false,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        } //TODO: try to new theme for great visual
    });

    // and load the index.html of the app.
    electronWindow.loadFile('../index.html');

    // Open the DevTools.
    //electronWindow.webContents.openDevTools();

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
        arg.password = null
    }
    hostRoomConfig = arg;
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

        electronWindow.webContents.executeJavaScript(`
            document.getElementById('roomSettingDiv').style.display = "none";
            document.getElementById('roomInformationDiv').style.display = "block";
            document.getElementById('roomTitleIndicator').innerHTML = "Title : " + document.getElementById('roomTitle').value;
            document.getElementById('roomPasswordIndicator').innerHTML = "Password : " + document.getElementById('roomPassword').value;
            document.getElementById('roomIndicator').innerHTML = "BOT IS RUNNING NOW";
        `);
        isBotLaunched = true;
    } else {
        dialog.showErrorBox("You can launch only one bot.", "The bot was launched already. You can't launch other bot on this process.");
        console.log("The bot was launched already");
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

// In this file you can include the rest of your app's specific main process code.
// You can also put them in separate files and require them here.
async function bot(hostConfig: string) {
    console.log("The headless host has started.");
    await nodeStorage.init();

    const browser = await puppeteer.launch({
        headless: isOpenHeadless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    await browser.on('disconnected', () => {
        clearInterval(storageLoop);
        // browser.close();
        isBotLaunched = false;
        Menu.getApplicationMenu().getMenuItemById('startMenuItem').enabled = true;
        Menu.getApplicationMenu().getMenuItemById('stopMenuItem').enabled = false;
        Menu.getApplicationMenu().getMenuItemById('headlessModeMenuItem').enabled = true;
        electronWindow.webContents.executeJavaScript(`
            document.getElementById('roomSettingDiv').style.display = "block";
            document.getElementById('roomInformationDiv').style.display = "none";
            document.getElementById('roomIndicator').innerHTML = "NOT LAUNCHED YET";
            document.getElementById('roomLinkIndicator').innerHTML = "link";
            document.getElementById('botConsole').innerHTML = "";
        `);
        console.log("The headless host is closed.");
        return;
    });

    const loadedPages = await browser.pages(); // get all pages (acutally it will be only one page in the first loading of puppeteer)
    const page = await loadedPages[0]; // target on empty, blank page

    await page.goto('https://www.haxball.com/headless', {
        waitUntil: 'networkidle2'
    });
    await page.setCookie({
        name: 'botConfig',
        value: hostConfig
    }); // convey room host configuration via cookie

    /* 
    https://stackoverflow.com/questions/51907677
    The console event receives a ConsoleMessage object,
    which tells you what type of call it was (log, error, etc.),
    what the arguments were (args()), etc.
    
    await page.on('console', (msg: any) => {
        for (let i = 0; i < msg.args().length; ++i){
            console.log(`${i}: ${msg.args()[i]}`);
        }
    });
    */

    await page.addScriptTag({
        path: './out/bot_bundle.js'
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

    // get stored data from puppeteer html5 localstorage and copy them into node-persist storage
    var storageLoop = setInterval(async function () {
        var msgContext: any = await page.evaluate(() => { // get log message
            var msgChunk: string = '';
            for(var loopCount = 0; loopCount < window.logQueue.length; loopCount++) {
                msgChunk = window.logQueue.pop() + '\\r\\n' + msgChunk;
            }
            return msgChunk;
        });

        // and print it on electron's textarea
        if(await msgContext != '') {
            await electronWindow.webContents.executeJavaScript("document.getElementById('botConsole').value = '" + msgContext + "' + document.getElementById('botConsole').value;");
        } // TODO: replace logging system using textarea to rest api server
        // FIXME: this logging system has a problem. "Uncaught SyntaxError: Unexpected identifier at WebFrame"

        var localStorageData: any[] = await page.evaluate(() => {
            let jsonData: any = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key: string | null = localStorage.key(i);
                if (typeof key === "string") {
                    jsonData[key] = localStorage.getItem(key);
                }
            }
            return jsonData;
        });
        Object.keys(localStorageData).forEach(function (elementKey: any) {
            nodeStorage.setItem(elementKey, localStorageData[elementKey]);
        });
    }, 5000); // by each 5seconds

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
}