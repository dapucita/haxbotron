import "dotenv/config";
import axios from "axios";
import { PlayerStorage } from "../../model/GameObject/PlayerObject";
import { winstonLogger } from "../../winstonLoggerSystem";
import { BanList } from "../../model/PlayerBan/BanList";

// These functions will be injected into bot script on puppeteer

const dbConnAddr: string = (
    'http://'
    + ((process.env.SERVER_CONN_DB_HOST) ? (process.env.SERVER_CONN_DB_HOST) : ('127.0.0.1'))
    + ':'
    + ((process.env.SERVER_CONN_DB_PORT) ? (process.env.SERVER_CONN_DB_PORT) : ('13001'))
    + '/'
    + 'api/'
    + ((process.env.SERVER_CONN_DB_APIVER) ? (process.env.SERVER_CONN_DB_APIVER) : ('v1'))
    + '/'
);

export async function createSuperadminDB(ruid: string, key: string, description: string): Promise<void> {
    try {
        const result = await axios.post(dbConnAddr + ruid + '/' + 'superadmin', {key: key, description: description});
        if (result.status === 204 && result.data) {
            winstonLogger.info(`${result.status} Succeed on createSuperadminDB: Created. key(${key})`);
        }
    } catch(error) {
        if(error.response && error.response.status === 400) {
            winstonLogger.info(`${error.response.status} Failed on createSuperadminDB: Already exist. key(${key})`);
        } else {
            winstonLogger.error(`Error caught on createSuperadminDB: ${error}`);
        }
    }
}

export async function readSuperadminDB(ruid: string, key: string): Promise<string | undefined> {
    try {
        const result = await axios.get(dbConnAddr + ruid + '/' + 'superadmin' + key);
        if (result.status === 200 && result.data) {
            winstonLogger.info(`200 Succeed on readSuperadminDB: Read. key(${key})`);
            return result.data.description;
        }
    } catch (error) {
        if(error.response && error.response.status === 404) {
            winstonLogger.info(`${error.response.status} Failed on readSuperadminDB: No exist. key(${key})`);
        } else {
            winstonLogger.error(`Error caught on readSuperadminDB: ${error}`);
        }
    }
}

//async function updateSuperadminDB is not implemented.

export async function deleteSuperadminDB(ruid: string, key: string): Promise<void> {
    try {
        const result = await axios.delete(dbConnAddr + ruid + '/' + 'superadmin' + key);
        if (result.status === 204) {
            winstonLogger.info(`${result.status} Succeed on deleteSuperadminDB: Deleted. key(${key})`);
        }
    } catch (error) {
        if(error.response && error.response.status === 404) {
            winstonLogger.info(`${error.response.status} Failed on deleteSuperadminDB: No exist. key(${key})`);
        } else {
            winstonLogger.error(`Error caught on deleteSuperadminDB: ${error}`);
        }
    }
}

export async function createBanlistDB(ruid: string, banList: BanList): Promise<void> {
    try {
        const result = await axios.post(dbConnAddr + ruid + '/' + 'banlist', banList);
        if (result.status === 204 && result.data) {
            winstonLogger.info(`${result.status} Succeed on createBanlistDB: Created. conn(${banList.conn})`);
        }
    } catch(error) {
        if(error.response && error.response.status === 400) {
            winstonLogger.info(`${error.response.status} Failed on createBanlistDB: Already exist. conn(${banList.conn})`);
        } else {
            winstonLogger.error(`Error caught on createBanlistDB: ${error}`);
        }
    }
}

export async function readBanlistDB(ruid: string, playerConn: string): Promise<BanList | undefined> {
    try {
        const result = await axios.get(dbConnAddr + ruid + '/' + 'banlist/' + playerConn);
        if (result.status === 200 && result.data) {
            const banlist: BanList = {
                conn: result.data.conn,
                reason: result.data.reason,
                register: result.data.register,
                expire: result.data.expire
            }
            winstonLogger.info(`200 Succeed on readBanlistDB: Read. onn(${playerConn})`);
            return banlist;
        }
    } catch (error) {
        if(error.response && error.response.status === 404) {
            winstonLogger.info(`${error.response.status} Failed on readBanlistDB: No exist. conn(${playerConn})`);
        } else {
            winstonLogger.error(`Error caught on readBanlistDB: ${error}`);
        }
    }
}

