// ========================================================
// Haxbotron Headless Host Server for Haxball by dapucita
// https://github.com/dapucita/haxbotron
// ========================================================
import "dotenv/config";
import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import ip from "koa-ip";
import logger from "koa-logger";
import { winstonLogger } from "./winstonLoggerSystem";
import { indexRouter } from "./web/router/index";
import { installRouter } from "./web/router/install";
import nodeStorage from "node-persist";
import { indexAPIRouter } from "./web/router/api/v1";

// ========================================================
const app = new Koa();
const router = new Router();

const coreServerSettings = {
    port: (process.env.SERVER_PORT ? parseInt(JSON.parse(process.env.SERVER_PORT)) : 12001)
    ,level: (process.env.SERVER_LEVEL || 'common')
}

const whiteListIPs: string[] = process.env.SERVER_WHITELIST_IP?.split(",") || ['127.0.0.1'];

nodeStorage.init();

// ========================================================
router
    .use('/', indexRouter.routes())
    .use('/install', installRouter.routes())
    .use('/api/v1', indexAPIRouter.routes());

app
    .use(ip(whiteListIPs))
    .use(logger())
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app
    .listen(coreServerSettings.port, () => {
        winstonLogger.info(`[core] Haxbotron core server is opened at ${coreServerSettings.port} port.`);
        winstonLogger.info(`[core] IP Whitelist : ${whiteListIPs}`);
    });
