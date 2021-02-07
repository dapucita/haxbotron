import { Context } from "koa";
import axios from "axios";

interface BanList {
    uid: number
    ruid: string
    conn: string
    reason: string
    register: number
    expire: number
}

interface BanListItem {
    conn: string; 
    reason: string;
    register: number;
    expire: number;
}

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
    let apiPath: string = (start && count)?  `${dbConnAddr}room/${ruid}/banlist?start=${start}&count=${count}`: `${dbConnAddr}room/${ruid}/banlist`;
    
    try {
        const getRes = await client.get(apiPath)
        .then((response) => {
            return response.data as BanList[];
        })
        .catch((error) => {
            throw(error.response.status || 500);
        });
        const banListItems: BanListItem[] = [];
        getRes.forEach((item: BanList) => {
            banListItems.push({
                conn: item.conn,
                reason: item.reason,
                register: item.register,
                expire: item.expire
            });
        });
        ctx.body = banListItems;
        ctx.status = 200;
    } catch (error) {
        ctx.status = error;
    }
}

export async function getBanInfo(ctx: Context) {
    const { ruid, conn } = ctx.params;

    try {
        const getRes = await client.get(`${dbConnAddr}room/${ruid}/banlist/${conn}`)
        .then((response) => {
            return response.data as BanList;
        })
        .catch((error) => {
            throw(error.response.status || 500);
        });
        ctx.body = { conn: getRes.conn, reason: getRes.reason, register: getRes.register, expire: getRes.expire} as BanListItem;
        ctx.status = 200;
    } catch (error) {
        ctx.status = error;
    }
}

export async function banPlayer(ctx: Context) {
    const { ruid } = ctx.params;
    const { conn, reason, seconds } = ctx.request.body;

    if(!conn || !reason || !seconds) {
        ctx.status = 400; // Unfulfilled error
        return;
    }

    const nowTimeStamp: number = Math.floor(Date.now());
    const submitItem: BanListItem = {
        conn: conn,
        reason: reason,
        register: nowTimeStamp,
        expire: nowTimeStamp + (seconds*1000)
    }

    try {
        await client.post(`${dbConnAddr}room/${ruid}/banlist`, submitItem);
        ctx.status = 204;
    } catch (error) {
        ctx.status = error.response.status || 500;
    }
}

export async function unbanPlayer(ctx: Context) {
    const { ruid, conn } = ctx.params;
    try {
        await client.delete(`${dbConnAddr}room/${ruid}/banlist/${conn}`);
        ctx.status = 204;
    } catch (error) {
        ctx.status = error.response.status || 500;
    }
}