import { Context } from "koa";
import axios from "axios";

interface PlayerStorageList {
    uid: number;
    ruid: string;
    auth: string;
    conn: string;
    name: string;
    rating: number;
    totals: number;
    disconns: number;
    wins: number;
    goals: number;
    assists: number;
    ogs: number;
    losePoints: number;
    balltouch: number;
    passed: number;
    mute: boolean;
    muteExpire: number;
    rejoinCount: number;
    joinDate: number;
    leftDate: number;
    malActCount: number;
}

type PlayerStorage = Omit<PlayerStorageList, "uid"|"ruid">;

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

const client = axios.create();

axios.defaults.withCredentials = true;

export async function getAllList(ctx: Context) {
    const { ruid } = ctx.params;
    const { start, count } = ctx.request.query;
    let apiPath: string = (start && count)?  `${dbConnAddr}room/${ruid}/player?start=${start}&count=${count}`: `${dbConnAddr}room/${ruid}/player`;
    
    try {
        const getRes = await client.get(apiPath)
        .then((response) => {
            return response.data as PlayerStorageList[];
        })
        .catch((error) => {
            throw(error.response.status || 500);
        });
        const playerList: PlayerStorage[] = [];
        getRes.forEach((item: PlayerStorageList) => {
            const { uid, ruid, ...rest} = item
            playerList.push(rest);
        });
        ctx.body = playerList;
        ctx.status = 200;
    } catch (error) {
        ctx.status = error;
    }
}

export async function getPlayerInfo(ctx: Context) {
    const { ruid, auth } = ctx.params;

    try {
        const getRes = await client.get(`${dbConnAddr}room/${ruid}/player/${auth}`)
        .then((response) => {
            return response.data as PlayerStorageList;
        })
        .catch((error) => {
            throw(error.response.status || 500);
        });
        
        const playerInfo: PlayerStorage = ((res) => {
            const { uid, ruid, ...rest} = res;
            return rest;
        })(getRes);

        ctx.body = playerInfo
        ctx.status = 200;
    } catch (error) {
        ctx.status = error;
    }
}
