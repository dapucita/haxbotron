//Electron Loader
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = require('electron');
const menuTemplate = require('./view/menuTemplate');

//BOT Loader
const puppeteer = require('puppeteer');
const nodeStorage = require('node-persist');

let electronWindow; // window object for Electron

var hostRoomConfig: HostRoomConfig; // Configuration data for Room Host
var isOpenHeadless: boolean = false; // option for open chromium in headless mode

var isBotLaunched: boolean = false; // flag for check whether the bot is running
var pageContainer: any; // puppeteer window object

function createWindow() {
    // create the Electron browser window
    electronWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
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
ipcMain.on('room-make-action', (event: any, arg: any) => {
    // Event emitter for sending asynchronous messages
    //event.sender.send('asynchronous-reply', 'async pong');
    hostRoomConfig = arg;
    hostRoomConfig.maxPlayers = parseInt(arg.maxPlayers, 10); // do type casting because conveyed maxPlayers value is string type
    if(isBotLaunched != true) {
        pageContainer = bot(JSON.stringify(hostRoomConfig));
        isBotLaunched = true;
    } else {
        console.log("The bot is running already.");
    }
});

const electronMenu = Menu.buildFromTemplate(menuTemplate);

Menu.setApplicationMenu(electronMenu);

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

// In this file you can include the rest of your app's specific main process code.
// You can also put them in separate files and require them here.
async function bot(hostConfig: string) {
    await nodeStorage.init();

    const browser = await puppeteer.launch({
        headless: isOpenHeadless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

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
    */
    await page.on('console', (msg: any) => {
        for (let i = 0; i < msg.args().length; ++i){
            console.log(`${i}: ${msg.args()[i]}`);
        }
    });

    await page.addScriptTag({
        path: './out/bot_bundle.js'
    });

    // load stored data from node-persist storage to puppeteer html5 localstorage
    await nodeStorage.forEach(async function (datum: any) { // async forEach(callback): This function iterates over each key/value pair and executes an asynchronous callback as well
        // usage: datum.key, datum.value
        await page.evaluate((tempKey: string, tempStr: string) => {
            localStorage.setItem(tempKey, tempStr);
        }, datum.key, datum.value);
    });

    // get stored data from puppeteer html5 localstorage and copy them into node-persist storage
    setInterval(async function () {
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

/*===========



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
        case "start": {
            if (isBotLaunched) {
                console.log("Bot already has been launched.");
            } else {
                if (isTokenEmpty) { // if headless token not setted yet
                    console.log("error: you need to set headless token for starting bot. use token command.");
                } else {
                    pageContainer = bot();
                    isBotLaunched = true;
                    console.log("Bot loaded.");
                }
            }
            break;
        }
        case "token": {
            if (data[1] === undefined || data[1] == '') {
                console.log("error: token key field should not be empty.");
            } else {
                console.log(`token key is saved. (${data[1]})`);
                headlessToken = data[1];
                isTokenEmpty = false;
            }
            break;
        }
        case "exit": {
            process.exit(0);
            break;
        }
        case "help": {
            console.log("Haxbotron CLI | Available commands : start, exit, token, help");
            break;
        }
        default: {
            console.log(`error: ${data} is wrong command.`);
        }
    }
    rl.prompt();
});

===========*/