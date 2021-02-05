import express, { Router } from "express";
import cors from "cors";
import { playerRouter } from "./v1.player.router";
import { banlistRouter } from "./v1.banlist.router";
import { superadminRouter } from "./v1.superadmin.router";
import { ruidlistRouter } from "./v1.ruidlist.router";

export const apiRouterV1: Router = express.Router({ mergeParams: true });

apiRouterV1.use(cors({
    origin: true, // Access-Control-Allow-Origin
    credentials: true // Access-Control-Allow-Credentials
}));

apiRouterV1.use('/ruidlist', ruidlistRouter);

apiRouterV1.use('/room/:ruid/player', playerRouter);
apiRouterV1.use('/room/:ruid/banlist', banlistRouter);
apiRouterV1.use('/room/:ruid/superadmin', superadminRouter);
