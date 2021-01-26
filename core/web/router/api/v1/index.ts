import Router from "koa-router";
import cors from "@koa/cors";
import { authRouter } from "./auth";
import { roomRouter } from "./room";
import { initRouter } from "./init";

export const indexAPIRouter = new Router();

indexAPIRouter
    .use(cors()) // allow * cuz IP whitelist is enabled
    .use('/room', roomRouter.routes())
    .use('/auth', authRouter.routes())
    .use('/init', initRouter.routes());
