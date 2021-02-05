import axios from "axios";
import { Context, Next } from "koa";
import Router from "koa-router";
import { checkLoginMiddleware } from "../../../lib/logincheck.middleware";

export const systemRouter = new Router();

// get system information
systemRouter.get('/', checkLoginMiddleware, async (ctx: Context, next: Next) => {
    ctx.body = {
        usedMemoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100
        ,upTimeSecs: Math.round(process.uptime())
        ,serverVersion: process.env.npm_package_version || '0.0'
    }
    ctx.status = 200; // return success code
});
