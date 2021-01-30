// ========================================================
// Haxbotron Headless Host Server for Haxball by dapucita
// https://github.com/dapucita/haxbotron
// ========================================================
import "dotenv/config";
import Koa, { Context } from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import ip from "koa-ip";
import logger from "koa-logger";
import serve from "koa-static";
import send from "koa-send";
import path from "path";
import nodeStorage from "node-persist";
import { winstonLogger } from "./winstonLoggerSystem";
import { indexAPIRouter } from "./web/router/api/v1";
import { jwtMiddleware } from "./web/lib/jwt.middleware";
import { HeadlessBrowser } from "./lib/browser";
import axios from "axios";
// ========================================================
const app = new Koa();
const router = new Router();
const browser = HeadlessBrowser.getInstance();

const coreServerSettings = {
    port: (process.env.SERVER_PORT ? parseInt(JSON.parse(process.env.SERVER_PORT)) : 12001)
    , level: (process.env.SERVER_LEVEL || 'common')
}
const buildOutputDirectory = path.resolve(__dirname, "../public");
const whiteListIPs: string[] = process.env.SERVER_WHITELIST_IP?.split(",") || ['127.0.0.1'];

/*
if (process.env.TWEAKS_GEOLOCATIONOVERRIDE && JSON.parse(process.env.TWEAKS_GEOLOCATIONOVERRIDE.toLowerCase()) === true) {
    hostRoomConfig.geo = {
        code: process.env.TWEAKS_GEOLOCATIONOVERRIDE_CODE || "KR"
        , lat: parseFloat(process.env.TWEAKS_GEOLOCATIONOVERRIDE_LAT || "37.5665")
        , lon: parseFloat(process.env.TWEAKS_GEOLOCATIONOVERRIDE_LON || "126.978")
    }
}
*/

nodeStorage.init();

// ========================================================
router
    //.use('/', indexRouter.routes())
    //.use('/install', installRouter.routes())
    .use('/api/v1', indexAPIRouter.routes());

app
    .use(ip(whiteListIPs))
    .use(logger())
    .use(bodyParser())
    .use(jwtMiddleware)
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve(buildOutputDirectory))
    .use((async (ctx: Context) => {
        if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
            await send(ctx, "index.html", { root: buildOutputDirectory });
        }
    }));

app
    .listen(coreServerSettings.port, async () => {
        const _GitHublastestRelease = await axios.get('https://api.github.com/repos/dapucita/haxbotron/releases/latest');
        console.log("_|    _|                      _|                    _|                                  "+"\n"+
                    "_|    _|    _|_|_|  _|    _|  _|_|_|      _|_|    _|_|_|_|  _|  _|_|    _|_|    _|_|_|  "+"\n"+
                    "_|_|_|_|  _|    _|    _|_|    _|    _|  _|    _|    _|      _|_|      _|    _|  _|    _|"+"\n"+
                    "_|    _|  _|    _|  _|    _|  _|    _|  _|    _|    _|      _|        _|    _|  _|    _|"+"\n"+
                    "_|    _|    _|_|_|  _|    _|  _|_|_|      _|_|        _|_|  _|          _|_|    _|    _|");
        console.log(`Lastest Version : ${_GitHublastestRelease.data.tag_name} | Current Version : v${process.env.npm_package_version}`);
        console.log(`Haxbotron by dapucita (Visit our GitHub : https://github.com/dapucita/haxbotron)`);
        winstonLogger.info(`[core] Haxbotron core server is opened at ${coreServerSettings.port} port.`);
        winstonLogger.info(`[core] IP Whitelist : ${whiteListIPs}`);
    });
