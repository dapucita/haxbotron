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
roomRouter.delete('/:ruid/player/:id', checkLoginMiddleware, roomController.kickOnlinePlayer); // kick/ban player info

roomRouter.post('/:ruid/chat', checkLoginMiddleware, roomController.broadcast); // send message to game room
roomRouter.post('/:ruid/chat/:id', checkLoginMiddleware, roomController.whisper); // send message to specific player

roomRouter.get('/:ruid/info', checkLoginMiddleware, roomController.getRoomDetailInfo); // get detail room info

roomRouter.post('/:ruid/info/password', checkLoginMiddleware, roomController.setPassword); // set password
roomRouter.delete('/:ruid/info/password', checkLoginMiddleware, roomController.clearPassword); // clear password

roomRouter.get('/:ruid/social/notice', checkLoginMiddleware, roomController.getNotice); // get notice message
roomRouter.post('/:ruid/social/notice', checkLoginMiddleware, roomController.setNotice); // set notice message
roomRouter.delete('/:ruid/social/notice', checkLoginMiddleware, roomController.deleteNotice); // delete notice message

roomRouter.get('/:ruid/filter/nickname', checkLoginMiddleware, roomController.getNicknameTextFilteringPool); // get banned words pool for chat filter
roomRouter.get('/:ruid/filter/chat', checkLoginMiddleware, roomController.getChatTextFilteringPool); // get banned words pool for nickname filter
roomRouter.post('/:ruid/filter/nickname', checkLoginMiddleware, roomController.setNicknameTextFilter); // set banned words pool for chat filter
roomRouter.post('/:ruid/filter/chat', checkLoginMiddleware, roomController.setChatTextFilter); // set banned words pool for nickname filter
roomRouter.delete('/:ruid/filter/nickname', checkLoginMiddleware, roomController.clearNicknameTextFilter); // clear banned words pool for chat filter
roomRouter.delete('/:ruid/filter/chat', checkLoginMiddleware, roomController.clearChatTextFilter); // clear banned words pool for nickname filter
