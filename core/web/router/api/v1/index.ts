import Router from "koa-router";
import cors from "@koa/cors";
import { authRouter } from "./auth";
import { roomRouter } from "./room";
import { initRouter } from "./init";
import { systemRouter } from "./system";
import { superadminRouter } from "./superadmin";

export const indexAPIRouter = new Router();

indexAPIRouter
    .use(cors({
            origin: process.env.CLIENT_HOST,
            credentials: true,
        }))
    .use('/room', roomRouter.routes())
    .use('/auth', authRouter.routes())
    .use('/init', initRouter.routes())
    .use('/superadmin', superadminRouter.routes())
    .use('/system', systemRouter.routes());
