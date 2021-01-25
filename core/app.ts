// ========================================================
// Haxbotron Headless Host Server for Haxball by dapucita
// https://github.com/dapucita/haxbotron
// ========================================================

import Koa, { Context, Next } from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";

import { indexRouter } from "./web/router/index";
import { roomRouter } from "./web/router/api/v1/room";

import * as nodeStorage from "node-persist";

// ========================================================
const app = new Koa();
const router = new Router();

nodeStorage.init();
// ========================================================

router
    .use('/', indexRouter.routes())
    .use('/api/v1', roomRouter.routes());

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app
    .listen(12001, () => {
        console.log(`haxbotron-db server is opened at 12001 port.`);
    });
