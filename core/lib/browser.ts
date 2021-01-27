import puppeteer from "puppeteer";
import { winstonLogger } from "../winstonLoggerSystem";
import { BrowserHostConfig } from "./browser.hostconfig";
import * as dbUtilityInject from "./db.injection";

/**
* Use this class for control Headless Browser.
* HeadlessBrowser.getInsance()
*/
export class HeadlessBrowser {
    /**
    * Singleton Instance.
    */
    private static instance: HeadlessBrowser;

    /**
    * Container for headless browser.
    */
    private _BrowserContainer: puppeteer.Browser | undefined;
    private _PageContainer: Map<string, puppeteer.Page> = new Map();


    /**
    * DO NOT USE THIS CONSTRUCTOR.
    */
    private HeadlessBrowser() { }

    /**
    * Get Singleton Instance.
    */
    public static getInstance(): HeadlessBrowser {
        if (this.instance == null) {
            this.instance = new HeadlessBrowser();
            this.instance.initBrowser();
        }
        return this.instance;
    }

    /**
    * Launch and init headless browser.
    */
    private async initBrowser() {
        const browserSettings = {
            customArgs: ['--no-sandbox', '--disable-setuid-sandbox']
            , openHeadless: true
        }
        if (process.env.TWEAKS_HEADLESSMODE && JSON.parse(process.env.TWEAKS_HEADLESSMODE.toLowerCase()) === false) {
            browserSettings.openHeadless = false;
        }
        if (process.env.TWEAKS_WEBRTCANOYM && JSON.parse(process.env.TWEAKS_WEBRTCANOYM.toLowerCase()) === false) {
            browserSettings.customArgs.push('--disable-features=WebRtcHideLocalIpsWithMdns');
        }

        winstonLogger.info("[core] The browser is opened.");
        
        this._BrowserContainer = await puppeteer.launch({ headless: browserSettings.openHeadless, args: browserSettings.customArgs });

        this._BrowserContainer.on('disconnected', () => {
            winstonLogger.info("[core] The browser is closed. Core server will open new one automatically.");
            this._BrowserContainer!.close();
            this.initBrowser();
            return;
        });
    }

    /**
    * Get all pages as array.
    */
    private async fetchPages(): Promise<puppeteer.Page[]> {
        return await this._BrowserContainer!.pages();
    }

    /**
    * Close given page.
    */
    private async closePage(ruid: string) {
        await this._PageContainer.get(ruid)?.close();
        this._PageContainer.delete(ruid);
    }

    /**
    * Create new page.
    */
    private async createPage(ruid: string, hostConfig: BrowserHostConfig): Promise<puppeteer.Page> {
        if (process.env.TWEAKS_GEOLOCATIONOVERRIDE && JSON.parse(process.env.TWEAKS_GEOLOCATIONOVERRIDE.toLowerCase()) === true) {
            hostConfig.geo = {
                code: process.env.TWEAKS_GEOLOCATIONOVERRIDE_CODE || "KR"
                , lat: parseFloat(process.env.TWEAKS_GEOLOCATIONOVERRIDE_LAT || "37.5665")
                , lon: parseFloat(process.env.TWEAKS_GEOLOCATIONOVERRIDE_LON || "126.978")
            }
        }

        const page: puppeteer.Page = await this._BrowserContainer!.newPage();

        page.on('console', (msg: any) => {
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
        page.on('pageerror', (msg: any) => {
            winstonLogger.error(msg);
        });
        page.on('requestfailed', (msg: any) => {
            winstonLogger.error(`${msg.failure().errorText} ${msg.url()}`);
        });
        page.on('close', () => {
            winstonLogger.info(`[core] The page for the game room '${ruid}' is closed.`);
        });

        await page.goto('https://www.haxball.com/headless', {
            waitUntil: 'networkidle2'
        });

        await page.setCookie( // convey room host configuration via cookie
            { name: 'botConfig', value: JSON.stringify(hostConfig) },
            { name: 'botRoomRUID', value: ruid }
        );

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

        this._PageContainer.set(ruid, page)
        return this._PageContainer.get(ruid)!
    }

    private async fetchRoomURILink(ruid: string): Promise<string> {
        await this._PageContainer.get(ruid)!.waitForFunction(() => window.roomURIlink !== undefined);
            
        let link: string = await this._PageContainer.get(ruid)!.evaluate(() => {
            return window.roomURIlink;
        });

        return link;
    }

    /**
    * Check if the room exists.
    */
    private isExistRoom(ruid: string): boolean {
        if (this._PageContainer.has(ruid)) return true;
        else return false;
    }

    /**
    * Check if the room exists.
    */
    public checkExistRoom(ruid: string): boolean {
        if (this.isExistRoom(ruid)) return true;
        else return false;
    }

    /**
    * Open new room.
    */
    public async openNewRoom(ruid: string, hostConfig: BrowserHostConfig) {
        if (this.isExistRoom(ruid)) {
            throw Error(`The room '${ruid}' is already exist.`);
        } else {
            winstonLogger.info(`[core] New game room '${ruid}' will be opened.`);
            await this.createPage(ruid, hostConfig);
        }
    }

    /**
    * Close the room.
    */
    public async closeRoom(ruid: string) {
        if (this.isExistRoom(ruid)) {
            winstonLogger.info(`[core] The game room '${ruid}' will be closed.`);
            await this.closePage(ruid);
        } else {
            throw Error(`The room '${ruid}' is not exist.`);
        }
    }

    /**
    * Get a link of the game room.
    */
    public async getRoomLink(ruid: string): Promise<string> {
        if (this.isExistRoom(ruid)) {
            return await this.fetchRoomURILink(ruid);
        } else {
            throw Error(`The room '${ruid}' is not exist.`);
        }
    }
}
