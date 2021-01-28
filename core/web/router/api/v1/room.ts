import Router from "koa-router";
import * as roomController from '../../../controller/api/v1/room';
import { checkLoginMiddleware } from "../../../lib/logincheck.middleware";

export const roomRouter = new Router();

roomRouter.get('/', checkLoginMiddleware, roomController.getRoomList); // get room list

roomRouter.post('/', checkLoginMiddleware, roomController.createRoom); // create room

roomRouter.delete('/:ruid', checkLoginMiddleware, roomController.createRoom); // create room
