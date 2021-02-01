import Router from "koa-router";
import * as roomController from '../../../controller/api/v1/room';
import { checkLoginMiddleware } from "../../../lib/logincheck.middleware";

export const roomRouter = new Router();

roomRouter.get('/', checkLoginMiddleware, roomController.getRoomList); // get room list

roomRouter.post('/', checkLoginMiddleware, roomController.createRoom); // create room

roomRouter.get('/:ruid', checkLoginMiddleware, roomController.getRoomInfo); // get room info

roomRouter.delete('/:ruid', checkLoginMiddleware, roomController.terminateRoom); // create room

roomRouter.get('/:ruid/player', checkLoginMiddleware, roomController.getPlayersList); // get player list

roomRouter.get('/:ruid/player/:id', checkLoginMiddleware, roomController.getPlayerInfo); // get player info

/*
POST /:ruid/chat broadcast
*/