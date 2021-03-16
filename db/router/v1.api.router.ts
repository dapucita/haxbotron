import Router from "koa-router";
import cors from "@koa/cors";
import { playerRouter } from "./v1.player.router";
import { banlistRouter } from "./v1.banlist.router";
import { superadminRouter } from "./v1.superadmin.router";
import { ruidlistRouter } from "./v1.ruidlist.router";

export const apiRouterV1 = new Router();

apiRouterV1
    .use(cors({
            origin: process.env.CLIENT_HOST, // Access-Control-Allow-Origin
            credentials: true, // Access-Control-Allow-Credentials
        }))
    .use('/ruidlist', ruidlistRouter.routes())
    .use('/room/:ruid/player', playerRouter.routes())
    .use('/room/:ruid/banlist', banlistRouter.routes())
    .use('/room/:ruid/superadmin', superadminRouter.routes());
