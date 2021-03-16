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
import axios from "axios";
import { createServer as HTTPcreateServer } from "http";
import { Server as SIOserver, Socket as SIOsocket } from "socket.io";
import { winstonLogger } from "./winstonLoggerSystem";
import { indexAPIRouter } from "./web/router/api/v1";
import { jwtMiddleware, jwtMiddlewareWS } from "./web/lib/jwt.middleware";
import { HeadlessBrowser } from "./lib/browser";
// ========================================================
const app = new Koa(); // koa server
const router = new Router();
const server = HTTPcreateServer(app.callback());

const sio = new SIOserver(server, { path:'/ws', transports: ['websocket'] }); // socket.io server
const browser = HeadlessBrowser.getInstance(); // puppeteer wrapper instance

const coreServerSettings = {
    port: (process.env.SERVER_PORT ? parseInt(JSON.parse(process.env.SERVER_PORT)) : 12001)
    , level: (process.env.SERVER_LEVEL || 'common')
}
const buildOutputDirectory = path.resolve(__dirname, "../public");
const whiteListIPs: string[] = process.env.SERVER_WHITELIST_IP?.split(",") || ['127.0.0.1'];

nodeStorage.init();

browser.attachSIOserver(sio);

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
        if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0 && ctx.path.indexOf('/ws') !== 0) {
            await send(ctx, "index.html", { root: buildOutputDirectory });
        }
    }));

sio.on('connection', (socket: SIOsocket) => {
    /*
    console.log('ws connected');
    
    socket.on('ping', (msg: string) => {
        console.log('ws message: ' + msg);
        sio.emit('ping', 'ping from server');
    });
    socket.on('disconnect', () => {
        console.log('ws user disconnected');
    });
    */
})
sio.use((socket, next) => jwtMiddlewareWS(socket, next));

server
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
