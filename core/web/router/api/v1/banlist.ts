import Router from "koa-router";
import * as banlistController from '../../../controller/api/v1/banlist';
import { checkLoginMiddleware } from "../../../lib/logincheck.middleware";

export const banlistRouter = new Router();

banlistRouter.get('/:ruid', checkLoginMiddleware, banlistController.getAllList); // get all exist banlist from DB server
banlistRouter.get('/:ruid/:conn', checkLoginMiddleware, banlistController.getBanInfo); // get ban info from DB server
banlistRouter.post('/:ruid', checkLoginMiddleware, banlistController.banPlayer); // register new ban to DB server
banlistRouter.delete('/:ruid/:conn', checkLoginMiddleware, banlistController.unbanPlayer); // delete ban from DB server