export async function updateBanlistDB(ruid: string, banList: BanList):Promise<void> {
    try {
        const result = await axios.put(dbConnAddr + ruid + '/' + 'banlist/' + banList.conn, banList);
        if (result.status === 204 && result.data) {
            winstonLogger.info(`${result.status} Succeed on updateBanlistDB: Updated. conn(${banList.conn})`);
        }
    } catch(error) {
        if(error.response && error.response.status === 404) {
            winstonLogger.info(`${error.response.status} Failed on updateBanlistDB: No Exist. conn(${banList.conn})`);
        } else {
            winstonLogger.error(`Error caught on updateBanlistDB: ${error}`);
        }
    }
}

export async function deleteBanlistDB(ruid: string, playerConn: string): Promise<void> {
    try {
        const result = await axios.delete(dbConnAddr + ruid + '/' + 'banlist/' + playerConn);
        if (result.status === 204) {
            winstonLogger.info(`${result.status} Succeed on deleteBanlistDB: Deleted. conn(${playerConn})`);
        }
    } catch (error) {
        if(error.response && error.response.status === 404) {
            winstonLogger.info(`${error.response.status} Failed on deleteBanlistDB: No exist. conn(${playerConn})`);
        } else {
            winstonLogger.error(`Error caught on deleteBanlistDB: ${error}`);
        }
    }
}

export async function createPlayerDB(ruid: string, player: PlayerStorage): Promise<void> {
    try {
        const result = await axios.post(dbConnAddr + ruid + '/' + 'player', player);
        if (result.status === 204 && result.data) {
            winstonLogger.info(`${result.status} Succeed on createPlayerDB: Created. auth(${player.auth})`);
        }
    } catch(error) {
        if(error.response && error.response.status === 400) {
            winstonLogger.info(`${error.response.status} Failed on createPlayerDB: Already exist. auth(${player.auth})`);
        } else {
            winstonLogger.error(`Error caught on createPlayerDB: ${error}`);
        }
    }
}

export async function readPlayerDB(ruid: string, playerAuth: string): Promise<PlayerStorage | undefined> {
    try {
        const result = await axios.get(dbConnAddr + ruid + '/' + 'player/' + playerAuth);
        if (result.status === 200 && result.data) {
            const player: PlayerStorage = {
                auth: result.data.auth,
                conn: result.data.conn,
                name: result.data.name,
                rating: result.data.rating,
                totals: result.data.totals,
                disconns: result.data.disconns,
                wins: result.data.wins,
                goals: result.data.goals,
                assists: result.data.assists,
                ogs: result.data.ogs,
                losePoints: result.data.losePoints,
                balltouch: result.data.balltouch,
                passed: result.data.passed,
                mute: result.data.mute,
                muteExpire: result.data.muteExpire,
                rejoinCount: result.data.rejoinCount,
                joinDate: result.data.joinDate,
                leftDate: result.data.leftDate,
                malActCount: result.data.malActCount
            }
            winstonLogger.info(`${result.status} Succeed on readPlayerDB: Read. auth(${playerAuth})`);
            return player;
        }
    } catch (error) {
        if(error.response && error.response.status === 404) {
            winstonLogger.info(`${error.response.status} Failed on readPlayerDB: No exist. auth(${playerAuth})`);
        } else {
            winstonLogger.error(`Error caught on readPlayerDB: ${error}`);
        }
    }
}

export async function updatePlayerDB(ruid: string, player: PlayerStorage): Promise<void> {
    try {
        const result = await axios.put(dbConnAddr + ruid + '/' + 'player/' + player.auth, player);
        if (result.status === 204 && result.data) {
            winstonLogger.info(`${result.status} Succeed on updatePlayerDB: Updated. auth(${player.auth})`);
        }
    } catch(error) {
        if(error.response && error.response.status === 404) {
            winstonLogger.info(`${error.response.status} Failed on updatePlayerDB: No exist. auth(${player.auth})`);
        } else {
            winstonLogger.error(`Error caught on updatePlayerDB: ${error}`);
        }
    }
}

export async function deletePlayerDB(ruid: string, playerAuth: string): Promise<void> {
    try {
        const result = await axios.delete(dbConnAddr + ruid + '/' + 'player/' + playerAuth);
        if (result.status === 204) {
            winstonLogger.info(`${result.status} Succeed on deletePlayerDB: Deleted. auth(${playerAuth})`);
        }
    } catch (error) {
        if(error.response && error.response.status === 404) {
            winstonLogger.info(`${error.response.status} Failed on deletePlayerDB: No exist. auth(${playerAuth})`);
        } else {
            winstonLogger.error(`Error caught on deletePlayerDB: ${error}`);
        }
    }
}
