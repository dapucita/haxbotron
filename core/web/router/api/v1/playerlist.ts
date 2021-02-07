import Router from "koa-router";
import * as playerlistController from '../../../controller/api/v1/playerlist';
import { checkLoginMiddleware } from "../../../lib/logincheck.middleware";

export const playerlistRouter = new Router();

playerlistRouter.get('/:ruid', checkLoginMiddleware, playerlistController.getAllList); // get all exist playerlist from DB server
playerlistRouter.get('/:ruid/:auth', checkLoginMiddleware, playerlistController.getPlayerInfo); // get player info from DB server