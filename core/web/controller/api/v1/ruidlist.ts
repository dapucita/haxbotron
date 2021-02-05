import { Context } from "koa";
import axios from "axios";

interface ruidListItem {
    ruid: string
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
    try {
        const getRes = await client.get(`${dbConnAddr}ruidlist`)
        .then((response) => {
            return response.data as ruidListItem[];
        })
        .catch((error) => {
            throw(error.response.status || 500);
        });
        ctx.body = getRes;
        ctx.status = 200;
    } catch (error) {
        ctx.status = error;
    }
}
