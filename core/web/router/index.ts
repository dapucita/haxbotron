import { Context, Next } from "koa";
import Router from "koa-router";

export const indexRouter = new Router();

indexRouter
    .get('/', (ctx: Context, next: Next) => {
        ctx.body = "powered by Haxbotron\nhttps://github.com/dapucita/haxbotron";
    });
