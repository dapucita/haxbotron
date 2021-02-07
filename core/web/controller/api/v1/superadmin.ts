import { Context } from "koa";
import axios from "axios";

interface IGivenSuperAdminKey {
    uid: number
    ruid: string
    key: string
    description: string
}
interface ISuperAdminKey {
    key: string
    description: string
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

    let apiPath: string = (start && count)?  `${dbConnAddr}room/${ruid}/superadmin?start=${start}&count=${count}`: `${dbConnAddr}room/${ruid}/superadmin`;

    try {
        const getRes = await client.get(apiPath)
        .then((response) => {
            return response.data as IGivenSuperAdminKey[];
        })
        .catch((error) => {
            throw(error.response.status || 500);
        });
        const superAdminKeys: ISuperAdminKey[] = [];
        getRes.forEach((item: IGivenSuperAdminKey) => {
            superAdminKeys.push({
                key: item.key,
                description: item.description
            });
        });
        ctx.body = superAdminKeys;
        ctx.status = 200;
    } catch (error) {
        ctx.status = error;
    }
}

export async function registerKey(ctx: Context) {
    const { ruid } = ctx.params;
    const { key, description } = ctx.request.body;
    if(!key || !description) {
        ctx.status = 400; // Unfulfilled error
        return;
    }
    try {
        await client.post(`${dbConnAddr}room/${ruid}/superadmin`, {
            key: key
            ,description: description
        });
        ctx.status = 204;
    } catch (error) {
        ctx.status = error.response.status || 500;
    }
}

export async function deleteKey(ctx: Context) {
    const { ruid, key } = ctx.params;
    try {
        await client.delete(`${dbConnAddr}room/${ruid}/superadmin/${key}`);
        ctx.status = 204;
    } catch (error) {
        ctx.status = error.response.status || 500;
    }
}
