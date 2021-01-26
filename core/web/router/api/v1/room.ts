import { Context, Next } from "koa";
import Router from "koa-router";
import { checkLoginMiddleware } from "../../../lib/logincheck.middleware";

export const roomRouter = new Router();

// get room list
roomRouter
    .get('/', checkLoginMiddleware, (ctx: Context, next: Next) => {
        ctx.body = "ROOM GET";
    });

// get specific room info
roomRouter
    .get('/:ruid', checkLoginMiddleware, (ctx: Context, next: Next) => {
        const { ruid } = ctx.params;
        ctx.body = `ROOM GET ${ruid}`;
    });

// open new room
//roomRouter.post('/');

// close specific room
//roomRouter.delete('/:ruid');