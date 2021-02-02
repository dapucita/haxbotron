import puppeteer from "puppeteer";
import { Player } from "../game/model/GameObject/Player";
import { winstonLogger } from "../winstonLoggerSystem";
import { BrowserHostRoomInitConfig } from "./browser.hostconfig";
import * as dbUtilityInject from "./db.injection";
import { loadStadiumData } from "./stadiumLoader";
import { Server as SIOserver, Socket as SIOsocket } from "socket.io";

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
    private _SIOserver: SIOserver | undefined;


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
            //this.instance.initBrowser();
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

        //winstonLogger.info("[core] The browser is opened.");
        
        this._BrowserContainer = await puppeteer.launch({ headless: browserSettings.openHeadless, args: browserSettings.customArgs });

        this._BrowserContainer.on('disconnected', () => {
            //winstonLogger.info("[core] The browser is closed. Core server will open new one automatically.");
            winstonLogger.info("[core] The browser is closed.");
            this._BrowserContainer!.close();
            this._BrowserContainer = undefined;
            //this.initBrowser();
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
    private async createPage(ruid: string, initConfig: BrowserHostRoomInitConfig): Promise<puppeteer.Page> {
        if (process.env.TWEAKS_GEOLOCATIONOVERRIDE && JSON.parse(process.env.TWEAKS_GEOLOCATIONOVERRIDE.toLowerCase()) === true) {
            initConfig._config.geo = {
                code: process.env.TWEAKS_GEOLOCATIONOVERRIDE_CODE || "KR"
                , lat: parseFloat(process.env.TWEAKS_GEOLOCATIONOVERRIDE_LAT || "37.5665")
                , lon: parseFloat(process.env.TWEAKS_GEOLOCATIONOVERRIDE_LON || "126.978")
            }
        }

        if(!this._BrowserContainer) await this.initBrowser(); // open if browser isn't exist.

        const page: puppeteer.Page = await this._BrowserContainer!.newPage(); // create new page(tab)

        const existPages = await this._BrowserContainer?.pages(); // get exist pages for check if first blank page is exist
        if(existPages?.length == 2 && this._PageContainer.size == 0) existPages[0].close(); // close useless blank page
        


        page.on('console', (msg: any) => {
            switch (msg.type()) {
                case "log": {
                    winstonLogger.info(`[${ruid}] ${msg.text()}`);
                    break;
                }
                case "info": {
                    winstonLogger.info(`[${ruid}] ${msg.text()}`);
                    break;
                }
                case "error": {
                    winstonLogger.error(`[${ruid}] ${msg.text()}`);
                    break;
                }
                case "warning": {
                    winstonLogger.warn(`[${ruid}] ${msg.text()}`);
                    break;
                }
                default: {
                    winstonLogger.info(`[${ruid}] ${msg.text()}`);
                    break;
                }
            }
        });
        page.on('pageerror', (msg: any) => {
            winstonLogger.error(`[${ruid}] ${msg}`);
        });
        page.on('requestfailed', (msg: any) => {
            winstonLogger.error(`[${ruid}] ${msg.failure().errorText} ${msg.url()}`);
        });
        page.on('close', () => {
            winstonLogger.info(`[core] The page for the game room '${ruid}' is closed.`);
        });

        await page.goto('https://www.haxball.com/headless', {
            waitUntil: 'networkidle2'
        });

        // convey configuration values via html5 localStorage
        await page.evaluate((initConfig: string, defaultMap: string, readyMap: string) => {
            localStorage.setItem('_initConfig', initConfig);
            localStorage.setItem('_defaultMap', defaultMap);
            localStorage.setItem('_readyMap', readyMap);
        }, JSON.stringify(initConfig), loadStadiumData(initConfig.rules.defaultMapName), loadStadiumData(initConfig.rules.readyMapName));
        
        // add event listeners ============================================================
        page.addListener('_SIO.Log', (event: any) => {
            this._SIOserver?.sockets.emit('log', { ruid: ruid, origin: event.origin, type: event.type, message: event.message });
        });
        page.addListener('_SIO.InOut', (event: any) => {
            this._SIOserver?.sockets.emit('joinleft', { ruid: ruid, playerID: event.playerID });
        });
        // ================================================================================

        // ================================================================================
        // inject some functions ==========================================================
        await page.exposeFunction('_emitSIOLogEvent', (origin: string, type: string, message: string) => {
            page.emit('_SIO.Log', {origin: origin, type: type, message: message});
        })
        await page.exposeFunction('_emitSIOPlayerInOutEvent', (playerID: number) => {
            page.emit('_SIO.InOut', { playerID: playerID });
        })
        
        // inject functions for CRUD with DB Server ====================================
        await page.exposeFunction('_createSuperadminDB', dbUtilityInject.createSuperadminDB);
        await page.exposeFunction('_readSuperadminDB', dbUtilityInject.readSuperadminDB);
        //await page.exposeFunction('updateSuperadminDB', dbUtilityInject.updateSuperadminDB); //this function is not implemented.
        await page.exposeFunction('_deleteSuperadminDB', dbUtilityInject.deleteSuperadminDB);

        await page.exposeFunction('_createPlayerDB', dbUtilityInject.createPlayerDB);
        await page.exposeFunction('_readPlayerDB', dbUtilityInject.readPlayerDB);
        await page.exposeFunction('_updatePlayerDB', dbUtilityInject.updatePlayerDB);
        await page.exposeFunction('_deletePlayerDB', dbUtilityInject.deletePlayerDB);

        await page.exposeFunction('_createBanlistDB', dbUtilityInject.createBanlistDB);
        await page.exposeFunction('_readBanlistDB', dbUtilityInject.readBanlistDB);
        await page.exposeFunction('_updateBanlistDB', dbUtilityInject.updateBanlistDB);
        await page.exposeFunction('_deleteBanlistDB', dbUtilityInject.deleteBanlistDB);
        // ================================================================================

        await page.addScriptTag({ // add and load bot script
            path: './out/bot_bundle.js'
        });

        this._PageContainer.set(ruid, page) // save container
        return this._PageContainer.get(ruid)! // return container for support chaining
    }

    /**
    * Get URI link of the room.
    */
    private async fetchRoomURILink(ruid: string): Promise<string> {
        await this._PageContainer.get(ruid)!.waitForFunction(() => window.gameRoom.link !== undefined);
            
        let link: string = await this._PageContainer.get(ruid)!.evaluate(() => {
            return window.gameRoom.link;
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
     * Attach SIO server reference.
     */
    public attachSIOserver(server: SIOserver) {
        //console.log('attached SIO server.' + server);
        this._SIOserver = server;
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
    public async openNewRoom(ruid: string, initHostRoomConfig: BrowserHostRoomInitConfig) {
        if (this.isExistRoom(ruid)) {
            throw Error(`The room '${ruid}' is already exist.`);
        } else {
            winstonLogger.info(`[core] New game room '${ruid}' will be opened.`);
            await this.createPage(ruid, initHostRoomConfig);
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

    /**
    * Get how many game rooms are exist.
    */
    public getExistRoomNumber(): number {
        return this._PageContainer.size;
    }

    /**
    * Get all list of exist game rooms.
    */
    public getExistRoomList(): string[] {
        return Array.from(this._PageContainer.keys());
    }

    /**
     * Get the game room's information.
     * @param ruid Game room's RUID
     */
    public async getRoomInfo(ruid: string) {
        if (this.isExistRoom(ruid)) {
            return await this._PageContainer.get(ruid)!.evaluate(() => {
                return {
                    roomName: window.gameRoom.config._config.roomName,
                    onlinePlayers: window.gameRoom.playerList.size
                }
            });
        } else {
            throw Error(`The room '${ruid}' is not exist.`);
        }
    }

    /**
     * Get all ID list of players joinned.
     */
    public async getOnlinePlayersIDList(ruid: string): Promise<number[]> {
        return await this._PageContainer.get(ruid)!.evaluate(() => {
            return Array.from(window.gameRoom.playerList.keys());
        });
    }

    /**
     * Get Player's Information
     */
    public async getPlayerInfo(ruid: string, id: number): Promise<Player | undefined> {
        return await this._PageContainer.get(ruid)!.evaluate((id: number) => {
            //let idNum: number = parseInt(id);
            if(window.gameRoom.playerList.has(id)) {
                return window.gameRoom.playerList.get(id);
            } else {
                return undefined;
            }
        }, id);
    }

    /**
     * Broadcast text message
     */
    public async broadcast(ruid: string, message: string): Promise<void> {
        await this._PageContainer.get(ruid)?.evaluate((message: string) => {
            window.gameRoom._room.sendAnnouncement(message, null, 0xFFFF00, "bold", 2);
        }, message);
    }
}
