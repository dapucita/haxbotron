import express, { Request, Response, Router, NextFunction } from "express";
import { playerRouter } from "./v1.player.router";
import { banlistRouter } from "./v1.banlist.router";
import { superadminRouter } from "./v1.superadmin.router";
import cors from "cors";

export const apiRouterV1: Router = express.Router({ mergeParams: true });

apiRouterV1.use(cors()); // CORS '*' : allow all cuz IP Whitelist is enabled

apiRouterV1.use('/:ruid/player', playerRouter);
apiRouterV1.use('/:ruid/banlist', banlistRouter);
apiRouterV1.use('/:ruid/superadmin', superadminRouter);
