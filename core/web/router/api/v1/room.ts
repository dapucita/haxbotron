import { Context, Next } from "koa";
import Router from "koa-router";

export const roomRouter = new Router();

roomRouter
    .get('/', (ctx: Context, next: Next) => {
        ctx.body = "GET";
    });

roomRouter
    .get('/:ruid', (ctx: Context, next: Next) => {
        const { ruid } = ctx.params;
        ctx.body = "GET";
    });
